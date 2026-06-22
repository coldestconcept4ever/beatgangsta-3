const fs = require('fs');

const profiles = [
  {
    name: "JS: Auto Expander",
    shortName: "Auto Expander",
    category: "Dynamics",
    description: "An auto expander for expanding dynamic range below the threshold.",
    howItWorks: "Reduces the volume of signals that fall below the threshold.",
    proTips: "Excellent for cleaning up background noise or bleed in drum tracks.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -120, max: 0, defaultVal: -120, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio" },
      { index: 2, name: "Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain" },
      { index: 3, name: "Knee", unit: "", min: 0, max: 3, defaultVal: 2, description: "0=Hard (Blown Cap), 1=Soft (Blown Cap), 2=Hard, 3=Soft" },
      { index: 4, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Normal, 1=Sidechain" },
      { index: 6, name: "Detection", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Peak, 1=RMS" }
    ]
  },
  {
    name: "JS: Fairly Childish Compressor/Limiter",
    shortName: "Fairly Childish",
    category: "Dynamics",
    description: "A compressor and limiter inspired by the classic Fairchild 670.",
    howItWorks: "Employs variable-mu style tube compression with program-dependent attack and release times.",
    proTips: "Great on vocals and master bus for vintage glue and warmth.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold" },
      { index: 1, name: "Bias", unit: "", min: 0.1, max: 100, defaultVal: 70, description: "Bias" },
      { index: 2, name: "Makeup Gain", unit: "dB", min: -30, max: 30, defaultVal: 0, description: "Makeup Gain" },
      { index: 3, name: "AGC", unit: "", min: 0, max: 3, defaultVal: 2, description: "0=L/R(Blown), 1=Lat/Vert(Blown), 2=L/R, 3=Lat/Vert" },
      { index: 4, name: "Time Constant", unit: "", min: 1, max: 6, defaultVal: 1, description: "Time Constant" },
      { index: 5, name: "Level Detector RMS Window", unit: "ms", min: 1, max: 10000, defaultVal: 100, description: "RMS Window" },
      { index: 6, name: "Current Compression Ratio", unit: "ratio", min: 1, max: 50, defaultVal: 1, description: "Current Ratio (Readonly)" },
      { index: 7, name: "Gain Reduction", unit: "dB", min: -90, max: 0, defaultVal: 0, description: "Gain Reduction (Readonly)" }
    ]
  },
  {
    name: "JS: General Dynamics",
    shortName: "General Dynamics",
    category: "Dynamics",
    description: "A highly customizable graphical dynamics processor.",
    howItWorks: "Allows you to draw your own compression/expansion transfer curve.",
    proTips: "Draw complex gate, expander, and compressor combinations all in one curve.",
    sliders: [
      { index: 0, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "Detector Input" },
      { index: 1, name: "Detector Gain (dB)", unit: "dB", min: -40, max: 40, defaultVal: 0, description: "Detector Gain" },
      { index: 2, name: "Detector RMS size (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 0, description: "RMS size" },
      { index: 3, name: "Input lookahead (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 0, description: "Lookahead" },
      { index: 4, name: "Input Attack (ms)", unit: "ms", min: 0, max: 200, defaultVal: 5, description: "Input Attack" },
      { index: 5, name: "Input Release (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 250, description: "Input Release" },
      { index: 9, name: "Gain Attack (ms)", unit: "ms", min: 0, max: 200, defaultVal: 0, description: "Gain Attack" },
      { index: 10, name: "Gain Release (ms)", unit: "ms", min: 0, max: 200, defaultVal: 0, description: "Gain Release" },
      { index: 11, name: "Wet Mix (dB)", unit: "dB", min: -150, max: 24, defaultVal: 0, description: "Wet Mix" },
      { index: 12, name: "Dry Mix (dB)", unit: "dB", min: -150, max: 24, defaultVal: -150, description: "Dry Mix" }
    ]
  },
  {
    name: "JS: LOSER/MGA_JSLimiter",
    shortName: "MGA JS Limiter",
    category: "Dynamics",
    description: "Limits the maximum output volume of an audio signal.",
    howItWorks: "Uses a lookahead peak detector to apply gain reduction transparently.",
    proTips: "An excellent safety clipper/limiter for individual tracks before they hit the master.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -30, max: 0, defaultVal: 0, description: "Threshold" },
      { index: 1, name: "Release (ms)", unit: "ms", min: 0, max: 500, defaultVal: 200, description: "Release" },
      { index: 2, name: "Ceiling", unit: "dB", min: -6, max: 0, defaultVal: -0.1, description: "Ceiling" }
    ]
  },
  {
    name: "JS: LOSER/MasterLimiter",
    shortName: "Master Limiter",
    category: "Dynamics",
    description: "A hard master limiter for peak reduction.",
    howItWorks: "Clamps the signal down based on lookahead and attack/release envelopes.",
    proTips: "Use lightly on master bus to catch errant peaks.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -20, max: -0.1, defaultVal: -3, description: "Threshold" },
      { index: 1, name: "Look Ahead (us)", unit: "us", min: 0, max: 1000, defaultVal: 200, description: "Look Ahead" },
      { index: 2, name: "Attack (us)", unit: "us", min: 0, max: 1000, defaultVal: 100, description: "Attack" },
      { index: 3, name: "Hold (ms)", unit: "ms", min: 0, max: 10, defaultVal: 0, description: "Hold" },
      { index: 4, name: "Release (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 250, description: "Release" },
      { index: 5, name: "Limit (dB)", unit: "dB", min: -6, max: 0, defaultVal: -0.1, description: "Limit" },
      { index: 6, name: "Reduction", unit: "dB", min: -20, max: 0, defaultVal: 0, description: "Reduction (Readonly)" }
    ]
  },
  {
    name: "JS: LOSER/MasterTom",
    shortName: "Master Tom Compressor",
    category: "Dynamics",
    description: "Bus compressor for gluing mixes.",
    howItWorks: "Standard bus compressor features including RMS/Peak modes and sidechains.",
    proTips: "Set detection to RMS for a smoother, less clinical compression character on the mix buss.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio" },
      { index: 2, name: "Gain", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain" },
      { index: 3, name: "Knee", unit: "", min: 0, max: 3, defaultVal: 2, description: "Knee" },
      { index: 4, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "Detector Input" },
      { index: 5, name: "Automatic Make-Up", unit: "", min: 0, max: 1, defaultVal: 0, description: "Automatic Make-Up" },
      { index: 6, name: "Detection", unit: "", min: 0, max: 1, defaultVal: 0, description: "Detection" },
      { index: 7, name: "Detection Source", unit: "", min: 0, max: 1, defaultVal: 0, description: "Detection Source" }
    ]
  },
  {
    name: "JS: LOSER/compciter",
    shortName: "Compciter",
    category: "Dynamics",
    description: "A combination compressor and exciter.",
    howItWorks: "Applies non-linear distortion (excitation) driven by compression envelopes.",
    proTips: "Great for adding bite and presence to snare drums or dull vocal performances.",
    sliders: [
      { index: 0, name: "Drive (dB)", unit: "dB", min: 0, max: 60, defaultVal: 0, description: "Drive" },
      { index: 1, name: "Distortion (%)", unit: "%", min: 0, max: 100, defaultVal: 25, description: "Distortion" },
      { index: 2, name: "Highpass (Hz)", unit: "Hz", min: 800, max: 12000, defaultVal: 5000, description: "Highpass" },
      { index: 3, name: "Wet (dB)", unit: "dB", min: -60, max: 24, defaultVal: -6, description: "Wet" },
      { index: 4, name: "Dry (dB)", unit: "dB", min: -120, max: 0, defaultVal: 0, description: "Dry" }
    ]
  },
  {
    name: "JS: LOSER/DDC",
    shortName: "Digital Drum Compressor",
    category: "Dynamics",
    description: "A compressor tailored for digital and electronic drums.",
    howItWorks: "Optimized attack and hold envelopes to let percussive peaks through before clamping.",
    proTips: "To get your kick drums absolutely knocking, set a moderate attack (15ms-20ms) so the transient pokes through.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -20, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 0, max: 50, defaultVal: 20, description: "Ratio" },
      { index: 2, name: "Attack (ms)", unit: "ms", min: 0, max: 500, defaultVal: 20, description: "Attack" },
      { index: 3, name: "Hold (ms)", unit: "ms", min: 0, max: 500, defaultVal: 0.5, description: "Hold" },
      { index: 4, name: "Release (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 200, description: "Release" },
      { index: 5, name: "RMS Size (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 0, description: "RMS Size" },
      { index: 6, name: "Feed", unit: "", min: 0, max: 2, defaultVal: 0, description: "Feed" },
      { index: 7, name: "Auto Make-Up", unit: "", min: 0, max: 1, defaultVal: 1, description: "Auto Make-Up" },
      { index: 8, name: "Output (dB)", unit: "dB", min: -120, max: 60, defaultVal: 0, description: "Output" },
      { index: 9, name: "Reduction (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Reduction (Readonly)" }
    ]
  },
  {
    name: "JS: Liteon/np1136peaklimiter",
    shortName: "NP1136 Peak Limiter",
    category: "Dynamics",
    description: "Program dependent Peak Limiter.",
    howItWorks: "Uses compressor envelopes and a tilt EQ to shape peaks and frequency balance before limiting.",
    proTips: "Can also be used as a mastering limiter; just watch the GR Limit carefully.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -40, max: 0, defaultVal: -12, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 4, description: "Ratio" },
      { index: 2, name: "Attack (us)", unit: "us", min: 0, max: 100, defaultVal: 30, description: "Attack" },
      { index: 3, name: "Release (ms)", unit: "ms", min: 0, max: 100, defaultVal: 45, description: "Release" },
      { index: 4, name: "Detector HP (Hz)", unit: "Hz", min: 0, max: 100, defaultVal: 0, description: "Detector HP" },
      { index: 5, name: "GR Limit (dB)", unit: "dB", min: -40, max: 0, defaultVal: -18, description: "GR Limit" },
      { index: 6, name: "Makeup Gain (dB)", unit: "dB", min: 0, max: 30, defaultVal: 0, description: "Makeup Gain" },
      { index: 7, name: "Tilt EQ Center (Hz)", unit: "Hz", min: 0, max: 100, defaultVal: 50, description: "Tilt EQ Center" },
      { index: 8, name: "Tilt EQ Low/High (dB)", unit: "dB", min: -6, max: 6, defaultVal: 0, description: "Tilt EQ Low/High" },
      { index: 9, name: "Wet Mix (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet Mix" },
      { index: 10, name: "Processing Mode", unit: "", min: 0, max: 1, defaultVal: 0, description: "Processing Mode (Stereo/Mono)" },
      { index: 11, name: "Detector Mode", unit: "", min: 0, max: 1, defaultVal: 1, description: "Detector Mode" },
      { index: 12, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "Detector Input" },
      { index: 13, name: "Hard Clip", unit: "", min: 0, max: 1, defaultVal: 0, description: "Hard Clip" }
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

console.log('Added 9 plugins');
