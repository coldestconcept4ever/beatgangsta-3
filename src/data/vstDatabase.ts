export interface VSTDatabaseEntry {
  name: string;
  displayName: string;
  vendor: string;
  category: string;
  description: string;
  parameters: any[];
}

export const VST_DATABASE: VSTDatabaseEntry[] = [
  {
    name: "neve 1073 preamp and eq",
    displayName: "Neve 1073 Preamp & EQ",
    vendor: "AMS Neve / Universal Audio",
    category: "Equalizers / Preamp",
    description: "The gold standard British Class-A transistor mic/line preamp and musical equalizer. Features the iconic stepped Red Gain knob for rich transformer saturation and grit, 12kHz high-shelf air band, inductor mid-band, and steep high-pass filter. Foundational for in-your-face rap vocals and punchy drums.",
    parameters: [
      { name: "Input Gain (Red Knob)", description: "Stepped Class-A preamp gain. Crank past +50 dB for aggressive harmonic drive and radio-ready vocal crunch.", type: "knob" },
      { name: "High Shelf (12 kHz)", description: "Fixed 12 kHz smooth high shelf. Adds expensive air and vocal presence without harsh sibilance (-16 dB to +16 dB).", type: "knob" },
      { name: "Mid Frequency", description: "Selectable inductor mid bell filter frequency (360 Hz, 700 Hz, 1.6 kHz, 3.2 kHz, 4.8 kHz, 7.2 kHz).", type: "selector" },
      { name: "Mid Gain", description: "Semi-parametric midrange boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "Low Shelf Frequency", description: "Selectable low shelf frequency (35 Hz, 60 Hz, 110 Hz, 220 Hz).", type: "selector" },
      { name: "Low Shelf Gain", description: "Low shelf boost or cut for warm analog weight (-16 dB to +16 dB).", type: "knob" },
      { name: "High Pass Filter (HPF)", description: "Stepped high-pass filter (Off, 50 Hz, 80 Hz, 160 Hz, 300 Hz) to eliminate sub mud and rumble.", type: "selector" },
      { name: "EQ Switch", description: "Engages or bypasses the passive inductor EQ circuit.", type: "switch" },
      { name: "Phase Polarity", description: "Inverts 180° audio phase.", type: "switch" },
      { name: "Output Level", description: "Continuous output level attenuator to calibrate headroom after preamp overdrive.", type: "knob" }
    ]
  },
  {
    name: "noiseash need 533 eq",
    displayName: "NoiseAsh NEED 533 EQ",
    vendor: "NoiseAsh",
    category: "Equalizers / Parametric EQ",
    description: "5-band fully parametric British console equalizer with custom Q bandwidth controls, independent Mid/Side (M/S) stereo processing, high-pass and low-pass filters, and 20-channel Nuance Deviation System (NDS) for authentic analog console depth. Perfect for carving room for vocals, notching harsh frequencies in loops, and shaping 808 sub pockets.",
    parameters: [
      { name: "LF Band Gain", description: "Low frequency band boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "LF Band Frequency", description: "Continuous low frequency selector (30 Hz to 400 Hz).", type: "knob" },
      { name: "LF Band Q", description: "Continuously variable Q bandwidth (0.5 wide to 3.0 surgical narrow).", type: "knob" },
      { name: "LMF Band Gain", description: "Low-mid frequency band boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "LMF Band Frequency", description: "Continuous low-mid frequency selector (200 Hz to 2.5 kHz).", type: "knob" },
      { name: "LMF Band Q", description: "Continuously variable Q bandwidth (0.5 wide to 3.0 surgical narrow).", type: "knob" },
      { name: "MF Band Gain", description: "Mid frequency band boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "MF Band Frequency", description: "Continuous mid frequency selector (800 Hz to 6 kHz).", type: "knob" },
      { name: "MF Band Q", description: "Continuously variable Q bandwidth (0.5 wide to 3.0 surgical narrow).", type: "knob" },
      { name: "HMF Band Gain", description: "High-mid frequency band boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "HMF Band Frequency", description: "Continuous high-mid frequency selector (1.5 kHz to 16 kHz).", type: "knob" },
      { name: "HMF Band Q", description: "Continuously variable Q bandwidth (0.5 wide to 3.0 surgical narrow).", type: "knob" },
      { name: "HF Band Gain", description: "High frequency band boost or cut (-18 dB to +18 dB).", type: "knob" },
      { name: "HF Band Frequency", description: "Continuous high frequency selector (4 kHz to 20 kHz).", type: "knob" },
      { name: "HF Band Q", description: "Continuously variable Q bandwidth (0.5 wide to 3.0 surgical narrow).", type: "knob" },
      { name: "HP Filter", description: "High pass filter slope (Off, 20 Hz to 400 Hz).", type: "knob" },
      { name: "LP Filter", description: "Low pass filter slope (Off, 3 kHz to 20 kHz).", type: "knob" },
      { name: "Processing Mode", description: "Stereo or Mid/Side (M/S) mode. Allows independent equalization of center kick/vocal vs side width.", type: "switch" },
      { name: "NDS Channel", description: "Nuance Deviation System channel model (1 through 20) simulating discrete console channel variations.", type: "selector" },
      { name: "Analog In Drive", description: "Introduces genuine console preamp saturation and odd/even harmonics.", type: "knob" }
    ]
  },
  {
    name: "bx_console ssl 9000 j",
    displayName: "bx_console SSL 9000 J",
    vendor: "Brainworx / Plugin Alliance",
    category: "Channel Strips",
    description: "Emulation of the legendary Solid State Logic 9000 J series console channel strip. Features TMT (Tolerance Modeling Technology) for authentic analog variation between channels, providing deep, punchy low-end and pristine high-end. Includes EQ, Dynamics, and Filters.",
    parameters: [
      { name: "TMT Channel", description: "Selects the specific modeled channel (1-72) to introduce slight analog component tolerances.", type: "knob" },
      { name: "V-Gain", description: "Simulates analog noise floor.", type: "knob" },
      { name: "THD", description: "Adds harmonic distortion to the signal.", type: "knob" },
      { name: "Compressor Threshold", description: "Sets the level at which compression begins.", type: "knob" },
      { name: "Compressor Ratio", description: "Compression ratio.", type: "knob" },
      { name: "Compressor Attack", description: "Fast or Slow attack time.", type: "switch" },
      { name: "Compressor Release", description: "Release time.", type: "knob" },
      { name: "EQ LF", description: "Low frequency gain and frequency selection.", type: "knob" },
      { name: "EQ LMF", description: "Low-mid frequency gain, frequency, and Q.", type: "knob" },
      { name: "EQ HMF", description: "High-mid frequency gain, frequency, and Q.", type: "knob" },
      { name: "EQ HF", description: "High frequency gain and frequency selection.", type: "knob" },
      { name: "Filters (HPF/LPF)", description: "High-pass and low-pass filter frequency controls.", type: "knob" },
      { name: "EQ to Dynamics", description: "Places EQ before Dynamics in the signal chain.", type: "switch" }
    ]
  },
  {
    name: "bx_console ssl 4000 e",
    displayName: "bx_console SSL 4000 E",
    vendor: "Brainworx / Plugin Alliance",
    category: "Channel Strips",
    description: "Faithful emulation of the iconic Solid State Logic 4000 E console channel strip. Features selectable Black (242) and Brown (02) knob EQ circuits, musical VCA compressor/gate dynamics, and 72 TMT modeled analog channels for punchy, aggressive hip-hop drums and vocal glue.",
    parameters: [
      { name: "TMT Channel", description: "Selects one of 72 modeled console channels.", type: "knob" },
      { name: "THD", description: "Adds harmonic color and saturation in dB.", type: "knob" },
      { name: "V-Gain", description: "Analog noise floor modeling.", type: "knob" },
      { name: "Compressor Threshold", description: "Sets compression onset level (-30 dB to +10 dB).", type: "knob" },
      { name: "Compressor Ratio", description: "Compression ratio from 1:1 to infinity.", type: "knob" },
      { name: "Compressor Release", description: "Release time (0.1s to 4s, or Auto).", type: "knob" },
      { name: "Compressor Fast Attack", description: "Engages ultrafast attack for tight transient control.", type: "switch" },
      { name: "EQ Black/Brown Mode", description: "Toggles between cleaner Black Knob 242 EQ and grittier Brown Knob 02 EQ.", type: "switch" },
      { name: "HPF / LPF", description: "High-pass (16 Hz to 350 Hz) and low-pass (3 kHz to 22 kHz) filters.", type: "knob" }
    ]
  },
  {
    name: "empirical labs el8 distressor",
    displayName: "Empirical Labs EL8 Distressor",
    vendor: "Empirical Labs / Universal Audio",
    category: "Compressors",
    description: "The classic digitally controlled analog knee compressor famous for punch, aggressive transient shaping, and legendary parallel compression. Offers ratios from 1:1 to Nuke, detector filtering, Dist 2 (tube-like 2nd harmonic) and Dist 3 (tape-like 3rd harmonic) saturation, and wet/dry parallel mix.",
    parameters: [
      { name: "Input Gain", description: "Controls the amount of compression drive (0 to 10). Crank to smash into parallel compression.", type: "knob" },
      { name: "Ratio", description: "Selects curve: 1:1, 2:1, 3:1, 4:1, 6:1, 10:1 (opto-like), 20:1, or Nuke (brickwall limiter).", type: "selector" },
      { name: "Attack", description: "Attack time (0 fastest ~50 microseconds to 10 slowest ~30 milliseconds).", type: "knob" },
      { name: "Release", description: "Release time (0.05s to 3.5s).", type: "knob" },
      { name: "Detector Modes", description: "HP (High Pass at 170 Hz prevents bass pumping) and Band Emphasis (peaks at 6 kHz for vocal de-essing).", type: "switch" },
      { name: "Audio Modes", description: "HP (sub cut), Dist 2 (warm 2nd order harmonic tube saturation), Dist 3 (gritty 3rd order tape distortion).", type: "switch" },
      { name: "Output Level", description: "Sets makeup output level (0 to 10).", type: "knob" },
      { name: "Parallel Mix / Blend", description: "Wet/Dry blend control for parallel compression (0% to 100%). Smash the wet signal and blend with dry punch.", type: "knob" }
    ]
  },
  {
    name: "soundtheory gullfoss",
    displayName: "Soundtheory Gullfoss",
    vendor: "Soundtheory",
    category: "Equalizers / Dynamic EQ",
    description: "Intelligent computational auditory perception equalizer. Continuously analyzes the frequency spectrum using auditory models to dynamically de-mask clarity, recover buried details, and tame harsh resonances in real time without causing phase coloration.",
    parameters: [
      { name: "Recover", description: "Amplifies perception of masked, buried acoustic details without altering overall balance (0% to 100%).", type: "knob" },
      { name: "Tame", description: "Attenuates dominating, harsh frequencies that mask other elements (0% to 100%).", type: "knob" },
      { name: "Bias", description: "Balances whether Recover or Tame acts more aggressively (-100% to +100%).", type: "knob" },
      { name: "Brightness", description: "Controls high-frequency perceptual tilt (-100% to +100%).", type: "knob" },
      { name: "Boost", description: "Adds low-end punch and perceived loudness without causing distortion (-100% to +100%).", type: "knob" },
      { name: "Low Limit", description: "Excludes frequencies below this threshold from perceptual processing (20 Hz to 20 kHz).", type: "knob" },
      { name: "High Limit", description: "Excludes frequencies above this threshold from perceptual processing (20 Hz to 20 kHz).", type: "knob" }
    ]
  },
  {
    name: "lurssen mastering console",
    displayName: "IK Multimedia - Lurssen Mastering Console",
    vendor: "IK Multimedia / Gavin Lurssen",
    category: "Mastering Console",
    description: "Multi-processor mastering console emulating Gavin Lurssen's proprietary hardware chain and mastering philosophy. Features a 5-band fixed EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz) with 1dB integer stepped gain dials, a master Push control that shifts all 5 EQ dials simultaneously, continuous Input Drive (-15dB to +15dB), and 40 Style/Genre presets.",
    parameters: [
      { name: "Input Drive", description: "Controls input gain and harmonic saturation (-15.0 dB to +15.0 dB, float/decimal allowed e.g. 2.8 dB).", type: "knob" },
      { name: "60Hz EQ", description: "Low sub-shelf filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "120Hz EQ", description: "Low-mid bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "3kHz EQ", description: "Midrange bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "6kHz EQ", description: "Presence bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "10kHz EQ", description: "High air shelf filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "Push", description: "Master EQ gain offset control (-100% to +100%). NOTE: Turning Push moves/shifts ALL FIVE EQ band dials simultaneously in unison (+100% pushes all 5 dials up by +10 dB, -100% pulls all 5 dials down by -10 dB).", type: "knob" },
      { name: "Style / Genre Preset", description: "Loads one of 40 genre-specific mastering chain presets (e.g. Pop Rock, Hard Rock, Hip Hop, EDM, Americana, Jazz, Country).", type: "selector" }
    ]
  },
  {
    name: "sublab",
    displayName: "Future Audio Workshop - SubLab",
    vendor: "Future Audio Workshop (FAW)",
    category: "Bass Synthesizers / 808",
    description: "The definitive 808 and sub-bass synthesizer plugin designed by Future Audio Workshop. Built around three independent sound engines: an analog-style Synth oscillator with custom ADSR envelopes, a drag-and-drop Sampler with root note detection and delayed start, and the psychoacoustic X-Sub oscillator with harmonic overtone generation. Features four modeled distortion algorithms (Darkdrive, Overdrive, Grunge, Tube) with custom tone macros, an analog filter with parallel blend, a dedicated bus compressor with auto-sidechain, a master maximizer limiter, and mixer faders strictly calibrated in decibels (dB).",
    parameters: [
      { name: "Mixer Synth Level (Green Slider)", description: "Volume fader for the Synth oscillator engine located in the bottom-right mixer. Calibrated strictly in decibels (-inf dB to 0.0 dB / +6 dB). Never percentage.", type: "slider" },
      { name: "Mixer Sampler Level (Orange Slider)", description: "Volume fader for the Sampler engine located in the bottom-right mixer. Calibrated strictly in decibels (-inf dB to 0.0 dB / +6 dB). Never percentage.", type: "slider" },
      { name: "Mixer X-Sub Level (Purple Slider)", description: "Volume fader for the X-Sub sub-bass engine located in the bottom-right mixer. Calibrated strictly in decibels (-inf dB to 0.0 dB / +6 dB). Push to 0.0 dB for solid sub foundation.", type: "slider" },
      { name: "Synth Waveform", description: "Selects the core synth oscillator waveform: Sine, Triangle, Sawtooth, or Square.", type: "selector" },
      { name: "Synth Filter Route", description: "Routes the Synth oscillator through the analog filter circuit (On/Off).", type: "switch" },
      { name: "Synth Octave / Tune", description: "Transposition of the synth voice in semitones (-24 to +24 st) and fine cents.", type: "knob" },
      { name: "Synth Attack", description: "Volume envelope attack time (0 ms to 2000 ms). Keep at 0 ms for punchy transients.", type: "knob" },
      { name: "Synth Decay", description: "Volume envelope decay time (10 ms to 10000 ms). Dictates the length of the 808 body.", type: "knob" },
      { name: "Synth Sustain", description: "Volume envelope sustain level (-inf dB to 0.0 dB). Typically set to -inf or 0 for decaying 808s.", type: "knob" },
      { name: "Synth Release", description: "Volume envelope release time (10 ms to 5000 ms). Shapes note ends.", type: "knob" },
      { name: "Sampler Root Note", description: "Auto-detected or manually tuned root pitch of the loaded kick/808 sample (e.g. C1, D#1, F1).", type: "selector" },
      { name: "Sampler Delayed Start", description: "Delays the triggering of the sample start in milliseconds (0 ms to 500 ms) for rolling 808s.", type: "knob" },
      { name: "Sampler Loop Mode", description: "Loops sample sustain section for infinite note length (On/Off).", type: "switch" },
      { name: "Sampler Lo-Cut / Hi-Cut", description: "Internal pre-filtering on the sample layer to isolate transient thud or remove top fizz.", type: "knob" },
      { name: "Sampler Filter Route", description: "Routes the Sampler engine through the main analog filter (On/Off).", type: "switch" },
      { name: "X-Sub Root Note Lock", description: "Locks the psychoacoustic sub-bass engine fundamental to the exact MIDI key (30 Hz to 65 Hz) and lower harmonics (65 Hz to 260 Hz).", type: "selector" },
      { name: "X-Sub Harmonics", description: "Controls the intensity and balance of generated psychoacoustic upper harmonics to ensure translation on small speakers.", type: "knob" },
      { name: "Filter Type", description: "Selects filter topology: Low-Pass (LP 12dB / 24dB), Band-Pass (BP 12dB), High-Pass (HP 12dB).", type: "selector" },
      { name: "Filter Cutoff", description: "Filter cutoff frequency (20 Hz to 20000 Hz). Sweeps and sculpts sub tone.", type: "knob" },
      { name: "Filter Resonance", description: "Filter peak resonance around the cutoff frequency (0% to 100%).", type: "knob" },
      { name: "Filter Parallel Mix", description: "Blends filtered audio with unfiltered dry signal (0% to 100%).", type: "knob" },
      { name: "Distortion Algorithm", description: "Selects the saturation circuit: Darkdrive, Overdrive, Grunge, or Tube.", type: "selector" },
      { name: "Distortion Drive", description: "Amount of harmonic drive and clipping pushed into the distortion engine (0% to 100%).", type: "knob" },
      { name: "Distortion Flavor Macro", description: "Algorithm-specific tone sculpt control: 'Fatness' (Darkdrive), 'Tone' (Overdrive), 'Fizz' (Grunge), or 'Heat' (Tube).", type: "knob" },
      { name: "Distortion Lo-Cut", description: "Post-distortion high-pass filter (20 Hz to 500 Hz) to keep the extreme sub-lows clean and un-muddied.", type: "knob" },
      { name: "Distortion Hi-Cut", description: "Post-distortion low-pass filter (1000 Hz to 20000 Hz) to tame harsh high-end buzzing.", type: "knob" },
      { name: "Distortion Parallel Mix", description: "Wet/Dry blend of the distortion effect (0% to 100%).", type: "knob" },
      { name: "Compressor Threshold", description: "Compression onset threshold level (-40 dB to 0 dB).", type: "knob" },
      { name: "Compressor Ratio", description: "Compression ratio (1.5:1 to 8:1).", type: "knob" },
      { name: "Compressor Release", description: "Compressor release recovery time (10 ms to 1000 ms).", type: "knob" },
      { name: "Compressor Auto-Sidechain", description: "Ducks the sustained sub-bass when internal/external kick transient strikes (On/Off).", type: "switch" },
      { name: "Compressor Parallel Mix", description: "Dry/wet parallel compression blend (0% to 100%).", type: "knob" },
      { name: "Compressor Makeup Gain", description: "Compensates for gain reduction after heavy compression (0 dB to +18 dB).", type: "knob" },
      { name: "Glide Mode", description: "Portamento glide mode: Legato or Retrigger. Legato allows overlapping notes to slide seamlessly without retriggering envelopes.", type: "switch" },
      { name: "Glide Time", description: "Portamento slide duration between overlapping notes (e.g. 1/64, 1/32, 1/16, or 0 ms to 2000 ms).", type: "knob" },
      { name: "Maximizer Amount", description: "Drives final signal into the output brickwall limiter for maximum loudness and density (0% to 100%).", type: "knob" },
      { name: "Maximizer Release", description: "Recovery speed of the output maximizer limiter (10 ms to 1000 ms).", type: "knob" },
      { name: "Master Output Volume", description: "Final plugin master output volume trim (-inf dB to +6.0 dB).", type: "knob" }
    ]
  }
];
