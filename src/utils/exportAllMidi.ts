import MidiWriter from 'midi-writer-js';
import { generateMidiTrack, generateAudioLoop, generateDrumMidiBaseData, isMidiCapable, PatternLength, PatternVariation } from './midiGenerator';
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
      const lengths: PatternLength[] = [4, 8];
      const variations: PatternVariation[] = ['A', 'B'];
      
      for (const bars of lengths) {
        for (const variation of variations) {
          let sectionMidiNotes: MidiNote[] | undefined;
          if (Array.isArray(ing.midiNotes)) {
            sectionMidiNotes = ing.midiNotes;
          } else if (ing.midiNotes) {
            sectionMidiNotes = ing.midiNotes.hook || ing.midiNotes.verse || [];
          }
          const track = generateMidiTrack(ing.name, ing.loopGuide || '', bpm, bars, variation, recipe.title, sectionMidiNotes);
          const write = new MidiWriter.Writer([track]);
          const midiBytes = write.buildFile();
          
          const baseName = `${safeTitle}_${ing.name.replace(/[^a-z0-9]/gi, '_')}_${bars}Bar_${variation}_${bpm}BPM`;
          
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

  // Drums
  if (recipe.drumPatterns) {
    const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;
    for (const section of sections) {
      const pattern = recipe.drumPatterns[section];
      if (pattern) {
        for (const humanized of [true, false]) {
          for (const bars of [4, 8] as PatternLength[]) {
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
    for (const ing of tracks) {
      if (isMidiCapable(ing.name, ing.loopGuide)) {
        const lengths: PatternLength[] = [4, 8];
        const variations: PatternVariation[] = ['A', 'B'];
        
        for (const bars of lengths) {
          for (const variation of variations) {
            let sectionMidiNotes: MidiNote[] | undefined;
            if (Array.isArray(ing.midiNotes)) {
              sectionMidiNotes = ing.midiNotes;
            } else if (ing.midiNotes) {
              sectionMidiNotes = ing.midiNotes.hook || ing.midiNotes.verse || [];
            }
            const track = generateMidiTrack(ing.name, ing.loopGuide || '', bpm, bars, variation, recipe.title, sectionMidiNotes);
            const write = new MidiWriter.Writer([track]);
            const midiBytes = write.buildFile();
            
            const fileName = `${safeTitle}_${ing.name.replace(/[^a-z0-9]/gi, '_')}_${bars}Bar_${variation}_${bpm}BPM.${extension}`;
            
            const subFolderName = `${bars} Bar ${variation}`;
            const subFolder = instrumentsFolder.folder(subFolderName);
            
            subFolder?.file(fileName, midiBytes);
          }
        }
      }
    }
  }

  // 2. Generate Drum MIDI files
  const drumsFolder = zip.folder('Drums');
  if (drumsFolder && recipe.drumPatterns) {
    const sections = ['intro', 'verse', 'hook', 'bridge', 'outro'] as const;
    
    for (const section of sections) {
      const pattern = recipe.drumPatterns[section];
      if (pattern) {
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        const subFolder = drumsFolder.folder(sectionName);
        
        // Generate both humanized and non-humanized versions
        for (const humanized of [true, false]) {
          for (const bars of [4, 8] as PatternLength[]) {
            const midiBytes = generateDrumMidiBaseData(pattern, recipe.title, section, bpm, humanized, bars);
            if (midiBytes && midiBytes.length > 0) {
              const humanizedSuffix = humanized ? '_Humanized' : '';
              const fileName = `${safeTitle}_${section}_Drums${humanizedSuffix}_${bars}Bar_${bpm}BPM.${extension}`;
              
              subFolder?.file(fileName, midiBytes);
            }
          }
        }
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
};
