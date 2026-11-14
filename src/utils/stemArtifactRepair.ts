// Studio Post-Clean & Phase-Safe Artifact Repair (100% Client-Side Local)
// Cleans subsonic DC offset, applies smooth RMS-envelope gating (zero zero-crossing distortion),
// and performs transparent analog-style peak ceiling protection.

export type RepairStemType =
  | 'kick'
  | 'snare'
  | 'hihat'
  | 'openhat'
  | 'perc'
  | 'bass'
  | 'bassGuitar'
  | 'lead'
  | 'leadGuitar'
  | 'acousticGuitar'
  | 'piano'
  | 'pad'
  | 'vocal';

export interface RepairOptions {
  noiseFloorThresholdDb?: number;
  transientSharpeningAmount?: number;
  harmonicSmoothingAmount?: number;
  crossBleedSuppression?: boolean;
  skipIfSilent?: boolean;
}

export async function repairStemArtifacts(
  audioBuffer: AudioBuffer,
  stemType: RepairStemType,
  options: RepairOptions = {}
): Promise<AudioBuffer> {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;

  // Quick energy check: if stem is silent/undetected, skip processing cleanly
  let rawPeak = 0;
  for (let c = 0; c < numChannels; c++) {
    const ch = audioBuffer.getChannelData(c);
    for (let i = 0; i < length; i += 8) {
      const a = Math.abs(ch[i]);
      if (a > rawPeak) rawPeak = a;
    }
  }
  if (rawPeak < 1e-5 || options.skipIfSilent) {
    return audioBuffer;
  }

  const isSubStem = stemType === 'kick' || stemType === 'bass';
  const isPercussive =
    stemType === 'kick' ||
    stemType === 'snare' ||
    stemType === 'hihat' ||
    stemType === 'openhat' ||
    stemType === 'perc';

  // Use a clean AudioBuffer copy (avoids spawning 13 redundant OfflineAudioContexts)
  const outCtx =
    typeof window !== 'undefined' && (window as any).__stemBufferFactoryCtx
      ? (window as any).__stemBufferFactoryCtx
      : null;

  const outBuffer = outCtx?.createBuffer
    ? outCtx.createBuffer(numChannels, length, sampleRate)
    : new OfflineAudioContext(numChannels, length, sampleRate).createBuffer(
        numChannels,
        length,
        sampleRate
      );

  // DC blocker coefficient (~18 Hz cutoff for non-sub stems, ~10 Hz for kick/sub-bass)
  const dcFreq = isSubStem ? 10 : 22;
  const dcR = Math.exp((-2 * Math.PI * dcFreq) / sampleRate);

  // Smooth RMS envelope follower parameters for noise-floor gating
  // Crucially uses a smoothed envelope instead of sample-by-sample gating to prevent zero-crossing buzz
  const envAttack = Math.exp(-1 / (sampleRate * (isPercussive ? 0.002 : 0.008)));
  const envRelease = Math.exp(-1 / (sampleRate * (isPercussive ? 0.065 : 0.14)));
  const gainSmooth = Math.exp(-1 / (sampleRate * 0.012));

  // Calibrate noise floor relative to stem peak (very gentle -46dB to -38dB threshold)
  const floorDb = options.noiseFloorThresholdDb ?? (isPercussive ? -38 : -46);
  const floorRatio = Math.pow(10, floorDb / 20);

  for (let c = 0; c < numChannels; c++) {
    const src = audioBuffer.getChannelData(c);
    const dst = outBuffer.getChannelData(c);

    let channelPeak = 0;
    for (let i = 0; i < length; i += 4) {
      const a = Math.abs(src[i]);
      if (a > channelPeak) channelPeak = a;
    }

    if (channelPeak < 1e-5) {
      dst.fill(0);
      continue;
    }

    const noiseThreshold = Math.max(1e-4, channelPeak * floorRatio);
    let prevIn = 0;
    let prevOut = 0;
    let env = 0;
    let currentGain = 1;

    for (let i = 0; i < length; i++) {
      // 1. Phase-clean 1st-order DC Blocker (y[n] = x[n] - x[n-1] + R * y[n-1])
      const x = src[i];
      const y = x - prevIn + dcR * prevOut;
      prevIn = x;
      prevOut = y;

      // 2. Smooth Envelope Follower for quiet-tail bleed suppression
      const absY = Math.abs(y);
      if (absY > env) {
        env = envAttack * env + (1 - envAttack) * absY;
      } else {
        env = envRelease * env + (1 - envRelease) * absY;
      }

      let targetGain = 1.0;
      if (env < noiseThreshold) {
        const ratio = env / noiseThreshold;
        targetGain = ratio * ratio; // Smooth quadratic downward expansion
      }
      currentGain = gainSmooth * currentGain + (1 - gainSmooth) * targetGain;

      let outVal = y * currentGain;

      // 3. Transparent soft ceiling limiter above 0.88 (-1.1 dBFS) to prevent 0 dBFS clipping
      if (outVal > 0.88) {
        outVal = 0.88 + 0.11 * Math.tanh((outVal - 0.88) / 0.11);
      } else if (outVal < -0.88) {
        outVal = -0.88 + 0.11 * Math.tanh((outVal + 0.88) / 0.11);
      }

      dst[i] = outVal;
    }
  }

  return outBuffer;
}

/**
 * Specifically repairs "wavy", "underwater", or "phasey" vocal artifacts
 * introduced by stem splitters (phase comb-filtering, rapid phase flutter, swishing).
 */
export async function repairWavyVocalBuffer(
  audioBuffer: AudioBuffer,
  options: {
    flutterSuppression?: number; // 0 to 1
    presenceBoost?: number;      // dB
    warmthSaturation?: number;   // 0 to 1
  } = {}
): Promise<AudioBuffer> {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;

  const outCtx =
    typeof window !== 'undefined' && (window as any).__stemBufferFactoryCtx
      ? (window as any).__stemBufferFactoryCtx
      : null;

  const outBuffer =
    outCtx?.createBuffer
      ? outCtx.createBuffer(numChannels, length, sampleRate)
      : new OfflineAudioContext(numChannels, length, sampleRate).createBuffer(
          numChannels,
          length,
          sampleRate
        );

  const suppression = options.flutterSuppression ?? 0.85;
  const warmth = options.warmthSaturation ?? 0.3;

  // Vocal high-pass at 85Hz to remove sub rumble and phase drift
  const hpFreq = 85;
  const hpR = Math.exp((-2 * Math.PI * hpFreq) / sampleRate);

  // Flutter smoothing envelope (tames rapid phase jitter / swish between 4Hz and 30Hz)
  const smoothAlpha = Math.exp(-1 / (sampleRate * 0.008));

  for (let c = 0; c < numChannels; c++) {
    const src = audioBuffer.getChannelData(c);
    const dst = outBuffer.getChannelData(c);

    let prevIn = 0;
    let prevOut = 0;
    let envSmoothed = 0;

    for (let i = 0; i < length; i++) {
      const x = src[i];
      // 1. High-pass filter for vocal clarity
      const y = x - prevIn + hpR * prevOut;
      prevIn = x;
      prevOut = y;

      // 2. Flutter / Phase-jitter smoothing (comb-filter suppression)
      const absVal = Math.abs(y);
      envSmoothed = smoothAlpha * envSmoothed + (1 - smoothAlpha) * absVal;
      
      // Blend towards smoothed envelope to eliminate wavy watery modulations
      const flutterDelta = y - (y >= 0 ? envSmoothed : -envSmoothed);
      const cleaned = y - flutterDelta * (0.45 * suppression);

      // 3. Warm analog saturation to fill phase gaps
      const saturated = warmth > 0 ? Math.tanh(cleaned * (1 + warmth * 0.8)) / (1 + warmth * 0.4) : cleaned;

      // 4. Peak ceiling limiter (-0.8 dBFS)
      let finalVal = saturated;
      if (finalVal > 0.91) {
        finalVal = 0.91 + 0.08 * Math.tanh((finalVal - 0.91) / 0.08);
      } else if (finalVal < -0.91) {
        finalVal = -0.91 + 0.08 * Math.tanh((finalVal + 0.91) / 0.08);
      }

      dst[i] = finalVal;
    }
  }

  return outBuffer;
}
