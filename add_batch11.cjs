const fs = require('fs');

const profiles = [
  {
    name: "JS: LOSER/WhiteNoise",
    shortName: "White Noise Generator",
    category: "Utility",
    description: "Generates pure white noise.",
    howItWorks: "Outputs a continuous random-amplitude signal.",
    proTips: "Use under snares or synths during build-ups for added energy.",
    sliders: [
      { index: 0, name: "Output (dB)", unit: "dB", min: -120, max: 0, defaultVal: -12, description: "Gain Amount" }
    ]
  },
  {
    name: "JS: LOSER/phase_rotator",
    shortName: "Phase Rotator",
    category: "Routing & Utility",
    description: "Adjusts the relative phase of an audio signal.",
    howItWorks: "Uses an all-pass filter network to alter the phase relationship without affecting frequency response magnitude.",
    proTips: "Can tighten up asymmetric vocal waveforms to get more headroom before limiting.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 10, max: 1000, defaultVal: 100, description: "Rotation Center" }
    ]
  },
  {
    name: "JS: LOSER/goniometer",
    shortName: "Goniometer",
    category: "Routing & Utility",
    description: "Visualizes the stereo image as a Lissajous figure (requires no sliders).",
    howItWorks: "Plots Left against Right phase correlation.",
    proTips: "Use to check your master for mono-compatibility and out-of-phase warning signs.",
    sliders: []
  },
  {
    name: "JS: Transient Enhancer",
    shortName: "Transient Enhancer",
    category: "Dynamics",
    description: "Brings out the attack of sounds.",
    howItWorks: "Uses envelope following to apply positive gain to the transient peaks of a signal.",
    proTips: "Great for making acoustic guitars sparkle.",
    sliders: [
      { index: 0, name: "Amount", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Attack Boost" },
      { index: 1, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -20, description: "Trigger Threshold" }
    ]
  },
  {
    name: "JS: Super Pitch",
    shortName: "Super Pitch",
    category: "Time & Modulation",
    description: "Advanced multi-voice pitch shifter.",
    howItWorks: "Allows multiple shifted voices with variable pan and delay.",
    proTips: "Create massive thick harmonies from a single lead line.",
    sliders: [
      { index: 0, name: "Shift 1 (st)", unit: "st", min: -24, max: 24, defaultVal: 0, description: "Voice 1 Shift" },
      { index: 1, name: "Pan 1", unit: "%", min: -100, max: 100, defaultVal: 0, description: "Voice 1 Pan" },
      { index: 2, name: "Gain 1 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Voice 1 Gain" },
      { index: 3, name: "Shift 2 (st)", unit: "st", min: -24, max: 24, defaultVal: 0, description: "Voice 2 Shift" },
      { index: 4, name: "Pan 2", unit: "%", min: -100, max: 100, defaultVal: 0, description: "Voice 2 Pan" },
      { index: 5, name: "Gain 2 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Voice 2 Gain" }
    ]
  },
  {
    name: "JS: Channel Mixer",
    shortName: "Channel Mixer",
    category: "Routing & Utility",
    description: "Complex channel re-routing utility.",
    howItWorks: "Matrix mixer to combine multiple track channels (1-64) down or change routing paths.",
    proTips: "Use for downmixing 5.1 surround sound to stereo.",
    sliders: []
  },
  {
    name: "JS: 8x8 Matrix Mixer",
    shortName: "8x8 Mixer",
    category: "Routing & Utility",
    description: "Routes 8 incoming channels to 8 outputs with independent gain.",
    howItWorks: "Creates an 8x8 gain matrix.",
    proTips: "Ideal for complex drum bussing and parallel processing routing within a single track.",
    sliders: []
  },
  {
    name: "JS: Stereo Upmix",
    shortName: "Stereo Upmix",
    category: "Routing & Utility",
    description: "Generates fake stereo width from a mono source.",
    howItWorks: "Uses comb filtering and short delays to trick the ear into hearing a wide signal.",
    proTips: "Good for beefing up a center-panned synth lead that masks the vocal.",
    sliders: [
      { index: 0, name: "Width (%)", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Amount of Upmix Width" }
    ]
  },
  {
    name: "JS: Tonifier",
    shortName: "Tonifier",
    category: "EQ & Filtering",
    description: "Resonator and tone generator.",
    howItWorks: "Applies severe resonant comb filtering to create notes out of noise.",
    proTips: "Send a dry drum break through this and automate the frequency for robot melodies.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 20, max: 10000, defaultVal: 440, description: "Resonant Tone" },
      { index: 1, name: "Feedback", unit: "%", min: 0, max: 100, defaultVal: 80, description: "Resonance Amount" }
    ]
  },
  {
    name: "JS: Pitch Octave Up",
    shortName: "Octave Up",
    category: "Time & Modulation",
    description: "Dedicated pitch shifter that only goes up one octave.",
    howItWorks: "Hard-coded pitch shift algorithm optimized for exactly +12 semitones.",
    proTips: "Use on a parallel bass track with distortion for electric guitar-like tones.",
    sliders: [
      { index: 0, name: "Blend", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet Level" }
    ]
  }
];

const file = 'src/data/jsfxResearch.ts';
let code = fs.readFileSync(file, 'utf8');
const anchor = '];';
const insertion = profiles.map(p => `  ${JSON.stringify(p, null, 4)}`).join(',\n') + '\n';
const pos = code.lastIndexOf(anchor);
const newCode = code.slice(0, pos) + ',\n' + insertion + code.slice(pos);
fs.writeFileSync(file, newCode, 'utf8');

console.log('Added 10 more plugins');
