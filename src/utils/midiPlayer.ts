import MidiPlayer from 'midi-player-js';

let audioCtx: AudioContext | null = null;
let activeOscillators: Map<number, { osc: OscillatorNode, gain: GainNode, noiseSource?: AudioBufferSourceNode }> = new Map();
let currentPlayer: any = null;
let noiseBuffer: AudioBuffer | null = null;

const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

const noteToFreq = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const resumeAudio = async () => {
  if (!audioCtx) {
    initAudio();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  return audioCtx;
};

const getSynthParams = (instrumentType: string, noteNumber?: number) => {
  const text = instrumentType.toLowerCase();
  const isDrums = text.includes('drum') || text.includes('perc') || text.includes('kick') || text.includes('snare') || text.includes('hat') || text.includes('clap');

  console.log(`Synth params for ${instrumentType} (isDrums: ${isDrums}, note: ${noteNumber})`);

  // If it's a drum pattern, use the note number to decide the sound
  if (isDrums && noteNumber !== undefined) {
    // Handle both octave 1 and 2 just in case
    if (noteNumber === 36 || noteNumber === 24) { // Kick
      return { type: 'sine' as OscillatorType, attack: 0.005, decay: 0.3, sustain: 0, release: 0.1, filterFreq: 150, pitchDrop: true };
    } else if (noteNumber === 38 || noteNumber === 26) { // Snare
      return { type: 'triangle' as OscillatorType, attack: 0.005, decay: 0.15, sustain: 0, release: 0.1, filterFreq: 3000, noise: true };
    } else if (noteNumber === 39 || noteNumber === 27) { // Clap
      return { type: 'triangle' as OscillatorType, attack: 0.01, decay: 0.2, sustain: 0, release: 0.15, filterFreq: 2500, noise: true, clap: true };
    } else if (noteNumber === 42 || noteNumber === 30) { // Hi-Hat
      return { type: 'square' as OscillatorType, attack: 0.002, decay: 0.05, sustain: 0, release: 0.05, filterFreq: 10000, noise: true };
    }
  }

  // Fallback to instrument name matching
  if (text.includes('808') || text.includes('bass') || text.includes('sub')) {
    return { type: 'sine' as OscillatorType, attack: 0.05, decay: 0.8, sustain: 0.2, release: 0.5, filterFreq: 400 };
  } else if (text.includes('kick')) {
    return { type: 'sine' as OscillatorType, attack: 0.01, decay: 0.4, sustain: 0, release: 0.1, filterFreq: 150, pitchDrop: true };
  } else if (text.includes('snare')) {
    return { type: 'triangle' as OscillatorType, attack: 0.01, decay: 0.2, sustain: 0, release: 0.1, filterFreq: 3000, noise: true };
  } else if (text.includes('clap')) {
    return { type: 'triangle' as OscillatorType, attack: 0.01, decay: 0.2, sustain: 0, release: 0.15, filterFreq: 2500, noise: true, clap: true };
  } else if (text.includes('hat')) {
    return { type: 'square' as OscillatorType, attack: 0.01, decay: 0.1, sustain: 0, release: 0.05, filterFreq: 8000, noise: true };
  } else if (text.includes('chord') || text.includes('pad')) {
    return { type: 'sawtooth' as OscillatorType, attack: 0.2, decay: 0.5, sustain: 0.8, release: 1.0, filterFreq: 2000 };
  } else {
    // default melody
    return { type: 'square' as OscillatorType, attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.3, filterFreq: 3000 };
  }
};

let currentOnStop: (() => void) | null = null;

export const playMidiPreview = async (midiBytes: Uint8Array, instrumentType: string, onStop?: () => void) => {
  console.log(`Starting MIDI preview for ${instrumentType}. Bytes length: ${midiBytes.length}`);
  try {
    await resumeAudio();
    if (!audioCtx) {
      console.error("AudioContext not initialized");
      return;
    }
    console.log("AudioContext state:", audioCtx.state);

    if (!noiseBuffer) {
      noiseBuffer = createNoiseBuffer(audioCtx);
    }

    // Stop current playback if any
    stopMidiPreview();

    currentOnStop = onStop || null;

    currentPlayer = new MidiPlayer.Player((event: any) => {
      try {
        if (!audioCtx) return;
        
        console.log("MIDI Event:", event.name, "Note:", event.noteNumber, "Vel:", event.velocity, "Tick:", event.tick);

        if (event.name === 'Note on' && event.velocity > 0) {
          const params = getSynthParams(instrumentType, event.noteNumber);
          const freq = noteToFreq(event.noteNumber);
          
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime((event.velocity / 127) * 0.3, audioCtx.currentTime + params.attack);
          gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, ((event.velocity / 127) * 0.3) * params.sustain), audioCtx.currentTime + params.attack + params.decay);
          
          const filter = audioCtx.createBiquadFilter();
          filter.type = params.noise ? 'highpass' : 'lowpass';
          filter.frequency.value = params.filterFreq;
          
          gainNode.connect(filter);
          filter.connect(audioCtx.destination);

          const osc = audioCtx.createOscillator();
          osc.type = params.type;
          
          if (params.pitchDrop) {
            osc.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + params.decay);
          } else {
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          }
          
          osc.connect(gainNode);
          osc.start();

          let noiseSource: AudioBufferSourceNode | null = null;
          if (params.noise && noiseBuffer) {
            noiseSource = audioCtx.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            noiseSource.connect(gainNode);
            noiseSource.start();
          }

          // Special clap effect: multiple quick bursts
          if ((params as any).clap) {
            const now = audioCtx.currentTime;
            const burstCount = 3;
            const burstInterval = 0.01;
            for (let i = 0; i < burstCount; i++) {
              const burstTime = now + i * burstInterval;
              gainNode.gain.setValueAtTime(0, burstTime);
              gainNode.gain.linearRampToValueAtTime((event.velocity / 127) * 0.4, burstTime + 0.002);
              gainNode.gain.linearRampToValueAtTime(0, burstTime + 0.008);
            }
            // Final main burst
            const finalTime = now + burstCount * burstInterval;
            gainNode.gain.setValueAtTime(0, finalTime);
            gainNode.gain.linearRampToValueAtTime((event.velocity / 127) * 0.3, finalTime + params.attack);
            gainNode.gain.exponentialRampToValueAtTime(((event.velocity / 127) * 0.3) * params.sustain + 0.01, finalTime + params.attack + params.decay);
          }

          // Stop previous note if same note number is already playing
          if (activeOscillators.has(event.noteNumber)) {
            const active = activeOscillators.get(event.noteNumber)!;
            try {
              active.osc.stop();
              if (active.noiseSource) active.noiseSource.stop();
            } catch (e) {}
          }

          activeOscillators.set(event.noteNumber, { osc, gain: gainNode, noiseSource: noiseSource || undefined });

        } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
          const params = getSynthParams(instrumentType, event.noteNumber);
          const active = activeOscillators.get(event.noteNumber);
          if (active) {
            try {
              active.gain.gain.cancelScheduledValues(audioCtx.currentTime);
              active.gain.gain.setValueAtTime(Math.max(0.001, active.gain.gain.value), audioCtx.currentTime);
              active.gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + params.release);
              
              active.osc.stop(audioCtx.currentTime + params.release);
              if (active.noiseSource) {
                active.noiseSource.stop(audioCtx.currentTime + params.release);
              }
            } catch (e) {
              // Ignore if already stopped
            }
            activeOscillators.delete(event.noteNumber);
          }
        }
      } catch (err) {
        const detailedError = new Error(
          `Error processing MIDI event in playMidiPreview.\n` +
          `Instrument: ${instrumentType}\n` +
          `Event: ${JSON.stringify(event)}\n` +
          `Original error: ${err instanceof Error ? err.message : String(err)}\n` +
          `Stack: ${err instanceof Error ? err.stack : 'N/A'}`
        );
        console.error(detailedError);
        throw detailedError;
      }
    });

    currentPlayer.on('endOfFile', () => {
      console.log("MIDI playback finished");
      stopMidiPreview();
    });

    currentPlayer.on('playing', (tick: any) => {
      // Just to verify it's actually playing
      if (tick.tick === 0) console.log("MIDI playback started");
    });

    // Ensure we only pass the exact buffer slice
    if (!midiBytes || midiBytes.byteLength === 0) {
      const err = new Error(`MIDI bytes are empty or undefined for instrument ${instrumentType}. Cannot play.`);
      console.error(err);
      if (onStop) onStop();
      throw err;
    }
    const buffer = midiBytes.buffer.slice(midiBytes.byteOffset, midiBytes.byteOffset + midiBytes.byteLength);
    currentPlayer.loadArrayBuffer(buffer);
    console.log("MidiPlayer loaded. Division:", currentPlayer.division, "Tempo:", currentPlayer.tempo);
    
    // Explicitly set tempo if it's not detected correctly
    if (currentPlayer.tempo === 0) {
      console.warn("MidiPlayer tempo is 0, defaulting to 120");
      currentPlayer.setTempo(120);
    }

    currentPlayer.play();
    console.log("MidiPlayer.play() called. State:", currentPlayer.isPlaying());
  } catch (err) {
    const detailedError = new Error(
      `Failed to play MIDI preview for instrument '${instrumentType}'.\n` +
      `MIDI bytes length: ${midiBytes?.byteLength}.\n` +
      `AudioContext state: ${audioCtx?.state}.\n` +
      `Original error: ${err instanceof Error ? err.message : String(err)}\n` +
      `Stack: ${err instanceof Error ? err.stack : 'N/A'}`
    );
    console.error("Detailed MIDI Playback Error:", detailedError);
    if (onStop) onStop();
    throw detailedError;
  }
};

export const stopMidiPreview = () => {
  if (currentPlayer) {
    currentPlayer.stop();
    currentPlayer = null;
  }

  // Call the stored onStop callback
  if (currentOnStop) {
    const callback = currentOnStop;
    currentOnStop = null;
    callback();
  }
  
  if (audioCtx) {
    activeOscillators.forEach(({ osc, gain, noiseSource }) => {
      try {
        gain.gain.cancelScheduledValues(audioCtx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.stop(audioCtx.currentTime + 0.1);
        if (noiseSource) {
          noiseSource.stop(audioCtx.currentTime + 0.1);
        }
      } catch (e) {
        // Ignore errors if already stopped
      }
    });
    activeOscillators.clear();
  }
};
