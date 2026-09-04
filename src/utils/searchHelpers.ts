import { VSTPlugin } from '../types';

export const UADX_MINIMOOG_PLUGIN: VSTPlugin = {
  vendor: "Universal Audio",
  name: "UADx Minimoog",
  type: "Virtual Instruments",
  version: "1.0",
  lastModified: new Date().toISOString(),
  description: "The definitive software recreation of Bob Moog's iconic 1970 analog synthesizer, capturing its signature 24dB ladder filter and rich triple-oscillator punch.",
  parameters: [
    "Tune", "Glide", "Modulation Mix", "Oscillator Modulation",
    "Oscillator 1 Range", "Oscillator 1 Waveform", "Oscillator 1 Volume", "Oscillator 1 Switch",
    "Oscillator 2 Range", "Oscillator 2 Frequency", "Oscillator 2 Waveform", "Oscillator 2 Volume", "Oscillator 2 Switch",
    "Oscillator 3 Range", "Oscillator 3 Frequency", "Oscillator 3 Waveform", "Oscillator 3 Volume", "Oscillator 3 Switch", "Oscillator 3 Control",
    "Filter Cutoff Frequency", "Filter Emphasis", "Amount of Contour", "Filter Attack Time", "Filter Decay Time", "Filter Sustain Level",
    "Filter Modulation", "Filter Keyboard Control 1", "Filter Keyboard Control 2",
    "Loudness Attack Time", "Loudness Decay Time", "Loudness Sustain Level", "Decay Switch", "Master Volume", "Output Switch"
  ]
};

export const DEFAULT_FLAGSHIP_PLUGINS: VSTPlugin[] = [
  UADX_MINIMOOG_PLUGIN,
  {
    vendor: "Universal Audio",
    name: "1176LN Classic Limiter",
    type: "Dynamics",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Ultra-fast FET limiting amplifier with iconic punch and aggression.",
    parameters: ["Input", "Output", "Attack", "Release", "Ratio"]
  },
  {
    vendor: "Universal Audio",
    name: "Teletronix LA-2A Gray",
    type: "Dynamics",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Smooth optical tube compression for vocals, leads, and bass.",
    parameters: ["Peak Reduction", "Gain", "Mode"]
  },
  {
    vendor: "Universal Audio",
    name: "Pultec EQP-1A",
    type: "Equalizers",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Vintage tube program equalizer renowned for low-end weight and silky top-end sheen.",
    parameters: ["Boost", "Atten", "Low Frequency", "High Boost", "Bandwidth", "High Atten"]
  },
  {
    vendor: "Universal Audio",
    name: "Pure Plate Reverb",
    type: "Reverbs & Delays",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Lush mechanical plate reverb with warm vintage tail and stereo depth.",
    parameters: ["Reverb Time", "Pre Delay", "Low Cut", "High Cut", "Mix"]
  },
  {
    vendor: "Universal Audio",
    name: "Galaxy Tape Echo",
    type: "Reverbs & Delays",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Classic tape delay and spring reverb unit for dub and stereo space.",
    parameters: ["Repeat Rate", "Intensity", "Echo Volume", "Bass", "Treble", "Mode Selector"]
  },
  {
    vendor: "FabFilter",
    name: "Pro-Q 3",
    type: "Equalizers",
    version: "3.0",
    lastModified: new Date().toISOString(),
    description: "Industry standard high-precision dynamic equalizer.",
    parameters: ["Band 1 Gain", "Band 1 Freq", "Band 2 Gain", "Band 2 Freq", "Band 3 Gain", "Band 3 Freq"]
  },
  {
    vendor: "Soundtheory",
    name: "Gullfoss",
    type: "Dynamic EQ",
    version: "1.0",
    lastModified: new Date().toISOString(),
    description: "Intelligent automatic EQ processor for real-time clarity.",
    parameters: ["Recover", "Tame", "Bias", "Brighten", "Boost"]
  }
];

export const getEffectivePlugins = (
  userPlugins: VSTPlugin[],
  withMinimoog = true,
  queryContext = ''
): VSTPlugin[] => {
  let list = userPlugins.length > 0 ? [...userPlugins] : [...DEFAULT_FLAGSHIP_PLUGINS];
  const hasMinimoog = list.some(p => p.name.toLowerCase().includes('minimoog') || p.name.toLowerCase().includes('moog'));
  const needsMinimoog = withMinimoog || 
    queryContext.toLowerCase().includes('moog') || 
    queryContext.toLowerCase().includes('alice deejay') || 
    queryContext.toLowerCase().includes('better off alone');
    
  if (!hasMinimoog && needsMinimoog) {
    list.unshift(UADX_MINIMOOG_PLUGIN);
  }
  return list;
};

export const QUICK_SEARCH_CHIPS = {
  song: [
    { label: "Alice Deejay - Better Off Alone", bpm: "138", query: "Better Off Alone by Alice Deejay" },
    { label: "Daft Punk - One More Time", bpm: "123", query: "One More Time by Daft Punk" },
    { label: "Darude - Sandstorm", bpm: "136", query: "Sandstorm by Darude" },
    { label: "Faithless - Insomnia", bpm: "127", query: "Insomnia by Faithless" },
    { label: "Robert Miles - Children", bpm: "138", query: "Children by Robert Miles" },
    { label: "Avicii - Levels", bpm: "126", query: "Levels by Avicii" },
    { label: "Travis Scott - Sicko Mode", bpm: "155", query: "Sicko Mode by Travis Scott" },
  ],
  vibe: [
    { label: "90s Eurodance Trance (Catchy Saw Lead)", bpm: "138", query: "90s Eurodance Trance, Catchy Saw Hook" },
    { label: "Euphoric Club Anthem", bpm: "130", query: "Euphoric Club Anthem, Big Room Lead" },
    { label: "Dark Melodic Trap", bpm: "140", query: "Dark Drill, Gritty Street Rap" },
    { label: "Cyberpunk Phonk & Cloud Rap", bpm: "145", query: "Cyberpunk Phonk, Ethereal Cloud Rap" },
    { label: "80s Retro Synthwave", bpm: "120", query: "80s Retro Synthwave, Analog Arps" },
    { label: "Chicago House Groove", bpm: "124", query: "Dancehall Fusion, Island Vibe" },
  ],
  artist: [
    { label: "Alice Deejay", bpm: "138", query: "Alice Deejay" },
    { label: "Avicii", bpm: "126", query: "Avicii" },
    { label: "Daft Punk", bpm: "123", query: "Daft Punk" },
    { label: "Metro Boomin", bpm: "140", query: "Metro Boomin" },
    { label: "deadmau5", bpm: "128", query: "deadmau5" },
    { label: "Dr. Dre", bpm: "95", query: "Dr. Dre" },
    { label: "Travis Scott", bpm: "150", query: "Travis Scott" },
  ]
};

export const buildRecreationDirective = (
  query: string,
  mode: 'song' | 'vibe' | 'artist',
  includeMinimoog: boolean
): string => {
  const q = query.toLowerCase();
  const isBetterOffAlone = q.includes('better off alone') || q.includes('alice deejay');
  const isMoogMentioned = q.includes('moog') || q.includes('minimoog') || includeMinimoog;

  if (isBetterOffAlone || (isMoogMentioned && mode === 'song')) {
    return `CRITICAL USER INSTRUMENT & SONG RECREATION DIRECTIVE:
The user explicitly owns and requested the 'Universal Audio - UADx Minimoog' (or Moog Minimoog) synthesizer plugin to recreate the iconic instrument sound for Alice Deejay - Better Off Alone!
1. YOU MUST ASSIGN 'Universal Audio - UADx Minimoog' as the Lead Synthesizer instrument on the Hook and Main Theme.
2. In the plugin deep dive for UADx Minimoog, provide EXACT, software-accurate parameters matching the official UAD software GUI:
   - Oscillator 1: 8' Range, Sawtooth Waveform, Volume: 8, Switch: ON
   - Oscillator 2: 8' Range, Sawtooth Waveform, Frequency: +4 to +6 cents (detuned stereo chorus spread), Volume: 8, Switch: ON
   - Oscillator 3: OFF (or Range LO, Volume 0)
   - Filter Cutoff Frequency: +1 to +2 (bright open ladder filter roll-off)
   - Filter Emphasis (Resonance): 3.5 to 4.2 (signature Moog ladder resonance bite)
   - Amount of Contour: 6.5 to 7.0 (punchy filter envelope opening)
   - Filter Attack Time: 1ms (instant snappy transient punch)
   - Filter Decay Time: ~380ms - 420ms (crisp 16th-note pluck contour)
   - Filter Sustain Level: 4.0 (moderate sustain body)
   - Filter Keyboard Control 1 & 2: ON (100% 1:1 key tracking across high octaves)
   - Loudness Attack Time: 1ms
   - Loudness Decay Time: 450ms
   - Loudness Sustain Level: 8.0
   - Decay Switch: ON
   - Glide: 1.0 to 1.5 (subtle legato transition on interval leaps)
   - Master Volume: 8.0, Output Switch: ON
3. MIDI HOOK MELODY: In the Lead track's loopGuide and section notes, YOU MUST generate the EXACT iconic 1999 Eurodance catchy melody riff of 'Better Off Alone' in F# minor at 138 BPM:
   - Note sequence: F#4, G#4, A4, C#5, B4, A4, G#4, F#4 with driving 16th-note syncopated bounce across all bars!
4. DRUM LOOP PATTERNS: Generate complete four-on-the-floor Eurodance drum patterns:
   - Kick: Solid punchy 909-style kicks on every quarter note (steps 1, 5, 9, 13)
   - Open Hi-Hat: Crisp offbeat open hats on the "and" of every beat (steps 3, 7, 11, 15)
   - Closed Hi-Hat: Driving 16th-note hats with accented velocity on offbeats
   - Snare / Clap: Crisp snappy clap/snare on beats 2 and 4 (steps 5, 13)
   - Bass: Pumping rolling 16th-note offbeat Eurodance sub bassline in F# minor locking with the kick.`;
  }

  if (includeMinimoog) {
    return `CRITICAL USER INSTRUMENT DIRECTIVE:
The user owns the 'Universal Audio - UADx Minimoog' synthesizer plugin. You MUST use 'Universal Audio - UADx Minimoog' for the lead synth or bass track, providing full software-accurate UAD parameters (Oscillator 1/2/3, Filter Cutoff Frequency, Filter Emphasis, Amount of Contour, Filter Attack/Decay/Sustain, Loudness Attack/Decay/Sustain, Glide) and complete melodic MIDI loops.`;
  }

  return '';
};
