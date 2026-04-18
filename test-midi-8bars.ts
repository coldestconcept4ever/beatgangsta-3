import { generateMidiTrack } from './src/utils/midiGenerator.js';

const midiNotes = [
  { pitch: 'C4', duration: '4', wait: '0', velocity: 100 },
  { pitch: 'Eb4', duration: '4', wait: '0', velocity: 100 },
  { pitch: 'G4', duration: '4', wait: '0', velocity: 100 },
  { pitch: 'D4', duration: '4', wait: '0', velocity: 100 }
];

try {
  const track = generateMidiTrack('Piano', 'Chords', 120, 8, 'A', 'Test', midiNotes);
  console.log("Track events:", track.events.length);
  // @ts-ignore
  console.log("Track events:", track.events);
} catch (e) {
  console.error("Error:", e);
}
