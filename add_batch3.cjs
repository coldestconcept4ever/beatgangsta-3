const fs = require('fs');

const profiles = [
  {
    name: "JS: Apple 2-Pole Lowpass Filter",
    shortName: "2-Pole LP Filter",
    category: "EQ & Filtering",
    description: "A standard 2-pole resonant lowpass filter.",
    howItWorks: "Biquad filter cutting off high frequencies.",
    proTips: "Classic synth style lowpass.",
    sliders: [
      { index: 0, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff Frequency" },
      { index: 1, name: "Resonance", unit: "", min: 0, max: 1, defaultVal: 0, description: "Resonance" }
    ]
  },
  {
    name: "JS: Apple 12-Pole Filter",
    shortName: "12-Pole Filter",
    category: "EQ & Filtering",
    description: "A steep 12-pole multimode filter.",
    howItWorks: "Cascaded filters for extremely steep stopbands.",
    proTips: "Use for surgical electronic music sweeping fx.",
    sliders: [
      { index: 0, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff Frequency" },
      { index: 1, name: "Resonance", unit: "", min: 0, max: 1, defaultVal: 0, description: "Resonance" },
      { index: 2, name: "Filter Type", unit: "", min: -1, max: 1, defaultVal: 0, description: "-1=HP, 0=BP, 1=LP" }
    ]
  },
  {
    name: "JS: Auto-Wideness",
    shortName: "Auto-Wideness",
    category: "Routing & Utility",
    description: "Dynamically expands stereo width.",
    howItWorks: "Analyzes transient material and pushes signal outward to L/R limits.",
    proTips: "Useful on acoustic guitar buses for widening the stereo spread naturally.",
    sliders: [
      { index: 0, name: "Attack (ms)", unit: "ms", min: 10, max: 2000, defaultVal: 500, description: "Attack Time" },
      { index: 1, name: "Release (ms)", unit: "ms", min: 10, max: 2000, defaultVal: 500, description: "Release Time" }
    ]
  },
  {
    name: "JS: Bad Buss Mojo Waveshaper",
    shortName: "Bad Buss Mojo",
    category: "Dynamics",
    description: "A non-linear waveshaping distortion effect.",
    howItWorks: "Adds harmonic distortion by warping the amplitude transfer curve.",
    proTips: "Can add a dangerous, driven character to a parallel drum bus.",
    sliders: [
      { index: 0, name: "Drive", unit: "dB", min: 0, max: 10, defaultVal: 0, description: "Drive" },
      { index: 1, name: "Distortion", unit: "", min: 0, max: 10, defaultVal: 0, description: "Distortion" },
      { index: 2, name: "Bottom", unit: "", min: -1, max: 1, defaultVal: 1, description: "Bottom Curve Bias" },
      { index: 3, name: "Mute when stopped", unit: "", min: 0, max: 1, defaultVal: 0, description: "Off/On" }
    ]
  },
  {
    name: "JS: Bass Manager/Booster",
    shortName: "Bass Manager",
    category: "EQ & Filtering",
    description: "Sub-harmonic enhancer.",
    howItWorks: "Boosts specific target frequencies below a threshold crossover.",
    proTips: "Great for enriching thin synth bass.",
    sliders: [
      { index: 0, name: "Bass Boost (%)", unit: "%", min: 0, max: 10, defaultVal: 0, description: "Boost Percentage" },
      { index: 1, name: "Cutoff Crossover (Hz)", unit: "Hz", min: 20, max: 120, defaultVal: 60, description: "Cutoff Crossover" },
      { index: 2, name: "Boost type", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Flat, 1=Sub" }
    ]
  },
  {
    name: "JS: Butterworth 4-Pole Filter",
    shortName: "Butterworth Filter",
    category: "EQ & Filtering",
    description: "A smooth maximally flat Butterworth filter.",
    howItWorks: "Clean, uncolored filter without rippling.",
    proTips: "Use for general highpass/lowpass duties where phase artifacts must be minimized.",
    sliders: [
      { index: 0, name: "Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Lowpass, 1=Highpass" },
      { index: 1, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff Frequency" }
    ]
  },
  {
    name: "JS: Stereo Channel Volume/Pan/Polarity Control",
    shortName: "Stereo Channel Control",
    category: "Routing & Utility",
    description: "Independent left/right channel strip control.",
    howItWorks: "Allows you to pan, volume stage, or flip phase completely independently for L/R.",
    proTips: "Perfect for fixing poorly recorded or lopsided stereo samples.",
    sliders: [
      { index: 0, name: "Left Volume (dB)", unit: "dB", min: -120, max: 24, defaultVal: 0, description: "Left Volume" },
      { index: 1, name: "Left Pan (%)", unit: "%", min: -100, max: 100, defaultVal: 0, description: "Left Pan" },
      { index: 2, name: "Left Polarity", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Normal, 1=Inverted" },
      { index: 3, name: "Right Volume (dB)", unit: "dB", min: -120, max: 24, defaultVal: 0, description: "Right Volume" },
      { index: 4, name: "Right Pan (%)", unit: "%", min: -100, max: 100, defaultVal: 100, description: "Right Pan" },
      { index: 5, name: "Right Polarity", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Normal, 1=Inverted" }
    ]
  },
  {
    name: "JS: Chebyshev 4-Pole Filter",
    shortName: "Chebyshev Filter",
    category: "EQ & Filtering",
    description: "Steep 4-pole filter with adjustable ripple.",
    howItWorks: "Uses Chebyshev polynomial designs for steeper rolloff at the expense of passband ripple.",
    proTips: "Very colorful filter ideal for synth design.",
    sliders: [
      { index: 0, name: "Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Lowpass, 1=Highpass" },
      { index: 1, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff Frequency" },
      { index: 2, name: "Ripple (dB)", unit: "dB", min: 0.1, max: 10, defaultVal: 1, description: "Passband Ripple" }
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

console.log('Added 8 plugins');
