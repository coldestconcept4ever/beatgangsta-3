const fs = require('fs');

const profiles = [
  {
    name: "JS: Chorus (Stereo)",
    shortName: "Stereo Chorus",
    category: "Time & Modulation",
    description: "A wide true stereo chorus.",
    howItWorks: "Applies dual delay lines modulated out of phase to left and right channels.",
    proTips: "Beautiful for widening electric pianos and synths.",
    sliders: [
      { index: 0, name: "Length (ms)", unit: "ms", min: 1, max: 200, defaultVal: 15, description: "Chorus Delay Length" },
      { index: 1, name: "Rate (Hz)", unit: "Hz", min: 0.1, max: 10, defaultVal: 1, description: "LFO Speed" },
      { index: 2, name: "Depth", unit: "", min: 0, max: 10, defaultVal: 2, description: "Modulation Depth" },
      { index: 3, name: "Mix", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Wet/Dry Blend" }
    ]
  },
  {
    name: "JS: Phaser",
    shortName: "Phaser",
    category: "Time & Modulation",
    description: "Classic analog style phaser.",
    howItWorks: "Uses a series of all-pass filters modulated by an LFO to create moving comb filter notches.",
    proTips: "Add to a flat synth pad to give it motion and interest.",
    sliders: [
      { index: 0, name: "Rate (Hz)", unit: "Hz", min: 0.1, max: 10, defaultVal: 0.5, description: "Sweep Rate" },
      { index: 1, name: "Depth", unit: "", min: 0, max: 10, defaultVal: 5, description: "Sweep Depth" },
      { index: 2, name: "Feedback", unit: "%", min: 0, max: 100, defaultVal: 30, description: "Resonance Feedback" },
      { index: 3, name: "Mix", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Wet/Dry Blend" }
    ]
  },
  {
    name: "JS: Delay w/ Tempo Ping-Pong",
    shortName: "Ping-Pong Delay",
    category: "Time & Modulation",
    description: "A tempo-synced delay that bounces between the left and right speakers.",
    howItWorks: "Crossfeeds delayed signals from L to R and R to L alternately.",
    proTips: "Super fun on lead synths or transitional vocal effects.",
    sliders: [
      { index: 0, name: "Beat Sync", unit: "beats", min: 0.125, max: 4, defaultVal: 1, description: "Sync to Host Tempo" },
      { index: 1, name: "Feedback", unit: "%", min: 0, max: 100, defaultVal: 30, description: "Delay Trails" },
      { index: 2, name: "Width", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Stereo Width" },
      { index: 3, name: "Mix", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Wet/Dry Blend" }
    ]
  },
  {
    name: "JS: Reverb",
    shortName: "Reverb",
    category: "Time & Modulation",
    description: "An algorithmic Schroeder reverb.",
    howItWorks: "Uses a network of comb and all-pass filters to simulate acoustic reflection spaces.",
    proTips: "Very CPU efficient. Use for adding a fast splash of room to a dry drum recording.",
    sliders: [
      { index: 0, name: "Room Size", unit: "", min: 0, max: 100, defaultVal: 50, description: "Size of the simulated room" },
      { index: 1, name: "Damping", unit: "%", min: 0, max: 100, defaultVal: 50, description: "High frequency absorption" },
      { index: 2, name: "Width", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Stereo spread" },
      { index: 3, name: "Dry (dB)", unit: "dB", min: -120, max: 12, defaultVal: 0, description: "Dry level" },
      { index: 4, name: "Wet (dB)", unit: "dB", min: -120, max: 12, defaultVal: -6, description: "Reverb level" }
    ]
  },
  {
    name: "JS: Delay (L/R)",
    shortName: "Dual Delay",
    category: "Time & Modulation",
    description: "Independent delay lines for the left and right channels.",
    howItWorks: "Split routing delay buffers for true stereo processing.",
    proTips: "Set Left to 1/8 note and Right to a dotted 1/8 note for a huge rhythmic wall of echoes.",
    sliders: [
      { index: 0, name: "Left Delay (ms)", unit: "ms", min: 0, max: 2000, defaultVal: 300, description: "Left Time" },
      { index: 1, name: "Right Delay (ms)", unit: "ms", min: 0, max: 2000, defaultVal: 300, description: "Right Time" },
      { index: 2, name: "Feedback", unit: "%", min: 0, max: 100, defaultVal: 30, description: "Feedback amount for both" },
      { index: 3, name: "Mix", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Wet/Dry Blend" }
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

console.log('Added 5 modulation plugins');
