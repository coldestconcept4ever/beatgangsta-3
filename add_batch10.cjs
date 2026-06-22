const fs = require('fs');

const profiles = [
  {
    name: "JS: Audio To MIDI Drum Trigger",
    shortName: "Drum Trigger",
    category: "Routing & Utility",
    description: "Detects audio spikes and converts them into MIDI notes.",
    howItWorks: "Uses an amplitude envelope follower to send Note On messages when transients pass the threshold.",
    proTips: "Use to replace a poorly recorded snare drum with a MIDI sample library seamlessly.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -18, description: "Detection Threshold" },
      { index: 1, name: "Retrigger Interval (ms)", unit: "ms", min: 1, max: 500, defaultVal: 50, description: "Prevent machinegunning" },
      { index: 2, name: "MIDI Note", unit: "", min: 0, max: 127, defaultVal: 38, description: "Note to Output (38 = Snare)" },
      { index: 3, name: "Velocity Scaling", unit: "%", min: 0, max: 200, defaultVal: 100, description: "Map audio volume to MIDI velocity" }
    ]
  },
  {
    name: "JS: Dual Pan",
    shortName: "Dual Pan",
    category: "Routing & Utility",
    description: "Discrete panning for independent left and right channels.",
    howItWorks: "Bypasses standard stereo balance and allows precise placement of the L and R channels anywhere in the stereo field.",
    proTips: "Useful when a stereo synth is too wide and you want to narrow the left and right closer to the center.",
    sliders: [
      { index: 0, name: "Left Pan (%)", unit: "%", min: -100, max: 100, defaultVal: -100, description: "Left Channel Position" },
      { index: 1, name: "Right Pan (%)", unit: "%", min: -100, max: 100, defaultVal: 100, description: "Right Channel Position" },
      { index: 2, name: "Pan Law (dB)", unit: "dB", min: -6, max: 0, defaultVal: 0, description: "Center Drop Compensation" }
    ]
  },
  {
    name: "JS: Liteon/deesser",
    shortName: "De-Esser",
    category: "Dynamics",
    description: "A precision high-frequency dynamics controller.",
    howItWorks: "Compresses only the sibilant high frequencies when triggered by a dedicated detector path.",
    proTips: "Crucial for taming harsh 'S' and 'T' sounds on lead vocals.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -12, description: "De-Essing Threshold" },
      { index: 1, name: "Frequency (Hz)", unit: "Hz", min: 2000, max: 12000, defaultVal: 6000, description: "Sibilance Target Freq" },
      { index: 2, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 5, description: "Reduction Amount" },
      { index: 3, name: "Monitor", unit: "", min: 0, max: 1, defaultVal: 0, description: "Listen to what is being removed" }
    ]
  },
  {
    name: "JS: Pitch Shifter",
    shortName: "Pitch Shifter",
    category: "Time & Modulation",
    description: "Realtime audio pitch transposition.",
    howItWorks: "Uses overlap-add windowing algorithms to shift pitch independent of time.",
    proTips: "Shift a backing vocal down by 12 semitones to create a demonic underlayer.",
    sliders: [
      { index: 0, name: "Shift (Semitones)", unit: "st", min: -24, max: 24, defaultVal: 0, description: "Semitones" },
      { index: 1, name: "Shift (Cents)", unit: "ct", min: -100, max: 100, defaultVal: 0, description: "Cents" },
      { index: 2, name: "Window Size (ms)", unit: "ms", min: 10, max: 100, defaultVal: 50, description: "Grain Size" },
      { index: 3, name: "Mix", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet/Dry Blend" }
    ]
  },
  {
    name: "JS: LOSER/TransientController",
    shortName: "Transient Controller",
    category: "Dynamics",
    description: "Shape the attack and sustain of audio sources independent of absolute level.",
    howItWorks: "Analyzes amplitude envelopes to independently boost or cut the immediate spike (attack) or the ring-out (sustain).",
    proTips: "Turn the Attack up and Sustain down to make a floppy kick drum punch hard and tight.",
    sliders: [
      { index: 0, name: "Attack (%)", unit: "%", min: -100, max: 100, defaultVal: 0, description: "Transient punch" },
      { index: 1, name: "Sustain (%)", unit: "%", min: -100, max: 100, defaultVal: 0, description: "Tail / Ring-out" },
      { index: 2, name: "Output (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Makeup Gain" }
    ]
  },
  {
    name: "JS: MS Decoder",
    shortName: "Mid/Side Decoder",
    category: "Routing & Utility",
    description: "Converts Mid/Side audio signals back into standard Left/Right Stereo.",
    howItWorks: "Matrixes the Mid channel (L+R) and Side channel (L-R) back into discrete Left and Right channels.",
    proTips: "Place at the end of an effects chain when doing dedicated Mid/Side processing.",
    sliders: []
  },
  {
    name: "JS: MS Encoder",
    shortName: "Mid/Side Encoder",
    category: "Routing & Utility",
    description: "Converts standard Left/Right Stereo into a Mid/Side matrix.",
    howItWorks: "Creates a mono Mid channel and a difference Side channel.",
    proTips: "Put this before an EQ to EQ the sides (width) differently than the center.",
    sliders: []
  }
];

const file = 'src/data/jsfxResearch.ts';
let code = fs.readFileSync(file, 'utf8');
const anchor = '];';
const insertion = profiles.map(p => `  ${JSON.stringify(p, null, 4)}`).join(',\n') + '\n';
const pos = code.lastIndexOf(anchor);
const newCode = code.slice(0, pos) + ',\n' + insertion + code.slice(pos);
fs.writeFileSync(file, newCode, 'utf8');

console.log('Added 7 utility plugins');
