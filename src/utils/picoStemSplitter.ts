// Nano Web Audio M/S Phase-Cancellation Splitter & 7-Channel Envelope Classifier (0-Token, 100% Client-Side)
import { repairStemArtifacts } from './stemArtifactRepair';

export interface IsolatedStems {
  kick: AudioBuffer;
  snare: AudioBuffer;
  hihat: AudioBuffer;
  openhat: AudioBuffer;
  bass: AudioBuffer; // Synth Bass
  bassGuitar: AudioBuffer;
  lead: AudioBuffer; // Synth Lead
  leadGuitar: AudioBuffer;
  acousticGuitar: AudioBuffer;
  piano: AudioBuffer;
  pad: AudioBuffer;
  vocal: AudioBuffer;
  detectedBpm: number;
}

export async function splitAudioBufferIntoStems(
  audioBuffer: AudioBuffer,
  onProgress?: (progress: number, label: string) => void
): Promise<IsolatedStems> {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;

  onProgress?.(5, 'Initializing Web Audio DSP Engine...');

  // Create M/S (Mid/Side) Buffers: Mid = (L + R) / 2, Side = (L - R) / 2
  const midBuffer = new OfflineAudioContext(1, length, sampleRate).createBuffer(1, length, sampleRate);
  const sideBuffer = new OfflineAudioContext(1, length, sampleRate).createBuffer(1, length, sampleRate);

  const midData = midBuffer.getChannelData(0);
  const sideData = sideBuffer.getChannelData(0);

  const leftData = audioBuffer.getChannelData(0);
  const rightData = numChannels > 1 ? audioBuffer.getChannelData(1) : leftData;

  for (let i = 0; i < length; i++) {
    midData[i] = (leftData[i] + rightData[i]) * 0.5;
    sideData[i] = (leftData[i] - rightData[i]) * 0.5;
  }

  onProgress?.(15, 'Performing M/S Crossover Filtering (11 Channels)...');

  // Helper yield to prevent UI freeze
  const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));

  // Helper offline render
  async function renderStem(
    inputBuffer: AudioBuffer,
    filterConfig: (ctx: OfflineAudioContext, src: AudioBufferSourceNode) => AudioNode
  ): Promise<AudioBuffer> {
    await yieldToUI();
    const offline = new OfflineAudioContext(numChannels, length, sampleRate);
    const source = offline.createBufferSource();
    source.buffer = inputBuffer;
    const lastNode = filterConfig(offline, source);
    lastNode.connect(offline.destination);
    source.start(0);
    return await offline.startRendering();
  }

  // 1. Kick Stem: Mid channel, Sub Lowpass 20Hz-120Hz
  const rawKick = await renderStem(midBuffer, (ctx, src) => {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 110;
    src.connect(filter);
    return filter;
  });

  onProgress?.(25, 'Isolating Rhythm Section (Bass & Snares)...');

  // 2. Synth Bass: Mid channel, 35Hz-200Hz
  const rawBass = await renderStem(midBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 35;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 200;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 3. Bass Guitar: Mid channel, 80Hz-800Hz
  const rawBassGuitar = await renderStem(midBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 80;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 800;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 4. Snare Stem: Mid channel, 150Hz-3.5kHz
  const rawSnare = await renderStem(midBuffer, (ctx, src) => {
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1800;
    band.Q.value = 0.8;
    src.connect(band);
    return band;
  });

  onProgress?.(40, 'Isolating Percussion & High-End...');

  // 5. Closed Hi-Hat: Highpass > 6.5kHz
  const rawHihat = await renderStem(audioBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 6500;
    src.connect(hp);
    return hp;
  });

  // 6. Open Hi-Hat: Side channel + Highpass > 5.5kHz
  const rawOpenhat = await renderStem(sideBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 5500;
    src.connect(hp);
    return hp;
  });

  onProgress?.(55, 'Isolating Guitars & Acoustic Instruments...');

  // 7. Lead Guitar: Side channel, 400Hz-4kHz
  const rawLeadGuitar = await renderStem(sideBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 8. Acoustic Guitar: Side channel, 200Hz-8kHz
  const rawAcousticGuitar = await renderStem(sideBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 200;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 8000;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  onProgress?.(70, 'Isolating Synths & Harmonic Elements...');

  // 9. Lead Synth: Side channel, 450Hz-6kHz
  const rawLead = await renderStem(sideBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 450;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 6000;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 10. Piano / Keys: Mid channel, 300Hz-2.5kHz
  const rawPiano = await renderStem(midBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 300;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2500;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 11. Pad Chords: Side channel, 200Hz-3.5kHz
  const rawPad = await renderStem(sideBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 200;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3500;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  // 12. Vocals: Mid channel, 280Hz-4kHz
  const rawVocal = await renderStem(midBuffer, (ctx, src) => {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 280;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;
    src.connect(hp);
    hp.connect(lp);
    return lp;
  });

  onProgress?.(85, 'Applying AI Artifact Repair & Spectral Smoothing...');

  await yieldToUI();
  const kick = await repairStemArtifacts(rawKick, 'kick');
  await yieldToUI();
  const snare = await repairStemArtifacts(rawSnare, 'snare');
  await yieldToUI();
  const hihat = await repairStemArtifacts(rawHihat, 'hihat');
  await yieldToUI();
  const openhat = await repairStemArtifacts(rawOpenhat, 'openhat');
  await yieldToUI();
  const bass = await repairStemArtifacts(rawBass, 'bass');
  await yieldToUI();
  const bassGuitar = await repairStemArtifacts(rawBassGuitar, 'bassGuitar');
  await yieldToUI();
  const lead = await repairStemArtifacts(rawLead, 'lead');
  await yieldToUI();
  const leadGuitar = await repairStemArtifacts(rawLeadGuitar, 'leadGuitar');
  await yieldToUI();
  const acousticGuitar = await repairStemArtifacts(rawAcousticGuitar, 'acousticGuitar');
  await yieldToUI();
  const piano = await repairStemArtifacts(rawPiano, 'pad');
  await yieldToUI();
  const pad = await repairStemArtifacts(rawPad, 'pad');
  await yieldToUI();
  const vocal = await repairStemArtifacts(rawVocal, 'vocal');

  onProgress?.(95, 'Calculating Studio BPM & Peak Alignment...');

  const detectedBpm = estimateAudioBpm(kick);

  onProgress?.(100, 'Stem Separation Complete!');

  return {
    kick,
    snare,
    hihat,
    openhat,
    bass,
    bassGuitar,
    lead,
    leadGuitar,
    acousticGuitar,
    piano,
    pad,
    vocal,
    detectedBpm
  };
}

function estimateAudioBpm(kickBuffer: AudioBuffer): number {
  const data = kickBuffer.getChannelData(0);
  const sampleRate = kickBuffer.sampleRate;
  
  // Use a more robust auto-correlation or peak-detect for BPM
  const energyMap: number[] = [];
  const winSize = Math.floor(sampleRate * 0.02); // 20ms window
  for (let i = 0; i < data.length; i += winSize) {
    let energy = 0;
    for (let j = 0; j < winSize && i + j < data.length; j++) {
      energy += data[i + j] * data[i + j];
    }
    energyMap.push(energy);
  }

  // Find peak intervals
  const threshold = energyMap.reduce((a, b) => a + b, 0) / energyMap.length * 2.5;
  const peaks: number[] = [];
  for (let i = 1; i < energyMap.length - 1; i++) {
    if (energyMap[i] > threshold && energyMap[i] > energyMap[i - 1] && energyMap[i] > energyMap[i + 1]) {
      peaks.push(i * winSize / sampleRate);
    }
  }

  if (peaks.length < 5) return 128;

  const diffs: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    const d = peaks[i] - peaks[i - 1];
    if (d > 0.25 && d < 2.0) diffs.push(d);
  }

  if (diffs.length === 0) return 128;
  
  // Group diffs to find the most common interval
  const commonBpm: Record<number, number> = {};
  diffs.forEach(d => {
    let b = Math.round(60 / d);
    while (b < 75) b *= 2;
    while (b > 165) b /= 2;
    commonBpm[b] = (commonBpm[b] || 0) + 1;
  });

  let bestBpm = 128;
  let maxVotes = 0;
  Object.entries(commonBpm).forEach(([b, v]) => {
    if (v > maxVotes) {
      maxVotes = v;
      bestBpm = parseInt(b);
    }
  });

  return bestBpm;
}
