import MidiWriter from 'midi-writer-js';
import MidiPlayer from 'midi-player-js';

try {
  const track = new MidiWriter.Track();
  track.addEvent(new MidiWriter.NoteEvent({ pitch: ['C4, E4, G4'], duration: '4' }));
  const write = new MidiWriter.Writer([track]);
  const bytes = write.buildFile();
  console.log("Bytes length:", bytes.length);
  
  const player = new MidiPlayer.Player((e) => {
    console.log("Event:", e);
  });
  player.loadArrayBuffer(bytes.buffer);
  console.log("Player loaded successfully");
} catch (e) {
  console.error("Error:", e);
}
