import * as ort from 'onnxruntime-web';

export const NEURAL_MODEL_URL =
  'https://huggingface.co/kramp/htdemucs-6s-webgpu-onnx/resolve/main/htdemucs_6s.onnx';
export const NEURAL_CACHE_NAME = 'beatgangsta-htdemucs6s-v1';

export interface StereoTrackData {
  left: Float32Array;
  right: Float32Array;
}

export interface NeuralSixStemResult {
  backend: 'webgpu' | 'wasm';
  stems: {
    drums: StereoTrackData;
    bass: StereoTrackData;
    other: StereoTrackData;
    vocals: StereoTrackData;
    guitar: StereoTrackData;
    piano: StereoTrackData;
  };
}

export async function isNeuralModelCached(): Promise<boolean> {
  try {
    if (typeof caches === 'undefined') return false;
    const cache = await caches.open(NEURAL_CACHE_NAME);
    const hit = await cache.match(NEURAL_MODEL_URL);
    return Boolean(hit);
  } catch {
    return false;
  }
}

export async function hasWebGpuSupport(): Promise<boolean> {
  try {
    if (typeof navigator === 'undefined' || !('gpu' in navigator) || !(navigator as any).gpu) {
      return false;
    }
    const adapter = await (navigator as any).gpu.requestAdapter();
    return Boolean(adapter);
  } catch {
    return false;
  }
}

/**
 * Runs Meta HTDemucs 6-Stem ONNX separation inside a dedicated background Web Worker.
 * Automatically downloads & caches weights in browser CacheStorage on first run.
 */
export function runNeuralSixStemSeparation(
  left44k: Float32Array,
  right44k: Float32Array,
  onProgress?: (pct: number, label: string) => void
): { promise: Promise<NeuralSixStemResult>; terminate: () => void } {
  let worker: Worker | null = null;
  let settled = false;

  const terminate = () => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  };

  const promise = new Promise<NeuralSixStemResult>((resolve, reject) => {
    if (typeof Worker === 'undefined') {
      reject(new Error('Web Workers are not supported in this browser environment.'));
      return;
    }

    worker = new Worker(new URL('../workers/neuralStemWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'phase') {
        onProgress?.(data.pct, data.label);
      } else if (data.type === 'download') {
        const loadedMb = (data.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = data.total > 0 ? (data.total / (1024 * 1024)).toFixed(1) : '271.6';
        const frac = data.total > 0 ? data.loaded / data.total : 0;
        const pct = 6 + Math.round(frac * 18);
        onProgress?.(
          pct,
          `Downloading HTDemucs 6-Stem UVR/Neural Model (${loadedMb} / ${totalMb} MB, cached locally)...`
        );
      } else if (data.type === 'progress') {
        const frac = data.totalSegments > 0 ? data.currentSegment / data.totalSegments : 0;
        const pct = 28 + Math.round(frac * 54);
        const engineLabel = data.backend === 'webgpu' ? 'WebGPU' : 'WASM';
        onProgress?.(
          pct,
          `HTDemucs 6-Stem Neural Separation (${engineLabel}) — Segment ${data.currentSegment}/${data.totalSegments}...`
        );
      } else if (data.type === 'result') {
        settled = true;
        terminate();
        resolve({
          backend: data.backend,
          stems: {
            drums: { left: new Float32Array(data.stems.drums.left), right: new Float32Array(data.stems.drums.right) },
            bass: { left: new Float32Array(data.stems.bass.left), right: new Float32Array(data.stems.bass.right) },
            other: { left: new Float32Array(data.stems.other.left), right: new Float32Array(data.stems.other.right) },
            vocals: { left: new Float32Array(data.stems.vocals.left), right: new Float32Array(data.stems.vocals.right) },
            guitar: { left: new Float32Array(data.stems.guitar.left), right: new Float32Array(data.stems.guitar.right) },
            piano: { left: new Float32Array(data.stems.piano.left), right: new Float32Array(data.stems.piano.right) },
          },
        });
      } else if (data.type === 'error') {
        settled = true;
        terminate();
        reject(new Error(data.message || 'Neural ONNX worker failed'));
      }
    };

    worker.onerror = (err) => {
      if (!settled) {
        settled = true;
        terminate();
        reject(new Error(err?.message || 'Failed to launch HTDemucs Web Worker'));
      }
    };

    // Clone channel buffers cleanly before transferring ownership to worker
    const lCopy = new Float32Array(left44k);
    const rCopy = new Float32Array(right44k);
    worker.postMessage(
      { type: 'separate', left: lCopy.buffer, right: rCopy.buffer },
      [lCopy.buffer, rCopy.buffer]
    );
  });

  return { promise, terminate };
}

/**
 * Legacy single-buffer InferenceEngine helper kept for compatibility.
 */
export class InferenceEngine {
  private session: ort.InferenceSession | null = null;
  private isInitialized = false;

  constructor(private modelPath: string) {}

  async initialize(): Promise<boolean> {
    if (this.isInitialized && this.session) return true;
    try {
      if (typeof fetch !== 'function') return false;
      const headRes = await fetch(this.modelPath, { method: 'HEAD' });
      if (!headRes.ok) return false;
      const contentLen = Number(headRes.headers.get('content-length') || '0');
      if (contentLen > 0 && contentLen < 1024) {
        return false;
      }

      const modelRes = await fetch(this.modelPath);
      if (!modelRes.ok) return false;
      const buf = await modelRes.arrayBuffer();
      if (buf.byteLength < 1024) {
        return false;
      }

      this.session = await ort.InferenceSession.create(new Uint8Array(buf), {
        executionProviders: ['webgpu', 'wasm'],
      });
      this.isInitialized = true;
      return true;
    } catch {
      return false;
    }
  }
}
