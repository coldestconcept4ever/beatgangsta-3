// Client-Side STFT + 2D HPSS + Stereo Azimuth + KL-NMF Stem Separation Engine
// Architecture:
// 1. Exact COLA Radix-2 Cooley-Tukey STFT / ISTFT (2048 Fast / 4096 Deep, 75% Hann overlap)
// 2. 2D Spectrogram Harmonic-Percussive Source Separation (HPSS median filtering across time & frequency)
// 3. Complex Mid/Side Center-Coherence & Inter-Channel Stereo Azimuth Decomposition
// 4. 96-Band ERB KL-Divergence NMF Component Factorization (Deep Mode)
// 5. Two-Pass Competitive Wiener Soft-Masking (Partition of Unity) + Global Presence Pruning
// 6. Comb-Filter Tempogram Spectral-Flux BPM Estimation

import { repairStemArtifacts, RepairStemType } from './stemArtifactRepair';
import {
  InferenceEngine,
  NeuralSixStemResult,
  runNeuralSixStemSeparation,
} from './stemInference';

export type StemKey =
  | 'kick'
  | 'snare'
  | 'hihat'
  | 'openhat'
  | 'bass'
  | 'bassGuitar'
  | 'lead'
  | 'leadGuitar'
  | 'acousticGuitar'
  | 'piano'
  | 'pad'
  | 'vocal'
  | 'perc';

export const ALL_STEM_KEYS: StemKey[] = [
  'kick',
  'snare',
  'hihat',
  'openhat',
  'bass',
  'bassGuitar',
  'lead',
  'leadGuitar',
  'acousticGuitar',
  'piano',
  'pad',
  'vocal',
  'perc',
];

const STEREO_STEMS = new Set<StemKey>([
  'hihat',
  'openhat',
  'perc',
  'lead',
  'leadGuitar',
  'acousticGuitar',
  'piano',
  'pad',
]);

export interface StemDetectionInfo {
  detected: boolean;
  rmsDb: number;
  peakDb: number;
  mixSharePct: number;
  activePct: number;
}

export type SeparationEngineUsed =
  | 'neural-webgpu'
  | 'neural-wasm'
  | 'dsp-stft'
  | 'dsp-stft-fallback';

export interface IsolatedStems {
  kick: AudioBuffer;
  snare: AudioBuffer;
  hihat: AudioBuffer;
  openhat: AudioBuffer;
  bass: AudioBuffer;
  bassGuitar: AudioBuffer;
  lead: AudioBuffer;
  leadGuitar: AudioBuffer;
  acousticGuitar: AudioBuffer;
  piano: AudioBuffer;
  pad: AudioBuffer;
  vocal: AudioBuffer;
  perc: AudioBuffer;
  detectedBpm: number;
  detectedStems: Record<StemKey, StemDetectionInfo>;
  engineUsed: SeparationEngineUsed;
  fallbackReason?: string;
}

export interface RawSeparatedStemData {
  buffers: Record<StemKey, { left: Float32Array; right?: Float32Array }>;
  detectedBpm: number;
  detectedStems: Record<StemKey, StemDetectionInfo>;
}

const yieldToUI = () => new Promise<void>(resolve => setTimeout(resolve, 0));

async function resampleTo44100Stereo(
  audioBuffer: AudioBuffer
): Promise<{ left: Float32Array; right: Float32Array; sampleRate: number }> {
  const numChannels = audioBuffer.numberOfChannels;
  const srcL = audioBuffer.getChannelData(0);
  const srcR = numChannels > 1 ? audioBuffer.getChannelData(1) : srcL;

  if (audioBuffer.sampleRate === 44100) {
    return {
      left: new Float32Array(srcL),
      right: new Float32Array(srcR),
      sampleRate: 44100,
    };
  }

  const targetLen = Math.max(1, Math.round(audioBuffer.duration * 44100));
  const offline = new OfflineAudioContext(2, targetLen, 44100);
  const src = offline.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();
  return {
    left: new Float32Array(rendered.getChannelData(0)),
    right: new Float32Array(
      rendered.numberOfChannels > 1 ? rendered.getChannelData(1) : rendered.getChannelData(0)
    ),
    sampleRate: 44100,
  };
}

/**
 * Main Browser Entry Point:
 * - Deep Mode: Runs Meta HTDemucs 6-Stem UVR/Neural ONNX model via WebGPU/WASM Web Worker,
 *   then cleanly sub-splits neural stems (drums -> kick/snare/hihat/openhat/perc,
 *   other -> lead/pad, guitar -> leadGuitar/acousticGuitar, bass -> bass/bassGuitar).
 * - Fast Mode (or offline fallback): Runs pure local 2048/4096-pt STFT + 2D HPSS + KL-NMF DSP.
 */
export async function splitAudioBufferIntoStems(
  audioBuffer: AudioBuffer,
  onProgress?: (progress: number, label: string) => void,
  isDeepMode: boolean = true,
  onRegisterCancel?: (cancelFn: () => void) => void
): Promise<IsolatedStems> {
  let sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  let length = audioBuffer.length;

  let rawResult: RawSeparatedStemData;
  let engineUsed: SeparationEngineUsed = 'dsp-stft';
  let fallbackReason: string | undefined;

  if (isDeepMode && typeof window !== 'undefined' && typeof Worker !== 'undefined') {
    try {
      onProgress?.(4, 'Resampling mix cleanly to 44.1 kHz studio standard for HTDemucs 6-Stem...');
      await yieldToUI();
      const resampled = await resampleTo44100Stereo(audioBuffer);
      sampleRate = resampled.sampleRate;
      length = resampled.left.length;

      const job = runNeuralSixStemSeparation(resampled.left, resampled.right, onProgress);
      onRegisterCancel?.(job.terminate);
      const neural = await job.promise;

      engineUsed = neural.backend === 'webgpu' ? 'neural-webgpu' : 'neural-wasm';
      onProgress?.(85, 'Refining Neural Stems into Drums, Synth Leads, Pads & Guitars...');
      await yieldToUI();

      rawResult = await subSplitFromNeuralSixStems(
        neural.stems,
        resampled.left,
        resampled.right,
        44100,
        numChannels === 1
      );
    } catch (neuralErr: any) {
      fallbackReason = neuralErr?.message || 'Neural ONNX runtime unavailable';
      console.warn('[BEAT-GANGSTA NEURAL STEM] Falling back to Local STFT + KL-NMF DSP:', fallbackReason);
      onProgress?.(10, `Neural AI unavailable (${fallbackReason}). Running Local 4096-pt STFT + NMF...`);
      engineUsed = 'dsp-stft-fallback';
      const leftData = audioBuffer.getChannelData(0);
      const rightData = numChannels > 1 ? audioBuffer.getChannelData(1) : leftData;
      rawResult = await separateRawChannelsIntoStems(
        leftData,
        rightData,
        sampleRate,
        onProgress,
        true,
        numChannels === 1
      );
    }
  } else {
    if (isDeepMode && typeof window !== 'undefined') {
      const neuralEngine = new InferenceEngine('/models/stem_sep.onnx');
      await neuralEngine.initialize();
    }
    const leftData = audioBuffer.getChannelData(0);
    const rightData = numChannels > 1 ? audioBuffer.getChannelData(1) : leftData;
    rawResult = await separateRawChannelsIntoStems(
      leftData,
      rightData,
      sampleRate,
      onProgress,
      isDeepMode,
      numChannels === 1
    );
  }

  const bufferFactoryCtx =
    typeof window !== 'undefined'
      ? (window as any).__stemBufferFactoryCtx ||
        ((window as any).__stemBufferFactoryCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)())
      : null;

  function createMonoBuffer(data: Float32Array): AudioBuffer {
    if (bufferFactoryCtx?.createBuffer) {
      const buf = bufferFactoryCtx.createBuffer(1, length, sampleRate);
      buf.getChannelData(0).set(data);
      return buf;
    }
    const offline = new OfflineAudioContext(1, length, sampleRate);
    const buf = offline.createBuffer(1, length, sampleRate);
    buf.getChannelData(0).set(data);
    return buf;
  }

  function createStereoBuffer(left: Float32Array, right: Float32Array): AudioBuffer {
    if (bufferFactoryCtx?.createBuffer) {
      const buf = bufferFactoryCtx.createBuffer(2, length, sampleRate);
      buf.getChannelData(0).set(left);
      buf.getChannelData(1).set(right);
      return buf;
    }
    const offline = new OfflineAudioContext(2, length, sampleRate);
    const buf = offline.createBuffer(2, length, sampleRate);
    buf.getChannelData(0).set(left);
    buf.getChannelData(1).set(right);
    return buf;
  }

  const makeBuffer = (key: StemKey): AudioBuffer => {
    const entry = rawResult.buffers[key];
    if (STEREO_STEMS.has(key)) {
      return createStereoBuffer(entry.left, entry.right || entry.left);
    }
    return createMonoBuffer(entry.left);
  };

  onProgress?.(92, 'Phase 5: Phase-Safe Envelope Cleaning & True-Peak Protection...');
  await yieldToUI();

  const finalBuffers = {} as Record<StemKey, AudioBuffer>;
  const activeKeys = ALL_STEM_KEYS.filter(k => rawResult.detectedStems[k].detected);

  for (let idx = 0; idx < ALL_STEM_KEYS.length; idx++) {
    const key = ALL_STEM_KEYS[idx];
    const rawBuf = makeBuffer(key);
    if (rawResult.detectedStems[key].detected) {
      finalBuffers[key] = await repairStemArtifacts(rawBuf, key as RepairStemType);
    } else {
      finalBuffers[key] = rawBuf;
    }
    const pct = 92 + Math.round(((idx + 1) / ALL_STEM_KEYS.length) * 7);
    onProgress?.(pct, `Phase 5: Finalizing ${activeKeys.length} Active Stems...`);
    await yieldToUI();
  }

  console.groupCollapsed(
    '%c[BEAT-GANGSTA STEM SEPARATOR] Isolation & Presence Diagnostics',
    'color: #38bdf8; font-weight: bold; font-size: 13px; background: #0f172a; padding: 4px;'
  );
  console.log(
    `Audio: ${length} samples (${(length / sampleRate).toFixed(2)}s) @ ${sampleRate}Hz • Engine: ${engineUsed} • Active Stems: ${activeKeys.length}/13 • BPM: ${rawResult.detectedBpm}`
  );
  console.table(
    ALL_STEM_KEYS.map(k => ({
      Stem: k,
      Detected: rawResult.detectedStems[k].detected ? 'YES' : 'NO (Hidden)',
      'Peak dBFS': rawResult.detectedStems[k].peakDb.toFixed(1),
      'RMS dBFS': rawResult.detectedStems[k].rmsDb.toFixed(1),
      'Mix Share %': rawResult.detectedStems[k].mixSharePct.toFixed(2) + '%',
      'Active %': rawResult.detectedStems[k].activePct.toFixed(1) + '%',
    }))
  );
  console.groupEnd();

  onProgress?.(100, `Isolated ${activeKeys.length} Active Stems cleanly!`);

  return {
    ...finalBuffers,
    detectedBpm: rawResult.detectedBpm,
    detectedStems: rawResult.detectedStems,
    engineUsed,
    fallbackReason,
  };
}

// ============================================================================
// PURE DSP ENGINE (Zero DOM/WebAudio dependency -> testable in Node & Browser)
// ============================================================================

interface FFTContext {
  fftSize: number;
  hopSize: number;
  numBins: number;
  bitRev: Uint32Array;
  cosTable: Float32Array;
  sinTable: Float32Array;
  hann: Float32Array;
}

function createFFTContext(fftSize: number): FFTContext {
  const numBins = (fftSize >> 1) + 1;
  const bitRev = new Uint32Array(fftSize);
  const bits = Math.round(Math.log2(fftSize));
  for (let i = 0; i < fftSize; i++) {
    let rev = 0;
    let x = i;
    for (let b = 0; b < bits; b++) {
      rev = (rev << 1) | (x & 1);
      x >>= 1;
    }
    bitRev[i] = rev;
  }

  const half = fftSize >> 1;
  const cosTable = new Float32Array(half);
  const sinTable = new Float32Array(half);
  for (let i = 0; i < half; i++) {
    const angle = (-2 * Math.PI * i) / fftSize;
    cosTable[i] = Math.cos(angle);
    sinTable[i] = Math.sin(angle);
  }

  const hann = new Float32Array(fftSize);
  for (let n = 0; n < fftSize; n++) {
    hann[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / fftSize));
  }

  return {
    fftSize,
    hopSize: fftSize >> 2, // 75% overlap
    numBins,
    bitRev,
    cosTable,
    sinTable,
    hann,
  };
}

function fftInPlace(re: Float32Array, im: Float32Array, ctx: FFTContext, inverse: boolean = false) {
  const N = ctx.fftSize;
  const bitRev = ctx.bitRev;

  for (let i = 0; i < N; i++) {
    const j = bitRev[i];
    if (i < j) {
      const tr = re[i];
      re[i] = re[j];
      re[j] = tr;
      const ti = im[i];
      im[i] = im[j];
      im[j] = ti;
    }
  }

  const cosTable = ctx.cosTable;
  const sinTable = ctx.sinTable;
  const sign = inverse ? -1 : 1;

  for (let size = 2; size <= N; size <<= 1) {
    const halfSize = size >> 1;
    const tableStep = N / size;
    for (let i = 0; i < N; i += size) {
      let k = 0;
      for (let j = i; j < i + halfSize; j++) {
        const cos = cosTable[k];
        const sin = sinTable[k] * sign;
        const l = j + halfSize;
        const tRe = re[l] * cos - im[l] * sin;
        const tIm = re[l] * sin + im[l] * cos;
        re[l] = re[j] - tRe;
        im[l] = im[j] - tIm;
        re[j] += tRe;
        im[j] += tIm;
        k += tableStep;
      }
    }
  }

  if (inverse) {
    const invN = 1 / N;
    for (let i = 0; i < N; i++) {
      re[i] *= invN;
      im[i] *= invN;
    }
  }
}

const medianScratch = new Float32Array(64);
function fastMedian(values: Float32Array, count: number): number {
  for (let i = 1; i < count; i++) {
    const x = values[i];
    let j = i - 1;
    while (j >= 0 && values[j] > x) {
      values[j + 1] = values[j];
      j--;
    }
    values[j + 1] = x;
  }
  return values[count >> 1];
}

interface BandMapping {
  numBands: number;
  binToBand: Uint16Array;
  bandCenterFreq: Float32Array;
  bandBinCounts: Uint16Array;
}

function createErbBandMapping(numBins: number, sampleRate: number, fftSize: number, numBands: number = 96): BandMapping {
  const minFreq = 24;
  const maxFreq = Math.min(18500, sampleRate * 0.48);
  const hzToErb = (f: number) => 21.4 * Math.log10(1 + 0.00437 * f);
  const erbToHz = (e: number) => (Math.pow(10, e / 21.4) - 1) / 0.00437;

  const minErb = hzToErb(minFreq);
  const maxErb = hzToErb(maxFreq);
  const erbStep = (maxErb - minErb) / numBands;

  const bandCenterFreq = new Float32Array(numBands);
  for (let b = 0; b < numBands; b++) {
    bandCenterFreq[b] = erbToHz(minErb + (b + 0.5) * erbStep);
  }

  const binToBand = new Uint16Array(numBins);
  const bandBinCounts = new Uint16Array(numBands);
  const binHz = sampleRate / fftSize;

  for (let k = 0; k < numBins; k++) {
    const f = Math.max(minFreq, Math.min(maxFreq, k * binHz));
    const erb = hzToErb(f);
    const b = Math.max(0, Math.min(numBands - 1, Math.floor((erb - minErb) / erbStep)));
    binToBand[k] = b;
    bandBinCounts[b]++;
  }

  return { numBands, binToBand, bandCenterFreq, bandBinCounts };
}

interface ChunkSTFT {
  numFrames: number;
  numBins: number;
  validStartFrame: number;
  validEndFrame: number;
  padFramesStart: number;
  padSamples: number;
  chunkStart: number;
  chunkEnd: number;
  L_re: Float32Array;
  L_im: Float32Array;
  R_re: Float32Array;
  R_im: Float32Array;
  magTot: Float32Array;
  centerCoh: Float32Array;
  hSpec: Float32Array;
  pSpec: Float32Array;
  hRatio: Float32Array;
  pRatio: Float32Array;
  kickGate: Float32Array;
  snareGate: Float32Array;
  hihatGate: Float32Array;
  openhatGate: Float32Array;
  percGate: Float32Array;
  bassGuitarGate: Float32Array;
  leadVsVocalTilt: Float32Array;
  harmonicFlux: Float32Array;
  slowSustain: Float32Array;
  nmfPrior: Float32Array | null; // numStems * numBands * numFrames
  lowFlux: Float32Array;
  midFlux: Float32Array;
}

const STEM_INDEX: Record<StemKey, number> = {
  kick: 0,
  snare: 1,
  hihat: 2,
  openhat: 3,
  bass: 4,
  bassGuitar: 5,
  lead: 6,
  leadGuitar: 7,
  acousticGuitar: 8,
  piano: 9,
  pad: 10,
  vocal: 11,
  perc: 12,
};

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function bandCurve(freq: number, lowCut: number, lowFull: number, highFull: number, highCut: number): number {
  if (freq <= lowCut || freq >= highCut) return 0;
  if (freq < lowFull) {
    const t = (freq - lowCut) / Math.max(1e-6, lowFull - lowCut);
    return t * t;
  }
  if (freq > highFull) {
    const t = (highCut - freq) / Math.max(1e-6, highCut - highFull);
    return t * t;
  }
  return 1;
}

function analyzeChunkSTFT(
  leftData: Float32Array,
  rightData: Float32Array,
  chunkStart: number,
  chunkEnd: number,
  sampleRate: number,
  fftCtx: FFTContext,
  bandMap: BandMapping,
  isDeepMode: boolean,
  isMonoInput: boolean
): ChunkSTFT {
  const { fftSize, hopSize, numBins, hann } = fftCtx;
  const padSamples = fftSize; // full FFT window padding for exact COLA reconstruction
  const segStart = chunkStart - padSamples;
  const segEnd = chunkEnd + padSamples;
  const segLen = segEnd - segStart;

  const numFrames = Math.max(1, Math.ceil((segLen - fftSize) / hopSize) + 1);
  const totalSize = numFrames * numBins;

  const L_re = new Float32Array(totalSize);
  const L_im = new Float32Array(totalSize);
  const R_re = new Float32Array(totalSize);
  const R_im = new Float32Array(totalSize);
  const magTot = new Float32Array(totalSize);
  const centerCoh = new Float32Array(totalSize);

  const workLRe = new Float32Array(fftSize);
  const workLIm = new Float32Array(fftSize);
  const workRRe = new Float32Array(fftSize);
  const workRIm = new Float32Array(fftSize);
  const totalLen = leftData.length;

  for (let t = 0; t < numFrames; t++) {
    const frameOrigin = segStart + t * hopSize;
    for (let n = 0; n < fftSize; n++) {
      const idx = frameOrigin + n;
      const w = hann[n];
      if (idx >= 0 && idx < totalLen) {
        workLRe[n] = leftData[idx] * w;
        workRRe[n] = rightData[idx] * w;
      } else {
        workLRe[n] = 0;
        workRRe[n] = 0;
      }
      workLIm[n] = 0;
      workRIm[n] = 0;
    }

    fftInPlace(workLRe, workLIm, fftCtx, false);
    if (!isMonoInput) {
      fftInPlace(workRRe, workRIm, fftCtx, false);
    }

    const base = t * numBins;
    for (let k = 0; k < numBins; k++) {
      const lr = workLRe[k];
      const li = workLIm[k];
      const rr = isMonoInput ? lr : workRRe[k];
      const ri = isMonoInput ? li : workRIm[k];
      const p = base + k;

      L_re[p] = lr;
      L_im[p] = li;
      R_re[p] = rr;
      R_im[p] = ri;

      const l2 = lr * lr + li * li;
      const r2 = rr * rr + ri * ri;
      magTot[p] = Math.sqrt(0.5 * (l2 + r2));

      if (isMonoInput) {
        centerCoh[p] = 1.0;
      } else {
        const mr = (lr + rr) * 0.5;
        const mi = (li + ri) * 0.5;
        const sr = (lr - rr) * 0.5;
        const si = (li - ri) * 0.5;
        const m2 = mr * mr + mi * mi;
        const s2 = sr * sr + si * si;
        centerCoh[p] = m2 / (m2 + s2 + 1e-18);
      }
    }
  }

  // 2D Spectrogram HPSS
  const hSpec = new Float32Array(totalSize);
  const pSpec = new Float32Array(totalSize);
  const hRatio = new Float32Array(totalSize);
  const pRatio = new Float32Array(totalSize);

  const Kt = isDeepMode ? 8 : 4;
  const Kf = isDeepMode ? 7 : 4;

  // Horizontal median across time frames per frequency bin
  for (let k = 0; k < numBins; k++) {
    for (let t = 0; t < numFrames; t++) {
      const t0 = Math.max(0, t - Kt);
      const t1 = Math.min(numFrames - 1, t + Kt);
      let cnt = 0;
      for (let tt = t0; tt <= t1; tt++) {
        medianScratch[cnt++] = magTot[tt * numBins + k];
      }
      hSpec[t * numBins + k] = fastMedian(medianScratch, cnt);
    }
  }

  // Vertical median across frequency bins per time frame
  const pExp = isDeepMode ? 2.4 : 2.0;
  for (let t = 0; t < numFrames; t++) {
    const base = t * numBins;
    for (let k = 0; k < numBins; k++) {
      const k0 = Math.max(0, k - Kf);
      const k1 = Math.min(numBins - 1, k + Kf);
      let cnt = 0;
      for (let kk = k0; kk <= k1; kk++) {
        medianScratch[cnt++] = magTot[base + kk];
      }
      const pVal = fastMedian(medianScratch, cnt);
      pSpec[base + k] = pVal;

      const hVal = hSpec[base + k];
      const hp = Math.pow(hVal, pExp);
      const pp = Math.pow(pVal, pExp);
      const hr = hp / (hp + pp + 1e-18);
      hRatio[base + k] = hr;
      pRatio[base + k] = 1 - hr;
    }
  }

  // Compute Frame-level Drum Onset Flux & Harmonic Envelopes
  const binHz = sampleRate / fftSize;
  const frameSec = hopSize / sampleRate;
  const k25 = Math.max(1, Math.round(25 / binHz));
  const k55 = Math.max(1, Math.round(55 / binHz));
  const k145 = Math.min(numBins - 1, Math.round(145 / binHz));
  const k150 = Math.max(1, Math.round(150 / binHz));
  const k210 = Math.min(numBins - 1, Math.round(210 / binHz));
  const k450 = Math.min(numBins - 1, Math.round(450 / binHz));
  const k1800 = Math.min(numBins - 1, Math.round(1800 / binHz));
  const k4500 = Math.min(numBins - 1, Math.round(4500 / binHz));
  const k5500 = Math.min(numBins - 1, Math.round(5500 / binHz));
  const k11000 = Math.min(numBins - 1, Math.round(11000 / binHz));
  const k17500 = Math.min(numBins - 1, Math.round(17500 / binHz));

  const subEnergy = new Float32Array(numFrames);
  const subHarm = new Float32Array(numFrames);
  const midPercE = new Float32Array(numFrames);
  const hfPercE = new Float32Array(numFrames);
  const mfPercE = new Float32Array(numFrames);
  const harmE = new Float32Array(numFrames);
  const wideHarmE = new Float32Array(numFrames);
  const lowFlux = new Float32Array(numFrames);
  const midFlux = new Float32Array(numFrames);
  const bassGuitarGate = new Float32Array(numFrames);
  const leadVsVocalTilt = new Float32Array(numFrames);

  const k1250 = Math.min(numBins - 1, Math.round(1250 / binHz));
  const midBandTotalBins = Math.max(1, k4500 - k450 + 1);

  for (let t = 0; t < numFrames; t++) {
    const base = t * numBins;
    let sE = 0,
      sH = 0,
      mPE = 0,
      hPE = 0,
      mfPE = 0,
      hmE = 0,
      wHmE = 0,
      lFlx = 0,
      mFlx = 0,
      bgLowE = 0,
      bgMidE = 0,
      cMidE = 0,
      cHighE = 0,
      midBbCount = 0;
    const prevBase = (t > 0 ? t - 1 : 0) * numBins;

    for (let k = 1; k < numBins; k++) {
      const m = magTot[base + k];
      const pm = magTot[prevBase + k];
      const diff = Math.log1p(12 * m) - Math.log1p(12 * pm);
      if (diff > 0) {
        if (k >= k25 && k <= k145) lFlx += diff;
        else if (k >= k150 && k <= k4500) mFlx += diff;
      }

      const bb = clamp01(pSpec[base + k] / (m + 1e-12));
      const bbNoiseWeight = bb > 0.28 ? bb * bb : 0;

      if (k >= k25 && k <= k145) {
        sE += m;
        sH += hSpec[base + k];
      }
      if (k >= k55 && k <= k210) {
        bgLowE += hSpec[base + k];
      }
      if (k > k210 && k <= k1800) {
        bgMidE += hSpec[base + k];
      }
      if (k >= k150 && k <= k4500) {
        mPE += pSpec[base + k] * pRatio[base + k] * bbNoiseWeight;
      }
      if (k >= k450 && k <= k4500 && bb > 0.30 && m > 0.008) {
        midBbCount++;
      }
      if (k >= k450 && k <= k5500) {
        mfPE += pSpec[base + k] * pRatio[base + k] * bbNoiseWeight;
      }
      if (k >= k5500 && k <= k17500) {
        hPE += pSpec[base + k] * pRatio[base + k] * bbNoiseWeight;
      }
      if (k >= k150 && k <= k4500) {
        const hh = hSpec[base + k] * hRatio[base + k];
        hmE += hh;
        if (!isMonoInput) {
          wHmE += hh * (1 - centerCoh[base + k]);
        }
      }
      // Harmonic-only centered energy prevents drum noise from biasing synth-vs-vocal tilt
      if (k >= k150 && k <= k1250) {
        cMidE += hSpec[base + k] * hRatio[base + k] * centerCoh[base + k];
      }
      if (k > k1250 && k <= k11000) {
        cHighE += hSpec[base + k] * hRatio[base + k] * centerCoh[base + k];
      }
    }

    const midFlatnessGate = clamp01((midBbCount / midBandTotalBins - 0.14) / 0.18);
    subEnergy[t] = sE;
    subHarm[t] = sH;
    midPercE[t] = mPE * midFlatnessGate;
    hfPercE[t] = hPE;
    mfPercE[t] = mfPE * midFlatnessGate;
    harmE[t] = hmE;
    wideHarmE[t] = wHmE;
    lowFlux[t] = lFlx;
    midFlux[t] = mFlx;

    bassGuitarGate[t] = clamp01((bgLowE / (bgMidE * 0.25 + 1e-6) - 0.35) * 1.4);

    // Upper harmonic energy >1.25kHz vs 150-1250Hz core separates bright synth leads from warm vocals
    const highToMid = cHighE / (cMidE + 1e-6);
    leadVsVocalTilt[t] = clamp01((highToMid - 0.18) / 0.22);
  }

  const kickGate = new Float32Array(numFrames);
  const snareGate = new Float32Array(numFrames);
  const hihatGate = new Float32Array(numFrames);
  const openhatGate = new Float32Array(numFrames);
  const percGate = new Float32Array(numFrames);
  const harmonicFlux = new Float32Array(numFrames);
  const slowSustain = new Float32Array(numFrames);

  // Normalize gates cleanly by adaptive local contrast so drumless tracks don't open gates
  const meanOf = (arr: Float32Array) => {
    let s = 0;
    for (let i = 0; i < arr.length; i++) s += arr[i];
    return s / Math.max(1, arr.length);
  };
  const avgMidP = meanOf(midPercE) + 1e-6;
  const avgHfP = meanOf(hfPercE) + 1e-6;
  const avgHarm = meanOf(harmE) + 1e-6;

  // Compute impulsive kick burst above sustained sub bass
  const kickRelDecay = Math.exp(-frameSec / 0.085);
  const snareRelDecay = Math.exp(-frameSec / 0.105);
  const hhRelDecay = Math.exp(-frameSec / 0.055);
  const ohRelDecay = Math.exp(-frameSec / 0.22);
  const percRelDecay = Math.exp(-frameSec / 0.075);

  let kg = 0,
    sg = 0,
    hhg = 0,
    ohg = 0,
    pg = 0;

  // Lookahead frames for open-hat vs closed-hat decay check (~140ms)
  const ohLookFrames = Math.max(2, Math.round(0.14 / frameSec));

  for (let t = 0; t < numFrames; t++) {
    const prevSub = t > 0 ? subEnergy[t - 1] : subEnergy[t];
    const subJump = Math.max(0, subEnergy[t] - Math.max(subHarm[t] * 1.18, prevSub * 1.08));
    const subTotal = subEnergy[t] + 1e-6;
    const kickImp = subJump / (subHarm[t] + 0.15 * subTotal + 1e-6);
    if (kickImp > 0.35 && subEnergy[t] > 0.015) {
      kg = Math.max(kg, clamp01(kickImp * 1.15));
    } else {
      kg *= kickRelDecay;
    }
    kickGate[t] = kg;

    // Snare impulse: sharp broadband mid-band noise jump (ignores narrow tonal synth attacks)
    const prevMidP = t > 0 ? midPercE[t - 1] : midPercE[t];
    const midJump = Math.max(0, midPercE[t] - prevMidP * 1.15);
    const snareScore = midJump / (avgMidP * 1.3 + prevMidP * 0.5 + 1e-6);
    if (snareScore > 0.52 && midPercE[t] > 0.025) {
      sg = Math.max(sg, clamp01(snareScore * 0.9));
    } else {
      sg *= snareRelDecay;
    }
    snareGate[t] = sg;

    // High-frequency percussive noise onset (rejects snare burst tail) -> Closed Hat vs Open Hat
    const prevHfP = t > 0 ? hfPercE[t - 1] : hfPercE[t];
    const hfJump = Math.max(0, hfPercE[t] - prevHfP * 1.15);
    const hfOnset = (hfJump / (avgHfP * 1.15 + prevHfP * 0.45 + 1e-6)) * (1 - 0.65 * sg);

    if (hfOnset > 0.42 && hfPercE[t] > 0.008) {
      let futureMean = 0;
      let countF = 0;
      for (let f = 2; f <= ohLookFrames && t + f < numFrames; f++) {
        futureMean += hfPercE[t + f];
        countF++;
      }
      futureMean /= Math.max(1, countF);
      const decayStayRatio = futureMean / (hfPercE[t] + 1e-6);

      // Closed hi-hats decay cleanly; Open hi-hats keep high broadband energy > 120ms past onset
      hhg = Math.max(hhg, clamp01(hfOnset * 1.05));
      if (decayStayRatio > 0.52 && sg < 0.3) {
        ohg = Math.max(ohg, clamp01(hfOnset * 0.95));
      }
    } else {
      hhg *= hhRelDecay;
      ohg *= ohRelDecay;
    }
    hihatGate[t] = hhg;
    openhatGate[t] = ohg;

    // Percussion (shakers, congas, rimshots) = broadband transients strictly outside kick/snare bursts & tails
    const prevMfP = t > 0 ? mfPercE[t - 1] : mfPercE[t];
    const mfJump = Math.max(0, mfPercE[t] - prevMfP * 1.18);
    const pScore = (mfJump / (avgMidP * 1.45 + 1e-6)) * (1 - 0.9 * sg) * (1 - 0.8 * kg);
    if (sg < 0.08 && kg < 0.22 && pScore > 0.65 && mfPercE[t] > 0.03) {
      pg = Math.max(pg, clamp01(pScore * 0.85));
    } else {
      pg *= percRelDecay;
    }
    percGate[t] = pg;

    // Harmonic envelope smoothness: decouple wide stereo pad sustain from drum transients
    const prevHarm = t > 0 ? harmE[t - 1] : harmE[t];
    const hJump = Math.max(0, harmE[t] - prevHarm);
    const fluxNorm = clamp01(hJump / (avgHarm * 0.65 + 1e-6));
    harmonicFlux[t] = fluxNorm;
    if (!isMonoInput) {
      const prevWide = t > 0 ? wideHarmE[t - 1] : wideHarmE[t];
      const wJump = Math.abs(wideHarmE[t] - prevWide) / (wideHarmE[t] + 1e-6);
      const wideSteady = clamp01(1 - wJump * 1.2);
      slowSustain[t] = wideHarmE[t] > harmE[t] * 0.08 ? wideSteady : clamp01(1 - fluxNorm * 0.9);
    } else {
      slowSustain[t] = clamp01(1 - fluxNorm * 0.9);
    }
  }

  // ERB Band Compression + KL-NMF Factorization in Deep Mode
  let nmfPrior: Float32Array | null = null;
  if (isDeepMode && numFrames >= 8) {
    nmfPrior = computeChunkNmfPriors(
      magTot,
      hRatio,
      pRatio,
      centerCoh,
      bandMap,
      numFrames,
      numBins,
      isMonoInput
    );
  }

  const validStartFrame = Math.floor(padSamples / hopSize);
  const validEndFrame = Math.min(numFrames, validStartFrame + Math.ceil((chunkEnd - chunkStart) / hopSize));

  return {
    numFrames,
    numBins,
    validStartFrame,
    validEndFrame,
    padFramesStart: padSamples,
    padSamples,
    chunkStart,
    chunkEnd,
    L_re,
    L_im,
    R_re,
    R_im,
    magTot,
    centerCoh,
    hSpec,
    pSpec,
    hRatio,
    pRatio,
    kickGate,
    snareGate,
    hihatGate,
    openhatGate,
    percGate,
    bassGuitarGate,
    leadVsVocalTilt,
    harmonicFlux,
    slowSustain,
    nmfPrior,
    lowFlux,
    midFlux,
  };
}

/**
 * 96-Band KL-Divergence NMF Component Factorization
 * Decomposes mix spectrogram V ≈ W * H_act into R=16 latent sound bases,
 * classifies each basis by spectral/temporal physics, and builds soft priors.
 */
function computeChunkNmfPriors(
  magTot: Float32Array,
  hRatio: Float32Array,
  pRatio: Float32Array,
  centerCoh: Float32Array,
  bandMap: BandMapping,
  numFrames: number,
  numBins: number,
  isMonoInput: boolean
): Float32Array {
  const B = bandMap.numBands;
  const T = numFrames;
  const R = 16;
  const V = new Float32Array(B * T);
  const bandHarm = new Float32Array(B * T);
  const bandCenter = new Float32Array(B * T);

  for (let t = 0; t < T; t++) {
    const fBase = t * numBins;
    const bBase = t * B;
    for (let k = 1; k < numBins; k++) {
      const b = bandMap.binToBand[k];
      const m = magTot[fBase + k];
      V[bBase + b] += m;
      bandHarm[bBase + b] += m * hRatio[fBase + k];
      bandCenter[bBase + b] += m * centerCoh[fBase + k];
    }
    for (let b = 0; b < B; b++) {
      const val = V[bBase + b] + 1e-6;
      bandHarm[bBase + b] /= val;
      bandCenter[bBase + b] /= val;
      V[bBase + b] = val;
    }
  }

  // Deterministic seeded spectral basis initialization across frequency regions
  const W = new Float32Array(B * R);
  const H = new Float32Array(R * T);
  for (let r = 0; r < R; r++) {
    const anchorBand = ((r + 0.5) / R) * B;
    const spread = 12 + (r % 4) * 8;
    let colSum = 0;
    for (let b = 0; b < B; b++) {
      const dist = (b - anchorBand) / spread;
      const val = Math.exp(-0.5 * dist * dist) + 0.15 + 0.05 * Math.sin(b * 0.7 + r * 1.9);
      W[b * R + r] = Math.max(1e-4, val);
      colSum += W[b * R + r];
    }
    for (let b = 0; b < B; b++) W[b * R + r] /= colSum;

    for (let t = 0; t < T; t++) {
      H[r * T + t] = 0.5 + 0.1 * Math.cos(t * 0.3 + r);
    }
  }

  const WH = new Float32Array(B * T);
  const Q = new Float32Array(B * T);
  const iterations = 28;

  for (let iter = 0; iter < iterations; iter++) {
    // 1. Compute WH & Q = V / WH
    for (let t = 0; t < T; t++) {
      const btBase = t * B;
      for (let b = 0; b < B; b++) {
        let sum = 1e-9;
        const wBase = b * R;
        for (let r = 0; r < R; r++) {
          sum += W[wBase + r] * H[r * T + t];
        }
        WH[btBase + b] = sum;
        Q[btBase + b] = V[btBase + b] / sum;
      }
    }

    // 2. Multiplicative Update H
    for (let r = 0; r < R; r++) {
      let wColSum = 1e-9;
      for (let b = 0; b < B; b++) wColSum += W[b * R + r];
      const invW = 1 / wColSum;
      const hBase = r * T;
      for (let t = 0; t < T; t++) {
        let acc = 0;
        const btBase = t * B;
        for (let b = 0; b < B; b++) {
          acc += W[b * R + r] * Q[btBase + b];
        }
        H[hBase + t] *= acc * invW;
      }
    }

    // 3. Recompute WH & Q, then Update W
    for (let t = 0; t < T; t++) {
      const btBase = t * B;
      for (let b = 0; b < B; b++) {
        let sum = 1e-9;
        const wBase = b * R;
        for (let r = 0; r < R; r++) {
          sum += W[wBase + r] * H[r * T + t];
        }
        Q[btBase + b] = V[btBase + b] / sum;
      }
    }

    for (let r = 0; r < R; r++) {
      const hBase = r * T;
      let hRowSum = 1e-9;
      for (let t = 0; t < T; t++) hRowSum += H[hBase + t];
      const invH = 1 / hRowSum;

      let colSum = 1e-9;
      for (let b = 0; b < B; b++) {
        let acc = 0;
        for (let t = 0; t < T; t++) {
          acc += Q[t * B + b] * H[hBase + t];
        }
        const nw = W[b * R + r] * acc * invH;
        W[b * R + r] = nw;
        colSum += nw;
      }
      // Normalize W[:, r] and transfer scale into H[r, :]
      for (let b = 0; b < B; b++) W[b * R + r] /= colSum;
      for (let t = 0; t < T; t++) H[hBase + t] *= colSum;
    }
  }

  // Classify each learned NMF component r -> soft affinity weights [13]
  const compStemWeight = new Float32Array(R * 13);
  for (let r = 0; r < R; r++) {
    let subE = 0,
      lowMidE = 0,
      midE = 0,
      highE = 0,
      totW = 1e-9;
    let spectralDiffSum = 0;
    for (let b = 0; b < B; b++) {
      const w = W[b * R + r];
      const f = bandMap.bandCenterFreq[b];
      totW += w;
      if (f < 140) subE += w;
      else if (f < 550) lowMidE += w;
      else if (f < 4200) midE += w;
      else highE += w;
      if (b > 0) spectralDiffSum += Math.abs(w - W[(b - 1) * R + r]);
    }
    subE /= totW;
    lowMidE /= totW;
    midE /= totW;
    highE /= totW;
    // High peakiness => harmonic tonal comb; low peakiness => broadband noise
    const spectralPeakiness = clamp01(spectralDiffSum * 1.4);

    // Temporal stats of H[r, :]
    const hBase = r * T;
    let meanH = 0,
      maxH = 0,
      posFlux = 0,
      weightedHarm = 0,
      weightedCent = 0,
      hWeightSum = 1e-9;
    for (let t = 0; t < T; t++) {
      const h = H[hBase + t];
      meanH += h;
      if (h > maxH) maxH = h;
      if (t > 0 && h > H[hBase + t - 1]) posFlux += h - H[hBase + t - 1];
      // Weighted harm & center
      for (let b = 0; b < B; b += 2) {
        const contrib = W[b * R + r] * h;
        weightedHarm += contrib * bandHarm[t * B + b];
        weightedCent += contrib * bandCenter[t * B + b];
        hWeightSum += contrib;
      }
    }
    meanH /= T;
    const spikiness = clamp01((maxH / (meanH + 1e-6) - 1.5) / 6.0);
    const percussiveness = clamp01(1 - weightedHarm / hWeightSum);
    const centerAff = isMonoInput ? 0.92 : clamp01(weightedCent / hWeightSum);
    const wideAff = isMonoInput ? 0.45 : clamp01(1 - centerAff);
    const sustainAff = clamp01((1 - spikiness) * (1 - posFlux / (meanH * T + 1e-6)));
    const warmVocalTilt = clamp01(1 - (highE / (lowMidE + midE + 1e-6)) * 2.2);

    const off = r * 13;
    compStemWeight[off + STEM_INDEX.kick] = subE * (0.3 + 0.7 * spikiness) * (0.3 + 0.7 * centerAff);
    compStemWeight[off + STEM_INDEX.snare] = (midE + 0.4 * lowMidE) * percussiveness * (1 - spectralPeakiness * 0.5) * (0.4 + 0.6 * spikiness);
    compStemWeight[off + STEM_INDEX.hihat] = highE * percussiveness * spikiness;
    compStemWeight[off + STEM_INDEX.openhat] = highE * (0.4 + 0.6 * percussiveness) * (0.4 + 0.6 * sustainAff);
    compStemWeight[off + STEM_INDEX.perc] = (midE + 0.5 * highE) * percussiveness * spikiness;
    compStemWeight[off + STEM_INDEX.bass] = (subE + 0.35 * lowMidE) * (1 - percussiveness * 0.6) * centerAff;
    compStemWeight[off + STEM_INDEX.bassGuitar] = (lowMidE + 0.5 * subE) * (1 - percussiveness * 0.4) * spectralPeakiness;
    compStemWeight[off + STEM_INDEX.lead] = (midE * (0.4 + 0.6 * (1 - warmVocalTilt)) + 1.15 * highE) * spectralPeakiness * (1 - percussiveness * 0.5);
    compStemWeight[off + STEM_INDEX.leadGuitar] = midE * spectralPeakiness * (0.4 + 0.6 * (1 - highE));
    compStemWeight[off + STEM_INDEX.acousticGuitar] = (midE + 0.5 * lowMidE + 0.4 * highE) * (0.4 + 0.6 * spikiness) * (1 - warmVocalTilt * 0.5);
    compStemWeight[off + STEM_INDEX.piano] = (lowMidE + midE) * spectralPeakiness * Math.pow(spikiness, 1.3) * (1 - highE * 0.6);
    compStemWeight[off + STEM_INDEX.pad] = (lowMidE + midE) * sustainAff * (isMonoInput ? 0.85 : 0.25 + 1.15 * wideAff);
    compStemWeight[off + STEM_INDEX.vocal] = (0.8 * lowMidE + midE) * centerAff * (0.35 + 0.65 * warmVocalTilt) * (1 - percussiveness * 0.5);

    // Normalize per component across stems
    let sSum = 1e-9;
    for (let s = 0; s < 13; s++) sSum += compStemWeight[off + s];
    for (let s = 0; s < 13; s++) compStemWeight[off + s] /= sSum;
  }

  // Reconstruct normalized NMF prior map [13 * B * T]
  const priors = new Float32Array(13 * B * T);
  const btStride = B * T;
  for (let t = 0; t < T; t++) {
    for (let b = 0; b < B; b++) {
      let tot = 1e-9;
      for (let r = 0; r < R; r++) {
        const contribution = W[b * R + r] * H[r * T + t];
        const off = r * 13;
        for (let s = 0; s < 13; s++) {
          priors[s * btStride + t * B + b] += contribution * compStemWeight[off + s];
        }
        tot += contribution;
      }
      for (let s = 0; s < 13; s++) {
        priors[s * btStride + t * B + b] /= tot;
      }
    }
  }

  return priors;
}

/**
 * Computes raw bin-level score for all 13 stems at frame t, bin k
 */
function computeFrameBinScores(
  chunk: ChunkSTFT,
  t: number,
  k: number,
  freq: number,
  band: number,
  isMonoInput: boolean,
  scoresOut: Float32Array
) {
  const p = t * chunk.numBins + k;
  const hr = chunk.hRatio[p];
  const pr = chunk.pRatio[p];
  const cc = chunk.centerCoh[p];
  const wide = isMonoInput ? 0.45 : clamp01(1 - cc);
  const mag = chunk.magTot[p] + 1e-12;
  const broadband = clamp01(chunk.pSpec[p] / mag);
  const noiseScore = broadband > 0.27 ? Math.pow(broadband, 2.0) : 0;
  const tonality = clamp01(1 - broadband * 0.85);

  const kg = chunk.kickGate[t];
  const sg = chunk.snareGate[t];
  const hhg = chunk.hihatGate[t];
  const ohg = chunk.openhatGate[t];
  const pg = chunk.percGate[t];
  const bgg = chunk.bassGuitarGate[t];
  const synthTilt = chunk.leadVsVocalTilt[t];
  const hFlux = chunk.harmonicFlux[t];
  const slowSus = chunk.slowSustain[t];

  // 1. Kick Drum: Center sub/punch + gated click
  const kickBand =
    bandCurve(freq, 22, 42, 130, 260) +
    0.45 * kg * bandCurve(freq, 1200, 1800, 3400, 4800);
  const kickTransient = clamp01(0.45 * pr + 0.55 * clamp01((mag - chunk.hSpec[p]) / mag));
  scoresOut[0] = kickBand * kg * (0.35 + 0.65 * kickTransient) * (0.4 + 0.6 * cc);

  // 2. Snare / Clap: Chest body + strictly broadband crack (ignores tonal synth plucks)
  const snareBand =
    0.45 * bandCurve(freq, 140, 190, 320, 440) +
    bandCurve(freq, 750, 1400, 5200, 7800);
  scoresOut[1] = snareBand * sg * pr * noiseScore;

  // 3. Closed Hi-Hats
  const hhBand = bandCurve(freq, 5200, 6800, 16500, 20000);
  scoresOut[2] = hhBand * hhg * pr * noiseScore;

  // 4. Open Hi-Hat
  const ohBand = bandCurve(freq, 4200, 5800, 15500, 19500);
  scoresOut[3] = ohBand * ohg * noiseScore;

  // 5. Percussion (Non-snare mid-high broadband transients)
  const percBand = bandCurve(freq, 380, 700, 4600, 6800);
  scoresOut[12] = percBand * pg * pr * noiseScore * (1 - 0.7 * sg);

  // 6. Synth Bass
  const bassBand =
    bandCurve(freq, 22, 35, 135, 240) +
    0.2 * bandCurve(freq, 140, 200, 320, 480);
  scoresOut[4] = bassBand * hr * (0.35 + 0.65 * cc) * (1 - 0.72 * kg);

  // 7. Bass Guitar (Requires real 55-210 Hz bass presence in frame)
  const bgBand =
    0.85 * bandCurve(freq, 48, 82, 230, 440) +
    0.35 * bandCurve(freq, 220, 320, 540, 820);
  scoresOut[5] = bgBand * bgg * (0.65 * hr + 0.35 * hFlux) * tonality * (1 - 0.65 * kg);

  // 8. Lead Synth (Electronic tonal hook: upper harmonics / rhythmic step plucks)
  const leadBand =
    bandCurve(freq, 260, 520, 8500, 13500) *
    (freq > 1500 ? 1.45 : 0.92);
  const leadBrightBoost = 0.42 + 0.98 * Math.max(synthTilt, hFlux * 0.85);
  const leadCenterPref = isMonoInput ? 0.9 : 0.35 + 0.65 * cc;
  scoresOut[6] = leadBand * Math.max(hr, 0.5 * tonality) * tonality * leadBrightBoost * leadCenterPref;

  // 9. Lead Guitar (Midrange bite 380-4000 Hz, amp rolloff above 4.8kHz)
  const lgBand = bandCurve(freq, 280, 580, 2800, 4600);
  scoresOut[7] = lgBand * hr * tonality * (isMonoInput ? 0.25 : 0.2 + 0.8 * wide) * (1 - 0.5 * synthTilt) * Math.max(0.2, 1 - hFlux * 0.4);

  // 10. Acoustic Guitar (Woody body + pick shimmer, requires real transient pluck flux)
  const agBand =
    0.65 * bandCurve(freq, 140, 220, 1100, 2800) +
    0.55 * bandCurve(freq, 1800, 3000, 6500, 8800);
  scoresOut[8] = agBand * (0.35 * hr + 0.65 * hFlux) * tonality * (0.25 + 0.75 * hFlux) * (1 - 0.55 * synthTilt) * (1 - 0.5 * slowSus);

  // 11. Piano / Keys (Warm mid 110-3200Hz + sharp hammer onset flux, non-synth tilt)
  const pianoBand = bandCurve(freq, 110, 200, 2000, 3600);
  scoresOut[9] = pianoBand * (0.35 * hr + 0.65 * hFlux) * tonality * (0.25 + 0.75 * hFlux) * (1 - 0.65 * synthTilt) * (1 - 0.45 * slowSus);

  // 12. Pad Chords (Wide stereo diffuse bed OR mono slow sustained chords)
  const padBand = bandCurve(freq, 130, 240, 3200, 5600);
  const padStereo = isMonoInput ? 0.65 * (0.2 + 0.8 * slowSus) : clamp01(0.05 + 1.5 * wide) * (0.45 + 0.55 * slowSus);
  scoresOut[10] = padBand * hr * tonality * padStereo;

  // 13. Vocals / FX (Warm center-coherent formants 150-2400 Hz + vibrato-tolerant tonality)
  const vocalBand =
    bandCurve(freq, 145, 240, 2000, 3600) +
    0.15 * bandCurve(freq, 5200, 6200, 8000, 9400);
  const vocalCenter = isMonoInput ? 1.0 : Math.pow(clamp01((cc - 0.58) / 0.36), 1.6);
  const vocalWarmthBias = Math.max(0.05, 1.0 - 0.95 * synthTilt);
  scoresOut[11] = vocalBand * Math.max(hr, 0.58 * tonality) * tonality * vocalCenter * vocalWarmthBias * 1.15;

  // Blend NMF component prior when Deep Mode is active
  if (chunk.nmfPrior) {
    const btStride = chunk.numFrames * 96; // B = 96
    const offset = t * 96 + band;
    for (let s = 0; s < 13; s++) {
      const prior = chunk.nmfPrior[s * btStride + offset];
      scoresOut[s] *= 0.4 + 1.2 * prior;
    }
  }
}

export async function separateRawChannelsIntoStems(
  leftData: Float32Array,
  rightData: Float32Array,
  sampleRate: number,
  onProgress?: (progress: number, label: string) => void,
  isDeepMode: boolean = true,
  forceMonoInput: boolean = false
): Promise<RawSeparatedStemData> {
  const length = leftData.length;
  const fftSize = length < 8192 ? 1024 : isDeepMode ? 4096 : 2048;
  const fftCtx = createFFTContext(fftSize);
  const bandMap = createErbBandMapping(fftCtx.numBins, sampleRate, fftSize, 96);

  // Detect if stereo input is effectively mono (L == R)
  let diffSum = 0;
  let totSum = 1e-9;
  const checkStep = Math.max(1, Math.floor(length / 8000));
  for (let i = 0; i < length; i += checkStep) {
    const l = leftData[i];
    const r = rightData[i];
    diffSum += (l - r) * (l - r);
    totSum += l * l + r * r;
  }
  const isMonoInput = forceMonoInput || diffSum / totSum < 0.002;

  // Compute total mix RMS and Peak
  let mixSqSum = 0;
  let mixPeak = 0;
  for (let i = 0; i < length; i++) {
    const m = 0.5 * (Math.abs(leftData[i]) + Math.abs(rightData[i]));
    if (m > mixPeak) mixPeak = m;
    const e = 0.5 * (leftData[i] * leftData[i] + rightData[i] * rightData[i]);
    mixSqSum += e;
  }
  const mixRms = Math.sqrt(mixSqSum / Math.max(1, length));
  const mixPeakDb = mixPeak > 1e-8 ? 20 * Math.log10(mixPeak) : -120;
  const mixRmsDb = mixRms > 1e-8 ? 20 * Math.log10(mixRms) : -120;

  // Chunk boundaries aligned cleanly to hopSize
  const maxChunkSamples = Math.max(fftSize * 4, Math.floor(sampleRate * 20));
  const alignedChunkSamples = Math.ceil(maxChunkSamples / fftCtx.hopSize) * fftCtx.hopSize;
  const chunksBounds: Array<{ start: number; end: number }> = [];
  for (let start = 0; start < length; start += alignedChunkSamples) {
    chunksBounds.push({ start, end: Math.min(length, start + alignedChunkSamples) });
  }

  onProgress?.(
    10,
    `Phase 1: Running ${fftSize}-pt STFT + 2D Spectrogram HPSS (${chunksBounds.length} segment${
      chunksBounds.length > 1 ? 's' : ''
    })...`
  );
  await yieldToUI();

  // Pass 1: Analyze chunks, collect global BPM onset flux & 13-stem competition stats
  const stemEnergyAcc = new Float64Array(13);
  const stemWinEnergyAcc = new Float64Array(13);
  const stemPeakFrameE = new Float64Array(13);
  const stemActiveFrames = new Uint32Array(13);
  const stemDominantWins = new Uint32Array(13);
  const stemOnsetCount = new Uint32Array(13);
  const totalMixFrameE = { sum: 0, count: 0 };

  const globalLowFluxChunks: Float32Array[] = [];
  const globalMidFluxChunks: Float32Array[] = [];
  const scores = new Float32Array(13);
  const prevFrameStemE = new Float64Array(13);
  const binHz = sampleRate / fftSize;

  // Keep analyzed chunks in memory only if <= 2 chunks (~40s) to avoid Pass 2 recompute;
  // for longer tracks, recompute lightweight STFT in Pass 2 to bound RAM strictly < 150 MB.
  const cacheChunks = chunksBounds.length <= 2;
  const cachedChunks: ChunkSTFT[] = [];

  for (let cIdx = 0; cIdx < chunksBounds.length; cIdx++) {
    const { start, end } = chunksBounds[cIdx];
    const pct = 12 + Math.round(((cIdx + 0.5) / chunksBounds.length) * 48);
    onProgress?.(
      pct,
      isDeepMode
        ? `Phase 2: 2D HPSS & 96-Band KL-NMF Factorization (${cIdx + 1}/${chunksBounds.length})...`
        : `Phase 2: Fast STFT 2D HPSS Separation (${cIdx + 1}/${chunksBounds.length})...`
    );
    await yieldToUI();

    const chunk = analyzeChunkSTFT(
      leftData,
      rightData,
      start,
      end,
      sampleRate,
      fftCtx,
      bandMap,
      isDeepMode,
      isMonoInput
    );

    if (cacheChunks) cachedChunks.push(chunk);

    // Save interior onset flux for BPM estimation
    globalLowFluxChunks.push(chunk.lowFlux.subarray(chunk.validStartFrame, chunk.validEndFrame));
    globalMidFluxChunks.push(chunk.midFlux.subarray(chunk.validStartFrame, chunk.validEndFrame));

    const frameE = new Float64Array(13);
    const frameFloor = Math.max(1e-10, mixSqSum / Math.max(1, length)) * fftSize * 0.004;

    for (let t = chunk.validStartFrame; t < chunk.validEndFrame; t++) {
      frameE.fill(0);
      let mixFrameE = 0;
      const base = t * chunk.numBins;

      for (let k = 1; k < chunk.numBins; k++) {
        const freq = k * binHz;
        const m = chunk.magTot[base + k];
        const eBin = m * m;
        mixFrameE += eBin;

        computeFrameBinScores(chunk, t, k, freq, bandMap.binToBand[k], isMonoInput, scores);
        let sumPow = 1e-18;
        let winS = 0;
        let winVal = -1;
        const wienerP = isDeepMode ? 1.8 : 1.5;
        for (let s = 0; s < 13; s++) {
          if (scores[s] > winVal) {
            winVal = scores[s];
            winS = s;
          }
          const sv = Math.pow(scores[s], wienerP);
          scores[s] = sv;
          sumPow += sv;
        }
        if (winVal > 1e-4) {
          stemWinEnergyAcc[winS] += eBin;
        }
        const invSum = 1 / sumPow;
        for (let s = 0; s < 13; s++) {
          const w = scores[s] * invSum;
          frameE[s] += eBin * w * w;
        }
      }

      totalMixFrameE.sum += mixFrameE;
      totalMixFrameE.count++;

      let bestMelodic = 6;
      let bestMelodicVal = -1;
      let melodicFrameTotal = 0;

      for (let s = 0; s < 13; s++) {
        const e = frameE[s];
        stemEnergyAcc[s] += e;
        if (e > stemPeakFrameE[s]) stemPeakFrameE[s] = e;
        if (e > frameFloor && e > mixFrameE * 0.008) {
          stemActiveFrames[s]++;
        }
        if (e > prevFrameStemE[s] * 2.2 && e > mixFrameE * 0.03) {
          stemOnsetCount[s]++;
        }
        prevFrameStemE[s] = e;

        // Track dominance within melodic/vocal group [6..11] independently of 808/sub bass!
        if (s >= 6 && s <= 11) {
          melodicFrameTotal += e;
          if (e > bestMelodicVal) {
            bestMelodicVal = e;
            bestMelodic = s;
          }
        }
      }
      if (bestMelodicVal > frameFloor && bestMelodicVal > melodicFrameTotal * 0.22) {
        stemDominantWins[bestMelodic]++;
      }
    }
  }

  // Merge flux and estimate studio BPM using Comb-Filter Autocorrelation Tempogram
  onProgress?.(64, 'Phase 3: Comb-Filter Tempogram BPM Analysis & Stem Presence Pruning...');
  await yieldToUI();

  let totalFluxLen = 0;
  globalLowFluxChunks.forEach(a => (totalFluxLen += a.length));
  const fullLowFlux = new Float32Array(totalFluxLen);
  const fullMidFlux = new Float32Array(totalFluxLen);
  let fOff = 0;
  for (let i = 0; i < globalLowFluxChunks.length; i++) {
    fullLowFlux.set(globalLowFluxChunks[i], fOff);
    fullMidFlux.set(globalMidFluxChunks[i], fOff);
    fOff += globalLowFluxChunks[i].length;
  }
  const detectedBpm = estimateBpmFromDualFlux(fullLowFlux, fullMidFlux, fftCtx.hopSize / sampleRate);

  // Determine detected active stems globally across track
  const totalFrameCount = Math.max(1, totalMixFrameE.count);
  const totalEnergyRef = Math.max(1e-12, totalMixFrameE.sum);
  const durationSec = length / sampleRate;
  const minDrumOnsets = Math.min(4, Math.max(1, Math.floor(durationSec * 0.8)));

  const detectedStems = {} as Record<StemKey, StemDetectionInfo>;
  const activeMask = new Uint8Array(13);

  // Convert Parseval spectral sums to approximate time-domain RMS/Peak metrics
  const scaleInv = 1 / (fftSize * 0.5);

  for (let s = 0; s < 13; s++) {
    const key = ALL_STEM_KEYS[s];
    const mixShare = stemEnergyAcc[s] / totalEnergyRef;
    const winShare = stemWinEnergyAcc[s] / totalEnergyRef;
    const estRms = Math.sqrt((stemEnergyAcc[s] * scaleInv) / Math.max(1, totalFrameCount * (fftSize * 0.5)));
    const estPeak = Math.sqrt((stemPeakFrameE[s] * scaleInv) / (fftSize * 0.35));
    const rmsDb = estRms > 1e-8 ? 20 * Math.log10(estRms) : -120;
    const peakDb = estPeak > 1e-8 ? 20 * Math.log10(estPeak) : -120;
    const activePct = (stemActiveFrames[s] / totalFrameCount) * 100;
    const domWinPct = (stemDominantWins[s] / Math.max(1, stemActiveFrames[s])) * 100;

    let detected = false;
    const isDrum = s === 0 || s === 1 || s === 2 || s === 3 || s === 12;
    const isBass = s === 4 || s === 5;

    if (mixPeakDb > -55) {
      if (isDrum) {
        const minShare = s === 2 || s === 3 ? 0.0025 : 0.006;
        const minWin = s === 2 || s === 3 ? 0.0015 : 0.003;
        detected =
          stemOnsetCount[s] >= minDrumOnsets &&
          mixShare >= minShare &&
          winShare >= minWin &&
          rmsDb - mixRmsDb > -28 &&
          peakDb > -38;
      } else if (isBass) {
        detected = mixShare >= 0.008 && winShare >= 0.005 && activePct >= 3.0 && rmsDb - mixRmsDb > -24;
      } else {
        // Melodic / Vocal stems: require true primary-bin win energy so secondary fuzzy bleed never spawns empty stems
        detected =
          mixShare >= 0.014 &&
          winShare >= 0.012 &&
          activePct >= 4.0 &&
          rmsDb - mixRmsDb > -24 &&
          (domWinPct >= 6.0 || winShare >= 0.04);
      }
    }

    activeMask[s] = detected ? 1 : 0;
    detectedStems[key] = {
      detected,
      rmsDb,
      peakDb,
      mixSharePct: mixShare * 100,
      activePct,
    };
  }

  // Disambiguate Bass vs Bass Guitar so one bassline doesn't spawn both unnecessarily
  if (activeMask[4] && activeMask[5]) {
    const totalBassE = stemEnergyAcc[4] + stemEnergyAcc[5] + 1e-12;
    if (stemEnergyAcc[4] / totalBassE > 0.84 && stemEnergyAcc[5] / totalEnergyRef < 0.06) {
      activeMask[5] = 0;
      detectedStems.bassGuitar.detected = false;
    } else if (stemEnergyAcc[5] / totalBassE > 0.84 && stemEnergyAcc[4] / totalEnergyRef < 0.06) {
      activeMask[4] = 0;
      detectedStems.bass.detected = false;
    }
  }

  // Safety fallback if track is non-silent but everything fell slightly under threshold
  const anyActive = activeMask.some(v => v === 1);
  if (!anyActive && mixPeakDb > -52) {
    let bestS = 6; // lead
    let maxE = -1;
    for (let s = 0; s < 13; s++) {
      if (stemEnergyAcc[s] > maxE) {
        maxE = stemEnergyAcc[s];
        bestS = s;
      }
    }
    activeMask[bestS] = 1;
    detectedStems[ALL_STEM_KEYS[bestS]].detected = true;
  }

  // Allocate clean output buffers (zero-initialized; inactive stems remain 100% digital zero)
  const buffers = {} as Record<StemKey, { left: Float32Array; right?: Float32Array }>;
  for (let s = 0; s < 13; s++) {
    const key = ALL_STEM_KEYS[s];
    if (STEREO_STEMS.has(key)) {
      buffers[key] = {
        left: new Float32Array(length),
        right: new Float32Array(length),
      };
    } else {
      buffers[key] = { left: new Float32Array(length) };
    }
  }

  // Pass 2: Sharpened Competitive Wiener Soft-Mask Synthesis across ONLY active stems
  const wienerSharpPower = isDeepMode ? 2.4 : 1.9;
  const specReL = new Float32Array(fftSize);
  const specImL = new Float32Array(fftSize);
  const specReR = new Float32Array(fftSize);
  const specImR = new Float32Array(fftSize);

  const activeIndices: number[] = [];
  for (let s = 0; s < 13; s++) if (activeMask[s]) activeIndices.push(s);

  for (let cIdx = 0; cIdx < chunksBounds.length; cIdx++) {
    const { start, end } = chunksBounds[cIdx];
    const pct = 68 + Math.round(((cIdx + 0.5) / chunksBounds.length) * 22);
    onProgress?.(
      pct,
      `Phase 4: Synthesizing ${activeIndices.length} Active Stems via Wiener Soft-Masking (${cIdx + 1}/${
        chunksBounds.length
      })...`
    );
    await yieldToUI();

    const chunk = cacheChunks
      ? cachedChunks[cIdx]
      : analyzeChunkSTFT(
          leftData,
          rightData,
          start,
          end,
          sampleRate,
          fftCtx,
          bandMap,
          isDeepMode,
          isMonoInput
        );

    const chunkLen = end - start;
    const extLen = chunkLen + chunk.padSamples * 2;
    const normEnv = new Float32Array(extLen);

    // Precompute exact COLA normalization window once per chunk
    for (let t = 0; t < chunk.numFrames; t++) {
      const origin = t * fftCtx.hopSize;
      for (let n = 0; n < fftSize; n++) {
        const pos = origin + n;
        if (pos < extLen) {
          normEnv[pos] += fftCtx.hann[n] * fftCtx.hann[n];
        }
      }
    }

    // Allocate per-stem chunk accumulators ONLY for active stems
    const chunkOutL = new Map<number, Float32Array>();
    const chunkOutR = new Map<number, Float32Array>();
    for (const s of activeIndices) {
      chunkOutL.set(s, new Float32Array(extLen));
      if (STEREO_STEMS.has(ALL_STEM_KEYS[s])) {
        chunkOutR.set(s, new Float32Array(extLen));
      }
    }

    // Compute sharpened Wiener masks [activeCount * numBins] per frame & run IFFT overlap-add
    const frameMasks = new Float32Array(activeIndices.length * chunk.numBins);

    for (let t = 0; t < chunk.numFrames; t++) {
      const base = t * chunk.numBins;
      for (let k = 0; k < chunk.numBins; k++) {
        const freq = k * binHz;
        computeFrameBinScores(chunk, t, k, freq, bandMap.binToBand[k], isMonoInput, scores);
        let sumPow = 1e-18;
        for (let ai = 0; ai < activeIndices.length; ai++) {
          const s = activeIndices[ai];
          const val = Math.pow(scores[s], wienerSharpPower);
          frameMasks[ai * chunk.numBins + k] = val;
          sumPow += val;
        }
        const invSum = 1 / sumPow;
        for (let ai = 0; ai < activeIndices.length; ai++) {
          frameMasks[ai * chunk.numBins + k] *= invSum;
        }
      }

      const origin = t * fftCtx.hopSize;

      for (let ai = 0; ai < activeIndices.length; ai++) {
        const s = activeIndices[ai];
        const key = ALL_STEM_KEYS[s];
        const isStereo = STEREO_STEMS.has(key);
        const maskOffset = ai * chunk.numBins;

        // Build Hermitian-symmetric spectrum for IFFT
        specReL[0] = chunk.L_re[base] * frameMasks[maskOffset];
        specImL[0] = 0;
        const nyq = fftSize >> 1;
        specReL[nyq] = chunk.L_re[base + nyq] * frameMasks[maskOffset + nyq];
        specImL[nyq] = 0;

        if (isStereo) {
          specReR[0] = chunk.R_re[base] * frameMasks[maskOffset];
          specImR[0] = 0;
          specReR[nyq] = chunk.R_re[base + nyq] * frameMasks[maskOffset + nyq];
          specImR[nyq] = 0;

          for (let k = 1; k < nyq; k++) {
            const m = frameMasks[maskOffset + k];
            const lr = chunk.L_re[base + k] * m;
            const li = chunk.L_im[base + k] * m;
            const rr = chunk.R_re[base + k] * m;
            const ri = chunk.R_im[base + k] * m;
            specReL[k] = lr;
            specImL[k] = li;
            specReL[fftSize - k] = lr;
            specImL[fftSize - k] = -li;
            specReR[k] = rr;
            specImR[k] = ri;
            specReR[fftSize - k] = rr;
            specImR[fftSize - k] = -ri;
          }

          fftInPlace(specReL, specImL, fftCtx, true);
          fftInPlace(specReR, specImR, fftCtx, true);

          const outL = chunkOutL.get(s)!;
          const outR = chunkOutR.get(s)!;
          for (let n = 0; n < fftSize; n++) {
            const pos = origin + n;
            if (pos < extLen) {
              const w = fftCtx.hann[n];
              outL[pos] += specReL[n] * w;
              outR[pos] += specReR[n] * w;
            }
          }
        } else {
          // Mono stem: sum coherent L+R center spectrum for crisp mono punch
          specReL[0] = 0.5 * (chunk.L_re[base] + chunk.R_re[base]) * frameMasks[maskOffset];
          specReL[nyq] = 0.5 * (chunk.L_re[base + nyq] + chunk.R_re[base + nyq]) * frameMasks[maskOffset + nyq];

          for (let k = 1; k < nyq; k++) {
            const m = frameMasks[maskOffset + k];
            const mr = 0.5 * (chunk.L_re[base + k] + chunk.R_re[base + k]) * m;
            const mi = 0.5 * (chunk.L_im[base + k] + chunk.R_im[base + k]) * m;
            specReL[k] = mr;
            specImL[k] = mi;
            specReL[fftSize - k] = mr;
            specImL[fftSize - k] = -mi;
          }

          fftInPlace(specReL, specImL, fftCtx, true);
          const outL = chunkOutL.get(s)!;
          for (let n = 0; n < fftSize; n++) {
            const pos = origin + n;
            if (pos < extLen) {
              outL[pos] += specReL[n] * fftCtx.hann[n];
            }
          }
        }
      }
    }

    // Copy COLA-normalized interior samples into final stem arrays & measure exact final RMS/Peak
    for (const s of activeIndices) {
      const key = ALL_STEM_KEYS[s];
      const outL = chunkOutL.get(s)!;
      const dstL = buffers[key].left;
      for (let i = 0; i < chunkLen; i++) {
        const srcIdx = chunk.padSamples + i;
        const norm = normEnv[srcIdx] > 1e-6 ? 1 / normEnv[srcIdx] : 1;
        dstL[start + i] = outL[srcIdx] * norm;
      }
      if (STEREO_STEMS.has(key)) {
        const outR = chunkOutR.get(s)!;
        const dstR = buffers[key].right!;
        for (let i = 0; i < chunkLen; i++) {
          const srcIdx = chunk.padSamples + i;
          const norm = normEnv[srcIdx] > 1e-6 ? 1 / normEnv[srcIdx] : 1;
          dstR[start + i] = outR[srcIdx] * norm;
        }
      }
    }
  }

  // Update exact time-domain RMS/Peak/MixShare/ActivePct metrics on final buffers
  const exactEnergies = new Float64Array(13);
  for (let s = 0; s < 13; s++) {
    const key = ALL_STEM_KEYS[s];
    if (!detectedStems[key].detected) {
      detectedStems[key].rmsDb = -120;
      detectedStems[key].peakDb = -120;
      detectedStems[key].mixSharePct = 0;
      detectedStems[key].activePct = 0;
      continue;
    }
    const l = buffers[key].left;
    const r = buffers[key].right || l;
    let sq = 0;
    let pk = 0;
    let act = 0;
    const winStep = Math.max(1, Math.floor(sampleRate * 0.02));
    let winCount = 0;
    const actThresh = Math.max(0.002, mixRms * 0.06);
    for (let i = 0; i < length; i += winStep) {
      let wPk = 0;
      const wEnd = Math.min(length, i + winStep);
      for (let j = i; j < wEnd; j++) {
        const lv = Math.abs(l[j]);
        const rv = Math.abs(r[j]);
        const mv = Math.max(lv, rv);
        if (mv > wPk) wPk = mv;
        if (mv > pk) pk = mv;
        sq += 0.5 * (l[j] * l[j] + r[j] * r[j]);
      }
      if (wPk > actThresh) act++;
      winCount++;
    }
    exactEnergies[s] = sq;
    const rms = Math.sqrt(sq / Math.max(1, length));
    detectedStems[key].rmsDb = rms > 1e-8 ? 20 * Math.log10(rms) : -120;
    detectedStems[key].peakDb = pk > 1e-8 ? 20 * Math.log10(pk) : -120;
    detectedStems[key].mixSharePct = (sq / Math.max(1e-12, mixSqSum)) * 100;
    detectedStems[key].activePct = (act / Math.max(1, winCount)) * 100;
  }

  return { buffers, detectedBpm, detectedStems };
}

/**
 * Dual-Band Comb-Filter Tempogram BPM Estimator
 * Separately normalizes sub/kick flux (25-145 Hz) and melodic/snare flux (150-4500 Hz)
 * so kick pulses aren't drowned out by dense synth lines, and resolves 2/3 & 2x ambiguities.
 */
export function estimateBpmFromDualFlux(
  lowFlux: Float32Array,
  midFlux: Float32Array,
  hopSec: number
): number {
  const N = lowFlux.length;
  if (N < 40 || hopSec <= 0) return 128;

  const halfWin = Math.max(3, Math.round(0.24 / hopSec));
  const buildOnset = (flux: Float32Array) => {
    const out = new Float32Array(N);
    let mean = 0;
    let sq = 0;
    for (let i = 0; i < N; i++) {
      const a = Math.max(0, i - halfWin);
      const b = Math.min(N - 1, i + halfWin);
      let s = 0;
      for (let j = a; j <= b; j++) s += flux[j];
      const v = Math.max(0, flux[i] - (s / (b - a + 1)) * 1.05);
      out[i] = v;
      mean += v;
      sq += v * v;
    }
    const rms = Math.sqrt(sq / N) + 1e-9;
    return { out, rms, hasSignal: mean / N > 1e-4 };
  };

  const low = buildOnset(lowFlux);
  const mid = buildOnset(midFlux);
  if (!low.hasSignal && !mid.hasSignal) return 128;

  // Combine variance-normalized low & mid onset curves (weight low-end kick beats heavily when present)
  const onset = new Float32Array(N);
  const wLow = low.hasSignal ? 2.2 / low.rms : 0;
  const wMid = mid.hasSignal ? 1.0 / mid.rms : 0;
  for (let i = 0; i < N; i++) {
    onset[i] = low.out[i] * wLow + mid.out[i] * wMid;
  }

  const maxLag = Math.min(N - 2, Math.ceil((4 * 60) / (65 * hopSec)) + 4);
  const acf = new Float32Array(maxLag + 1);
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0;
    const limit = N - lag;
    for (let i = 0; i < limit; i++) {
      sum += onset[i] * onset[i + lag];
    }
    acf[lag] = sum / Math.max(1, limit);
  }

  const getAcf = (lagF: number): number => {
    if (lagF < 1 || lagF >= maxLag) return 0;
    const i0 = Math.floor(lagF);
    const frac = lagF - i0;
    return acf[i0] * (1 - frac) + acf[i0 + 1] * frac;
  };

  let bestBpm = 128;
  let bestScore = -1;

  for (let bpm = 68; bpm <= 176; bpm++) {
    const period = 60 / (bpm * hopSec);
    const comb =
      getAcf(period) * 1.2 +
      getAcf(period * 2) * 0.9 +
      getAcf(period * 4) * 0.65 +
      getAcf(period * 0.5) * 0.25;

    const logDist = Math.log2(bpm / 122);
    const prior = Math.exp(-0.5 * (logDist / 0.45) * (logDist / 0.45));
    const score = comb * (0.76 + 0.24 * prior);

    if (score > bestScore) {
      bestScore = score;
      bestBpm = bpm;
    }
  }

  return bestBpm;
}

/**
 * Pure Neural-to-13-Stem Sub-Splitter:
 * Receives 6 crystal-clear neural stems from HTDemucs 6-Stem (drums, bass, other, vocals, guitar, piano)
 * and sub-splits ONLY inside each isolated stem so zero cross-bleed can occur between instruments.
 */
export async function subSplitFromNeuralSixStems(
  neural: NeuralSixStemResult['stems'],
  mixLeft: Float32Array,
  mixRight: Float32Array,
  sampleRate: number = 44100,
  forceMonoInput: boolean = false
): Promise<RawSeparatedStemData> {
  const length = mixLeft.length;

  const measureAudio = (left: Float32Array, right: Float32Array, mixRms: number) => {
    let sq = 0;
    let pk = 0;
    let act = 0;
    let winCount = 0;
    const winStep = Math.max(1, Math.floor(sampleRate * 0.02));
    const actThresh = Math.max(0.002, mixRms * 0.055);
    for (let i = 0; i < left.length; i += winStep) {
      let wPk = 0;
      const wEnd = Math.min(left.length, i + winStep);
      for (let j = i; j < wEnd; j++) {
        const mv = Math.max(Math.abs(left[j]), Math.abs(right[j]));
        if (mv > wPk) wPk = mv;
        if (mv > pk) pk = mv;
        sq += 0.5 * (left[j] * left[j] + right[j] * right[j]);
      }
      if (wPk > actThresh) act++;
      winCount++;
    }
    const rms = Math.sqrt(sq / Math.max(1, left.length));
    return {
      sq,
      rms,
      rmsDb: rms > 1e-8 ? 20 * Math.log10(rms) : -120,
      peakDb: pk > 1e-8 ? 20 * Math.log10(pk) : -120,
      activePct: (act / Math.max(1, winCount)) * 100,
    };
  };

  let mixSqSum = 0;
  for (let i = 0; i < length; i++) {
    mixSqSum += 0.5 * (mixLeft[i] * mixLeft[i] + mixRight[i] * mixRight[i]);
  }
  const mixRms = Math.sqrt(mixSqSum / Math.max(1, length));
  const mixRmsDb = mixRms > 1e-8 ? 20 * Math.log10(mixRms) : -120;

  const buffers = {} as Record<StemKey, { left: Float32Array; right?: Float32Array }>;
  const detectedStems = {} as Record<StemKey, StemDetectionInfo>;
  for (const k of ALL_STEM_KEYS) {
    buffers[k] = STEREO_STEMS.has(k)
      ? { left: new Float32Array(length), right: new Float32Array(length) }
      : { left: new Float32Array(length) };
    detectedStems[k] = { detected: false, rmsDb: -120, peakDb: -120, mixSharePct: 0, activePct: 0 };
  }

  const recordStem = (key: StemKey, left: Float32Array, right?: Float32Array, minShare = 0.008) => {
    const r = right || left;
    const m = measureAudio(left, r, mixRms);
    const mixShare = m.sq / Math.max(1e-12, mixSqSum);
    const detected =
      mixShare >= minShare &&
      m.peakDb > -42 &&
      m.rmsDb - mixRmsDb > -28 &&
      m.activePct >= 2.0;

    if (detected) {
      if (STEREO_STEMS.has(key)) {
        buffers[key] = { left, right: r };
      } else {
        const mono = new Float32Array(length);
        for (let i = 0; i < length; i++) mono[i] = 0.5 * (left[i] + r[i]);
        buffers[key] = { left: mono };
      }
      detectedStems[key] = {
        detected: true,
        rmsDb: m.rmsDb,
        peakDb: m.peakDb,
        mixSharePct: mixShare * 100,
        activePct: m.activePct,
      };
    }
  };

  // 1. Direct neural Vocals & Piano (already isolated cleanly by HTDemucs)
  recordStem('vocal', neural.vocals.left, neural.vocals.right, 0.007);
  recordStem('piano', neural.piano.left, neural.piano.right, 0.008);

  // 2. Neural Bass -> Synth Bass vs Bass Guitar (classified cleanly via sub-vs-mid harmonic ratio)
  const bassStats = measureAudio(neural.bass.left, neural.bass.right, mixRms);
  if (bassStats.sq / Math.max(1e-12, mixSqSum) >= 0.006 && bassStats.peakDb > -40) {
    // Simple 1-pole energy split at ~145 Hz on neural bass to tell sub-808/synth vs plucked bass guitar
    const lpA = Math.exp((-2 * Math.PI * 145) / sampleRate);
    let lpState = 0;
    let lowE = 0;
    let hiE = 0;
    for (let i = 0; i < length; i++) {
      const m = 0.5 * (neural.bass.left[i] + neural.bass.right[i]);
      lpState = m + lpA * (lpState - m);
      const hi = m - lpState;
      lowE += lpState * lpState;
      hiE += hi * hi;
    }
    const subRatio = lowE / (lowE + hiE + 1e-12);
    if (subRatio >= 0.55) {
      recordStem('bass', neural.bass.left, neural.bass.right, 0.006);
    } else {
      recordStem('bassGuitar', neural.bass.left, neural.bass.right, 0.006);
    }
  }

  // 3. Neural Guitar -> Acoustic Guitar vs Lead Guitar
  const gtrStats = measureAudio(neural.guitar.left, neural.guitar.right, mixRms);
  if (gtrStats.sq / Math.max(1e-12, mixSqSum) >= 0.008 && gtrStats.peakDb > -40) {
    // Check >3kHz acoustic string shimmer vs 400-2500Hz electric midrange bite
    const lp3k = Math.exp((-2 * Math.PI * 3000) / sampleRate);
    let lp = 0;
    let bodyE = 0;
    let airE = 0;
    for (let i = 0; i < length; i++) {
      const m = 0.5 * (neural.guitar.left[i] + neural.guitar.right[i]);
      lp = m + lp3k * (lp - m);
      const hi = m - lp;
      bodyE += lp * lp;
      airE += hi * hi;
    }
    const airRatio = airE / (bodyE + airE + 1e-12);
    if (airRatio >= 0.14) {
      recordStem('acousticGuitar', neural.guitar.left, neural.guitar.right, 0.008);
    } else {
      recordStem('leadGuitar', neural.guitar.left, neural.guitar.right, 0.008);
    }
  }

  // 4. Neural "Other" -> Cleanly sub-split into Lead Synth vs Pad Chords via STFT stereo/sustain analysis
  const otherStats = measureAudio(neural.other.left, neural.other.right, mixRms);
  if (otherStats.sq / Math.max(1e-12, mixSqSum) >= 0.008 && otherStats.peakDb > -40) {
    const otherSplit = await separateRawChannelsIntoStems(
      neural.other.left,
      neural.other.right,
      sampleRate,
      undefined,
      false,
      forceMonoInput
    );
    // Combine melodic outputs safely within neural 'other' (zero drum/bass/vocal interference)
    const leadL = new Float32Array(length);
    const leadR = new Float32Array(length);
    const padL = new Float32Array(length);
    const padR = new Float32Array(length);
    let leadEnergy = 0;
    let padEnergy = 0;

    for (let i = 0; i < length; i++) {
      // Any residual non-pad harmonic focus inside 'other' stays on Lead Synth; wide/slow beds stay on Pad
      const pL = otherSplit.buffers.pad.left[i];
      const pR = (otherSplit.buffers.pad.right || otherSplit.buffers.pad.left)[i];
      const lL = neural.other.left[i] - pL;
      const lR = neural.other.right[i] - pR;
      padL[i] = pL;
      padR[i] = pR;
      leadL[i] = lL;
      leadR[i] = lR;
      padEnergy += 0.5 * (pL * pL + pR * pR);
      leadEnergy += 0.5 * (lL * lL + lR * lR);
    }
    if (leadEnergy / Math.max(1e-12, mixSqSum) >= 0.008) {
      recordStem('lead', leadL, leadR, 0.008);
    }
    if (padEnergy / Math.max(1e-12, mixSqSum) >= 0.008) {
      recordStem('pad', padL, padR, 0.008);
    }
  }

  // 5. Neural Drums -> Cleanly sub-split into Kick, Snare/Clap, Hi-Hats, Open Hat & Perc via STFT+HPSS
  const drumStats = measureAudio(neural.drums.left, neural.drums.right, mixRms);
  let detectedBpm = 128;
  if (drumStats.sq / Math.max(1e-12, mixSqSum) >= 0.005 && drumStats.peakDb > -40) {
    const drumSplit = await separateRawChannelsIntoStems(
      neural.drums.left,
      neural.drums.right,
      sampleRate,
      undefined,
      false,
      forceMonoInput
    );
    detectedBpm = drumSplit.detectedBpm;

    for (const dKey of ['kick', 'snare', 'hihat', 'openhat', 'perc'] as const) {
      const entry = drumSplit.buffers[dKey];
      const minShare = dKey === 'hihat' || dKey === 'openhat' ? 0.0018 : 0.0035;
      if (drumSplit.detectedStems[dKey].detected) {
        recordStem(dKey, entry.left, entry.right, minShare);
      }
    }
  } else {
    // Drumless track: estimate BPM from full mix STFT flux
    const mixSplit = await separateRawChannelsIntoStems(
      mixLeft,
      mixRight,
      sampleRate,
      undefined,
      false,
      forceMonoInput
    );
    detectedBpm = mixSplit.detectedBpm;
  }

  // Fallback guarantee if all sub-gates were ultra-strict on a quiet track
  const anyActive = ALL_STEM_KEYS.some(k => detectedStems[k].detected);
  if (!anyActive && drumStats.sq + otherStats.sq > 1e-8) {
    if (otherStats.sq >= drumStats.sq) {
      recordStem('lead', neural.other.left, neural.other.right, 0.0001);
    } else {
      recordStem('perc', neural.drums.left, neural.drums.right, 0.0001);
    }
  }

  return { buffers, detectedBpm, detectedStems };
}
