const fs = require('fs');

const profiles = [
  {
    name: "JS: LOSER/gate",
    shortName: "LOSER Gate",
    category: "Dynamics",
    description: "A fast noise gate.",
    howItWorks: "Mutes the signal when it falls below a set threshold.",
    proTips: "Use to cut out mic bleed between tom hits on a drum kit.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -18, description: "Gate Threshold" },
      { index: 1, name: "Attack (ms)", unit: "ms", min: 0, max: 100, defaultVal: 1, description: "Attack Time" },
      { index: 2, name: "Hold (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 5, description: "Hold Time" },
      { index: 3, name: "Release (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 200, description: "Release Time" }
    ]
  },
  {
    name: "JS: Multi-Band Compressor",
    shortName: "Multiband Comp",
    category: "Dynamics",
    description: "A 4-band stereo multiband compressor.",
    howItWorks: "Splits incoming signal into four bands using crossovers and compresses each band individually.",
    proTips: "Great for re-balancing a master bus or taming extreme resonances in slap bass.",
    sliders: [
        { index: 0, name: "Band 1 Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold 1" },
        { index: 1, name: "Band 1 Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio 1" },
        { index: 2, name: "Band 1 Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain 1" },
        { index: 3, name: "Band 2 Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold 2" },
        { index: 4, name: "Band 2 Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio 2" },
        { index: 5, name: "Band 2 Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain 2" },
        { index: 6, name: "Band 3 Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold 3" },
        { index: 7, name: "Band 3 Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio 3" },
        { index: 8, name: "Band 3 Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain 3" },
        { index: 9, name: "Band 4 Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold 4" },
        { index: 10, name: "Band 4 Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio 4" },
        { index: 11, name: "Band 4 Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Gain 4" },
        { index: 12, name: "Crossover 1 (Hz)", unit: "Hz", min: 20, max: 4000, defaultVal: 200, description: "Crossover 1" },
        { index: 13, name: "Crossover 2 (Hz)", unit: "Hz", min: 200, max: 8000, defaultVal: 2000, description: "Crossover 2" },
        { index: 14, name: "Crossover 3 (Hz)", unit: "Hz", min: 500, max: 22000, defaultVal: 5000, description: "Crossover 3" }
    ]
  },
  {
    name: "JS: 5-Band Compressor",
    shortName: "5-Band Comp",
    category: "Dynamics",
    description: "A 5-band stereo multiband compressor.",
    howItWorks: "Splits incoming signal into five bands using crossovers and compresses each band individually.",
    proTips: "Extremely surgical dynamics control for mastering.",
    sliders: [
        { index: 0, name: "Band 1 Tresh/Ratio", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Treshold/Ratio Combo 1" }
    ]
  },
  {
    name: "JS: 3-Band Compressor",
    shortName: "3-Band Comp",
    category: "Dynamics",
    description: "A 3-band stereo multiband compressor.",
    howItWorks: "Splits incoming signal into three bands using crossovers and compresses each band individually.",
    proTips: "A simpler multiband processor for de-essing (focus on high mid band).",
    sliders: [
        { index: 0, name: "Low Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Low Threshold" },
        { index: 1, name: "Low Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Low Ratio" },
        { index: 2, name: "Mid Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Mid Threshold" },
        { index: 3, name: "Mid Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Mid Ratio" },
        { index: 4, name: "High Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "High Threshold" },
        { index: 5, name: "High Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "High Ratio" }
    ]
  },
  {
    name: "JS: Expander / Gate",
    shortName: "Expander/Gate",
    category: "Dynamics",
    description: "A standard noise gate and downward expander.",
    howItWorks: "Attenuates signal below the threshold point.",
    proTips: "Very useful for reducing background noise in narration or podcast recordings.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -120, max: 0, defaultVal: -120, description: "Gate Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 10, defaultVal: 1, description: "Expander Ratio" },
      { index: 2, name: "Attack (ms)", unit: "ms", min: 0, max: 100, defaultVal: 1, description: "Attack" },
      { index: 3, name: "Release (ms)", unit: "ms", min: 0, max: 1000, defaultVal: 200, description: "Release" }
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

console.log('Added 5 dynamics plugins');
