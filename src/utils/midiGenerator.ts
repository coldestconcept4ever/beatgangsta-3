import MidiWriter from 'midi-writer-js';
import { DrumPattern, MidiNote } from '../types';

// Dynamic import for JSZip
const getJSZip = () => import('jszip').then(m => m.default);

export type PatternLength = 4 | 8;
export type PatternVariation = 'A' | 'B';

export const generateDrumMidiBaseData = (
  currentPattern: DrumPattern,
  recipeTitle: string,
  activeSection: string,
  bpm: number,
  useVelocityHumanization: boolean,
  bars: PatternLength = 4
): Uint8Array => {
  if (!currentPattern) return new Uint8Array();
  
  const kickTrack = new MidiWriter.Track();
  kickTrack.addTrackName(`${recipeTitle} - ${activeSection} Kick`);
  kickTrack.setTempo(bpm);

  const snareTrack = new MidiWriter.Track();
  snareTrack.addTrackName(`${recipeTitle} - ${activeSection} Snare`);
  snareTrack.setTempo(bpm);

  const hatTrack = new MidiWriter.Track();
  hatTrack.addTrackName(`${recipeTitle} - ${activeSection} HiHat`);
  hatTrack.setTempo(bpm);

  const addDrumEvents = (track: MidiWriter.Track, steps: (number | { step: number, velocity: number })[], pitch: string, isDoubleTime: boolean) => {
    const safeSteps = Array.isArray(steps) ? steps : [];
    const totalStepsPerBar = isDoubleTime ? 32 : 16;
    const totalSteps = totalStepsPerBar * bars;
    const stepDuration = isDoubleTime ? '32' : '16';
    const ticksPerStep = isDoubleTime ? 16 : 32;
    const targetTicks = totalSteps * ticksPerStep;
    
    let currentWait = 0;
    let totalTicksAdded = 0;
    
    for (let i = 1; i <= totalSteps; i++) {
      const stepInBar = i;
      const stepData = safeSteps.find(s => typeof s === 'number' ? s === stepInBar : s.step === stepInBar);
      
      if (stepData) {
        let velocity = 100;
        if (typeof stepData === 'object' && stepData.velocity !== undefined) {
          velocity = stepData.velocity;
        } else if (useVelocityHumanization) {
          velocity = Math.floor(60 + (Math.sin(i * 12.5) * 20 + 20));
        }
        
        const waitTicks = currentWait * ticksPerStep;
        const waitStr = waitTicks > 0 ? `T${waitTicks}` : '0';
        track.addEvent(new MidiWriter.NoteEvent({ pitch: [pitch], duration: stepDuration, wait: waitStr, velocity }));
        totalTicksAdded += waitTicks + ticksPerStep;
        currentWait = 0;
      } else {
        currentWait++;
      }
    }

    // Ensure the track is exactly the requested length (4 or 8 bars)
    if (totalTicksAdded < targetTicks) {
      const remainingWait = targetTicks - totalTicksAdded;
      // Add a silent note at the very end to anchor the track length
      track.addEvent(new MidiWriter.NoteEvent({ 
        pitch: [pitch], 
        duration: 'T1', 
        wait: `T${remainingWait - 1}`, 
        velocity: 0 
      }));
    }
  };

  // General MIDI Drum Map: Kick = 36 (C1), Snare = 38 (D1), Clap = 39 (D#1), Hi-Hat = 42 (F#1)
  addDrumEvents(kickTrack, currentPattern.kick?.steps || [], 'C1', currentPattern.kick?.isDoubleTime || false);
  const snareNote = currentPattern.snare?.isClap ? 'D#1' : 'D1';
  addDrumEvents(snareTrack, currentPattern.snare?.steps || [], snareNote, currentPattern.snare?.isDoubleTime || false);
  addDrumEvents(hatTrack, currentPattern.hiHat?.steps || [], 'F#1', currentPattern.hiHat?.isDoubleTime || false);

  const write = new MidiWriter.Writer([kickTrack, snareTrack, hatTrack]);
  return write.buildFile();
};

export const isMidiCapable = (instrument: string, loopGuide: string): boolean => {
  const text = (instrument + ' ' + loopGuide).toLowerCase();
  const nonMidiKeywords = ['vocal', 'acapella', 'live guitar', 'live bass', 'acoustic guitar', 'sample loop', 'audio loop', 'real guitar', 'real bass'];
  return !nonMidiKeywords.some(keyword => text.includes(keyword));
};

export const generateAudioLoop = async (midiData: Uint8Array, bpm: number): Promise<Blob> => {
  const JSZip = await getJSZip();
  const zip = new JSZip();
  
  // Audio.mid is used inside an audioloop for MIDI data
  zip.file("Audio.mid", midiData);
  
  // Basic AudioLoop.xml metadata with BPM context
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AudioLoop version="1.1">
  <Audio>
    <File name="Audio.mid"/>
  </Audio>
  <Context>
    <BPM value="${bpm}"/>
  </Context>
</AudioLoop>`;
  
  zip.file("AudioLoop.xml", xmlContent);
  
  return await zip.generateAsync({ 
    type: "blob",
    compression: "STORE",
    mimeType: "application/octet-stream"
  });
};

export const getVibeParameters = (text: string, recipeTitle: string) => {
  const title = recipeTitle.toLowerCase();
  
  // Base parameters
  let density = 0.5; // 0 to 1
  let swing = 0.0;   // 0 to 1
  let complexity = 0.5; // 0 to 1

  // Adjust based on keywords
  if (text.includes('fast') || text.includes('16th') || text.includes('32nd')) density += 0.3;
  if (text.includes('slow') || text.includes('sustained') || text.includes('long')) density -= 0.3;
  if (text.includes('syncopat') || text.includes('bounce') || text.includes('groove')) swing += 0.4;
  
  // Genre/Style heuristics
  if (title.includes('trap')) { density += 0.2; swing += 0.2; }
  if (title.includes('drill')) { density += 0.3; complexity += 0.2; }
  if (title.includes('rage')) { density += 0.4; complexity += 0.3; }
  if (title.includes('lofi')) { density -= 0.2; swing += 0.5; }
  if (title.includes('crank dat')) { density += 0.2; swing += 0.3; }

  return {
    density: Math.max(0, Math.min(1, density)),
    swing: Math.max(0, Math.min(1, swing)),
    complexity: Math.max(0, Math.min(1, complexity))
  };
};

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposePitch(pitch: string, semitones: number): string {
  if (semitones === 0) return pitch;
  
  // Normalize flats to sharps
  let normalizedPitch = pitch;
  const flatMap: { [key: string]: string } = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
  const noteMatch = pitch.match(/^([A-G][b#]?)(-1|\d)$/);
  if (noteMatch && flatMap[noteMatch[1]]) {
    normalizedPitch = flatMap[noteMatch[1]] + noteMatch[2];
  }

  const match = normalizedPitch.match(/^([A-G]#?)(-1|\d)$/);
  if (!match) return pitch;
  const note = match[1];
  const octave = parseInt(match[2], 10);
  
  const noteIndex = NOTE_ORDER.indexOf(note);
  if (noteIndex === -1) return pitch;
  
  let totalSemitones = octave * 12 + noteIndex + semitones;
  const newOctave = Math.floor(totalSemitones / 12);
  const newNoteIndex = totalSemitones % 12;
  
  const finalNoteIndex = newNoteIndex < 0 ? newNoteIndex + 12 : newNoteIndex;
  const finalOctave = newNoteIndex < 0 ? newOctave - 1 : newOctave;
  
  return `${NOTE_ORDER[finalNoteIndex]}${finalOctave}`;
}

function sanitizeDuration(val: string | undefined, defaultVal: string): string {
  if (!val) return defaultVal;
  const str = String(val).trim().toLowerCase();
  if (str === '0') return '0';
  if (str.startsWith('t')) return str.toUpperCase(); // e.g. T128
  
  // Valid base durations in midi-writer-js
  const validBases = ['1', '2', '4', '8', '16', '32', '64'];
  
  // Check if it has a modifier
  const hasD = str.endsWith('d');
  const hasT = str.endsWith('t');
  const base = str.replace(/[dt]/g, '');
  
  if (validBases.includes(base)) {
    return str; // It's valid
  }
  
  // If invalid, try to map to nearest valid base
  const num = parseInt(base);
  if (isNaN(num)) return defaultVal;
  
  // Find closest valid base
  const closest = validBases.reduce((prev, curr) => {
    return (Math.abs(parseInt(curr) - num) < Math.abs(parseInt(prev) - num) ? curr : prev);
  });
  
  return closest + (hasD ? 'd' : '') + (hasT ? 't' : '');
}

// Calculate the length of the generated MIDI in beats
const getBeats = (val: string | undefined): number => {
  if (!val || val === '0') return 0;
  const str = String(val).trim().toLowerCase();
  if (str.startsWith('t')) return parseInt(str.substring(1)) / 128;
  
  const hasD = str.endsWith('d');
  const hasT = str.endsWith('t');
  const base = str.replace(/[dt]/g, '');
  
  const num = parseInt(base);
  if (isNaN(num) || num === 0) return 0;
  
  let beats = 4 / num;
  if (hasD) beats *= 1.5;
  if (hasT) beats *= 0.666;
  return beats;
};

export const generateMidiTrack = (
  instrument: string,
  loopGuide: string,
  bpm: number,
  bars: PatternLength,
  variation: PatternVariation,
  recipeTitle: string,
  midiNotes?: MidiNote[]
): MidiWriter.Track => {
  const track = new MidiWriter.Track();
  track.addTrackName(instrument);
  track.setTempo(bpm);

  if (midiNotes && midiNotes.length > 0) {
    const customEvents: MidiWriter.NoteEvent[] = [];
    
    // Determine if this is a drum track (drums shouldn't be transposed)
    const text = (instrument + ' ' + loopGuide).toLowerCase();
    const isDrums = text.includes('drum') || text.includes('perc') || text.includes('kick') || text.includes('snare') || text.includes('hat') || text.includes('clap');
    const isChords = text.includes('chord') || text.includes('pad') || text.includes('keys') || text.includes('piano');

    // Helper to generate a block of notes with transformations
    const generateBlock = (notes: MidiNote[], transpose: number, rhythmMod: 'none' | 'chop' | 'syncopate' | 'chop+syncopate', velocityMod: number) => {
      const blockEvents: MidiWriter.NoteEvent[] = [];
      notes.forEach(note => {
        let pitches = Array.isArray(note.pitch) ? note.pitch : note.pitch.split(',').map(p => p.trim());
        let transposedPitches = pitches.map(p => isDrums ? p : transposePitch(p, transpose));
        
        let duration = sanitizeDuration(note.duration, '8');
        let wait = sanitizeDuration(note.wait, '0');
        let velocity = Math.min(127, Math.max(1, (note.velocity || 100) + velocityMod));
        
        if (rhythmMod.includes('syncopate')) {
          if (wait === '0' || !wait) {
            wait = '16';
            if (duration === '4') duration = '8';
            else if (duration === '8') duration = '16';
          }
        }

        if (rhythmMod.includes('chop')) {
          if (duration === '2') {
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '4', wait: wait, velocity }));
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '4', wait: '0', velocity: Math.max(1, velocity - 15) }));
            return;
          } else if (duration === '4') {
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '8', wait: wait, velocity }));
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '8', wait: '0', velocity: Math.max(1, velocity - 15) }));
            return;
          } else if (duration === '8') {
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '16', wait: wait, velocity }));
            blockEvents.push(new MidiWriter.NoteEvent({ pitch: transposedPitches, duration: '16', wait: '0', velocity: Math.max(1, velocity - 15) }));
            return;
          }
        }
        
        blockEvents.push(new MidiWriter.NoteEvent({
          pitch: transposedPitches,
          duration: duration,
          wait: wait,
          velocity: velocity
        }));
      });
      return blockEvents;
    };

    let totalBeats = 0;
    const targetBeats = bars * 4;
    const truncatedNotes: MidiNote[] = [];
    
    for (const note of midiNotes) {
      const waitBeats = getBeats(note.wait);
      const durationBeats = getBeats(note.duration);
      
      if (totalBeats + waitBeats >= targetBeats) {
        break;
      }
      
      if (totalBeats + waitBeats + durationBeats > targetBeats) {
        truncatedNotes.push(note);
        totalBeats += waitBeats + durationBeats;
        break;
      }
      
      truncatedNotes.push(note);
      totalBeats += waitBeats + durationBeats;
    }
    
    // Calculate how many bars the AI generated (assuming 4 beats per bar)
    const generatedBars = Math.max(1, Math.round(totalBeats / 4));
    
    // Play the generated notes once and pad with silence if needed
    const numBlocks = 1;
    
    let currentTotalBeats = 0;
    for (let i = 0; i < numBlocks; i++) {
      let transpose = 0;
      let rhythmMod: 'none' | 'chop' | 'syncopate' | 'chop+syncopate' = 'none';
      let velocityMod = 0;
      
      // Add some humanization to velocity
      velocityMod += Math.floor(Math.random() * 10) - 5;
      
      const blockEvents = generateBlock(truncatedNotes, transpose, rhythmMod, velocityMod);
      
      for (const event of blockEvents) {
        const waitBeats = getBeats(event.wait);
        const durationBeats = getBeats(event.duration);
        
        if (currentTotalBeats + waitBeats >= targetBeats) break;
        
        customEvents.push(event);
        currentTotalBeats += waitBeats + durationBeats;
        
        if (currentTotalBeats >= targetBeats) break;
      }
      
      if (currentTotalBeats >= targetBeats) break;
    }
    
    // Ensure the track is exactly the requested length (4 or 8 bars)
    if (currentTotalBeats < targetBeats) {
      const remainingTicks = Math.round((targetBeats - currentTotalBeats) * 128);
      if (remainingTicks > 0) {
        customEvents.push(new MidiWriter.NoteEvent({ 
          pitch: ['C4'], 
          duration: 'T1', 
          wait: `T${remainingTicks - 1}`, 
          velocity: 0 
        }));
      }
    }
    
    track.addEvent(customEvents);
    return track;
  }

  const text = (instrument + ' ' + loopGuide).toLowerCase();
  const vibe = getVibeParameters(text, recipeTitle);
  
  let type = 'melody';
  if (text.includes('808') || text.includes('bass') || text.includes('sub')) type = 'bass';
  else if (text.includes('chord') || text.includes('pad') || text.includes('keys') || text.includes('piano')) type = 'chords';
  else if (text.includes('arp')) type = 'arp';
  else if (text.includes('kick')) type = 'kick';
  else if (text.includes('snare') || text.includes('clap')) type = 'snare';
  else if (text.includes('hat')) type = 'hihat';
  else if (text.includes('drum') || text.includes('perc')) type = 'drums';

  const targetBeats = bars * 4;
  let currentTotalBeats = 0;
  const events: MidiWriter.NoteEvent[] = [];

  const pushNote = (pitch: string | string[], duration: string, wait: string | string[] = '0') => {
    const waitBeats = getBeats(Array.isArray(wait) ? wait[0] : wait);
    const durationBeats = getBeats(duration);

    // Don't add notes beyond the target length
    if (currentTotalBeats + waitBeats >= targetBeats) return;

    let finalDuration = duration;
    if (currentTotalBeats + waitBeats + durationBeats > targetBeats) {
      const remaining = targetBeats - (currentTotalBeats + waitBeats);
      finalDuration = `T${Math.floor(remaining * 128)}`;
    }

    const baseVelocity = 70 + Math.floor(vibe.density * 40);
    const velocity = baseVelocity + Math.floor(Math.random() * 20);
    events.push(new MidiWriter.NoteEvent({ 
      pitch: Array.isArray(pitch) ? pitch : [pitch], 
      duration: finalDuration, 
      wait, 
      velocity 
    }));

    currentTotalBeats += waitBeats + getBeats(finalDuration);
  };

  // Map vibe parameters to old logic variables
  const isFast = vibe.density > 0.6;
  const isSyncopated = vibe.swing > 0.4;
  const isCrankDat = recipeTitle.toLowerCase().includes('crank dat');

  if (type === 'chords') {
    const chordsA = [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']];
    const chordsB = [['D4', 'F4', 'A4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4']];
    const chords = variation === 'A' ? chordsA : chordsB;
    
    for (let i = 0; i < bars; i++) {
      const chord = chords[i % chords.length];
      const isTurnaround = bars === 8 && (i === 3 || i === 7);
      
      if (isCrankDat) {
        // Crank Dat style chord pattern
        pushNote(chord, '8'); pushNote(chord, '8', '8'); pushNote(chord, '4'); pushNote(chord, '8'); pushNote(chord, '8', '8');
      } else if (isFast) {
        if (isTurnaround) {
          pushNote(chord, '8'); pushNote(chord, '8'); pushNote(chord, '4'); pushNote(chord, '4'); pushNote(chord, '4');
        } else {
          pushNote(chord, '4'); pushNote(chord, '4'); pushNote(chord, '4'); pushNote(chord, '4');
        }
      } else if (isSyncopated) {
        if (isTurnaround) {
          pushNote(chord, '4'); pushNote(chord, '8', '8'); pushNote(chord, '8', '8'); pushNote(chord, '8', '8');
        } else {
          pushNote(chord, '4'); pushNote(chord, '8', '8'); pushNote(chord, '4', '4');
        }
      } else {
        if (isTurnaround) {
          pushNote(chord, '2'); pushNote(chord, '2');
        } else {
          pushNote(chord, '1');
        }
      }
    }
  } else if (type === 'bass') {
    const rootNotesA = ['C2', 'A1', 'F1', 'G1'];
    const rootNotesB = ['D2', 'G1', 'C2', 'A1'];
    const notes = variation === 'A' ? rootNotesA : rootNotesB;
    
    for (let i = 0; i < bars; i++) {
      const note = notes[i % notes.length];
      const isTurnaround = bars === 8 && (i === 3 || i === 7);
      
      if (isCrankDat) {
        // Crank Dat style bass pattern
        pushNote(note, '4'); pushNote(note, '8', '8'); pushNote(note, '4'); pushNote(note, '8', '8');
      } else if (isSyncopated) {
        if (isTurnaround) {
          pushNote(note, '8'); pushNote(note, '8', '8'); pushNote(note, '8', '8'); pushNote(note, '8', '8'); pushNote(note, '8');
        } else {
          pushNote(note, '8'); pushNote(note, '8', '8'); pushNote(note, '4', '8'); pushNote(note, '8', '8');
        }
      } else if (isFast) {
        if (isTurnaround) {
          for(let j=0; j<6; j++) pushNote(note, '8');
          pushNote(note, '16'); pushNote(note, '16'); pushNote(note, '16'); pushNote(note, '16');
        } else {
          for(let j=0; j<8; j++) pushNote(note, '8');
        }
      } else {
        if (isTurnaround) {
          pushNote(note, '2'); pushNote(note, '4'); pushNote(note, '4');
        } else {
          pushNote(note, '1');
        }
      }
    }
  } else if (type === 'arp') {
    const scale = ['C4', 'E4', 'G4', 'C5'];
    for (let i = 0; i < bars * 4; i++) {
      const isTurnaround = bars === 8 && (i >= 28); // last bar
      if (isFast) {
        if (isTurnaround && i % 2 === 1) {
          pushNote(scale[3], '16'); pushNote(scale[2], '16'); pushNote(scale[1], '16'); pushNote(scale[0], '16');
        } else {
          pushNote(scale[0], '16'); pushNote(scale[1], '16'); pushNote(scale[2], '16'); pushNote(scale[3], '16');
        }
      } else {
        if (isTurnaround) {
          pushNote(scale[0], '16'); pushNote(scale[1], '16'); pushNote(scale[2], '16'); pushNote(scale[3], '16');
        } else {
          pushNote(scale[0], '8'); pushNote(scale[1], '8');
        }
      }
    }
  } else if (type === 'hihat') {
    for (let i = 0; i < bars * 4; i++) {
      const isTurnaround = bars === 8 && (i === 15 || i === 31); // 4th and 8th bar last beat
      if (isFast || variation === 'B') {
        if (isTurnaround) {
          for(let j=0; j<8; j++) pushNote('F#1', '32'); // roll
        } else {
          pushNote('F#1', '16'); pushNote('F#1', '16'); pushNote('F#1', '16'); pushNote('F#1', '16');
        }
      } else {
        if (isTurnaround) {
          pushNote('F#1', '16'); pushNote('F#1', '16'); pushNote('F#1', '16'); pushNote('F#1', '16');
        } else {
          pushNote('F#1', '8'); pushNote('F#1', '8');
        }
      }
    }
  } else if (type === 'kick') {
    for (let i = 0; i < bars; i++) {
      const isTurnaround = bars === 8 && (i === 3 || i === 7);
      if (variation === 'A') {
        if (isTurnaround) {
          pushNote('C1', '4'); pushNote('C1', '8', '8'); pushNote('C1', '8', '8'); pushNote('C1', '8', '8');
        } else {
          pushNote('C1', '4'); pushNote('C1', '8', '8'); pushNote('C1', '4', '4');
        }
      } else {
        if (isTurnaround) {
          pushNote('C1', '4'); pushNote('C1', '8', '8'); pushNote('C1', '4'); pushNote('C1', '4');
        } else {
          pushNote('C1', '4'); pushNote('C1', '4', '4'); pushNote('C1', '4');
        }
      }
    }
  } else if (type === 'snare') {
    const snareNote = text.includes('clap') ? 'D#1' : 'D1';
    for (let i = 0; i < bars; i++) {
      const isTurnaround = bars === 8 && (i === 3 || i === 7);
      if (isTurnaround) {
        pushNote(snareNote, '4', '4'); pushNote(snareNote, '8', '4'); pushNote(snareNote, '8');
      } else {
        pushNote(snareNote, '4', '4'); pushNote(snareNote, '4', '4');
      }
    }
  } else {
    // Melody
    const scale = variation === 'A' ? ['C4', 'D4', 'E4', 'G4'] : ['A4', 'G4', 'E4', 'C4'];
    for (let i = 0; i < bars; i++) {
      const isTurnaround = bars === 8 && (i === 3 || i === 7);
      if (isFast) {
        if (isTurnaround) {
          pushNote(scale[0], '16'); pushNote(scale[1], '16'); pushNote(scale[2], '16'); pushNote(scale[3], '16');
          pushNote(scale[3], '16'); pushNote(scale[2], '16'); pushNote(scale[1], '16'); pushNote(scale[0], '16');
          pushNote(scale[0], '8'); pushNote(scale[1], '8'); pushNote(scale[2], '8'); pushNote(scale[3], '8');
        } else {
          pushNote(scale[0], '8'); pushNote(scale[1], '8'); pushNote(scale[2], '8'); pushNote(scale[3], '8');
          pushNote(scale[3], '8'); pushNote(scale[2], '8'); pushNote(scale[1], '8'); pushNote(scale[0], '8');
        }
      } else if (isSyncopated) {
        if (isTurnaround) {
          pushNote(scale[0], '8'); pushNote(scale[1], '8', '8'); pushNote(scale[2], '8', '8'); pushNote(scale[3], '8', '8'); pushNote(scale[0], '8');
        } else {
          pushNote(scale[0], '8'); pushNote(scale[1], '8', '8'); pushNote(scale[2], '4', '8'); pushNote(scale[3], '8', '8');
        }
      } else {
        if (isTurnaround) {
          pushNote(scale[0], '8'); pushNote(scale[1], '8'); pushNote(scale[2], '4'); pushNote(scale[3], '4'); pushNote(scale[0], '4');
        } else {
          pushNote(scale[0], '4'); pushNote(scale[1], '4'); pushNote(scale[2], '4'); pushNote(scale[3], '4');
        }
      }
    }
  }

    // Ensure the track is exactly the requested length (4 or 8 bars)
    if (currentTotalBeats < targetBeats) {
      const remainingTicks = Math.round((targetBeats - currentTotalBeats) * 128);
      if (remainingTicks > 0) {
        events.push(new MidiWriter.NoteEvent({ 
          pitch: ['C4'], 
          duration: 'T1', 
          wait: `T${remainingTicks - 1}`, 
          velocity: 0 
        }));
      }
    }

    track.addEvent(events);
    return track;
};
