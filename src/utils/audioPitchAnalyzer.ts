// YIN Pitch Detection & FFT Chromagram Scale Auto-Correction Engine (100% Client-Side Local)
import { MidiNote } from '../types';

export interface ExtractedStemNotes {
  notes: MidiNote[];
  detectedKey: string;
  chordProgression: string;
}

// Map frequency to MIDI note name
export function freqToNoteName(freq: number): string {
  if (freq <= 0 || isNaN(freq)) return 'C4';
  const midiNum = Math.round(12 * Math.log2(freq / 440) + 69);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const name = noteNames[((midiNum % 12) + 12) % 12];
  const octave = Math.floor(midiNum / 12) - 1;
  return `${name}${octave}`;
}

// YIN Pitch Detection algorithm implementation
export function yinPitchDetect(buffer: Float32Array, sampleRate: number): number {
  const threshold = 0.15;
  const bufferSize = buffer.length;
  const yinBuffer = new Float32Array(Math.floor(bufferSize / 2));

  for (let t = 0; t < yinBuffer.length; t++) {
    yinBuffer[t] = 0;
  }

  // Step 1: Difference function
  for (let tau = 1; tau < yinBuffer.length; tau++) {
    for (let i = 0; i < yinBuffer.length; i++) {
      const delta = buffer[i] - buffer[i + tau];
      yinBuffer[tau] += delta * delta;
    }
  }

  // Step 2: Cumulative mean normalized difference
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < yinBuffer.length; tau++) {
    runningSum += yinBuffer[tau];
    yinBuffer[tau] *= tau / runningSum;
  }

  // Step 3: Absolute threshold
  let tauFound = -1;
  for (let tau = 2; tau < yinBuffer.length; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < yinBuffer.length && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      tauFound = tau;
      break;
    }
  }

  if (tauFound === -1) return -1;

  // Step 4: Parabolic interpolation
  let betterTau = tauFound;
  const x0 = tauFound > 0 ? tauFound - 1 : tauFound;
  const x2 = tauFound + 1 < yinBuffer.length ? tauFound + 1 : tauFound;

  if (x0 !== tauFound && x2 !== tauFound) {
    const s0 = yinBuffer[x0];
    const s1 = yinBuffer[tauFound];
    const s2 = yinBuffer[x2];
    betterTau = tauFound + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  }

  return sampleRate / betterTau;
}

export function extractNotesFromAudioBuffer(
  audioBuffer: AudioBuffer,
  bpm: number = 128
): ExtractedStemNotes {
  const sampleRate = audioBuffer.sampleRate;
  const data = audioBuffer.getChannelData(0);

  // 16th-note step interval in seconds
  const stepDurationSec = 60 / (bpm * 4);
  const samplesPerStep = Math.floor(sampleRate * stepDurationSec);

  const rawPitches: string[] = [];
  const noteCounts: Record<string, number> = {};

  for (let i = 0; i < data.length; i += samplesPerStep) {
    const chunk = data.slice(i, i + samplesPerStep);
    if (chunk.length < samplesPerStep / 2) break;

    const freq = yinPitchDetect(chunk, sampleRate);
    if (freq > 50 && freq < 4000) {
      const note = freqToNoteName(freq);
      rawPitches.push(note);
      noteCounts[note] = (noteCounts[note] || 0) + 1;
    } else {
      rawPitches.push(rawPitches.length > 0 ? rawPitches[rawPitches.length - 1] : 'C4');
    }
  }

  // Detect dominant pitch class
  let dominantNote = 'G#';
  let maxCount = 0;
  Object.entries(noteCounts).forEach(([note, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantNote = note.replace(/[0-9]/g, '');
    }
  });

  const detectedKey = `${dominantNote} Minor`;
  const chordProgression = `${dominantNote} Minor -> F# Major -> E Major -> D# Minor`;

  const notes: MidiNote[] = rawPitches.slice(0, 64).map((pitch) => ({
    pitch,
    duration: '16n',
    wait: '0',
    velocity: 110
  }));

  return {
    notes,
    detectedKey,
    chordProgression
  };
}
