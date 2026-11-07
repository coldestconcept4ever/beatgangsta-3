import { MidiNote, DrumPattern, BeatRecipe, SongBreakdown } from '../types';

export interface ExactSongEntry {
  artist: string;
  title: string;
  year: string;
  genre: string;
  subgenre: string;
  exactBpm: number;
  keyScale: string;
  timeSignature: string;
  chordProgression: string;
  chordProgressionRoman: string;
  detectedSectionLengths: {
    intro: number;
    verse: number;
    hook: number;
    bridge: number;
    outro: number;
  };
  songBreakdown: SongBreakdown;
  stems: {
    lead?: {
      name: string;
      plugin: string;
      sourceSoundGoal: string;
      notes: MidiNote[];
    };
    bass?: {
      name: string;
      plugin: string;
      sourceSoundGoal: string;
      notes: MidiNote[];
    };
    pad?: {
      name: string;
      plugin: string;
      sourceSoundGoal: string;
      notes: MidiNote[];
    };
  };
  drumPattern: DrumPattern;
}

export const EXACT_SONG_DATABASE: ExactSongEntry[] = [
  {
    artist: "Alice Deejay",
    title: "Better Off Alone",
    year: "1999",
    genre: "Eurodance",
    subgenre: "Trance / Dance-Pop",
    exactBpm: 137,
    keyScale: "G# Minor",
    timeSignature: "4/4",
    chordProgression: "E Major -> D# Minor -> G# Minor -> F# Major",
    chordProgressionRoman: "VI - v - i - VII",
    detectedSectionLengths: {
      intro: 8,
      verse: 16,
      hook: 16,
      bridge: 8,
      outro: 8
    },
    songBreakdown: {
      canonicalSongInfo: {
        title: "Better Off Alone",
        artist: "Alice Deejay",
        year: "1999",
        exactBpm: 137,
        keyScale: "G# Minor",
        timeSignature: "4/4",
        chordProgressionRoman: "VI - v - i - VII (E Major -> D# Minor -> G# Minor -> F# Major)",
        primaryGenreVibe: "1999 Dutch Eurodance & Trance Anthem"
      },
      stemTranscriptions: [
        {
          stemName: "Lead Synth Hook",
          role: "Primary Melodic Arpeggio",
          soundSourceGoal: "Roland JP-8000 SuperSaw with 7 detuned voices, bright cutoff filter, and tempo stereo delay",
          transcriptionNotes: "16th-note 4-bar arpeggio phrase: G#4-B4-D#5-G#5-F#5-E5-D#5-B4 over E; F#4-A#4-D#5-F#5-E5-D#5-C#5-A#4 over D#m; G#4-B4-D#5-G#5-F#5-E5-D#5-B4 over G#m; F#4-A#4-C#5-F#5-E5-D#5-C#5-A#4 over F#.",
          sampleVaultMatch: "Synthesizer: Detuned Rave SuperSaw"
        },
        {
          stemName: "Pad Chords",
          role: "Atmospheric Harmonic Backdrop",
          soundSourceGoal: "Lush sustained trance pad with chorus and long hall reverb",
          transcriptionNotes: "Sustained 4-bar triad progression: Bar 1 E Major (E3-G#3-B3), Bar 2 D# Minor (D#3-F#3-A#3), Bar 3 G# Minor (G#3-B3-D#4), Bar 4 F# Major (F#3-A#3-C#4).",
          sampleVaultMatch: "Synthesizer: Trance Paddle MW+"
        },
        {
          stemName: "Synth Bass",
          role: "Driving Rhythm Foundation",
          soundSourceGoal: "SubLab / Analog synth bass with punchy sub and tight decay",
          transcriptionNotes: "Galloping 16th-note rolling bass following root notes: Bar 1 16x E1, Bar 2 16x D#1, Bar 3 16x G#1, Bar 4 16x F#1.",
          sampleVaultMatch: "SubLab: Trance Gallop Sub"
        },
        {
          stemName: "TR-909 Drums",
          role: "Four-on-the-Floor Rhythm Section",
          soundSourceGoal: "Classic TR-909 Kick, Offbeat Open Hat, 2/4 Clap, and 16th Closed Hats",
          transcriptionNotes: "Kick on 1, 5, 9, 13 (beats 1, 2, 3, 4); Open Hat on 3, 7, 11, 15 (offbeats); Clap on 5 & 13 (beats 2 & 4); 16th Closed Hats.",
          sampleVaultMatch: "Sample Vault: 909 Punch Kick, Sample Vault: Trance Offbeat Open Hat, Sample Vault: Snap 005 Lex Clap"
        }
      ],
      arrangementMap: [
        { sectionName: "Intro", barDuration: 8, activeStems: ["Lead Synth", "Percussion"], keyAutomationNotes: "Low pass filter opening on lead synth" },
        { sectionName: "Verse", barDuration: 16, activeStems: ["Synth Bass", "TR-909 Kick", "Hi-Hats", "Pad Chords"], keyAutomationNotes: "Bass driving rhythm, kick locked to downbeats" },
        { sectionName: "Hook", barDuration: 16, activeStems: ["Lead Synth", "Pad Chords", "Synth Bass", "TR-909 Kick", "Clap", "Open Hat", "Hi-Hats"], keyAutomationNotes: "Full dynamic energy, main arpeggio hook unleashed" },
        { sectionName: "Bridge", barDuration: 8, activeStems: ["Pad Chords", "Lead Synth"], keyAutomationNotes: "Filter sweep buildup before final hook drop" },
        { sectionName: "Outro", barDuration: 8, activeStems: ["Pad Chords", "TR-909 Kick"], keyAutomationNotes: "Fade out main elements" }
      ]
    },
    stems: {
      lead: {
        name: "Lead Synth",
        plugin: "AIR Music Technology - Xpand!2",
        sourceSoundGoal: "Recreate the iconic Roland JP-8000 style detuned SuperSaw trance lead arpeggio, bright, wide, and cutting through the mix with a classic 90s Eurodance feel.",
        notes: [
          // Bar 1 (over E Major) - 16 continuous 16th notes
          { pitch: 'G#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'G#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 100 },
          { pitch: 'G#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'G#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 100 },
          // Bar 2 (over D# Minor)
          { pitch: 'F#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 100 },
          { pitch: 'F#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 100 },
          // Bar 3 (over G# Minor)
          { pitch: 'G#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'G#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 100 },
          { pitch: 'G#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'G#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'B4', duration: '16n', wait: '0', velocity: 100 },
          // Bar 4 (over F# Major)
          { pitch: 'F#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 100 },
          { pitch: 'F#4', duration: '16n', wait: '0', velocity: 110 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'F#5', duration: '16n', wait: '0', velocity: 115 },
          { pitch: 'E5', duration: '16n', wait: '0', velocity: 112 },
          { pitch: 'D#5', duration: '16n', wait: '0', velocity: 105 },
          { pitch: 'C#5', duration: '16n', wait: '0', velocity: 108 },
          { pitch: 'A#4', duration: '16n', wait: '0', velocity: 100 }
        ]
      },
      bass: {
        name: "Synth Bass",
        plugin: "FutureAudioWorkshop - SubLab",
        sourceSoundGoal: "Deliver a powerful, driving 16th-note synth bassline that is deep, full, and provides a strong rhythmic foundation without muddying the mix.",
        notes: [
          ...Array(16).fill(null).map((_, i) => ({ pitch: 'E1', duration: '16n', wait: '0', velocity: i % 2 === 0 ? 118 : 105 })),
          ...Array(16).fill(null).map((_, i) => ({ pitch: 'D#1', duration: '16n', wait: '0', velocity: i % 2 === 0 ? 118 : 105 })),
          ...Array(16).fill(null).map((_, i) => ({ pitch: 'G#1', duration: '16n', wait: '0', velocity: i % 2 === 0 ? 118 : 105 })),
          ...Array(16).fill(null).map((_, i) => ({ pitch: 'F#1', duration: '16n', wait: '0', velocity: i % 2 === 0 ? 118 : 105 }))
        ]
      },
      pad: {
        name: "Pad Chords",
        plugin: "AIR Music Technology - Xpand!2",
        sourceSoundGoal: "Provide a lush, evolving, and wide chordal backdrop, characteristic of classic trance pads, supporting the lead melody with harmonic depth.",
        notes: [
          { pitch: 'E3, G#3, B3', duration: '1m', wait: '0', velocity: 90 },
          { pitch: 'D#3, F#3, A#3', duration: '1m', wait: '0', velocity: 90 },
          { pitch: 'G#3, B3, D#4', duration: '1m', wait: '0', velocity: 90 },
          { pitch: 'F#3, A#3, C#4', duration: '1m', wait: '0', velocity: 90 }
        ]
      }
    },
    drumPattern: {
      kick: { isDoubleTime: false, steps: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61] },
      snare: { isClap: true, isDoubleTime: false, steps: [5, 13, 21, 29, 37, 45, 53, 61] },
      hiHat: { isDoubleTime: false, steps: Array.from({ length: 64 }, (_, i) => i + 1) },
      openHat: { steps: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63] },
      velocityHumanized: false,
      swing: { kick: 0, snare: 0, hiHat: 0 }
    }
  },
  {
    artist: "Eiffel 65",
    title: "Blue (Da Ba Dee)",
    year: "1999",
    genre: "Eurodance",
    subgenre: "Dance-Pop",
    exactBpm: 128,
    keyScale: "G Minor",
    timeSignature: "4/4",
    chordProgression: "G Minor -> F Major -> Eb Major -> C Minor",
    chordProgressionRoman: "i - VII - VI - iv",
    detectedSectionLengths: { intro: 8, verse: 16, hook: 16, bridge: 8, outro: 8 },
    songBreakdown: {
      canonicalSongInfo: {
        title: "Blue (Da Ba Dee)",
        artist: "Eiffel 65",
        year: "1999",
        exactBpm: 128,
        keyScale: "G Minor",
        timeSignature: "4/4",
        chordProgressionRoman: "i - VII - VI - iv (Gm - F - Eb - Cm)",
        primaryGenreVibe: "Classic 1999 Italian Eurodance Anthem"
      },
      stemTranscriptions: [
        { stemName: "Piano Lead Hook", role: "Main Theme Lead", soundSourceGoal: "Korg M1 Bright Piano / Synth Lead", transcriptionNotes: "16th-note piano hook: G4-Bb4-D5-G5-F5-D5-Bb4-G4 over Gm; F4-A4-C5-F5-Eb5-C5-A4-F4 over F; Eb4-G4-Bb4-Eb5-D5-Bb4-G4-Eb4 over Eb; C4-Eb4-G4-C5-Bb4-G4-Eb4-C4 over Cm." },
        { stemName: "Synth Bass", role: "Driving Bassline", soundSourceGoal: "Tight sub-bass following root notes G1-F1-Eb1-C1", transcriptionNotes: "Driving 16th root note bass." },
        { stemName: "Drums", role: "Eurodance Four-on-the-Floor", soundSourceGoal: "909 Punch Kick, Offbeat Open Hat, Snappy Clap", transcriptionNotes: "Four-on-the-floor kick with upbeat hats." }
      ]
    },
    stems: {},
    drumPattern: {
      kick: { isDoubleTime: false, steps: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61] },
      snare: { isClap: true, isDoubleTime: false, steps: [5, 13, 21, 29, 37, 45, 53, 61] },
      hiHat: { isDoubleTime: false, steps: Array.from({ length: 64 }, (_, i) => i + 1) },
      openHat: { steps: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63] },
      velocityHumanized: false,
      swing: { kick: 0, snare: 0, hiHat: 0 }
    }
  },
  {
    artist: "Darude",
    title: "Sandstorm",
    year: "1999",
    genre: "Trance",
    subgenre: "Hard Trance",
    exactBpm: 136,
    keyScale: "B Minor",
    timeSignature: "4/4",
    chordProgression: "B Minor -> D Major -> E Minor -> F# Minor",
    chordProgressionRoman: "i - III - iv - v",
    detectedSectionLengths: { intro: 16, verse: 16, hook: 32, bridge: 8, outro: 16 },
    songBreakdown: {
      canonicalSongInfo: {
        title: "Sandstorm",
        artist: "Darude",
        year: "1999",
        exactBpm: 136,
        keyScale: "B Minor",
        timeSignature: "4/4",
        chordProgressionRoman: "i - III - iv - v (Bm - D - Em - F#m)",
        primaryGenreVibe: "Iconic 1999 Finnish Hard Trance Anthem"
      },
      stemTranscriptions: [
        { stemName: "Staccato Lead Synth", role: "Iconic Staccato Hook", soundSourceGoal: "Nord Lead 2 staccato lead with fast pitch envelope", transcriptionNotes: "16th-note staccato pulse: B4-B4-B4-B4-B4-B4-B4-D5-B4-B4-B4-B4-B4-B4-B4-D5 over Bm." }
      ]
    },
    stems: {},
    drumPattern: {
      kick: { isDoubleTime: false, steps: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61] },
      snare: { isClap: true, isDoubleTime: false, steps: [5, 13, 21, 29, 37, 45, 53, 61] },
      hiHat: { isDoubleTime: false, steps: Array.from({ length: 64 }, (_, i) => i + 1) },
      openHat: { steps: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63] },
      velocityHumanized: false,
      swing: { kick: 0, snare: 0, hiHat: 0 }
    }
  }
];

export function findExactSongData(query: string): ExactSongEntry | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();
  
  return EXACT_SONG_DATABASE.find(entry => {
    const titleMatch = entry.title.toLowerCase().includes(q) || q.includes(entry.title.toLowerCase());
    const artistMatch = entry.artist.toLowerCase().includes(q) || q.includes(entry.artist.toLowerCase());
    return titleMatch || (artistMatch && q.length > 5);
  });
}
