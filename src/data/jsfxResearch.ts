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
  category: "Dynamics" | "EQ & Filtering" | "Time & Modulation" | "Routing & Utility";
  shortName: string;
  description: string;
  howItWorks: string;
  proTips: string;
  volumeStagingWarning?: string;
  sliders: JSFXParameter[];
}

export const JSFX_DATABASE: JSFXProfile[] = [
  {
    name: "JS: SStillwell/1175",
    shortName: "1175 Compressor",
    category: "Dynamics",
    description: "An emulation of the classic fast 1176 FET limiting amplifier, perfect for making vocals crisp, energetic, and up-front.",
    howItWorks: "Using ultra-fast attack and release envelopes, it clamps down on fast peaks. As with all classic FET compressions, clamping peaks reduces the peak output energy significantly.",
    proTips: "To bring vocals right to the front instead of burying them, you MUST match any compressor Threshold reduction with equal or greater S5 (Makeup Gain) to restore presence and maintain excellent vocal level consistency.",
    volumeStagingWarning: "CRITICAL: Using S1 (Threshold) at -20dB to -30dB will make your vocals extremely quiet. You must boost S5 (Makeup Gain) to +12dB to +18dB to compensate and bring the volume back up!",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -60, max: 0, defaultVal: -15, description: "Gain level at which compressor begins processing." },
      { index: 1, name: "Ratio", unit: "selection", min: 0, max: 3, defaultVal: 0, description: "Compression ratio index: 0=4:1, 1=8:1, 2=12:1, 3=20:1." },
      { index: 2, name: "Attack (ms)", unit: "ms", min: 0.02, max: 0.8, defaultVal: 0.05, description: "Time taken to clamp the gain after threshold is crossed." },
      { index: 3, name: "Release (ms)", unit: "ms", min: 50, max: 1100, defaultVal: 200, description: "Time taken to release compression once level falls under threshold." },
      { index: 4, name: "Makeup Gain (dB)", unit: "dB", min: -20, max: 40, defaultVal: 0, description: "OUTPUT MAKEUP GAIN. Absolutely essential to raise this to match the level of gain reduction." }
    ]
  },
  {
    name: "JS: Volume/Pan",
    shortName: "Volume & Pan Controller",
    category: "Routing & Utility",
    description: "A super-clean utility slider for precise track gain adjustment, leveling, and overall volume matching.",
    howItWorks: "Directly attenuates or boosts the raw audio sample buffer with zero phase distortion or coloration.",
    proTips: "Use this plugin as the very last plugin on a track's FX chain to ensure accurate staging and absolute control of track leveling without affecting the gain going into pre-fader compressors.",
    sliders: [
      { index: 0, name: "Volume (dB)", unit: "dB", min: -150, max: 12, defaultVal: 0, description: "Linear gain offset in decibels." },
      { index: 1, name: "Pan", unit: "ratio", min: -1, max: 1, defaultVal: 0, description: "Stereo balance. -1.0 is hard Left, +1.0 is hard Right, 0.0 is center." },
      { index: 2, name: "Max Volume (dB)", unit: "dB", min: -150, max: 12, defaultVal: 0, description: "Max gain allowance ceiling." }
    ]
  },
  {
    name: "JS: SStillwell/eventhorizon",
    shortName: "Event Horizon Clipper/Limiter",
    category: "Dynamics",
    description: "A clean, aggressive peak clipper and brickwall maximizer, ideal for group buses or master outputs.",
    howItWorks: "Shaves off transient peaks above the Threshold point, transferring energy into perceived average loudness (RMS) through soft clipping before hard brickwall capping.",
    proTips: "When designing track dynamic ranges on vocals or the master bus, S1 (Threshold) pulls the ceiling down to squash peaks. Keep S2 (Ceiling) around -0.1dB to -0.5dB to prevent digital clipping at the output.",
    sliders: [
      { index: 0, name: "Threshold (dB)", unit: "dB", min: -30, max: 0, defaultVal: 0, description: "Peak crushing threshold where soft clipping and limiting engage." },
      { index: 1, name: "Ceiling (dB)", unit: "dB", min: -30, max: 0, defaultVal: -0.1, description: "Output brickwall ceiling limit." },
      { index: 2, name: "Soft Clip (dB)", unit: "dB", min: -30, max: 0, defaultVal: 0, description: "The range of soft-knee compression/clapping below the threshold." }
    ]
  },
  {
    name: "JS: LOSER/3BandEQ",
    shortName: "3-Band Equalizer",
    category: "EQ & Filtering",
    description: "A simple, phase-coherent 3-band sweepable frequency equalizer designed for tonal balance.",
    howItWorks: "Crossover networks separate incoming audio into low, mid, and high frequency ranges using Butterworth filters before applying independent gain stages.",
    proTips: "Clean muddy boxiness in vocals by reducing the Mid Gain (S2) by -2dB to -4dB around the crossover frequency, and boost S3 (High Gain) slightly (+1dB to +3dB) for brilliance.",
    sliders: [
      { index: 0, name: "Low Gain (dB)", unit: "dB", min: -72, max: 12, defaultVal: 0, description: "Gain boost or attenuation for low frequencies." },
      { index: 1, name: "Mid Gain (dB)", unit: "dB", min: -72, max: 12, defaultVal: 0, description: "Gain boost or attenuation for mid frequencies." },
      { index: 2, name: "High Gain (dB)", unit: "dB", min: -72, max: 12, defaultVal: 0, description: "Gain boost or attenuation for high frequencies." },
      { index: 3, name: "Low X-over (Hz)", unit: "Hz", min: 20, max: 500, defaultVal: 200, description: "Frequency boundary dividing Low and Mid bands." },
      { index: 4, name: "High X-over (Hz)", unit: "Hz", min: 500, max: 20000, defaultVal: 2000, description: "Frequency boundary dividing Mid and High bands." }
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
      { index: 0, name: "Delay (ms)", unit: "ms", min: 0, max: 100, defaultVal: 10, description: "Base delay time offset of the chorus voices." },
      { index: 1, name: "Width (ms)", unit: "ms", min: 0, max: 5, defaultVal: 2, description: "Range of LFO modulation on the delay times." },
      { index: 2, name: "Frequency (Hz)", unit: "Hz", min: 0.05, max: 10, defaultVal: 0.5, description: "Modulation speed of the chorus effect." },
      { index: 3, name: "Voices", unit: "count", min: 1, max: 16, defaultVal: 4, description: "Number of duplicated voices." },
      { index: 4, name: "Wet Mix (dB)", unit: "dB", min: -100, max: 12, defaultVal: -6, description: "Volume level of the processed chorus effect." },
      { index: 5, name: "Dry Mix (dB)", unit: "dB", min: -100, max: 12, defaultVal: 0, description: "Volume level of the clean, unaffected dry audio." }
    ]
  },
  {
    name: "JS: Delay",
    shortName: "Digital Delay",
    category: "Time & Modulation",
    description: "An echo engine designed to create spatial depth, trailing echoes, or slapbacks.",
    howItWorks: "Samples incoming audio into a circular buffer and reads it back after a specified delay time, feeding some of the output back into the input.",
    proTips: "For a wider high-quality vocal space without washing out the center image, feed a slight 80ms slapback delay into a wide Chorus, keeping the Wet level low.",
    sliders: [
      { index: 0, name: "Delay (ms)", unit: "ms", min: 0, max: 2000, defaultVal: 300, description: "Time interval between echoes in milliseconds." },
      { index: 1, name: "Feedback (dB)", unit: "dB", min: -100, max: 0, defaultVal: -12, description: "The amount of echo signal refed into the input (determines decay)." },
      { index: 2, name: "Wet Mix (dB)", unit: "dB", min: -100, max: 12, defaultVal: -12, description: "Volume level of the delayed echoes." },
      { index: 3, name: "Dry Mix (dB)", unit: "dB", min: -100, max: 12, defaultVal: 0, description: "Volume level of the clean dry audio." }
    ]
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
