import MidiWriter from 'midi-writer-js';
import { generateMidiTrack, generateAudioLoop, generateDrumMidiBaseData, isMidiCapable, getBeats, PatternLength, PatternVariation } from './midiGenerator';
import { BeatRecipe, MidiNote } from '../types';

// Dynamic import for JSZip
const getJSZip = () => import('jszip').then(m => m.default);

export const generateIndividualMidiFiles = async (recipe: BeatRecipe): Promise<{ name: string; data: string; type: 'midi' | 'loop' }[]> => {
  const files: { name: string; data: string; type: 'midi' | 'loop' }[] = [];
  const bpm = recipe.bpm || 120;
  const safeTitle = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Instruments
  const tracks = recipe.instruments || [];
  for (const ing of tracks) {
    if (isMidiCapable(ing.name, ing.loopGuide)) {
      const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;
      for (const section of sections) {
        let sectionMidiNotes: MidiNote[] | undefined;
        if (Array.isArray(ing.midiNotes)) {
          if (section !== 'hook') continue;
          sectionMidiNotes = ing.midiNotes;
        } else if (ing.midiNotes && typeof ing.midiNotes === 'object') {
          sectionMidiNotes = (ing.midiNotes as any)[section];
        }

        if (!sectionMidiNotes || sectionMidiNotes.length === 0) continue;

        let originalTotalBeats = 0;
        for (const note of sectionMidiNotes) {
          originalTotalBeats += getBeats(note.wait) + getBeats(note.duration);
        }

        const naturalBars = Math.max(4, Math.round(originalTotalBeats / 4)) as PatternLength;
        const lengths: PatternLength[] = recipe.detectedSectionLengths?.[section] !== undefined
          ? [recipe.detectedSectionLengths[section]!]
          : (naturalBars > 8 ? [naturalBars] : [4, 8]);
        const variations: PatternVariation[] = ['A', 'B'];

        for (const bars of lengths) {
          for (const variation of variations) {
            const track = generateMidiTrack(ing.name, ing.loopGuide || '', bpm, bars, variation, recipe.title, sectionMidiNotes);
            const write = new MidiWriter.Writer([track]);
            const midiBytes = write.buildFile();

            const baseName = `${safeTitle}_${section}_${ing.name.replace(/[^a-z0-9]/gi, '_')}_${bars}Bar_${variation}_${bpm}BPM`;

            // Add MIDI
            files.push({
              name: `${baseName}.mid`,
              data: window.btoa(String.fromCharCode.apply(null, Array.from(midiBytes))),
              type: 'midi'
            });

            // Add Audioloop
            const loopBlob = await generateAudioLoop(midiBytes, bpm);
            const loopBuffer = await loopBlob.arrayBuffer();
            files.push({
              name: `${baseName}.audioloop`,
              data: arrayBufferToBase64(loopBuffer),
              type: 'loop'
            });
          }
        }
      }
    }
  }

  // Drums
  if (recipe.drumPatterns) {
    const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;
    for (const section of sections) {
      const pattern = recipe.drumPatterns[section];
      if (pattern) {
        
        let maxStep = 0;
        const getStepsPerBar = (isDT?: boolean) => isDT ? 32 : 16;
        let naturalBars = 4;
        const checkMaxBars = (part: any) => {
          if (!part || !Array.isArray(part.steps)) return;
          const stepsPerBar = getStepsPerBar(part.isDoubleTime);
          part.steps.forEach((s: any) => {
            const stepNum = typeof s === 'number' ? s : s.step;
            const b = Math.ceil(stepNum / stepsPerBar);
            if (b > naturalBars) naturalBars = b;
          });
        };
        checkMaxBars(pattern.kick);
        checkMaxBars(pattern.snare);
        checkMaxBars(pattern.hiHat);
        const lengths: PatternLength[] = recipe.detectedSectionLengths?.[section] !== undefined
          ? [recipe.detectedSectionLengths[section]!]
          : ((naturalBars > 8 ? [naturalBars] : [4, 8]) as PatternLength[]);

        for (const humanized of [true, false]) {
          for (const bars of lengths) {

            const midiBytes = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars);
            if (midiBytes && midiBytes.length > 0) {
              const humanizedSuffix = humanized ? '_Humanized' : '';
              const baseName = `${safeTitle}_${section}_Drums${humanizedSuffix}_${bars}Bar_${bpm}BPM`;
              
              files.push({
                name: `${baseName}.mid`,
                data: window.btoa(String.fromCharCode.apply(null, Array.from(midiBytes))),
                type: 'midi'
              });

              const loopBlob = await generateAudioLoop(midiBytes, bpm);
              const loopBuffer = await loopBlob.arrayBuffer();
              files.push({
                name: `${baseName}.audioloop`,
                data: arrayBufferToBase64(loopBuffer),
                type: 'loop'
              });
            }
          }
        }
      }
    }
  }

  return files;
};

export const generateAllMidiZip = async (recipe: BeatRecipe, dawType?: string | null): Promise<Blob> => {
  const JSZip = await getJSZip();
  const zip = new JSZip();
  const extension = 'mid';
  const bpm = recipe.bpm || 120;
  
  const safeTitle = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  
  // 1. Generate Instrument MIDI files
  const instrumentsFolder = zip.folder('Instruments');
  if (instrumentsFolder) {
    const tracks = recipe.instruments || [];
    const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;

    for (const section of sections) {
      const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
      const subFolder = instrumentsFolder.folder(sectionName);

      for (const ing of tracks) {
        if (isMidiCapable(ing.name, ing.loopGuide)) {
          let sectionMidiNotes: MidiNote[] | undefined;
          if (Array.isArray(ing.midiNotes)) {
            if (section !== 'hook') continue;
            sectionMidiNotes = ing.midiNotes;
          } else if (ing.midiNotes && typeof ing.midiNotes === 'object') {
            sectionMidiNotes = (ing.midiNotes as any)[section];
          }

          if (!sectionMidiNotes || sectionMidiNotes.length === 0) continue;

          let originalTotalBeats = 0;
          for (const note of sectionMidiNotes) {
            originalTotalBeats += getBeats(note.wait) + getBeats(note.duration);
          }

          const naturalBars = Math.max(4, Math.round(originalTotalBeats / 4)) as PatternLength;
          const lengths: PatternLength[] = recipe.detectedSectionLengths?.[section] !== undefined
            ? [recipe.detectedSectionLengths[section]!]
            : (naturalBars > 8 ? [naturalBars] : [4, 8]);
          const variations: PatternVariation[] = ['A', 'B'];

          for (const bars of lengths) {
            for (const variation of variations) {
              const track = generateMidiTrack(ing.name, ing.loopGuide || '', bpm, bars, variation, recipe.title, sectionMidiNotes);
              const write = new MidiWriter.Writer([track]);
              const midiBytes = write.buildFile();

              const fileName = `${safeTitle}_${ing.name.replace(/[^a-z0-9]/gi, '_')}_${bars}Bar_${variation}_${bpm}BPM.${extension}`;

              const barFolder = subFolder?.folder(`${bars} Bar ${variation}`);
              barFolder?.file(fileName, midiBytes);
            }
          }
        }
      }
    }
  }

  // 2. Generate Drum MIDI files
  if (recipe.drumPatterns) {
    const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;
    const fullDrumsFolder = zip.folder('Drums/Full_Mix');
    const kicksFolder = zip.folder('Drums/Kicks');
    const hatsFolder = zip.folder('Drums/HiHats');
    const openHatsFolder = zip.folder('Drums/OpenHats');
    const snaresFolder = zip.folder('Drums/Snares_Claps');
    const percsFolder = zip.folder('Drums/Percussion');
    
    for (const section of sections) {
      const pattern = recipe.drumPatterns[section];
      if (pattern) {
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        const subFolderFull = fullDrumsFolder?.folder(sectionName);
        const subFolderKicks = kicksFolder?.folder(sectionName);
        const subFolderHats = hatsFolder?.folder(sectionName);
        const subFolderOpenHats = openHatsFolder?.folder(sectionName);
        const subFolderSnares = snaresFolder?.folder(sectionName);
        const subFolderPercs = percsFolder?.folder(sectionName);
        
        // Generate both humanized and non-humanized versions
        
        let maxStep = 0;
        const getStepsPerBar = (isDT?: boolean) => isDT ? 32 : 16;
        let naturalBars = 4;
        const checkMaxBars = (part: any) => {
          if (!part || !Array.isArray(part.steps)) return;
          const stepsPerBar = getStepsPerBar(part.isDoubleTime);
          part.steps.forEach((s: any) => {
            const stepNum = typeof s === 'number' ? s : s.step;
            const b = Math.ceil(stepNum / stepsPerBar);
            if (b > naturalBars) naturalBars = b;
          });
        };
        checkMaxBars(pattern.kick);
        checkMaxBars(pattern.snare);
        checkMaxBars(pattern.hiHat);
        checkMaxBars(pattern.openHat);
        checkMaxBars(pattern.perc);
        const lengths: PatternLength[] = recipe.detectedSectionLengths?.[section] !== undefined
          ? [recipe.detectedSectionLengths[section]!]
          : ((naturalBars > 8 ? [naturalBars] : [4, 8]) as PatternLength[]);

        for (const humanized of [true, false]) {
          for (const bars of lengths) {
            const humanizedSuffix = humanized ? '_Humanized' : '';

            // 1) Full Mix
            const midiBytesFull = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'full');
            if (midiBytesFull && midiBytesFull.length > 0) {
              const fileName = `${safeTitle}_${section}_FullDrums${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
              subFolderFull?.file(fileName, midiBytesFull);
            }

            // 2) Kicks Only
            const midiBytesKick = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'kick');
            if (midiBytesKick && midiBytesKick.length > 0) {
              const fileName = `${safeTitle}_${section}_Kick${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
              subFolderKicks?.file(fileName, midiBytesKick);
            }

            // 3) Hats Only
            const midiBytesHat = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'hat');
            if (midiBytesHat && midiBytesHat.length > 0) {
              const fileName = `${safeTitle}_${section}_Hat${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
              subFolderHats?.file(fileName, midiBytesHat);
            }

            // 4) Open Hats Only (if present)
            if (pattern.openHat?.steps && pattern.openHat.steps.length > 0) {
              const midiBytesOpenHat = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'openHat');
              if (midiBytesOpenHat && midiBytesOpenHat.length > 0) {
                const fileName = `${safeTitle}_${section}_OpenHat${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
                subFolderOpenHats?.file(fileName, midiBytesOpenHat);
              }
            }

            // 5) Snares / Claps Only
            const midiBytesSnare = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'snare');
            if (midiBytesSnare && midiBytesSnare.length > 0) {
              const snareType = pattern.snare?.isClap ? 'Clap' : 'Snare';
              const fileName = `${safeTitle}_${section}_${snareType}${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
              subFolderSnares?.file(fileName, midiBytesSnare);
            }

            // 6) Percussion Only (if present)
            if (pattern.perc?.steps && pattern.perc.steps.length > 0) {
              const midiBytesPerc = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars, undefined, 'perc');
              if (midiBytesPerc && midiBytesPerc.length > 0) {
                const fileName = `${safeTitle}_${section}_Perc${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
                subFolderPercs?.file(fileName, midiBytesPerc);
              }
            }
          }
        }
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
};
