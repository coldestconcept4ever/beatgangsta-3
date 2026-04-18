import { generateMidiTrack } from './src/utils/midiGenerator.js';
import MidiWriter from 'midi-writer-js';
import MidiPlayer from 'midi-player-js';

const midiNotes = [
  { pitch: 'C4, Eb4, G4', duration: '4', wait: '0', velocity: 100 }
];

try {
  const track = generateMidiTrack('Piano', 'Chords', 120, 4, 'A', 'Test', midiNotes);
  const write = new MidiWriter.Writer([track]);
  const bytes = write.buildFile();
  
  const player = new MidiPlayer.Player((e) => {
    console.log("Event:", e);
  });
  player.loadArrayBuffer(bytes.buffer);
  player.play();
  console.log("Player played successfully");
} catch (e) {
  console.error("Error:", e);
}
