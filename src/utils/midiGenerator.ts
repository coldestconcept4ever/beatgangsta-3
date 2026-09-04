import MidiWriter from 'midi-writer-js';
import { DrumPattern, MidiNote } from '../types';

// Dynamic import for JSZip
const getJSZip = () => import('jszip').then(m => m.default);

export type PatternLength = number;
export type PatternVariation = 'A' | 'B';

export const generateDrumMidiBaseData = (
  currentPattern: DrumPattern,
  recipeTitle: string,
  activeSection: string,
  bpm: number,
  useVelocityHumanization: boolean,
  bars: PatternLength = 4,
  advancedSwingSettings?: {
    mode: 'mpc' | 'carp' | 'shaperbox' | 'skaka' | 'fl_wrench';
    swingPercentage: number;
    carpTimeOffset?: number;
    shaperboxCurveType?: 'triplet' | 'asymmetric' | 'early_push' | 'late_drag';
    shaperboxTension?: number;
    skakaHumanizeAmount?: number;
    flShiftAmount?: number;
  },
  drumsOnlyType?: 'full' | 'kick' | 'snare' | 'hat' | 'openHat' | 'perc'
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

  const openHatTrack = new MidiWriter.Track();
  openHatTrack.addTrackName(`${recipeTitle} - ${activeSection} OpenHat`);
  openHatTrack.setTempo(bpm);

  const percTrack = new MidiWriter.Track();
  percTrack.addTrackName(`${recipeTitle} - ${activeSection} Perc`);
  percTrack.setTempo(bpm);

  const getNormalizedSwing = (val: any) => {
    if (typeof val !== 'number') return 0;
    if (val > 1) return val / 100;
    return val;
  };

  const getStepsPerBar = (isDoubleTime?: boolean) => isDoubleTime ? 32 : 16;
  let finalBars: number = bars;
  
  const checkMaxBars = (part: any) => {
    if (!part || !Array.isArray(part.steps)) return;
    const stepsPerBar = getStepsPerBar(part.isDoubleTime);
    part.steps.forEach((s: any) => {
      const stepNum = typeof s === 'number' ? s : s.step;
      const b = Math.ceil(stepNum / stepsPerBar);
      if (b > finalBars) finalBars = b;
    });
  };
  
  checkMaxBars(currentPattern.kick);
  checkMaxBars(currentPattern.snare);
  checkMaxBars(currentPattern.hiHat);
  checkMaxBars(currentPattern.openHat);
  checkMaxBars(currentPattern.perc);
  checkMaxBars(currentPattern.cymbal);

  const addDrumEvents = (
    track: MidiWriter.Track,
    steps: (number | { step: number, velocity: number })[],
    pitch: string,
    isDoubleTime: boolean,
    swingVal: any
  ) => {
    const safeSteps = Array.isArray(steps) ? steps : [];
    const totalStepsPerBar = isDoubleTime ? 32 : 16;
    const totalSteps = totalStepsPerBar * finalBars;
    const stepDuration = isDoubleTime ? '32' : '16';
    const ticksPerStep = isDoubleTime ? 16 : 32;
    const targetTicks = totalSteps * ticksPerStep;
    const swingAmount = getNormalizedSwing(swingVal);
    
    interface PlannedNote {
      step: number;
      targetTick: number;
      velocity: number;
    }
    
    const plannedNotes: PlannedNote[] = [];
    
    for (let i = 1; i <= totalSteps; i++) {
      const stepData = safeSteps.find(s => typeof s === 'number' ? s === i : s.step === i);
      if (stepData) {
        let velocity = 100;
        if (typeof stepData === 'object' && stepData.velocity !== undefined) {
          velocity = stepData.velocity;
        } else if (useVelocityHumanization) {
          // Natural humanized velocity curve using a sine wave with slight randomness
          velocity = Math.floor(65 + (Math.sin(i * 12.5) * 20 + (Math.random() * 10 - 5)));
          velocity = Math.max(20, Math.min(127, velocity));
        }
        
        // Calculate base tick
        let targetTick = (i - 1) * ticksPerStep;
        
        // Apply swing or micro-timing based on advanced settings or legacy swingAmount
        if (advancedSwingSettings) {
          const { mode, swingPercentage } = advancedSwingSettings;
          
          if (mode === 'mpc') {
            const isEven = (i - 1) % 2 === 1;
            if (isEven && swingPercentage > 0) {
              // Classic MPC 16th swing delay
              const delayTicks = Math.round((swingPercentage / 100) * ticksPerStep * 0.40);
              targetTick += delayTicks;
            }
          } else if (mode === 'carp') {
            const isEven = (i - 1) % 2 === 1;
            if (isEven && swingPercentage > 0) {
              // CARP Audio Swing Master: micro-delay offset on offbeats
              const delayTicks = Math.round((swingPercentage / 100) * ticksPerStep * 0.32);
              targetTick += delayTicks;
            }
          } else if (mode === 'shaperbox') {
            const isEven = (i - 1) % 2 === 1;
            if (isEven && swingPercentage > 0) {
              // Cableguys ShaperBox curves
              const tension = (advancedSwingSettings.shaperboxTension ?? 50) / 100;
              const curveType = advancedSwingSettings.shaperboxCurveType ?? 'asymmetric';
              
              let curveMultiplier = 1.0;
              if (curveType === 'asymmetric') {
                curveMultiplier = Math.pow(swingPercentage / 100, 1.5 - tension) * 0.8;
              } else if (curveType === 'triplet') {
                curveMultiplier = 0.667 * (swingPercentage / 100);
              } else if (curveType === 'late_drag') {
                curveMultiplier = Math.pow(swingPercentage / 100, 2) * 1.0;
              } else if (curveType === 'early_push') {
                curveMultiplier = Math.sqrt(swingPercentage / 100) * 0.5;
              }
              
              const delayTicks = Math.round(curveMultiplier * ticksPerStep * 0.50);
              targetTick += delayTicks;
            }
          } else if (mode === 'skaka') {
            // Klevgrand Skaka: smart velocity-timing humanizer (softer ghost notes lag more)
            const humanize = (advancedSwingSettings.skakaHumanizeAmount ?? 50) / 100;
            const velocityFactor = (127 - velocity) / 127;
            const delayTicks = Math.round(velocityFactor * humanize * ticksPerStep * 0.45);
            targetTick += delayTicks;
          } else if (mode === 'fl_wrench') {
            // FL Studio wrench Time Shift (delay applied to ALL notes on the track)
            const shiftVal = advancedSwingSettings.flShiftAmount ?? swingPercentage;
            const delayTicks = Math.round((shiftVal / 100) * ticksPerStep * 0.75);
            targetTick += delayTicks;
          }
        } else {
          // AUTOMATIC INTEGRATED groove engine:
          const swingValPct = typeof swingVal === 'number' ? (swingVal > 1 ? swingVal : swingVal * 100) : 0;
          
          if (pitch === 'F#1') {
            // HI-HATS: MPC 16th swing + Skaka-style velocity humanization!
            const isOffbeat = (i - 1) % 2 === 1;
            if (isOffbeat && swingValPct > 0) {
              // Classic MPC 16th swing delay
              const delayTicks = Math.round((swingValPct / 100) * ticksPerStep * 0.40);
              targetTick += delayTicks;
            }
            
            // Skaka Velocity Humanization (softer hits drag slightly to feel natural and lazy)
            if (useVelocityHumanization && velocity < 100) {
              const velocityFactor = (127 - velocity) / 127;
              const skakaDelayTicks = Math.round(velocityFactor * 0.25 * ticksPerStep * 0.35);
              targetTick += skakaDelayTicks;
            }
          } else if (pitch === 'D1' || pitch === 'D#1') {
            // SNARE / CLAP: Lay-back pocket shift (FL Wrench style uniform delay)
            // A classic production trick to make beats feel "heavy" and in-the-pocket is slightly delaying the snare
            const snareShiftPct = swingValPct > 0 ? swingValPct : 8; // 8% default lay-back if straight but swing exists
            const delayTicks = Math.round((snareShiftPct / 100) * ticksPerStep * 0.25);
            targetTick += delayTicks;
          } else if (pitch === 'C1') {
            // KICK: Tight transient on-the-grid, with mild MPC swing if specifically requested
            const isOffbeat = (i - 1) % 2 === 1;
            if (isOffbeat && swingValPct > 0) {
              // Mild kick swing (half of the normal ratio to preserve the downbeat anchor)
              const delayTicks = Math.round((swingValPct / 100) * ticksPerStep * 0.20);
              targetTick += delayTicks;
            }
          } else {
            // Fallback legacy swing
            const isOffbeat = (i - 1) % 2 === 1;
            if (isOffbeat && swingAmount > 0) {
              const delayTicks = Math.round(swingAmount * ticksPerStep * 0.35);
              targetTick += delayTicks;
            }
          }
        }
        
        plannedNotes.push({
          step: i,
          targetTick,
          velocity
        });
      }
    }
    
    // Sort planned notes by targetTick
    plannedNotes.sort((a, b) => a.targetTick - b.targetTick);
    
    let currentTotalTicks = 0;
    for (const note of plannedNotes) {
      const waitTicks = note.targetTick - currentTotalTicks;
      const waitStr = waitTicks > 0 ? `T${waitTicks}` : '0';
      
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: [pitch],
        duration: stepDuration,
        wait: waitStr,
        velocity: note.velocity
      }));
      
      currentTotalTicks = note.targetTick + ticksPerStep;
    }

    // Ensure the track is exactly the requested length (4 or 8 bars)
    if (currentTotalTicks < targetTicks) {
      const remainingWait = targetTicks - currentTotalTicks;
      // Add a silent note at the very end to anchor the track length
      track.addEvent(new MidiWriter.NoteEvent({ 
        pitch: [pitch], 
        duration: 'T1', 
        wait: `T${remainingWait - 1}`, 
        velocity: 0 
      }));
    }
  };

  // General MIDI Drum Map: Kick = 36 (C1), Snare = 38 (D1), Clap = 39 (D#1), Hi-Hat = 42 (F#1), Open Hat = 46 (A#1), Perc = 37 (C#1)
  let tracksToInclude: MidiWriter.Track[] = [];
  if (drumsOnlyType === 'kick') {
    addDrumEvents(kickTrack, currentPattern.kick?.steps || [], 'C1', currentPattern.kick?.isDoubleTime || false, currentPattern.swing?.kick);
    tracksToInclude.push(kickTrack);
  } else if (drumsOnlyType === 'snare') {
    const snareNote = currentPattern.snare?.isClap ? 'D#1' : 'D1';
    addDrumEvents(snareTrack, currentPattern.snare?.steps || [], snareNote, currentPattern.snare?.isDoubleTime || false, currentPattern.swing?.snare);
    tracksToInclude.push(snareTrack);
  } else if (drumsOnlyType === 'hat') {
    addDrumEvents(hatTrack, currentPattern.hiHat?.steps || [], 'F#1', currentPattern.hiHat?.isDoubleTime || false, currentPattern.swing?.hiHat);
    tracksToInclude.push(hatTrack);
  } else if (drumsOnlyType === 'openHat') {
    addDrumEvents(openHatTrack, currentPattern.openHat?.steps || [], 'A#1', false, 0);
    tracksToInclude.push(openHatTrack);
  } else if (drumsOnlyType === 'perc') {
    addDrumEvents(percTrack, currentPattern.perc?.steps || [], 'C#1', false, 0);
    tracksToInclude.push(percTrack);
  } else {
    addDrumEvents(kickTrack, currentPattern.kick?.steps || [], 'C1', currentPattern.kick?.isDoubleTime || false, currentPattern.swing?.kick);
    const snareNote = currentPattern.snare?.isClap ? 'D#1' : 'D1';
    addDrumEvents(snareTrack, currentPattern.snare?.steps || [], snareNote, currentPattern.snare?.isDoubleTime || false, currentPattern.swing?.snare);
    addDrumEvents(hatTrack, currentPattern.hiHat?.steps || [], 'F#1', currentPattern.hiHat?.isDoubleTime || false, currentPattern.swing?.hiHat);
    if (currentPattern.openHat?.steps && currentPattern.openHat.steps.length > 0) {
      addDrumEvents(openHatTrack, currentPattern.openHat.steps, 'A#1', false, 0);
      tracksToInclude.push(openHatTrack);
    }
    if (currentPattern.perc?.steps && currentPattern.perc.steps.length > 0) {
      addDrumEvents(percTrack, currentPattern.perc.steps, 'C#1', false, 0);
      tracksToInclude.push(percTrack);
    }
    if (tracksToInclude.length === 0) {
      tracksToInclude = [kickTrack, snareTrack, hatTrack];
    } else {
      tracksToInclude = [kickTrack, snareTrack, hatTrack, ...(currentPattern.openHat?.steps?.length ? [openHatTrack] : []), ...(currentPattern.perc?.steps?.length ? [percTrack] : [])];
    }
  }

  const write = new MidiWriter.Writer(tracksToInclude);
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
export const getBeats = (val: string | undefined): number => {
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

    let originalTotalBeats = 0;
    for (const note of midiNotes) {
      originalTotalBeats += getBeats(note.wait) + getBeats(note.duration);
    }

    const targetBeats = bars * 4;
    // Stretch factor so the notes perfectly span targetBeats
    const stretchFactor = originalTotalBeats > 0 ? targetBeats / originalTotalBeats : 1;

    let cumulativeOriginalBeats = 0;
    let previousStretchedTicks = 0;

    midiNotes.forEach((note) => {
      let pitches = Array.isArray(note.pitch) ? note.pitch : note.pitch.split(',').map(p => p.trim());
      let transposedPitches = pitches.map(p => isDrums ? p : transposePitch(p, 0));

      const origWait = getBeats(note.wait);
      const origDuration = getBeats(note.duration);

      // Start and end times in the original timeline (in beats)
      const origStart = cumulativeOriginalBeats + origWait;
      const origEnd = origStart + origDuration;

      // Move original timeline forward
      cumulativeOriginalBeats = origEnd;

      // Map to the stretched timeline
      const scaledStartBeats = origStart * stretchFactor;
      const scaledEndBeats = origEnd * stretchFactor;

      // Convert beats to ticks (128 ticks per beat)
      const scaledStartTicks = Math.round(scaledStartBeats * 128);
      const scaledEndTicks = Math.round(scaledEndBeats * 128);

      // Calculate relative ticks
      const waitTicks = Math.max(0, scaledStartTicks - previousStretchedTicks);
      const durationTicks = Math.max(1, scaledEndTicks - scaledStartTicks);

      // Update previous stretched ticks tracker
      previousStretchedTicks = scaledStartTicks + durationTicks;

      const velocity = Math.min(127, Math.max(1, note.velocity || 100));

      customEvents.push(new MidiWriter.NoteEvent({
        pitch: transposedPitches,
        duration: `T${durationTicks}`,
        wait: `T${waitTicks}`,
        velocity: velocity
      }));
    });

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
