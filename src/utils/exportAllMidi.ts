import MidiWriter from 'midi-writer-js';
import { generateMidiTrack, generateAudioLoop, generateDrumMidiBaseData, generateFullSongMidiTrack, generateFullSongDrumPartMidi, isMidiCapable, getBeats, PatternLength, PatternVariation } from './midiGenerator';
import { BeatRecipe, MidiNote } from '../types';

// Dynamic import for JSZip
const getJSZip = () => import('jszip').then(m => m.default);

export const generateIndividualMidiFiles = async (recipe: BeatRecipe): Promise<{ name: string; data: string; type: 'midi' | 'loop' }[]> => {
  const files: { name: string; data: string; type: 'midi' | 'loop' }[] = [];
  const bpm = recipe.bpm || 120;
  const safeTitle = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  let fileIndex = 1;

  // Separate Full Song Drums (Kicks, Snares, Hi-Hats, Open Hats, Percussion)
  if (recipe.drumPatterns) {
    const drumParts: { key: 'kick' | 'snare' | 'hiHat' | 'openHat' | 'perc'; name: string }[] = [
      { key: 'kick', name: 'Kick' },
      { key: 'snare', name: 'Snare' },
      { key: 'hiHat', name: 'HiHats' },
      { key: 'openHat', name: 'OpenHat' },
      { key: 'perc', name: 'Percussion' }
    ];

    for (const dp of drumParts) {
      const drumBytes = generateFullSongDrumPartMidi(recipe.drumPatterns, dp.key, recipe.title, bpm, recipe.detectedSectionLengths);
      if (drumBytes && drumBytes.length > 0) {
        const trackNum = String(fileIndex++).padStart(2, '0');
        files.push({
          name: `${trackNum}_${safeTitle}_${dp.name}_FullSong.mid`,
          data: window.btoa(String.fromCharCode.apply(null, Array.from(drumBytes))),
          type: 'midi'
        });
      }
    }
  }

  // Full Song Melodic & Harmonic Instruments
  const tracks = recipe.instruments || [];
  for (let idx = 0; idx < tracks.length; idx++) {
    const ing = tracks[idx];
    if (isMidiCapable(ing.name, ing.loopGuide)) {
      const track = generateFullSongMidiTrack(ing.name, bpm, recipe.title, ing.midiNotes, recipe.detectedSectionLengths, ing.loopGuide);
      const write = new MidiWriter.Writer([track]);
      const midiBytes = write.buildFile();
      const safeInstName = ing.name.replace(/[^a-z0-9]/gi, '_');
      const trackNum = String(fileIndex++).padStart(2, '0');
      const baseName = `${trackNum}_${safeTitle}_${safeInstName}_FullSong`;

      files.push({
        name: `${baseName}.mid`,
        data: window.btoa(String.fromCharCode.apply(null, Array.from(midiBytes))),
        type: 'midi'
      });
    }
  }

  return files;
};

export const generateAllMidiZip = async (recipe: BeatRecipe, dawType?: string | null): Promise<Blob> => {
  const JSZip = await getJSZip();
  const zip = new JSZip();
  const bpm = recipe.bpm || 120;
  const safeTitle = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  let fileIndex = 1;

  // 1. Separate Full Song Drum MIDIs (Kick, Snare, HiHats, OpenHat, Percussion)
  if (recipe.drumPatterns) {
    const drumParts: { key: 'kick' | 'snare' | 'hiHat' | 'openHat' | 'perc'; name: string }[] = [
      { key: 'kick', name: 'Kick' },
      { key: 'snare', name: 'Snare' },
      { key: 'hiHat', name: 'HiHats' },
      { key: 'openHat', name: 'OpenHat' },
      { key: 'perc', name: 'Percussion' }
    ];

    for (const dp of drumParts) {
      const drumBytes = generateFullSongDrumPartMidi(recipe.drumPatterns, dp.key, recipe.title, bpm, recipe.detectedSectionLengths);
      if (drumBytes && drumBytes.length > 0) {
        const trackNum = String(fileIndex++).padStart(2, '0');
        zip.file(`${trackNum}_${safeTitle}_${dp.name}_FullSong.mid`, drumBytes);
      }
    }
  }

  // 2. Full Song Melodic/Harmonic Instruments
  const tracks = recipe.instruments || [];
  tracks.forEach((ing) => {
    if (isMidiCapable(ing.name, ing.loopGuide)) {
      const track = generateFullSongMidiTrack(ing.name, bpm, recipe.title, ing.midiNotes, recipe.detectedSectionLengths, ing.loopGuide);
      const write = new MidiWriter.Writer([track]);
      const midiBytes = write.buildFile();
      const safeInstName = ing.name.replace(/[^a-z0-9]/gi, '_');
      const trackNum = String(fileIndex++).padStart(2, '0');
      zip.file(`${trackNum}_${safeTitle}_${safeInstName}_FullSong.mid`, midiBytes);
    }
  });

  // 3. Comprehensive Sound Design & Mixing Guide text file
  let guideText = `========================================================================\n`;
  guideText += ` BEATGANGSTA STUDIO ARRANGEMENT & MIXING GUIDE\n`;
  guideText += `========================================================================\n\n`;
  guideText += `Song Title: ${recipe.title}\n`;
  guideText += `Style / Aesthetic: ${recipe.style}\n`;
  guideText += `Tempo: ${bpm} BPM\n`;
  if (recipe.detectedSectionLengths) {
    guideText += `\nARRANGEMENT MAP (Section Bar Counts):\n`;
    Object.entries(recipe.detectedSectionLengths).forEach(([sec, bars]) => {
      guideText += ` - ${sec.toUpperCase()}: ${bars} bars\n`;
    });
  }
  guideText += `\nDAW DRAG-AND-DROP INSTRUCTION:\n`;
  guideText += `All included MIDI files span the ENTIRE duration of the song from Bar 1 (0:00:00) to the end.\n`;
  guideText += `Simply drag all .mid files directly onto separate tracks in your DAW starting at Bar 1 Beat 1.\n`;
  guideText += `All musical rests and section entrances/exits are already automated and locked into place!\n\n`;

  guideText += `========================================================================\n`;
  guideText += ` DRUM INSTRUMENTS & ENHANCEMENT FX (KICKS, SNARES, HATS, 808)\n`;
  guideText += `========================================================================\n\n`;

  if (recipe.drumKitAdvice) {
    const drumAdviceList = [
      { name: 'Kick Drum', advice: recipe.drumKitAdvice.kick, vObj: recipe.drumKitAdvice.kickVirtualInstrumentObj, vStr: recipe.drumKitAdvice.kickVirtualInstrument, fx: recipe.drumKitAdvice.kickFXPlugins },
      { name: 'Snare Drum', advice: recipe.drumKitAdvice.snare, vObj: recipe.drumKitAdvice.snareVirtualInstrumentObj, vStr: recipe.drumKitAdvice.snareVirtualInstrument, fx: recipe.drumKitAdvice.snareFXPlugins },
      { name: 'Hi-Hats', advice: recipe.drumKitAdvice.hiHat, vObj: recipe.drumKitAdvice.hiHatVirtualInstrumentObj, vStr: recipe.drumKitAdvice.hiHatVirtualInstrument, fx: recipe.drumKitAdvice.hiHatFXPlugins },
      { name: 'Clap', advice: recipe.drumKitAdvice.clap, vObj: recipe.drumKitAdvice.clapVirtualInstrumentObj, vStr: recipe.drumKitAdvice.clapVirtualInstrument, fx: recipe.drumKitAdvice.clapFXPlugins },
      { name: 'Sub Bass / 808', advice: recipe.drumKitAdvice.bass, vObj: recipe.drumKitAdvice.bassVirtualInstrumentObj, vStr: recipe.drumKitAdvice.bassVirtualInstrument, fx: recipe.drumKitAdvice.bassFXPlugins }
    ];

    drumAdviceList.forEach((item) => {
      if (item.advice || item.vObj || item.vStr || (item.fx && item.fx.length > 0)) {
        guideText += `------------------------------------------------------------------------\n`;
        guideText += `DRUM STEM: ${item.name}\n`;
        if (item.advice) {
          guideText += `Tuning & Tone Character: ${item.advice}\n`;
        }
        if (item.vObj?.name || item.vStr) {
          guideText += `Recommended VST/Sampler: ${item.vObj?.name || item.vStr}\n`;
        }
        if (item.vObj?.deepDive && item.vObj.deepDive.length > 0) {
          guideText += `\nSound Design Settings:\n`;
          item.vObj.deepDive.forEach(param => {
            guideText += `  * ${param.parameter}: ${param.value} (${param.explanation || ''})\n`;
          });
        }
        if (item.fx && item.fx.length > 0) {
          guideText += `\nInsert FX Chain:\n`;
          item.fx.forEach((fx, fIdx) => {
            guideText += `  ${fIdx + 1}. ${fx.name} (${fx.purpose})\n`;
            if (fx.deepDive && fx.deepDive.length > 0) {
              fx.deepDive.forEach(p => {
                guideText += `     - ${p.parameter}: ${p.value} (${p.explanation || ''})\n`;
              });
            } else if (fx.settings) {
              guideText += `     - Settings: ${fx.settings}\n`;
            }
          });
        }
        guideText += `\n`;
      }
    });
  }

  guideText += `========================================================================\n`;
  guideText += ` MELODIC & HARMONIC INSTRUMENTS & FX CHAINS\n`;
  guideText += `========================================================================\n\n`;

  tracks.forEach((track, idx) => {
    const trackNum = String(idx + 1).padStart(2, '0');
    const safeInst = track.name.replace(/[^a-z0-9]/gi, '_');
    guideText += `------------------------------------------------------------------------\n`;
    guideText += `TRACK ${trackNum}: ${track.name}\n`;
    guideText += `MIDI File: ${safeInst}_FullSong.mid\n`;
    guideText += `Musical Role: ${track.loopGuide || 'Main harmonic / melodic layer'}\n`;
    if (track.plugin) {
      guideText += `Recommended VST: ${track.plugin}\n`;
    }
    if (track.deepDive && track.deepDive.length > 0) {
      guideText += `\nSound Design & Plugin Settings:\n`;
      track.deepDive.forEach(param => {
        guideText += `  * ${param.parameter}: ${param.value} (${param.explanation || ''})\n`;
      });
    }
    if (track.fxPlugins && track.fxPlugins.length > 0) {
      guideText += `\nInsert FX Chain:\n`;
      track.fxPlugins.forEach((fx, fxIdx) => {
        guideText += `  ${fxIdx + 1}. ${fx.name} (${fx.purpose})\n`;
        if (fx.deepDive && fx.deepDive.length > 0) {
          fx.deepDive.forEach(p => {
            guideText += `     - ${p.parameter}: ${p.value}\n`;
          });
        }
      });
    }
    guideText += `\n`;
  });

  if (recipe.masterPlugins && recipe.masterPlugins.length > 0) {
    guideText += `========================================================================\n`;
    guideText += ` MASTER BUS SIGNAL CHAIN\n`;
    guideText += `========================================================================\n`;
    recipe.masterPlugins.forEach((mp, mIdx) => {
      guideText += `${mIdx + 1}. ${mp.name} (${mp.purpose})\n`;
      if (mp.deepDive && mp.deepDive.length > 0) {
        mp.deepDive.forEach(p => {
          guideText += `   * ${p.parameter}: ${p.value}\n`;
        });
      }
    });
  }

  zip.file(`INSTRUMENT_SOUND_DESIGN_AND_MIX_GUIDE.txt`, guideText);

  return await zip.generateAsync({ type: 'blob' });
};
