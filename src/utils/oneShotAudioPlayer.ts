import { SampleVaultItem } from '../types';

let sharedAudioCtx: AudioContext | null = null;
let currentHtmlAudio: HTMLAudioElement | null = null;
let activeSources: (AudioBufferSourceNode | OscillatorNode)[] = [];
let playbackTimer: number | null = null;

export const initSharedAudioContext = (): AudioContext => {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

export const stopAllVaultAudio = () => {
  if (currentHtmlAudio) {
    try {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
    } catch {}
    currentHtmlAudio = null;
  }
  if (activeSources.length > 0) {
    activeSources.forEach(s => {
      try {
        s.stop();
      } catch {}
    });
    activeSources = [];
  }
  if (playbackTimer !== null) {
    window.clearTimeout(playbackTimer);
    playbackTimer = null;
  }
};

/**
 * High-fidelity Web Audio DSP Synthesizer for One-Shot Auditions
 * Produces crisp, punchy audio tailored to sample characteristics.
 */
export const playSampleDspFallback = (sample: SampleVaultItem, volume: number = 0.85): number => {
  const ctx = initSharedAudioContext();
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.max(0.1, Math.min(1.0, volume)), now);
  masterGain.connect(ctx.destination);

  const decaySec = Math.max(0.08, Math.min(2.5, (sample.decayMs || 150) / 1000));
  const punch = sample.punchFrequencyHz || sample.fundamentalHz || 100;
  const fund = sample.fundamentalHz || punch;

  if (sample.category === '808s') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fund + 15, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, fund), now + 0.04);

    gain.gain.setValueAtTime(0.95, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + decaySec);
    activeSources.push(osc);
    return decaySec * 1000;
  }

  if (sample.category === 'kicks') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.max(140, punch * 2.2), now);
    osc.frequency.exponentialRampToValueAtTime(punch, now + 0.035);
    osc.frequency.exponentialRampToValueAtTime(35, now + decaySec);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + decaySec);
    activeSources.push(osc);

    // Transient snap
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(750, now);
    clickGain.gain.setValueAtTime(0.5, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);
    activeSources.push(clickOsc);
    return Math.max(250, decaySec * 1000);
  }

  if (sample.category === 'snares') {
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.type = 'triangle';
    toneOsc.frequency.setValueAtTime(punch, now);
    toneOsc.frequency.exponentialRampToValueAtTime(punch * 0.75, now + 0.1);
    toneGain.gain.setValueAtTime(0.7, now);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    toneOsc.connect(toneGain);
    toneGain.connect(masterGain);
    toneOsc.start(now);
    toneOsc.stop(now + 0.15);
    activeSources.push(toneOsc);

    // White noise body
    const bufferSize = Math.floor(ctx.sampleRate * Math.min(0.4, decaySec));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);
    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start(now);
    whiteNoise.stop(now + decaySec);
    activeSources.push(whiteNoise);
    return Math.max(300, decaySec * 1000);
  }

  if (sample.category === 'claps') {
    [0, 0.011, 0.024].forEach((flamOffset, idx) => {
      const flamLen = idx === 2 ? decaySec : 0.015;
      const bufSize = Math.floor(ctx.sampleRate * flamLen);
      const nBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const out = nBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = nBuf;
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.setValueAtTime(1200, now + flamOffset);
      band.Q.setValueAtTime(1.5, now + flamOffset);
      const g = ctx.createGain();
      g.gain.setValueAtTime(idx === 2 ? 0.9 : 0.5, now + flamOffset);
      g.gain.exponentialRampToValueAtTime(0.0001, now + flamOffset + flamLen);
      src.connect(band);
      band.connect(g);
      g.connect(masterGain);
      src.start(now + flamOffset);
      src.stop(now + flamOffset + flamLen);
      activeSources.push(src);
    });
    return Math.max(300, (decaySec + 0.03) * 1000);
  }

  if (sample.category === 'closed_hats' || sample.category === 'open_hats' || sample.category === 'cymbals') {
    const hatLen = sample.category === 'closed_hats' ? Math.min(0.12, decaySec) : Math.max(0.4, decaySec);
    const bufSize = Math.floor(ctx.sampleRate * hatLen);
    const nBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const out = nBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = nBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(sample.spectralCentroidHz ? Math.max(3500, sample.spectralCentroidHz * 0.7) : 6500, now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + hatLen);
    src.connect(hp);
    hp.connect(g);
    g.connect(masterGain);
    src.start(now);
    src.stop(now + hatLen);
    activeSources.push(src);
    return hatLen * 1000;
  }

  // Percs, Toms, FX
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = sample.category === 'toms' ? 'sine' : 'triangle';
  osc.frequency.setValueAtTime(punch, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, punch * 0.7), now + decaySec);
  gain.gain.setValueAtTime(0.85, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + decaySec);
  activeSources.push(osc);
  return decaySec * 1000;
};

/**
 * Auditions a sample either from its fileUrl or via high-precision DSP synthesis.
 * Calls onEnded callback when playback finishes.
 */
export const playVaultOneShot = (
  sample: SampleVaultItem,
  volume: number = 0.85,
  onEnded?: () => void
): (() => void) => {
  stopAllVaultAudio();

  let finished = false;
  const finish = () => {
    if (!finished) {
      finished = true;
      if (onEnded) onEnded();
    }
  };

  // If sample has an accessible URL (blob or data URL or valid http), try HTMLAudio first
  if (sample.fileUrl && (sample.fileUrl.startsWith('blob:') || sample.fileUrl.startsWith('data:') || sample.fileUrl.startsWith('http'))) {
    try {
      const audio = new Audio(sample.fileUrl);
      audio.volume = Math.max(0.1, Math.min(1.0, volume));
      currentHtmlAudio = audio;

      audio.onended = () => {
        currentHtmlAudio = null;
        finish();
      };

      audio.onerror = () => {
        // Fallback to DSP immediately if audio URL cannot be fetched
        currentHtmlAudio = null;
        const durationMs = playSampleDspFallback(sample, volume);
        playbackTimer = window.setTimeout(finish, durationMs);
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          const durationMs = playSampleDspFallback(sample, volume);
          playbackTimer = window.setTimeout(finish, durationMs);
        });
      }
      return () => {
        stopAllVaultAudio();
        finish();
      };
    } catch {
      // Fall through to DSP fallback
    }
  }

  // Pure DSP synthesis
  const durationMs = playSampleDspFallback(sample, volume);
  playbackTimer = window.setTimeout(finish, durationMs);

  return () => {
    stopAllVaultAudio();
    finish();
  };
};
