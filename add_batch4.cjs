const fs = require('fs');

const profiles = [
  {
    name: "JS: Downward Expander",
    shortName: "Downward Expander",
    category: "Dynamics",
    description: "An expander to increase dynamic range by reducing sounds below the threshold.",
    howItWorks: "Ducks the gain with configurable attack/release times when signal is quiet.",
    proTips: "Use for removing drum bleed naturally without fully clamping like a gate.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -120, max: 0, defaultVal: -120, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio" },
      { index: 2, name: "Output (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Output Gain" },
      { index: 3, name: "Attack (uS)", unit: "us", min: 20, max: 2000, defaultVal: 20, description: "Attack Time" },
      { index: 4, name: "Release (mS)", unit: "ms", min: 20, max: 2000, defaultVal: 250, description: "Release Time" },
      { index: 5, name: "Knee", unit: "", min: 0, max: 3, defaultVal: 2, description: "Hard/Soft Knee" },
      { index: 6, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "Normal/Sidechain" },
      { index: 8, name: "Detection", unit: "", min: 0, max: 1, defaultVal: 0, description: "Peak/RMS" }
    ]
  },
  {
    name: "JS: Express Bus Compressor",
    shortName: "Express Bus Comp",
    category: "Dynamics",
    description: "A fast, aggressive VCA style stereo bus compressor.",
    howItWorks: "Highly responsive solid-state modeled compressor.",
    proTips: "Classic 'SSL style' bus glue. Use on the drum bus to make it smack.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: 0, description: "Threshold" },
      { index: 1, name: "Ratio", unit: "ratio", min: 1, max: 20, defaultVal: 1, description: "Ratio" },
      { index: 2, name: "Makeup Gain (dB)", unit: "dB", min: -20, max: 20, defaultVal: 0, description: "Makeup Gain" },
      { index: 3, name: "Attack (uS)", unit: "us", min: 20, max: 2000, defaultVal: 20, description: "Attack (uS)" },
      { index: 4, name: "Release (mS)", unit: "ms", min: 20, max: 1000, defaultVal: 250, description: "Release (ms)" },
      { index: 5, name: "Knee", unit: "", min: 0, max: 3, defaultVal: 0, description: "Knee" },
      { index: 6, name: "Detector Input", unit: "", min: 0, max: 1, defaultVal: 0, description: "Normal/Sidechain" },
      { index: 7, name: "Automatic Make-Up", unit: "", min: 0, max: 1, defaultVal: 1, description: "On/Off" },
      { index: 8, name: "Detector Routing", unit: "", min: 0, max: 1, defaultVal: 0, description: "Feedback/Feedforward" },
      { index: 9, name: "Detection Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "Peak/RMS" }
    ]
  },
  {
    name: "JS: Flanger",
    shortName: "Flanger",
    category: "Time & Modulation",
    description: "Comb-filtering sweep modulation.",
    howItWorks: "Mixes a closely delayed signal modulated by an LFO with the dry signal.",
    proTips: "Instant 80s jet plane effect.",
    sliders: [
      { index: 0, name: "Delay (ms)", unit: "ms", min: 0, max: 200, defaultVal: 0, description: "Delay" },
      { index: 1, name: "Wet (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet Mix" },
      { index: 2, name: "Dry (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Dry Mix" },
      { index: 3, name: "Rate (Hz)", unit: "Hz", min: 0, max: 20, defaultVal: 0.2, description: "Modulation Rate" },
      { index: 4, name: "Pitch Fudge Factor", unit: "", min: 0, max: 2, defaultVal: 0.5, description: "Depth" }
    ]
  },
  {
    name: "JS: Delay (Floaty)",
    shortName: "Floaty Delay",
    category: "Time & Modulation",
    description: "A digital delay with modulated echo points.",
    howItWorks: "Applies a chorus LFO to the delay buffer.",
    proTips: "Beautiful for dreamy vocal echoes.",
    sliders: [
      { index: 0, name: "Delay (ms)", unit: "ms", min: 0, max: 4000, defaultVal: 300, description: "Delay Length" },
      { index: 1, name: "Wet (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Wet Mix" },
      { index: 2, name: "Dry (%)", unit: "%", min: 0, max: 100, defaultVal: 100, description: "Dry Mix" },
      { index: 3, name: "Modulation Rate (Hz)", unit: "Hz", min: 0, max: 20, defaultVal: 0.2, description: "LFO Rate" },
      { index: 4, name: "Pitch Fudge Factor", unit: "", min: 0, max: 2, defaultVal: 0.5, description: "Depth" }
    ]
  },
  {
    name: "JS: LOSER/RBJ_HighpassLowpass",
    shortName: "RBJ HP/LP Filters",
    category: "EQ & Filtering",
    description: "Classic Biquad HP/LP filters.",
    howItWorks: "Robert Bristow-Johnson biquad filter implementations.",
    proTips: "Super stable low CPU sweeping filter.",
    sliders: [
      { index: 0, name: "Type", unit: "", min: 0, max: 1, defaultVal: 0, description: "0=Highpass, 1=Lowpass" },
      { index: 1, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 20000, description: "Cutoff" },
      { index: 2, name: "Q", unit: "", min: 0.1, max: 10, defaultVal: 1, description: "Resonance" },
      { index: 3, name: "Wet (dB)", unit: "dB", min: -120, max: 24, defaultVal: 0, description: "Wet Mix" },
      { index: 4, name: "Dry (dB)", unit: "dB", min: -120, max: 24, defaultVal: -120, description: "Dry Mix" }
    ]
  },
  {
    name: "JS: Huge Booty Bass Enhancer",
    shortName: "Huge Booty",
    category: "EQ & Filtering",
    description: "A specialized bass exciter/saturator.",
    howItWorks: "Creates harmonic distortion focused purely on low end frequencies.",
    proTips: "Add to sub bass channels to make them audible on small speakers/phones.",
    sliders: [
      { index: 0, name: "Frequency (Hz)", unit: "Hz", min: 20, max: 300, defaultVal: 100, description: "Bass Focus Frequency" },
      { index: 1, name: "Drive (%)", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Saturation Drive" },
      { index: 2, name: "Mix (%)", unit: "%", min: 0, max: 100, defaultVal: 50, description: "Blend" },
      { index: 3, name: "Path", unit: "", min: 0, max: 1, defaultVal: 0, description: "Left/Right vs Mid/Side" }
    ]
  },
  {
    name: "JS: LOSER/PresenceEQ",
    shortName: "Presence EQ",
    category: "EQ & Filtering",
    description: "A wide high-frequency enhancer.",
    howItWorks: "Applies a broad, musical bell boost at the specified center frequency.",
    proTips: "Boost presence centered at 5kHz to help vocals cut through a dense rock mix effortlessly.",
    sliders: [
      { index: 0, name: "Presence", unit: "dB", min: 0, max: 10, defaultVal: 0, description: "Presence Boost" },
      { index: 1, name: "Frequency (Hz)", unit: "Hz", min: 100, max: 8000, defaultVal: 2000, description: "Center Frequency" },
      { index: 2, name: "Output (dB)", unit: "dB", min: -120, max: 12, defaultVal: 0, description: "Output Offset" }
    ]
  },
  {
    name: "JS: Simple Peak-1 Limiter",
    shortName: "Simple Limiter",
    category: "Dynamics",
    description: "An extremely minimal peak limiter without lookahead.",
    howItWorks: "Basic diode-style chopping.",
    proTips: "Good for extremely fast, colorful chopping where transient preservation isn't required.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -3, description: "Limiting Threshold" },
      { index: 1, name: "Release (mS)", unit: "ms", min: 0.1, max: 500, defaultVal: 100, description: "Release" }
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
