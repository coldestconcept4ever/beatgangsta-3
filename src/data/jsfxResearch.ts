export interface JSFXParameter {
  index: number;
  name: string;
  unit: string;
  min: number;
  max: number;
  defaultVal: number;
  description: string;
}

export interface JSFXProfile {
  name: string;
  category: "Dynamics" | "EQ & Filtering" | "Time & Modulation" | "Routing & Utility" | "Guitar & Amp";
  shortName: string;
  description: string;
  howItWorks: string;
  proTips: string;
  volumeStagingWarning?: string;
  sliders: JSFXParameter[];
}

export const JSFX_DATABASE: JSFXProfile[] = [
  {
    name: "JS: 1175 Compressor",
    shortName: "1175 Compressor",
    category: "Dynamics",
    description: "An emulation of the classic fast 1176 FET limiting amplifier, perfect for making vocals crisp, energetic, and up-front.",
    howItWorks: "Using ultra-fast attack and release envelopes, it clamps down on fast peaks. As with all classic FET compressions, clamping peaks reduces the peak output energy significantly.",
    proTips: "To bring vocals right to the front instead of burying them, you MUST match any compressor Threshold reduction with equal or greater S3 (Gain) to restore presence and maintain excellent vocal level consistency.",
    volumeStagingWarning: "CRITICAL: Using S1 (Threshold) at -20dB to -30dB will make your vocals extremely quiet. You must boost S3 (Gain) to +12dB to +18dB to compensate and bring the volume back up!",
    sliders: [
      {"index":0,"name":"Threshold","min":-60,"max":0,"defaultVal":0,"unit":"dB"},
      {"index":1,"name":"Ratio","min":0,"max":9,"defaultVal":5},
      {"index":2,"name":"Gain","min":-20,"max":20,"defaultVal":0,"unit":"dB"},
      {"index":3,"name":"Attack","min":20,"max":2000,"defaultVal":20,"unit":"uS"},
      {"index":4,"name":"Release","min":20,"max":1000,"defaultVal":250,"unit":"ms"},
      {"index":5,"name":"Mix","min":0,"max":100,"defaultVal":100,"unit":"%"}    ]
  },
  {
    name: "JS: Volume/Pan Smoother",
    shortName: "Volume & Pan Controller",
    category: "Routing & Utility",
    description: "A super-clean utility slider for precise track gain adjustment, leveling, and overall volume matching.",
    howItWorks: "Directly attenuates or boosts the raw audio sample buffer with zero phase distortion or coloration.",
    proTips: "Use this plugin as the very last plugin on a track's FX chain to ensure accurate staging and absolute control of track leveling without affecting the gain going into pre-fader compressors.",
    sliders: [
      {"index":0,"name":"Volume","min":-60,"max":12,"defaultVal":0,"unit":"dB"},
      {"index":1,"name":"Pan","min":-100,"max":100,"defaultVal":0},
      {"index":2,"name":"Pan Law","min":-6,"max":6,"defaultVal":0,"unit":"dB"}
    ]
  },
  {
    name: "JS: LOSER/EventHorizon",
    shortName: "Event Horizon Clipper/Limiter",
    category: "Dynamics",
    description: "A clean, aggressive peak clipper and brickwall maximizer, ideal for group buses or master outputs.",
    howItWorks: "Shaves off transient peaks above the Threshold point, transferring energy into perceived average loudness (RMS) through soft clipping before hard brickwall capping.",
    proTips: "When designing track dynamic ranges on vocals or the master bus, S1 (Threshold) pulls the ceiling down to squash peaks. Keep S2 (Ceiling) around -0.1dB to -0.5dB to prevent digital clipping at the output.",
    sliders: [
      {"index":0,"name":"Threshold (dB)","unit":"dB","min":-30,"max":0,"defaultVal":-0.1,"description":"Threshold"},
      {"index":1,"name":"Ceiling (dB)","unit":"dB","min":-30,"max":0,"defaultVal":-0.1,"description":"Ceiling"},
      {"index":2,"name":"Soft Clip (dB)","unit":"dB","min":0,"max":6,"defaultVal":2,"description":"Soft Clip"}    ]
  },
  {
    name: "JS: LOSER/3BandEQ",
    shortName: "3-Band Equalizer",
    category: "EQ & Filtering",
    description: "A simple, phase-coherent 3-band sweepable frequency equalizer designed for tonal balance.",
    howItWorks: "Crossover networks separate incoming audio into low, mid, and high frequency ranges using Butterworth filters before applying independent gain stages.",
    proTips: "Clean muddy boxiness in vocals by reducing the Mid Gain (-2dB) around the crossover frequency, and boost High Gain slightly for brilliance.",
    sliders: [
      { index: 0, name: "Low (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Gain boost or attenuation for low frequencies." },
      { index: 1, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 200, description: "Frequency boundary dividing Low and Mid bands." },
      { index: 2, name: "Mid (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Gain boost or attenuation for mid frequencies." },
      { index: 3, name: "Frequency (Hz)", unit: "Hz", min: 0, max: 22000, defaultVal: 2000, description: "Frequency boundary dividing Mid and High bands." },
      { index: 4, name: "High (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Gain boost or attenuation for high frequencies." },
      { index: 5, name: "Output (dB)", unit: "dB", min: -24, max: 24, defaultVal: 0, description: "Output gain adjustment." }
    ]
  },
  {
    name: "JS: Chorus",
    shortName: "Stereo Chorus",
    category: "Time & Modulation",
    description: "Creates thick, lush, and wider vocal backings or melodies by duplicating signals and modulating delay.",
    howItWorks: "An LFO modulates target delay lines back and forth to create slight pitch and timing discrepancies, simulating a multi-singer performance.",
    proTips: "Keep Wet Mix (S5) low (-12dB to -18dB) on main lead vocals to preserve punch, but boost it on backing vocals for a wider, floatier stereo field.",
    sliders: [
      {"index":0,"name":"Chorus Length","min":1,"max":250,"defaultVal":15,"unit":"ms"},
      {"index":1,"name":"Number Of Voices","min":1,"max":8,"defaultVal":1},
      {"index":2,"name":"Rate","min":0.1,"max":16,"defaultVal":0.5,"unit":"Hz"},
      {"index":3,"name":"Pitch Fudge Factor","min":0,"max":1,"defaultVal":0.7},
      {"index":4,"name":"Wet Mix","min":-100,"max":12,"defaultVal":-6,"unit":"dB"},
      {"index":5,"name":"Dry Mix","min":-100,"max":12,"defaultVal":-6,"unit":"dB"}    ]
  },
  {
    name: "JS: Delay",
    shortName: "Delay Tone Control",
    category: "Time & Modulation",
    description: "An echo engine designed to create spatial depth, trailing echoes, or slapbacks.",
    howItWorks: "Samples incoming audio into a circular buffer and reads it back after a specified delay time, feeding some of the output back into the input.",
    proTips: "For a wider high-quality vocal space without washing out the center image, feed a slight 80ms slapback delay into a wide Chorus, keeping the Wet level low.",
    sliders: [
      {"index":0,"name":"Delay","min":0,"max":4000,"defaultVal":300,"unit":"ms"},
      {"index":1,"name":"Feedback","min":-120,"max":6,"defaultVal":-5,"unit":"dB"},
      {"index":2,"name":"Mix In","min":-120,"max":6,"defaultVal":0,"unit":"dB"},
      {"index":3,"name":"Output Wet","min":-120,"max":6,"defaultVal":-6,"unit":"dB"},
      {"index":4,"name":"Output Dry","min":-120,"max":6,"defaultVal":0,"unit":"dB"},
      {"index":5,"name":"Resample On Length Change","min":0,"max":1,"defaultVal":0}
    ]
  },
  {
    "name": "JS: Auto Expander",
    "shortName": "Auto Expander",
    "category": "Dynamics",
    "description": "An auto expander for expanding dynamic range below the threshold.",
    "howItWorks": "Reduces the volume of signals that fall below the threshold.",
    "proTips": "Excellent for cleaning up background noise or bleed in drum tracks.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain"
        },
        {
            "index": 3,
            "name": "Knee",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 2,
            "description": "0=Hard (Blown Cap), 1=Soft (Blown Cap), 2=Hard, 3=Soft"
        },
        {
            "index": 4,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Normal, 1=Sidechain"
        },
        {
            "index": 6,
            "name": "Detection",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Peak, 1=RMS"
        }
    ]
},
  {
    "name": "JS: Fairly Childish Compressor/Limiter",
    "shortName": "Fairly Childish",
    "category": "Dynamics",
    "description": "A compressor and limiter inspired by the classic Fairchild 670.",
    "howItWorks": "Employs variable-mu style tube compression with program-dependent attack and release times.",
    "proTips": "Great on vocals and master bus for vintage glue and warmth.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Bias",
            "unit": "",
            "min": 0.1,
            "max": 100,
            "defaultVal": 70,
            "description": "Bias"
        },
        {
            "index": 2,
            "name": "Makeup Gain",
            "unit": "dB",
            "min": -30,
            "max": 30,
            "defaultVal": 0,
            "description": "Makeup Gain"
        },
        {
            "index": 3,
            "name": "AGC",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 2,
            "description": "0=L/R(Blown), 1=Lat/Vert(Blown), 2=L/R, 3=Lat/Vert"
        },
        {
            "index": 4,
            "name": "Time Constant",
            "unit": "",
            "min": 1,
            "max": 6,
            "defaultVal": 1,
            "description": "Time Constant"
        },
        {
            "index": 5,
            "name": "Level Detector RMS Window",
            "unit": "ms",
            "min": 1,
            "max": 10000,
            "defaultVal": 100,
            "description": "RMS Window"
        },
        {
            "index": 6,
            "name": "Current Compression Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 50,
            "defaultVal": 1,
            "description": "Current Ratio (Readonly)"
        },
        {
            "index": 7,
            "name": "Gain Reduction",
            "unit": "dB",
            "min": -90,
            "max": 0,
            "defaultVal": 0,
            "description": "Gain Reduction (Readonly)"
        }
    ]
},
  {
    "name": "JS: General Dynamics",
    "shortName": "General Dynamics",
    "category": "Dynamics",
    "description": "A highly customizable graphical dynamics processor.",
    "howItWorks": "Allows you to draw your own compression/expansion transfer curve.",
    "proTips": "Draw complex gate, expander, and compressor combinations all in one curve.",
    "sliders": [
        {
            "index": 0,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Detector Input"
        },
        {
            "index": 1,
            "name": "Detector Gain (dB)",
            "unit": "dB",
            "min": -40,
            "max": 40,
            "defaultVal": 0,
            "description": "Detector Gain"
        },
        {
            "index": 2,
            "name": "Detector RMS size (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 0,
            "description": "RMS size"
        },
        {
            "index": 3,
            "name": "Input lookahead (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 0,
            "description": "Lookahead"
        },
        {
            "index": 4,
            "name": "Input Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 200,
            "defaultVal": 5,
            "description": "Input Attack"
        },
        {
            "index": 5,
            "name": "Input Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 250,
            "description": "Input Release"
        },
        {
            "index": 9,
            "name": "Gain Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 200,
            "defaultVal": 0,
            "description": "Gain Attack"
        },
        {
            "index": 10,
            "name": "Gain Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 200,
            "defaultVal": 0,
            "description": "Gain Release"
        },
        {
            "index": 11,
            "name": "Wet Mix (dB)",
            "unit": "dB",
            "min": -150,
            "max": 24,
            "defaultVal": 0,
            "description": "Wet Mix"
        },
        {
            "index": 12,
            "name": "Dry Mix (dB)",
            "unit": "dB",
            "min": -150,
            "max": 24,
            "defaultVal": -150,
            "description": "Dry Mix"
        }
    ]
},
  {
    "name": "JS: LOSER/MGA_JSLimiter",
    "shortName": "MGA JS Limiter",
    "category": "Dynamics",
    "description": "Limits the maximum output volume of an audio signal.",
    "howItWorks": "Uses a lookahead peak detector to apply gain reduction transparently.",
    "proTips": "An excellent safety clipper/limiter for individual tracks before they hit the master.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -30,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 500,
            "defaultVal": 200,
            "description": "Release"
        },
        {
            "index": 2,
            "name": "Ceiling",
            "unit": "dB",
            "min": -6,
            "max": 0,
            "defaultVal": -0.1,
            "description": "Ceiling"
        }
    ]
},
  {
    "name": "JS: LOSER/MasterLimiter",
    "shortName": "Master Limiter",
    "category": "Dynamics",
    "description": "A hard master limiter for peak reduction.",
    "howItWorks": "Clamps the signal down based on lookahead and attack/release envelopes.",
    "proTips": "Use lightly on master bus to catch errant peaks.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -20,
            "max": -0.1,
            "defaultVal": -3,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Look Ahead (us)",
            "unit": "us",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "description": "Look Ahead"
        },
        {
            "index": 2,
            "name": "Attack (us)",
            "unit": "us",
            "min": 0,
            "max": 1000,
            "defaultVal": 100,
            "description": "Attack"
        },
        {
            "index": 3,
            "name": "Hold (ms)",
            "unit": "ms",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "description": "Hold"
        },
        {
            "index": 4,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 250,
            "description": "Release"
        },
        {
            "index": 5,
            "name": "Limit (dB)",
            "unit": "dB",
            "min": -6,
            "max": 0,
            "defaultVal": -0.1,
            "description": "Limit"
        },
        {
            "index": 6,
            "name": "Reduction",
            "unit": "dB",
            "min": -20,
            "max": 0,
            "defaultVal": 0,
            "description": "Reduction (Readonly)"
        }
    ]
},
  {
    "name": "JS: LOSER/MasterTom",
    "shortName": "Master Tom Compressor",
    "category": "Dynamics",
    "description": "Bus compressor for gluing mixes.",
    "howItWorks": "Standard bus compressor features including RMS/Peak modes and sidechains.",
    "proTips": "Set detection to RMS for a smoother, less clinical compression character on the mix buss.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Gain",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain"
        },
        {
            "index": 3,
            "name": "Knee",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 2,
            "description": "Knee"
        },
        {
            "index": 4,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Detector Input"
        },
        {
            "index": 5,
            "name": "Automatic Make-Up",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Automatic Make-Up"
        },
        {
            "index": 6,
            "name": "Detection",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Detection"
        },
        {
            "index": 7,
            "name": "Detection Source",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Detection Source"
        }
    ]
},
  {
    "name": "JS: LOSER/compciter",
    "shortName": "Compciter",
    "category": "Dynamics",
    "description": "A combination compressor and exciter.",
    "howItWorks": "Applies non-linear distortion (excitation) driven by compression envelopes.",
    "proTips": "Great for adding bite and presence to snare drums or dull vocal performances.",
    "sliders": [
        {
            "index": 0,
            "name": "Drive (dB)",
            "unit": "dB",
            "min": 0,
            "max": 60,
            "defaultVal": 0,
            "description": "Drive"
        },
        {
            "index": 1,
            "name": "Distortion (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 25,
            "description": "Distortion"
        },
        {
            "index": 2,
            "name": "Highpass (Hz)",
            "unit": "Hz",
            "min": 800,
            "max": 12000,
            "defaultVal": 5000,
            "description": "Highpass"
        },
        {
            "index": 3,
            "name": "Wet (dB)",
            "unit": "dB",
            "min": -60,
            "max": 24,
            "defaultVal": -6,
            "description": "Wet"
        },
        {
            "index": 4,
            "name": "Dry (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": 0,
            "description": "Dry"
        }
    ]
},
  {
    "name": "JS: LOSER/DDC",
    "shortName": "Digital Drum Compressor",
    "category": "Dynamics",
    "description": "A compressor tailored for digital and electronic drums.",
    "howItWorks": "Optimized attack and hold envelopes to let percussive peaks through before clamping.",
    "proTips": "To get your kick drums absolutely knocking, set a moderate attack (15ms-20ms) so the transient pokes through.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -20,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 0,
            "max": 50,
            "defaultVal": 20,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 500,
            "defaultVal": 20,
            "description": "Attack"
        },
        {
            "index": 3,
            "name": "Hold (ms)",
            "unit": "ms",
            "min": 0,
            "max": 500,
            "defaultVal": 0.5,
            "description": "Hold"
        },
        {
            "index": 4,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "description": "Release"
        },
        {
            "index": 5,
            "name": "RMS Size (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 0,
            "description": "RMS Size"
        },
        {
            "index": 6,
            "name": "Feed",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0,
            "description": "Feed"
        },
        {
            "index": 7,
            "name": "Auto Make-Up",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 1,
            "description": "Auto Make-Up"
        },
        {
            "index": 8,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -120,
            "max": 60,
            "defaultVal": 0,
            "description": "Output"
        },
        {
            "index": 9,
            "name": "Reduction (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Reduction (Readonly)"
        }
    ]
},
  {
    "name": "JS: Liteon/np1136peaklimiter",
    "shortName": "NP1136 Peak Limiter",
    "category": "Dynamics",
    "description": "Program dependent Peak Limiter.",
    "howItWorks": "Uses compressor envelopes and a tilt EQ to shape peaks and frequency balance before limiting.",
    "proTips": "Can also be used as a mastering limiter; just watch the GR Limit carefully.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -40,
            "max": 0,
            "defaultVal": -12,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 4,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Attack (us)",
            "unit": "us",
            "min": 0,
            "max": 100,
            "defaultVal": 30,
            "description": "Attack"
        },
        {
            "index": 3,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 100,
            "defaultVal": 45,
            "description": "Release"
        },
        {
            "index": 4,
            "name": "Detector HP (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Detector HP"
        },
        {
            "index": 5,
            "name": "GR Limit (dB)",
            "unit": "dB",
            "min": -40,
            "max": 0,
            "defaultVal": -18,
            "description": "GR Limit"
        },
        {
            "index": 6,
            "name": "Makeup Gain (dB)",
            "unit": "dB",
            "min": 0,
            "max": 30,
            "defaultVal": 0,
            "description": "Makeup Gain"
        },
        {
            "index": 7,
            "name": "Tilt EQ Center (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Tilt EQ Center"
        },
        {
            "index": 8,
            "name": "Tilt EQ Low/High (dB)",
            "unit": "dB",
            "min": -6,
            "max": 6,
            "defaultVal": 0,
            "description": "Tilt EQ Low/High"
        },
        {
            "index": 9,
            "name": "Wet Mix (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Mix"
        },
        {
            "index": 10,
            "name": "Processing Mode",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Processing Mode (Stereo/Mono)"
        },
        {
            "index": 11,
            "name": "Detector Mode",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 1,
            "description": "Detector Mode"
        },
        {
            "index": 12,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Detector Input"
        },
        {
            "index": 13,
            "name": "Hard Clip",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Hard Clip"
        }
    ]
}
,
  {
    "name": "JS: LOSER/3BandJoiner",
    "shortName": "3-Band Joiner",
    "category": "Routing & Utility",
    "description": "Combines 3 bands back into a single stere/mono signal.",
    "howItWorks": "Sums Low, Mid, and High inputs back together.",
    "proTips": "Use in combination with a 3-Band Splitter.",
    "sliders": [
        {
            "index": 0,
            "name": "Low (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 1,
            "name": "Mid (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Mid Gain"
        },
        {
            "index": 2,
            "name": "High (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Gain"
        }
    ]
},
  {
    "name": "JS: Liteon/3bandpeakfilter",
    "shortName": "3-Band Peak Filter",
    "category": "EQ & Filtering",
    "description": "Multi-band peak filter with saturation.",
    "howItWorks": "Applies peaking filters at three frequencies with adjustable bandwidth, along with HP/LP and saturation.",
    "proTips": "Can be used as a creative coloring EQ.",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Stereo/Mono"
        },
        {
            "index": 1,
            "name": "HP Filter (2-Pole)",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "HP Filter"
        },
        {
            "index": 2,
            "name": "Peak Filter Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "PF-3A/PF-3B"
        },
        {
            "index": 3,
            "name": "Frequency 1",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Frequency 1"
        },
        {
            "index": 4,
            "name": "Bandwidth 1",
            "unit": "",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3,
            "description": "Bandwidth 1"
        },
        {
            "index": 5,
            "name": "Gain 1",
            "unit": "dB",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "description": "Gain 1"
        },
        {
            "index": 6,
            "name": "Frequency 2",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Frequency 2"
        },
        {
            "index": 7,
            "name": "Bandwidth 2",
            "unit": "",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3,
            "description": "Bandwidth 2"
        },
        {
            "index": 8,
            "name": "Gain 2",
            "unit": "dB",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "description": "Gain 2"
        },
        {
            "index": 9,
            "name": "Frequency 3",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Frequency 3"
        },
        {
            "index": 10,
            "name": "Bandwidth 3",
            "unit": "",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3,
            "description": "Bandwidth 3"
        },
        {
            "index": 11,
            "name": "Gain 3",
            "unit": "dB",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "description": "Gain 3"
        },
        {
            "index": 12,
            "name": "LP Filter (2-Pole)",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "LP Filter (2-Pole)"
        },
        {
            "index": 13,
            "name": "Saturation (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Saturation"
        },
        {
            "index": 14,
            "name": "Output",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Output"
        },
        {
            "index": 15,
            "name": "Oversample (x2)",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Oversample"
        }
    ]
},
  {
    "name": "JS: LOSER/3BandSplitter",
    "shortName": "3-Band Splitter",
    "category": "Routing & Utility",
    "description": "Splits input into Low, Mid, and High outputs.",
    "howItWorks": "Uses crossovers to separate bands out to different channels.",
    "proTips": "Build your own multiband FX chain by routing these bands.",
    "sliders": [
        {
            "index": 0,
            "name": "Crossover 1 (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "description": "Crossover 1"
        },
        {
            "index": 1,
            "name": "Crossover 2 (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "description": "Crossover 2"
        }
    ]
},
  {
    "name": "JS: 3x3 EQ",
    "shortName": "3x3 EQ",
    "category": "EQ & Filtering",
    "description": "3-band EQ with variable drive/saturation per band.",
    "howItWorks": "Band-splits the signal and applies dedicated saturation and gain before recombining.",
    "proTips": "Boost drive on the Low band for tape-like bass warmth.",
    "sliders": [
        {
            "index": 0,
            "name": "Low Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Low Drive"
        },
        {
            "index": 1,
            "name": "Low Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 2,
            "name": "Mid Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Mid Drive"
        },
        {
            "index": 3,
            "name": "Mid Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "Mid Gain"
        },
        {
            "index": 4,
            "name": "High Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "High Drive"
        },
        {
            "index": 5,
            "name": "High Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "High Gain"
        },
        {
            "index": 6,
            "name": "Low-Mid Freq (Hz)",
            "unit": "Hz",
            "min": 60,
            "max": 680,
            "defaultVal": 240,
            "description": "Low-Mid Crossover"
        },
        {
            "index": 7,
            "name": "Mid-High Freq (Hz)",
            "unit": "Hz",
            "min": 720,
            "max": 12000,
            "defaultVal": 2400,
            "description": "Mid-High Crossover"
        }
    ]
},
  {
    "name": "JS: LOSER/4BandEQ",
    "shortName": "4-Band EQ",
    "category": "EQ & Filtering",
    "description": "Fixed crossover 4-band EQ.",
    "howItWorks": "Splits ranges into Low, Low-Mid, High-Mid, and High.",
    "proTips": "Fast tone-shaping utility without Q controls getting in the way.",
    "sliders": [
        {
            "index": 0,
            "name": "Low (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 1,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "description": "Low-Mid Crossover"
        },
        {
            "index": 2,
            "name": "Low Mid (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Mid Gain"
        },
        {
            "index": 3,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "description": "Mid Crossover"
        },
        {
            "index": 4,
            "name": "High Mid (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Mid Gain"
        },
        {
            "index": 5,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 5000,
            "description": "High Crossover"
        },
        {
            "index": 6,
            "name": "High (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Gain"
        },
        {
            "index": 7,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Output Gain"
        }
    ]
},
  {
    "name": "JS: LOSER/4BandJoiner",
    "shortName": "4-Band Joiner",
    "category": "Routing & Utility",
    "description": "Combines 4 frequency bands into a single stereo signal.",
    "howItWorks": "Used in conjunction with a 4-Band Splitter.",
    "proTips": "Adjust individual bands at the end of a multiband chain.",
    "sliders": [
        {
            "index": 0,
            "name": "Low (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 1,
            "name": "Mid (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Mid Gain"
        },
        {
            "index": 2,
            "name": "High (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Gain"
        },
        {
            "index": 3,
            "name": "UberHigh (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "UberHigh Gain"
        }
    ]
},
  {
    "name": "JS: LOSER/4BandSplitter",
    "shortName": "4-Band Splitter",
    "category": "Routing & Utility",
    "description": "Splits a signal into 4 distinct frequency bands.",
    "howItWorks": "Routes different crossover ranges to separate output channels.",
    "proTips": "Feed this into independent compressors per-channel.",
    "sliders": [
        {
            "index": 0,
            "name": "Crossover 1 (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "description": "Crossover 1"
        },
        {
            "index": 1,
            "name": "Crossover 2 (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "description": "Crossover 2"
        },
        {
            "index": 2,
            "name": "Crossover 3 (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 5000,
            "description": "Crossover 3"
        }
    ]
},
  {
    "name": "JS: 4x4 EQ",
    "shortName": "4x4 EQ",
    "category": "EQ & Filtering",
    "description": "4-band EQ with variable drive/saturation per band.",
    "howItWorks": "Like 3x3 but with 4 bands.",
    "proTips": "Multiband saturation engine for fine tuning.",
    "sliders": [
        {
            "index": 0,
            "name": "Low Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Low Drive"
        },
        {
            "index": 1,
            "name": "Low Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 2,
            "name": "Mid Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Mid Drive"
        },
        {
            "index": 3,
            "name": "Mid Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "Mid Gain"
        },
        {
            "index": 4,
            "name": "High Drive (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "High Drive"
        },
        {
            "index": 5,
            "name": "High Gain (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "High Gain"
        },
        {
            "index": 6,
            "name": "Low-Mid Crossover (Hz)",
            "unit": "Hz",
            "min": 60,
            "max": 500,
            "defaultVal": 240,
            "description": "Low-Mid Crossover"
        },
        {
            "index": 7,
            "name": "Mid-High Crossover (Hz)",
            "unit": "Hz",
            "min": 510,
            "max": 10000,
            "defaultVal": 2400,
            "description": "Mid-High Crossover"
        }
    ]
},
  {
    "name": "JS: LOSER/50HzKicker",
    "shortName": "50 Hz Kicker",
    "category": "EQ & Filtering",
    "description": "Kick Drum Enhancer generating low fundamentals.",
    "howItWorks": "Tracks amplitude and synthesizes a low sine wave under the kick.",
    "proTips": "Tune to the exact fundamental of the track (e.g., 60Hz) to add massive bottom end to weak kicks.",
    "sliders": [
        {
            "index": 0,
            "name": "Freqency (Hz)",
            "unit": "Hz",
            "min": 10,
            "max": 200,
            "defaultVal": 50,
            "description": "Sub sine frequency"
        },
        {
            "index": 1,
            "name": "Wet (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": -12,
            "description": "Wet Level"
        },
        {
            "index": 2,
            "name": "Dry (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": -3,
            "description": "Dry Level"
        }
    ]
},
  {
    "name": "JS: ADPCM Simulator",
    "shortName": "ADPCM Simulator",
    "category": "Routing & Utility",
    "description": "Encodes/decodes to IMA ADPCM to give it a crunchy, retro sound.",
    "howItWorks": "Simulates early 12-bit/4-bit sampler compression routines.",
    "proTips": "Great for making pristine samples sound like they came from an MPC or SP1200.",
    "sliders": [
        {
            "index": 0,
            "name": "Bits",
            "unit": "",
            "min": 1,
            "max": 4,
            "defaultVal": 4,
            "description": "Bit resolution simulation."
        },
        {
            "index": 1,
            "name": "Block Size",
            "unit": "",
            "min": 2,
            "max": 65538,
            "defaultVal": 4096,
            "description": "ADPCM block size."
        },
        {
            "index": 2,
            "name": "Bit Bias",
            "unit": "",
            "min": 0,
            "max": 7,
            "defaultVal": 0,
            "description": "Bias adjustment."
        },
        {
            "index": 3,
            "name": "Gain (dB)",
            "unit": "dB",
            "min": -60,
            "max": 60,
            "defaultVal": 0,
            "description": "Makeup Gain"
        }
    ]
},
  {
    "name": "JS: Convolution Amp/Cab Modeler",
    "shortName": "Amp/Cab Modeler",
    "category": "Dynamics",
    "description": "An impulse response loader designed for guitar amps and cabinets.",
    "howItWorks": "Loads an impulse response file and convolves the audio.",
    "proTips": "Load a high-quality cab IR to bring DI guitars to life.",
    "sliders": [
        {
            "index": 1,
            "name": "Preamp (dB)",
            "unit": "dB",
            "min": -120,
            "max": 30,
            "defaultVal": 0,
            "description": "Preamp gain level."
        },
        {
            "index": 2,
            "name": "Upsample Impulse",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 2,
            "description": "0=No, 1=Yes (no adj), 2=Yes (correct)"
        },
        {
            "index": 3,
            "name": "Channel Mode",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=L-Stereo, 1=Stereo-Stereo"
        }
    ]
},
  {
    "name": "JS: Amplitude Modulator",
    "shortName": "Amplitude Modulator",
    "category": "Time & Modulation",
    "description": "Classic tremolo/amplitude modulation effect.",
    "howItWorks": "Modulates volume using a simple sine wave at a set frequency.",
    "proTips": "Use high rates for ring-modulator style textures.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 80,
            "max": 1000,
            "defaultVal": 440,
            "description": "Modulation frequency."
        }
    ]
}
,
  {
    "name": "JS: Apple 2-Pole Lowpass Filter",
    "shortName": "2-Pole LP Filter",
    "category": "EQ & Filtering",
    "description": "A standard 2-pole resonant lowpass filter.",
    "howItWorks": "Biquad filter cutting off high frequencies.",
    "proTips": "Classic synth style lowpass.",
    "sliders": [
        {
            "index": 0,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff Frequency"
        },
        {
            "index": 1,
            "name": "Resonance",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Resonance"
        }
    ]
},
  {
    "name": "JS: Apple 12-Pole Filter",
    "shortName": "12-Pole Filter",
    "category": "EQ & Filtering",
    "description": "A steep 12-pole multimode filter.",
    "howItWorks": "Cascaded filters for extremely steep stopbands.",
    "proTips": "Use for surgical electronic music sweeping fx.",
    "sliders": [
        {
            "index": 0,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff Frequency"
        },
        {
            "index": 1,
            "name": "Resonance",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Resonance"
        },
        {
            "index": 2,
            "name": "Filter Type",
            "unit": "",
            "min": -1,
            "max": 1,
            "defaultVal": 0,
            "description": "-1=HP, 0=BP, 1=LP"
        }
    ]
},
  {
    "name": "JS: Auto-Wideness",
    "shortName": "Auto-Wideness",
    "category": "Routing & Utility",
    "description": "Dynamically expands stereo width.",
    "howItWorks": "Analyzes transient material and pushes signal outward to L/R limits.",
    "proTips": "Useful on acoustic guitar buses for widening the stereo spread naturally.",
    "sliders": [
        {
            "index": 0,
            "name": "Attack (ms)",
            "unit": "ms",
            "min": 10,
            "max": 2000,
            "defaultVal": 500,
            "description": "Attack Time"
        },
        {
            "index": 1,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 10,
            "max": 2000,
            "defaultVal": 500,
            "description": "Release Time"
        }
    ]
},
  {
    "name": "JS: Bad Buss Mojo Waveshaper",
    "shortName": "Bad Buss Mojo",
    "category": "Dynamics",
    "description": "A non-linear waveshaping distortion effect.",
    "howItWorks": "Adds harmonic distortion by warping the amplitude transfer curve.",
    "proTips": "Can add a dangerous, driven character to a parallel drum bus.",
    "sliders": [
        {
            "index": 0,
            "name": "Drive",
            "unit": "dB",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "description": "Drive"
        },
        {
            "index": 1,
            "name": "Distortion",
            "unit": "",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "description": "Distortion"
        },
        {
            "index": 2,
            "name": "Bottom",
            "unit": "",
            "min": -1,
            "max": 1,
            "defaultVal": 1,
            "description": "Bottom Curve Bias"
        },
        {
            "index": 3,
            "name": "Mute when stopped",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Off/On"
        }
    ]
},
  {
    "name": "JS: Bass Manager/Booster",
    "shortName": "Bass Manager",
    "category": "EQ & Filtering",
    "description": "Sub-harmonic enhancer.",
    "howItWorks": "Boosts specific target frequencies below a threshold crossover.",
    "proTips": "Great for enriching thin synth bass.",
    "sliders": [
        {
            "index": 0,
            "name": "Bass Boost (%)",
            "unit": "%",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "description": "Boost Percentage"
        },
        {
            "index": 1,
            "name": "Cutoff Crossover (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 120,
            "defaultVal": 60,
            "description": "Cutoff Crossover"
        },
        {
            "index": 2,
            "name": "Boost type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Flat, 1=Sub"
        }
    ]
},
  {
    "name": "JS: Butterworth 4-Pole Filter",
    "shortName": "Butterworth Filter",
    "category": "EQ & Filtering",
    "description": "A smooth maximally flat Butterworth filter.",
    "howItWorks": "Clean, uncolored filter without rippling.",
    "proTips": "Use for general highpass/lowpass duties where phase artifacts must be minimized.",
    "sliders": [
        {
            "index": 0,
            "name": "Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Lowpass, 1=Highpass"
        },
        {
            "index": 1,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff Frequency"
        }
    ]
},
  {
    "name": "JS: Stereo Channel Volume/Pan/Polarity Control",
    "shortName": "Stereo Channel Control",
    "category": "Routing & Utility",
    "description": "Independent left/right channel strip control.",
    "howItWorks": "Allows you to pan, volume stage, or flip phase completely independently for L/R.",
    "proTips": "Perfect for fixing poorly recorded or lopsided stereo samples.",
    "sliders": [
        {
            "index": 0,
            "name": "Left Volume (dB)",
            "unit": "dB",
            "min": -120,
            "max": 24,
            "defaultVal": 0,
            "description": "Left Volume"
        },
        {
            "index": 1,
            "name": "Left Pan (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Left Pan"
        },
        {
            "index": 2,
            "name": "Left Polarity",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Normal, 1=Inverted"
        },
        {
            "index": 3,
            "name": "Right Volume (dB)",
            "unit": "dB",
            "min": -120,
            "max": 24,
            "defaultVal": 0,
            "description": "Right Volume"
        },
        {
            "index": 4,
            "name": "Right Pan (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 100,
            "description": "Right Pan"
        },
        {
            "index": 5,
            "name": "Right Polarity",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Normal, 1=Inverted"
        }
    ]
},
  {
    "name": "JS: Chebyshev 4-Pole Filter",
    "shortName": "Chebyshev Filter",
    "category": "EQ & Filtering",
    "description": "Steep 4-pole filter with adjustable ripple.",
    "howItWorks": "Uses Chebyshev polynomial designs for steeper rolloff at the expense of passband ripple.",
    "proTips": "Very colorful filter ideal for synth design.",
    "sliders": [
        {
            "index": 0,
            "name": "Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Lowpass, 1=Highpass"
        },
        {
            "index": 1,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff Frequency"
        },
        {
            "index": 2,
            "name": "Ripple (dB)",
            "unit": "dB",
            "min": 0.1,
            "max": 10,
            "defaultVal": 1,
            "description": "Passband Ripple"
        }
    ]
}
,
  {
    "name": "JS: Downward Expander",
    "shortName": "Downward Expander",
    "category": "Dynamics",
    "description": "An expander to increase dynamic range by reducing sounds below the threshold.",
    "howItWorks": "Ducks the gain with configurable attack/release times when signal is quiet.",
    "proTips": "Use for removing drum bleed naturally without fully clamping like a gate.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Output Gain"
        },
        {
            "index": 3,
            "name": "Attack (uS)",
            "unit": "us",
            "min": 20,
            "max": 2000,
            "defaultVal": 20,
            "description": "Attack Time"
        },
        {
            "index": 4,
            "name": "Release (mS)",
            "unit": "ms",
            "min": 20,
            "max": 2000,
            "defaultVal": 250,
            "description": "Release Time"
        },
        {
            "index": 5,
            "name": "Knee",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 2,
            "description": "Hard/Soft Knee"
        },
        {
            "index": 6,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Normal/Sidechain"
        },
        {
            "index": 8,
            "name": "Detection",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Peak/RMS"
        }
    ]
},
  {
    "name": "JS: Express Bus Compressor",
    "shortName": "Express Bus Comp",
    "category": "Dynamics",
    "description": "A fast, aggressive VCA style stereo bus compressor.",
    "howItWorks": "Highly responsive solid-state modeled compressor.",
    "proTips": "Classic 'SSL style' bus glue. Use on the drum bus to make it smack.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Makeup Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Makeup Gain"
        },
        {
            "index": 3,
            "name": "Attack (uS)",
            "unit": "us",
            "min": 20,
            "max": 2000,
            "defaultVal": 20,
            "description": "Attack (uS)"
        },
        {
            "index": 4,
            "name": "Release (mS)",
            "unit": "ms",
            "min": 20,
            "max": 1000,
            "defaultVal": 250,
            "description": "Release (ms)"
        },
        {
            "index": 5,
            "name": "Knee",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 0,
            "description": "Knee"
        },
        {
            "index": 6,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Normal/Sidechain"
        },
        {
            "index": 7,
            "name": "Automatic Make-Up",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 1,
            "description": "On/Off"
        },
        {
            "index": 8,
            "name": "Detector Routing",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Feedback/Feedforward"
        },
        {
            "index": 9,
            "name": "Detection Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Peak/RMS"
        }
    ]
},
  {
    "name": "JS: Flanger",
    "shortName": "Flanger",
    "category": "Time & Modulation",
    "description": "Comb-filtering sweep modulation.",
    "howItWorks": "Mixes a closely delayed signal modulated by an LFO with the dry signal.",
    "proTips": "Instant 80s jet plane effect.",
    "sliders": [
        {
            "index": 0,
            "name": "Delay (ms)",
            "unit": "ms",
            "min": 0,
            "max": 200,
            "defaultVal": 0,
            "description": "Delay"
        },
        {
            "index": 1,
            "name": "Wet (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Mix"
        },
        {
            "index": 2,
            "name": "Dry (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Dry Mix"
        },
        {
            "index": 3,
            "name": "Rate (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 20,
            "defaultVal": 0.2,
            "description": "Modulation Rate"
        },
        {
            "index": 4,
            "name": "Pitch Fudge Factor",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0.5,
            "description": "Depth"
        }
    ]
},
  {
    "name": "JS: Delay (Floaty)",
    "shortName": "Floaty Delay",
    "category": "Time & Modulation",
    "description": "A digital delay with modulated echo points.",
    "howItWorks": "Applies a chorus LFO to the delay buffer.",
    "proTips": "Beautiful for dreamy vocal echoes.",
    "sliders": [
        {
            "index": 0,
            "name": "Delay (ms)",
            "unit": "ms",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "description": "Delay Length"
        },
        {
            "index": 1,
            "name": "Wet (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Mix"
        },
        {
            "index": 2,
            "name": "Dry (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Dry Mix"
        },
        {
            "index": 3,
            "name": "Modulation Rate (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 20,
            "defaultVal": 0.2,
            "description": "LFO Rate"
        },
        {
            "index": 4,
            "name": "Pitch Fudge Factor",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0.5,
            "description": "Depth"
        }
    ]
},
  {
    "name": "JS: LOSER/RBJ_HighpassLowpass",
    "shortName": "RBJ HP/LP Filters",
    "category": "EQ & Filtering",
    "description": "Classic Biquad HP/LP filters.",
    "howItWorks": "Robert Bristow-Johnson biquad filter implementations.",
    "proTips": "Super stable low CPU sweeping filter.",
    "sliders": [
        {
            "index": 0,
            "name": "Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Highpass, 1=Lowpass"
        },
        {
            "index": 1,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 20000,
            "description": "Cutoff"
        },
        {
            "index": 2,
            "name": "Q",
            "unit": "",
            "min": 0.1,
            "max": 10,
            "defaultVal": 1,
            "description": "Resonance"
        },
        {
            "index": 3,
            "name": "Wet (dB)",
            "unit": "dB",
            "min": -120,
            "max": 24,
            "defaultVal": 0,
            "description": "Wet Mix"
        },
        {
            "index": 4,
            "name": "Dry (dB)",
            "unit": "dB",
            "min": -120,
            "max": 24,
            "defaultVal": -120,
            "description": "Dry Mix"
        }
    ]
},
  {
    "name": "JS: Huge Booty Bass Enhancer",
    "shortName": "Huge Booty",
    "category": "EQ & Filtering",
    "description": "A specialized bass exciter/saturator.",
    "howItWorks": "Creates harmonic distortion focused purely on low end frequencies.",
    "proTips": "Add to sub bass channels to make them audible on small speakers/phones.",
    sliders: [
      {"index":0,"name":"Mix","min":0,"max":100,"defaultVal":0,"unit":"%"},
      {"index":1,"name":"Drive","min":0,"max":100,"defaultVal":0,"unit":"%"},
      {"index":2,"name":"Frequency","min":20,"max":200,"defaultVal":100,"unit":"Hz"}
    ]
},
  {
    "name": "JS: LOSER/PresenceEQ",
    "shortName": "Presence EQ",
    "category": "EQ & Filtering",
    "description": "A wide high-frequency enhancer.",
    "howItWorks": "Applies a broad, musical bell boost at the specified center frequency.",
    "proTips": "Boost presence centered at 5kHz to help vocals cut through a dense rock mix effortlessly.",
    "sliders": [
        {
            "index": 0,
            "name": "Presence",
            "unit": "dB",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "description": "Presence Boost"
        },
        {
            "index": 1,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 100,
            "max": 8000,
            "defaultVal": 2000,
            "description": "Center Frequency"
        },
        {
            "index": 2,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Output Offset"
        }
    ]
},
  {
    "name": "JS: Simple Peak-1 Limiter",
    "shortName": "Simple Limiter",
    "category": "Dynamics",
    "description": "An extremely minimal peak limiter without lookahead.",
    "howItWorks": "Basic diode-style chopping.",
    "proTips": "Good for extremely fast, colorful chopping where transient preservation isn't required.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -3,
            "description": "Limiting Threshold"
        },
        {
            "index": 1,
            "name": "Release (mS)",
            "unit": "ms",
            "min": 0.1,
            "max": 500,
            "defaultVal": 100,
            "description": "Release"
        }
    ]
}
,
  {
    "name": "JS: Ring Modulator",
    "shortName": "Ring Mod",
    "category": "Time & Modulation",
    "description": "Classic experimental ring modulation.",
    "howItWorks": "Multiplies your signal by a sine wave carrier oscillator to produce sum and difference frequencies.",
    "proTips": "Instantly create robotic, dissonant, metallic vocal effects like Daleks.",
    "sliders": [
        {
            "index": 0,
            "name": "Modulator Frequency (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 4000,
            "defaultVal": 440,
            "description": "Carrier Wave Freq"
        },
        {
            "index": 1,
            "name": "Wet (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Mix"
        },
        {
            "index": 2,
            "name": "Dry (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Dry Mix"
        }
    ]
},
  {
    "name": "JS: LOSER/Saturation",
    "shortName": "Saturation",
    "category": "Dynamics",
    "description": "A fast, single-slider saturation circuit.",
    "howItWorks": "Applies soft clipping rounding to audio wave peaks.",
    "proTips": "Crank the amount to glue bass line dynamics or shave off aggressive transients on drums.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Saturation Drive"
        }
    ]
},
  {
    "name": "JS: State Variable Morphing Filter",
    "shortName": "SVF Morphing Filter",
    "category": "EQ & Filtering",
    "description": "Continuously morphable state-variable filter.",
    "howItWorks": "Combines LP, BP, and HP outputs from an SVF algorithm, letting you interpolate between them.",
    "proTips": "Automate the Filter Type slider during buildups for creative DJ-style DJ filter sweeps.",
    "sliders": [
        {
            "index": 0,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff Freq"
        },
        {
            "index": 1,
            "name": "Resonance",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Resonance"
        },
        {
            "index": 2,
            "name": "Filter Type",
            "unit": "",
            "min": -1,
            "max": 1,
            "defaultVal": 0,
            "description": "-1=HP, 0=BP, 1=LP"
        }
    ]
},
  {
    "name": "JS: Shelving Filter",
    "shortName": "Shelving Filter",
    "category": "EQ & Filtering",
    "description": "A simple Baxandall style 2-band shelf equalizer.",
    "howItWorks": "Provides gentle, broad-stroke boosts or cuts at the extreme ends of the frequency spectrum.",
    "proTips": "Boost the high shelf slightly at 5kHz-8kHz for expensive-sounding vocal air.",
    "sliders": [
        {
            "index": 0,
            "name": "Low Shelf (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Shelf Gain"
        },
        {
            "index": 1,
            "name": "Low Frequency",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "description": "Low Frequency"
        },
        {
            "index": 2,
            "name": "High Shelf (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Shelf Gain"
        },
        {
            "index": 3,
            "name": "High Frequency",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "description": "High Frequency"
        }
    ]
},
  {
    "name": "JS: Simple 1-Pole Filter",
    "shortName": "1-Pole Filter",
    "category": "EQ & Filtering",
    "description": "A very gentle 6dB/octave highpass or lowpass.",
    "howItWorks": "Basic one-zero digital filter architecture.",
    "proTips": "Excellent for gently rolling off muddy subs on guitars without introducing phase shift.",
    "sliders": [
        {
            "index": 0,
            "name": "Type",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "0=Lowpass, 1=Highpass"
        },
        {
            "index": 1,
            "name": "Cutoff (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 22000,
            "defaultVal": 1000,
            "description": "Cutoff"
        }
    ]
},
  {
    "name": "JS: Soft Clipper/Limiter",
    "shortName": "Soft Clipper",
    "category": "Dynamics",
    "description": "Smooth peak rounding before a hard limit.",
    "howItWorks": "Applies a saturation curve to transients just before they hit digital 0.",
    "proTips": "A great safety utility for tracks prone to jumping out of the mix occasionally.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -3,
            "description": "Threshold"
        }
    ]
},
  {
    "name": "JS: Time Adjustment Delay",
    "shortName": "Time Adjustment",
    "category": "Routing & Utility",
    "description": "Delay tracks accurately down to the sample.",
    "howItWorks": "Shifts the track in the time domain, compensating via PDC.",
    "proTips": "Use for manual track phase alignment when layering multitrack drums.",
    "sliders": [
        {
            "index": 0,
            "name": "Delay Amount (ms)",
            "unit": "ms",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Time Shift"
        },
        {
            "index": 1,
            "name": "Wet Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Wet Level"
        }
    ]
},
  {
    "name": "JS: Tremolo",
    "shortName": "Tremolo",
    "category": "Time & Modulation",
    "description": "Classic volume ducking LFO.",
    "howItWorks": "Modulates the amplitude of the signal according to an internal oscillator.",
    "proTips": "Sync up tremolo rates to the song tempo for rhythmic motion on e-pianos.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 0,
            "max": 20,
            "defaultVal": 2,
            "description": "LFO Rate"
        },
        {
            "index": 1,
            "name": "Amount (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -6,
            "description": "Depth of Tremolo"
        }
    ]
},
  {
    "name": "JS: Upward Expander",
    "shortName": "Upward Expander",
    "category": "Dynamics",
    "description": "Increases gain when signals cross a threshold.",
    "howItWorks": "Instead of ducking, the volume scales up dynamically.",
    "proTips": "Bring out transients and attack on very heavily compressed material.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "description": "Expander Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Expansion Ratio"
        },
        {
            "index": 2,
            "name": "Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Output Makeup"
        }
    ]
},
  {
    "name": "JS: Zero Crossing Maximizer",
    "shortName": "Zero X Maximizer",
    "category": "Dynamics",
    "description": "Reduces volume spikes specifically crossing zero boundaries.",
    "howItWorks": "Clips or limits audio only effectively when looking at zero crossing phases.",
    "proTips": "Can tame extremely jagged waveforms (like bad synths) prior to EQing.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -20,
            "max": 0,
            "defaultVal": -1,
            "description": "Maximizer Threshold"
        }
    ]
}
,
  {
    "name": "JS: LOSER/gate",
    "shortName": "LOSER Gate",
    "category": "Dynamics",
    "description": "A fast noise gate.",
    "howItWorks": "Mutes the signal when it falls below a set threshold.",
    "proTips": "Use to cut out mic bleed between tom hits on a drum kit.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -18,
            "description": "Gate Threshold"
        },
        {
            "index": 1,
            "name": "Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 100,
            "defaultVal": 1,
            "description": "Attack Time"
        },
        {
            "index": 2,
            "name": "Hold (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 5,
            "description": "Hold Time"
        },
        {
            "index": 3,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "description": "Release Time"
        }
    ]
},
  {
    "name": "JS: Multi-Band Compressor",
    "shortName": "Multiband Comp",
    "category": "Dynamics",
    "description": "A 4-band stereo multiband compressor.",
    "howItWorks": "Splits incoming signal into four bands using crossovers and compresses each band individually.",
    "proTips": "Great for re-balancing a master bus or taming extreme resonances in slap bass.",
    "sliders": [
        {
            "index": 0,
            "name": "Band 1 Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold 1"
        },
        {
            "index": 1,
            "name": "Band 1 Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio 1"
        },
        {
            "index": 2,
            "name": "Band 1 Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain 1"
        },
        {
            "index": 3,
            "name": "Band 2 Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold 2"
        },
        {
            "index": 4,
            "name": "Band 2 Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio 2"
        },
        {
            "index": 5,
            "name": "Band 2 Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain 2"
        },
        {
            "index": 6,
            "name": "Band 3 Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold 3"
        },
        {
            "index": 7,
            "name": "Band 3 Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio 3"
        },
        {
            "index": 8,
            "name": "Band 3 Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain 3"
        },
        {
            "index": 9,
            "name": "Band 4 Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold 4"
        },
        {
            "index": 10,
            "name": "Band 4 Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Ratio 4"
        },
        {
            "index": 11,
            "name": "Band 4 Gain (dB)",
            "unit": "dB",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "description": "Gain 4"
        },
        {
            "index": 12,
            "name": "Crossover 1 (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 4000,
            "defaultVal": 200,
            "description": "Crossover 1"
        },
        {
            "index": 13,
            "name": "Crossover 2 (Hz)",
            "unit": "Hz",
            "min": 200,
            "max": 8000,
            "defaultVal": 2000,
            "description": "Crossover 2"
        },
        {
            "index": 14,
            "name": "Crossover 3 (Hz)",
            "unit": "Hz",
            "min": 500,
            "max": 22000,
            "defaultVal": 5000,
            "description": "Crossover 3"
        }
    ]
},
  {
    "name": "JS: 5-Band Compressor",
    "shortName": "5-Band Comp",
    "category": "Dynamics",
    "description": "A 5-band stereo multiband compressor.",
    "howItWorks": "Splits incoming signal into five bands using crossovers and compresses each band individually.",
    "proTips": "Extremely surgical dynamics control for mastering.",
    "sliders": [
        {
            "index": 0,
            "name": "Band 1 Tresh/Ratio",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Treshold/Ratio Combo 1"
        }
    ]
},
  {
    "name": "JS: 3-Band Compressor",
    "shortName": "3-Band Comp",
    "category": "Dynamics",
    "description": "A 3-band stereo multiband compressor.",
    "howItWorks": "Splits incoming signal into three bands using crossovers and compresses each band individually.",
    "proTips": "A simpler multiband processor for de-essing (focus on high mid band).",
    "sliders": [
        {
            "index": 0,
            "name": "Low Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Low Threshold"
        },
        {
            "index": 1,
            "name": "Low Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Low Ratio"
        },
        {
            "index": 2,
            "name": "Mid Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Mid Threshold"
        },
        {
            "index": 3,
            "name": "Mid Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "Mid Ratio"
        },
        {
            "index": 4,
            "name": "High Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "High Threshold"
        },
        {
            "index": 5,
            "name": "High Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1,
            "description": "High Ratio"
        }
    ]
},
  {
    "name": "JS: Expander / Gate",
    "shortName": "Expander/Gate",
    "category": "Dynamics",
    "description": "A standard noise gate and downward expander.",
    "howItWorks": "Attenuates signal below the threshold point.",
    "proTips": "Very useful for reducing background noise in narration or podcast recordings.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "description": "Gate Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 10,
            "defaultVal": 1,
            "description": "Expander Ratio"
        },
        {
            "index": 2,
            "name": "Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 100,
            "defaultVal": 1,
            "description": "Attack"
        },
        {
            "index": 3,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "description": "Release"
        }
    ]
}
,
  {
    "name": "JS: 3-Band EQ",
    "shortName": "3-Band EQ",
    "category": "EQ & Filtering",
    "description": "A standard 3-band sweepable EQ.",
    "howItWorks": "Has low, mid, and high bands with adjustable crossovers.",
    "proTips": "Classic tonal shaping.",
    "sliders": [
        {
            "index": 0,
            "name": "Low (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Band Gain"
        },
        {
            "index": 1,
            "name": "Mid (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Mid Band Gain"
        },
        {
            "index": 2,
            "name": "High (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Band Gain"
        },
        {
            "index": 3,
            "name": "Low-Mid Crossover (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 2000,
            "defaultVal": 200,
            "description": "Low-Mid Crossover"
        },
        {
            "index": 4,
            "name": "Mid-High Crossover (Hz)",
            "unit": "Hz",
            "min": 500,
            "max": 20000,
            "defaultVal": 2000,
            "description": "Mid-High Crossover"
        }
    ]
},
  {
    "name": "JS: 5-Band Stereo EQ",
    "shortName": "5-Band EQ",
    "category": "EQ & Filtering",
    "description": "A 5-band fixed-crossover stereo equalizer.",
    "howItWorks": "Boosts or cuts five specific frequency buckets.",
    "proTips": "Fast tone adjustments.",
    "sliders": [
        {
            "index": 0,
            "name": "Band 1 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 1 Gain"
        },
        {
            "index": 1,
            "name": "Band 2 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 2 Gain"
        },
        {
            "index": 2,
            "name": "Band 3 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 3 Gain"
        },
        {
            "index": 3,
            "name": "Band 4 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 4 Gain"
        },
        {
            "index": 4,
            "name": "Band 5 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 5 Gain"
        }
    ]
},
  {
    "name": "JS: Bandpass Filter",
    "shortName": "Bandpass Filter",
    "category": "EQ & Filtering",
    "description": "A resonant bandpass filter.",
    "howItWorks": "Allows only a certain frequency range to pass through, suppressing highs and lows.",
    "proTips": "Great for telephone or vintage radio vocal effects.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 20000,
            "defaultVal": 1000,
            "description": "Center Frequency"
        },
        {
            "index": 1,
            "name": "Bandwidth (Octaves)",
            "unit": "oct",
            "min": 0.1,
            "max": 4,
            "defaultVal": 1,
            "description": "Bandwidth"
        }
    ]
},
  {
    "name": "JS: Exciter",
    "shortName": "Exciter",
    "category": "EQ & Filtering",
    "description": "A harmonic exciter.",
    "howItWorks": "Adds synthesized high-frequency harmonics driven by the input signal.",
    "proTips": "Brightens up dull acoustic guitars or snare drums without just turning up an EQ.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 1000,
            "max": 10000,
            "defaultVal": 3000,
            "description": "Excitation Frequency Focus"
        },
        {
            "index": 1,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 20,
            "description": "Harmonic Generation Amount"
        }
    ]
},
  {
    "name": "JS: LOSER/BasiQ",
    "shortName": "BasiQ",
    "category": "EQ & Filtering",
    "description": "A very basic three-band EQ with fixed frequencies.",
    "howItWorks": "Treble, Mid, and Bass controls formatted like an old guitar amp tone stack.",
    "proTips": "When you just need to knock off some treble fast, reach for this.",
    "sliders": [
        {
            "index": 0,
            "name": "Bass",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Freq Boost/Cut"
        },
        {
            "index": 1,
            "name": "Mid",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Mid Freq Boost/Cut"
        },
        {
            "index": 2,
            "name": "Treble",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Freq Boost/Cut"
        }
    ]
},
  {
    "name": "JS: RBJ 1073 EQ",
    "shortName": "RBJ 1073 EQ",
    "category": "EQ & Filtering",
    "description": "An EQ mimicking the curves and band layouts of a classic Neve 1073.",
    "howItWorks": "Features a high shelf, mid bell, low shelf, and a highpass filter.",
    "proTips": "This EQ design is famous for a reason. Boost the high shelf and cut the highpass for instant clarity.",
    "sliders": [
        {
            "index": 0,
            "name": "High Shelf (Hz)",
            "unit": "Hz",
            "min": 1000,
            "max": 16000,
            "defaultVal": 12000,
            "description": "High Shelf Frequency"
        },
        {
            "index": 1,
            "name": "High Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Shelf Boost/Cut"
        },
        {
            "index": 2,
            "name": "Mid Freq (Hz)",
            "unit": "Hz",
            "min": 360,
            "max": 7200,
            "defaultVal": 1000,
            "description": "Mid Bell Frequency"
        },
        {
            "index": 3,
            "name": "Mid Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Mid Bell Boost/Cut"
        },
        {
            "index": 4,
            "name": "Low Shelf (Hz)",
            "unit": "Hz",
            "min": 35,
            "max": 220,
            "defaultVal": 60,
            "description": "Low Shelf Frequency"
        },
        {
            "index": 5,
            "name": "Low Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Shelf Boost/Cut"
        },
        {
            "index": 6,
            "name": "Highpass (Hz)",
            "unit": "Hz",
            "min": 50,
            "max": 300,
            "defaultVal": 50,
            "description": "Highpass Cutoff"
        }
    ]
},
  {
    "name": "JS: RBJ 4-Band Semi-Parametric EQ",
    "shortName": "4-Band Parametric",
    "category": "EQ & Filtering",
    "description": "A highly flexible 4-band parametric equalizer.",
    "howItWorks": "Low shelf, two mid bells, and a high shelf, using RBJ biquad formulas.",
    "proTips": "Your go-to surgical EQ for tracking and mixing.",
    "sliders": [
        {
            "index": 0,
            "name": "Low Freq (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 1000,
            "defaultVal": 100,
            "description": "Low Freq"
        },
        {
            "index": 1,
            "name": "Low Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Gain"
        },
        {
            "index": 2,
            "name": "Low Mid Freq (Hz)",
            "unit": "Hz",
            "min": 100,
            "max": 4000,
            "defaultVal": 400,
            "description": "Low Mid Freq"
        },
        {
            "index": 3,
            "name": "Low Mid Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Low Mid Gain"
        },
        {
            "index": 4,
            "name": "Low Mid Q",
            "unit": "",
            "min": 0.1,
            "max": 10,
            "defaultVal": 0.707,
            "description": "Low Mid Q"
        },
        {
            "index": 5,
            "name": "High Mid Freq (Hz)",
            "unit": "Hz",
            "min": 400,
            "max": 10000,
            "defaultVal": 2000,
            "description": "High Mid Freq"
        },
        {
            "index": 6,
            "name": "High Mid Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Mid Gain"
        },
        {
            "index": 7,
            "name": "High Mid Q",
            "unit": "",
            "min": 0.1,
            "max": 10,
            "defaultVal": 0.707,
            "description": "High Mid Q"
        },
        {
            "index": 8,
            "name": "High Freq (Hz)",
            "unit": "Hz",
            "min": 1000,
            "max": 20000,
            "defaultVal": 6000,
            "description": "High Freq"
        },
        {
            "index": 9,
            "name": "High Gain (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "High Gain"
        }
    ]
},
  {
    "name": "JS: Graphic EQ",
    "shortName": "Graphic EQ",
    "category": "EQ & Filtering",
    "description": "A classic multi-band graphic equalizer.",
    "howItWorks": "Provides fixed-frequency boost/cut sliders across the spectrum.",
    "proTips": "Great for knocking out standing waves or feedback frequencies on live gig recordings.",
    "sliders": [
        {
            "index": 0,
            "name": "Band 1 (Hz)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 1"
        },
        {
            "index": 1,
            "name": "Band 2 (Hz)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 2"
        },
        {
            "index": 2,
            "name": "Band 3 (Hz)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 3"
        },
        {
            "index": 3,
            "name": "Band 4 (Hz)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Band 4"
        }
    ]
}
,
  {
    "name": "JS: Chorus (Stereo)",
    "shortName": "Stereo Chorus",
    "category": "Time & Modulation",
    "description": "A wide true stereo chorus.",
    "howItWorks": "Applies dual delay lines modulated out of phase to left and right channels.",
    "proTips": "Beautiful for widening electric pianos and synths.",
    "sliders": [
        {
            "index": 0,
            "name": "Length (ms)",
            "unit": "ms",
            "min": 1,
            "max": 200,
            "defaultVal": 15,
            "description": "Chorus Delay Length"
        },
        {
            "index": 1,
            "name": "Rate (Hz)",
            "unit": "Hz",
            "min": 0.1,
            "max": 10,
            "defaultVal": 1,
            "description": "LFO Speed"
        },
        {
            "index": 2,
            "name": "Depth",
            "unit": "",
            "min": 0,
            "max": 10,
            "defaultVal": 2,
            "description": "Modulation Depth"
        },
        {
            "index": 3,
            "name": "Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Wet/Dry Blend"
        }
    ]
},
  {
    "name": "JS: Phaser",
    "shortName": "Phaser",
    "category": "Time & Modulation",
    "description": "Classic analog style phaser.",
    "howItWorks": "Uses a series of all-pass filters modulated by an LFO to create moving comb filter notches.",
    "proTips": "Add to a flat synth pad to give it motion and interest.",
    "sliders": [
        {
            "index": 0,
            "name": "Rate (Hz)",
            "unit": "Hz",
            "min": 0.1,
            "max": 10,
            "defaultVal": 0.5,
            "description": "Sweep Rate"
        },
        {
            "index": 1,
            "name": "Depth",
            "unit": "",
            "min": 0,
            "max": 10,
            "defaultVal": 5,
            "description": "Sweep Depth"
        },
        {
            "index": 2,
            "name": "Feedback",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 30,
            "description": "Resonance Feedback"
        },
        {
            "index": 3,
            "name": "Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Wet/Dry Blend"
        }
    ]
},
  {
    "name": "JS: Delay w/ Tempo Ping-Pong",
    "shortName": "Ping-Pong Delay",
    "category": "Time & Modulation",
    "description": "A tempo-synced delay that bounces between the left and right speakers.",
    "howItWorks": "Crossfeeds delayed signals from L to R and R to L alternately.",
    "proTips": "Super fun on lead synths or transitional vocal effects.",
    "sliders": [
        {
            "index": 0,
            "name": "Beat Sync",
            "unit": "beats",
            "min": 0.125,
            "max": 4,
            "defaultVal": 1,
            "description": "Sync to Host Tempo"
        },
        {
            "index": 1,
            "name": "Feedback",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 30,
            "description": "Delay Trails"
        },
        {
            "index": 2,
            "name": "Width",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Stereo Width"
        },
        {
            "index": 3,
            "name": "Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Wet/Dry Blend"
        }
    ]
},
  {
    "name": "JS: Reverb",
    "shortName": "Reverb",
    "category": "Time & Modulation",
    "description": "An algorithmic Schroeder reverb.",
    "howItWorks": "Uses a network of comb and all-pass filters to simulate acoustic reflection spaces.",
    "proTips": "Very CPU efficient. Use for adding a fast splash of room to a dry drum recording.",
    "sliders": [
        {
            "index": 0,
            "name": "Room Size",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Size of the simulated room"
        },
        {
            "index": 1,
            "name": "Damping",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "High frequency absorption"
        },
        {
            "index": 2,
            "name": "Width",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Stereo spread"
        },
        {
            "index": 3,
            "name": "Dry (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Dry level"
        },
        {
            "index": 4,
            "name": "Wet (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": -6,
            "description": "Reverb level"
        }
    ]
},
  {
    "name": "JS: Delay (L/R)",
    "shortName": "Dual Delay",
    "category": "Time & Modulation",
    "description": "Independent delay lines for the left and right channels.",
    "howItWorks": "Split routing delay buffers for true stereo processing.",
    "proTips": "Set Left to 1/8 note and Right to a dotted 1/8 note for a huge rhythmic wall of echoes.",
    "sliders": [
        {
            "index": 0,
            "name": "Left Delay (ms)",
            "unit": "ms",
            "min": 0,
            "max": 2000,
            "defaultVal": 300,
            "description": "Left Time"
        },
        {
            "index": 1,
            "name": "Right Delay (ms)",
            "unit": "ms",
            "min": 0,
            "max": 2000,
            "defaultVal": 300,
            "description": "Right Time"
        },
        {
            "index": 2,
            "name": "Feedback",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 30,
            "description": "Feedback amount for both"
        },
        {
            "index": 3,
            "name": "Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Wet/Dry Blend"
        }
    ]
}
,
  {
    "name": "JS: Distortion",
    "shortName": "Distortion",
    "category": "Guitar & Amp",
    "description": "A hard-clipping distortion pedal.",
    "howItWorks": "Drives the gain into a hard clip threshold to create aggressive squared-off waveforms.",
    "proTips": "Great for thrash metal guitars or destroying a drum loop.",
    "sliders": [
        {
            "index": 0,
            "name": "Gain",
            "unit": "dB",
            "min": 0,
            "max": 60,
            "defaultVal": 30,
            "description": "Drive Amount"
        },
        {
            "index": 1,
            "name": "Tone",
            "unit": "Hz",
            "min": 200,
            "max": 10000,
            "defaultVal": 3000,
            "description": "Treble Cutoff"
        },
        {
            "index": 2,
            "name": "Volume (dB)",
            "unit": "dB",
            "min": -60,
            "max": 12,
            "defaultVal": -12,
            "description": "Output Makeup Gain"
        }
    ]
},
  {
    "name": "JS: Tube Harmonics",
    "shortName": "Tube Harmonics",
    "category": "Guitar & Amp",
    "description": "Vacuum tube saturation emulator.",
    "howItWorks": "Adds mostly even-order harmonics modeling pentode/triode tubes.",
    "proTips": "Warm up sterile DI bass by rolling on some tube harmonics.",
    "sliders": [
        {
            "index": 0,
            "name": "Drive",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Tube Saturation Drive"
        },
        {
            "index": 1,
            "name": "Even/Odd Ratio",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Harmonic Content Selection"
        },
        {
            "index": 2,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Volume"
        }
    ]
},
  {
    "name": "JS: Wah-Wah",
    "shortName": "Wah-Wah",
    "category": "Guitar & Amp",
    "description": "A resonant bandpass filter sweep pedal.",
    "howItWorks": "Animates the center frequency of a high-Q resonant filter.",
    "proTips": "Automate the Position slider with an envelope follower or expression pedal for classic funk guitars.",
    "sliders": [
        {
            "index": 0,
            "name": "Position",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Filter Sweep (Heel to Toe)"
        },
        {
            "index": 1,
            "name": "Resonance",
            "unit": "",
            "min": 1,
            "max": 10,
            "defaultVal": 4,
            "description": "Q Factor"
        },
        {
            "index": 2,
            "name": "Base Freq (Hz)",
            "unit": "Hz",
            "min": 200,
            "max": 800,
            "defaultVal": 400,
            "description": "Lowest Frequency"
        },
        {
            "index": 3,
            "name": "Top Freq (Hz)",
            "unit": "Hz",
            "min": 1000,
            "max": 4000,
            "defaultVal": 2000,
            "description": "Highest Frequency"
        }
    ]
}
,
  {
    "name": "JS: Audio To MIDI Drum Trigger",
    "shortName": "Drum Trigger",
    "category": "Routing & Utility",
    "description": "Detects audio spikes and converts them into MIDI notes.",
    "howItWorks": "Uses an amplitude envelope follower to send Note On messages when transients pass the threshold.",
    "proTips": "Use to replace a poorly recorded snare drum with a MIDI sample library seamlessly.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -18,
            "description": "Detection Threshold"
        },
        {
            "index": 1,
            "name": "Retrigger Interval (ms)",
            "unit": "ms",
            "min": 1,
            "max": 500,
            "defaultVal": 50,
            "description": "Prevent machinegunning"
        },
        {
            "index": 2,
            "name": "MIDI Note",
            "unit": "",
            "min": 0,
            "max": 127,
            "defaultVal": 38,
            "description": "Note to Output (38 = Snare)"
        },
        {
            "index": 3,
            "name": "Velocity Scaling",
            "unit": "%",
            "min": 0,
            "max": 200,
            "defaultVal": 100,
            "description": "Map audio volume to MIDI velocity"
        }
    ]
},
  {
    "name": "JS: Dual Pan",
    "shortName": "Dual Pan",
    "category": "Routing & Utility",
    "description": "Discrete panning for independent left and right channels.",
    "howItWorks": "Bypasses standard stereo balance and allows precise placement of the L and R channels anywhere in the stereo field.",
    "proTips": "Useful when a stereo synth is too wide and you want to narrow the left and right closer to the center.",
    "sliders": [
        {
            "index": 0,
            "name": "Left Pan (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": -100,
            "description": "Left Channel Position"
        },
        {
            "index": 1,
            "name": "Right Pan (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 100,
            "description": "Right Channel Position"
        },
        {
            "index": 2,
            "name": "Pan Law (dB)",
            "unit": "dB",
            "min": -6,
            "max": 0,
            "defaultVal": 0,
            "description": "Center Drop Compensation"
        }
    ]
},
  {
    "name": "JS: Liteon/deesser",
    "shortName": "De-Esser",
    "category": "Dynamics",
    "description": "A precision high-frequency dynamics controller.",
    "howItWorks": "Compresses only the sibilant high frequencies when triggered by a dedicated detector path.",
    "proTips": "Crucial for taming harsh 'S' and 'T' sounds on lead vocals.",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -12,
            "description": "De-Essing Threshold"
        },
        {
            "index": 1,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 2000,
            "max": 12000,
            "defaultVal": 6000,
            "description": "Sibilance Target Freq"
        },
        {
            "index": 2,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 5,
            "description": "Reduction Amount"
        },
        {
            "index": 3,
            "name": "Monitor",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Listen to what is being removed"
        }
    ]
},
  {
    "name": "JS: Pitch Shifter",
    "shortName": "Pitch Shifter",
    "category": "Time & Modulation",
    "description": "Realtime audio pitch transposition.",
    "howItWorks": "Uses overlap-add windowing algorithms to shift pitch independent of time.",
    "proTips": "Shift a backing vocal down by 12 semitones to create a demonic underlayer.",
    "sliders": [
        {
            "index": 0,
            "name": "Shift (Semitones)",
            "unit": "st",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Semitones"
        },
        {
            "index": 1,
            "name": "Shift (Cents)",
            "unit": "ct",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Cents"
        },
        {
            "index": 2,
            "name": "Window Size (ms)",
            "unit": "ms",
            "min": 10,
            "max": 100,
            "defaultVal": 50,
            "description": "Grain Size"
        },
        {
            "index": 3,
            "name": "Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet/Dry Blend"
        }
    ]
},
  {
    "name": "JS: LOSER/TransientController",
    "shortName": "Transient Controller",
    "category": "Dynamics",
    "description": "Shape the attack and sustain of audio sources independent of absolute level.",
    "howItWorks": "Analyzes amplitude envelopes to independently boost or cut the immediate spike (attack) or the ring-out (sustain).",
    "proTips": "Turn the Attack up and Sustain down to make a floppy kick drum punch hard and tight.",
    "sliders": [
        {
            "index": 0,
            "name": "Attack (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Transient punch"
        },
        {
            "index": 1,
            "name": "Sustain (%)",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Tail / Ring-out"
        },
        {
            "index": 2,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Makeup Gain"
        }
    ]
},
  {
    "name": "JS: MS Decoder",
    "shortName": "Mid/Side Decoder",
    "category": "Routing & Utility",
    "description": "Converts Mid/Side audio signals back into standard Left/Right Stereo.",
    "howItWorks": "Matrixes the Mid channel (L+R) and Side channel (L-R) back into discrete Left and Right channels.",
    "proTips": "Place at the end of an effects chain when doing dedicated Mid/Side processing.",
    "sliders": []
},
  {
    "name": "JS: MS Encoder",
    "shortName": "Mid/Side Encoder",
    "category": "Routing & Utility",
    "description": "Converts standard Left/Right Stereo into a Mid/Side matrix.",
    "howItWorks": "Creates a mono Mid channel and a difference Side channel.",
    "proTips": "Put this before an EQ to EQ the sides (width) differently than the center.",
    "sliders": []
}
,
  {
    "name": "JS: LOSER/WhiteNoise",
    "shortName": "White Noise Generator",
    "category": "Routing & Utility",
    "description": "Generates pure white noise.",
    "howItWorks": "Outputs a continuous random-amplitude signal.",
    "proTips": "Use under snares or synths during build-ups for added energy.",
    "sliders": [
        {
            "index": 0,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -120,
            "max": 0,
            "defaultVal": -12,
            "description": "Gain Amount"
        }
    ]
},
  {
    "name": "JS: LOSER/phase_rotator",
    "shortName": "Phase Rotator",
    "category": "Routing & Utility",
    "description": "Adjusts the relative phase of an audio signal.",
    "howItWorks": "Uses an all-pass filter network to alter the phase relationship without affecting frequency response magnitude.",
    "proTips": "Can tighten up asymmetric vocal waveforms to get more headroom before limiting.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 10,
            "max": 1000,
            "defaultVal": 100,
            "description": "Rotation Center"
        }
    ]
},
  {
    "name": "JS: LOSER/goniometer",
    "shortName": "Goniometer",
    "category": "Routing & Utility",
    "description": "Visualizes the stereo image as a Lissajous figure (requires no sliders).",
    "howItWorks": "Plots Left against Right phase correlation.",
    "proTips": "Use to check your master for mono-compatibility and out-of-phase warning signs.",
    "sliders": []
},
  {
    "name": "JS: Transient Enhancer",
    "shortName": "Transient Enhancer",
    "category": "Dynamics",
    "description": "Brings out the attack of sounds.",
    "howItWorks": "Uses envelope following to apply positive gain to the transient peaks of a signal.",
    "proTips": "Great for making acoustic guitars sparkle.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Attack Boost"
        },
        {
            "index": 1,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -20,
            "description": "Trigger Threshold"
        }
    ]
},
  {
    "name": "JS: Super Pitch",
    "shortName": "Super Pitch",
    "category": "Time & Modulation",
    "description": "Advanced multi-voice pitch shifter.",
    "howItWorks": "Allows multiple shifted voices with variable pan and delay.",
    "proTips": "Create massive thick harmonies from a single lead line.",
    "sliders": [
        {
            "index": 0,
            "name": "Shift 1 (st)",
            "unit": "st",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Voice 1 Shift"
        },
        {
            "index": 1,
            "name": "Pan 1",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Voice 1 Pan"
        },
        {
            "index": 2,
            "name": "Gain 1 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Voice 1 Gain"
        },
        {
            "index": 3,
            "name": "Shift 2 (st)",
            "unit": "st",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Voice 2 Shift"
        },
        {
            "index": 4,
            "name": "Pan 2",
            "unit": "%",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Voice 2 Pan"
        },
        {
            "index": 5,
            "name": "Gain 2 (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Voice 2 Gain"
        }
    ]
},
  {
    "name": "JS: Channel Mixer",
    "shortName": "Channel Mixer",
    "category": "Routing & Utility",
    "description": "Complex channel re-routing utility.",
    "howItWorks": "Matrix mixer to combine multiple track channels (1-64) down or change routing paths.",
    "proTips": "Use for downmixing 5.1 surround sound to stereo.",
    "sliders": []
},
  {
    "name": "JS: 8x8 Matrix Mixer",
    "shortName": "8x8 Mixer",
    "category": "Routing & Utility",
    "description": "Routes 8 incoming channels to 8 outputs with independent gain.",
    "howItWorks": "Creates an 8x8 gain matrix.",
    "proTips": "Ideal for complex drum bussing and parallel processing routing within a single track.",
    "sliders": []
},
  {
    "name": "JS: Stereo Upmix",
    "shortName": "Stereo Upmix",
    "category": "Routing & Utility",
    "description": "Generates fake stereo width from a mono source.",
    "howItWorks": "Uses comb filtering and short delays to trick the ear into hearing a wide signal.",
    "proTips": "Good for beefing up a center-panned synth lead that masks the vocal.",
    "sliders": [
        {
            "index": 0,
            "name": "Width (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Amount of Upmix Width"
        }
    ]
},
  {
    "name": "JS: Tonifier",
    "shortName": "Tonifier",
    "category": "EQ & Filtering",
    "description": "Resonator and tone generator.",
    "howItWorks": "Applies severe resonant comb filtering to create notes out of noise.",
    "proTips": "Send a dry drum break through this and automate the frequency for robot melodies.",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 10000,
            "defaultVal": 440,
            "description": "Resonant Tone"
        },
        {
            "index": 1,
            "name": "Feedback",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 80,
            "description": "Resonance Amount"
        }
    ]
},
  {
    "name": "JS: Pitch Octave Up",
    "shortName": "Octave Up",
    "category": "Time & Modulation",
    "description": "Dedicated pitch shifter that only goes up one octave.",
    "howItWorks": "Hard-coded pitch shift algorithm optimized for exactly +12 semitones.",
    "proTips": "Use on a parallel bass track with distortion for electric guitar-like tones.",
    "sliders": [
        {
            "index": 0,
            "name": "Blend",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Level"
        }
    ]
}
,
  {
    "name": "JS: LOSER/1175",
    "shortName": "1175",
    "category": "Dynamics",
    "description": "Standard 1175 implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 4-Band EQ",
    "shortName": "4-Band EQ",
    "category": "EQ & Filtering",
    "description": "Standard 4-Band EQ implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Auto-peaker",
    "shortName": "Auto-peaker",
    "category": "EQ & Filtering",
    "description": "Standard Auto-peaker implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: DC Filter",
    "shortName": "DC Filter",
    "category": "EQ & Filtering",
    "description": "Standard DC Filter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/5BandEQ",
    "shortName": "5BandEQ",
    "category": "EQ & Filtering",
    "description": "Standard 5BandEQ implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Filter",
    "shortName": "Filter",
    "category": "EQ & Filtering",
    "description": "Standard Filter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Filter_RC",
    "shortName": "Filter_RC",
    "category": "EQ & Filtering",
    "description": "Standard Filter_RC implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/MIDI_EQ",
    "shortName": "MIDI_EQ",
    "category": "EQ & Filtering",
    "description": "Standard MIDI_EQ implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/VCF",
    "shortName": "VCF",
    "category": "EQ & Filtering",
    "description": "Standard VCF implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/saturation",
    "shortName": "saturation",
    "category": "EQ & Filtering",
    "description": "Standard saturation implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/stereo_enhancer",
    "shortName": "stereo_enhancer",
    "category": "Routing & Utility",
    "description": "Standard stereo_enhancer implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/applefilter12db",
    "shortName": "applefilter12db",
    "category": "EQ & Filtering",
    "description": "Standard applefilter12db implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/applefilter24db",
    "shortName": "applefilter24db",
    "category": "EQ & Filtering",
    "description": "Standard applefilter24db implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/butterworth24db",
    "shortName": "butterworth24db",
    "category": "Routing & Utility",
    "description": "Standard butterworth24db implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/cheb24db",
    "shortName": "cheb24db",
    "category": "Routing & Utility",
    "description": "Standard cheb24db implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/moog24db",
    "shortName": "moog24db",
    "category": "Routing & Utility",
    "description": "Standard moog24db implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/presenceeq",
    "shortName": "presenceeq",
    "category": "EQ & Filtering",
    "description": "Standard presenceeq implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/rbj1073",
    "shortName": "rbj1073",
    "category": "Routing & Utility",
    "description": "Standard rbj1073 implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/rbjeq",
    "shortName": "rbjeq",
    "category": "EQ & Filtering",
    "description": "Standard rbjeq implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/saturator",
    "shortName": "saturator",
    "category": "EQ & Filtering",
    "description": "Standard saturator implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/shelveq",
    "shortName": "shelveq",
    "category": "EQ & Filtering",
    "description": "Standard shelveq implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/statevariable",
    "shortName": "statevariable",
    "category": "Routing & Utility",
    "description": "Standard statevariable implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/statevariable2",
    "shortName": "statevariable2",
    "category": "Routing & Utility",
    "description": "Standard statevariable2 implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: RBJ 7-Band Graphic EQ",
    "shortName": "RBJ 7-Band Graphic EQ",
    "category": "EQ & Filtering",
    "description": "Standard RBJ 7-Band Graphic EQ implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: RBJ Highpass/Lowpass Filters",
    "shortName": "Lowpass Filters",
    "category": "EQ & Filtering",
    "description": "Standard Lowpass Filters implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    sliders: [
      {"index":0,"name":"Delay","min":0,"max":250,"defaultVal":125,"unit":"ms"}
    ]
},
  {
    "name": "JS: Saturation/Soft Clipper",
    "shortName": "Soft Clipper",
    "category": "EQ & Filtering",
    "description": "Standard Soft Clipper implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Teej/rbj12eq-teej",
    "shortName": "rbj12eq-teej",
    "category": "EQ & Filtering",
    "description": "Standard rbj12eq-teej implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 12-Band EQ",
    "shortName": "12-Band EQ",
    "category": "EQ & Filtering",
    "description": "Standard 12-Band EQ implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Delay w/ Chorus",
    "shortName": " Chorus",
    "category": "Time & Modulation",
    "description": "Standard  Chorus implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Flanger (Stereo)",
    "shortName": "Flanger (Stereo)",
    "category": "Time & Modulation",
    "description": "Standard Flanger (Stereo) implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/FBDelay",
    "shortName": "FBDelay",
    "category": "Time & Modulation",
    "description": "Standard FBDelay implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/FBFlanger",
    "shortName": "FBFlanger",
    "category": "Time & Modulation",
    "description": "Standard FBFlanger implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Flanger",
    "shortName": "Flanger",
    "category": "Time & Modulation",
    "description": "Standard Flanger implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Phaser",
    "shortName": "Phaser",
    "category": "Time & Modulation",
    "description": "Standard Phaser implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Tremolo",
    "shortName": "Tremolo",
    "category": "Time & Modulation",
    "description": "Standard Tremolo implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Wig-Wah",
    "shortName": "Wig-Wah",
    "category": "Guitar & Amp",
    "description": "Standard Wig-Wah implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 8-Channel Mixer",
    "shortName": "8-Channel Mixer",
    "category": "Routing & Utility",
    "description": "Standard 8-Channel Mixer implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Band Splitter",
    "shortName": "Band Splitter",
    "category": "Routing & Utility",
    "description": "Standard Band Splitter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Band Joiner",
    "shortName": "Band Joiner",
    "category": "Routing & Utility",
    "description": "Standard Band Joiner implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: FFT Splitter",
    "shortName": "FFT Splitter",
    "category": "Routing & Utility",
    "description": "Standard FFT Splitter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: FFT Splitter (3-band)",
    "shortName": "FFT Splitter (3-band)",
    "category": "Routing & Utility",
    "description": "Standard FFT Splitter (3-band) implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/CenterCanceler",
    "shortName": "CenterCanceler",
    "category": "Routing & Utility",
    "description": "Standard CenterCanceler implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Dither",
    "shortName": "Dither",
    "category": "Routing & Utility",
    "description": "Standard Dither implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Downjumper",
    "shortName": "Downjumper",
    "category": "Routing & Utility",
    "description": "Standard Downjumper implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/Upjumper",
    "shortName": "Upjumper",
    "category": "Routing & Utility",
    "description": "Standard Upjumper implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/WaveShaper",
    "shortName": "WaveShaper",
    "category": "Routing & Utility",
    "description": "Standard WaveShaper implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/pitch_shifter_2",
    "shortName": "pitch_shifter_2",
    "category": "Time & Modulation",
    "description": "Standard pitch_shifter_2 implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: LOSER/stereofield",
    "shortName": "stereofield",
    "category": "Routing & Utility",
    "description": "Standard stereofield implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/pinknoisegen",
    "shortName": "pinknoisegen",
    "category": "Routing & Utility",
    "description": "Standard pinknoisegen implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Liteon/pseudostereo",
    "shortName": "pseudostereo",
    "category": "Routing & Utility",
    "description": "Standard pseudostereo implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Multichannel Routing/Channel Mapper",
    "shortName": "Channel Mapper",
    "category": "Routing & Utility",
    "description": "Standard Channel Mapper implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Phase Rotator",
    "shortName": "Phase Rotator",
    "category": "Routing & Utility",
    "description": "Standard Phase Rotator implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Pitch Down-Shifter",
    "shortName": "Pitch Down-Shifter",
    "category": "Time & Modulation",
    "description": "Standard Pitch Down-Shifter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Pitch/Detune",
    "shortName": "Detune",
    "category": "Time & Modulation",
    "description": "Standard Detune implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: SMPTE LTC Generator",
    "shortName": "SMPTE LTC Generator",
    "category": "Routing & Utility",
    "description": "Standard SMPTE LTC Generator implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: SMPTE LTC Reader/Meter",
    "shortName": "Meter",
    "category": "Routing & Utility",
    "description": "Standard Meter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Stereo Field",
    "shortName": "Stereo Field",
    "category": "Routing & Utility",
    "description": "Standard Stereo Field implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Time Adjustment",
    "shortName": "Time Adjustment",
    "category": "Routing & Utility",
    "description": "Standard Time Adjustment implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Volume/Pan Smoother v5",
    "shortName": "Pan Smoother v5",
    "category": "Routing & Utility",
    "description": "Standard Pan Smoother v5 implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 3-Band Splitter",
    "shortName": "3-Band Splitter",
    "category": "Routing & Utility",
    "description": "Standard 3-Band Splitter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 4-Band Splitter",
    "shortName": "4-Band Splitter",
    "category": "Routing & Utility",
    "description": "Standard 4-Band Splitter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 5-Band Splitter",
    "shortName": "5-Band Splitter",
    "category": "Routing & Utility",
    "description": "Standard 5-Band Splitter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: 8-Way Panner",
    "shortName": "8-Way Panner",
    "category": "Routing & Utility",
    "description": "Standard 8-Way Panner implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: Vocoder",
    "shortName": "Vocoder",
    "category": "Time & Modulation",
    "description": "Standard Vocoder implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: IX/Mixer_8xM-1xS",
    "shortName": "Mixer_8xM-1xS",
    "category": "Routing & Utility",
    "description": "Standard Mixer_8xM-1xS implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: IX/StereoPhaseInverter",
    "shortName": "StereoPhaseInverter",
    "category": "Routing & Utility",
    "description": "Standard StereoPhaseInverter implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: IX/PhaseAdjust",
    "shortName": "PhaseAdjust",
    "category": "Routing & Utility",
    "description": "Standard PhaseAdjust implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
},
  {
    "name": "JS: IX/SwixMitz",
    "shortName": "SwixMitz",
    "category": "Routing & Utility",
    "description": "Standard SwixMitz implementation.",
    "howItWorks": "Processes the input signal accordingly.",
    "proTips": "Adjust sliders to taste to fit your mix.",
    "sliders": [
        {
            "index": 0,
            "name": "Amount (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Effect amount"
        },
        {
            "index": 1,
            "name": "Output (dB)",
            "unit": "dB",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "description": "Gain adjustment"
        }
    ]
}
,
  {
    "name": "JS: MIDI EQ Ducker [LOSER]",
    "shortName": "MIDI EQ Ducker [LOSER]",
    "category": "Routing & Utility",
    "description": "Accurate sliders for MIDI EQ Ducker [LOSER].",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "MIDI Note #",
            "unit": "",
            "min": 0,
            "max": 127,
            "defaultVal": 60,
            "description": "MIDI Note"
        },
        {
            "index": 1,
            "name": "Attack (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 10,
            "description": "Attack (ms)"
        },
        {
            "index": 2,
            "name": "Attack Shape",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Attack Shape"
        },
        {
            "index": 3,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 5000,
            "defaultVal": 500,
            "description": "Release (ms)"
        },
        {
            "index": 4,
            "name": "Release Shape",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Release Shape"
        },
        {
            "index": 5,
            "name": "Frequency Coarse (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 20000,
            "defaultVal": 1000,
            "description": "Frequency Coarse"
        },
        {
            "index": 6,
            "name": "Frequency Fine (Hz)",
            "unit": "Hz",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Frequency Fine"
        },
        {
            "index": 7,
            "name": "Width (Oct)",
            "unit": "Oct",
            "min": 0,
            "max": 4,
            "defaultVal": 1,
            "description": "Width"
        },
        {
            "index": 8,
            "name": "Volume (dB)",
            "unit": "dB",
            "min": -60,
            "max": 24,
            "defaultVal": 0,
            "description": "Volume"
        },
        {
            "index": 9,
            "name": "Mode",
            "unit": "",
            "min": 0,
            "max": 4,
            "defaultVal": 0,
            "description": "Freq Peak / Low Shelf / High Shelf / Gate / Pump"
        },
        {
            "index": 10,
            "name": "React To MIDI Velocity",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Gate/Pump React To MIDI Velocity"
        }
    ]
}
,
  {
    "name": "JS: MIDI Velocity and Timing Humanizer",
    "shortName": "MIDI Velocity and Timing Humanizer",
    "category": "Routing & Utility",
    "description": "Accurate sliders for MIDI Velocity and Timing Humanizer.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Baseline Velocity",
            "unit": "",
            "min": 0,
            "max": 127,
            "defaultVal": 0,
            "description": "(0=use original)"
        },
        {
            "index": 1,
            "name": "Add 1 Beat Delay",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Add 1 Beat Delay"
        },
        {
            "index": 2,
            "name": "Bias Timing Humanization (ms)",
            "unit": "ms",
            "min": -100,
            "max": 100,
            "defaultVal": 0,
            "description": "Bias Timing Humanization"
        },
        {
            "index": 3,
            "name": "Timing Humanization Level",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Timing Humanization Level"
        },
        {
            "index": 4,
            "name": "Velocity Humanization Level",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Velocity Humanization Level"
        }
    ]
}
,
  {
    "name": "JS: MIDI Modal Randomness",
    "shortName": "MIDI Modal Randomness",
    "category": "Routing & Utility",
    "description": "Accurate sliders for MIDI Modal Randomness.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Interval & Prob A",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Interval A"
        },
        {
            "index": 1,
            "name": "Interval & Prob B",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Interval B"
        },
        {
            "index": 2,
            "name": "Interval & Prob C",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Interval C"
        },
        {
            "index": 3,
            "name": "Interval & Prob D",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Interval D"
        },
        {
            "index": 4,
            "name": "Speed",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Speed"
        },
        {
            "index": 5,
            "name": "Octave Randomness",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Octave"
        },
        {
            "index": 6,
            "name": "Timing Randomness",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Timing"
        },
        {
            "index": 7,
            "name": "Velocity Randomness",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Velocity"
        },
        {
            "index": 8,
            "name": "Decay Time (sec)",
            "unit": "s",
            "min": 0,
            "max": 10,
            "defaultVal": 1,
            "description": "Decay Time"
        },
        {
            "index": 9,
            "name": "Simultaneous Notes",
            "unit": "",
            "min": 1,
            "max": 16,
            "defaultVal": 4,
            "description": "Number Of Simultaneous Notes"
        }
    ]
}
,
  {
    "name": "JS: IX/MIDI_MapToKey",
    "shortName": "MIDI Map To Key v2 [IXix]",
    "category": "Routing & Utility",
    "description": "Accurate sliders for MIDI Map To Key v2 [IXix].",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Input Channel",
            "unit": "",
            "min": 0,
            "max": 16,
            "defaultVal": 0,
            "description": "Input Channel"
        },
        {
            "index": 1,
            "name": "Mapping File",
            "unit": "",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "description": "Mapping File"
        },
        {
            "index": 2,
            "name": "-Note In",
            "unit": "",
            "min": 0,
            "max": 127,
            "defaultVal": 0,
            "description": "Hidden UI"
        },
        {
            "index": 3,
            "name": "-Note Out",
            "unit": "",
            "min": 0,
            "max": 127,
            "defaultVal": 0,
            "description": "Hidden UI"
        },
        {
            "index": 4,
            "name": "Reload Mapping",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Reload Mapping"
        }
    ]
}
,
  {
    "name": "JS: MIDI Pitch Wheel LFO Generator",
    "shortName": "MIDI Pitch Wheel LFO Generator",
    "category": "Routing & Utility",
    "description": "Accurate sliders for MIDI Pitch Wheel LFO Generator.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "MIDI Channel",
            "unit": "",
            "min": 1,
            "max": 16,
            "defaultVal": 1,
            "description": "MIDI Channel"
        },
        {
            "index": 1,
            "name": "Max Bend (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Max Bend"
        },
        {
            "index": 2,
            "name": "LFO Frequency",
            "unit": "Hz",
            "min": 0.1,
            "max": 100,
            "defaultVal": 1,
            "description": "LFO Frequency"
        },
        {
            "index": 3,
            "name": "LFO Units (Hz/Beats)",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "LFO Units"
        },
        {
            "index": 4,
            "name": "Updates Per Beat",
            "unit": "",
            "min": 1,
            "max": 64,
            "defaultVal": 16,
            "description": "Updates Per Beat"
        },
        {
            "index": 5,
            "name": "On/Off",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 1,
            "description": "On/Off"
        }
    ]
}
,
  {
    "name": "JS: Liteon/np1136peaklimiter",
    "shortName": "NP1136 Peak Limiter",
    "category": "Dynamics",
    "description": "Accurate sliders for NP1136 Peak Limiter.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "description": "Threshold"
        },
        {
            "index": 1,
            "name": "Ratio",
            "unit": "ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 10,
            "description": "Ratio"
        },
        {
            "index": 2,
            "name": "Attack (µs)",
            "unit": "µs",
            "min": 0,
            "max": 1000,
            "defaultVal": 100,
            "description": "Attack"
        },
        {
            "index": 3,
            "name": "Release (ms)",
            "unit": "ms",
            "min": 0,
            "max": 1000,
            "defaultVal": 100,
            "description": "Release"
        },
        {
            "index": 4,
            "name": "Detector HP (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 500,
            "defaultVal": 100,
            "description": "Detector HP"
        },
        {
            "index": 5,
            "name": "GR Limit (dB)",
            "unit": "dB",
            "min": -30,
            "max": 0,
            "defaultVal": -12,
            "description": "GR Limit"
        },
        {
            "index": 6,
            "name": "Makeup Gain (dB)",
            "unit": "dB",
            "min": 0,
            "max": 24,
            "defaultVal": 0,
            "description": "Makeup Gain"
        },
        {
            "index": 7,
            "name": "Tilt EQ Center (Hz)",
            "unit": "Hz",
            "min": 200,
            "max": 2000,
            "defaultVal": 1000,
            "description": "Tilt EQ Center"
        },
        {
            "index": 8,
            "name": "Tilt EQ Low/High (dB)",
            "unit": "dB",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "description": "Tilt EQ"
        },
        {
            "index": 9,
            "name": "Wet Mix (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Wet Mix"
        },
        {
            "index": 10,
            "name": "Processing Mode",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0,
            "description": "Processing Mode"
        },
        {
            "index": 11,
            "name": "Detector Mode",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0,
            "description": "Detector Mode"
        },
        {
            "index": 12,
            "name": "Detector Input",
            "unit": "",
            "min": 0,
            "max": 2,
            "defaultVal": 0,
            "description": "Detector Input"
        },
        {
            "index": 13,
            "name": "Hard Clip",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 0,
            "description": "Hard Clip"
        }
    ]
}
,
  {
    "name": "JS: Dirt Squeeze Compressor",
    "shortName": "Dirt Squeeze Compressor [Stillwell]",
    "category": "Dynamics",
    "description": "Accurate sliders for Dirt Squeeze Compressor [Stillwell].",
    "howItWorks": "",
    "proTips": "",
    sliders: [
      {"index":0,"name":"Frame Rate","min":0,"max":3,"defaultVal":0}
    ]
  }
,
  {
    "name": "JS: Ozzifier Chorus",
    "shortName": "Ozzifier Chorus [Stillwell]",
    "category": "Time & Modulation",
    "description": "Accurate sliders for Ozzifier Chorus [Stillwell].",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Number Of Voices",
            "unit": "",
            "min": 1,
            "max": 8,
            "defaultVal": 4,
            "description": "Number Of Voices"
        },
        {
            "index": 1,
            "name": "Time Spread (ms)",
            "unit": "ms",
            "min": 0,
            "max": 50,
            "defaultVal": 20,
            "description": "Time Spread"
        },
        {
            "index": 2,
            "name": "Pitch Spread (cents)",
            "unit": "cents",
            "min": 0,
            "max": 50,
            "defaultVal": 15,
            "description": "Pitch Spread"
        },
        {
            "index": 3,
            "name": "Wet Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Wet Mix"
        },
        {
            "index": 4,
            "name": "Dry Mix",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Dry Mix"
        },
        {
            "index": 5,
            "name": "Pan Spread (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Pan Spread"
        }
    ]
}
,
  {
    "name": "JS: Pitch Octave Up",
    "shortName": "Pitch an Octave Up",
    "category": "Time & Modulation",
    "description": "Accurate sliders for Pitch an Octave Up.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Chunk (ms)",
            "unit": "ms",
            "min": 10,
            "max": 200,
            "defaultVal": 50,
            "description": "Chunk (ms)"
        },
        {
            "index": 1,
            "name": "Overlap",
            "unit": "",
            "min": 1,
            "max": 8,
            "defaultVal": 4,
            "description": "Overlap"
        },
        {
            "index": 2,
            "name": "Wet Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Wet Mix"
        },
        {
            "index": 3,
            "name": "Dry Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": -120,
            "description": "Dry Mix"
        }
    ]
}
,
  {
    "name": "JS: Pitch Down-Shifter",
    "shortName": "Pitch an Octave Down",
    "category": "Time & Modulation",
    "description": "Accurate sliders for Pitch an Octave Down.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Chunk (ms)",
            "unit": "ms",
            "min": 10,
            "max": 200,
            "defaultVal": 50,
            "description": "Chunk (ms)"
        },
        {
            "index": 1,
            "name": "Overlap",
            "unit": "",
            "min": 1,
            "max": 8,
            "defaultVal": 4,
            "description": "Overlap"
        },
        {
            "index": 2,
            "name": "Wet Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Wet Mix"
        },
        {
            "index": 3,
            "name": "Dry Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": -120,
            "description": "Dry Mix"
        }
    ]
}
,
  {
    "name": "JS: 4-Tap Phaser",
    "shortName": "4-Tap Phaser",
    "category": "Time & Modulation",
    "description": "Accurate sliders for 4-Tap Phaser.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Rate (Hz)",
            "unit": "Hz",
            "min": 0.1,
            "max": 10,
            "defaultVal": 1,
            "description": "Rate (Hz)"
        },
        {
            "index": 1,
            "name": "Range Min (Hz)",
            "unit": "Hz",
            "min": 20,
            "max": 5000,
            "defaultVal": 200,
            "description": "Range Min"
        },
        {
            "index": 2,
            "name": "Range Max (Hz)",
            "unit": "Hz",
            "min": 100,
            "max": 10000,
            "defaultVal": 4000,
            "description": "Range Max"
        },
        {
            "index": 3,
            "name": "Feedback (dB)",
            "unit": "dB",
            "min": -20,
            "max": 12,
            "defaultVal": 0,
            "description": "Feedback"
        },
        {
            "index": 4,
            "name": "Wet Mix (dB)",
            "unit": "dB",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "description": "Wet Mix"
        }
    ]
}
,
  {
    "name": "JS: Avocado Ducking Glitch Generator",
    "shortName": "Avocado Ducking Glitch Generator",
    "category": "Time & Modulation",
    "description": "Accurate sliders for Avocado Ducking Glitch Generator.",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Buffer Length (ms)",
            "unit": "ms",
            "min": 10,
            "max": 2000,
            "defaultVal": 200,
            "description": "Buffer Length"
        },
        {
            "index": 1,
            "name": "Mix (%)",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 100,
            "description": "Mix"
        },
        {
            "index": 2,
            "name": "Buffers",
            "unit": "",
            "min": 1,
            "max": 16,
            "defaultVal": 4,
            "description": "Buffers"
        },
        {
            "index": 3,
            "name": "Repeat Probability",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 50,
            "description": "Repeat Probability"
        },
        {
            "index": 4,
            "name": "Pitch Modulation Probability",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 20,
            "description": "Pitch Mod"
        },
        {
            "index": 5,
            "name": "Reverse Probability",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 30,
            "description": "Reverse"
        },
        {
            "index": 6,
            "name": "Fadeout Probability",
            "unit": "%",
            "min": 0,
            "max": 100,
            "defaultVal": 40,
            "description": "Fadeout"
        },
        {
            "index": 7,
            "name": "Threshold (dB)",
            "unit": "dB",
            "min": -60,
            "max": 0,
            "defaultVal": -20,
            "description": "Threshold"
        },
        {
            "index": 8,
            "name": "Glitch Attack",
            "unit": "ms",
            "min": 0,
            "max": 100,
            "defaultVal": 5,
            "description": "Glitch Attack"
        },
        {
            "index": 9,
            "name": "Arpeggiator Mode",
            "unit": "",
            "min": 0,
            "max": 3,
            "defaultVal": 0,
            "description": "Arpeggiator Mode"
        },
        {
            "index": 10,
            "name": "Tempo Sync",
            "unit": "",
            "min": 0,
            "max": 1,
            "defaultVal": 1,
            "description": "Tempo Sync"
        }
    ]
}
,
  {
    "name": "JS: 3-Band EQ",
    "shortName": "3-Band EQ [LOSER]",
    "category": "EQ & Filtering",
    "description": "3-Band EQ",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Frequency",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "unit": "Hz"
        },
        {
            "index": 2,
            "name": "Mid",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Frequency",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "unit": "Hz"
        },
        {
            "index": 4,
            "name": "High",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Output",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: 3-Band Joiner",
    "shortName": "3-Band-Joiner (Combines Signal From 3-Band Splitter) [LOSER]",
    "category": "Routing & Utility",
    "description": "Combines Signal From 3-Band Splitter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Mid",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "High",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: 3-Band Peak Filter",
    "shortName": "3-Band Peak Filter (PF-3A, PF-3B, Apple: HP, LP) [Liteon]",
    "category": "EQ & Filtering",
    "description": "3-Band Peak Filter (PF-3A, PF-3B, Apple: HP, LP)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "HP Filter (2-Pole)",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Peak Filter Type",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Frequency 1",
            "min": 0,
            "max": 100,
            "defaultVal": 50
        },
        {
            "index": 4,
            "name": "Bandwidth 1",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3
        },
        {
            "index": 5,
            "name": "Gain 1",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Frequency 2",
            "min": 0,
            "max": 100,
            "defaultVal": 50
        },
        {
            "index": 7,
            "name": "Bandwidth 2",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3
        },
        {
            "index": 8,
            "name": "Gain 2",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 9,
            "name": "Frequency 3",
            "min": 0,
            "max": 100,
            "defaultVal": 50
        },
        {
            "index": 10,
            "name": "Bandwidth 3",
            "min": 0.005,
            "max": 1,
            "defaultVal": 0.3
        },
        {
            "index": 11,
            "name": "Gain 3",
            "min": -18,
            "max": 18,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 12,
            "name": "LP Filter (2-Pole)",
            "min": 0,
            "max": 100,
            "defaultVal": 100
        },
        {
            "index": 13,
            "name": "Saturation (%)",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 14,
            "name": "Output",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 15,
            "name": "Oversample (x2)",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: 3-Band Splitter",
    "shortName": "3-Band Splitter (Splits In Low:1+2,Mid:3+4,High:5+6) [LOSER]",
    "category": "Routing & Utility",
    "description": "Splits In Low:1+2,Mid:3+4,High:5+6",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Crossover 1",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "unit": "Hz"
        },
        {
            "index": 1,
            "name": "Crossover 2",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: 3x3 EQ (1-Pole Crossover)",
    "shortName": "3x3 EQ (1-Pole Crossover) [Stillwell]",
    "category": "EQ & Filtering",
    "description": "3x3 EQ (1-Pole Crossover)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Low Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Mid Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 3,
            "name": "Mid Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "High Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 5,
            "name": "High Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Low-Mid Freq",
            "min": 60,
            "max": 680,
            "defaultVal": 240,
            "unit": "Hz"
        },
        {
            "index": 7,
            "name": "Mid-High Freq",
            "min": 720,
            "max": 12000,
            "defaultVal": 2400,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: 3x3 EQ",
    "shortName": "3x3 EQ [Stillwell]",
    "category": "EQ & Filtering",
    "description": "3x3 EQ",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Low Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Mid Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 3,
            "name": "Mid Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "High Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 5,
            "name": "High Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Low-Mid Freq",
            "min": 60,
            "max": 680,
            "defaultVal": 240,
            "unit": "Hz"
        },
        {
            "index": 7,
            "name": "Mid-High Freq",
            "min": 720,
            "max": 12000,
            "defaultVal": 2400,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: 4-Band EQ",
    "shortName": "4-Band EQ [LOSER]",
    "category": "EQ & Filtering",
    "description": "4-Band EQ",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Frequency",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "unit": "Hz"
        },
        {
            "index": 2,
            "name": "Low Mid",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Frequency",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "unit": "Hz"
        },
        {
            "index": 4,
            "name": "High Mid",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Frequency",
            "min": 0,
            "max": 22000,
            "defaultVal": 5000,
            "unit": "Hz"
        },
        {
            "index": 6,
            "name": "High",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "Output",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: 4x4 EQ",
    "shortName": "4x4 EQ [Stillwell]",
    "category": "EQ & Filtering",
    "description": "4x4 EQ",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Low Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Mid Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 3,
            "name": "Mid Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "High Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 5,
            "name": "High Gain",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Low-Mid Crossover",
            "min": 60,
            "max": 500,
            "defaultVal": 240,
            "unit": "Hz"
        },
        {
            "index": 7,
            "name": "Mid-High Crossover",
            "min": 510,
            "max": 10000,
            "defaultVal": 2400,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: 5-Band Joiner",
    "shortName": "5-Band Joiner (Combines Signal From 5-Band Splitter) [LOSER]",
    "category": "Routing & Utility",
    "description": "Combines Signal From 5-Band Splitter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Low",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Mid",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "High",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "UberHigh",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "SomeMore",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: 50 Hz Kicker",
    "shortName": "50 Hz Kicker (Kick Drum Enhancer) [LOSER]",
    "category": "EQ & Filtering",
    "description": "Kick Drum Enhancer",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency",
            "min": 10,
            "max": 200,
            "defaultVal": 50,
            "unit": "Hz"
        },
        {
            "index": 1,
            "name": "Wet",
            "min": -120,
            "max": 12,
            "defaultVal": -12,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Dry",
            "min": -120,
            "max": 12,
            "defaultVal": -3,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: 5-Band Splitter",
    "shortName": "5-Band Splitter (Splits In Low:1+2,Mid:3+4,High:5+6,UberHigh:7+8,SomeMore:9+10) [LOSER]",
    "category": "Routing & Utility",
    "description": "Splits In Low:1+2,Mid:3+4,High:5+6,UberHigh:7+8,SomeMore:9+10",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Crossover 1",
            "min": 0,
            "max": 22000,
            "defaultVal": 200,
            "unit": "Hz"
        },
        {
            "index": 1,
            "name": "Crossover 2",
            "min": 0,
            "max": 22000,
            "defaultVal": 2000,
            "unit": "Hz"
        },
        {
            "index": 2,
            "name": "Crossover 3",
            "min": 0,
            "max": 22000,
            "defaultVal": 5000,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Crossover 4",
            "min": 0,
            "max": 22000,
            "defaultVal": 8000,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: ADPCM Simulator",
    "shortName": "ADPCM Simulator",
    "category": "Analysis & Utility",
    "description": "ADPCM Simulator",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Bits",
            "min": 1,
            "max": 4,
            "defaultVal": 4
        },
        {
            "index": 1,
            "name": "Block Size",
            "min": 2,
            "max": 65538,
            "defaultVal": 4096
        },
        {
            "index": 2,
            "name": "Bit Bias",
            "min": 0,
            "max": 7,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Gain",
            "min": -60,
            "max": 60,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Convolution Dual Amp Modeler",
    "shortName": "Convolution Dual Amp Modeler (mono->stereo)",
    "category": "Guitar Amp/Cabinet",
    "description": "Convolution Dual Amp Modeler (mono->stereo)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Model (Left)",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Model (Right)",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Preamp",
            "min": -120,
            "max": 30,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Upsample Impulse If Required",
            "min": 0,
            "max": 2,
            "defaultVal": 2
        },
        {
            "index": 4,
            "name": "Filter Size",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 5,
            "name": "FFT Size",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Convolution Amp/Cab Modeler",
    "shortName": "Convolution Amp/Cab Modeler",
    "category": "Guitar Amp/Cabinet",
    "description": "Convolution Amp/Cab Modeler",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Model",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Preamp",
            "min": -120,
            "max": 30,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Upsample Impulse If Required",
            "min": 0,
            "max": 2,
            "defaultVal": 2
        },
        {
            "index": 3,
            "name": "Channel Mode",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 4,
            "name": "Filter Size",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 5,
            "name": "FFT Size",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Amplitude Modulator",
    "shortName": "Amplitude Modulator [LOSER]",
    "category": "Modulation",
    "description": "Amplitude Modulator",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Frequency",
            "min": 80,
            "max": 1000,
            "defaultVal": 440,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: Apple 2-Pole Lowpass Filter",
    "shortName": "Apple 2-Pole Lowpass Filter [Liteon]",
    "category": "EQ & Filtering",
    "description": "Apple 2-Pole Lowpass Filter, port from Apple.com AU tutorial",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Cutoff (Scale)",
            "min": 0,
            "max": 100,
            "defaultVal": 100
        },
        {
            "index": 2,
            "name": "Resonance",
            "min": -25,
            "max": 25,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Output",
            "min": -25,
            "max": 25,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Apple 12-Pole Filter",
    "shortName": "Apple 12-Pole Filter [Liteon]",
    "category": "EQ & Filtering",
    "description": "Apple 12-Pole Filter - Butterworth filter implementation",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "HP Slope",
            "min": 0,
            "max": 6,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "HP Cutoff (Scale)",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "HP Resonance",
            "min": -16,
            "max": 16,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "LP Slope",
            "min": 0,
            "max": 6,
            "defaultVal": 0
        },
        {
            "index": 5,
            "name": "LP Cutoff (Scale)",
            "min": 0,
            "max": 100,
            "defaultVal": 100
        },
        {
            "index": 6,
            "name": "LP Resonance",
            "min": -16,
            "max": 16,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "Output",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Audio Statistics",
    "shortName": "Audio Statistics [Schwa]",
    "category": "Analysis & Utility",
    "description": "Audio Statistics analyzer/meter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "RMS Window (user input)",
            "min": 50,
            "max": 1000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "RMS Meter Min (user input)",
            "min": -44,
            "max": -3,
            "defaultVal": -30,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "RMS Window Current L",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "RMS Window Min L",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "RMS Window Max L",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "RMS Dynamic Range L",
            "min": 0,
            "max": 18,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "RMS Window Current R",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "RMS Window Min R",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 8,
            "name": "RMS Window Max R",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 9,
            "name": "RMS Dynamic Range R",
            "min": 0,
            "max": 18,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 10,
            "name": "Peak L",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 11,
            "name": "Peak R",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 12,
            "name": "RMS Total Loudness L",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 13,
            "name": "RMS Total Loudness R",
            "min": -44,
            "max": 3,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 14,
            "name": "DC Offset L",
            "min": -1,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 15,
            "name": "DC Offset R",
            "min": -1,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Auto Expander",
    "shortName": "Auto Expander [Stillwell]",
    "category": "Dynamics",
    "description": "Auto Expander",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Gain",
            "min": -20,
            "max": 20,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Knee",
            "min": 0,
            "max": 3,
            "defaultVal": 2
        },
        {
            "index": 4,
            "name": "Detector Input",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 6,
            "name": "Detection",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Auto Looper",
    "shortName": "Auto Looper [Cockos]",
    "category": "Sampler",
    "description": "Auto Looper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Wet",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Dry",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Threshold",
            "min": -100,
            "max": 60,
            "defaultVal": -30,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Threshold Length",
            "min": 1,
            "max": 1000,
            "defaultVal": 100,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Edge Overlap",
            "min": 0,
            "max": 400,
            "defaultVal": 60,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "Minimum Length",
            "min": 0,
            "max": 4000,
            "defaultVal": 100,
            "unit": "ms"
        },
        {
            "index": 6,
            "name": "Decay",
            "min": -100,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "Record",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 8,
            "name": "Flush Loop On Playback Start",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: FFT Peak-Following Filter",
    "shortName": "FFT Peak-Following Filter [Cockos]",
    "category": "EQ & Filtering",
    "description": "FFT Peak-Following Filter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "FFT Size",
            "min": 0,
            "max": 6,
            "defaultVal": 5
        },
        {
            "index": 1,
            "name": "Minimum Center Freq",
            "min": 0,
            "max": 24000,
            "defaultVal": 60,
            "unit": "Hz"
        },
        {
            "index": 2,
            "name": "Maximum Center Freq",
            "min": 0,
            "max": 24000,
            "defaultVal": 8000,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Filter Width",
            "min": 0,
            "max": 8,
            "defaultVal": 2,
            "unit": "oct"
        },
        {
            "index": 4,
            "name": "Peak Gain",
            "min": -120,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Non-Peak Gain",
            "min": -120,
            "max": 24,
            "defaultVal": -120,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Filter Position Attack Time",
            "min": 0,
            "max": 1000,
            "defaultVal": 120,
            "unit": "ms"
        },
        {
            "index": 7,
            "name": "High End Slope",
            "min": 0.5,
            "max": 1.5,
            "defaultVal": 1.29
        }
    ]
}
,
  {
    "name": "JS: De-esser",
    "shortName": "De-esser [Liteon]",
    "category": "Dynamics",
    "description": "De-esser",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 1,
            "name": "Target Type",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Monitor",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Frequency",
            "min": 1500,
            "max": 12000,
            "defaultVal": 4000,
            "unit": "Hz"
        },
        {
            "index": 4,
            "name": "Bandwidth",
            "min": 0.1,
            "max": 3.1,
            "defaultVal": 1.5,
            "unit": "Oct"
        },
        {
            "index": 5,
            "name": "Threshold",
            "min": -80,
            "max": 0,
            "defaultVal": -25,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 4
        },
        {
            "index": 7,
            "name": "Time Constants",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 8,
            "name": "Gain",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Bad Buss Mojo Waveshaper w/AA",
    "shortName": "Bad Buss Mojo Waveshaper w/AA [Stillwell]",
    "category": "Distortion",
    "description": "Bad Buss Mojo Waveshaper w/AA",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Pos Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Neg Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Pos Nonlinearity",
            "min": 1,
            "max": 2,
            "defaultVal": 1
        },
        {
            "index": 3,
            "name": "Neg Nonlinearity",
            "min": 1,
            "max": 2,
            "defaultVal": 1
        },
        {
            "index": 4,
            "name": "Pos Knee",
            "min": 0,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Neg Knee",
            "min": 0,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Mod A",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        },
        {
            "index": 7,
            "name": "Mod B",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        },
        {
            "index": 8,
            "name": "Oversampling (times)",
            "min": 1,
            "max": 32,
            "defaultVal": 2
        },
        {
            "index": 9,
            "name": "Limit to 0 dBFS",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Bad Buss Mojo Waveshaper",
    "shortName": "Bad Buss Mojo Waveshaper [Stillwell]",
    "category": "Distortion",
    "description": "Bad Buss Mojo Waveshaper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Pos Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Neg Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Pos Nonlinearity",
            "min": 1,
            "max": 2,
            "defaultVal": 1
        },
        {
            "index": 3,
            "name": "Neg Nonlinearity",
            "min": 1,
            "max": 2,
            "defaultVal": 1
        },
        {
            "index": 4,
            "name": "Pos Knee",
            "min": 0,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Neg Knee",
            "min": 0,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Mod A",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        },
        {
            "index": 7,
            "name": "Mod B",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Bass Manager/Booster",
    "shortName": "BassManager (plugin for boosting bass) [Liteon]",
    "category": "EQ & Filtering",
    "description": "BassManager for boosting bass",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Spread",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Frequency",
            "min": 30,
            "max": 250,
            "defaultVal": 90,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Boost",
            "min": 0,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 5,
            "name": "Muffle",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 6,
            "name": "Output",
            "min": -24,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "Highpass",
            "min": 0,
            "max": 4,
            "defaultVal": 0,
            "unit": "Hz"
        },
        {
            "index": 8,
            "name": "Limiter",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 9,
            "name": "Oversample (x2)",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Avocado Ducking Glitch Generator",
    "shortName": "Avocado Ducking Glitch Generator [remaincalm.org]",
    "category": "Modulation & Pitch",
    "description": "Avocado Ducking Glitch Generator",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Buffer Length",
            "min": 0,
            "max": 4000,
            "defaultVal": 50,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Mix",
            "min": 0,
            "max": 100,
            "defaultVal": 90,
            "unit": "%"
        },
        {
            "index": 2,
            "name": "Buffers",
            "min": 1,
            "max": 16,
            "defaultVal": 8
        },
        {
            "index": 3,
            "name": "Repeat Probability",
            "min": 0,
            "max": 99,
            "defaultVal": 70,
            "unit": "%"
        },
        {
            "index": 4,
            "name": "Pitch Modulation Probability",
            "min": 0,
            "max": 100,
            "defaultVal": 5,
            "unit": "%"
        },
        {
            "index": 5,
            "name": "Reverse Probability",
            "min": 0,
            "max": 99,
            "defaultVal": 10,
            "unit": "%"
        },
        {
            "index": 6,
            "name": "Fadeout Probability",
            "min": 0,
            "max": 99,
            "defaultVal": 18,
            "unit": "%"
        },
        {
            "index": 7,
            "name": "Threshold",
            "min": 0,
            "max": 99,
            "defaultVal": 8,
            "unit": "%"
        },
        {
            "index": 8,
            "name": "Glitch Attack",
            "min": 0,
            "max": 99,
            "defaultVal": 15,
            "unit": "%"
        },
        {
            "index": 9,
            "name": "Arpeggiator Mode",
            "min": 0,
            "max": 4,
            "defaultVal": 0
        },
        {
            "index": 10,
            "name": "Tempo Sync",
            "min": 0,
            "max": 64,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Bit Meter",
    "shortName": "Bit Meter (Cockos)",
    "category": "Analysis & Utility",
    "description": "Bit Meter",
    "howItWorks": "",
    "proTips": "",
    "sliders": []
}
,
  {
    "name": "JS: Butterworth 4-Pole Filter",
    "shortName": "Butterworth 4-Pole Filter",
    "category": "EQ & Filtering",
    "description": "Butterworth 4-Pole Filter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Filter Type",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Cutoff (Scale)",
            "min": 0,
            "max": 100,
            "defaultVal": 100
        },
        {
            "index": 3,
            "name": "Resonance",
            "min": 0,
            "max": 0.9,
            "defaultVal": 0
        },
        {
            "index": 4,
            "name": "Output",
            "min": -25,
            "max": 25,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Limiter",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Center Canceler",
    "shortName": "Center Canceler [LOSER]",
    "category": "Analysis & Utility",
    "description": "Center Canceler",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Amount",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        }
    ]
}
,
  {
    "name": "JS: Stereo Channel Volume/Pan/Polarity Control",
    "shortName": "Stereo Channel Volume/Pan/Polarity Control",
    "category": "Analysis & Utility",
    "description": "Stereo Channel Volume/Pan/Polarity Control",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Left Volume",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Left Pan",
            "min": -1,
            "max": 1,
            "defaultVal": -1
        },
        {
            "index": 2,
            "name": "Left Phase",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Right Volume",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Right Pan",
            "min": -1,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 5,
            "name": "Right Phase",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Channel Mapper-Downmixer",
    "shortName": "Channel Mapper-Downmixer (Cockos)",
    "category": "Routing & Utility",
    "description": "Channel Mapper-Downmixer",
    "howItWorks": "",
    "proTips": "",
    "sliders": []
}
,
  {
    "name": "JS: Channel Mixer",
    "shortName": "Channel Mixer [Cockos]",
    "category": "Routing & Utility",
    "description": "Channel Mixer",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "L->L Mix",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "R->R Mix",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "L->R Mix",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "R->L Mix",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Chebyshev 4-Pole Filter",
    "shortName": "Chebyshev 4-Pole Filter [Liteon]",
    "category": "EQ & Filtering",
    "description": "Chebyshev 4-Pole Filter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Processing",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Filter Type",
            "min": 0,
            "max": 2,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Cutoff (Scale)",
            "min": 0,
            "max": 100,
            "defaultVal": 100
        },
        {
            "index": 3,
            "name": "Passband Ripple (Less/More)",
            "min": 0,
            "max": 0.9,
            "defaultVal": 0.3
        },
        {
            "index": 4,
            "name": "Output",
            "min": -25,
            "max": 25,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Limiter",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Chorus (Improved Shaping)",
    "shortName": "Chorus with Improved Shaping [Stillwell]",
    "category": "Modulation",
    "description": "Chorus with Improved Shaping",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Chorus Length",
            "min": 1,
            "max": 250,
            "defaultVal": 15,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Number Of Voices",
            "min": 1,
            "max": 8,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Rate",
            "min": 0.1,
            "max": 16,
            "defaultVal": 0.5,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Pitch Fudge Factor",
            "min": 0,
            "max": 1,
            "defaultVal": 0.7
        },
        {
            "index": 4,
            "name": "Wet Mix",
            "min": -100,
            "max": 12,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Dry Mix",
            "min": -100,
            "max": 12,
            "defaultVal": -6,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Chorus (Stereo)",
    "shortName": "Chorus Stereo [Stillwell]",
    "category": "Modulation",
    "description": "Chorus Stereo",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Chorus Length",
            "min": 1,
            "max": 500,
            "defaultVal": 15,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Number Of Voices",
            "min": 1,
            "max": 8,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Rate (0=tempo sync)",
            "min": 0,
            "max": 16,
            "defaultVal": 0.5,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Pitch Fudge Factor",
            "min": 0,
            "max": 1,
            "defaultVal": 0.7
        },
        {
            "index": 4,
            "name": "Wet Mix",
            "min": -100,
            "max": 12,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Dry Mix",
            "min": -100,
            "max": 12,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Channel Rate Offset",
            "min": -1,
            "max": 1,
            "defaultVal": 0,
            "unit": "Hz"
        },
        {
            "index": 7,
            "name": "Tempo Sync",
            "min": 0.0625,
            "max": 4,
            "defaultVal": 0.25
        }
    ]
}
,
  {
    "name": "JS: Compciter",
    "shortName": "Compciter [LOSER]",
    "category": "Distortion",
    "description": "Compciter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Drive",
            "min": 0,
            "max": 60,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Distortion",
            "min": 0,
            "max": 100,
            "defaultVal": 25,
            "unit": "%"
        },
        {
            "index": 2,
            "name": "Highpass",
            "min": 800,
            "max": 12000,
            "defaultVal": 5000,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "Wet",
            "min": -60,
            "max": 24,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Dry",
            "min": -120,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: DC Filter",
    "shortName": "DC Filter [Cockos]",
    "category": "EQ & Filtering",
    "description": "DC Filter",
    "howItWorks": "",
    "proTips": "",
    "sliders": []
}
,
  {
    "name": "JS: Delay w/Stereo Bounce",
    "shortName": "Delay w/Stereo Bounce [Cockos]",
    "category": "Delay",
    "description": "Delay w/Stereo Bounce",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Update Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Update Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Out Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Out Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Resample On Length Change",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Delay w/Chorus",
    "shortName": "Delay w/Chorus [Cockos]",
    "category": "Delay",
    "description": "Delay w/Chorus",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Feedback",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Output Wet (Chorus)",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Output Wet (Clean)",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Output Dry",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Chorus Period",
            "min": 1,
            "max": 1000,
            "defaultVal": 500,
            "unit": "ms"
        },
        {
            "index": 6,
            "name": "Chorus Length",
            "min": 0,
            "max": 100,
            "defaultVal": 2,
            "unit": "ms"
        }
    ]
}
,
  {
    "name": "JS: Delay (Lo-Fi)",
    "shortName": "Delay (Lo-Fi) [Cockos]",
    "category": "Delay",
    "description": "Delay (Lo-Fi)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Update Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Update Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Out Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Out Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Resolution",
            "min": 1,
            "max": 24,
            "defaultVal": 8,
            "unit": "bits"
        },
        {
            "index": 6,
            "name": "Resample On Length Change",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Delay w/Tempo Ping-Pong",
    "shortName": "Delay with Tempo Ping-Pong [Stillwell]",
    "category": "Delay",
    "description": "Delay with Tempo Ping-Pong",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay (0=tempo sync)",
            "min": 0,
            "max": 13000,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Feedback",
            "min": -120,
            "max": 6,
            "defaultVal": -5,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Mix In",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Output Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Output Dry",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Ping-Pong Width",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 6,
            "name": "Tempo Sync",
            "min": 0.0625,
            "max": 4,
            "defaultVal": 0.25
        }
    ]
}
,
  {
    "name": "JS: Delay w/Sustain",
    "shortName": "Delay w/Sustain [Cockos]",
    "category": "Delay",
    "description": "Delay w/Sustain",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Length",
            "min": 0,
            "max": 4000,
            "defaultVal": 120,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Threshold",
            "min": -120,
            "max": 6,
            "defaultVal": -44,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Attack",
            "min": 0,
            "max": 1000,
            "defaultVal": 10,
            "unit": "ms"
        },
        {
            "index": 3,
            "name": "Release",
            "min": 0,
            "max": 1000,
            "defaultVal": 10,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Maximum Mixing",
            "min": -120,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Output Wet",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Output Dry",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Delay w/Tempo Length",
    "shortName": "Delay with Tempo Length [Stillwell]",
    "category": "Delay",
    "description": "Delay with Tempo Length",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay (ms) (0=tempo sync)",
            "min": 0,
            "max": 13000,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Feedback",
            "min": -120,
            "max": 6,
            "defaultVal": -120,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Mix In",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Output Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Output Dry",
            "min": -120,
            "max": 6,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Resample On Length Change",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 6,
            "name": "Tempo Sync",
            "min": 0.0625,
            "max": 4,
            "defaultVal": 0.25
        }
    ]
}
,
  {
    "name": "JS: Delay w/Tone Control",
    "shortName": "Delay w/Tone Control",
    "category": "Delay",
    "description": "Delay w/Tone Control",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Length",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Feedback",
            "min": -120,
            "max": 6,
            "defaultVal": -4,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Bass Gain",
            "min": -60,
            "max": 60,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Bass Frequency",
            "min": 20,
            "max": 24000,
            "defaultVal": 200,
            "unit": "Hz"
        },
        {
            "index": 4,
            "name": "Treble Gain",
            "min": -60,
            "max": 60,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Treble Frequency",
            "min": 20,
            "max": 24000,
            "defaultVal": 4000,
            "unit": "Hz"
        },
        {
            "index": 6,
            "name": "Output Mix",
            "min": 0,
            "max": 1,
            "defaultVal": 0.5
        }
    ]
}
,
  {
    "name": "JS: Distortion (Fuzz)",
    "shortName": "Distortion (Fuzz)",
    "category": "Distortion",
    "description": "Distortion (Fuzz)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Shape",
            "min": 1,
            "max": 300,
            "defaultVal": 20
        },
        {
            "index": 1,
            "name": "Hard Limit",
            "min": -60,
            "max": 60,
            "defaultVal": -25,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Wet Mix",
            "min": -120,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Dry Mix",
            "min": -120,
            "max": 0,
            "defaultVal": -60,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Channel Mode",
            "min": 0,
            "max": 2,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Bit Reduction/Dither w/Noise Shaping",
    "shortName": "Bit Reduction and Dither with Psychoacoustic Noise Shaping",
    "category": "Utility",
    "description": "Bit Reduction and Dither with Psychoacoustic Noise Shaping",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Output Bit Depth",
            "min": 1,
            "max": 32,
            "defaultVal": 16
        },
        {
            "index": 1,
            "name": "Psychoacoustic Noise Shaping",
            "min": 0,
            "max": 3,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Dither",
            "min": 0,
            "max": 2,
            "defaultVal": 1
        },
        {
            "index": 3,
            "name": "Dither Bit Width (LSB)",
            "min": 1,
            "max": 2,
            "defaultVal": 2
        }
    ]
}
,
  {
    "name": "JS: Delay w/LFO-Modulated Length",
    "shortName": "Delay w/LFO-Modulated Length",
    "category": "Delay",
    "description": "Delay w/LFO-Modulated Length",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Delay",
            "min": 0,
            "max": 4000,
            "defaultVal": 300,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "Update Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Update Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Out Wet",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 4,
            "name": "Out Dry",
            "min": -120,
            "max": 6,
            "defaultVal": -6,
            "unit": "dB"
        },
        {
            "index": 5,
            "name": "Period",
            "min": 0.001,
            "max": 30,
            "defaultVal": 1,
            "unit": "sec"
        },
        {
            "index": 6,
            "name": "Amplitude",
            "min": 0.001,
            "max": 1,
            "defaultVal": 0.3,
            "unit": "ratio"
        }
    ]
}
,
  {
    "name": "JS: Digital Drum Compressor",
    "shortName": "Digital Drum Compressor (DDC) [LOSER]",
    "category": "Dynamics",
    "description": "Digital Drum Compressor",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": -20,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ratio",
            "min": 0,
            "max": 50,
            "defaultVal": 20
        },
        {
            "index": 2,
            "name": "Attack",
            "min": 0,
            "max": 500,
            "defaultVal": 20,
            "unit": "ms"
        },
        {
            "index": 3,
            "name": "Hold",
            "min": 0,
            "max": 500,
            "defaultVal": 0.5,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Release",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "RMS Size",
            "min": 0,
            "max": 1000,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 6,
            "name": "Feed",
            "min": 0,
            "max": 2,
            "defaultVal": 0
        },
        {
            "index": 7,
            "name": "Auto Make-Up",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 8,
            "name": "Output",
            "min": -120,
            "max": 60,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 9,
            "name": "Reduction",
            "min": 0,
            "max": 0,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Digital Versatile Compressor v2",
    "shortName": "Digital Versatile Compressor v2 [LOSER]",
    "category": "Dynamics",
    "description": "Digital Versatile Compressor v2",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -30,
            "max": -0.1,
            "defaultVal": -0.1,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Attack",
            "min": 0,
            "max": 500,
            "defaultVal": 20,
            "unit": "ms"
        },
        {
            "index": 3,
            "name": "Release",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "RMS Size",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "Auto Make-Up",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 6,
            "name": "Output",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "Character",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Digital Versatile Compressor",
    "shortName": "Digital Versatile Compressor (DVC) [LOSER]",
    "category": "Dynamics",
    "description": "Digital Versatile Compressor",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -30,
            "max": -0.1,
            "defaultVal": -0.1,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Attack",
            "min": 0,
            "max": 500,
            "defaultVal": 20,
            "unit": "ms"
        },
        {
            "index": 3,
            "name": "Release",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Auto Make-Up",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 5,
            "name": "Output",
            "min": -12,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Event Horizon Clipper",
    "shortName": "Event Horizon Clipper [Stillwell]",
    "category": "Dynamics",
    "description": "Event Horizon Clipper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -30,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ceiling",
            "min": -20,
            "max": 0,
            "defaultVal": -0.1,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Soft Clip",
            "min": 0,
            "max": 6,
            "defaultVal": 2,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Event Horizon Limiter/Clipper",
    "shortName": "Event Horizon Limiter/Clipper [Stillwell]",
    "category": "Dynamics",
    "description": "Event Horizon Limiter/Clipper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -30,
            "max": 0,
            "defaultVal": 0
        },
        {
            "index": 1,
            "name": "Ceiling",
            "min": -20,
            "max": 0,
            "defaultVal": -0.1
        },
        {
            "index": 2,
            "name": "Release",
            "min": 0,
            "max": 1200,
            "defaultVal": 30,
            "unit": "ms"
        }
    ]
}
,
  {
    "name": "JS: Exciter (Treble Enhancer)",
    "shortName": "Exciter (Treble Enhancer) [Stillwell]",
    "category": "Exciter",
    "description": "Exciter (Treble Enhancer)",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Mix",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 2,
            "name": "Frequency",
            "min": 2000,
            "max": 10000,
            "defaultVal": 5000,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: Gaussian Noise Generator",
    "shortName": "Gaussian Noise Generator [Schwa]",
    "category": "Analysis & Utility",
    "description": "Gaussian Noise Generator",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Noise dB (RMS)",
            "min": -120,
            "max": 6,
            "defaultVal": -18,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Wet Mix",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Gaussian Generator",
            "min": 0,
            "max": 3,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Noise Mean",
            "min": -1,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 4,
            "name": "Noise Standard Deviation",
            "min": 0,
            "max": 2,
            "defaultVal": 1
        }
    ]
}
,
  {
    "name": "JS: Frequency Spectrum Analyzer Meter",
    "shortName": "Frequency Spectrum Analyzer Meter (Cockos)",
    "category": "Analysis & Utility",
    "description": "Frequency Spectrum Analyzer Meter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "FFT size",
            "min": 0,
            "max": 11,
            "defaultVal": 6
        },
        {
            "index": 1,
            "name": "floor",
            "min": -450,
            "max": -12,
            "defaultVal": -120,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "show phase",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "window",
            "min": 0,
            "max": 3,
            "defaultVal": 2
        },
        {
            "index": 4,
            "name": "integration time",
            "min": 0,
            "max": 2500,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "slope",
            "min": 0,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB/octave"
        },
        {
            "index": 6,
            "name": "octave gain center",
            "min": 10,
            "max": 10000,
            "defaultVal": 1000,
            "unit": "Hz"
        }
    ]
}
,
  {
    "name": "JS: Goniometer",
    "shortName": "Goniometer [LOSER]",
    "category": "Analysis & Utility",
    "description": "Goniometer",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Display",
            "min": 0,
            "max": 2,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Oscilloscope Meter",
    "shortName": "Oscilloscope Meter (Cockos)",
    "category": "Analysis & Utility",
    "description": "Oscilloscope Meter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "view size",
            "min": 1,
            "max": 5000,
            "defaultVal": 100,
            "unit": "ms"
        },
        {
            "index": 1,
            "name": "vzoom",
            "min": -450,
            "max": 36,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "retrig",
            "min": 0,
            "max": 3,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Spectrograph Spectrogram Meter",
    "shortName": "Spectrograph Spectrogram Meter (Cockos)",
    "category": "Analysis & Utility",
    "description": "Spectrograph Spectrogram Meter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "FFT size",
            "min": 0,
            "max": 11,
            "defaultVal": 6
        },
        {
            "index": 1,
            "name": "window",
            "min": 0,
            "max": 3,
            "defaultVal": 2
        },
        {
            "index": 2,
            "name": "gate",
            "min": -180,
            "max": 6,
            "defaultVal": -180,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "frequency curve",
            "min": 0,
            "max": 10,
            "defaultVal": 0
        },
        {
            "index": 4,
            "name": "scroll",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 5,
            "name": "rate",
            "min": 1,
            "max": 40,
            "defaultVal": 1
        }
    ]
}
,
  {
    "name": "JS: Graphical Dynamic Waveshaper",
    "shortName": "Graphical Dynamic Waveshaper",
    "category": "Distortion",
    "description": "Graphical Dynamic Waveshaper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Mirror",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 1,
            "name": "Wet Mix",
            "min": -144,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Dry Mix",
            "min": -144,
            "max": 24,
            "defaultVal": -144,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Oversampling",
            "min": 1,
            "max": 32,
            "defaultVal": 1
        },
        {
            "index": 4,
            "name": "Integration Time",
            "min": 0.1,
            "max": 100,
            "defaultVal": 5,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "Dynamic Floor",
            "min": -100,
            "max": 6,
            "defaultVal": -50,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Dynamic Positioning",
            "min": -60,
            "max": 60,
            "defaultVal": -6,
            "unit": "dB"
        }
    ]
}
,
  {
    "name": "JS: Graphical Waveshaper",
    "shortName": "Graphical Waveshaper",
    "category": "Distortion",
    "description": "Graphical Waveshaper",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Mirror",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 1,
            "name": "Wet Mix",
            "min": -144,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 2,
            "name": "Dry Mix",
            "min": -144,
            "max": 24,
            "defaultVal": -144,
            "unit": "dB"
        },
        {
            "index": 3,
            "name": "Oversampling",
            "min": 1,
            "max": 32,
            "defaultVal": 1
        }
    ]
}
,
  {
    "name": "JS: Mid/Side Decoder",
    "shortName": "Mid/Side Decoder",
    "category": "Analysis & Utility",
    "description": "Mid/Side Decoder",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Center Level",
            "min": -120,
            "max": 24,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Output Swap",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "Center Position",
            "min": -1,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Mid/Side Encoder",
    "shortName": "Mid/Side Encoder",
    "category": "Analysis & Utility",
    "description": "Mid/Side Encoder",
    "howItWorks": "",
    "proTips": "",
    "sliders": []
}
,
  {
    "name": "JS: Loop Sampler w/MIDI Triggers",
    "shortName": "Loop Sampler w/MIDI Triggers",
    "category": "Sampler",
    "description": "Loop Sampler w/MIDI Triggers",
    "howItWorks": "",
    "proTips": "",
    sliders: [
      {"index":0,"name":"Rate (Hz)","min":0,"max":10,"defaultVal":0.5},
      {"index":1,"name":"Range Min (Hz)","min":40,"max":20000,"defaultVal":440},
      {"index":2,"name":"Range Max (Hz)","min":40,"max":20000,"defaultVal":1600},
      {"index":3,"name":"Feedback (dB)","min":-120,"max":-1,"defaultVal":-3},
      {"index":4,"name":"Wet Mix (dB)","min":-120,"max":12,"defaultVal":0}
    ]
  }
,
  {
    "name": "JS: Loop Sampler",
    "shortName": "Loop Sampler",
    "category": "Sampler",
    "description": "Loop Sampler",
    "howItWorks": "",
    "proTips": "",
    sliders: [
      {"index":0,"name":"Loop Volume","min":-120,"max":12,"defaultVal":0,"unit":"dB"},
      {"index":1,"name":"Play Speed (neg=reverse)","min":-8,"max":8,"defaultVal":1},
      {"index":2,"name":"Play Start Position","min":0,"max":30000,"defaultVal":0,"unit":"ms"},
      {"index":3,"name":"Play End Position","min":0,"max":30000,"defaultVal":0,"unit":"ms"},
      {"index":4,"name":"Trigger Base","min":0,"max":10,"defaultVal":1},
      {"index":5,"name":"Edge Overlap","min":0,"max":1000,"defaultVal":10,"unit":"ms"},
      {"index":6,"name":"Silence Removal Threshold","min":-120,"max":0,"defaultVal":-120,"unit":"dB"},
      {"index":7,"name":"State","min":0,"max":6,"defaultVal":0}
    ]
  },
  {
    "name": "JS: Lorenz Attractor",
    "shortName": "Lorenz Attractor [Liteon]",
    "category": "Analysis & Utility",
    "description": "Lorenz Attractor",
    "howItWorks": "",
    "proTips": "",
    sliders: [
      {"index":0,"name":"Rate (Fast/Slow)","min":1,"max":10000,"defaultVal":3000},
      {"index":1,"name":"Plot (OSC 1+2/1)","min":0,"max":1,"defaultVal":0},
      {"index":2,"name":"Prandtl Number","min":10,"max":28,"defaultVal":14},
      {"index":3,"name":"Rayleigh Number","min":14,"max":46,"defaultVal":28},
      {"index":4,"name":"Color (Mod Min/Max)","min":0,"max":1,"defaultVal":0.5},
      {"index":5,"name":"Tune","min":-4,"max":4,"defaultVal":0},
      {"index":6,"name":"Gain","min":-25,"max":25,"defaultVal":0,"unit":"dB"}
    ]
  },
  {
    "name": "JS: Granular Loop Sampler",
    "shortName": "Granular Loop Sampler",
    "category": "Sampler",
    "description": "Granular Loop Sampler",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Loop Volume",
            "min": -120,
            "max": 12,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Play Speed (neg=reverse)",
            "min": -8,
            "max": 8,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Trigger Base",
            "min": 0,
            "max": 10,
            "defaultVal": 1
        },
        {
            "index": 3,
            "name": "Length",
            "min": 0,
            "max": 30000,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Loop Granularity",
            "min": 0,
            "max": 30000,
            "defaultVal": 1000,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "Maximum Length",
            "min": 0,
            "max": 30000,
            "defaultVal": 16000,
            "unit": "ms"
        },
        {
            "index": 6,
            "name": "Silence Removal Threshold",
            "min": -120,
            "max": 0,
            "defaultVal": -120,
            "unit": "dB"
        },
        {
            "index": 7,
            "name": "State",
            "min": 0,
            "max": 6,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Loudness Meter Peak/RMS/LUFS",
    "shortName": "Loudness Meter Peak/RMS/LUFS (Cockos)",
    "category": "Analysis & Utility",
    "description": "Loudness Meter Peak/RMS/LUFS",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Peak",
            "min": 0,
            "max": 4,
            "defaultVal": 4
        },
        {
            "index": 1,
            "name": "RMS momentary",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 2,
            "name": "RMS integrated",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "LUFS momentary",
            "min": 0,
            "max": 2,
            "defaultVal": 2
        },
        {
            "index": 4,
            "name": "LUFS short-term",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 5,
            "name": "LRA loudness range",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 6,
            "name": "LUFS integrated",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 7,
            "name": "LUFS alerts",
            "min": 0,
            "max": 3,
            "defaultVal": 0
        },
        {
            "index": 8,
            "name": "Yellow alert level",
            "min": -60,
            "max": 0,
            "defaultVal": -12
        },
        {
            "index": 9,
            "name": "Red alert level",
            "min": -60,
            "max": 0,
            "defaultVal": -6
        },
        {
            "index": 10,
            "name": "Reset on playback start",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        },
        {
            "index": 11,
            "name": "Force mono analysis",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 12,
            "name": "Text size",
            "min": -2,
            "max": 8,
            "defaultVal": 0
        },
        {
            "index": 13,
            "name": "Y axis scaling",
            "min": 0.5,
            "max": 4,
            "defaultVal": 1.8
        },
        {
            "index": 14,
            "name": "Output loudness values as automation",
            "min": 0,
            "max": 16,
            "defaultVal": 0
        },
        {
            "index": 29,
            "name": "Peak/True peak dB (output)",
            "min": -150,
            "max": 20,
            "defaultVal": -150
        },
        {
            "index": 30,
            "name": "RMS-M (output)",
            "min": -100,
            "max": 0,
            "defaultVal": -100
        },
        {
            "index": 31,
            "name": "RMS-I (output)",
            "min": -100,
            "max": 0,
            "defaultVal": -100
        },
        {
            "index": 32,
            "name": "LUFS-M (output)",
            "min": -100,
            "max": 0,
            "defaultVal": -100
        },
        {
            "index": 33,
            "name": "LUFS-S (output)",
            "min": -100,
            "max": 0,
            "defaultVal": -100
        },
        {
            "index": 34,
            "name": "LUFS-I (output)",
            "min": -100,
            "max": 0,
            "defaultVal": -100
        },
        {
            "index": 35,
            "name": "LRA (output)",
            "min": 0,
            "max": 100,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Louderizer LP",
    "shortName": "Louderizer LP [Stillwell]",
    "category": "Saturation",
    "description": "Louderizer LP",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Mix",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 2,
            "name": "LP Frequency",
            "min": 1,
            "max": 22000,
            "defaultVal": 22000,
            "unit": "Hz"
        },
        {
            "index": 3,
            "name": "LP Size (1/Q)",
            "min": 0,
            "max": 1,
            "defaultVal": 0.2
        },
        {
            "index": 4,
            "name": "Drive Circuit",
            "min": 0,
            "max": 1,
            "defaultVal": 1
        }
    ]
}
,
  {
    "name": "JS: Louderizer",
    "shortName": "Louderizer [stillwell]",
    "category": "Saturation",
    "description": "Louderizer",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Mix",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        },
        {
            "index": 1,
            "name": "Drive",
            "min": 0,
            "max": 100,
            "defaultVal": 0,
            "unit": "%"
        }
    ]
}
,
  {
    "name": "JS: Major Tom Compressor",
    "shortName": "Major Tom Compressor [Stillwell]",
    "category": "Dynamics",
    "description": "Major Tom Compressor",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -60,
            "max": 0,
            "defaultVal": 0,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Ratio",
            "min": 1,
            "max": 20,
            "defaultVal": 1
        },
        {
            "index": 2,
            "name": "Gain",
            "min": -20,
            "max": 20,
            "defaultVal": 0
        },
        {
            "index": 3,
            "name": "Knee",
            "min": 0,
            "max": 3,
            "defaultVal": 2
        },
        {
            "index": 4,
            "name": "Detector Input",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 5,
            "name": "Automatic Make-Up",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 6,
            "name": "Detection",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        },
        {
            "index": 7,
            "name": "Detection Source",
            "min": 0,
            "max": 1,
            "defaultVal": 0
        }
    ]
}
,
  {
    "name": "JS: Master Limiter",
    "shortName": "Master Limiter [LOSER]",
    "category": "Dynamics",
    "description": "Master Limiter",
    "howItWorks": "",
    "proTips": "",
    "sliders": [
        {
            "index": 0,
            "name": "Threshold",
            "min": -20,
            "max": -0.1,
            "defaultVal": -3,
            "unit": "dB"
        },
        {
            "index": 1,
            "name": "Look Ahead",
            "min": 0,
            "max": 1000,
            "defaultVal": 200,
            "unit": "us"
        },
        {
            "index": 2,
            "name": "Attack",
            "min": 0,
            "max": 1000,
            "defaultVal": 100,
            "unit": "us"
        },
        {
            "index": 3,
            "name": "Hold",
            "min": 0,
            "max": 10,
            "defaultVal": 0,
            "unit": "ms"
        },
        {
            "index": 4,
            "name": "Release",
            "min": 0,
            "max": 1000,
            "defaultVal": 250,
            "unit": "ms"
        },
        {
            "index": 5,
            "name": "Limit",
            "min": -6,
            "max": 0,
            "defaultVal": -0.1,
            "unit": "dB"
        },
        {
            "index": 6,
            "name": "Reduction",
            "min": -20,
            "max": 0,
            "defaultVal": 0
        }
    ]
},
  {
      "name": "JS: Master Tom Compressor",
      "shortName": "Master Tom Compressor [Stillwell]",
      "category": "Dynamics",
      "description": "Master Tom Compressor",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -60,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Ratio",
              "min": 1,
              "max": 20,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Gain",
              "min": -20,
              "max": 20,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Knee",
              "min": 0,
              "max": 3,
              "defaultVal": 2
          },
          {
              "index": 4,
              "name": "Detector Input",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Automatic Make-Up",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Detection",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Detection Source",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MDCT Filter",
      "shortName": "MDCT Filter",
      "category": "Filter",
      "description": "MDCT Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Bands",
              "min": 32,
              "max": 512,
              "defaultVal": 128
          },
          {
              "index": 1,
              "name": "Start Band",
              "min": 0,
              "max": 512,
              "defaultVal": 4
          },
          {
              "index": 2,
              "name": "End Band",
              "min": 0,
              "max": 512,
              "defaultVal": 8
          },
          {
              "index": 3,
              "name": "Adjust",
              "min": -120,
              "max": 120,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: MDCT Shifter",
      "shortName": "MDCT Shifter",
      "category": "Pitch",
      "description": "MDCT Shifter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Bands",
              "min": 32,
              "max": 512,
              "defaultVal": 128
          },
          {
              "index": 1,
              "name": "Band Shift (neg=down, pos=up)",
              "min": -512,
              "max": 512,
              "defaultVal": 4
          }
      ]
  },
  {
      "name": "JS: MDCT Sweeping Filter",
      "shortName": "MDCT Sweeping Filter",
      "category": "Filter",
      "description": "MDCT Sweeping Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Min Frequency (0..1)",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Max Frequency (0..1)",
              "min": 0,
              "max": 1,
              "defaultVal": 0.05
          },
          {
              "index": 2,
              "name": "Sweep Interval",
              "min": 10,
              "max": 30000,
              "defaultVal": 1000,
              "unit": "ms"
          },
          {
              "index": 3,
              "name": "Low Gain",
              "min": -120,
              "max": 120,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "High Gain",
              "min": -120,
              "max": 120,
              "defaultVal": 12,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: MGA JS Limiter",
      "shortName": "MGA JS Limiter",
      "category": "Dynamics",
      "description": "MGA JS Limiter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -30,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Release",
              "min": 0,
              "max": 500,
              "defaultVal": 200,
              "unit": "ms"
          },
          {
              "index": 2,
              "name": "Ceiling",
              "min": -6,
              "max": 0,
              "defaultVal": -0.1
          }
      ]
  },
  {
      "name": "JS: MGA JS Limiter (Unlinked Stereo)",
      "shortName": "MGA JS Limiter (Unlinked Stereo)",
      "category": "Dynamics",
      "description": "MGA JS Limiter (Unlinked Stereo)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -30,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Release",
              "min": 0,
              "max": 500,
              "defaultVal": 200,
              "unit": "ms"
          },
          {
              "index": 2,
              "name": "Link Stereo",
              "min": 0,
              "max": 100,
              "defaultVal": 75,
              "unit": "%"
          },
          {
              "index": 3,
              "name": "Ceiling",
              "min": -6,
              "max": 0,
              "defaultVal": -0.1
          }
      ]
  },
  {
      "name": "JS: MIDI Arpeggiator",
      "shortName": "MIDI Arpeggiator",
      "category": "MIDI",
      "description": "MIDI Arpeggiator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Rate (x BPM)",
              "min": 0,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Note Length",
              "min": 0.01,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Number Of Variants",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Variant 1",
              "min": -64,
              "max": 64,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Variant 2",
              "min": -64,
              "max": 64,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Variant 3",
              "min": -64,
              "max": 64,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Velocity (0=use played velocity)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI CC Mapper",
      "shortName": "MIDI CC Mapper",
      "category": "MIDI",
      "description": "MIDI CC Mapper",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Controller Source",
              "min": 0,
              "max": 127,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Controller Target",
              "min": 0,
              "max": 127,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Clamp Low Value",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Clamp High Value",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 4,
              "name": "Pass Through CC Source",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI CC LFO Generator",
      "shortName": "MIDI CC LFO Generator [IXix]",
      "category": "MIDI",
      "description": "MIDI CC LFO Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Controller",
              "min": 0,
              "max": 127,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Center",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Range (+/-)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Off Value",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "LFO Shape",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "LFO Frequency",
              "min": 0,
              "max": 32,
              "defaultVal": 1
          },
          {
              "index": 7,
              "name": "LFO Units",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 8,
              "name": "Updates Per Beat",
              "min": 0,
              "max": 9,
              "defaultVal": 6
          },
          {
              "index": 9,
              "name": "On/Off",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Choke Group",
      "shortName": "MIDI Choke Group",
      "category": "MIDI",
      "description": "MIDI Choke Group",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Channel",
              "min": 1,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Choke Note Range Start",
              "min": 0,
              "max": 127,
              "defaultVal": 60
          },
          {
              "index": 2,
              "name": "Number Of Choke Notes",
              "min": 1,
              "max": 128,
              "defaultVal": 8
          }
      ]
  },
  {
      "name": "JS: MIDI Chorderizer",
      "shortName": "MIDI Chorderizer",
      "category": "MIDI",
      "description": "MIDI Chorderizer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Voice 1 Offset (st)",
              "min": 1,
              "max": 24,
              "defaultVal": 5,
              "unit": "st"
          },
          {
              "index": 1,
              "name": "Voice 2 Offset (st)",
              "min": 1,
              "max": 24,
              "defaultVal": 0,
              "unit": "st"
          },
          {
              "index": 2,
              "name": "Voice 3 Offset (st)",
              "min": 1,
              "max": 24,
              "defaultVal": 0,
              "unit": "st"
          },
          {
              "index": 3,
              "name": "Voice 4 Offset (st)",
              "min": 1,
              "max": 24,
              "defaultVal": 0,
              "unit": "st"
          },
          {
              "index": 4,
              "name": "Velocity Scale @ 1",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 5,
              "name": "Velocity Scale @ 4",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 6,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI Chord In Key",
      "shortName": "MIDI Chord In Key",
      "category": "MIDI",
      "description": "MIDI Chord In Key",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Notes In Key Advance For Note 1",
              "min": -24,
              "max": 24,
              "defaultVal": 2
          },
          {
              "index": 1,
              "name": "Notes In Key Advance For Note 2",
              "min": -24,
              "max": 24,
              "defaultVal": 4
          },
          {
              "index": 2,
              "name": "Key",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Velocity Scale For Additional Notes",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 4,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI Choke",
      "shortName": "MIDI Choke",
      "category": "MIDI",
      "description": "MIDI Choke",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Channel",
              "min": 1,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Choke Note Range Start",
              "min": 0,
              "max": 127,
              "defaultVal": 42
          },
          {
              "index": 2,
              "name": "Number Of Choke Notes",
              "min": 1,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 3,
              "name": "Affected Note Range Start",
              "min": 0,
              "max": 127,
              "defaultVal": 46
          },
          {
              "index": 4,
              "name": "Number Of Affected Notes",
              "min": 1,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 5,
              "name": "Action During Choke",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Additional Choke Note",
              "min": -1,
              "max": 127,
              "defaultVal": -1
          },
          {
              "index": 7,
              "name": "Additional Choke Note",
              "min": -1,
              "max": 127,
              "defaultVal": -1
          },
          {
              "index": 8,
              "name": "Additional Choke Note",
              "min": -1,
              "max": 127,
              "defaultVal": -1
          },
          {
              "index": 9,
              "name": "Additional Choke Note",
              "min": -1,
              "max": 127,
              "defaultVal": -1
          }
      ]
  },
  {
      "name": "JS: MIDI Delay",
      "shortName": "MIDI Delay",
      "category": "MIDI",
      "description": "MIDI Delay",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Delay",
              "min": 0,
              "max": 1000,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Delay (QN)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Delay (samples)",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Channel (0=omni)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Bus (0=all buses)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Duplicate Note Filter",
      "shortName": "MIDI Duplicate Note Filter [IXix]",
      "category": "MIDI",
      "description": "MIDI Duplicate Note Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI EQ Ducker",
      "shortName": "MIDI EQ Ducker [LOSER]",
      "category": "EQ & Filtering",
      "description": "MIDI EQ Ducker",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Note #",
              "min": 0,
              "max": 129,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Attack",
              "min": 0,
              "max": 75,
              "defaultVal": 10,
              "unit": "ms"
          },
          {
              "index": 2,
              "name": "Attack Shape",
              "min": 0,
              "max": 4,
              "defaultVal": 1
          },
          {
              "index": 3,
              "name": "Release",
              "min": 0,
              "max": 500,
              "defaultVal": 100,
              "unit": "ms"
          },
          {
              "index": 4,
              "name": "Release Shape",
              "min": 0,
              "max": 4,
              "defaultVal": 1
          },
          {
              "index": 5,
              "name": "Frequency Coarse",
              "min": 0,
              "max": 15000,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 6,
              "name": "Frequency Fine",
              "min": 0,
              "max": 100,
              "defaultVal": 60,
              "unit": "Hz"
          },
          {
              "index": 7,
              "name": "Width",
              "min": 0,
              "max": 2,
              "defaultVal": 1,
              "unit": "Oct"
          },
          {
              "index": 8,
              "name": "Volume",
              "min": -32,
              "max": 32,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 9,
              "name": "Mode",
              "min": 0,
              "max": 4,
              "defaultVal": 0
          },
          {
              "index": 10,
              "name": "Gate/Pump React To MIDI Velocity",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Examiner",
      "shortName": "MIDI Examiner [Schwa]",
      "category": "Analysis & Utility",
      "description": "MIDI Examiner",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Sample Offset Within @block",
              "min": 0,
              "max": 255,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Status Byte",
              "min": 0,
              "max": 255,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Data Byte 1",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Data Byte 2",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Status High Bits",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Status Low Bits",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Status High Bits Interpretation",
              "min": 0,
              "max": 8,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Snap To Key",
      "shortName": "MIDI Snap To Key [IXix]",
      "category": "MIDI",
      "description": "MIDI Snap To Key",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 3,
              "name": "Root Note",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Scale File",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 6,
              "name": "On/Off",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Map To Key v2",
      "shortName": "MIDI Map To Key v2 [IXix]",
      "category": "MIDI",
      "description": "MIDI Map To Key v2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Mapping File",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note In",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Note Out",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Reload Mapping",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Map To Key",
      "shortName": "MIDI Map To Key",
      "category": "MIDI",
      "description": "MIDI Map To Key",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Key",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI Note Filter",
      "shortName": "MIDI Note Filter",
      "category": "MIDI",
      "description": "MIDI Note Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 21
          },
          {
              "index": 1,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 108
          },
          {
              "index": 2,
              "name": "Other events (CC, etc) pass through",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Logger",
      "shortName": "MIDI Logger",
      "category": "MIDI",
      "description": "MIDI Logger",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "note-on/off analysis mode",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Note Hold",
      "shortName": "MIDI Note Hold",
      "category": "MIDI",
      "description": "MIDI Note Hold",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Channel (0=omni)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Note Repeater",
      "shortName": "MIDI Note Repeater",
      "category": "MIDI",
      "description": "MIDI Note Repeater",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Size",
              "min": 0.1,
              "max": 4,
              "defaultVal": 1,
              "unit": "beats"
          }
      ]
  },
  {
      "name": "JS: MIDI note sanitizer",
      "shortName": "MIDI note sanitizer",
      "category": "MIDI",
      "description": "MIDI note sanitizer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "retrigger threshold (1/32nds, 0=no retrigger)",
              "min": 0,
              "max": 128,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Route Note To Channel",
      "shortName": "MIDI Route Note To Channel",
      "category": "MIDI",
      "description": "MIDI Route Note To Channel",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Note",
              "min": 0,
              "max": 127,
              "defaultVal": 60
          },
          {
              "index": 1,
              "name": "Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Router/Transpose",
      "shortName": "MIDI Router/Transpose [IXix]",
      "category": "MIDI",
      "description": "MIDI Router/Transpose",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Output Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 3
          },
          {
              "index": 3,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 5,
              "name": "Transpose",
              "min": -60,
              "max": 60,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Tool v2",
      "shortName": "MIDI Tool v2 [IXix]",
      "category": "MIDI",
      "description": "MIDI Tool v2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 3,
              "name": "Input Velocity Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Input Velocity Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 5,
              "name": "Input Velocity Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Velocity Scaling(%)",
              "min": 0,
              "max": 1000,
              "defaultVal": 100
          },
          {
              "index": 7,
              "name": "Random Velocity (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 8,
              "name": "Output Velocity Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 9,
              "name": "Output Velocity Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 10,
              "name": "Transpose (semitones)",
              "min": -60,
              "max": 60,
              "defaultVal": 0
          },
          {
              "index": 11,
              "name": "Random Pitch (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 12,
              "name": "Pitch Reset",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 13,
              "name": "Output Channel",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 14,
              "name": "Controller Routing",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Tool",
      "shortName": "MIDI Tool [IXix]",
      "category": "MIDI",
      "description": "MIDI Tool",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 3,
              "name": "Input Velocity Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Input Velocity Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 5,
              "name": "Random Velocity (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Output Velocity Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Output Velocity Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 8,
              "name": "Transpose (st)",
              "min": -60,
              "max": 60,
              "defaultVal": 0
          },
          {
              "index": 9,
              "name": "Random Pitch (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 10,
              "name": "Output Channel",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Transpose Notes",
      "shortName": "MIDI Transpose Notes",
      "category": "MIDI",
      "description": "MIDI Transpose Notes",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Transpose Semitones",
              "min": -64,
              "max": 64,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Premultiply",
              "min": -16,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI Pattern/Scale Variation Generator",
      "shortName": "MIDI Pattern/Scale Variation Generator [IXix]",
      "category": "MIDI",
      "description": "MIDI Pattern/Scale Variation Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 3,
              "name": "Root Note",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Scale File",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Low Octave",
              "min": 0,
              "max": 10,
              "defaultVal": 5
          },
          {
              "index": 6,
              "name": "High Octave",
              "min": 0,
              "max": 10,
              "defaultVal": 5
          },
          {
              "index": 7,
              "name": "Sequence File",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 8,
              "name": "On/Off",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Velocity Variation Generator",
      "shortName": "MIDI Velocity Variation Generator [IXix]",
      "category": "MIDI",
      "description": "MIDI Velocity Variation Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Min",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Note Max",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 3,
              "name": "Base Velocity",
              "min": 0,
              "max": 127,
              "defaultVal": 64
          },
          {
              "index": 4,
              "name": "Variation (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Sequence File",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "On/Off",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Velocity Control",
      "shortName": "MIDI Velocity Control",
      "category": "MIDI",
      "description": "MIDI Velocity Control",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Velocity Multiply",
              "min": -16,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Velocity Add",
              "min": -128,
              "max": 128,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Min Velocity",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Max Velocity",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          },
          {
              "index": 4,
              "name": "Lowest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Highest Key (MIDI Note #)",
              "min": 0,
              "max": 127,
              "defaultVal": 127
          }
      ]
  },
  {
      "name": "JS: MIDI Pitch Wheel LFO",
      "shortName": "MIDI Pitch Wheel LFO Generator [IXix]",
      "category": "MIDI",
      "description": "MIDI Pitch Wheel LFO",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Max Bend (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "LFO Frequency",
              "min": 0,
              "max": 24,
              "defaultVal": 1
          },
          {
              "index": 3,
              "name": "LFO Units",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Updates Per Beat",
              "min": 0,
              "max": 9,
              "defaultVal": 6
          },
          {
              "index": 5,
              "name": "On/Off",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Note-On Delay",
      "shortName": "MIDI Note-On Delay",
      "category": "MIDI",
      "description": "MIDI Note-On Delay",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Max Delay Samples",
              "min": 0,
              "max": 4096,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: 8x Stereo to 1x Stereo Mixer",
      "shortName": "8x Stereo to 1x Stereo Mixer [IXix]",
      "category": "Mixer",
      "description": "8x Stereo to 1x Stereo Mixer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Level 1+2",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Level 3+4",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Level 5+6",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Level 7+8",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "Level 9+10",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 5,
              "name": "Level 11+12",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Level 13+14",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "Level 15+16",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Moog 4-Pole Filter",
      "shortName": "Moog 4-Pole Filter",
      "category": "Filter",
      "description": "Moog 4-Pole Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Processing",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Filter Type",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Cutoff (Scale)",
              "min": 0,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 3,
              "name": "Resonance",
              "min": 0,
              "max": 0.85,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Drive (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Output",
              "min": -25,
              "max": 25,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Limiter",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Oversample (x2)",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: 8x Mono to 1x Stereo Mixer",
      "shortName": "8x Mono to 1x Stereo Mixer [IXix]",
      "category": "Mixer",
      "description": "8x Mono to 1x Stereo Mixer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Level 1",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Level 2",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Level 3",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Level 4",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "Level 5",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 5,
              "name": "Level 6",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Level 7",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "Level 8",
              "min": -120,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 8,
              "name": "Pan 1 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 9,
              "name": "Pan 2 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 10,
              "name": "Pan 3 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 11,
              "name": "Pan 4 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 12,
              "name": "Pan 5 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 13,
              "name": "Pan 6 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 14,
              "name": "Pan 7 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 15,
              "name": "Pan 8 L<>R",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MTC Logger",
      "shortName": "MTC Logger",
      "category": "Analysis & Utility",
      "description": "MTC Logger",
      "howItWorks": "",
      "proTips": "",
      "sliders": []
  },
  {
      "name": "JS: Non-Linear Processor",
      "shortName": "Non-Linear Processor",
      "category": "Distortion",
      "description": "Non-Linear Processor",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Saturation Amount (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 30
          },
          {
              "index": 1,
              "name": "Fluctuation Amount (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 50
          },
          {
              "index": 2,
              "name": "Noise Floor At",
              "min": 0,
              "max": 32,
              "defaultVal": 16,
              "unit": "Bits"
          },
          {
              "index": 3,
              "name": "Output",
              "min": -24,
              "max": 24,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "Output Polarity",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: NP1136 Peak Limiter",
      "shortName": "NP1136 Peak Limiter",
      "category": "Dynamics",
      "description": "NP1136 Peak Limiter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -40,
              "max": 0,
              "defaultVal": -12,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Ratio (20:1 - PD Mode)",
              "min": 1,
              "max": 20,
              "defaultVal": 4
          },
          {
              "index": 2,
              "name": "Attack",
              "min": 0,
              "max": 100,
              "defaultVal": 30,
              "unit": "us"
          },
          {
              "index": 3,
              "name": "Release",
              "min": 0,
              "max": 100,
              "defaultVal": 45,
              "unit": "ms"
          },
          {
              "index": 4,
              "name": "Detector HP",
              "min": 0,
              "max": 100,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 5,
              "name": "GR Limit",
              "min": -40,
              "max": 0,
              "defaultVal": -18,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Makeup Gain",
              "min": 0,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "Tilt EQ Center",
              "min": 0,
              "max": 100,
              "defaultVal": 50,
              "unit": "Hz"
          },
          {
              "index": 8,
              "name": "Tilt EQ Low/High",
              "min": -6,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 9,
              "name": "Wet Mix (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 10,
              "name": "Processing Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 11,
              "name": "Detector Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 12,
              "name": "Detector Input",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 13,
              "name": "Hard Clip",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Pitch an Octave Down",
      "shortName": "Pitch an Octave Down",
      "category": "Pitch",
      "description": "Pitch an Octave Down",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Chunk",
              "min": 4,
              "max": 500,
              "defaultVal": 150,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Overlap",
              "min": 0,
              "max": 1,
              "defaultVal": 0.5
          },
          {
              "index": 2,
              "name": "Wet Mix",
              "min": -120,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Dry Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -120,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Pitch an Octave Up",
      "shortName": "Pitch an Octave Up",
      "category": "Pitch",
      "description": "Pitch an Octave Up",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Chunk",
              "min": 4,
              "max": 500,
              "defaultVal": 120,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Overlap",
              "min": 0,
              "max": 1,
              "defaultVal": 0.4
          },
          {
              "index": 2,
              "name": "Wet Mix",
              "min": -120,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Dry Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -120,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Paranoia Mangler",
      "shortName": "paranoia mangler [remaincalm.org]",
      "category": "Distortion",
      "description": "Paranoia Mangler",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Gain",
              "min": -24,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Dry Out",
              "min": -96,
              "max": 12,
              "defaultVal": -3,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Wet Out",
              "min": -96,
              "max": 12,
              "defaultVal": -3,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Bad Resampler",
              "min": 125,
              "max": 33150,
              "defaultVal": 12000,
              "unit": "Hz"
          },
          {
              "index": 4,
              "name": "Bitcrusher",
              "min": 0,
              "max": 2,
              "defaultVal": 1
          },
          {
              "index": 5,
              "name": "Thermonuclear War",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Bitdepth",
              "min": 3,
              "max": 10,
              "defaultVal": 8
          },
          {
              "index": 7,
              "name": "Gate (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 12,
              "name": "Love (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 75
          },
          {
              "index": 13,
              "name": "Jive (%)",
              "min": 0,
              "max": 150,
              "defaultVal": 15
          },
          {
              "index": 14,
              "name": "Attitude",
              "min": 0,
              "max": 3,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: Channel Router w/Polarity",
      "shortName": "Channel Router w/Polarity [IXix]",
      "category": "Routing",
      "description": "Channel Router w/Polarity",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channels",
              "min": 0,
              "max": 31,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Polarity Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Output Channels",
              "min": 0,
              "max": 31,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Output Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Channel Phase Meter",
      "shortName": "Channel Phase Meter",
      "category": "Analysis & Utility",
      "description": "Channel Phase Meter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Sample Rate",
              "min": 0,
              "max": 192000,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Output",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Stereo Channels",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Check Interval",
              "min": 0,
              "max": 1000,
              "defaultVal": 200,
              "unit": "ms"
          }
      ]
  },
  {
      "name": "JS: Pink Noise Generator",
      "shortName": "Pink Noise Generator",
      "category": "Synthesis",
      "description": "Pink Noise Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Noise",
              "min": -25,
              "max": 25,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Dry",
              "min": -25,
              "max": 25,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Output",
              "min": -25,
              "max": 25,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Pitch Down-Shifter 2",
      "shortName": "Pitch Down-Shifter 2",
      "category": "Pitch",
      "description": "Pitch Down-Shifter 2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Octaves Down",
              "min": 0,
              "max": 6,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "Semitones Down",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Cents Down",
              "min": 0,
              "max": 99,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Chunk Size (ms)",
              "min": 4,
              "max": 500,
              "defaultVal": 250
          },
          {
              "index": 4,
              "name": "Overlap Size",
              "min": 0.001,
              "max": 1,
              "defaultVal": 0.5
          },
          {
              "index": 5,
              "name": "Dry Mix (dB)",
              "min": -120,
              "max": 6,
              "defaultVal": -120
          },
          {
              "index": 6,
              "name": "Subdivide Ratio",
              "min": 0.1,
              "max": 1,
              "defaultVal": 0.9
          },
          {
              "index": 7,
              "name": "Subdivide",
              "min": 1,
              "max": 8,
              "defaultVal": 4
          }
      ]
  },
  {
      "name": "JS: Ping Pong Pan",
      "shortName": "Ping Pong Pan",
      "category": "Modulation",
      "description": "Ping Pong Pan",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Frequency (Hz)",
              "min": 0,
              "max": 20,
              "defaultVal": 0.25
          },
          {
              "index": 1,
              "name": "Width (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 75
          }
      ]
  },
  {
      "name": "JS: Presence EQ",
      "shortName": "Presence EQ (Moorer)",
      "category": "EQ & Filtering",
      "description": "Presence EQ",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Processing",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Frequency",
              "min": 3100,
              "max": 18500,
              "defaultVal": 7700,
              "unit": "Hz"
          },
          {
              "index": 2,
              "name": "Cut/Boost",
              "min": -15,
              "max": 15,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Bandwidth",
              "min": 0.07,
              "max": 0.4,
              "defaultVal": 0.2
          },
          {
              "index": 4,
              "name": "Output",
              "min": -25,
              "max": 25,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: MIDI Program/Bank Switch on Load",
      "shortName": "MIDI Program/Bank Switch on Load",
      "category": "MIDI",
      "description": "MIDI Program/Bank Switch on Load",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "MIDI Channel",
              "min": 1,
              "max": 16,
              "defaultVal": 1
          },
          {
              "index": 1,
              "name": "MSB",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "LSB",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Program",
              "min": 0,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Has Sent",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MDA Pseudo-Stereo",
      "shortName": "MDA Pseudo-Stereo",
      "category": "Stereo & Spatial",
      "description": "Pseudo-Stereo",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Amount/Type (%) (neg=Haas,pos=Comb)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Delay",
              "min": 1,
              "max": 50,
              "defaultVal": 20,
              "unit": "ms"
          },
          {
              "index": 2,
              "name": "Balance (L/R)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Output",
              "min": -20,
              "max": 20,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: MIDI Note Randomize",
      "shortName": "MIDI Note Randomize [Stillwell]",
      "category": "MIDI",
      "description": "MIDI Note Randomize",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input MIDI Note #",
              "min": 0,
              "max": 127,
              "defaultVal": 60
          },
          {
              "index": 1,
              "name": "Input Channel (0=omni)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Lowest Output Note",
              "min": 0,
              "max": 127,
              "defaultVal": 48
          },
          {
              "index": 3,
              "name": "Highest Output Note",
              "min": 0,
              "max": 127,
              "defaultVal": 72
          },
          {
              "index": 4,
              "name": "Mix (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: RBJ 12-Band EQ w/HPF",
      "shortName": "RBJ 12-Band EQ w/HPF",
      "category": "EQ & Filtering",
      "description": "RBJ 12-Band EQ w/HPF",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "HPF",
              "min": 0,
              "max": 400,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Low Shelf",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "80 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "150 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "250 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 5,
              "name": "400 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "630 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "800 Hz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 8,
              "name": "1.6 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 9,
              "name": "3 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 10,
              "name": "5 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 11,
              "name": "7 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 12,
              "name": "10 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 13,
              "name": "12 kHz",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 14,
              "name": "LPF",
              "min": 400,
              "max": 22000,
              "defaultVal": 22000,
              "unit": "dB"
          },
          {
              "index": 15,
              "name": "Output Gain",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: RBJ 4-Band Semi-Parametric EQ v2",
      "shortName": "RBJ 4-Band Semi-Parametric EQ v2 [teej]",
      "category": "EQ & Filtering",
      "description": "RBJ 4-Band Semi-Parametric EQ v2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "HPF",
              "min": 0,
              "max": 400,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 1,
              "name": "Freq 1",
              "min": 0,
              "max": 10000,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 2,
              "name": "Q 1",
              "min": 0.5,
              "max": 10,
              "defaultVal": 1
          },
          {
              "index": 3,
              "name": "Gain 1",
              "min": -12,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "Freq 2",
              "min": 0,
              "max": 10000,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 5,
              "name": "Q 2",
              "min": 0.5,
              "max": 10,
              "defaultVal": 1
          },
          {
              "index": 6,
              "name": "Gain 2",
              "min": -12,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "Freq 3",
              "min": 0,
              "max": 10000,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 8,
              "name": "Q 3",
              "min": 0.5,
              "max": 10,
              "defaultVal": 1
          },
          {
              "index": 9,
              "name": "Gain 3",
              "min": -12,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 10,
              "name": "Freq 4",
              "min": 0,
              "max": 10000,
              "defaultVal": 0,
              "unit": "Hz"
          },
          {
              "index": 11,
              "name": "Q 4",
              "min": 0.5,
              "max": 10,
              "defaultVal": 1
          },
          {
              "index": 12,
              "name": "Gain 4",
              "min": -12,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 13,
              "name": "LPF",
              "min": 400,
              "max": 22000,
              "defaultVal": 22000,
              "unit": "Hz"
          },
          {
              "index": 14,
              "name": "Output Gain",
              "min": -12,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: RBJ 4-Band Notch Filter",
      "shortName": "RBJ 4-Band Notch Filter",
      "category": "EQ & Filtering",
      "description": "RBJ 4-Band Notch Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "HPF",
              "min": 0,
              "max": 400,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Sweep",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Notch 1",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Notch 2",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Notch 3",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Notch 4",
              "min": 0,
              "max": 10000,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "LPF",
              "min": 400,
              "max": 22000,
              "defaultVal": 22000
          },
          {
              "index": 7,
              "name": "Output Gain",
              "min": -12,
              "max": 12,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: ReaLoud LP",
      "shortName": "ReaLoud LP [stillwell]",
      "category": "Dynamics",
      "description": "ReaLoud LP",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Mix (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "LP Frequency (Hz)",
              "min": 1,
              "max": 22000,
              "defaultVal": 22000
          },
          {
              "index": 3,
              "name": "LP Size (1/Q) (0=resonant, 1=dull)",
              "min": 0,
              "max": 1,
              "defaultVal": 0.2
          },
          {
              "index": 4,
              "name": "Drive Circuit",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: ReaLoud",
      "shortName": "ReaLoud [Stillwell]",
      "category": "Dynamics",
      "description": "ReaLoud",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Mix (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Resonant Lowpass Filter",
      "shortName": "Resonant Lowpass Filter",
      "category": "Filter",
      "description": "Resonant Lowpass Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Frequency (Hz)",
              "min": 20,
              "max": 20000,
              "defaultVal": 1000
          },
          {
              "index": 1,
              "name": "Resonance",
              "min": 0,
              "max": 1,
              "defaultVal": 0.8
          }
      ]
  },
  {
      "name": "JS: Delay w/Reverseness",
      "shortName": "Delay w/Reverseness",
      "category": "Delay",
      "description": "Delay w/Reverseness",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Length (ms)",
              "min": 0,
              "max": 4000,
              "defaultVal": 500
          },
          {
              "index": 1,
              "name": "Wet Mix (dB)",
              "min": -120,
              "max": 6,
              "defaultVal": -6
          },
          {
              "index": 2,
              "name": "Dry Mix (dB)",
              "min": -120,
              "max": 6,
              "defaultVal": -6
          },
          {
              "index": 3,
              "name": "Edge Overlap",
              "min": 0,
              "max": 1,
              "defaultVal": 0.1
          },
          {
              "index": 4,
              "name": "Old Compatible And Clicky Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: RBJ Stereo Image Filter",
      "shortName": "RBJ Stereo Image Filter",
      "category": "Filter",
      "description": "RBJ Stereo Image Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "S - Filter Amount (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 1,
              "name": "S - HP (Scale)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "S - LP (Scale)",
              "min": 0,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 3,
              "name": "S - Drive (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Side (%)",
              "min": 0,
              "max": 200,
              "defaultVal": 100
          },
          {
              "index": 5,
              "name": "Mid (%)",
              "min": 0,
              "max": 200,
              "defaultVal": 100
          },
          {
              "index": 6,
              "name": "Output M+S (dB)",
              "min": -25,
              "max": 25,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Oversample (x2)",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Saturation",
      "shortName": "Saturation [LOSER]",
      "category": "Distortion",
      "description": "Saturation",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Amount (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: MIDI Sequencer Baby v2",
      "shortName": "MIDI Sequencer Baby v2",
      "category": "MIDI",
      "description": "MIDI Sequencer Baby v2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Pattern",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Start",
              "min": 0,
              "max": 127,
              "defaultVal": 60
          },
          {
              "index": 2,
              "name": "Sequence Length",
              "min": 4,
              "max": 128,
              "defaultVal": 16
          },
          {
              "index": 3,
              "name": "Number Of Notes",
              "min": 1,
              "max": 32,
              "defaultVal": 16
          },
          {
              "index": 4,
              "name": "Rate",
              "min": 0.125,
              "max": 4,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Sequencer Baby",
      "shortName": "MIDI Sequencer Baby",
      "category": "MIDI",
      "description": "MIDI Sequencer Baby",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Pattern",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Note Start",
              "min": 0,
              "max": 127,
              "defaultVal": 60
          }
      ]
  },
  {
      "name": "JS: MIDI Sequencer Megababy",
      "shortName": "MIDI Sequencer Megababy [jnif]",
      "category": "MIDI",
      "description": "MIDI Sequencer Megababy",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Pattern",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "--Note Start",
              "min": 0,
              "max": 127,
              "defaultVal": 36
          },
          {
              "index": 2,
              "name": "Sequence Length",
              "min": 4,
              "max": 128,
              "defaultVal": 16
          },
          {
              "index": 3,
              "name": "--Number Of Notes",
              "min": 1,
              "max": 32,
              "defaultVal": 16
          },
          {
              "index": 4,
              "name": "Rate",
              "min": 0.125,
              "max": 4,
              "defaultVal": 1
          },
          {
              "index": 5,
              "name": "--Note Length",
              "min": 1,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 6,
              "name": "--Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 7,
              "name": "--Swing",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 8,
              "name": "Steps Per Beat",
              "min": 1,
              "max": 16,
              "defaultVal": 4
          },
          {
              "index": 9,
              "name": "MIDI Trigger",
              "min": 0,
              "max": 8,
              "defaultVal": 0
          },
          {
              "index": 10,
              "name": "--Trigger Note Start",
              "min": 0,
              "max": 127,
              "defaultVal": 72
          },
          {
              "index": 11,
              "name": "--Chain",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 12,
              "name": "--Lane Height Percent",
              "min": 0,
              "max": 1,
              "defaultVal": 0.2
          },
          {
              "index": 13,
              "name": "--CC To Adjust (Active For Editing)",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 14,
              "name": "Drum Map Note Names",
              "min": 0,
              "max": 0,
              "defaultVal": 0
          },
          {
              "index": 19,
              "name": "--Controller 1 Type",
              "min": 0,
              "max": 127,
              "defaultVal": 1
          },
          {
              "index": 20,
              "name": "--Controller 2 Type",
              "min": 0,
              "max": 127,
              "defaultVal": 7
          },
          {
              "index": 21,
              "name": "--Controller 3 Type",
              "min": 0,
              "max": 127,
              "defaultVal": 10
          },
          {
              "index": 22,
              "name": "--Controller 4 Type",
              "min": 0,
              "max": 127,
              "defaultVal": 11
          },
          {
              "index": 29,
              "name": "--Controller 1 Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 30,
              "name": "--Controller 2 Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 31,
              "name": "--Controller 3 Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 32,
              "name": "--Controller 4 Channel",
              "min": 0,
              "max": 15,
              "defaultVal": 0
          },
          {
              "index": 39,
              "name": "--Start Beat Position",
              "min": -99,
              "max": 9999,
              "defaultVal": 0
          },
          {
              "index": 40,
              "name": "--Play Before Start",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 41,
              "name": "--End Beat Position",
              "min": -99,
              "max": 9999,
              "defaultVal": -99
          }
      ]
  },
  {
      "name": "JS: Sine Sweep Generator",
      "shortName": "Sine Sweep Generator",
      "category": "Synthesis",
      "description": "Sine Sweep Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Approx Sweep Length",
              "min": 1,
              "max": 100,
              "defaultVal": 8,
              "unit": "sec"
          }
      ]
  },
  {
      "name": "JS: Spectral Hold",
      "shortName": "Spectral Hold (Cockos)",
      "category": "Processing",
      "description": "Spectral Hold",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "FFT Size",
              "min": 0,
              "max": 6,
              "defaultVal": 6
          },
          {
              "index": 1,
              "name": "analysis overlap",
              "min": 0.01,
              "max": 0.99,
              "defaultVal": 0.5
          },
          {
              "index": 2,
              "name": "output overlap",
              "min": 0.1,
              "max": 0.9,
              "defaultVal": 0.75
          },
          {
              "index": 3,
              "name": "hold volume",
              "min": -150,
              "max": 32,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "dry mix during hold",
              "min": -150,
              "max": 32,
              "defaultVal": -150,
              "unit": "dB"
          },
          {
              "index": 5,
              "name": "dry mix when not holding",
              "min": -150,
              "max": 32,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "phase increase",
              "min": 0,
              "max": 12,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "hold",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 8,
              "name": "update state",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 9,
              "name": "transport start behavior",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 10,
              "name": "mix-in on update",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 11,
              "name": "auto-update every",
              "min": 0,
              "max": 30,
              "defaultVal": 0,
              "unit": "s"
          }
      ]
  },
  {
      "name": "JS: Spectropaint Filter",
      "shortName": "Spectropaint Filter",
      "category": "Processing",
      "description": "Spectropaint Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Period",
              "min": 1,
              "max": 100,
              "defaultVal": 20,
              "unit": "sec"
          },
          {
              "index": 1,
              "name": "Background Gain",
              "min": -144,
              "max": 0,
              "defaultVal": -144,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Foreground Gain",
              "min": -144,
              "max": 64,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "FFT Size",
              "min": 0,
              "max": 11,
              "defaultVal": 4
          },
          {
              "index": 4,
              "name": "Project Sync Offset (-1 to disable)",
              "min": -1,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Mode",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: Spectropaint Synthesis",
      "shortName": "Spectropaint Synthesis",
      "category": "Synthesis",
      "description": "Spectropaint Synthesis",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "period",
              "min": 1,
              "max": 100,
              "defaultVal": 20,
              "unit": "sec"
          },
          {
              "index": 1,
              "name": "amplitude",
              "min": -144,
              "max": 0,
              "defaultVal": -40,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "FFT size",
              "min": 0,
              "max": 11,
              "defaultVal": 4
          },
          {
              "index": 3,
              "name": "project sync offset (-1 to disable)",
              "min": -1,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "mode",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Stereo Enhancer",
      "shortName": "Stereo Enhancer",
      "category": "Stereo & Spatial",
      "description": "Stereo Enhancer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Width Low (%)",
              "min": 0,
              "max": 200,
              "defaultVal": 100
          },
          {
              "index": 1,
              "name": "Crossover (Hz)",
              "min": 0,
              "max": 20000,
              "defaultVal": 500
          },
          {
              "index": 2,
              "name": "Width High (%)",
              "min": 0,
              "max": 200,
              "defaultVal": 100
          }
      ]
  },
  {
      "name": "JS: Stereo Field Manipulator",
      "shortName": "Stereo Field Manipulator [LOSER]",
      "category": "Stereo & Spatial",
      "description": "Stereo Field Manipulator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Rotate",
              "min": -90,
              "max": 90,
              "defaultVal": 0,
              "unit": "deg"
          },
          {
              "index": 1,
              "name": "Width (%)",
              "min": 0,
              "max": 200,
              "defaultVal": 100
          },
          {
              "index": 2,
              "name": "Center (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Left/Right (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Channel Polarity Control",
      "shortName": "Channel Polarity Control [IXix]",
      "category": "Analysis & Utility",
      "description": "Channel Polarity Control",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Polarity Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Stereo Width",
      "shortName": "Stereo Width [Stillwell]",
      "category": "Stereo & Spatial",
      "description": "Stereo Width",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Width Boost",
              "min": -20,
              "max": 20,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Center Boost",
              "min": -20,
              "max": 20,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Gain",
              "min": -20,
              "max": 20,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Width Balance (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Width Rotation",
              "min": -90,
              "max": 90,
              "defaultVal": 0,
              "unit": "deg"
          }
      ]
  },
  {
      "name": "JS: Super8 MIDI-controlled synchronized looper",
      "shortName": "Super8 MIDI-controlled synchronized looper (Cockos)",
      "category": "MIDI",
      "description": "Super8 MIDI-controlled synchronized looper",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "-Sync",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "-Click count/length",
              "min": 0,
              "max": 64,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Pitch Shifter 2",
      "shortName": "Pitch Shifter 2",
      "category": "Pitch",
      "description": "Pitch Shifter 2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Pitch Adjust (cents)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Pitch Adjust (st)",
              "min": -12,
              "max": 12,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Pitch Adjust (oct)",
              "min": -12,
              "max": 12,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Window Size",
              "min": 0,
              "max": 200,
              "defaultVal": 50,
              "unit": "ms"
          },
          {
              "index": 4,
              "name": "Overlap Size",
              "min": 0.05,
              "max": 50,
              "defaultVal": 20,
              "unit": "ms"
          },
          {
              "index": 5,
              "name": "Wet Mix",
              "min": -120,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Dry Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -120,
              "unit": "dB"
          },
          {
              "index": 7,
              "name": "Filter",
              "min": 0,
              "max": 1,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: Sweeping Resonant Lowpass Filter",
      "shortName": "Sweeping Resonant Lowpass Filter",
      "category": "Filter",
      "description": "Sweeping Resonant Lowpass Filter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Frequency 1",
              "min": 20,
              "max": 20000,
              "defaultVal": 1000,
              "unit": "Hz"
          },
          {
              "index": 1,
              "name": "Frequency 2",
              "min": 20,
              "max": 20000,
              "defaultVal": 2000,
              "unit": "Hz"
          },
          {
              "index": 2,
              "name": "Sweep Time",
              "min": 0.1,
              "max": 30,
              "defaultVal": 2,
              "unit": "sec"
          },
          {
              "index": 3,
              "name": "Resonance",
              "min": 0,
              "max": 1,
              "defaultVal": 0.8
          }
      ]
  },
  {
      "name": "JS: 8-Channel Input Switcher",
      "shortName": "8-Channel Input Switcher [IXix]",
      "category": "Routing",
      "description": "8-Channel Input Switcher",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Output Source",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Level 1+2",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Level 3+4",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Level 5+6",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 4,
              "name": "Level 7+8",
              "min": -60,
              "max": 30,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: SwixMitch (4x Stereo In, 2 Bus X-Fader)",
      "shortName": "SwixMitch 4x Stereo Input 2 Bus X-Fader [IXix]",
      "category": "Mixer",
      "description": "SwixMitch (4x Stereo In, 2 Bus X-Fader)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Destination 1+2",
              "min": 0,
              "max": 3,
              "defaultVal": 3
          },
          {
              "index": 1,
              "name": "Destination 3+4",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Destination 5+6",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Destination 7+8",
              "min": 0,
              "max": 3,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Mix A<>B",
              "min": 0,
              "max": 1,
              "defaultVal": 0.5
          }
      ]
  },
  {
      "name": "JS: Thunderkick",
      "shortName": "Thunderkick (MDCT subsynthesis filter) [Stillwell]",
      "category": "Synthesis",
      "description": "Thunderkick",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Effect",
              "min": -40,
              "max": 40,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Cutoff",
              "min": 1,
              "max": 30,
              "defaultVal": 4
          },
          {
              "index": 2,
              "name": "Gain",
              "min": -40,
              "max": 40,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Shift",
              "min": 0,
              "max": 10,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: Tilt Equalizer",
      "shortName": "Tilt Equalizer",
      "category": "EQ & Filtering",
      "description": "Tilt Equalizer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Processing",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Center Frequency (Scale)",
              "min": 0,
              "max": 100,
              "defaultVal": 50
          },
          {
              "index": 2,
              "name": "Tilt (Low/High)",
              "min": -6,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Output Gain",
              "min": -25,
              "max": 25,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Time Adjustment Delay",
      "shortName": "Time Adjustment Delay or Negative Delay",
      "category": "Delay",
      "description": "Time Adjustment Delay",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Delay Amount",
              "min": -1000,
              "max": 1000,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Wet Mix",
              "min": -120,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Dry Mix",
              "min": -120,
              "max": 12,
              "defaultVal": -120,
              "unit": "dB"
          },
          {
              "index": 3,
              "name": "Additional Delay Amount",
              "min": -40000,
              "max": 40000,
              "defaultVal": 0,
              "unit": "spls"
          }
      ]
  },
  {
      "name": "JS: Channel Time Delayer",
      "shortName": "Channel Time Delayer [LOSER]",
      "category": "Delay",
      "description": "Channel Time Delayer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Delay L",
              "min": -100,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Delay R",
              "min": -100,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          }
      ]
  },
  {
      "name": "JS: Tone Gate",
      "shortName": "Tone Gate [remaincalm.org]",
      "category": "Dynamics",
      "description": "Tone Gate",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Wet Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -15,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Dry Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -3,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Frequency",
              "min": 20,
              "max": 400,
              "defaultVal": 80,
              "unit": "Hz"
          },
          {
              "index": 3,
              "name": "Waveform",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Lowpass",
              "min": 50,
              "max": 10000,
              "defaultVal": 1000,
              "unit": "Hz"
          },
          {
              "index": 5,
              "name": "Threshold",
              "min": -120,
              "max": 6,
              "defaultVal": -20,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Silence Length For Fadeout",
              "min": 1,
              "max": 4000,
              "defaultVal": 50,
              "unit": "ms"
          },
          {
              "index": 7,
              "name": "Fade In Response",
              "min": 1,
              "max": 100,
              "defaultVal": 10,
              "unit": "ms"
          },
          {
              "index": 8,
              "name": "Fade Out Response",
              "min": 1,
              "max": 1000,
              "defaultVal": 100,
              "unit": "ms"
          },
          {
              "index": 9,
              "name": "Dynamic Pitch",
              "min": 0,
              "max": 4,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Tone Generator",
      "shortName": "Tone Generator",
      "category": "Synthesis",
      "description": "Tone Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Wet Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -12,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Dry Mix",
              "min": -120,
              "max": 6,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Base Frequency",
              "min": 20,
              "max": 24000,
              "defaultVal": 440,
              "unit": "Hz"
          },
          {
              "index": 3,
              "name": "Note",
              "min": 0,
              "max": 11,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Octave",
              "min": -4,
              "max": 4,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Fine Tune",
              "min": -100,
              "max": 100,
              "defaultVal": 0,
              "unit": "cents"
          },
          {
              "index": 6,
              "name": "Shape",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Tonifier",
      "shortName": "Tonifier",
      "category": "Synthesis",
      "description": "Tonifier",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Wet Mix",
              "min": -100,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Dry Mix",
              "min": -100,
              "max": 6,
              "defaultVal": -100,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Block Size",
              "min": 1,
              "max": 1000,
              "defaultVal": 10,
              "unit": "ms"
          },
          {
              "index": 3,
              "name": "Frequency Shift",
              "min": -48,
              "max": 48,
              "defaultVal": 0,
              "unit": "st"
          },
          {
              "index": 4,
              "name": "max auto shift",
              "min": 0,
              "max": 6,
              "defaultVal": 0,
              "unit": "octaves"
          },
          {
              "index": 5,
              "name": "auto shift min frequency",
              "min": 0,
              "max": 20000,
              "defaultVal": 100,
              "unit": "Hz"
          },
          {
              "index": 6,
              "name": "auto shift max frequency",
              "min": 0,
              "max": 20000,
              "defaultVal": 1000,
              "unit": "Hz"
          },
          {
              "index": 7,
              "name": "Output frequency",
              "min": 0,
              "max": 0,
              "defaultVal": 0,
              "unit": "Hz"
          }
      ]
  },
  {
      "name": "JS: Time Difference Pan",
      "shortName": "Time Difference Pan",
      "category": "Stereo & Spatial",
      "description": "Time Difference Pan",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Pan (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Tonifier v2",
      "shortName": "Tonifier v2",
      "category": "Synthesis",
      "description": "Tonifier v2",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Wet Mix",
              "min": -100,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Dry Mix",
              "min": -100,
              "max": 6,
              "defaultVal": -100,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Amplitude Falloff (factor)",
              "min": 0.96,
              "max": 1,
              "defaultVal": 0.995
          },
          {
              "index": 3,
              "name": "Frequency Shift",
              "min": -48,
              "max": 48,
              "defaultVal": 0,
              "unit": "st"
          },
          {
              "index": 4,
              "name": "max auto shift",
              "min": 0,
              "max": 6,
              "defaultVal": 4,
              "unit": "octaves"
          },
          {
              "index": 5,
              "name": "auto shift min frequency",
              "min": 0,
              "max": 20000,
              "defaultVal": 100,
              "unit": "Hz"
          },
          {
              "index": 6,
              "name": "auto shift max frequency",
              "min": 0,
              "max": 20000,
              "defaultVal": 300,
              "unit": "Hz"
          },
          {
              "index": 7,
              "name": "Output frequency",
              "min": 0,
              "max": 0,
              "defaultVal": 0,
              "unit": "Hz"
          }
      ]
  },
  {
      "name": "JS: Transient-Driven Auto-Pan (Receiver)",
      "shortName": "Transient-Driven Auto-Pan (Receiver)",
      "category": "Modulation",
      "description": "Transient-Driven Auto-Pan (Receiver)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Receive Pan Data From",
              "min": 0,
              "max": 9,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Received Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Sloppiness",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Invert Received Pan",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Multiply Received Pan",
              "min": 0.2,
              "max": 5,
              "defaultVal": 1
          },
          {
              "index": 6,
              "name": "Max Pan",
              "min": 1,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 7,
              "name": "Max Delay",
              "min": 0,
              "max": 10,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 8,
              "name": "Look Ahead",
              "min": 0,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 9,
              "name": "Current Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Transient-Driven Auto-Pan (Transmitter)",
      "shortName": "Transient-Driven Auto-Pan (Transmitter)",
      "category": "Modulation",
      "description": "Transient-Driven Auto-Pan (Transmitter)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Pan Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 3
          },
          {
              "index": 2,
              "name": "Pan Step Size (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 10
          },
          {
              "index": 3,
              "name": "Random Step Size (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Max Pan",
              "min": 1,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 5,
              "name": "Fade Time",
              "min": 0,
              "max": 1000,
              "defaultVal": 20,
              "unit": "ms"
          },
          {
              "index": 6,
              "name": "Sloppiness (Transmitter Only)",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Min Pause Between Pans",
              "min": 20,
              "max": 500,
              "defaultVal": 250,
              "unit": "ms"
          },
          {
              "index": 8,
              "name": "Max Delay",
              "min": 0,
              "max": 10,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 10,
              "name": "Director",
              "min": 0,
              "max": 5,
              "defaultVal": 0
          },
          {
              "index": 11,
              "name": "Preview Director",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 12,
              "name": "Sensitivity",
              "min": 0,
              "max": 10,
              "defaultVal": 5
          },
          {
              "index": 13,
              "name": "Look Ahead",
              "min": 0,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 14,
              "name": "Send Pan Data To",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 15,
              "name": "Current Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Transient-Driven Auto-Pan v1.1 (Receiver)",
      "shortName": "Transient-Driven Auto-Pan v1.1 (Receiver)",
      "category": "Modulation",
      "description": "Transient-Driven Auto-Pan v1.1 (Receiver)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Receive Pan Data From",
              "min": 0,
              "max": 9,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Received Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Sloppiness",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Invert Received Pan",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 5,
              "name": "Multiply Received Pan",
              "min": 0.2,
              "max": 5,
              "defaultVal": 1
          },
          {
              "index": 6,
              "name": "Max Pan",
              "min": 1,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 7,
              "name": "Max Delay",
              "min": 0,
              "max": 10,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 8,
              "name": "Look Ahead",
              "min": 0,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 9,
              "name": "Current Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Transient-Driven Auto-Pan v1.1 (Transmitter)",
      "shortName": "Transient-Driven Auto-Pan v1.1 (Transmitter)",
      "category": "Modulation",
      "description": "Transient-Driven Auto-Pan v1.1 (Transmitter)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input",
              "min": 0,
              "max": 2,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Pan Mode",
              "min": 0,
              "max": 3,
              "defaultVal": 3
          },
          {
              "index": 2,
              "name": "Pan Step Size (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 10
          },
          {
              "index": 3,
              "name": "Random Step Size (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Max Pan",
              "min": 1,
              "max": 100,
              "defaultVal": 100
          },
          {
              "index": 5,
              "name": "Fade Time",
              "min": 0,
              "max": 1000,
              "defaultVal": 20,
              "unit": "ms"
          },
          {
              "index": 6,
              "name": "Sloppiness (Transmitter Only)",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Min Pause Between Pans",
              "min": 20,
              "max": 500,
              "defaultVal": 250,
              "unit": "ms"
          },
          {
              "index": 8,
              "name": "Max Delay",
              "min": 0,
              "max": 10,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 10,
              "name": "Director",
              "min": 0,
              "max": 5,
              "defaultVal": 0
          },
          {
              "index": 11,
              "name": "Preview Director",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 12,
              "name": "Sensitivity",
              "min": 0,
              "max": 10,
              "defaultVal": 5
          },
          {
              "index": 13,
              "name": "Look Ahead",
              "min": 0,
              "max": 100,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 14,
              "name": "Send Pan Data To",
              "min": 0,
              "max": 10,
              "defaultVal": 0
          },
          {
              "index": 15,
              "name": "Current Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Transient Controller",
      "shortName": "Transient Controller [LOSER]",
      "category": "Dynamics",
      "description": "Transient Controller",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Attack (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Sustain (%)",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Output",
              "min": -12,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Transient Killer",
      "shortName": "Transient Killer (Instant Compressor) [LOSER]",
      "category": "Dynamics",
      "description": "Transient Killer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -12,
              "max": 1,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Ratio",
              "min": 1,
              "max": 50,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: Tremolo",
      "shortName": "Tremolo",
      "category": "Modulation",
      "description": "Tremolo",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Frequency",
              "min": 0,
              "max": 100,
              "defaultVal": 4,
              "unit": "Hz"
          },
          {
              "index": 1,
              "name": "Amount",
              "min": -60,
              "max": 0,
              "defaultVal": -6,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Stereo Seperation",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Upward Expander",
      "shortName": "Upward Expander [LOSER]",
      "category": "Dynamics",
      "description": "Upward Expander",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -30,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Ratio",
              "min": 0.25,
              "max": 1,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Attack",
              "min": 0,
              "max": 250,
              "defaultVal": 20,
              "unit": "ms"
          },
          {
              "index": 3,
              "name": "Release",
              "min": 0,
              "max": 500,
              "defaultVal": 200,
              "unit": "ms"
          },
          {
              "index": 4,
              "name": "RMS Size",
              "min": 0,
              "max": 250,
              "defaultVal": 0,
              "unit": "ms"
          },
          {
              "index": 5,
              "name": "Output",
              "min": -6,
              "max": 50,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 6,
              "name": "Feed",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 7,
              "name": "Expansion",
              "min": 0,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 8,
              "name": "Dry Mix",
              "min": -120,
              "max": 0,
              "defaultVal": -120,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: VCA Follow",
      "shortName": "VCA Follow",
      "category": "Utility",
      "description": "VCA Follow",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Transition Time",
              "min": 0,
              "max": 300,
              "defaultVal": 50,
              "unit": "ms"
          }
      ]
  },
  {
      "name": "JS: VCA Lead",
      "shortName": "VCA Lead",
      "category": "Utility",
      "description": "VCA Lead",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Volume",
              "min": -120,
              "max": 24,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: video sample peeker",
      "shortName": "video sample peeker",
      "category": "Utility",
      "description": "video sample peeker",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "lookahead (seconds, 1.0 is normal)",
              "min": 0,
              "max": 1.8,
              "defaultVal": 1
          }
      ]
  },
  {
      "name": "JS: MIDI Velocity Scaler/Compressor",
      "shortName": "MIDI Velocity Scaler/Compressor [Stillwell]",
      "category": "MIDI",
      "description": "MIDI Velocity Scaler/Compressor",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Input Channel (0=omni)",
              "min": 0,
              "max": 16,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Scale Factor",
              "min": 0,
              "max": 3,
              "defaultVal": 1
          },
          {
              "index": 2,
              "name": "Volume Offset",
              "min": -127,
              "max": 127,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Mix (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Volume/Pan Smoother v5",
      "shortName": "Volume/Pan Smoother v5",
      "category": "Utility",
      "description": "Volume/Pan Smoother v5",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Volume",
              "min": -60,
              "max": 12,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Pan",
              "min": -100,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Pan Law",
              "min": -6,
              "max": 6,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Volume Adjustment",
      "shortName": "Volume Adjustment",
      "category": "Utility",
      "description": "Volume Adjustment",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Adjustment",
              "min": -150,
              "max": 150,
              "defaultVal": 6,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Max Volume",
              "min": -150,
              "max": 150,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: VU Meter",
      "shortName": "VU Meter",
      "category": "Analysis & Utility",
      "description": "VU Meter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Response",
              "min": 1,
              "max": 300,
              "defaultVal": 50,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Release (Slow/Fast)",
              "min": 1,
              "max": 10,
              "defaultVal": 5
          }
      ]
  },
  {
      "name": "JS: VU Meter (Summed)",
      "shortName": "VU Meter (Summed)",
      "category": "Analysis & Utility",
      "description": "VU Meter (Summed)",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Response",
              "min": 1,
              "max": 300,
              "defaultVal": 50,
              "unit": "ms"
          },
          {
              "index": 1,
              "name": "Release (Slow/Fast)",
              "min": 1,
              "max": 10,
              "defaultVal": 5
          }
      ]
  },
  {
      "name": "JS: Wah-Wah",
      "shortName": "Wah-Wah",
      "category": "Filter",
      "description": "Wah-Wah",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Position",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Resonance (Top) (0..1)",
              "min": 0,
              "max": 1,
              "defaultVal": 0.7
          },
          {
              "index": 2,
              "name": "Resonance (Bottom) (0..1)",
              "min": 0,
              "max": 1,
              "defaultVal": 0.1
          },
          {
              "index": 3,
              "name": "Filter Distortion",
              "min": 0,
              "max": 0.1,
              "defaultVal": 0.05
          }
      ]
  },
  {
      "name": "JS: Multi Waveshaper",
      "shortName": "Waveshaper Multi (Various Formulas)",
      "category": "Distortion",
      "description": "Multi Waveshaper",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Processing",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Waveshaper",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 2,
              "name": "Drive (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 3,
              "name": "Muffle (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 4,
              "name": "Output",
              "min": -25,
              "max": 25,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 5,
              "name": "Limiter",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          },
          {
              "index": 6,
              "name": "Oversample (x2)",
              "min": 0,
              "max": 1,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: Waveshaping Distortion",
      "shortName": "Waveshaping Distortion",
      "category": "Distortion",
      "description": "Waveshaping Distortion",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Distortion (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          }
      ]
  },
  {
      "name": "JS: White Noise Generator",
      "shortName": "White Noise Generator [LOSER]",
      "category": "Synthesis",
      "description": "White Noise Generator",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Dry Volume",
              "min": -120,
              "max": 0,
              "defaultVal": -120,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Noise Volume",
              "min": -120,
              "max": 0,
              "defaultVal": -12,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: Subtractive Stereo Enhancer",
      "shortName": "Subtractive Stereo Enhancer [Stillwell]",
      "category": "Stereo & Spatial",
      "description": "Subtractive Stereo Enhancer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Effect (%)",
              "min": 0,
              "max": 100,
              "defaultVal": 0
          },
          {
              "index": 1,
              "name": "Make-Up Gain",
              "min": 0,
              "max": 20,
              "defaultVal": 0,
              "unit": "dB"
          }
      ]
  },
  {
      "name": "JS: WigWare Multi-channel Peak VU Meter",
      "shortName": "WigWare Multi-channel Peak VU Meter",
      "category": "Analysis & Utility",
      "description": "WigWare Multi-channel Peak VU Meter",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Number of Channels",
              "min": 0,
              "max": 64,
              "defaultVal": 16
          },
          {
              "index": 1,
              "name": "Sample Time",
              "min": 0,
              "max": 500,
              "defaultVal": 100,
              "unit": "ms"
          },
          {
              "index": 2,
              "name": "min dB Value (-ve)",
              "min": 0,
              "max": 96,
              "defaultVal": 60
          },
          {
              "index": 3,
              "name": "peak hold (x Sample Time)",
              "min": 2,
              "max": 20,
              "defaultVal": 10
          }
      ]
  },
  {
      "name": "JS: Zero Crossing Maximizer",
      "shortName": "Zero Crossing Maximizer [LOSER]",
      "category": "Dynamics",
      "description": "Zero Crossing Maximizer",
      "howItWorks": "",
      "proTips": "",
      "sliders": [
          {
              "index": 0,
              "name": "Threshold",
              "min": -12,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 1,
              "name": "Ceiling",
              "min": -12,
              "max": 0,
              "defaultVal": 0,
              "unit": "dB"
          },
          {
              "index": 2,
              "name": "Buffer Size",
              "min": 250,
              "max": 1000,
              "defaultVal": 500,
              "unit": "ms"
          }
      ]
  },
  {
      "name": "JS: Zoom Analyzer Demo",
      "shortName": "Zoom Analyzer Demo",
      "category": "Analysis & Utility",
      "description": "Zoom Analyzer Demo",
      "howItWorks": "",
      "proTips": "",
      "sliders": []
  }
];

export const getJSFXProfileByName = (rawName: string): JSFXProfile | undefined => {
  const cleanName = rawName.replace(/["':]/g, "").trim().toLowerCase();
  return JSFX_DATABASE.find(profile => {
    const profName = profile.name.replace(/["':]/g, "").trim().toLowerCase();
    const profShort = profile.shortName.trim().toLowerCase();
    return cleanName === profName || cleanName.includes(profName) || cleanName.includes(profShort);
  });
};
