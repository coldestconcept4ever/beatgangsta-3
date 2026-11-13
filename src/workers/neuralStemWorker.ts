/// <reference lib="webworker" />
import * as ort from 'onnxruntime-web/webgpu';
import asyncifyWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';

const resolvedAsyncifyWasm =
  typeof self !== 'undefined' && self.location?.origin
    ? new URL(asyncifyWasmUrl, self.location.origin).href
    : asyncifyWasmUrl;

ort.env.wasm.numThreads = 1;
ort.env.wasm.wasmPaths = { wasm: resolvedAsyncifyWasm };

const MODEL_REPO = 'kramp/htdemucs-6s-webgpu-onnx';
const MODEL_FILE = 'htdemucs_6s.onnx';
const MODEL_URL = `https://huggingface.co/${MODEL_REPO}/resolve/main/${MODEL_FILE}`;
const MODEL_CACHE_NAME = 'beatgangsta-htdemucs6s-v1';

// Fixed 7.8s stereo window @ 44.1 kHz matching htdemucs_6s.onnx contract:
// Input:  mix   [1, 2, 343980]
// Output: stems [1, 6, 2, 343980] => ['drums', 'bass', 'other', 'vocals', 'guitar', 'piano']
const N_SAMPLES = 343980;
const OVERLAP = Math.floor(N_SAMPLES / 4); // 85,995 samples (25% overlap)
const STRIDE = N_SAMPLES - OVERLAP;        // 257,985 samples
const SOURCES = ['drums', 'bass', 'other', 'vocals', 'guitar', 'piano'] as const;

let cachedSession: ort.InferenceSession | null = null;
let cachedBackend: 'webgpu' | 'wasm' = 'wasm';

function makeTrapezoidWindow(): Float32Array {
  const w = new Float32Array(N_SAMPLES);
  const d = OVERLAP - 1;
  for (let i = 0; i < N_SAMPLES; i++) {
    if (i < OVERLAP) {
      w[i] = i / d;
    } else if (i >= N_SAMPLES - OVERLAP) {
      w[i] = (N_SAMPLES - 1 - i) / d;
    } else {
      w[i] = 1;
    }
  }
  return w;
}

async function fetchModelWithCache(): Promise<ArrayBuffer> {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = { wasm: resolvedAsyncifyWasm };

  let cache: Cache | null = null;
  try {
    if (typeof caches !== 'undefined') {
      cache = await caches.open(MODEL_CACHE_NAME);
      const hit = await cache.match(MODEL_URL);
      if (hit) {
        self.postMessage({
          type: 'phase',
          pct: 18,
          label: 'Loaded HTDemucs 6-Stem Neural Model from local browser cache...'
        });
        const buf = await hit.arrayBuffer();
        if (buf.byteLength > 1024 * 1024) {
          return buf;
        }
      }
    }
  } catch {
    // Cache Storage unavailable in restricted/private mode — download directly
  }

  self.postMessage({
    type: 'phase',
    pct: 6,
    label: 'Downloading HTDemucs 6-Stem UVR/Neural Model (~272 MB, cached once)...'
  });

  const response = await fetch(MODEL_URL, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Failed to fetch HTDemucs 6-Stem model (HTTP ${response.status})`);
  }

  const contentLength = Number(response.headers.get('content-length') || '0');
  let buffer: ArrayBuffer;

  if (response.body) {
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    let lastEmit = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        loaded += value.byteLength;
        const now = Date.now();
        if (now - lastEmit > 150 || (contentLength > 0 && loaded >= contentLength)) {
          lastEmit = now;
          self.postMessage({
            type: 'download',
            loaded,
            total: contentLength,
          });
        }
      }
    }

    const combined = new Uint8Array(loaded);
    let offset = 0;
    for (const c of chunks) {
      combined.set(c, offset);
      offset += c.byteLength;
    }
    buffer = combined.buffer;
  } else {
    buffer = await response.arrayBuffer();
  }

  if (cache && buffer.byteLength > 1024 * 1024) {
    try {
      await cache.put(
        MODEL_URL,
        new Response(buffer.slice(0), {
          headers: { 'Content-Type': 'application/octet-stream' },
        })
      );
    } catch {
      // Cache quota exceeded — inference continues without persistence
    }
  }

  return buffer;
}

async function ensureSession(): Promise<{ session: ort.InferenceSession; backend: 'webgpu' | 'wasm' }> {
  if (cachedSession) {
    return { session: cachedSession, backend: cachedBackend };
  }

  const buffer = await fetchModelWithCache();

  self.postMessage({
    type: 'phase',
    pct: 24,
    label: 'Compiling HTDemucs 6-Stem Neural Graph (WebGPU / WASM)...'
  });

  // Model graph is pre-folded offline; disabling ORT graph re-optimization avoids extra RAM spikes
  const hasWebGpu = typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu;
  if (hasWebGpu) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) {
        cachedSession = await ort.InferenceSession.create(buffer, {
          executionProviders: ['webgpu', 'wasm'],
          graphOptimizationLevel: 'disabled',
        });
        cachedBackend = 'webgpu';
        return { session: cachedSession, backend: cachedBackend };
      }
    } catch (err) {
      console.warn('[NEURAL-STEM] WebGPU init fell back to WASM:', err);
    }
  }

  cachedSession = await ort.InferenceSession.create(buffer, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'disabled',
  });
  cachedBackend = 'wasm';
  return { session: cachedSession, backend: cachedBackend };
}

async function runSixStemInference(left: Float32Array, right: Float32Array) {
  const { session, backend } = await ensureSession();
  const totalSamples = left.length;
  const numSegments = Math.max(1, Math.ceil(Math.max(0, totalSamples - N_SAMPLES) / STRIDE) + 1);
  const window = makeTrapezoidWindow();

  const acc = SOURCES.map(() => ({
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
  }));
  const weights = new Float32Array(totalSamples);

  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];

  let segIdx = 0;
  for (let start = 0; start < totalSamples; start += STRIDE) {
    const end = Math.min(start + N_SAMPLES, totalSamples);
    const clen = end - start;

    const mix = new Float32Array(2 * N_SAMPLES);
    mix.set(left.subarray(start, end), 0);
    mix.set(right.subarray(start, end), N_SAMPLES);

    const inputTensor = new ort.Tensor('float32', mix, [1, 2, N_SAMPLES]);
    const results = await session.run({ [inputName]: inputTensor });
    const outTensor = results[outputName];
    const outData = outTensor.data as Float32Array;

    for (let s = 0; s < SOURCES.length; s++) {
      const baseL = (s * 2 + 0) * N_SAMPLES;
      const baseR = (s * 2 + 1) * N_SAMPLES;
      const dst = acc[s];
      for (let i = 0; i < clen && start + i < totalSamples; i++) {
        const w = window[i];
        dst.left[start + i] += outData[baseL + i] * w;
        dst.right[start + i] += outData[baseR + i] * w;
      }
    }

    try {
      inputTensor.dispose();
      outTensor.dispose();
    } catch {
      // Optional in some backends
    }

    for (let i = 0; i < clen && start + i < totalSamples; i++) {
      weights[start + i] += window[i];
    }

    segIdx++;
    self.postMessage({
      type: 'progress',
      currentSegment: segIdx,
      totalSegments: numSegments,
      backend,
    });

    if (end >= totalSamples) break;
  }

  for (let s = 0; s < SOURCES.length; s++) {
    const dst = acc[s];
    for (let i = 0; i < totalSamples; i++) {
      const w = weights[i];
      if (w > 1e-8) {
        dst.left[i] /= w;
        dst.right[i] /= w;
      }
    }
  }

  return {
    backend,
    stems: {
      drums: acc[0],
      bass: acc[1],
      other: acc[2],
      vocals: acc[3],
      guitar: acc[4],
      piano: acc[5],
    },
  };
}

self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;
  if (!msg || msg.type !== 'separate') return;

  try {
    const left = new Float32Array(msg.left);
    const right = new Float32Array(msg.right);
    const { backend, stems } = await runSixStemInference(left, right);

    const transfer: Transferable[] = [];
    for (const key of SOURCES) {
      transfer.push(stems[key].left.buffer, stems[key].right.buffer);
    }
    self.postMessage({ type: 'result', backend, stems }, transfer);
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      message: err?.message || String(err),
    });
  }
};
