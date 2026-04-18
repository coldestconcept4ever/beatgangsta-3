import MidiWriter from 'midi-writer-js';

try {
  const track = new MidiWriter.Track();
  track.addEvent(new MidiWriter.NoteEvent({ pitch: ['Eb4'], duration: '4' }));
  const write = new MidiWriter.Writer([track]);
  console.log("Success with Eb4");
} catch (e) {
  console.error("Error with Eb4:", e);
}
