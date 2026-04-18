import MidiWriter from 'midi-writer-js';
import MidiPlayer from 'midi-player-js';

try {
  const track = new MidiWriter.Track();
  track.addEvent(new MidiWriter.NoteEvent({ pitch: ['Eb4'], duration: '4' }));
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
