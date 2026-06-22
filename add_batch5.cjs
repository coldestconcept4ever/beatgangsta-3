const fs = require('fs');

const profiles = [
  {
    name: "JS: Ring Modulator",
    shortName: "Ring Mod",
    category: "Time & Modulation",
    description: "Classic experimental ring modulation.",
    howItWorks: "Multiplies your signal by a sine wave carrier oscillator to produce sum and difference frequencies.",
    proTips: "Instantly create robotic, dissonant, metallic vocal effects like Daleks.",
    sliders: [
      { index: 0, name: "Modulator Frequency (Hz)", unit: "Hz", min: 20, max: 4000, defaultVal: 440, description: "Carrier Wave Freq" },
      { index: 1, name: "Wet (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet Mix" },
      { index: 2, name: "Dry (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Dry Mix" }
    ]
  },
  {
    name: "JS: LOSER/Saturation",
    shortName: "Saturation",
    category: "Dynamics",
    description: "A fast, single-slider saturation circuit.",
    howItWorks: "Applies soft clipping rounding to audio wave peaks.",
    proTips: "Crank the amount to glue bass line dynamics or shave off aggressive transients on drums.",
    sliders: [
      { index: 0, name: "Amount (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Saturation Drive" }
    ]
  },
  {
    name: "JS: State Variable Morphing Filter",
    shortName: "SVF Morphing Filter",
    category: "EQ & Filtering",
    description: "Continuously morphable state-variable filter.",
    howItWorks: "Combines LP, BP, and HP outputs from an SVF algorithm, letting you interpolate between them.",
    proTips: "Automate the Filter Type slider during buildups for creative DJ-style DJ filter sweeps.",
    sliders: [
      { index: 0, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff Freq" },
      { index: 1, name: "Resonance", unit: "", min: 0, max: 1, defaultVal: 0, description: "Resonance" },
      { index: 2, name: "Filter Type", unit: "", min: -1, max: 1, defaultVal: 0, description: "-1=HP, 0=BP, 1=LP" }
    ]
  },
  {
    name: "JS: Shelving Filter",
    shortName: "Shelving Filter",
    category: "EQ & Filtering",
    description: "A simple Baxandall style 2-band shelf equalizer.",
    howItWorks: "Provides gentle, broad-stroke boosts or cuts at the extreme ends of the frequency spectrum.",
    proTips: "Boost the high shelf slightly at 5kHz-8kHz for expensive-sounding vocal air.",
    sliders: [
      { index: 0, name: "Low Shelf (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Shelf Gain" },
      { index: 1, name: "Low Frequency", unit: "Hz", min: 0, max: 22000, defaultVal: 200, description: "Low Frequency" },
      { index: 2, name: "High Shelf (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Shelf Gain" },
      { index: 3, name: "High Frequency", unit: "Hz", min: 0, max: 22000, defaultVal: 2000, description: "High Frequency" }
    ]
  },
  {
    name: "JS: Simple 1-Pole Filter",
    shortName: "1-Pole Filter",
    category: "EQ & Filtering",
    description: "A very gentle 6dB/octave highpass or lowpass.",
    howItWorks: "Basic one-zero digital filter architecture.",
    proTips: "Excellent for gently rolling off muddy subs on guitars without introducing phase shift.",
    sliders: [
      { index: 0, name: "Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Lowpass, 1=Highpass" },
      { index: 1, name: "Cutoff (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 1000, description: "Cutoff" }
    ]
  },
  {
    name: "JS: Soft Clipper/Limiter",
    shortName: "Soft Clipper",
    category: "Dynamics",
    description: "Smooth peak rounding before a hard limit.",
    howItWorks: "Applies a saturation curve to transients just before they hit digital 0.",
    proTips: "A great safety utility for tracks prone to jumping out of the mix occasionally.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -3, description: "Threshold" }
    ]
  },
  {
    name: "JS: Time Adjustment Delay",
    shortName: "Time Adjustment",
    category: "Routing & Utility",
    description: "Delay tracks accurately down to the sample.",
    howItWorks: "Shifts the track in the time domain, compensating via PDC.",
    proTips: "Use for manual track phase alignment when layering multitrack drums.",
    sliders: [
      { index: 0, name: "Delay Amount (ms)", unit: "ms", min: -100, max: 100, defaultVal: 0, description: "Time Shift" },
      { index: 1, name: "Wet Mix (dB)", unit: "dB", min: -120, max: 12, defaultVal: 0, description: "Wet Level" }
    ]
  },
  {
    name: "JS: Tremolo",
    shortName: "Tremolo",
    category: "Time & Modulation",
    description: "Classic volume ducking LFO.",
    howItWorks: "Modulates the amplitude of the signal according to an internal oscillator.",
    proTips: "Sync up tremolo rates to the song tempo for rhythmic motion on e-pianos.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 20, defaultVal: 2, description: "LFO Rate" },
      { index: 1, name: "Amount (dB)", unit: "dB", min: -60, max: 0, defaultVal: -6, description: "Depth of Tremolo" }
    ]
  },
  {
    name: "JS: Upward Expander",
    shortName: "Upward Expander",
    category: "Dynamics",
    description: "Increases gain when signals cross a threshold.",
    howItWorks: "Instead of ducking, the volume scales up dynamically.",
    proTips: "Bring out transients and attack on very heavily compressed material.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -120, max: 0, defaultVal: -120, description: "Expander Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Expansion Ratio" },
      { index: 2, name: "Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Output Makeup" }
    ]
  },
  {
    name: "JS: Zero Crossing Maximizer",
    shortName: "Zero X Maximizer",
    category: "Dynamics",
    description: "Reduces volume spikes specifically crossing zero boundaries.",
    howItWorks: "Clips or limits audio only effectively when looking at zero crossing phases.",
    proTips: "Can tame extremely jagged waveforms (like bad synths) prior to EQing.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -20, max: 0, defaultVal: -1, description: "Maximizer Threshold" }
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

console.log('Added 10 plugins');
