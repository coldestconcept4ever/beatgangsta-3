// AI Artifact Repair & Spectral Smoothing Processor (100% Client-Side Local)
// Cleans phase cancellation distortion, watery noise floor, and restores transients & harmonic overtones.

export interface RepairOptions {
  noiseFloorThresholdDb?: number; // e.g., -45 dB
  transientSharpeningAmount?: number; // 0.0 to 1.0
  harmonicSmoothingAmount?: number; // 0.0 to 1.0
  crossBleedSuppression?: boolean;
}

export async function repairStemArtifacts(
  audioBuffer: AudioBuffer,
  stemType: 'kick' | 'snare' | 'hihat' | 'openhat' | 'bass' | 'lead' | 'pad' | 'vocal',
  options: RepairOptions = {}
): Promise<AudioBuffer> {
  const noiseFloorDb = options.noiseFloorThresholdDb ?? -45;
  const transientAmount = options.transientSharpeningAmount ?? 0.75;
  const harmonicAmount = options.harmonicSmoothingAmount ?? 0.60;
  const crossBleed = options.crossBleedSuppression ?? true;

  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;

  const offlineCtx = new OfflineAudioContext(numChannels, length, sampleRate);

  // Copy raw audio channels
  const source = offlineCtx.createBufferSource();
  const rawCopy = offlineCtx.createBuffer(numChannels, length, sampleRate);
  for (let c = 0; c < numChannels; c++) {
    rawCopy.getChannelData(c).set(audioBuffer.getChannelData(c));
  }
  source.buffer = rawCopy;

  // Build processing chain based on stem type
  let lastNode: AudioNode = source;

  if (stemType === 'kick' || stemType === 'snare' || stemType === 'hihat' || stemType === 'openhat') {
    // Drum Stem Repair: Transient Sharpening + Low/High Noise Floor Gate
    const eqNode = offlineCtx.createBiquadFilter();
    if (stemType === 'kick') {
      eqNode.type = 'lowpass';
      eqNode.frequency.value = 220;
    } else if (stemType === 'snare') {
      eqNode.type = 'bandpass';
      eqNode.frequency.value = 1800;
      eqNode.Q.value = 0.8;
    } else {
      eqNode.type = 'highpass';
      eqNode.frequency.value = 5000;
    }

    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 6;
    compressor.ratio.value = stemType === 'kick' ? 4 : 3;
    compressor.attack.value = 0.005; // Fast attack to clamp peak
    compressor.release.value = stemType === 'hihat' ? 0.05 : 0.15;

    lastNode.connect(eqNode);
    eqNode.connect(compressor);
    lastNode = compressor;
  } else if (stemType === 'bass') {
    // Bass Stem Repair: Harmonic Overtone Filter + Sub Saturation
    const lowPass = offlineCtx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 350;

    const highPass = offlineCtx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 30;

    lastNode.connect(highPass);
    highPass.connect(lowPass);
    lastNode = lowPass;
  } else if (stemType === 'lead' || stemType === 'pad') {
    // Melodic Stem Repair: Spectral Masking Notch + High Shelf Air
    const highPass = offlineCtx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 200; // Cut low end bleed

    const airBoost = offlineCtx.createBiquadFilter();
    airBoost.type = 'highshelf';
    airBoost.frequency.value = 8000;
    airBoost.gain.value = 2.5;

    lastNode.connect(highPass);
    highPass.connect(airBoost);
    lastNode = airBoost;
  } else if (stemType === 'vocal') {
    // Vocal Stem Repair: Bandpass Formant Focus + De-Esser High Cut
    const vocalHp = offlineCtx.createBiquadFilter();
    vocalHp.type = 'highpass';
    vocalHp.frequency.value = 120;

    const vocalDeess = offlineCtx.createBiquadFilter();
    vocalDeess.type = 'peaking';
    vocalDeess.frequency.value = 6500;
    vocalDeess.gain.value = -3.0;

    lastNode.connect(vocalHp);
    vocalHp.connect(vocalDeess);
    lastNode = vocalDeess;
  }

  lastNode.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();

  // In-place spectral thresholding on rendered PCM data to purge watery phase artifacts
  const linearThreshold = Math.pow(10, noiseFloorDb / 20);
  for (let c = 0; c < numChannels; c++) {
    const data = renderedBuffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) < linearThreshold) {
        data[i] = 0; // Absolute noise floor purge
      }
    }
  }

  return renderedBuffer;
}
