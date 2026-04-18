import MidiWriter from 'midi-writer-js';

export const generateTransition = (sectionName: string, bpm: number): MidiWriter.NoteEvent[] => {
  const events: MidiWriter.NoteEvent[] = [];
  
  if (sectionName === 'hook' || sectionName === 'bridge') {
    // Generate a drum fill
    for (let i = 0; i < 4; i++) {
      events.push(new MidiWriter.NoteEvent({
        pitch: ['D2'], // Snare
        duration: '16',
        wait: 'T0',
        velocity: 110 + (i * 5)
      }));
    }
  } else if (sectionName === 'verse') {
    // Generate a synth riser
    for (let i = 0; i < 8; i++) {
      events.push(new MidiWriter.NoteEvent({
        pitch: [`C${3 + Math.floor(i / 2)}`],
        duration: '32',
        wait: 'T0',
        velocity: 80 + (i * 6)
      }));
    }
  }
  
  return events;
};
