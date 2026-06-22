const fs = require('fs');

const profiles = [
  {
    name: "JS: 3-Band EQ",
    shortName: "3-Band EQ",
    category: "EQ & Filtering",
    description: "A standard 3-band sweepable EQ.",
    howItWorks: "Has low, mid, and high bands with adjustable crossovers.",
    proTips: "Classic tonal shaping.",
    sliders: [
      { index: 0, name: "Low (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Band Gain" },
      { index: 1, name: "Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Mid Band Gain" },
      { index: 2, name: "High (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Band Gain" },
      { index: 3, name: "Low-Mid Crossover (Hz)", unit: "Hz", min: 20, max: 2000, defaultVal: 200, description: "Low-Mid Crossover" },
      { index: 4, name: "Mid-High Crossover (Hz)", unit: "Hz", min: 500, max: 20000, defaultVal: 2000, description: "Mid-High Crossover" }
    ]
  },
  {
    name: "JS: 5-Band Stereo EQ",
    shortName: "5-Band EQ",
    category: "EQ & Filtering",
    description: "A 5-band fixed-crossover stereo equalizer.",
    howItWorks: "Boosts or cuts five specific frequency buckets.",
    proTips: "Fast tone adjustments.",
    sliders: [
      { index: 0, name: "Band 1 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 1 Gain" },
      { index: 1, name: "Band 2 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 2 Gain" },
      { index: 2, name: "Band 3 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 3 Gain" },
      { index: 3, name: "Band 4 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 4 Gain" },
      { index: 4, name: "Band 5 (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 5 Gain" }
    ]
  },
  {
    name: "JS: Bandpass Filter",
    shortName: "Bandpass Filter",
    category: "EQ & Filtering",
    description: "A resonant bandpass filter.",
    howItWorks: "Allows only a certain frequency range to pass through, suppressing highs and lows.",
    proTips: "Great for telephone or vintage radio vocal effects.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 20, max: 20000, defaultVal: 1000, description: "Center Frequency" },
      { index: 1, name: "Bandwidth (Octaves)", unit: "oct", min: 0.1, max: 4, defaultVal: 1, description: "Bandwidth" }
    ]
  },
  {
    name: "JS: Exciter",
    shortName: "Exciter",
    category: "EQ & Filtering",
    description: "A harmonic exciter.",
    howItWorks: "Adds synthesized high-frequency harmonics driven by the input signal.",
    proTips: "Brightens up dull acoustic guitars or snare drums without just turning up an EQ.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 1000, max: 10000, defaultVal: 3000, description: "Excitation Frequency Focus" },
      { index: 1, name: "Amount (%)", unit: "%", min: 0, max: 100, defaultVal: 20, description: "Harmonic Generation Amount" }
    ]
  },
  {
    name: "JS: LOSER/BasiQ",
    shortName: "BasiQ",
    category: "EQ & Filtering",
    description: "A very basic three-band EQ with fixed frequencies.",
    howItWorks: "Treble, Mid, and Bass controls formatted like an old guitar amp tone stack.",
    proTips: "When you just need to knock off some treble fast, reach for this.",
    sliders: [
      { index: 0, name: "Bass", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Freq Boost/Cut" },
      { index: 1, name: "Mid", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Mid Freq Boost/Cut" },
      { index: 2, name: "Treble", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Freq Boost/Cut" }
    ]
  },
  {
    name: "JS: RBJ 1073 EQ",
    shortName: "RBJ 1073 EQ",
    category: "EQ & Filtering",
    description: "An EQ mimicking the curves and band layouts of a classic Neve 1073.",
    howItWorks: "Features a high shelf, mid bell, low shelf, and a highpass filter.",
    proTips: "This EQ design is famous for a reason. Boost the high shelf and cut the highpass for instant clarity.",
    sliders: [
      { index: 0, name: "High Shelf (Hz)", unit: "Hz", min: 1000, max: 16000, defaultVal: 12000, description: "High Shelf Frequency" },
      { index: 1, name: "High Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Shelf Boost/Cut" },
      { index: 2, name: "Mid Freq (Hz)", unit: "Hz", min: 360, max: 7200, defaultVal: 1000, description: "Mid Bell Frequency" },
      { index: 3, name: "Mid Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Mid Bell Boost/Cut" },
      { index: 4, name: "Low Shelf (Hz)", unit: "Hz", min: 35, max: 220, defaultVal: 60, description: "Low Shelf Frequency" },
      { index: 5, name: "Low Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Shelf Boost/Cut" },
      { index: 6, name: "Highpass (Hz)", unit: "Hz", min: 50, max: 300, defaultVal: 50, description: "Highpass Cutoff" }
    ]
  },
  {
    name: "JS: RBJ 4-Band Semi-Parametric EQ",
    shortName: "4-Band Parametric",
    category: "EQ & Filtering",
    description: "A highly flexible 4-band parametric equalizer.",
    howItWorks: "Low shelf, two mid bells, and a high shelf, using RBJ biquad formulas.",
    proTips: "Your go-to surgical EQ for tracking and mixing.",
    sliders: [
      { index: 0, name: "Low Freq (Hz)", unit: "Hz", min: 20, max: 1000, defaultVal: 100, description: "Low Freq" },
      { index: 1, name: "Low Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Gain" },
      { index: 2, name: "Low Mid Freq (Hz)", unit: "Hz", min: 100, max: 4000, defaultVal: 400, description: "Low Mid Freq" },
      { index: 3, name: "Low Mid Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Mid Gain" },
      { index: 4, name: "Low Mid Q", unit: "", min: 0.1, max: 10, defaultVal: 0.707, description: "Low Mid Q" },
      { index: 5, name: "High Mid Freq (Hz)", unit: "Hz", min: 400, max: 10000, defaultVal: 2000, description: "High Mid Freq" },
      { index: 6, name: "High Mid Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Mid Gain" },
      { index: 7, name: "High Mid Q", unit: "", min: 0.1, max: 10, defaultVal: 0.707, description: "High Mid Q" },
      { index: 8, name: "High Freq (Hz)", unit: "Hz", min: 1000, max: 20000, defaultVal: 6000, description: "High Freq" },
      { index: 9, name: "High Gain (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Gain" }
    ]
  },
  {
    name: "JS: Graphic EQ",
    shortName: "Graphic EQ",
    category: "EQ & Filtering",
    description: "A classic multi-band graphic equalizer.",
    howItWorks: "Provides fixed-frequency boost/cut sliders across the spectrum.",
    proTips: "Great for knocking out standing waves or feedback frequencies on live gig recordings.",
    sliders: [
      { index: 0, name: "Band 1 (Hz)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 1" },
      { index: 1, name: "Band 2 (Hz)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 2" },
      { index: 2, name: "Band 3 (Hz)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 3" },
      { index: 3, name: "Band 4 (Hz)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Band 4" }
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

console.log('Added 8 EQ plugins');
