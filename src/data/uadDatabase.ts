export interface UADParameter {
  name: string;
  range: string;
  defaultVal: string;
  description: string;
  type?: 'knob' | 'switch' | 'select' | 'slider';
  options?: string[];
}

export interface UADPluginProfile {
  name: string;
  displayName: string;
  category: 'Dynamics' | 'Equalizers' | 'Channel Strips' | 'Reverbs & Delays' | 'Tape & Saturation' | 'Guitar & Bass' | 'Preamps & Microphones';
  description: string;
  hardwareModel: string;
  parameters: UADParameter[];
  proTips: string[];
}

export const UAD_DATABASE: UADPluginProfile[] = [
  {
    name: "precision channel strip",
    displayName: "UAD Precision Channel Strip",
    category: "Channel Strips",
    description: "An clean, high-fidelity channel strip designed for precise, surgical equalisation and modern level-control with absolute transparency.",
    hardwareModel: "UAD Original Digital Precision Series",
    proTips: [
      "Use the EQ Pre/Post switch to place the compressor before or after the EQ. In general, EQing BEFORE the compressor lets you clean up low-end mud before it triggers the compression threshold.",
      "The Low Cut filter features a steep 18 dB/oct option that is perfect for removing sub-audible low rumble from vocals and synth tracks without affecting the bass.",
      "Use very fast attack times on the compressor section for visual transient control, as this digital compressor operates without harmonic saturation."
    ],
    parameters: [
      {
        name: "Low Cut Filter State",
        range: "On / Off",
        defaultVal: "Off",
        description: "Enables or disables the high-pass / low-cut filter.",
        type: "switch",
        options: ["Off", "On"]
      },
      {
        name: "Low Cut Frequency",
        range: "10 Hz - 240 Hz",
        defaultVal: "40 Hz",
        description: "Determines the corner frequency of the high-pass filter.",
        type: "knob"
      },
      {
        name: "Low Cut Slope",
        range: "12 dB/oct / 18 dB/oct",
        defaultVal: "18 dB/oct",
        description: "Sets the slope steepness for the high-pass filter.",
        type: "switch",
        options: ["12 dB/oct", "18 dB/oct"]
      },
      {
        name: "Low EQ Type",
        range: "Peak / Shelf",
        defaultVal: "Shelf",
        description: "Switches the low band between a parametric peak band and a low shelf.",
        type: "switch",
        options: ["Peak", "Shelf"]
      },
      {
        name: "Low EQ Frequency",
        range: "20 Hz - 400 Hz",
        defaultVal: "80 Hz",
        description: "Sets the center or shelf corner frequency for the Low EQ band.",
        type: "knob"
      },
      {
        name: "Low EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0.0 dB",
        description: "Boosts or cuts the gain of the Low EQ band.",
        type: "knob"
      },
      {
        name: "Low EQ Q-Factor",
        range: "0.5 - 8.0",
        defaultVal: "1.0",
        description: "Controls the bandwidth/resonance of the Low EQ band (active only in Peak mode).",
        type: "knob"
      },
      {
        name: "Low Mid EQ Frequency",
        range: "50 Hz - 2.0 kHz",
        defaultVal: "250 Hz",
        description: "Sets the center frequency for the Low Mid parametric EQ band.",
        type: "knob"
      },
      {
        name: "Low Mid EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0.0 dB",
        description: "Boosts or cuts the gain of the Low Mid parametric band.",
        type: "knob"
      },
      {
        name: "Low Mid EQ Q-Factor",
        range: "0.5 - 8.0",
        defaultVal: "1.0",
        description: "Controls the bandwidth (Q) of the Low Mid parametric band.",
        type: "knob"
      },
      {
        name: "Mid EQ Frequency",
        range: "200 Hz - 8.0 kHz",
        defaultVal: "1.0 kHz",
        description: "Sets the center frequency for the Mid parametric EQ band.",
        type: "knob"
      },
      {
        name: "Mid EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0.0 dB",
        description: "Boosts or cuts the gain of the Mid parametric band.",
        type: "knob"
      },
      {
        name: "Mid EQ Q-Factor",
        range: "0.5 - 8.0",
        defaultVal: "1.0",
        description: "Controls the bandwidth (Q) of the Mid parametric band.",
        type: "knob"
      },
      {
        name: "High Mid EQ Frequency",
        range: "500 Hz - 10.0 kHz",
        defaultVal: "4.0 kHz",
        description: "Sets the center frequency for the High Mid parametric EQ band.",
        type: "knob"
      },
      {
        name: "High Mid EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0.0 dB",
        description: "Boosts or cuts the gain of the High Mid parametric band.",
        type: "knob"
      },
      {
        name: "High Mid EQ Q-Factor",
        range: "0.5 - 8.0",
        defaultVal: "1.0",
        description: "Controls the bandwidth (Q) of the High Mid parametric band.",
        type: "knob"
      },
      {
        name: "High EQ Type",
        range: "Peak / Shelf",
        defaultVal: "Shelf",
        description: "Switches the high band between a parametric peak band and a high shelf.",
        type: "switch",
        options: ["Peak", "Shelf"]
      },
      {
        name: "High EQ Frequency",
        range: "2.0 kHz - 20.0 kHz",
        defaultVal: "12.0 kHz",
        description: "Sets the center or shelf corner frequency for the High EQ band.",
        type: "knob"
      },
      {
        name: "High EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0.0 dB",
        description: "Boosts or cuts the gain of the High EQ band.",
        type: "knob"
      },
      {
        name: "High EQ Q-Factor",
        range: "0.5 - 8.0",
        defaultVal: "1.0",
        description: "Controls the bandwidth/resonance of the High EQ band (active only in Peak mode).",
        type: "knob"
      },
      {
        name: "EQ Pre/Post dynamics",
        range: "Pre / Post",
        defaultVal: "Pre",
        description: "Configures whether the 5-band EQ is applied before (Pre) or after (Post) the compressor and gate modules.",
        type: "switch",
        options: ["Pre", "Post"]
      },
      {
        name: "Compressor Threshold",
        range: "-60.0 dB to 0.0 dB",
        defaultVal: "0.0 dB",
        description: "Sets the input level at which compression begins.",
        type: "knob"
      },
      {
        name: "Compressor Ratio",
        range: "1.0:1 to 20.0:1 (Continuous)",
        defaultVal: "2.0:1",
        description: "Determines the input-to-output gain reduction slope.",
        type: "knob"
      },
      {
        name: "Compressor Attack",
        range: "0.1 ms - 100.0 ms",
        defaultVal: "10.0 ms",
        description: "Controls how fast the compressor responds to signals above the threshold.",
        type: "knob"
      },
      {
        name: "Compressor Release",
        range: "10.0 ms - 2.5 seconds",
        defaultVal: "200.0 ms",
        description: "Controls how fast the compressor returns to unity gain after signal falls below threshold.",
        type: "knob"
      },
      {
        name: "Compressor Makeup Gain",
        range: "0.0 dB to +24.0 dB",
        defaultVal: "0.0 dB",
        description: "Boosts the output level of the compressor to compensate for gain reduction.",
        type: "knob"
      },
      {
        name: "Gate Threshold",
        range: "-80.0 dB to 0.0 dB",
        defaultVal: "-80.0 dB (Off)",
        description: "Sets the input level below which the gate closes and attenuates signal.",
        type: "knob"
      },
      {
        name: "Gate Range",
        range: "0.0 dB to 80.0 dB",
        defaultVal: "40.0 dB",
        description: "Sets the amount of attenuation applied when the gate is fully closed.",
        type: "knob"
      },
      {
        name: "Gate Attack",
        range: "0.01 ms - 100.0 ms",
        defaultVal: "1.0 ms",
        description: "Controls how quickly the gate opens when input rises above the threshold.",
        type: "knob"
      },
      {
        name: "Gate Release",
        range: "10.0 ms - 2.5 seconds",
        defaultVal: "150.0 ms",
        description: "Controls how quickly the gate closes after the signal drops below threshold.",
        type: "knob"
      },
      {
        name: "Phase Invert",
        range: "Normal / Invert",
        defaultVal: "Normal",
        description: "Inverts the audio phase by 180 degrees to resolve multi-mic phase cancellation.",
        type: "switch",
        options: ["Normal", "Invert"]
      },
      {
        name: "Output Trim",
        range: "-15.0 dB to +15.0 dB",
        defaultVal: "0.0 dB",
        description: "Master output fader for manual gain matching of the entire channel strip.",
        type: "knob"
      }
    ]
  },
  {
    name: "uadx la-2a silver",
    displayName: "UADx LA-2A Silver Compressor",
    category: "Dynamics",
    description: "The fast-acting silver face T4 Opto-compressor. Known for rapid recovery times, making it excellent for controlling transient-heavy material and vocals.",
    hardwareModel: "Teletronix LA-2A Silver Face Hardware (Late 1960s)",
    proTips: [
      "Keep Gain around 30-40 and increase Peak Reduction until you see 1 to 3 dB of gain reduction for general leveling.",
      "The Silver model has the fastest compression recovery, making it brilliant for bass guitars and punchy lead vocals where slower recovery would 'pump' too much."
    ],
    parameters: [
      {
        name: "Peak Reduction",
        range: "0 - 100 (Continuous)",
        defaultVal: "0",
        description: "Controls the compression threshold. High values produce more compression.",
        type: "knob"
      },
      {
        name: "Gain",
        range: "0 - 100 (Continuous, maps to 0 to +40 dB output makeup)",
        defaultVal: "40",
        description: "Adjusts the output level of the tube makeup amplifier.",
        type: "knob"
      },
      {
        name: "Limit/Compress Switch",
        range: "Compress / Limit",
        defaultVal: "Compress",
        description: "Changes the opto sidechain ratio. Compress is a gentle ~3:1 slope, while Limit mimics a ~10:1 ratio.",
        type: "switch",
        options: ["Compress", "Limit"]
      },
      {
        name: "Meter Select",
        range: "+4 dB / +10 dB / GR (Gain Reduction)",
        defaultVal: "GR",
        description: "Changes the VU meter mode to read gain reduction or output levels.",
        type: "select",
        options: ["+4 dB", "+10 dB", "GR"]
      }
    ]
  },
  {
    name: "uad 1176ln rev e",
    displayName: "UAD 1176LN Rev E Limiting Amplifier",
    category: "Dynamics",
    description: "The legendary solid-state FET limiting amplifier. Ultra-fast transient control with signature grit, solid-state warmth, and compression ratios up to 'all-button' mode.",
    hardwareModel: "Ure/Universal Audio 1176LN Blackface Rev E",
    proTips: [
      "Attack values are counter-intuitive: 1 is the SLOWEST (800 microseconds) and 7 is the FASTEST (20 microseconds). Use 7 for instant transient clamping.",
      "Release values: 1 is SLOWEST (1100 ms), 7 is FASTEST (50 ms). For a punchy drum room or vocal, set Release to 7 to let the transients bloom immediately.",
      "To engage 'All-Button / British Mode' in the UAD 1176, click the Ratio buttons while holding Shift, or use the dedicated ratios."
    ],
    parameters: [
      {
        name: "Input",
        range: "-infinity to 0 (which sets the threshold)",
        defaultVal: "30",
        description: "Adjusts input level and concurrently lowers the threshold of compression.",
        type: "knob"
      },
      {
        name: "Output",
        range: "-infinity to 0",
        defaultVal: "18",
        description: "Compensates for compressed signal loss; sets output makeup gain.",
        type: "knob"
      },
      {
        name: "Attack",
        range: "1 (Slow: 800µs) to 7 (Fast: 20µs)",
        defaultVal: "3",
        description: "Adjusts how quickly the compressor acts on peaks.",
        type: "knob"
      },
      {
        name: "Release",
        range: "1 (Slow: 1100ms) to 7 (Fast: 50ms)",
        defaultVal: "5",
        description: "Determines how quickly the compressor returns to unity gain.",
        type: "knob"
      },
      {
        name: "Ratio",
        range: "4:1 / 8:1 / 12:1 / 20:1 / ALL",
        defaultVal: "4:1",
        description: "Configures the compression curve steepness and knee.",
        type: "select",
        options: ["4:1", "8:1", "12:1", "20:1", "ALL"]
      }
    ]
  },
  {
    name: "uad pultec eqp-1a",
    displayName: "UAD Pultec EQP-1A Passive EQ",
    category: "Equalizers",
    description: "The gold-standard tube program equalizer. Famous for the 'Pultec Trick' of boosting and cutting the same low frequency simultaneously to tighten low-end.",
    hardwareModel: "Pultec EQP-1A Program Equalizer",
    proTips: [
      "Low End Trick: Set Low Frequency to 30 Hz or 60 Hz. Boost and Attenuate at the same time (e.g., Boost to 4, Atten to 3.5). This boosts the bass but carves a resonant dip right above it, cleaning up low-mid mud.",
      "High Boost Q-Factor (Bandwidth) is very musical. Keep it broad (around 5-7) to add airy shine to vocals."
    ],
    parameters: [
      {
        name: "Low Frequency Select",
        range: "20, 30, 60, 100 Hz",
        defaultVal: "30 Hz",
        description: "Chooses the frequency for the dual low-shelf boost and cut circuits.",
        type: "select",
        options: ["20 Hz", "30 Hz", "60 Hz", "100 Hz"]
      },
      {
        name: "Low Boost",
        range: "0 - 10 (Continuous)",
        defaultVal: "0",
        description: "Determines the low frequency shelf boost level.",
        type: "knob"
      },
      {
        name: "Low Atten",
        range: "0 - 10 (Continuous)",
        defaultVal: "0",
        description: "Determines the low frequency shelf attenuation level.",
        type: "knob"
      },
      {
        name: "High Frequency Select",
        range: "3, 4, 5, 8, 10, 12, 16 kHz",
        defaultVal: "12 kHz",
        description: "Sets the peak boost frequency for the high-frequency band.",
        type: "select",
        options: ["3 kHz", "4 kHz", "5 kHz", "8 kHz", "10 kHz", "12 kHz", "16 kHz"]
      },
      {
        name: "High Boost",
        range: "0 - 10 (Continuous)",
        defaultVal: "0",
        description: "Adjusts the amount of high frequency peaking boost.",
        type: "knob"
      },
      {
        name: "High Bandwidth (Q)",
        range: "0 (Sharp) - 10 (Broad)",
        defaultVal: "5",
        description: "Controls the width of the high frequency peaking boost.",
        type: "knob"
      },
      {
        name: "High Atten Frequency",
        range: "5, 10, 20 kHz",
        defaultVal: "10 kHz",
        description: "Selects the shelving cutoff frequency for high-end attenuation.",
        type: "select",
        options: ["5 kHz", "10 kHz", "20 kHz"]
      },
      {
        name: "High Atten",
        range: "0 - 10 (Continuous)",
        defaultVal: "0",
        description: "Adjusts the amount of high frequency shelving attenuation.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad neve 1073",
    displayName: "UAD Neve 1073 Preamp & EQ",
    category: "Preamps & Microphones",
    description: "The definitive British console preamp and equalizer. Renowned for its rich harmonic saturation when driven hard, and high-frequency shelf that adds immediate silk.",
    hardwareModel: "Neve 1073 Console Module",
    proTips: [
      "To get signature Neve saturation: Turn up the Red 'Input Gain' dial (e.g. to 50 or 60 dB) to saturate the transformer, and turn DOWN the grey 'Output Level' fader to prevent digital clipping in your DAW.",
      "The High Shelf is fixed at 12 kHz, but it is incredibly musical. A gentle 2 dB boost can make acoustic guitars, overheads, or vocals jump out of a mix."
    ],
    parameters: [
      {
        name: "Input Gain",
        range: "-20 to -80 dB (Mic) / -20 to +10 dB (Line) in 5 dB steps",
        defaultVal: "Line (-20 dB)",
        description: "Adjusts the input level of the preamplifier. High levels introduce thick analog transformer saturation.",
        type: "knob"
      },
      {
        name: "Output Level",
        range: "-infinity to +12 dB",
        defaultVal: "0 dB",
        description: "Trims the master output level post-EQ.",
        type: "slider"
      },
      {
        name: "High Shelf EQ Gain",
        range: "-16 dB to +16 dB (12 kHz fixed)",
        defaultVal: "0 dB",
        description: "Boosts or cuts high-frequencies at the legendary 12 kHz fixed shelf.",
        type: "knob"
      },
      {
        name: "Mid Band Frequency",
        range: "360 Hz / 720 Hz / 1.6 kHz / 3.2 kHz / 4.8 kHz / 7.2 kHz",
        defaultVal: "1.6 kHz",
        description: "Sets the center frequency for the semi-parametric mid-band.",
        type: "select",
        options: ["360 Hz", "720 Hz", "1.6 kHz", "3.2 kHz", "4.8 kHz", "7.2 kHz"]
      },
      {
        name: "Mid Band Gain",
        range: "-18 dB to +18 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts mid-band frequencies.",
        type: "knob"
      },
      {
        name: "Low Band Frequency",
        range: "35 Hz / 60 Hz / 110 Hz / 220 Hz",
        defaultVal: "110 Hz",
        description: "Sets the shelf corner frequency for the low EQ band.",
        type: "select",
        options: ["35 Hz", "60 Hz", "110 Hz", "220 Hz"]
      },
      {
        name: "Low Band Gain",
        range: "-16 dB to +16 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts low shelf frequencies.",
        type: "knob"
      },
      {
        name: "High Pass Filter Freq",
        range: "Off / 50 Hz / 80 Hz / 160 Hz / 300 Hz",
        defaultVal: "Off",
        description: "Sets the 18 dB/oct high-pass filter frequency.",
        type: "select",
        options: ["Off", "50 Hz", "80 Hz", "160 Hz", "300 Hz"]
      },
      {
        name: "Phase Invert",
        range: "Normal / Invert",
        defaultVal: "Normal",
        description: "Flips the audio phase by 180 degrees.",
        type: "switch",
        options: ["Normal", "Invert"]
      },
      {
        name: "EQ In/Out",
        range: "On / Off",
        defaultVal: "On",
        description: "Enables or bypasses the equalizer circuitry.",
        type: "switch",
        options: ["On", "Off"]
      }
    ]
  },
  {
    name: "uad api vision channel strip",
    displayName: "UAD API Vision Channel Strip",
    category: "Channel Strips",
    description: "Punchy, fast-responding American console channel strip. Celebrated for its tight mid-range punch, aggressive dynamic control, and famous API 'Proportional Q' design.",
    hardwareModel: "API Vision Analog Console Modules (212L, 225L, 235L, 550L)",
    proTips: [
      "The 550L EQ module utilizes API's Proportional Q: gentle boosts have a wide bandwidth, while aggressive boosts narrow down automatically for targeted correction.",
      "The 225L compressor features a 'New/Old' switch. 'Old' utilizes feed-back compression (classic, warmer), while 'New' is feed-forward (aggressive, modern, great for drums)."
    ],
    parameters: [
      {
        name: "212L Preamp Gain",
        range: "+12 dB to +65 dB",
        defaultVal: "12 dB",
        description: "Sets input level and drives the API discrete op-amp for mid-range bite.",
        type: "knob"
      },
      {
        name: "225L Compressor Threshold",
        range: "-20 dB to +10 dB",
        defaultVal: "10 dB",
        description: "Sets the compressor action point.",
        type: "knob"
      },
      {
        name: "225L Compressor Ratio",
        range: "1.0:1 to infinity:1",
        defaultVal: "2.0:1",
        description: "Determines the compression ratio.",
        type: "knob"
      },
      {
        name: "225L Compressor Attack",
        range: "Fast (2ms) / Med (18ms) / Slow (75ms)",
        defaultVal: "Med (18ms)",
        description: "Selects fixed attack speed presets.",
        type: "select",
        options: ["Fast (2ms)", "Med (18ms)", "Slow (75ms)"]
      },
      {
        name: "225L Compressor Release",
        range: "50 ms to 3.0 seconds (Continuous)",
        defaultVal: "250 ms",
        description: "Determines release recovery speed.",
        type: "knob"
      },
      {
        name: "225L Compressor Type",
        range: "Old (Feed-back) / New (Feed-forward)",
        defaultVal: "Old",
        description: "Switches between classic warm feed-back and modern feed-forward detection.",
        type: "switch",
        options: ["Old", "New"]
      },
      {
        name: "235L Gate Threshold",
        range: "-80 dB to +10 dB",
        defaultVal: "-80 dB (Off)",
        description: "Determines when the gate or expander opens.",
        type: "knob"
      },
      {
        name: "235L Gate Depth",
        range: "0 to 80 dB",
        defaultVal: "80 dB",
        description: "Adjusts range of gate attenuation when closed.",
        type: "knob"
      },
      {
        name: "550L EQ High Band Freq",
        range: "2.0k, 3k, 4k, 5k, 7k, 10k, 12.5k, 15k, 20k Hz",
        defaultVal: "10k Hz",
        description: "Sets high band frequency.",
        type: "select",
        options: ["2.0k Hz", "3k Hz", "4k Hz", "5k Hz", "7k Hz", "10k Hz", "12.5k Hz", "15k Hz", "20k Hz"]
      },
      {
        name: "550L EQ High Band Gain",
        range: "-12 dB to +12 dB (in 2 dB steps)",
        defaultVal: "0 dB",
        description: "Boosts or cuts high-band frequencies.",
        type: "knob"
      },
      {
        name: "550L EQ High-Mid Freq",
        range: "800, 1k, 1.5k, 2k, 3k, 4k, 5k, 7k, 12.5k Hz",
        defaultVal: "3k Hz",
        description: "Sets High Mid band center frequency.",
        type: "select",
        options: ["800 Hz", "1k Hz", "1.5k Hz", "2k Hz", "3k Hz", "4k Hz", "5k Hz", "7k Hz", "12.5k Hz"]
      },
      {
        name: "550L EQ High-Mid Gain",
        range: "-12 dB to +12 dB (in 2 dB steps)",
        defaultVal: "0 dB",
        description: "Boosts/cuts high-mid frequencies.",
        type: "knob"
      },
      {
        name: "550L EQ Low-Mid Freq",
        range: "75, 150, 180, 240, 350, 500, 700, 1k, 1.5k Hz",
        defaultVal: "500 Hz",
        description: "Sets Low Mid band center frequency.",
        type: "select",
        options: ["75 Hz", "150 Hz", "180 Hz", "240 Hz", "350 Hz", "500 Hz", "700 Hz", "1k Hz", "1.5k Hz"]
      },
      {
        name: "550L EQ Low-Mid Gain",
        range: "-12 dB to +12 dB (in 2 dB steps)",
        defaultVal: "0 dB",
        description: "Boosts/cuts low-mid frequencies.",
        type: "knob"
      },
      {
        name: "550L EQ Low Band Freq",
        range: "30, 40, 50, 100, 200, 300, 400 Hz",
        defaultVal: "100 Hz",
        description: "Sets low band center frequency.",
        type: "select",
        options: ["30 Hz", "40 Hz", "50 Hz", "100 Hz", "200 Hz", "300 Hz", "400 Hz"]
      },
      {
        name: "550L EQ Low Band Gain",
        range: "-12 dB to +12 dB (in 2 dB steps)",
        defaultVal: "0 dB",
        description: "Boosts/cuts low frequencies.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad ssl 4000 e",
    displayName: "UAD SSL 4000 E Channel Strip",
    category: "Channel Strips",
    description: "The definitive 1980s mixing console strip. Aggressive dynamics gating, versatile VCA compressor, and highly interactive Black/Brown knob EQ bands.",
    hardwareModel: "Solid State Logic 4000 E-Series Console",
    proTips: [
      "Switch the Black/Brown EQ button. Black EQ is cleaner with steeper filters, whereas Brown EQ is broader, gentler, and has a wider, more musical shelf.",
      "The Gate has a extremely fast attack threshold. Use it to cleanly gate snare drums and acoustic instruments."
    ],
    parameters: [
      {
        name: "Input Trim",
        range: "-20 dB to +20 dB",
        defaultVal: "0 dB",
        description: "Adjusts master gain staging before processing.",
        type: "knob"
      },
      {
        name: "Compressor Threshold",
        range: "-30 dB to +10 dB",
        defaultVal: "+10 dB (Off)",
        description: "Sets the compression start point.",
        type: "knob"
      },
      {
        name: "Compressor Ratio",
        range: "1:1 to infinity:1 (Limiter)",
        defaultVal: "2:1",
        description: "Sets the compression slope.",
        type: "knob"
      },
      {
        name: "Compressor Attack",
        range: "Auto-Sensing / Fast (1ms)",
        defaultVal: "Auto-Sensing",
        description: "Sets the response speed of the compressor.",
        type: "switch",
        options: ["Auto-Sensing", "Fast (1ms)"]
      },
      {
        name: "Compressor Release",
        range: "0.1s to 4.0s (or Auto)",
        defaultVal: "0.5s",
        description: "Specifies recovery speed.",
        type: "knob"
      },
      {
        name: "Gate/Expander Threshold",
        range: "-30 dB to +10 dB",
        defaultVal: "-30 dB (Off)",
        description: "Gate threshold setting.",
        type: "knob"
      },
      {
        name: "Gate Range",
        range: "0 to 40 dB",
        defaultVal: "40 dB",
        description: "Specifies how heavily signal below threshold is attenuated.",
        type: "knob"
      },
      {
        name: "Gate Release",
        range: "0.1s to 4.0s",
        defaultVal: "0.5s",
        description: "Determines how fast the gate closes.",
        type: "knob"
      },
      {
        name: "EQ Black/Brown Switch",
        range: "Black / Brown",
        defaultVal: "Black",
        description: "Switches EQ filter response from 'Black' (steeper, cleaner) to 'Brown' (wider, warmer).",
        type: "switch",
        options: ["Black", "Brown"]
      },
      {
        name: "High EQ Freq",
        range: "1.5 kHz - 16.0 kHz",
        defaultVal: "8.0 kHz",
        description: "Corner frequency for High-shelf EQ.",
        type: "knob"
      },
      {
        name: "High EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0 dB",
        description: "Gain control for high EQ band.",
        type: "knob"
      },
      {
        name: "H-Mid EQ Freq",
        range: "600 Hz - 7.0 kHz",
        defaultVal: "3.0 kHz",
        description: "Center frequency for High-Mid band.",
        type: "knob"
      },
      {
        name: "H-Mid EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0 dB",
        description: "Gain control for High-Mid band.",
        type: "knob"
      },
      {
        name: "H-Mid EQ Q-Factor",
        range: "0.5 to 3.0",
        defaultVal: "1.5",
        description: "Bandwidth control for High-Mid band.",
        type: "knob"
      },
      {
        name: "L-Mid EQ Freq",
        range: "200 Hz - 2.5 kHz",
        defaultVal: "600 Hz",
        description: "Center frequency for Low-Mid band.",
        type: "knob"
      },
      {
        name: "L-Mid EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0 dB",
        description: "Gain control for Low-Mid band.",
        type: "knob"
      },
      {
        name: "L-Mid EQ Q-Factor",
        range: "0.5 to 3.0",
        defaultVal: "1.5",
        description: "Bandwidth control for Low-Mid band.",
        type: "knob"
      },
      {
        name: "Low EQ Freq",
        range: "30 Hz - 450 Hz",
        defaultVal: "100 Hz",
        description: "Corner frequency for Low-shelf EQ.",
        type: "knob"
      },
      {
        name: "Low EQ Gain",
        range: "-15 dB to +15 dB",
        defaultVal: "0 dB",
        description: "Gain control for low EQ band.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad fairchild 670",
    displayName: "UAD Fairchild 670 Compressor",
    category: "Dynamics",
    description: "The Holy Grail of tube limiters. Possesses 20 tubes and 14 transformers, delivering golden warmth, slow-moving program-dependent dynamics control, and stereo/MS versatility.",
    hardwareModel: "Fairchild 670 Stereo Limiter",
    proTips: [
      "Time Constant 1 is the fastest (Attack: 0.2ms, Release: 300ms), perfect for drums. Time Constant 4 features a slow 5-second recovery, ideal for program masters.",
      "Time Constant 5 and 6 are highly program-dependent: they recover rapidly on short peaks but slow down during sustained heavy sections, acting as an automatic leveling amplifier."
    ],
    parameters: [
      {
        name: "Input Gain",
        range: "-20 dB to 0 dB",
        defaultVal: "0 dB",
        description: "Controls the signal level arriving at the tube stages.",
        type: "knob"
      },
      {
        name: "Threshold",
        range: "0 to 10 (Continuous)",
        defaultVal: "0",
        description: "Sets the dynamic sensitivity. Higher values increase the gain reduction.",
        type: "knob"
      },
      {
        name: "Time Constant",
        range: "1, 2, 3, 4, 5, 6",
        defaultVal: "1",
        description: "Selects predefined Attack/Release pairings. (1: 0.2ms/0.3s; 2: 0.2ms/0.8s; 3: 0.4ms/2s; 4: 0.8ms/5s; 5: 0.2ms/Auto; 6: 0.4ms/Auto).",
        type: "select",
        options: ["1", "2", "3", "4", "5", "6"]
      },
      {
        name: "AGC Mode",
        range: "Left/Right (Dual Mono) / Stereo Linked / Lat/Vert (Mid/Side)",
        defaultVal: "Stereo Linked",
        description: "Configures sidechain and signal routing for standard stereo or mid/side matrixing.",
        type: "select",
        options: ["Left/Right", "Stereo Linked", "Lat/Vert (MS)"]
      },
      {
        name: "Sidechain Filter",
        range: "Off to 250 Hz (Continuous)",
        defaultVal: "Off",
        description: "Bypasses low-end frequencies in the detection sidechain to prevent bass pumping.",
        type: "knob"
      },
      {
        name: "Output Level",
        range: "-18 dB to +6 dB",
        defaultVal: "0 dB",
        description: "Trims master output gain.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad studer a800",
    displayName: "UAD Studer A800 Multitrack Tape",
    category: "Tape & Saturation",
    description: "The ultimate 24-track 2-inch tape machine simulation. Adds cohesive 'glue', low-end warmth, and natural tape compression across a multi-channel session.",
    hardwareModel: "Studer A800 24-Track Tape Machine",
    proTips: [
      "Drive the Input knob past 0.0 into positive territory to hear the high-end compress smoothly, and trim with the Output knob.",
      "Tape Speed changes everything. 30 IPS provides an extremely flat, high-fidelity response. 15 IPS creates a thick low-frequency 'bass bump' which is perfect for bass guitar and kick drums."
    ],
    parameters: [
      {
        name: "Input",
        range: "-20 dB to +20 dB",
        defaultVal: "0.0 dB",
        description: "Sets the record signal level; higher drive creates tape compression and saturation.",
        type: "knob"
      },
      {
        name: "Output",
        range: "-20 dB to +20 dB",
        defaultVal: "0.0 dB",
        description: "Adjusts playback level back to your DAW console.",
        type: "knob"
      },
      {
        name: "Tape Speed",
        range: "7.5 IPS / 15 IPS / 30 IPS",
        defaultVal: "15 IPS",
        description: "Determines physical tape speed. Lower speeds roll off high end and add a low-frequency bass bump.",
        type: "select",
        options: ["7.5 IPS", "15 IPS", "30 IPS"]
      },
      {
        name: "Tape Formula",
        range: "250 / 456 / 900 / GP9",
        defaultVal: "456",
        description: "Emulates vintage tape formulas with unique headroom thresholds and bias traits.",
        type: "select",
        options: ["250", "456", "900", "GP9"]
      },
      {
        name: "Cal Level",
        range: "+3 dB / +6 dB / +9 dB",
        defaultVal: "+6 dB",
        description: "Sets the operating flux reference level for saturation guidelines.",
        type: "select",
        options: ["+3 dB", "+6 dB", "+9 dB"]
      },
      {
        name: "Bias",
        range: "-50% to +150% (Continuous)",
        defaultVal: "0.0% (Normal)",
        description: "Sets high-frequency bias level, adjusting high-frequency response and distortion traits.",
        type: "knob"
      },
      {
        name: "Sync/Repro path",
        range: "Input / Sync / Repro",
        defaultVal: "Repro",
        description: "Selects monitoring path. Input is direct bypass, Sync reads record head, Repro reads playback head (full tape effect).",
        type: "select",
        options: ["Input", "Sync", "Repro"]
      }
    ]
  },
  {
    name: "uad ampex atr-102",
    displayName: "UAD Ampex ATR-102 Mastering Tape",
    category: "Tape & Saturation",
    description: "The gold-standard 2-track master tape recorder. Delivers final master bus 'glue', stereo widening, and high-frequency saturation for a polished finish.",
    hardwareModel: "Ampex ATR-102 2-Track Master Recorder",
    proTips: [
      "Place this as the absolute last plugin on your master bus. Start with 15 IPS tape speed, GP9 tape formula, and Cal Level at +6 dB.",
      "Turn off the 'Tape Hiss' and 'Hum' controls if they introduce unwanted background noise to your modern digital project."
    ],
    parameters: [
      {
        name: "Record Level",
        range: "-10 dB to +10 dB",
        defaultVal: "0.0 dB",
        description: "Sets input gain driving the recording head.",
        type: "knob"
      },
      {
        name: "Repro Level",
        range: "-10 dB to +10 dB",
        defaultVal: "0.0 dB",
        description: "Adjusts playback level from tape to prevent digital clipping.",
        type: "knob"
      },
      {
        name: "Tape Speed",
        range: "3.75 IPS / 7.5 IPS / 15 IPS / 30 IPS",
        defaultVal: "15 IPS",
        description: "Sets the tape tape transport speed.",
        type: "select",
        options: ["3.75 IPS", "7.5 IPS", "15 IPS", "30 IPS"]
      },
      {
        name: "Tape Formula",
        range: "111 / 250 / 456 / 468 / 900 / GP9",
        defaultVal: "250",
        description: "Emulates standard tape formulations.",
        type: "select",
        options: ["111", "250", "456", "468", "900", "GP9"]
      },
      {
        name: "Tape Width",
        range: "1/4 inch / 1/2 inch / 1 inch",
        defaultVal: "1/2 inch",
        description: "Width of physical tape head. Wider tape yields higher fidelity and lower noise.",
        type: "select",
        options: ["1/4 inch", "1/2 inch", "1 inch"]
      },
      {
        name: "Bias Mode",
        range: "Under / Normal / Over (Continuous)",
        defaultVal: "Normal",
        description: "Specifies high-frequency bias calibration.",
        type: "knob"
      },
      {
        name: "Tape Hiss Switch",
        range: "On / Off",
        defaultVal: "Off",
        description: "Enables or disables simulated tape hiss noise.",
        type: "switch",
        options: ["On", "Off"]
      },
      {
        name: "Hum Switch",
        range: "On / Off",
        defaultVal: "Off",
        description: "Enables or disables 60Hz hum simulator.",
        type: "switch",
        options: ["On", "Off"]
      }
    ]
  },
  {
    name: "uad empirical labs distressor",
    displayName: "UAD Empirical Labs EL8 Distressor",
    category: "Dynamics",
    description: "The modern swiss-army knife of compressors. Excels at aggressive drum room crushing, vocal leveling, and custom harmonic distortion profiles (Dist 2/3).",
    hardwareModel: "Empirical Labs EL8 Distressor Hardware Unit",
    proTips: [
      "Ratio 10:1 (Opto mode) utilizes a custom-designed opto photocell emulator that perfectly mimics a vintage LA-2A response but with adjustable attack/release knobs.",
      "Engage 'Dist 2' for warm tube-style 2nd-order harmonics (great on vocals/basses), or 'Dist 3' for tape-style 3rd-order harmonics (great on drums/masters)."
    ],
    parameters: [
      {
        name: "Input",
        range: "0 to 10 (Continuous)",
        defaultVal: "5",
        description: "Sets input level and concurrently sets the compression threshold.",
        type: "knob"
      },
      {
        name: "Output",
        range: "0 to 10 (Continuous)",
        defaultVal: "5",
        description: "Master makeup gain control.",
        type: "knob"
      },
      {
        name: "Attack",
        range: "0 to 10 (Continuous, 50 microseconds to 30 milliseconds)",
        defaultVal: "5",
        description: "Adjusts transient response attack time.",
        type: "knob"
      },
      {
        name: "Release",
        range: "0 to 10 (Continuous, 50 milliseconds to 3.5 seconds)",
        defaultVal: "5",
        description: "Adjusts compression recovery speed.",
        type: "knob"
      },
      {
        name: "Ratio",
        range: "1:1 / 2:1 / 3:1 / 4:1 / 6:1 / 10:1 (Opto) / 20:1 / Nuke",
        defaultVal: "6:1",
        description: "Configures ratio curves, including 'Nuke' limiting mode.",
        type: "select",
        options: ["1:1", "2:1", "3:1", "4:1", "6:1", "10:1", "20:1", "Nuke"]
      },
      {
        name: "Detector Mode",
        range: "Norm / HP / Bandpass / Link",
        defaultVal: "Norm",
        description: "Adds a sidechain filter. HP cuts sub-bass, Bandpass isolates mid-frequency vocals.",
        type: "select",
        options: ["Norm", "HP", "Bandpass", "Link"]
      },
      {
        name: "Audio Mode",
        range: "Norm / Dist 2 (Tube) / Dist 3 (Tape)",
        defaultVal: "Norm",
        description: "Injects analog harmonic saturation. Dist 2 introduces 2nd harmonics, Dist 3 adds 3rd harmonics.",
        type: "select",
        options: ["Norm", "Dist 2", "Dist 3"]
      },
      {
        name: "Dry/Wet Mix",
        range: "0% to 100% (Continuous)",
        defaultVal: "100%",
        description: "Allows built-in parallel compression.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad capitol chambers",
    displayName: "UAD Capitol Chambers Echo Reverb",
    category: "Reverbs & Delays",
    description: "An incredibly detailed model of Capitol Studios' legendary underground echo chambers (A, B, C, D). Provides lush, dense, completely authentic mechanical reverb.",
    hardwareModel: "Capitol Studios Hollywood Echo Chambers",
    proTips: [
      "Move the 'Mic Position' slider closer to the speaker (0.0) for a tighter, brighter, shorter tail, or further away (1.0) for a highly diffuse, lush stereo spread.",
      "Chamber 4 is Capitol's gold standard—custom-built with a highly reflective shell that provides unmatched vocal reverb density."
    ],
    parameters: [
      {
        name: "Chamber Select",
        range: "Chamber 4 / Chamber 1 / Chamber 2 / Chamber 3",
        defaultVal: "Chamber 4",
        description: "Selects which of the four physical underground rooms to load.",
        type: "select",
        options: ["Chamber 4", "Chamber 1", "Chamber 2", "Chamber 3"]
      },
      {
        name: "Pre-delay",
        range: "0.0 ms to 250.0 ms",
        defaultVal: "0.0 ms",
        description: "Specifies delay gap between dry sound and reverb initiation.",
        type: "knob"
      },
      {
        name: "Decay",
        range: "1.0 second to 10.0 seconds",
        defaultVal: "3.5s",
        description: "Alters decay decay slope via physical mechanical absorption panels.",
        type: "knob"
      },
      {
        name: "Speaker Select",
        range: "Altec 604 / Tannoy Gold",
        defaultVal: "Altec 604",
        description: "Switches the chamber's drive speaker model.",
        type: "switch",
        options: ["Altec 604", "Tannoy Gold"]
      },
      {
        name: "Microphone Select",
        range: "RCA DX-77 (Ribbon) / Neumann KM54 (Tube)",
        defaultVal: "Neumann KM54",
        description: "Switches the physical pickup microphone model.",
        type: "switch",
        options: ["RCA DX-77", "Neumann KM54"]
      },
      {
        name: "Microphone Position",
        range: "0.0 (Close) to 1.0 (Far)",
        defaultVal: "0.5",
        description: "Physically translates the mic stand distance inside the acoustic room.",
        type: "slider"
      },
      {
        name: "Mix",
        range: "0% to 100% (Continuous)",
        defaultVal: "100% (for Aux sends)",
        description: "Sets Dry / Wet balance.",
        type: "knob"
      },
      {
        name: "High Pass Filter Freq",
        range: "Off / 50 Hz to 500 Hz",
        defaultVal: "Off",
        description: "Bypasses low mud entering the room.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad avalon vt-737sp",
    displayName: "UAD Avalon VT-737sp Channel Strip",
    category: "Channel Strips",
    description: "The premier modern vacuum tube channel strip. Integrates a high-headroom preamp, opto compressor, and a lush, musical 4-band equalizer to deliver the polished, glossy sound of modern R&B, hip-hop, and pop.",
    hardwareModel: "Avalon Design VT-737sp Class A Vacuum Tube Channel Strip",
    proTips: [
      "For modern lead vocals, keep the preamplifier gain around +35dB to +45dB and engage the high-pass filter at 80Hz to eliminate sub-rumble.",
      "The 4-band equalizer is highly musical. Use a gentle 2dB boost on the high-frequency band at 15 kHz or 32 kHz to add the legendary Avalon 'air' or 'gloss' to vocals.",
      "Set the compressor to a 4:1 ratio with Medium attack and Fast release for transparent level riding that keeps vocal stems pinned to the front of the mix."
    ],
    parameters: [
      {
        name: "Preamplifier Gain",
        range: "0 to 100 (Continuous, maps to 0dB to +60dB)",
        defaultVal: "40",
        description: "Sets input gain of the twin-triode tube amplifier stage.",
        type: "knob"
      },
      {
        name: "Preamp Mode",
        range: "Line / Mic / Hi-Z",
        defaultVal: "Mic",
        description: "Selects active input source routing.",
        type: "switch",
        options: ["Line", "Mic", "Hi-Z"]
      },
      {
        name: "High Pass Filter Freq",
        range: "Off / 30 Hz - 140 Hz",
        defaultVal: "Off",
        description: "Sets high-pass filter cutoff to remove sub-low frequency rumble.",
        type: "knob"
      },
      {
        name: "Compressor Threshold",
        range: "-20 dB to +20 dB",
        defaultVal: "0 dB",
        description: "Adjusts input level threshold to trigger opto-optical gain reduction.",
        type: "knob"
      },
      {
        name: "Compressor Ratio",
        range: "1:1 / 1.5:1 / 2:1 / 3:1 / 4:1 / 10:1 / 20:1",
        defaultVal: "4:1",
        description: "Sets compression ratio slope.",
        type: "select",
        options: ["1:1", "1.5:1", "2:1", "3:1", "4:1", "10:1", "20:1"]
      },
      {
        name: "Compressor Attack",
        range: "Fast / Medium / Slow",
        defaultVal: "Medium",
        description: "Adjusts opto compressor onset speed.",
        type: "switch",
        options: ["Fast", "Medium", "Slow"]
      },
      {
        name: "Compressor Release",
        range: "Fast / Medium / Slow",
        defaultVal: "Medium",
        description: "Adjusts recovery speed of opto envelope.",
        type: "switch",
        options: ["Fast", "Medium", "Slow"]
      },
      {
        name: "EQ Bass Frequency",
        range: "15 Hz - 150 Hz",
        defaultVal: "60 Hz",
        description: "Sets cutoff frequency of low shelf EQ band.",
        type: "knob"
      },
      {
        name: "EQ Bass Gain",
        range: "-24 dB to +24 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts low-frequency shelving filter.",
        type: "knob"
      },
      {
        name: "EQ Low Mid Frequency",
        range: "35 Hz - 450 Hz",
        defaultVal: "200 Hz",
        description: "Sets center frequency of the parametric low-mid band.",
        type: "knob"
      },
      {
        name: "EQ Low Mid Gain",
        range: "-16 dB to +16 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts low-mid parametric band.",
        type: "knob"
      },
      {
        name: "EQ High Mid Frequency",
        range: "220 Hz - 2.8 kHz",
        defaultVal: "1.0 kHz",
        description: "Sets center frequency of the parametric high-mid band.",
        type: "knob"
      },
      {
        name: "EQ High Mid Gain",
        range: "-16 dB to +16 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts high-mid parametric band.",
        type: "knob"
      },
      {
        name: "EQ Treble Frequency",
        range: "10 kHz - 32 kHz",
        defaultVal: "15 kHz",
        description: "Sets cutoff frequency of high shelf 'air' band.",
        type: "knob"
      },
      {
        name: "EQ Treble Gain",
        range: "-20 dB to +20 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts high-frequency shelving filter.",
        type: "knob"
      },
      {
        name: "Output Level",
        range: "-10 dB to +10 dB",
        defaultVal: "0 dB",
        description: "Controls the main output level fader.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad tube-tech cl 1b mk ii",
    displayName: "UAD Tube-Tech CL 1B mk II Compressor",
    category: "Dynamics",
    description: "An incredibly accurate physical model of Denmark's classic all-tube optical compressor. Renowned as the industry-standard modern vocal leveling amplifier, providing unmatched smooth, buttery dynamic control.",
    hardwareModel: "Lydkraft Tube-Tech CL 1B Optical Compressor (mk II Edition)",
    proTips: [
      "Select 'Fix-Man' attack/release mode for a highly musical, dual-stage program-dependent recovery envelope that adapts automatically to transient bursts.",
      "The CL 1B handles deep gain reduction elegantly without shrinking the stereo image. Don't be afraid to pull 4 to 8 dB of compression on lead vocal tracks.",
      "Engage the Sidechain High Pass switch to prevent heavy kick and bass frequencies from pumping or over-triggering vocal compression."
    ],
    parameters: [
      {
        name: "Gain",
        range: "0 dB to +30 dB",
        defaultVal: "0 dB",
        description: "Adjusts makeup gain after compression.",
        type: "knob"
      },
      {
        name: "Threshold",
        range: "-40 dB to 0 dB",
        defaultVal: "0 dB",
        description: "Adjusts input level threshold to start optical compression.",
        type: "knob"
      },
      {
        name: "Ratio",
        range: "2:1 to 10:1 (Continuous)",
        defaultVal: "2:1",
        description: "Adjusts compression slope severity.",
        type: "knob"
      },
      {
        name: "Attack",
        range: "0.5 ms to 300 ms (Continuous)",
        defaultVal: "10 ms",
        description: "Adjusts speed of compression onset.",
        type: "knob"
      },
      {
        name: "Release",
        range: "0.05 seconds to 10 seconds (Continuous)",
        defaultVal: "0.5 s",
        description: "Adjusts compression envelope recovery speed.",
        type: "knob"
      },
      {
        name: "Attack/Release Select",
        range: "Manual / Fix / Fix-Man",
        defaultVal: "Manual",
        description: "Changes the attack/release timing circuitry mode.",
        type: "select",
        options: ["Manual", "Fix", "Fix-Man"]
      },
      {
        name: "Sidechain High Pass",
        range: "Off / 80 Hz / 150 Hz",
        defaultVal: "Off",
        description: "Cuts low frequencies from entering the sidechain detector path.",
        type: "switch",
        options: ["Off", "80 Hz", "150 Hz"]
      }
    ]
  },
  {
    name: "uad lexicon 480l",
    displayName: "UAD Lexicon 480L Digital Reverb and Effects",
    category: "Reverbs & Delays",
    description: "The gold-standard digital reverb processor that defined the sound of hit records for over three decades. Delivers lush, warm, three-dimensional spaces, halls, plates, and legendary ambient effects.",
    hardwareModel: "Lexicon 480L Digital Effects System (1986)",
    proTips: [
      "The 'Large Hall' algorithm is the absolute classic. Use it on vocals, strings, or backing synths with a Reverb Time of 2.5 seconds to build deep, authentic spatial depth.",
      "Adjust the 'Size' parameter to change the virtual room's physical dimensions. Decreasing size while maintaining decay produces a highly dense, rich early reflection cluster.",
      "The 'Ambience' program is brilliant for drums or dry rhythm sections—it provides spatial 'glue' and acoustic texture without washing out the mix."
    ],
    parameters: [
      {
        name: "Program Select",
        range: "Large Hall / Medium Hall / Small Hall / Large Room / Medium Room / Small Room / Plate / Ambience / Rich Plate",
        defaultVal: "Large Hall",
        description: "Selects active internal acoustic space algorithm.",
        type: "select",
        options: ["Large Hall", "Medium Hall", "Small Hall", "Large Room", "Medium Room", "Small Room", "Plate", "Ambience", "Rich Plate"]
      },
      {
        name: "Reverb Time",
        range: "0.5 s to 20.0 s",
        defaultVal: "2.5 s",
        description: "Adjusts mid-frequency RT60 decay time.",
        type: "knob"
      },
      {
        name: "Size",
        range: "4.0m to 80.0m",
        defaultVal: "36.0 m",
        description: "Alters dimensions of virtual reverberation room.",
        type: "knob"
      },
      {
        name: "Pre-delay",
        range: "0 ms to 500 ms",
        defaultVal: "24 ms",
        description: "Sets separation buffer between dry signal and reverb onset.",
        type: "knob"
      },
      {
        name: "Diffusion",
        range: "0 to 99 (Continuous)",
        defaultVal: "50",
        description: "Controls build-up density of reflections.",
        type: "knob"
      },
      {
        name: "Bass Time",
        range: "0.5x to 4.0x",
        defaultVal: "1.2x",
        description: "Sets decay multiplier for low-frequency reverberation.",
        type: "knob"
      },
      {
        name: "Crossover Frequency",
        range: "100 Hz to 2.0 kHz",
        defaultVal: "500 Hz",
        description: "Determines split point between bass and mid decay control.",
        type: "knob"
      },
      {
        name: "Wet/Dry Mix",
        range: "0% to 100% (Continuous)",
        defaultVal: "100%",
        description: "Controls output dry vs wet balance.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad api 2500",
    displayName: "UAD API 2500 Bus Compressor",
    category: "Dynamics",
    description: "The ultimate punchy VCA stereo master bus compressor. Delivers incredible transient grab, harmonic density, and the signature 'thrust' circuit that keeps low-end frequencies solid and dynamic.",
    hardwareModel: "API 2500 Stereo Bus Compressor Hardware",
    proTips: [
      "Engage the patented 'Thrust' filter to Loud or Medium. This places a high-pass filter on the sidechain detector so that sub-kick and heavy bass do not over-trigger the compressor.",
      "The 'Old' compression mode mimics classic feedback compression (smoother, vintage), while the 'New' mode runs feed-forward compression (ultra-fast, modern, clean, hard-hitting).",
      "Use extremely slow attack times (e.g., 30ms) and fast releases (e.g., 0.1s) with a low ratio of 2:1 on your master bus to clamp down on stray peaks while maintaining transient punch."
    ],
    parameters: [
      {
        name: "Threshold",
        range: "-20 dBu to +10 dBu",
        defaultVal: "+10 dBu",
        description: "Determines signal level where compression begins.",
        type: "knob"
      },
      {
        name: "Ratio",
        range: "1.5:1 / 2:1 / 3:1 / 4:1 / 10:1",
        defaultVal: "2:1",
        description: "Selects active compression ratio curve.",
        type: "select",
        options: ["1.5:1", "2:1", "3:1", "4:1", "10:1"]
      },
      {
        name: "Attack",
        range: "0.03 ms / 0.1 ms / 0.3 ms / 1.0 ms / 3.0 ms / 10 ms / 30 ms",
        defaultVal: "30 ms",
        description: "Determines transient onset response speed.",
        type: "select",
        options: ["0.03 ms", "0.1 ms", "0.3 ms", "1.0 ms", "3.0 ms", "10 ms", "30 ms"]
      },
      {
        name: "Release",
        range: "0.05 s / 0.1 s / 0.2 s / 0.5 s / 1.0 s / 2.0 s / Variable",
        defaultVal: "0.5 s",
        description: "Adjusts speed of recovery to unity gain.",
        type: "select",
        options: ["0.05 s", "0.1 s", "0.2 s", "0.5 s", "1.0 s", "2.0 s", "Variable"]
      },
      {
        name: "Knee Mode",
        range: "Soft / Medium / Hard",
        defaultVal: "Soft",
        description: "Configures how gradually the compressor transitions into gain reduction.",
        type: "switch",
        options: ["Soft", "Medium", "Hard"]
      },
      {
        name: "Thrust Filter",
        range: "Norm / Med / Loud",
        defaultVal: "Norm",
        description: "Activates sidechain spectral filter to preserve low-end power.",
        type: "switch",
        options: ["Norm", "Med", "Loud"]
      },
      {
        name: "Type Mode",
        range: "Old / New",
        defaultVal: "New",
        description: "Switches feedback (Old) vs feed-forward (New) detection architecture.",
        type: "switch",
        options: ["Old", "New"]
      },
      {
        name: "Makeup Gain",
        range: "0 dB to +24 dB",
        defaultVal: "0 dB",
        description: "Compensates master bus levels post-compression.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad thermionic culture vulture",
    displayName: "UAD Thermionic Culture Vulture Distortion",
    category: "Tape & Saturation",
    description: "The premier all-tube valve harmonic distortion processor. Renowned for injecting highly customizable vintage harmonics, grid overdrive, edge, and heavy warm saturation to master buses, vocals, or instrument stems.",
    hardwareModel: "Thermionic Culture Vulture Stereo Valve Saturation Unit",
    proTips: [
      "Toggle the Function switch to 'Triode' for warm, subtle 2nd-order harmonics (excellent for master buses, bass, and overall warm glue).",
      "Switch to 'Pentode' or 'P2' (extreme pentode) to add aggressive 3rd-order odd harmonics—ideal for helping vocals slice through a dense trap or electronic music mix.",
      "The Bias control determines the idle current flowing through the valves. Set it low (closed-off sound) for gating, high-frequency crackle, and dynamic grit."
    ],
    parameters: [
      {
        name: "Drive",
        range: "1 to 11 (Continuous)",
        defaultVal: "1",
        description: "Sets the input drive level pushing the 6AS6 valve tube.",
        type: "knob"
      },
      {
        name: "Function Select",
        range: "Triode / Pentode / P2 (Overdrive)",
        defaultVal: "Triode",
        description: "Switches valve distortion character between even/odd harmonics.",
        type: "select",
        options: ["Triode", "Pentode", "P2"]
      },
      {
        name: "Bias",
        range: "0% to 100% (Continuous, maps to 0.15mA to 0.45mA)",
        defaultVal: "50%",
        description: "Sets tube bias current. Lower values squeeze the signal, higher values warm it up.",
        type: "knob"
      },
      {
        name: "Low Pass Filter",
        range: "Off / 6 kHz / 9 kHz",
        defaultVal: "Off",
        description: "Rolls off harsh high-frequency fizz.",
        type: "switch",
        options: ["Off", "6 kHz", "9 kHz"]
      },
      {
        name: "Output Level",
        range: "-infinity to 0 dB",
        defaultVal: "0 dB",
        description: "Main volume level attenuator.",
        type: "knob"
      },
      {
        name: "Mix",
        range: "0% to 100% (Continuous)",
        defaultVal: "100%",
        description: "Allows parallel wet/dry valve saturation.",
        type: "knob"
      }
    ]
  },
  {
    name: "uad la-6176",
    displayName: "UAD LA-6176 Signature Channel Strip",
    category: "Channel Strips",
    description: "The ultimate vintage channel strip. Blends Universal Audio's legendary 610-B tube preamplifier and high/low shelving EQ with the blistering, classic FET compression circuitry of the 1176.",
    hardwareModel: "Universal Audio LA-6176 Signature Hardware Channel Strip",
    proTips: [
      "Drive the 610 tube preamp 'Input Level' to 7 or 8 for classic vintage tube saturation, then use the Gain stepped switch (-5dB) to manage level matching.",
      "For a classic retro lead vocal sound, route the 610 preamp directly into the 1176 FET section in 4:1 ratio mode. Adjust the threshold knob until peaks trigger 2-4dB of compression.",
      "Engage high EQ boost at 10 kHz to instantly add open, glassy tube silkiness to acoustic guitars or vocals."
    ],
    parameters: [
      {
        name: "610 Tube Preamp Gain",
        range: "-10 to +10 dB (Stepped)",
        defaultVal: "0 dB",
        description: "Sets preamplifier input step level.",
        type: "switch",
        options: ["-10 dB", "-5 dB", "0 dB", "+5 dB", "+10 dB"]
      },
      {
        name: "610 Input Level",
        range: "0 to 10 (Continuous)",
        defaultVal: "5",
        description: "Sets continuous gain to drive the preamp tubes.",
        type: "knob"
      },
      {
        name: "610 High EQ Freq",
        range: "4.5 kHz / 7 kHz / 10 kHz",
        defaultVal: "10 kHz",
        description: "Selects cutoff frequency of the high-frequency shelving filter.",
        type: "switch",
        options: ["4.5 kHz", "7 kHz", "10 kHz"]
      },
      {
        name: "610 High EQ Gain",
        range: "-9 dB to +9 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts high-frequency shelving filter.",
        type: "knob"
      },
      {
        name: "610 Low EQ Freq",
        range: "70 Hz / 100 Hz / 200 Hz",
        defaultVal: "100 Hz",
        description: "Selects cutoff frequency of the low-frequency shelving filter.",
        type: "switch",
        options: ["70 Hz", "100 Hz", "200 Hz"]
      },
      {
        name: "610 Low EQ Gain",
        range: "-9 dB to +9 dB",
        defaultVal: "0 dB",
        description: "Boosts or cuts low-frequency shelving filter.",
        type: "knob"
      },
      {
        name: "1176 Compressor Threshold",
        range: "0 to 100 (Continuous)",
        defaultVal: "0",
        description: "Controls compressor threshold level (Peak Reduction).",
        type: "knob"
      },
      {
        name: "1176 Makeup Gain",
        range: "0 to 100 (Continuous)",
        defaultVal: "50",
        description: "Adjusts makeup volume post-compression.",
        type: "knob"
      },
      {
        name: "1176 Attack",
        range: "1 (Slow: 800µs) to 7 (Fast: 20µs)",
        defaultVal: "3",
        description: "Controls continuous attack onset speed.",
        type: "knob"
      },
      {
        name: "1176 Release",
        range: "1 (Slow: 1100ms) to 7 (Fast: 50ms)",
        defaultVal: "5",
        description: "Controls continuous release recovery speed.",
        type: "knob"
      },
      {
        name: "1176 Ratio Mode",
        range: "4:1 / 8:1 / 12:1 / 20:1 / Bypass",
        defaultVal: "4:1",
        description: "Selects active FET compression ratio curve.",
        type: "select",
        options: ["4:1", "8:1", "12:1", "20:1", "Bypass"]
      }
    ]
  },
  {
    name: "uad manley voxbox",
    displayName: "UAD Manley VOXBOX Channel Strip",
    category: "Channel Strips",
    description: "The absolute pinnacle of all-tube high-end vocal processor channel strips. Features a gorgeous Class A tube preamp, dynamic opto compressor placed BEFORE the preamp to prevent distortion, a Pultec-style passive EQ, and an ultra-precise vocal de-esser/limiter module.",
    hardwareModel: "Manley Laboratories VOXBOX Vacuum Tube Channel Strip",
    proTips: [
      "The compressor is uniquely positioned BEFORE the tube preamp—this lets you smooth out peaks and manage vocal dynamics without overdriving or clipping the sensitive tube input stage.",
      "The mid-parametric EQ operates on passive inductors for incredibly rich, vintage vocal warmth. Try a 2-3dB boost at 1.5 kHz or 3.0 kHz to give vocals clear presence and articulation.",
      "The de-esser/limiter features a dedicated 10% opto limiter that can operate at 10 kHz to pin down sibilants dynamically without dulling the performance."
    ],
    parameters: [
      {
        name: "Preamp Input Gain",
        range: "40 dB to 60 dB (5dB steps)",
        defaultVal: "45 dB",
        description: "Step selector for input vacuum tube gain drive.",
        type: "switch",
        options: ["40 dB", "45 dB", "50 dB", "55 dB", "60 dB"]
      },
      {
        name: "Preamp Low Cut Filter",
        range: "Off / 80 Hz / 120 Hz",
        defaultVal: "Off",
        description: "Steep custom low-cut filter to manage vocal sibilants and rumble.",
        type: "switch",
        options: ["Off", "80 Hz", "120 Hz"]
      },
      {
        name: "Compressor Threshold",
        range: "0 to 100 (Continuous)",
        defaultVal: "0",
        description: "Controls 3:1 opto compression threshold.",
        type: "knob"
      },
      {
        name: "Compressor Attack",
        range: "Fast / Medium / Slow",
        defaultVal: "Medium",
        description: "Adjusts continuous opto attack speed.",
        type: "switch",
        options: ["Fast", "Medium", "Slow"]
      },
      {
        name: "Compressor Release",
        range: "Fast / Medium / Slow",
        defaultVal: "Medium",
        description: "Adjusts continuous opto recovery speed.",
        type: "switch",
        options: ["Fast", "Medium", "Slow"]
      },
      {
        name: "EQ Mid Frequency",
        range: "200 Hz to 7.2 kHz (Stepped passive inductors)",
        defaultVal: "1.0 kHz",
        description: "Sets center frequency for passive mid-range boost EQ.",
        type: "knob"
      },
      {
        name: "EQ Mid Gain",
        range: "-10 dB to +10 dB",
        defaultVal: "0 dB",
        description: "Adjusts passive mid-range boost level.",
        type: "knob"
      },
      {
        name: "De-esser Threshold",
        range: "0 to 100 (Continuous)",
        defaultVal: "0",
        description: "Sets dynamic sibilant compression threshold.",
        type: "knob"
      },
      {
        name: "De-esser Frequency",
        range: "3 kHz / 4.5 kHz / 6 kHz / 9 kHz / 12 kHz",
        defaultVal: "6 kHz",
        description: "Sets passive inductor notch frequency to suppress sibilance.",
        type: "switch",
        options: ["3 kHz", "4.5 kHz", "6 kHz", "9 kHz", "12 kHz"]
      }
    ]
  },
  {
    name: "uad ssl 4000 g bus compressor",
    displayName: "UAD SSL 4000 G Bus Compressor Collection",
    category: "Dynamics",
    description: "The ultimate console master bus compressor. Legendary for its ability to unify, glue, and add commercial radio energy to full stereo mixes, drum buses, or guitar groups.",
    hardwareModel: "Solid State Logic SSL G-Series Stereo Console Master Bus Compressor",
    proTips: [
      "The classic 'Mix Glue' formula: Ratio 4:1, Attack 30ms, Release Auto, and adjust Threshold to draw a rhythmic 1 to 3 dB of gain reduction.",
      "Engage the Sidechain High Pass filter at 80Hz to allow deep kick drums and sub-basses to pass through cleanly without pumping the entire master mix.",
      "Utilize the built-in Mix/Blend control to perform high-ratio parallel master bus compression, preserving natural transients while pulling up soft room elements."
    ],
    parameters: [
      {
        name: "Threshold",
        range: "-20 dB to +20 dB",
        defaultVal: "+20 dB",
        description: "Sets the compression threshold trigger point.",
        type: "knob"
      },
      {
        name: "Ratio",
        range: "2:1 / 4:1 / 10:1",
        defaultVal: "4:1",
        description: "Selects active compression ratio curve.",
        type: "select",
        options: ["2:1", "4:1", "10:1"]
      },
      {
        name: "Attack",
        range: "0.1 ms / 0.3 ms / 1.0 ms / 3.0 ms / 10 ms / 30 ms",
        defaultVal: "30 ms",
        description: "Selects static transient attack speed.",
        type: "select",
        options: ["0.1 ms", "0.3 ms", "1.0 ms", "3.0 ms", "10 ms", "30 ms"]
      },
      {
        name: "Release",
        range: "0.1 s / 0.3 s / 0.6 s / 1.2 s / Auto",
        defaultVal: "Auto",
        description: "Adjusts recovery speed. Auto uses a dynamic dual-stage timing network.",
        type: "select",
        options: ["0.1 s", "0.3 s", "0.6 s", "1.2 s", "Auto"]
      },
      {
        name: "Makeup Gain",
        range: "-5 dB to +15 dB",
        defaultVal: "0 dB",
        description: "Compensates master stereo output volume levels.",
        type: "knob"
      },
      {
        name: "Sidechain High Pass",
        range: "Off / 30 Hz - 240 Hz",
        defaultVal: "Off",
        description: "Cuts sub-bass frequencies from entering sidechain gain detection.",
        type: "knob"
      },
      {
        name: "Mix / Blend",
        range: "0% to 100% (Continuous)",
        defaultVal: "100%",
        description: "Sets dry (uncompressed) to wet (compressed) balance for parallel bus work.",
        type: "knob"
      }
    ]
  }
];

export const getUadPluginInfoByKeyword = (name: string): UADPluginProfile | undefined => {
  const n = name.toLowerCase();
  return UAD_DATABASE.find(p => n.includes(p.name) || p.name.includes(n) || n.includes(p.displayName.toLowerCase()));
};
