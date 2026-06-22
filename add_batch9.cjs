const fs = require('fs');

const profiles = [
  {
    name: "JS: Distortion",
    shortName: "Distortion",
    category: "Guitar & Amp",
    description: "A hard-clipping distortion pedal.",
    howItWorks: "Drives the gain into a hard clip threshold to create aggressive squared-off waveforms.",
    proTips: "Great for thrash metal guitars or destroying a drum loop.",
    sliders: [
      { index: 0, name: "Gain", unit: "dB", min: 0, max: 60, defaultVal: 30, description: "Drive Amount" },
      { index: 1, name: "Tone", unit: "Hz", min: 200, max: 10000, defaultVal: 3000, description: "Treble Cutoff" },
      { index: 2, name: "Volume (dB)", unit: "dB", min: -60, max: 12, defaultVal: -12, description: "Output Makeup Gain" }
    ]
  },
  {
    name: "JS: Tube Harmonics",
    shortName: "Tube Harmonics",
    category: "Guitar & Amp",
    description: "Vacuum tube saturation emulator.",
    howItWorks: "Adds mostly even-order harmonics modeling pentode/triode tubes.",
    proTips: "Warm up sterile DI bass by rolling on some tube harmonics.",
    sliders: [
      { index: 0, name: "Drive", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Tube Saturation Drive" },
      { index: 1, name: "Even/Odd Ratio", unit: "", min: 0, max: 100, defaultVal: 50, description: "Harmonic Content Selection" },
      { index: 2, name: "Output (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Volume" }
    ]
  },
  {
    name: "JS: Wah-Wah",
    shortName: "Wah-Wah",
    category: "Guitar & Amp",
    description: "A resonant bandpass filter sweep pedal.",
    howItWorks: "Animates the center frequency of a high-Q resonant filter.",
    proTips: "Automate the Position slider with an envelope follower or expression pedal for classic funk guitars.",
    sliders: [
      { index: 0, name: "Position", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Filter Sweep (Heel to Toe)" },
      { index: 1, name: "Resonance", unit: "", min: 1, max: 10, defaultVal: 4, description: "Q Factor" },
      { index: 2, name: "Base Freq (Hz)", unit: "Hz", min: 200, max: 800, defaultVal: 400, description: "Lowest Frequency" },
      { index: 3, name: "Top Freq (Hz)", unit: "Hz", min: 1000, max: 4000, defaultVal: 2000, description: "Highest Frequency" }
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

console.log('Added 3 guitar plugins');
