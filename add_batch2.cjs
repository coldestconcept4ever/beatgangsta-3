const fs = require('fs');

const profiles = [
  {
    name: "JS: LOSER/3BandJoiner",
    shortName: "3-Band Joiner",
    category: "Routing & Utility",
    description: "Combines 3 bands back into a single stere/mono signal.",
    howItWorks: "Sums Low, Mid, and High inputs back together.",
    proTips: "Use in combination with a 3-Band Splitter.",
    sliders: [
      { index: 0, name: "Low (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Gain" },
      { index: 1, name: "Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Mid Gain" },
      { index: 2, name: "High (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Gain" }
    ]
  },
  {
    name: "JS: Liteon/3bandpeakfilter",
    shortName: "3-Band Peak Filter",
    category: "EQ & Filtering",
    description: "Multi-band peak filter with saturation.",
    howItWorks: "Applies peaking filters at three frequencies with adjustable bandwidth, along with HP/LP and saturation.",
    proTips: "Can be used as a creative coloring EQ.",
    sliders: [
      { index: 0, name: "Processing", unit: "", min: 0, max: 1, defaultVal: 0, description: "Stereo/Mono" },
      { index: 1, name: "HP Filter (2-Pole)", unit: "", min: 0, max: 100, defaultVal: 0, description: "HP Filter" },
      { index: 2, name: "Peak Filter Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "PF-3A/PF-3B" },
      { index: 3, name: "Frequency 1", unit: "", min: 0, max: 100, defaultVal: 50, description: "Frequency 1" },
      { index: 4, name: "Bandwidth 1", unit: "", min: 0.005, max: 1, defaultVal: 0.3, description: "Bandwidth 1" },
      { index: 5, name: "Gain 1", unit: "dB", min: -18, max: 18, defaultVal: 0, description: "Gain 1" },
      { index: 6, name: "Frequency 2", unit: "", min: 0, max: 100, defaultVal: 50, description: "Frequency 2" },
      { index: 7, name: "Bandwidth 2", unit: "", min: 0.005, max: 1, defaultVal: 0.3, description: "Bandwidth 2" },
      { index: 8, name: "Gain 2", unit: "dB", min: -18, max: 18, defaultVal: 0, description: "Gain 2" },
      { index: 9, name: "Frequency 3", unit: "", min: 0, max: 100, defaultVal: 50, description: "Frequency 3" },
      { index: 10, name: "Bandwidth 3", unit: "", min: 0.005, max: 1, defaultVal: 0.3, description: "Bandwidth 3" },
      { index: 11, name: "Gain 3", unit: "dB", min: -18, max: 18, defaultVal: 0, description: "Gain 3" },
      { index: 12, name: "LP Filter (2-Pole)", unit: "", min: 0, max: 100, defaultVal: 100, description: "LP Filter (2-Pole)" },
      { index: 13, name: "Saturation (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Saturation" },
      { index: 14, name: "Output", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Output" },
      { index: 15, name: "Oversample (x2)", unit: "", min: 0, max: 1, defaultVal: 0, description: "Oversample" }
    ]
  },
  {
    name: "JS: LOSER/3BandSplitter",
    shortName: "3-Band Splitter",
    category: "Routing & Utility",
    description: "Splits input into Low, Mid, and High outputs.",
    howItWorks: "Uses crossovers to separate bands out to different channels.",
    proTips: "Build your own multiband FX chain by routing these bands.",
    sliders: [
      { index: 0, name: "Crossover 1 (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 200, description: "Crossover 1" },
      { index: 1, name: "Crossover 2 (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 2000, description: "Crossover 2" }
    ]
  },
  {
    name: "JS: 3x3 EQ",
    shortName: "3x3 EQ",
    category: "EQ & Filtering",
    description: "3-band EQ with variable drive/saturation per band.",
    howItWorks: "Band-splits the signal and applies dedicated saturation and gain before recombining.",
    proTips: "Boost drive on the Low band for tape-like bass warmth.",
    sliders: [
      { index: 0, name: "Low Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Low Drive" },
      { index: 1, name: "Low Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "Low Gain" },
      { index: 2, name: "Mid Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Mid Drive" },
      { index: 3, name: "Mid Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "Mid Gain" },
      { index: 4, name: "High Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "High Drive" },
      { index: 5, name: "High Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "High Gain" },
      { index: 6, name: "Low-Mid Freq (Hz)", unit: "Hz", min: 60, max: 680, defaultVal: 240, description: "Low-Mid Crossover" },
      { index: 7, name: "Mid-High Freq (Hz)", unit: "Hz", min: 720, max: 12000, defaultVal: 2400, description: "Mid-High Crossover" }
    ]
  },
  {
    name: "JS: LOSER/4BandEQ",
    shortName: "4-Band EQ",
    category: "EQ & Filtering",
    description: "Fixed crossover 4-band EQ.",
    howItWorks: "Splits ranges into Low, Low-Mid, High-Mid, and High.",
    proTips: "Fast tone-shaping utility without Q controls getting in the way.",
    sliders: [
      { index: 0, name: "Low (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Gain" },
      { index: 1, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 200, description: "Low-Mid Crossover" },
      { index: 2, name: "Low Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Mid Gain" },
      { index: 3, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 2000, description: "Mid Crossover" },
      { index: 4, name: "High Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Mid Gain" },
      { index: 5, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 5000, description: "High Crossover" },
      { index: 6, name: "High (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Gain" },
      { index: 7, name: "Output (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Output Gain" }
    ]
  },
  {
    name: "JS: LOSER/4BandJoiner",
    shortName: "4-Band Joiner",
    category: "Routing & Utility",
    description: "Combines 4 frequency bands into a single stereo signal.",
    howItWorks: "Used in conjunction with a 4-Band Splitter.",
    proTips: "Adjust individual bands at the end of a multiband chain.",
    sliders: [
      { index: 0, name: "Low (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Low Gain" },
      { index: 1, name: "Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Mid Gain" },
      { index: 2, name: "High (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "High Gain" },
      { index: 3, name: "UberHigh (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "UberHigh Gain" }
    ]
  },
  {
    name: "JS: LOSER/4BandSplitter",
    shortName: "4-Band Splitter",
    category: "Routing & Utility",
    description: "Splits a signal into 4 distinct frequency bands.",
    howItWorks: "Routes different crossover ranges to separate output channels.",
    proTips: "Feed this into independent compressors per-channel.",
    sliders: [
      { index: 0, name: "Crossover 1 (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 200, description: "Crossover 1" },
      { index: 1, name: "Crossover 2 (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 2000, description: "Crossover 2" },
      { index: 2, name: "Crossover 3 (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 5000, description: "Crossover 3" }
    ]
  },
  {
    name: "JS: 4x4 EQ",
    shortName: "4x4 EQ",
    category: "EQ & Filtering",
    description: "4-band EQ with variable drive/saturation per band.",
    howItWorks: "Like 3x3 but with 4 bands.",
    proTips: "Multiband saturation engine for fine tuning.",
    sliders: [
      { index: 0, name: "Low Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Low Drive" },
      { index: 1, name: "Low Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "Low Gain" },
      { index: 2, name: "Mid Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "Mid Drive" },
      { index: 3, name: "Mid Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "Mid Gain" },
      { index: 4, name: "High Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 0, description: "High Drive" },
      { index: 5, name: "High Gain (dB)", unit: "dB", min: -12, max: 12, defaultVal: 0, description: "High Gain" },
      { index: 6, name: "Low-Mid Crossover (Hz)", unit: "Hz", min: 60, max: 500, defaultVal: 240, description: "Low-Mid Crossover" },
      { index: 7, name: "Mid-High Crossover (Hz)", unit: "Hz", min: 510, max: 10000, defaultVal: 2400, description: "Mid-High Crossover" }
    ]
  },
  {
    name: "JS: LOSER/50HzKicker",
    shortName: "50 Hz Kicker",
    category: "EQ & Filtering",
    description: "Kick Drum Enhancer generating low fundamentals.",
    howItWorks: "Tracks amplitude and synthesizes a low sine wave under the kick.",
    proTips: "Tune to the exact fundamental of the track (e.g., 60Hz) to add massive bottom end to weak kicks.",
    sliders: [
      { index: 0, name: "Freqency (Hz)", unit: "Hz", min: 10, max: 200, defaultVal: 50, description: "Sub sine frequency" },
      { index: 1, name: "Wet (dB)", unit: "dB", min: -120, max: 12, defaultVal: -12, description: "Wet Level" },
      { index: 2, name: "Dry (dB)", unit: "dB", min: -120, max: 12, defaultVal: -3, description: "Dry Level" }
    ]
  },
  {
    name: "JS: ADPCM Simulator",
    shortName: "ADPCM Simulator",
    category: "Routing & Utility",
    description: "Encodes/decodes to IMA ADPCM to give it a crunchy, retro sound.",
    howItWorks: "Simulates early 12-bit/4-bit sampler compression routines.",
    proTips: "Great for making pristine samples sound like they came from an MPC or SP1200.",
    sliders: [
      { index: 0, name: "Bits", unit: "", min: 1, max: 4, defaultVal: 4, description: "Bit resolution simulation." },
      { index: 1, name: "Block Size", unit: "", min: 2, max: 65538, defaultVal: 4096, description: "ADPCM block size." },
      { index: 2, name: "Bit Bias", unit: "", min: 0, max: 7, defaultVal: 0, description: "Bias adjustment." },
      { index: 3, name: "Gain (dB)", unit: "dB", min: -60, max: 60, defaultVal: 0, description: "Makeup Gain" }
    ]
  },
  {
    name: "JS: Convolution Amp/Cab Modeler",
    shortName: "Amp/Cab Modeler",
    category: "Dynamics",
    description: "An impulse response loader designed for guitar amps and cabinets.",
    howItWorks: "Loads an impulse response file and convolves the audio.",
    proTips: "Load a high-quality cab IR to bring DI guitars to life.",
    sliders: [
      { index: 1, name: "Preamp (dB)", unit: "dB", min: -120, max: 30, defaultVal: 0, description: "Preamp gain level." },
      { index: 2, name: "Upsample Impulse", unit: "", min: 0, max: 2, defaultVal: 2, description: "0=No, 1=Yes (no adj), 2=Yes (correct)" },
      { index: 3, name: "Channel Mode", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=L-Stereo, 1=Stereo-Stereo" }
    ]
  },
  {
    name: "JS: Amplitude Modulator",
    shortName: "Amplitude Modulator",
    category: "Time & Modulation",
    description: "Classic tremolo/amplitude modulation effect.",
    howItWorks: "Modulates volume using a simple sine wave at a set frequency.",
    proTips: "Use high rates for ring-modulator style textures.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 80, max: 1000, defaultVal: 440, description: "Modulation frequency." }
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

console.log('Added 12 plugins');
