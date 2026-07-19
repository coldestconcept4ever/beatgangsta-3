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
  authorizationStatus: string;
}

export const UAD_DATABASE: UADPluginProfile[] = [
  {
    "name": "uad elysia karacter stereo saturator",
    "displayName": "UAD elysia karacter Stereo Saturator",
    "category": "Tape & Saturation",
    "description": "An authentic emulation of the discrete Class-A stereo saturator from elysia. Capable of processing mastering-grade THD, asymmetric clipping, and massive soundshaping via its integrated Color filter and Mix control.",
    "hardwareModel": "elysia karacter Rackmount Saturator",
    "parameters": [
      {
        "name": "Drive",
        "range": "0 dB to 100 dB",
        "defaultVal": "0 dB",
        "description": "Controls the input gain and level of saturation injected into the signal.",
        "type": "knob"
      },
      {
        "name": "Color",
        "range": "Dark to Bright",
        "defaultVal": "Center",
        "description": "Adjusts the tilt filter to shape the high/low frequency response of the saturation.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Provides makeup output gain to balance saturated levels.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Enables parallel processing by blending dry and saturated signals.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Saturate / FET Shred",
        "defaultVal": "Saturate",
        "description": "Switches between warm, linear solid-state saturation and aggressive FET shred clipping.",
        "type": "switch",
        "options": [
          "Saturate",
          "FET Shred"
        ]
      }
    ],
    "proTips": [
      "Set the mix knob around 10-20% and crank the Drive to 10 o'clock for parallel drum-bus saturation. This adds explosive punch without thinning the low frequencies.",
      "Engage 'FET Shred' mode to generate dense asymmetric clipping. It turns standard bass synths into screaming, industrial soundscapes.",
      "The Color control behaves like a tilt filter. Adjust it clockwise to brighten the saturation harmonics or counter-clockwise for dark, warm low-end weight."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad black box analog design hg-2",
    "displayName": "UAD Black Box Analog Design HG-2",
    "category": "Tape & Saturation",
    "description": "A faithful emulation of the highly coveted tubes-and-transformers stereo processor. Merging pentode and triode vacuum tubes with a versatile parallel saturation circuit, it brings thickness, cohesive glue, and high-frequency 'air' to the mix bus.",
    "hardwareModel": "Black Box HG-2 Valve Processor",
    "parameters": [
      {
        "name": "Pentode Gain",
        "range": "0 to 100",
        "defaultVal": "20",
        "description": "Drives the pentode tube stage for warm even-order harmonic saturation.",
        "type": "knob"
      },
      {
        "name": "Triode Gain",
        "range": "0 to 100",
        "defaultVal": "20",
        "description": "Drives the triode tube stage for odd-order harmonic edge and presence.",
        "type": "knob"
      },
      {
        "name": "Saturation Drive",
        "range": "0 to 100",
        "defaultVal": "10",
        "description": "Controls the parallel tube saturation level.",
        "type": "knob"
      },
      {
        "name": "Saturation Freq",
        "range": "Flat / Low / Mid / High",
        "defaultVal": "Flat",
        "description": "Selects the frequency band routed into the parallel saturation tube.",
        "type": "select",
        "options": [
          "Flat",
          "Low",
          "Mid",
          "High"
        ]
      },
      {
        "name": "Air Gain",
        "range": "0 to 100",
        "defaultVal": "15",
        "description": "Applies high-frequency air sheen to polish the top-end spectrum.",
        "type": "knob"
      },
      {
        "name": "Output Trim",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Stages output level after tube driving.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Drive the Pentode stage (warm second-order harmonics) for low-end thickness and glue, while keeping Triode (third-order) lower for general mix bus duties.",
      "Enable the 'Sat' switch to engage the dedicated parallel tube saturation path. Use the Sat Freq selector to target only high frequencies to sweeten sibilant vocals.",
      "The 'Air' knob controls an active tube high-shelf above 10 kHz, providing a silky, professional sheen that standard EQs cannot replicate."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad elysia alpha compressor v2",
    "displayName": "UAD elysia alpha compressor V2",
    "category": "Dynamics",
    "description": "The mastering-grade discrete Class-A VCA compressor from elysia. Renowned for its extreme headroom, flexible sidechain filtering, integrated parallel compression, and unique audio filters that shape tracks with surgical clarity and transparency.",
    "hardwareModel": "elysia alpha Compressor System",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Determines the signal level where the discrete VCA compression engages.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1.2:1 to 5:1",
        "defaultVal": "1.5:1",
        "description": "Sets the compression curve slope. Lower values are ideal for transparent mastering.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.1 ms to 120 ms",
        "defaultVal": "30 ms",
        "description": "Controls how fast the compressor attenuates signals exceeding the threshold.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "50 ms to 1.5 s",
        "defaultVal": "200 ms",
        "description": "Controls the duration the compressor takes to return to unity gain.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Enables parallel compression directly inside the module.",
        "type": "knob"
      },
      {
        "name": "Warmth",
        "range": "Bypassed / Active",
        "defaultVal": "Bypassed",
        "description": "Toggles custom discrete transformer simulation to add analog warmth.",
        "type": "switch",
        "options": [
          "Bypassed",
          "Active"
        ]
      }
    ],
    "proTips": [
      "Use the integrated 'Sidechain Filter' around 150 Hz to allow deep bass kicks to slide through without triggering the VCA compressor and sucking out low-end punch.",
      "Engage the 'Warmth' transformer emulation to add subtle, pleasing vintage coloration and low-frequency saturation to modern digital recordings.",
      "The unique 'Auto Fast' switches dynamically adapt the attack and release times to transients, ensuring transparent and artifact-free leveling on complex material."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad spl vitalizer mk3-t",
    "displayName": "UAD SPL Vitalizer MK3-T",
    "category": "Equalizers",
    "description": "An authentic emulation of the third-generation legendary tube psychoacoustic processor. It unmasks complex frequencies, enhances perceived volume, shapes low-frequency punch, and widens stereo width with absolute phase coherence.",
    "hardwareModel": "SPL Stereo Vitalizer MK3 Tube",
    "parameters": [
      {
        "name": "Drive",
        "range": "-20 dB to +6 dB",
        "defaultVal": "0 dB",
        "description": "Sets the input drive level feeding the psychoacoustic processing circuitry.",
        "type": "knob"
      },
      {
        "name": "Bass Type",
        "range": "Soft / Tight",
        "defaultVal": "Soft",
        "description": "Chooses between warm, resonant bass (Soft) or transient-focused, solid bass (Tight).",
        "type": "switch",
        "options": [
          "Soft",
          "Tight"
        ]
      },
      {
        "name": "Bass Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the amplitude of the optimized low-frequency spectrum.",
        "type": "knob"
      },
      {
        "name": "Mid-High Tune",
        "range": "1 kHz to 22 kHz",
        "defaultVal": "4 kHz",
        "description": "Selects the crossover frequency for mid-high and presence expansion.",
        "type": "knob"
      },
      {
        "name": "Process",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Applies high-frequency presence and clarity sweetening relative to the tune control.",
        "type": "knob"
      },
      {
        "name": "Stereo Expander",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Utilizes phase-correlation mapping to expand the perceived stereo field width.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set Bass to 'Soft' mode for lush, warm bass extension on acoustic mixes, or use 'Tight' mode for aggressive, punchy kick and synth bass tracking.",
      "Increase the Mid-High Tune around 3.5 kHz and adjust the Process level slightly. This pulls vocals and lead instruments forward in the soundstage with incredible clarity.",
      "The Stereo Expander knob widens the soundstage while maintaining center mono-compatibility, perfect for expanding master overheads or synthesizers."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad shadow hills mastering compressor class a",
    "displayName": "UAD Shadow Hills Mastering Compressor Class A",
    "category": "Dynamics",
    "description": "An exacting emulation of the ultra-exclusive Class-A version of the Shadow Hills Mastering Compressor. It couples dual-stage compression—optical and discrete VCA—with hand-wired Lundahl transformers to offer unmatched punch, transient definition, and analog character.",
    "hardwareModel": "Shadow Hills Mastering Compressor Class A",
    "parameters": [
      {
        "name": "Optical Threshold",
        "range": "-40 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Controls the input level feeding the smooth optical leveling amplifier stage.",
        "type": "knob"
      },
      {
        "name": "Optical Gain",
        "range": "0 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Applies makeup volume gain for the optical compressor stage.",
        "type": "knob"
      },
      {
        "name": "VCA Threshold",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the threshold for the ultra-punchy discrete VCA compressor stage.",
        "type": "knob"
      },
      {
        "name": "VCA Ratio",
        "range": "1.2:1 to Flood",
        "defaultVal": "1.2:1",
        "description": "Selects the compression slope slope for the VCA section.",
        "type": "select",
        "options": [
          "1.2:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1",
          "10:1",
          "Flood"
        ]
      },
      {
        "name": "Output Transformer",
        "range": "Nickel / Iron / Steel",
        "defaultVal": "Nickel",
        "description": "Selects the physical output transformer material to apply unique distortion profiles.",
        "type": "select",
        "options": [
          "Nickel",
          "Iron",
          "Steel"
        ]
      }
    ],
    "proTips": [
      "The Class A model is punchier than the standard version. Use the Optical compressor first with a very slow, smooth gain reduction of 1-2 dB to level out vocal or master dynamics.",
      "Follow the Optical stage with the Discrete VCA compressor. Set the Ratio to 1.2:1 with a slow attack (30ms) and fast recovery (0.1s) to glue the master bus perfectly.",
      "Switch the Output Transformer selector. Use 'Nickel' for clean, transparent high-end sheen; 'Iron' for punchy, saturated midrange harmonic weight; and 'Steel' for deep, low-end sub-bass density."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad maag audio eq4 ms",
    "displayName": "UAD Maag Audio EQ4 MS",
    "category": "Equalizers",
    "description": "A professional, six-band dual-channel mastering equalizer famous for its phase-coherent performance and legendary high-shelving 'Air Band'. This MS version adds powerful Mid/Side processing matrix functionality for clinical spatial shaping.",
    "hardwareModel": "Maag Audio EQ4M Dual Mono EQ",
    "parameters": [
      {
        "name": "Sub Gain (10 Hz)",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the sub-bass weight at 10 Hz.",
        "type": "knob"
      },
      {
        "name": "40 Hz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low-frequency punch at 40 Hz.",
        "type": "knob"
      },
      {
        "name": "160 Hz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-mid warmth at 160 Hz.",
        "type": "knob"
      },
      {
        "name": "2.5 kHz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts upper-mid frequency bite and vocal articulation.",
        "type": "knob"
      },
      {
        "name": "Air Band Freq",
        "range": "2.5 / 5 / 10 / 20 / 40 kHz",
        "defaultVal": "20 kHz",
        "description": "Selects the center frequency for the high-shelving Air Band.",
        "type": "select",
        "options": [
          "2.5 kHz",
          "5 kHz",
          "10 kHz",
          "20 kHz",
          "40 kHz"
        ]
      },
      {
        "name": "Air Band Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the legendary high-frequency air boost.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Switch the plugin to 'M/S' mode. Boost the Air Band (set at 20 kHz or 40 kHz) on the 'Sides' channel to open up the stereo width of overheads and room mics without cluttering the center.",
      "Use the Sub Gain band on the 'Mid' channel around 10 Hz to tighten up sub-harmonic rumble or add a solid foundation to kick drums and basses.",
      "To avoid high-frequency harshness, start by setting the Air Freq to 40 kHz and dial in 1.5 dB of gain. It adds microscopic sparkle that opens the mix beautifully."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad a-type multiband enhancer",
    "displayName": "UAD A-Type Multiband Enhancer",
    "category": "Tape & Saturation",
    "description": "Emulates the iconic trick of using a modified vintage Dolby A-Type noise-reduction unit as a high-frequency dynamic enhancer. It separates audio into four bands, applying level-dependent processing that delivers brilliant, air-filled excitement to vocals and acoustic tracks.",
    "hardwareModel": "Dolby Type A 361 Dynamic Card Modification",
    "parameters": [
      {
        "name": "Input Drive",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the incoming signal level hitting the dynamic detector bands.",
        "type": "knob"
      },
      {
        "name": "Band 1 Boost (Low)",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Applies dynamic harmonic enhancement below 80 Hz.",
        "type": "knob"
      },
      {
        "name": "Band 2 Boost (Mid-Low)",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Applies dynamic enhancement between 80 Hz and 3 kHz.",
        "type": "knob"
      },
      {
        "name": "Band 3 Boost (Mid-High)",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Applies dynamic enhancement between 3 kHz and 9 kHz (vocal and guitar presence).",
        "type": "knob"
      },
      {
        "name": "Band 4 Boost (High)",
        "range": "0% to 100%",
        "defaultVal": "40%",
        "description": "Applies dynamic enhancement above 9 kHz (silky air band).",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls the final output makeup level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use this as an alternative to EQ on background vocal groups. It dynamically lifts high-end sibilance and breathiness without making the track sound harsh or clinical.",
      "Activate only the top two bands (Bands 3 & 4) on dull acoustic guitars to bring out dynamic pick scraping, string detail, and finger noise.",
      "Keep input levels modest. The dynamic expansion reacts heavily to signal level; driving it too hard will compress the enhancement instead of adding air."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad la-6176 signature channel strip",
    "displayName": "UAD LA-6176 Signature Channel Strip",
    "category": "Channel Strips",
    "description": "The definitive combination of the warm, harmonic 610-B tube preamp/EQ section and the fast, aggressive FET-based compression circuitry of the legendary 1176. This channel strip offers vintage tube leveling and solid-state transient control in a single, powerful chain.",
    "hardwareModel": "Universal Audio LA-6176 Signature Hardware Channel Strip",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "-10 dB / -5 dB / 0 dB / +5 dB / +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets preamplifier input step level.",
        "type": "switch",
        "options": [
          "-10 dB",
          "-5 dB",
          "0 dB",
          "+5 dB",
          "+10 dB"
        ]
      },
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets continuous gain to drive the preamp tubes.",
        "type": "knob"
      },
      {
        "name": "High EQ Gain",
        "range": "-9 dB to +9 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts high-frequency shelving filter.",
        "type": "knob"
      },
      {
        "name": "Compressor Peak Reduction",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Controls compressor threshold level (Peak Reduction).",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "4:1 / 8:1 / 12:1 / 20:1 / Bypass",
        "defaultVal": "4:1",
        "description": "Selects active FET compression ratio curve.",
        "type": "select",
        "options": [
          "4:1",
          "8:1",
          "12:1",
          "20:1",
          "Bypass"
        ]
      },
      {
        "name": "1176 Makeup Gain",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Adjusts makeup volume post-compression.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Drive the 610 tube preamp 'Input Level' to 7 or 8 for classic vintage tube saturation, then use the Gain stepped switch (-5dB) to manage level matching.",
      "For a classic retro lead vocal sound, route the 610 preamp directly into the 1176 FET section in 4:1 ratio mode. Adjust the threshold knob until peaks trigger 2-4dB of compression.",
      "Engage high EQ boost at 10 kHz to instantly add open, glassy tube silkiness to acoustic guitars or vocals."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad antares auto-tune realtime x",
    "displayName": "UAD Antares Auto-Tune Realtime X",
    "category": "Dynamics",
    "description": "The industry-standard pitch correction software running at near-zero latency on Apollo DSP. It provides real-time correction, classic pitch-glide effects, formant correction, and humanization controls designed to retain expressiveness while achieving perfect tuning.",
    "hardwareModel": "Antares Auto-Tune Hardware DSP Engine",
    "parameters": [
      {
        "name": "Retune Speed",
        "range": "0 ms to 400 ms",
        "defaultVal": "20 ms",
        "description": "Controls how rapidly the pitch correction engine locks the signal to the scale notes.",
        "type": "knob"
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Allows natural pitch expression by ignoring safe, expressive microtonal drifts.",
        "type": "knob"
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Applies dynamic speed reduction on long, sustained vocal notes to preserve natural vibrato.",
        "type": "knob"
      },
      {
        "name": "Throat Length",
        "range": "50% to 150%",
        "defaultVal": "100%",
        "description": "Alters throat format modeling to shift the acoustic size of the vocal tract.",
        "type": "knob"
      },
      {
        "name": "Natural Vibrato",
        "range": "-12 to +12",
        "defaultVal": "0",
        "description": "Amplifies or attenuates the singer's natural, organic vibrato depth.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For the iconic modern trap vocal effect, set Retune Speed to 0 ms (12 o'clock/fastest position) and pull down Humanize. This locks the pitch instantly with heavy robotic sliding.",
      "To achieve natural, transparent vocal correction, use a Retune Speed of 20-50 ms, and dial in 'Flex-Tune' around 50%. This only pulls bad notes into tune while leaving expressive pitch slides intact.",
      "The 'Throat Length' knob models physical vocal tract changes. Turn it slightly clockwise to add chest resonance and depth, or counter-clockwise for a lighter, brighter vocal."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad hemisphere mic collection",
    "displayName": "UAD Hemisphere Mic Collection",
    "category": "Preamps & Microphones",
    "description": "The state-of-the-art microphone modeling system designed specifically for UA microphones. It gives you the authentic sound of legendary dynamic, ribbon, and condenser mics, complete with adjustable proximity, axis alignment, and filter settings.",
    "hardwareModel": "Townsend Labs Sphere / UA Standard Microphones",
    "parameters": [
      {
        "name": "Mic Model",
        "range": "DN-57 / LD-87 / RB-121 / DN-7",
        "defaultVal": "LD-87",
        "description": "Selects the exact target microphone model to emulate.",
        "type": "select",
        "options": [
          "DN-57",
          "LD-87",
          "RB-121",
          "DN-7"
        ]
      },
      {
        "name": "Proximity",
        "range": "-50% to +150%",
        "defaultVal": "100%",
        "description": "Digitally alters the physical bass response based on distance from the microphone diaphragm.",
        "type": "knob"
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 50 Hz / 80 Hz / 120 Hz",
        "defaultVal": "Off",
        "description": "Enables low-frequency rolloff to clean up structural rumble.",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "80 Hz",
          "120 Hz"
        ]
      },
      {
        "name": "Output Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Stages output volume from the microphone emulation.",
        "type": "knob"
      },
      {
        "name": "Phase Polarity",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "description": "Inverts polarity of the microphone signal to prevent phase cancellation.",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ]
      }
    ],
    "proTips": [
      "You can adjust the 'Proximity Effect' in real time after recording. If a vocal sounds too muddy or boomy, slide the proximity knob counter-clockwise to digitally pull the mic away.",
      "Pair the Hemisphere emulations with the UA 610 preamp on the input stage. The combination of rich tube preamp saturation and vintage dynamic microphone modeling mimics iconic 70s rock recordings.",
      "Engage the low-cut switch directly inside the mic modeler to remove sub-harmonic floor vibrations before they impact upstream compressors."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad c-suite c-max limiter",
    "displayName": "UAD C-Suite C-Max Limiter",
    "category": "Dynamics",
    "description": "A high-performance brickwall limiter developed specifically by C-Suite Audio for real-time and mastering applications. Combining transparent loudness maximization with dynamic transient recovery and peak-clipping options, it yields modern competitive levels with minimal distortion.",
    "hardwareModel": "C-Suite Audio DSP Mastering Limiter",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-30 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the gain threshold where brickwall limiting and volume maximization engage.",
        "type": "knob"
      },
      {
        "name": "Ceiling",
        "range": "-2.0 dB to 0 dB",
        "defaultVal": "-0.2 dB",
        "description": "Sets the absolute maximum peak limit allowed at the output of the plugin.",
        "type": "knob"
      },
      {
        "name": "Release Time",
        "range": "1 ms to 1000 ms",
        "defaultVal": "100 ms",
        "description": "Controls how fast the peak limiter releases after catching a transient.",
        "type": "knob"
      },
      {
        "name": "Character",
        "range": "Transparent to Clip",
        "defaultVal": "Transparent",
        "description": "Determines the saturation curve shape of peak limiting, from clinical transparency to warm clipping.",
        "type": "knob"
      }
    ],
    "proTips": [
      "This limiter excels at transient preservation. Use the 'Character' knob to control how the limiter behaves during gain reduction: dial left for ultra-clean transparency, or right for punchy clip clipping.",
      "Set Ceiling to -1.0 dB to prevent inter-sample peaks from clipping during MP3/AAC compression on streaming platforms.",
      "Pair this with a tape saturator before it; saturators round off high peaks smoothly, allowing C-Max to push 2-3 dB of extra master volume effortlessly."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad hitsville reverb chambers",
    "displayName": "UAD Hitsville Reverb Chambers",
    "category": "Reverbs & Delays",
    "description": "The legendary sound of the Hitsville U.S.A. attic reverb chambers that shaped the historic Motown sound. It replicates the unique acoustic characteristics of the custom plaster-and-concrete spaces, offering original vintage speaker and microphone configurations.",
    "hardwareModel": "Hitsville U.S.A. Attic Reverb Chambers",
    "parameters": [
      {
        "name": "Chamber Select",
        "range": "Chamber 1 / Chamber 2",
        "defaultVal": "Chamber 2",
        "description": "Selects between the two custom-built concrete and drywall attic reverb chambers.",
        "type": "switch",
        "options": [
          "Chamber 1",
          "Chamber 2"
        ]
      },
      {
        "name": "Decay",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Adjusts the virtual decay length of the chamber reflections.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 100 ms",
        "defaultVal": "10 ms",
        "description": "Applies delay before the sound enters the chamber speaker path.",
        "type": "knob"
      },
      {
        "name": "Speaker Select",
        "range": "Original / Modern",
        "defaultVal": "Original",
        "description": "Switches the playback speaker between vintage Altec and modern studio monitors.",
        "type": "switch",
        "options": [
          "Original",
          "Modern"
        ]
      },
      {
        "name": "Microphone",
        "range": "KM86 / U67 / D24",
        "defaultVal": "KM86",
        "description": "Selects the capture microphone used inside the chamber room.",
        "type": "select",
        "options": [
          "KM86",
          "U67",
          "D24"
        ]
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Sets the ratio of wet chamber reverb to dry signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Switch between Chamber 1 (historically used for backing bands) and Chamber 2 (tailored for Lead Vocals) to find the perfect acoustic profile.",
      "The 'Mic Position' slider is highly dynamic. Choose 'Far' to emphasize the natural ambient diffusion of the brick and plaster chamber walls.",
      "To mimic the exact Motown technique, use the 'KM86' microphone option with the original speakers and keep the Decay around 2.5 seconds."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad c-suite c-axe guitar noise suppressor",
    "displayName": "UAD C-Suite C-Axe Guitar Noise Suppressor",
    "category": "Guitar & Bass",
    "description": "A dedicated, high-performance dynamic noise suppressor engineered specifically for electric guitar and bass players. Running with ultra-low latency, it tracks signal dynamics to eliminate single-coil buzz, electromagnetic hum, and high-gain amp hiss without altering your pick-attack transient details or natural sustain.",
    "hardwareModel": "C-Suite Audio High-Gain Suppressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-80 dB to 0 dB",
        "defaultVal": "-50 dB",
        "description": "Determines the signal level threshold below which static gating and noise suppression engage.",
        "type": "knob"
      },
      {
        "name": "Attenuation",
        "range": "0 dB to -40 dB",
        "defaultVal": "-20 dB",
        "description": "Sets the depth of volume suppression applied to background noise when the gate is active.",
        "type": "knob"
      },
      {
        "name": "Recovery Speed",
        "range": "Fast to Slow",
        "defaultVal": "Medium",
        "description": "Controls how fast the suppression releases once a guitar transient is detected.",
        "type": "knob"
      },
      {
        "name": "Suppression Mode",
        "range": "Gate / Clean / High-Gain",
        "defaultVal": "High-Gain",
        "description": "Switches between standard gating, soft acoustic guitar expansion, or heavy-metal suppression.",
        "type": "select",
        "options": [
          "Gate",
          "Clean",
          "High-Gain"
        ]
      }
    ],
    "proTips": [
      "Place this plugin as the very first slot in your guitar insert chain. Removing noise before hitting saturated amplifiers or distortion pedals prevents background hiss from being amplified.",
      "The 'Focus' parameter focuses the suppression engine. Set to High-Gain if you play fast palm-muted riffs, or Lead if you require long, sustaining guitar notes.",
      "For single-coil hum, use the 'Low' detection focus mode to isolate and duck low-end electronic hum perfectly."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad hitsville eq collection",
    "displayName": "UAD Hitsville EQ Collection",
    "category": "Equalizers",
    "description": "A pristine emulation of the custom-built, passive graphic equalizers designed by Motown engineers to carve out the punchy, midrange-forward character of the Hitsville catalog. Ideal for shaping vocals, drums, and full mixes with instant retro vibe.",
    "hardwareModel": "Hitsville Custom active inductor Equalizer",
    "parameters": [
      {
        "name": "EQ Model",
        "range": "Graphic / Mastering",
        "defaultVal": "Graphic",
        "description": "Switches between the original graphic channel EQ and the stereo mastering EQ.",
        "type": "switch",
        "options": [
          "Graphic",
          "Mastering"
        ]
      },
      {
        "name": "50 Hz Gain",
        "range": "-8 dB to +8 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts low-end weight at 50 Hz.",
        "type": "knob"
      },
      {
        "name": "800 Hz Gain",
        "range": "-8 dB to +8 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Injects aggressive mid-range presence and grit at 800 Hz.",
        "type": "knob"
      },
      {
        "name": "2 kHz Gain",
        "range": "-8 dB to +8 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Adds bite, intelligibility, and definition at 2 kHz.",
        "type": "knob"
      },
      {
        "name": "12.5 kHz Gain",
        "range": "-8 dB to +8 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Adds silky analog air and sheen at 12.5 kHz.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Motown mixers boosted the 800 Hz and 2 kHz bands aggressively on snare drums and vocals to make them stand out on low-fidelity AM car radios.",
      "On mastering, use the 'Mastering EQ' model with stepped, half-dB detents for precise balance across the mix bus.",
      "Engage the low-end 50 Hz and 130 Hz bands to add rich, vintage warmth to bass lines, giving them authentic Motown roundness."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ams dmx 15-80 s digital delay and pitch shifter",
    "displayName": "UAD AMS DMX 15-80 S Digital Delay and Pitch Shifter",
    "category": "Reverbs & Delays",
    "description": "An authentic software recreation of the pioneering 1980s microprocessor stereo digital delay and pitch shifter. Beloved by top producers, it delivers legendary pitch-shifted widening, gritty early-digital conversion, and lush feedback modulation.",
    "hardwareModel": "AMS DMX 15-80 S Delay Processor",
    "parameters": [
      {
        "name": "Delay Time L",
        "range": "0 ms to 999 ms",
        "defaultVal": "250 ms",
        "description": "Sets the delay time for the Left channel.",
        "type": "knob"
      },
      {
        "name": "Delay Time R",
        "range": "0 ms to 999 ms",
        "defaultVal": "350 ms",
        "description": "Sets the delay time for the Right channel.",
        "type": "knob"
      },
      {
        "name": "Feedback L",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Controls the regeneration level of the Left channel delay.",
        "type": "knob"
      },
      {
        "name": "Feedback R",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Controls the regeneration level of the Right channel delay.",
        "type": "knob"
      },
      {
        "name": "Pitch Shift L",
        "range": "-12 to +12 semitones",
        "defaultVal": "0",
        "description": "Adjusts pitch transposition for the Left channel.",
        "type": "knob"
      },
      {
        "name": "Pitch Shift R",
        "range": "-12 to +12 semitones",
        "defaultVal": "0",
        "description": "Adjusts pitch transposition for the Right channel.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set the Left Channel to a very short delay (20 ms) and shift pitch up by +9 cents. Set the Right Channel to 35 ms and shift pitch down by -9 cents. This creates the classic 80s micro-pitch stereo vocal widening.",
      "Crank the Feedback to 80% with slight pitch transposition on long delay settings to generate organic, evolving space-echo pitch spirals.",
      "Engage VCO lock-in to dynamically modulate the delay time, introducing a lush, tape-like chorus and flutter on electric guitars."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad manley reference microphone preamplifier",
    "displayName": "UAD Manley Reference Microphone Preamplifier",
    "category": "Preamps & Microphones",
    "description": "An authentic emulation of the legendary Manley high-end tube preamplifier circuitry. Recreating the luxurious, high-voltage Class-A design, it delivers exceptional warmth, sweet high-end triode tube saturation, and rich harmonic depth. Designed to run inside Apollo's Unison preamp slots, it matches the physical input impedance, gain staging, and circuit behaviors of the classic hardware, providing an incredible analog front-end for vocals, acoustic instruments, and line-level signals.",
    "hardwareModel": "Manley Mono/Dual Mono Tube Microphone Preamplifier",
    "parameters": [
      {
        "name": "Gain",
        "range": "40 dB to 60 dB",
        "defaultVal": "40 dB",
        "description": "Sets the coarse triode tube amplification level in 5 dB steps, altering the primary drive and headroom of the circuit.",
        "type": "select",
        "options": [
          "40 dB",
          "45 dB",
          "50 dB",
          "55 dB",
          "60 dB"
        ]
      },
      {
        "name": "Attenuate",
        "range": "0 to -24 dB",
        "defaultVal": "0 dB",
        "description": "A continuously variable passive input attenuator to control the level hitting the tube stage.",
        "type": "knob"
      },
      {
        "name": "Low Cut",
        "range": "Flat / 50 Hz / 100 Hz",
        "defaultVal": "Flat",
        "description": "Selects the high-pass filter cutoff frequency to eliminate unwanted sub-bass rumble.",
        "type": "select",
        "options": [
          "Flat",
          "50 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Phase",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "description": "Inverts the polarity of the microphone preamplifier signal.",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ]
      }
    ],
    "proTips": [
      "For clean vocal tracking, set the Gain to 40 dB and use the Attenuate knob to control your peak level. This maintains maximum headroom and pristine transparency.",
      "To inject thick tube warmth into acoustic guitars, crank the Gain step switch to 50 dB or 55 dB and back down the Attenuate knob to about -10 dB to drive the input triode stage into heavy musical saturation."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad api vision channel strip collection",
    "displayName": "UAD API Vision Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The definitive emulation of API's flagship analog console modules, capturing the punchy, high-headroom, and aggressive solid-state character that defined modern American rock and pop. Powered by Unison technology, this plugin models the complete signal path of the 212L preamp, the 225L compressor, the 235L gate/expander, and the legendary 550L/560 five-band proportional-Q equalizers to deliver unmatched mid-range bite and transient impact.",
    "hardwareModel": "API Vision Analog Console Modules (212L, 225L, 235L, 550L)",
    "parameters": [
      {
        "name": "212L Preamp Gain",
        "range": "+12 dB to +65 dB",
        "defaultVal": "12 dB",
        "description": "Sets input gain and drives the API 2520 discrete op-amp for mid-range harmonic bite.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Threshold",
        "range": "-20 dBu to +10 dBu",
        "defaultVal": "10 dBu",
        "description": "Sets the signal level threshold above which compression begins.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Ratio",
        "range": "1.0:1 to Inf:1",
        "defaultVal": "2.0:1",
        "description": "Determines the compression ratio.",
        "type": "knob"
      },
      {
        "name": "550L High EQ Freq",
        "range": "2 kHz to 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects the frequency of the high-frequency band.",
        "type": "select",
        "options": [
          "2 kHz",
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "7 kHz",
          "10 kHz",
          "12.5 kHz",
          "15 kHz",
          "20 kHz"
        ]
      },
      {
        "name": "550L High EQ Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts the high-frequency shelving or peaking band.",
        "type": "knob"
      },
      {
        "name": "235L Gate Threshold",
        "range": "-80 dBu to +10 dBu",
        "defaultVal": "-80 dBu",
        "description": "Determines when the gate or expander opens to let signal pass.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For drum groups, toggle the 225L Compressor Type to 'New' feed-forward mode. Keep ratio at 4:1 with a fast release to maximize snap and decay on cymbals and rooms.",
      "Use the 550L EQ module for vocal tracking. The Proportional Q ensures that narrow boosts stay surgical, while gentle 2 dB boosts at 10 kHz widen to add high-end sheen."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad api preamp",
    "displayName": "UAD API Preamp",
    "category": "Preamps & Microphones",
    "description": "An authentic solid-state preamp emulation that brings the punchy, high-headroom sound of the classic API console to your Apollo interface. Featuring the famous API 2520 discrete operational amplifier and custom output transformers, this Unison-enabled plugin delivers the explosive transient response, upfront mid-range presence, and tight low-end authority that made API preamps legendary on drums, guitars, and vocals.",
    "hardwareModel": "API 212L Microphone Preamplifier",
    "parameters": [
      {
        "name": "Gain",
        "range": "10 dB to 65 dB",
        "defaultVal": "12 dB",
        "description": "Drives the 2520 op-amp stage for punchy, classic solid-state color.",
        "type": "knob"
      },
      {
        "name": "Pad",
        "range": "Off / -20 dB",
        "defaultVal": "Off",
        "description": "Applies a -20 dB attenuation block to manage high-level incoming signals.",
        "type": "switch",
        "options": [
          "Off露出",
          " -20 dB"
        ]
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 75 Hz",
        "defaultVal": "Off",
        "description": "Engages a high-pass filter with a 12 dB per octave slope at 75 Hz.",
        "type": "switch",
        "options": [
          "Off",
          "75 Hz"
        ]
      },
      {
        "name": "Phase",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "description": "Inverts the polarity of the incoming microphone signal.",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ]
      }
    ],
    "proTips": [
      "When tracking direct electric bass, drive the Gain control up to 45 dB with the Pad engaged to saturate the API 2520 op-amp, adding thickness and weight to the low-mids.",
      "For drum overheads, leave the Pad off and set Gain to 20 dB to allow the transient peaks of the cymbals to naturally trigger the fast-responding API circuit without clipping."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad c-suite c-vox noise and ambience reduction",
    "displayName": "UAD C-Suite C-Vox Noise and Ambience Reduction",
    "category": "Dynamics",
    "description": "An advanced real-time noise reduction processor designed specifically for vocal tracking and post-production. Combining high-resolution spectral analysis with zero-latency DSP algorithms, it distinguishes speech and vocal formants from environmental noises, computer fan hums, and untreated room reflections, allowing you to achieve pristine dry vocals in any environment.",
    "hardwareModel": "C-Suite Audio C-Vox Noise Reduction System",
    "parameters": [
      {
        "name": "Reduction",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls the dynamic depth of noise and ambience suppression.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Vocal / Voice",
        "defaultVal": "Vocal",
        "description": "Optimizes the internal algorithms for musical vocal tracking or spoken word applications.",
        "type": "switch",
        "options": [
          "Vocal",
          "Voice"
        ]
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 80 Hz / 120 Hz",
        "defaultVal": "Off",
        "description": "Cuts out low frequency rumble prior to the noise suppression stage.",
        "type": "select",
        "options": [
          "Off",
          "80 Hz",
          "120 Hz"
        ]
      },
      {
        "name": "High Cut Filter",
        "range": "Off / 8 kHz / 12 kHz",
        "defaultVal": "Off",
        "description": "Rolls off harsh high-frequency environmental hiss in non-speech zones.",
        "type": "select",
        "options": [
          "Off",
          "8 kHz",
          "12 kHz"
        ]
      }
    ],
    "proTips": [
      "Start with Reduction set at 35% on Vocal mode during live tracking to clean up home studio reflections without deadening the singer's performance or vocal formants.",
      "For podcast recording in untreated rooms, switch to Voice mode, apply an 80 Hz Low Cut Filter, and dial up Reduction to 50% for pristine, broadcast-ready dialogue."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve dynamics collection",
    "displayName": "UAD Neve Dynamics Collection",
    "category": "Dynamics",
    "description": "An exquisite emulation of classic British Neve diode-bridge dynamics processors. This collection recreates the iconic Neve 2254 and 33609 limiter/compressors, delivering their legendary creamy, round transient response, thick density, and musical coloration. Ideal for gluing the stereo mix bus, taming dynamic drum groups, or adding rich warmth to vocals and acoustic pianos.",
    "hardwareModel": "Neve 2254/33609 Diode-Bridge Dynamics",
    "parameters": [
      {
        "name": "Compressor Threshold",
        "range": "-20 dBu to +10 dBu",
        "defaultVal": "10 dBu",
        "description": "Sets the signal level above which diode-bridge compression begins.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 6:1",
        "defaultVal": "3:1",
        "description": "Selects the compression slope slope.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1"
        ]
      },
      {
        "name": "Compressor Recovery",
        "range": "100 ms / 400 ms / 800 ms / 1.5 s / Auto",
        "defaultVal": "400 ms",
        "description": "Sets the release time of the compressor circuit.",
        "type": "select",
        "options": [
          "100 ms",
          "400 ms",
          "800 ms",
          "1.5 s",
          "Auto"
        ]
      },
      {
        "name": "Limiter Threshold",
        "range": "+4 dBu to +20 dBu",
        "defaultVal": "+20 dBu",
        "description": "Sets the threshold of the secondary, ultra-fast peak limiting stage.",
        "type": "knob"
      },
      {
        "name": "Makeup Gain",
        "range": "0 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls output signal volume recovery after gain reduction.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To glue a stereo mix bus, set the compressor to 1.5:1 ratio, Recovery to Auto, and dial the Threshold to achieve a subtle 1.5 dB of gain reduction. This provides cohesive, warm vintage density.",
      "On a drum sub-mix, use 4:1 ratio, set Recovery to 100 ms, and slam the threshold to 0 dBu to induce warm, pumping energy and bring out room decays."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 1084 preamp and eq",
    "displayName": "UAD Neve 1084 Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "A precise emulation of Neve's classic Class-A channel amplifier. Building upon the famous 1073 preamp architecture, the 1084 delivers the same rich, transformer-coupled preamp section but expands equalizing versatility by adding three selectable high shelf frequencies, a mid-band High-Q switch, and a high-pass/low-pass filter network. Perfect for surgical tone sculpting with heavy British character.",
    "hardwareModel": "Neve 1084 Channel Amplifier",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-80 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Drives the virtual Class-A Marinair transformer, stepping in 5 dB increments.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 45 Hz / 70 Hz / 160 Hz / 360 Hz",
        "defaultVal": "Off",
        "description": "Selects the low frequency cutoff point for the high-pass filter.",
        "type": "select",
        "options": [
          "Off",
          "45 Hz",
          "70 Hz",
          "160 Hz",
          "360 Hz"
        ]
      },
      {
        "name": "High EQ Frequency",
        "range": "10 kHz / 12 kHz / 16 kHz",
        "defaultVal": "12 kHz",
        "description": "Sets the target frequency for the high-frequency shelving filter.",
        "type": "select",
        "options": [
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ]
      },
      {
        "name": "Mid EQ Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts the peaking mid-band frequency.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Frequency",
        "range": "0.35 kHz / 0.7 kHz / 1.6 kHz / 3.2 kHz / 4.8 kHz / 7.2 kHz",
        "defaultVal": "1.6 kHz",
        "description": "Sets the center frequency of the parametric mid band.",
        "type": "select",
        "options": [
          "0.35 kHz",
          "0.7 kHz",
          "1.6 kHz",
          "3.2 kHz",
          "4.8 kHz",
          "7.2 kHz"
        ]
      },
      {
        "name": "Mid Q Factor",
        "range": "Normal / High Q",
        "defaultVal": "Normal",
        "description": "Switches the mid filter bandwidth between broad and narrow settings.",
        "type": "switch",
        "options": [
          "Normal",
          "High Q"
        ]
      }
    ],
    "proTips": [
      "Engage High Q on the mid band at 3.2 kHz to carve out narrow, harsh resonance peaks from electric guitars, while preserving the surrounding warm frequencies.",
      "Set High EQ to 16 kHz and boost 2 to 4 dB on acoustic guitars to inject a beautifully soft, expensive-sounding air band that sits perfectly in a pop mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad avalon vt-737sp channel strip",
    "displayName": "UAD Avalon VT-737sp Channel Strip",
    "category": "Channel Strips",
    "description": "A pristine emulation of the undisputed king of modern R&B and pop vocal chains. Recreating the Class-A vacuum tube preamplifier, opto-compressor, and musical four-band passive EQ, this channel strip delivers the glossy, expensive-sounding 'high-glass' vocal tone that Avalon is world-famous for, complete with high-headroom tracking capabilities.",
    "hardwareModel": "Avalon Design VT-737sp Class-A Vacuum Tube Channel Strip",
    "parameters": [
      {
        "name": "Preamplifier Gain",
        "range": "0 dB to +60 dB",
        "defaultVal": "30 dB",
        "description": "Adjusts the twin-triode vacuum tube preamp input gain stage.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the level at which the optical compressor starts gain attenuation.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 / 1.5:1 / 2:1 / 3:1 / 4:1 / 10:1 / 20:1",
        "defaultVal": "4:1",
        "description": "Selects the compression slope slope.",
        "type": "select",
        "options": [
          "1:1",
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "10:1",
          "20:1"
        ]
      },
      {
        "name": "Treble Frequency",
        "range": "10 kHz to 32 kHz",
        "defaultVal": "15 kHz",
        "description": "Sets the high shelving EQ frequency band (includes the famous 32 kHz air band).",
        "type": "knob"
      },
      {
        "name": "Treble Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts the high-frequency passive shelving filter.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter Freq",
        "range": "Off / 30 Hz to 140 Hz",
        "defaultVal": "Off",
        "description": "Sets the active high pass filter cutoff frequency.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a classic R&B lead vocal, set Treble Frequency to 32 kHz and boost the Treble Gain by 3 dB. This yields the ultra-smooth, high-end 'gloss' that Avalon is famous for.",
      "Keep the compressor ratio at 2:1, attack set to fast, and release set to slow to ride vocal performances transparently without squeezing the life out of them."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad oxford supresser ds",
    "displayName": "UAD Oxford SuprEsser DS",
    "category": "Dynamics",
    "description": "An exceptionally surgical, professional dynamic de-esser. Utilizing a highly advanced linear-phase crossover filter with real-time FFT spectrum tracking, the SuprEsser isolates and compresses only the offending sibilance frequencies when they exceed the threshold, ensuring transparent, lisp-free vocal treatments.",
    "hardwareModel": "Sonnox Oxford SuprEsser DS",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-50 dB to 0 dB",
        "defaultVal": "-20 dB",
        "description": "Determines the activation level for dynamic spectral attenuation.",
        "type": "knob"
      },
      {
        "name": "Center Frequency",
        "range": "1 kHz to 20 kHz",
        "defaultVal": "6.5 kHz",
        "description": "Targets the exact frequency of vocal sibilance or whistling cymbals.",
        "type": "knob"
      },
      {
        "name": "Bandwidth",
        "range": "0.1 to 4.0 Octaves",
        "defaultVal": "1.0 Octave",
        "description": "Sets the frequency range width around the selected center frequency.",
        "type": "knob"
      },
      {
        "name": "Reduction Amount",
        "range": "0 dB to -24 dB",
        "defaultVal": "0 dB",
        "description": "Sets the maximum allowable dynamic gain reduction.",
        "type": "knob"
      },
      {
        "name": "Auto Threshold",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages dynamic tracking to lower or raise threshold based on the input signal level.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "When dealing with dynamic singers, turn on 'Auto Threshold'. This ensures that quiet, intimate vocal lines are de-essed just as effectively as loud, belted choruses.",
      "Set the Center Frequency around 3.5 kHz with a narrow Bandwidth to isolate and squash the painful 'clicky' pick attack transients of clean electric guitars."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad diezel vh4 amplifier",
    "displayName": "UAD Diezel VH4 Amplifier",
    "category": "Guitar & Bass",
    "description": "The definitive emulation of the heavy guitar benchmark: Diezel's legendary VH4 tube head. Capturing all four channels (Clean, Crunch, Mega, and Lead), this plugin delivers the massive, tight low-end, complex mid-range grind, and searing distortion characteristics that made the VH4 a staple for modern heavy rock and metal production.",
    "hardwareModel": "Diezel VH4 100W Tube Head",
    "parameters": [
      {
        "name": "Channel Select",
        "range": "CH 1 / CH 2 / CH 3 / CH 4",
        "defaultVal": "CH 3",
        "description": "Selects the active channel pre-amp model.",
        "type": "select",
        "options": [
          "Channel 1",
          "Channel 2",
          "Channel 3",
          "Channel 4"
        ]
      },
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the pre-amp stage into saturation, compression, and high-gain clipping.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the low-frequency response of the preamp tone stack.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Shapes the crucial mid-range frequencies of the amplifier.",
        "type": "knob"
      },
      {
        "name": "Deep",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Controls the low-end sub-bass cabinet resonance in the power amp stage.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Adjusts the high-frequency bite and sizzle in the power amp stage.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For classic modern metal rhythm tracks, select Channel 3, dial the Gain to 5, set Middle to 6, and boost the Deep knob to 7 for chest-thumping low-end chunk.",
      "Use Channel 1 (Clean) with Bass rolled back and Presence pushed to 7 for a crystalline, high-headroom pristine tone that responds beautifully to delays and reverbs."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad auto-tune realtime access",
    "displayName": "UAD Auto-Tune Realtime Access",
    "category": "Dynamics",
    "description": "A highly streamlined, zero-latency edition of Antares' legendary pitch-correction technology. Tailored for live tracking and fast workflows, it offers essential pitch correction controls with an intuitive interface, keeping vocals perfectly locked in pitch without CPU overhead.",
    "hardwareModel": "Antares Auto-Tune Access",
    "parameters": [
      {
        "name": "Retune Speed",
        "range": "Fast / Medium / Slow",
        "defaultVal": "Medium",
        "description": "Sets how quickly the engine pulls pitch deviations to the closest scale notes.",
        "type": "switch",
        "options": [
          "Fast",
          "Medium",
          "Slow"
        ]
      },
      {
        "name": "Humanize",
        "range": "None / Light / Normal",
        "defaultVal": "None",
        "description": "Preserves natural vibrato and slow pitch variations on sustained notes.",
        "type": "switch",
        "options": [
          "None",
          "Light",
          "Normal"
        ]
      },
      {
        "name": "Scale Key",
        "range": "C / C# / D / D# / E / F / G / A / B",
        "defaultVal": "C",
        "description": "Sets the central key note of the target musical correction scale.",
        "type": "select",
        "options": [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "G",
          "A",
          "B"
        ]
      }
    ],
    "proTips": [
      "For the classic, hard-tuning 'T-Pain' pop vocal effect, set the Retune Speed to Fast and turn Humanize to None. This locks pitch corrections instantly.",
      "For transparent pitch correction while tracking, choose a Medium retune speed and Normal humanize. This subtly centers pitch notes without sounding robotic."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ua 175b and 176 tube compressor collection",
    "displayName": "UAD UA 175B and 176 Tube Compressor Collection",
    "category": "Dynamics",
    "description": "An incredibly rich emulation of Bill Putnam Sr.'s iconic 1960s variable-mu tube limiters. Precursors to the solid-state 1176, the UA 175B and 176 deliver a fast-responding feedback compression envelope with luscious harmonic saturation, vintage tube color, and immense dynamic control on vocals, bass, and drums.",
    "hardwareModel": "Universal Audio 175B and 176 Tube Limiters",
    "parameters": [
      {
        "name": "Model Select",
        "range": "UA 175B / UA 176",
        "defaultVal": "UA 176",
        "description": "Switches between the 175B (fixed ratio) and 176 (selectable ratio) compression models.",
        "type": "switch",
        "options": [
          "UA 175B",
          "UA 176"
        ]
      },
      {
        "name": "Input Gain",
        "range": "0 to 100",
        "defaultVal": "30",
        "description": "Adjusts the level entering the tube stage, driving compression depth and saturation.",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "0 to 100",
        "defaultVal": "60",
        "description": "Sets the final cleanup makeup gain level after compression.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "1 to 7",
        "defaultVal": "3",
        "description": "Sets transient onset time; higher values correspond to slower attack times.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "1 to 7",
        "defaultVal": "4",
        "description": "Determines the gain recovery time; higher values correspond to slower release times.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 8:1 / 12:1",
        "defaultVal": "4:1",
        "description": "Selects the compression ratio slope (only active on the UA 176 model).",
        "type": "select",
        "options": [
          "2:1",
          "4:1",
          "8:1",
          "12:1"
        ]
      }
    ],
    "proTips": [
      "On lead vocals, load the UA 176 model at a 4:1 ratio. Set Attack to 4 and Release to 3 to achieve smooth, vintage leveling with pleasing tube grit.",
      "Use the UA 175B on bass guitars. Crank the Input Gain past 50 to saturate the vacuum tubes, producing a warm, thick harmonic sustain that keeps the low-end pinned."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad capitol chambers",
    "displayName": "UAD Capitol Chambers",
    "category": "Reverbs & Delays",
    "description": "A breathtakingly detailed acoustic emulation of the legendary underground concrete echo chambers at Capitol Studios in Hollywood. This plugin offers unparalleled realism, capturing the rich, high-density reflections, custom Altec speakers, and vintage Neumann/RCA microphones that have graced thousands of hit records.",
    "hardwareModel": "Capitol Studios Echo Chambers",
    "parameters": [
      {
        "name": "Chamber Select",
        "range": "Chamber 4 / Chamber 1 / Chamber 2 / Chamber 3",
        "defaultVal": "Chamber 4",
        "description": "Loads one of the four unique, physically modelled concrete echo rooms.",
        "type": "select",
        "options": [
          "Chamber 4",
          "Chamber 1",
          "Chamber 2",
          "Chamber 3"
        ]
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 250 ms",
        "defaultVal": "0 ms",
        "description": "Sets the delay time before the direct signal enters the chamber.",
        "type": "knob"
      },
      {
        "name": "Decay",
        "range": "1.0s to 10.0s",
        "defaultVal": "3.5s",
        "description": "Controls the reverb tail decay time using physical mechanical panels inside the chambers.",
        "type": "knob"
      },
      {
        "name": "Microphone Position",
        "range": "0.0 to 1.0",
        "defaultVal": "0.5",
        "description": "Moves the virtual pickup microphones closer or further from the speakers.",
        "type": "slider"
      },
      {
        "name": "Speaker Select",
        "range": "Altec 604 / Tannoy Gold",
        "defaultVal": "Altec 604",
        "description": "Selects the physical driver speaker inside the underground echo room.",
        "type": "switch",
        "options": [
          "Altec 604",
          "Tannoy Gold"
        ]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Balances the dry signal with the wet chamber reflections.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To get maximum density on lead vocals, select Chamber 4 with the Neumann KM54 microphone model. Set Microphone Position to 0.7 for huge, 3D stereo width.",
      "Use Altec 604 speakers and a low decay setting (1.5s) on drum loops to inject the organic woody ambience of a physical space without washing out the beat."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad tube-tech cl 1b mk ii",
    "displayName": "UAD Tube-Tech CL 1B mk II",
    "category": "Dynamics",
    "description": "An exceptionally accurate emulation of Denmark's classic blue optical compressor. Renowned as the modern industry standard for lead vocal leveling, the CL 1B delivers buttery smooth gain reduction, musical opto-cell dynamics, and high-fidelity tube warmth, keeping vocals upfront and perfectly integrated into dense modern mixes.",
    "hardwareModel": "Tube-Tech CL 1B Opto Compressor",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 dB to +30 dB",
        "defaultVal": "0 dB",
        "description": "Controls the output makeup gain following optical compression.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "-40 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the signal level threshold above which gain reduction triggers.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 to 10:1",
        "defaultVal": "2:1",
        "description": "Adjusts the optical compression slope.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.5 ms to 300 ms",
        "defaultVal": "10 ms",
        "description": "Sets the speed at which the opto-coupler reacts to incoming transients.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.05s to 10s",
        "defaultVal": "0.5s",
        "description": "Determines the recovery speed of the optical compression envelope.",
        "type": "knob"
      },
      {
        "name": "Attack/Release Select",
        "range": "Manual / Fix / Fix-Man",
        "defaultVal": "Manual",
        "description": "Switches between manual controls, fixed times, and hybrid program-dependent modes.",
        "type": "select",
        "options": [
          "Manual",
          "Fix",
          "Fix-Man"
        ]
      }
    ],
    "proTips": [
      "Switch the Attack/Release select to 'Fix-Man' on lead vocals. This dual-stage recovery setting yields incredibly musical dynamic tracking.",
      "For electric bass, use a high ratio (6:1) with a manual 20 ms attack and 0.3s release. This pins down low frequencies while preserving the punchy string attack."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad v76 preamp",
    "displayName": "UAD V76 Preamp",
    "category": "Preamps & Microphones",
    "description": "A meticulous emulation of the legendary Telefunken V76 tube preamplifier. Known as the powerhouse behind the sound of Abbey Road Studios in the 1960s, this pentode tube preamp delivers massive, organic low-end warmth, a colorful, harmonically rich mid-range, and a unique, glassy top-end that flatters any source.",
    "hardwareModel": "Telefunken V76 Vacuum Tube Preamplifier",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 dB to 76 dB",
        "defaultVal": "34 dB",
        "description": "Drives the virtual pentode tube stages, adding rich tube compression and harmonic coloration.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 80 Hz / 120 Hz / 300 Hz",
        "defaultVal": "Off",
        "description": "Selects the low frequency cutoff point to clean up unwanted sub-rumble or proximity build-up.",
        "type": "select",
        "options": [
          "Off",
          "80 Hz",
          "120 Hz",
          "300 Hz"
        ]
      },
      {
        "name": "Phase Polarity",
        "range": "Normal / Inverted",
        "defaultVal": "Normal",
        "description": "Flips the phase polarity of the signal.",
        "type": "switch",
        "options": [
          "Normal",
          "Inverted"
        ]
      },
      {
        "name": "Output Trim",
        "range": "-20 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Provides clean output volume attenuation to balance hot tube drive levels.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For acoustic guitars, set the Gain to 50 dB and engage the 80 Hz High Pass Filter. This adds complex, shimmering high harmonics without muddying the body.",
      "Run an electric bass into the V76, push the Gain to 65 dB, and use the Output Trim to prevent digital clipping. The resulting growling tube overdrive is unmatched."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad auto-tune realtime advanced",
    "displayName": "UAD Auto-Tune Realtime Advanced",
    "category": "Dynamics",
    "description": "The ultimate zero-latency pitch correction suite designed for live tracking and professional studio work. Combining high-precision pitch detection with highly customizable scale controls, Flex-Tune natural pitch preservation, and humanize options, it delivers perfect tuning results in real time.",
    "hardwareModel": "Antares Auto-Tune Realtime Advanced",
    "parameters": [
      {
        "name": "Retune Speed",
        "range": "0 ms to 400 ms",
        "defaultVal": "20 ms",
        "description": "Determines the rate at which pitch correction is applied. 0ms is absolute robotic locking.",
        "type": "knob"
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "10",
        "description": "Allows natural vocal expression and microtonal pitch variations to slip through.",
        "type": "knob"
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Protects fast, natural pitch transitions on sustained vocal notes.",
        "type": "knob"
      },
      {
        "name": "Tracking Sensitivity",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Adjusts how sensitive the tracking engine is to quiet breaths, sibilance, and noise.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For modern pop vocals, set Retune Speed to 8 ms and Flex-Tune to 30%. This delivers a tightly tuned vocal that still feels expressive and human.",
      "When tracking in noisy rooms or untreated home environments, lower the Tracking Sensitivity to 40% to prevent the tuner from tracking background ambient noise."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad diezel herbert amplifier",
    "displayName": "UAD Diezel Herbert Amplifier",
    "category": "Guitar & Bass",
    "description": "The monumental 180W German guitar amplifier. Famous for its crushing wall-of-sound rhythm guitar tones and revolutionary, highly tunable on-board 'Midcut' equalization circuit that scoops out cabinet boxiness.",
    "hardwareModel": "Diezel Herbert 180W KT77 Tube Head",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "4.5",
        "description": "Controls preamp tube saturation and compression depth.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts low shelf frequency level.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5.5",
        "description": "Adjusts core midrange presence before Midcut.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls string clarity and biting treble edge.",
        "type": "knob"
      },
      {
        "name": "Midcut Intensity",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Sets the notch depth of the dedicated mid-cut circuit.",
        "type": "knob"
      },
      {
        "name": "Deep",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Controls ultra-low power-amp cabinet resonance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Engage the Midcut switch. Turn Intensity to 1 o'clock and Level to 11 o'clock. This carves out mud around 400Hz, letting you track massive, high-gain rhythm guitars that don't crowd the vocal track.",
      "Herbert has extreme headroom. Set the Master Volume high and back off on the Preamp Gain (around 10 o'clock) to get a punchier, tighter transient response for progressive metal riffs.",
      "The on-board Deep control adds sub-resonance below 100 Hz. Adjust it carefully to match your monitor system to avoid over-powering your low end."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad lexicon 480l digital reverb and effects",
    "displayName": "UAD Lexicon 480L Digital Reverb and Effects",
    "category": "Reverbs & Delays",
    "description": "The gold-standard digital reverb processor that defined the sound of hit records for over three decades. Delivers lush, warm, three-dimensional spaces, halls, plates, and legendary ambient effects.",
    "hardwareModel": "Lexicon 480L Digital Effects System (1986)",
    "parameters": [
      {
        "name": "Program Select",
        "range": "Large Hall / Medium Hall / Small Hall / Large Room / Medium Room / Small Room / Plate / Ambience / Rich Plate",
        "defaultVal": "Large Hall",
        "description": "Selects active internal acoustic space algorithm.",
        "type": "select",
        "options": [
          "Large Hall",
          "Medium Hall",
          "Small Hall",
          "Large Room",
          "Medium Room",
          "Small Room",
          "Plate",
          "Ambience",
          "Rich Plate"
        ]
      },
      {
        "name": "Reverb Time",
        "range": "0.5 s to 20.0 s",
        "defaultVal": "2.5 s",
        "description": "Adjusts mid-frequency RT60 decay time.",
        "type": "knob"
      },
      {
        "name": "Size",
        "range": "4.0m to 80.0m",
        "defaultVal": "36.0 m",
        "description": "Alters dimensions of virtual reverberation room.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 500 ms",
        "defaultVal": "24 ms",
        "description": "Sets separation buffer between dry signal and reverb onset.",
        "type": "knob"
      },
      {
        "name": "Diffusion",
        "range": "0 to 99 (Continuous)",
        "defaultVal": "50",
        "description": "Controls build-up density of reflections.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100% (Continuous)",
        "defaultVal": "100%",
        "description": "Controls output dry vs wet balance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The 'Large Hall' algorithm is the absolute classic. Use it on vocals, strings, or backing synths with a Reverb Time of 2.5 seconds to build deep, authentic spatial depth.",
      "Adjust the 'Size' parameter to change the virtual room's physical dimensions. Decreasing size while maintaining decay produces a highly dense, rich early reflection cluster.",
      "The 'Ambience' program is brilliant for drums or dry rhythm sections—it provides spatial 'glue' and acoustic texture without washing out the mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad softube vocoder",
    "displayName": "UAD Softube Vocoder",
    "category": "Dynamics",
    "description": "A highly versatile classic vocoder module designed by Softube. It combines vintage analog synth carrier modeling with rich spectral band-splitting, allowing users to craft classic 70s synth-voices and modern vocal effects.",
    "hardwareModel": "Softube Vocoder",
    "parameters": [
      {
        "name": "Vocoding Bands",
        "range": "4 to 24 Bands",
        "defaultVal": "16 Bands",
        "description": "Sets the number of spectral bands splitting the audio carrier.",
        "type": "knob"
      },
      {
        "name": "Carrier Waveform",
        "range": "Saw / Pulse / Noise",
        "defaultVal": "Saw",
        "description": "Selects the internal carrier oscillator synthesis shape.",
        "type": "select",
        "options": [
          "Saw",
          "Pulse",
          "Noise"
        ]
      },
      {
        "name": "High Pass Filter",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Filters modulator low-frequencies to clean up vocal rumble.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Consonants Level",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Controls the level of dynamic noise injected to keep speech consonants clear.",
        "type": "knob"
      },
      {
        "name": "Mix Ratio",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the wet vocoder / dry modulator voice blend.",
        "type": "knob"
      }
    ],
    "proTips": [
      "This vocoder features a built-in carrier synthesizer. You don't need external midi routing: select a waveform (like Sawtooth) directly inside the carrier section to start vocoding instantly.",
      "Adjust the 'Bands' knob. Set to 8 bands for a highly vintage, lo-fi robotic sound, or 20 bands for modern, clear, and highly intelligible vocoded speech.",
      "Automate the 'Unvoiced' level. This blends high-frequency noise transients back into the signal, ensuring consonant letters like 'S' and 'T' remain perfectly clear."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ams neve dfc channel strip",
    "displayName": "UAD AMS Neve DFC Channel Strip",
    "category": "Channel Strips",
    "description": "The definitive digital film console channel strip. Employed in the world's leading film post-production facilities, it delivers clinical, ultra-accurate EQ and world-class dynamics gating and compression.",
    "hardwareModel": "AMS Neve Digital Film Console (DFC)",
    "parameters": [
      {
        "name": "Gate Threshold",
        "range": "-80 dB to 0 dB",
        "defaultVal": "-60 dB",
        "description": "Sets the threshold for the expander/noise gate section.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-50 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets the threshold for the ultra-clean digital console compressor.",
        "type": "knob"
      },
      {
        "name": "EQ High Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls high shelving EQ level.",
        "type": "knob"
      },
      {
        "name": "EQ Mid Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls parametric mid-frequency level.",
        "type": "knob"
      },
      {
        "name": "EQ Low Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls low shelving EQ level.",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the processed channel volume level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The DFC channel strip features extremely fast and transparent expander gating. Use it on acoustic drum tracks to clean up leakage with zero clicking or chattering.",
      "Its parametric EQ has an incredibly clean curve. Start with very narrow band Q-factors to cleanly notch out resonance before boosting wide shelves.",
      "The compressor features a unique 'Hysteresis' parameter that prevents the gate from opening and closing too rapidly on erratic signals like voiceover tracks."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad suhr se100 amplifier",
    "displayName": "UAD Suhr SE100 Amplifier",
    "category": "Guitar & Bass",
    "description": "An authentic emulation of John Suhr's classic SE100 high-gain tube amp. Delivering rich British-style preamp crunch and fluid, singing lead tones, it emulates all modifications of this boutique head.",
    "hardwareModel": "Suhr SE100 Handwired 100W Tube Head",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls preamp tube saturation level.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts bottom end thickness.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Adjusts core midrange punch.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts brightness and picking articulation.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Adjusts power amp high frequency definition.",
        "type": "knob"
      },
      {
        "name": "Power Feedback",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Changes the amount of negative feedback in the power section.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The SE100 is highly dynamic. Roll back your guitar volume knob slightly to clean up crunch settings into an organic, glassy blues tone.",
      "Set the 'Feedback' knob past 12 o'clock to tighten the bass response. It changes how the power amplifier reacts, giving you a faster, modern rhythm tracking.",
      "Switch cabinet IR presets to pair the SE100 with Greenback 4x12 speakers for classic British rock, or V30 4x12s for modern high-gain metal."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_masterdesk classic",
    "displayName": "UAD bx_masterdesk Classic",
    "category": "Dynamics",
    "description": "The simplified, classic version of Brainworx's highly popular all-in-one analog mastering console. It delivers a fast, legendary three-step workflow to master tracks with absolute sonic fidelity.",
    "hardwareModel": "Brainworx bx_masterdesk Classic",
    "parameters": [
      {
        "name": "Volume",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets the input level to drive the mastering brickwall limiter.",
        "type": "knob"
      },
      {
        "name": "Foundation",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Sets the classic tilt EQ balance between low weight and high clarity.",
        "type": "knob"
      },
      {
        "name": "Output Trim",
        "range": "-2.0 dB to 0 dB",
        "defaultVal": "-0.2 dB",
        "description": "Sets the absolute maximum peak limit for output safety.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Classic mastering is incredibly fast: first turn the Volume knob up until you hit the green limit zone, then adjust the Foundation tilt EQ to set the mix brightness.",
      "If the bass gets too boomy on small monitors, back off the Foundation filter slightly to shift energy into clean high-end air.",
      "Keep Output Trim at -0.2 dB to prevent digital clipping when uploading to digital streaming platforms."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad century tube channel strip",
    "displayName": "UAD Century Tube Channel Strip",
    "category": "Channel Strips",
    "description": "The ultimate modern, intuitive workflow tool. Integrates a warm, harmonic vacuum tube preamp, simple 3-band musical equalizer, and a rapid auto-leveling opto compressor.",
    "hardwareModel": "UA Century Tube Channel Strip",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "0 to 100 (Continuous)",
        "defaultVal": "35",
        "description": "Adjusts vacuum tube preamplifier input level and saturation thickness.",
        "type": "knob"
      },
      {
        "name": "Low EQ Shelf",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Broad, musical 100 Hz shelving boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Sweep",
        "range": "-12 dB to +12 dB (Fixed 1 kHz)",
        "defaultVal": "0 dB",
        "description": "Selects boost/cut amplitude for the mid-range band.",
        "type": "knob"
      },
      {
        "name": "High EQ Shelf",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Silky 10 kHz shelving boost or cut to add air and gloss.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "0 to 100 (Continuous)",
        "defaultVal": "0",
        "description": "Controls the threshold of the automatic-makeup optical gain cell.",
        "type": "knob"
      },
      {
        "name": "Master Level",
        "range": "-Infinity to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts final output level of the channel strip.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Drive the Preamp Gain knob until the indicators point to 'Warm' to add harmonic depth and vintage grit to vocals or bass lines.",
      "The optical compressor has only a single Threshold knob and includes automatic makeup gain, making leveling smooth and effortless.",
      "Keep the EQ bands flat or use small boosts to shape tracks on the way in for high-fidelity, production-ready stems."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad bx_masterdesk",
    "displayName": "UAD bx_masterdesk",
    "category": "Dynamics",
    "description": "A complete, high-end analog mastering system in a single intuitive interface. Developed by Brainworx, it offers pristine brickwall limiting, a highly optimized 'Foundation' EQ band, parallel compression, and warm THD tube saturation.",
    "hardwareModel": "Brainworx bx_masterdesk",
    "parameters": [
      {
        "name": "Volume",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets input level driving the internal mastering dynamic chain.",
        "type": "knob"
      },
      {
        "name": "Foundation",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Adjusts spectral balance tilt between low-end warmth and high-end air.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "-3 dB to +3 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts targeted low-end sub-bass frequencies.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "-3 dB to +3 dB",
        "defaultVal": "0 dB",
        "description": "Controls clarity and presence in the vocal upper-midrange band.",
        "type": "knob"
      },
      {
        "name": "Compressor Mix",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Controls parallel mastering compression blend.",
        "type": "knob"
      },
      {
        "name": "THD Saturation",
        "range": "Off to Extreme",
        "defaultVal": "Low",
        "description": "Adds targeted harmonic saturation to enrich master bus harmonics.",
        "type": "select",
        "options": [
          "Off",
          "Low",
          "Medium",
          "High",
          "Extreme"
        ]
      }
    ],
    "proTips": [
      "Use the 'Foundation' knob as your primary tone-sculptor. It behaves like a high-end tilt filter: dial clockwise to add high-end sheen while rolling off sub mud, or counter-clockwise for low-end body.",
      "Adjust the 'Volume' knob until you hit around -2dB of gain reduction on the integrated limiter meter. This ensures maximum loudness without squeezing the life out of your song.",
      "Set THD around 25% (even harmonics) to generate subtle, pleasant tube-style warmth that helps glue acoustic instruments and vocals together."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad suhr pt100 amplifier",
    "displayName": "UAD Suhr PT100 Amplifier",
    "category": "Guitar & Bass",
    "description": "Pete Thorn's ultimate signature high-gain tube amplifier. Emulating all three channels, it ranges from clean American-style chords to classic British crunch, and heavy fluid modern lead tones.",
    "hardwareModel": "Suhr PT100 Pete Thorn Signature Amplifier",
    "parameters": [
      {
        "name": "Channel",
        "range": "CH 1 / CH 2 / CH 3",
        "defaultVal": "CH 2",
        "description": "Selects active channel: CH1=Clean, CH2=Classic Crunch, CH3=High Gain Lead.",
        "type": "select",
        "options": [
          "Channel 1",
          "Channel 2",
          "Channel 3"
        ]
      },
      {
        "name": "Input Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives pre-amp tube gain stage.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls bottom-end cabinet resonance.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5.5",
        "description": "Controls core midrange detail.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts pick attack bite.",
        "type": "knob"
      },
      {
        "name": "Boost",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages signature active boost for increased gain and compression.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Channel 2 is Pete's signature crunch. Engage the active 'Boost' switch to turn it into a screaming lead stage with incredible mid-range sustain and clarity.",
      "Channel 1 features a bright switch. Pair it with single-coil pickups to achieve crystal-clear, clean funky rhythm tracks.",
      "Use the 'Feedback' switch on Channel 3 to tighten or loosen bass resonance depending on whether you play chunky riffs or fluid solos."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad putnam microphone collection",
    "displayName": "UAD Putnam Microphone Collection",
    "category": "Preamps & Microphones",
    "description": "The ultimate microphone modeling plugin, emulating Bill Putnam's legendary personal collection of vintage tube, condenser, and ribbon microphones. It gives users access to historically significant mic signatures.",
    "hardwareModel": "Townsend Labs Sphere L22 Microphone System",
    "parameters": [
      {
        "name": "Mic Model",
        "range": "LD-47 / LD-251 / RB-77DX / DN-12",
        "defaultVal": "LD-47",
        "description": "Selects vintage microphone model emulation.",
        "type": "select",
        "options": [
          "LD-47",
          "LD-251",
          "RB-77DX",
          "DN-12"
        ]
      },
      {
        "name": "Proximity",
        "range": "-50% to +150%",
        "defaultVal": "100%",
        "description": "Adjusts proximity-effect low frequencies.",
        "type": "knob"
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 80 Hz",
        "defaultVal": "Off",
        "description": "Applies high-pass filter to clean up low rumble.",
        "type": "switch",
        "options": [
          "Off",
          "80 Hz"
        ]
      },
      {
        "name": "Output Level",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Stages final output level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select the 'LD-251' model for vocal tracks. It has an incredibly open, rich, and highly premium high end that sits beautifully on modern pop and hip-hop leads.",
      "Adjust the Proximity control counter-clockwise on ribbon emulations to eliminate proximity low-end rumble while preserving their signature warm high roll-off.",
      "Engage the low cut at 80 Hz directly in the mic modeler to clear away room air conditioner hum before compression."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ampeg svt-vr classic bass amplifier",
    "displayName": "UAD Ampeg SVT-VR Classic Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "The definitive rock and roll bass stack. Captures the high-headroom, earth-shaking all-tube 300-watt growl of the legendary SVT amplifier and classic 8x10 speaker cabinet.",
    "hardwareModel": "Ampeg SVT-VR All-Tube Bass Amplifier",
    "parameters": [
      {
        "name": "Input Volume",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "4",
        "description": "Controls the input preamp level, driving tube saturation at high levels.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-end shelving gain at 40 Hz.",
        "type": "knob"
      },
      {
        "name": "Midrange EQ",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls mid-frequency peaking EQ gain.",
        "type": "knob"
      },
      {
        "name": "Midrange Frequency",
        "range": "220 Hz / 800 Hz / 3 kHz",
        "defaultVal": "800 Hz",
        "description": "Sets target center frequency for the Midrange EQ peaking band.",
        "type": "select",
        "options": [
          "220 Hz",
          "800 Hz",
          "3 kHz"
        ]
      },
      {
        "name": "Treble EQ",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls high shelving gain at 4 kHz.",
        "type": "knob"
      },
      {
        "name": "Ultra Lo",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Applies a heavy low-frequency boost while rolling off mid frequencies.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Switch the Midrange Frequency selector to 800 Hz and boost to add grit, presence, and pick attack to heavy rock bass lines.",
      "Engage 'Ultra Lo' to add massive, rumbling sub bass weight, but be sure to keep the volume balanced to avoid overloading the console bus.",
      "Keep the Input Volume high and Master low to drive the virtual power tubes for organic, thick analog compression and soft tube clipping."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve preamp",
    "displayName": "UAD Neve Preamp",
    "category": "Preamps & Microphones",
    "description": "The unmistakable sound of British console warmth. Emulating the discrete Class-A Neve 1290 and 1073 preamplifier circuits, it adds thick low-end body, legendary midrange weight, and silky harmonic tape-like saturation.",
    "hardwareModel": "Neve 1290 and 1073 Preamp Circuits",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "20 dB to 80 dB",
        "defaultVal": "30 dB",
        "description": "Drives the Class-A input transformer for signature Neve analog saturation.",
        "type": "knob"
      },
      {
        "name": "Pad",
        "range": "0 dB / -20 dB",
        "defaultVal": "0 dB",
        "description": "Applies 20 dB input pad for hot signal sources.",
        "type": "switch",
        "options": [
          "0 dB",
          "-20 dB"
        ]
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 80 Hz",
        "defaultVal": "Off",
        "description": "HP filter rolling off low rumble.",
        "type": "switch",
        "options": [
          "Off",
          "80 Hz"
        ]
      },
      {
        "name": "Output Trim",
        "range": "-24 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Compensates for volume spikes after driving preamp.",
        "type": "knob"
      }
    ],
    "proTips": [
      "This is a masterpiece on acoustic instruments. Drive the Input Gain around 40-50 dB until you get subtle saturation. This makes thin acoustic guitars sound large and 3D.",
      "Enable the Pad switch if your drums are clipping the input, allowing you to drive the preamp transformer for saturation without clipping.",
      "Always engage the 80 Hz Low Cut filter on vocals to clean up any mic rumble before it hits downstream dynamics processors."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ada flanger",
    "displayName": "UAD ADA Flanger",
    "category": "Guitar & Bass",
    "description": "An authentic emulation of the historic A/DA Flanger pedal. Famous for its jet-engine sweeps, dynamic envelope tracking, and warm bucket-brigade analog flanging effects on guitars, synths, and drums.",
    "hardwareModel": "A/DA Flanger",
    "parameters": [
      {
        "name": "Range",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets the LFO modulation sweep depth width.",
        "type": "knob"
      },
      {
        "name": "Speed",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets the flanging LFO modulation speed.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "Off to High",
        "defaultVal": "Off",
        "description": "Controls dynamic envelope-tracking sweep trigger sensitivity.",
        "type": "knob"
      },
      {
        "name": "Harmonic Mode",
        "range": "Even / Odd",
        "defaultVal": "Even",
        "description": "Chooses between warm, fluid Even harmonics or dry, cutting Odd harmonics.",
        "type": "switch",
        "options": [
          "Even",
          "Odd"
        ]
      },
      {
        "name": "Blend Ratio",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Controls the wet flanged / dry signal balance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To get the classic 'Jet' flanging sweep, crank the Range (LFO Depth) and set Speed very slow. Engage 'Even' harmonics for a liquid, vocal character.",
      "Engage the 'Automatic' threshold gate. This uses your input signal dynamics to trigger LFO sweeps, making your playing dynamics drive the flanger speed.",
      "On stereo backing vocals, use a 30% Blend ratio with high speed to create a lush, wide Leslie-style rotary chorus."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad friedman buxom betty amplifier",
    "displayName": "UAD Friedman Buxom Betty Amplifier",
    "category": "Guitar & Bass",
    "description": "An authentic emulation of the dual-voiced Friedman Buxom Betty tube head. Delivering lush American clean tones that morph seamlessly into classic British crunch, Buxom Betty utilizes a single dynamic channel with interactive EQ and a unique multi-voiced preamplifier stage.",
    "hardwareModel": "Friedman Buxom Betty 50W Tube Head",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls preamplifier input gain and tube overdrive level.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts core bottom end thickness.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts midrange contour.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high end bite and detail.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Controls the power section negative feedback high frequencies.",
        "type": "knob"
      },
      {
        "name": "Bright Switch",
        "range": "Center (Off) / Left / Right",
        "defaultVal": "Center (Off)",
        "description": "Three-position switch to adjust high-frequency response on the input.",
        "type": "select",
        "options": [
          "Center (Off)",
          "Left",
          "Right"
        ]
      }
    ],
    "proTips": [
      "Set the Gain control to 4-5 for an open, sparkling American clean tone, perfect for Fender-style single-coils or dynamic pedal platforms.",
      "To experience classic British Plexi crunch, push the Gain to 8 or 9, back the Treble to 4, and crank the Master volume to saturate the virtual EL34 power tubes.",
      "Use the three-way Bright switch: flick it to the right position to add high-end articulation to dark humbuckers without introducing harshness."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad helios type 69 preamp and eq collection",
    "displayName": "UAD Helios Type 69 Preamp and EQ Collection",
    "category": "Equalizers",
    "description": "The sound of 1970s British rock. Emulates the legendary Helios console strips with highly musical, broad, interactive frequency bands and aggressive custom lustrum iron transformers.",
    "hardwareModel": "Helios Type 69 Console Channel Strip",
    "parameters": [
      {
        "name": "Preamplifier Gain",
        "range": "20 dB to 80 dB",
        "defaultVal": "30 dB",
        "description": "Sets input gain and drives the vintage console preamplifier.",
        "type": "knob"
      },
      {
        "name": "High EQ Shelf Gain",
        "range": "-10 dB to +10 dB (Fixed 10 kHz)",
        "defaultVal": "0 dB",
        "description": "Controls broad, silky high-frequency shelving attenuation or boost.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Frequency",
        "range": "0.7 kHz / 1.0 kHz / 1.4 kHz / 2.0 kHz / 2.8 kHz / 3.5 kHz / 4.5 kHz / 6.0 kHz",
        "defaultVal": "1.4 kHz",
        "description": "Selects the active mid-range frequency band.",
        "type": "select",
        "options": [
          "0.7 kHz",
          "1.0 kHz",
          "1.4 kHz",
          "2.0 kHz",
          "2.8 kHz",
          "3.5 kHz",
          "4.5 kHz",
          "6.0 kHz"
        ]
      },
      {
        "name": "Mid EQ Gain",
        "range": "0 dB to +16 dB (Peak)",
        "defaultVal": "0 dB",
        "description": "Controls the amplitude of the highly musical mid frequency inductor boost.",
        "type": "knob"
      },
      {
        "name": "Low EQ Frequency / Mode",
        "range": "30 Hz / 50 Hz / 60 Hz / 120 Hz / 250 Hz / 400 Hz",
        "defaultVal": "60 Hz",
        "description": "Selects the target frequency for the low band boost or shelving cut.",
        "type": "select",
        "options": [
          "30 Hz",
          "50 Hz",
          "60 Hz",
          "120 Hz",
          "250 Hz",
          "400 Hz"
        ]
      },
      {
        "name": "Low EQ Gain",
        "range": "0 to 15 (Peak Boost) or -10 dB (Shelf Cut)",
        "defaultVal": "0",
        "description": "Controls low end weight. Boost operates as a peak filter; cut acts as a shelving filter.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 60Hz or 120Hz on the Low EQ and dial in a boost to add tight, robust weight to kick drums and analog synthesizers.",
      "The Mid EQ band is incredibly aggressive and vocal. Select 1.4 kHz or 2.8 kHz and add a slight boost for a forward, energetic guitar tone.",
      "Push the Preamplifier gain past 50 dB to saturate the virtual Lustraphone iron transformer, adding rich, fuzzy grit."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad empirical labs el8 distressor compressor",
    "displayName": "UAD Empirical Labs EL8 Distressor Compressor",
    "category": "Dynamics",
    "description": "The modern Swiss-army knife of compressors. Excels at aggressive drum room crushing, vocal leveling, and custom harmonic distortion profiles (Dist 2/3).",
    "hardwareModel": "Empirical Labs EL8 Distressor",
    "parameters": [
      {
        "name": "Input",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets input level and concurrently sets the compression threshold.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Master makeup gain control.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0 to 10 (50 microseconds to 30 milliseconds)",
        "defaultVal": "5",
        "description": "Adjusts transient response attack speed.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0 to 10 (50 milliseconds to 3.5 seconds)",
        "defaultVal": "5",
        "description": "Adjusts compression recovery speed.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1:1 / 2:1 / 3:1 / 4:1 / 6:1 / 10:1 (Opto) / 20:1 / Nuke",
        "defaultVal": "6:1",
        "description": "Configures ratio curves, including Nuke limiting mode.",
        "type": "select",
        "options": [
          "1:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1",
          "10:1",
          "20:1",
          "Nuke"
        ]
      },
      {
        "name": "Audio Mode",
        "range": "Norm / Dist 2 (Tube) / Dist 3 (Tape)",
        "defaultVal": "Norm",
        "description": "Injects analog harmonic saturation. Dist 2 introduces 2nd harmonics, Dist 3 adds 3rd harmonics.",
        "type": "select",
        "options": [
          "Norm",
          "Dist 2",
          "Dist 3"
        ]
      }
    ],
    "proTips": [
      "Ratio 10:1 (Opto mode) utilizes a custom-designed opto photocell emulator that perfectly mimics a vintage LA-2A response but with adjustable attack/release knobs.",
      "Engage 'Dist 2' for warm tube-style 2nd-order harmonics (great on vocals/basses), or 'Dist 3' for tape-style 3rd-order harmonics (great on drums/masters)."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad dytronics tri-stereo chorus",
    "displayName": "UAD Dytronics Tri-Stereo Chorus",
    "category": "Reverbs & Delays",
    "description": "Authentically emulates the rare 1980s Dytronics Tri-Stereo Chorus, delivering thick, dimensional, three-phase bucket-brigade modulation.",
    "hardwareModel": "Dytronics Tri-Stereo Chorus CS-5",
    "parameters": [
      {
        "name": "Mode",
        "range": "Manual / Preset",
        "defaultVal": "Manual",
        "description": "Switches between manual adjustment or factory preset chorus configurations.",
        "type": "switch",
        "options": [
          "Manual",
          "Preset"
        ]
      },
      {
        "name": "LFO Rate",
        "range": "0.1 Hz to 10 Hz",
        "defaultVal": "1.0 Hz",
        "description": "Controls the sweep speed of the multi-phase LFO.",
        "type": "knob"
      },
      {
        "name": "Left Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls depth of the left bucket-brigade delay line.",
        "type": "knob"
      },
      {
        "name": "Center Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls depth of the center bucket-brigade delay line.",
        "type": "knob"
      },
      {
        "name": "Right Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls depth of the right bucket-brigade delay line.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The ultimate chorus pedal for 1980s clean L.A. session guitar tones.",
      "Engage all three delay modes simultaneously to get a lush, 3-dimensional stereo wash.",
      "Incredibly beautiful on dynamic electric synthesizer piano chords."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad gallien-krueger 800rb bass amplifier",
    "displayName": "UAD Gallien-Krueger 800RB Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "The legendary solid-state bass amplifier. Famous for its highly punching midrange, signature 'G-K Growl' circuit, active 4-band equalizer, and dual power-amp bi-amped crossover system.",
    "hardwareModel": "Gallien-Krueger 800RB Bass Amp",
    "parameters": [
      {
        "name": "Input Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Stages initial input level.",
        "type": "knob"
      },
      {
        "name": "GK Boost",
        "range": "0 to 10",
        "defaultVal": "2",
        "description": "Engages signature solid-state growl harmonics and compression.",
        "type": "knob"
      },
      {
        "name": "Low EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Active low-frequency EQ contour.",
        "type": "knob"
      },
      {
        "name": "Mid-Low EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Active low-mid punch EQ.",
        "type": "knob"
      },
      {
        "name": "Mid-High EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Active upper-mid definition EQ.",
        "type": "knob"
      },
      {
        "name": "High EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Active high frequency string snap EQ.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The GK 800RB is beloved for punk and hard rock. Crank the 'Boost' knob to 1 o'clock to engage the legendary solid-state growl circuit; this adds sharp, non-muddy bass grit.",
      "Engage the High-Pass crossover filter to separate low sub-frequencies from mid-high transient string snap, preventing cabinet mud.",
      "Use the 'Mid-High' active EQ around 1.2 kHz to add pick detail and string attack to slap bass tracks."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad marshall plexi classic amplifier",
    "displayName": "UAD Marshall Plexi Classic Amplifier",
    "category": "Guitar & Bass",
    "description": "The definitive sound of rock and roll. Emulating the historic 1959 Marshall Super Lead 100-watt tube head, it delivers the legendary biting Plexi crunch, punchy midrange, and explosive power-amp overdrive.",
    "hardwareModel": "Marshall Super Lead 100W Plexi Head",
    "parameters": [
      {
        "name": "Volume I (High Treble)",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the bright, high-frequency preamp channel.",
        "type": "knob"
      },
      {
        "name": "Volume II (Normal)",
        "range": "0 to 10",
        "defaultVal": "2",
        "description": "Drives the bass-heavy, normal preamp channel.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts tone-stack low frequencies.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Adjusts tone-stack midrange punch.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts tone-stack high-frequency clarity.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets high-frequency detail in the power amplifier stage.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Plexi heads have dual inputs. Crank Volume I (High Treble) around 7 to get aggressive, biting hard rock grit, and blend in Volume II (Normal) around 4 to add warm low-end cabinet thickness.",
      "To get classic AC/DC rhythm tones, keep pre-amp drive modest and crank the Master volume to saturate the EL34 power valves for natural, woody cabinet compression.",
      "Turn up the Presence control around 7 to help lead guitar lines slice cleanly through heavy rock overheads and drum tracks."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ocean way microphone collection",
    "displayName": "UAD Ocean Way Microphone Collection",
    "category": "Preamps & Microphones",
    "description": "A premium expansion for the UA Sphere Modeling Microphone system, featuring ultra-precise emulations of rare, hand-selected vintage microphones from Allen Sides' legendary Ocean Way Studios cabinet, including irreplaceable Neumann, Sony, and RCA models.",
    "hardwareModel": "UA Sphere L22 Microphone System",
    "parameters": [
      {
        "name": "Mic Select",
        "range": "OWS 47 / OWS 12 / OWS 269 / OWS 54 / OWS 50 / OWS 4038",
        "defaultVal": "OWS 47",
        "description": "Selects the custom modeled microphone from the Ocean Way archive.",
        "type": "select",
        "options": [
          "OWS 47",
          "OWS 12",
          "OWS 269",
          "OWS 54",
          "OWS 50",
          "OWS 4038"
        ]
      },
      {
        "name": "Pattern",
        "range": "Omni to Figure-8 (Continuous)",
        "defaultVal": "Cardioid",
        "description": "Adjusts polar pattern response of the virtual microphone.",
        "type": "knob"
      },
      {
        "name": "Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Enables the selected microphone model's low-frequency high-pass filter.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Axis",
        "range": "-45 to +45 deg",
        "defaultVal": "0 deg",
        "description": "Adjusts the virtual off-axis angle of the mic capsule.",
        "type": "knob"
      },
      {
        "name": "Proximity",
        "range": "-100% to 100%",
        "defaultVal": "0%",
        "description": "Controls the low-frequency buildup generated by distance to source.",
        "type": "knob"
      }
    ],
    "proTips": [
      "When tracking acoustic guitar, choose the OWS 54 (KM54 emulation) with the Axis dial set to 15 degrees off-axis to tame string squeaks and harsh pick transients.",
      "Use the OWS 47 (vintage Neumann U47 tube emulation) on male lead vocals, adjusting the Proximity control to around -20% to control low-end muddy buildup without losing the mic's signature warm midrange chest tone."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ts overdrive",
    "displayName": "UAD TS Overdrive",
    "category": "Guitar & Bass",
    "description": "Faithfully emulates the legendary Ibanez TS808 Tube Screamer, famous for its mid-hump focus and smooth asymmetrical overdrive.",
    "hardwareModel": "Ibanez TS808 Tube Screamer Pedal",
    "parameters": [
      {
        "name": "Overdrive Gain",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets asymmetrical overdrive gain.",
        "type": "knob"
      },
      {
        "name": "Tone Center",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Mid-frequency sweep focus filter.",
        "type": "knob"
      },
      {
        "name": "Level Output",
        "range": "0 to 10",
        "defaultVal": "7",
        "description": "Controls output pedal makeup level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use as a boost pedal in front of a dirty Marshall amp model to tighten low-end sludge.",
      "Provides rich, warm mid-frequency focus for vocals and snare drum subgroups.",
      "Track with Unison to get authentic physical pickup loading feedback."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad korg sdd-3000 digital delay",
    "displayName": "UAD Korg SDD-3000 Digital Delay",
    "category": "Reverbs & Delays",
    "description": "The legendary 1980s rack delay. Famous for its highly interactive, colorful analog input preamplifier circuitry, custom feedback filters, and deep pitch modulation.",
    "hardwareModel": "Korg SDD-3000 Digital Delay",
    "parameters": [
      {
        "name": "Input Level",
        "range": "-20 dB / -10 dB / +4 dB",
        "defaultVal": "-10 dB",
        "description": "Sets the headroom sensitivity of the physical analog preamp section.",
        "type": "select",
        "options": [
          "-20 dB",
          "-10 dB",
          "+4 dB"
        ]
      },
      {
        "name": "Delay Time",
        "range": "1 ms to 1023 ms",
        "defaultVal": "350 ms",
        "description": "Sets the physical digital delay time in milliseconds.",
        "type": "knob"
      },
      {
        "name": "Feedback",
        "range": "0 to 100",
        "defaultVal": "30",
        "description": "Controls the feedback level of delay repetitions.",
        "type": "knob"
      },
      {
        "name": "Filter High Cut",
        "range": "Off / 8 kHz / 4 kHz / 2 kHz / 1 kHz",
        "defaultVal": "Off",
        "description": "Applies high-cut dampening on delay repetitions.",
        "type": "select",
        "options": [
          "Off",
          "8 kHz",
          "4 kHz",
          "2 kHz",
          "1 kHz"
        ]
      },
      {
        "name": "Mod Frequency",
        "range": "0.1 Hz to 15 Hz",
        "defaultVal": "1.0 Hz",
        "description": "Controls speed of LFO delay time modulation.",
        "type": "knob"
      },
      {
        "name": "Mod Intensity",
        "range": "0 to 100",
        "defaultVal": "15",
        "description": "Controls the depth of delay pitch modulation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The input preamp is highly dynamic. Choose '-10 dB' and drive the Input attenuator higher to introduce sweet, organic preamplifier saturation.",
      "For a classic 'The Edge' delay sound, set delay time to a dotted eighth note value (around 350-450 ms), select Triangle modulation, and increase Intensity slightly.",
      "Use the Low Cut and High Cut filters in the feedback path to make delay repeats sit perfectly behind a live vocal without causing frequency build-ups."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad oxford dynamic eq",
    "displayName": "UAD Oxford Dynamic EQ",
    "category": "Equalizers",
    "description": "A masterpiece of surgical and musical equalization, providing 5 overlapping bands of dynamic EQ. It adapts instantly to your material, controlling problem frequencies only when they exceed the threshold, maintaining natural tone.",
    "hardwareModel": "Sonnox Oxford Dynamic EQ",
    "parameters": [
      {
        "name": "Dynamic Band 1 Freq",
        "range": "20 Hz to 500 Hz",
        "defaultVal": "80 Hz",
        "description": "Sets the center frequency for the low dynamic band.",
        "type": "knob"
      },
      {
        "name": "Dynamic Band 1 Threshold",
        "range": "-50 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the signal level threshold above which the low band EQ begins cutting.",
        "type": "knob"
      },
      {
        "name": "Dynamic Band 1 Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Determines the maximum boost or cut range for the low band.",
        "type": "knob"
      },
      {
        "name": "Dynamic Band 3 Freq",
        "range": "500 Hz to 8 kHz",
        "defaultVal": "2.5 kHz",
        "description": "Sets the center frequency for the high-mid dynamic band.",
        "type": "knob"
      },
      {
        "name": "Dynamic Band 3 Threshold",
        "range": "-50 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the signal level threshold above which the high-mid band EQ begins cutting.",
        "type": "knob"
      },
      {
        "name": "Dynamic Band 3 Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Determines the maximum boost or cut range for the high-mid band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use Band 2 or 3 in Dynamic mode to target vocal sibilance (4 kHz - 7 kHz). Set a fast attack and medium release so the EQ only cuts when harshness flares up, leaving the vocal bright and open elsewhere.",
      "Perfect for ducking muddy low frequencies (200 Hz) on acoustic guitar when the vocal comes in. Sidechain the vocal to trigger the Dynamic EQ cut for instant, natural-sounding spectral separation.",
      "Engage 'Linear Phase' mode on complex multi-track sub-mixes or the master bus. It ensures absolute phase coherence across bands, preserving critical high-end detail and stereo imaging."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad dytronics cyclosonic panner",
    "displayName": "UAD Dytronics Cyclosonic Panner",
    "category": "Reverbs & Delays",
    "description": "An authentic emulation of the legendary 1980s Dytronics Cyclosonic Panner, the holy grail of analog spatial positioning. This unique effect creates deep, swirling, three-dimensional auto-panning, utilizing advanced panning circuits to provide rapid, circular, or multi-directional stereo modulation.",
    "hardwareModel": "Dytronics Cyclosonic Panner",
    "parameters": [
      {
        "name": "LFO Speed",
        "range": "0.1 Hz to 10 Hz",
        "defaultVal": "1.0 Hz",
        "description": "Controls speed of the auto-pan rotation oscillator.",
        "type": "knob"
      },
      {
        "name": "Pan Mode",
        "range": "Auto / Manual / Triggered",
        "defaultVal": "Auto",
        "description": "Switches the modulation style of the spatial panning section.",
        "type": "select",
        "options": [
          "Auto",
          "Manual",
          "Triggered"
        ]
      },
      {
        "name": "Width",
        "range": "0% to 200%",
        "defaultVal": "100%",
        "description": "Sets spatial depth, allowing panning past conventional physical speaker barriers.",
        "type": "knob"
      },
      {
        "name": "Waveform",
        "range": "Triangle / Sine / Square / Ramp",
        "defaultVal": "Sine",
        "description": "Changes the LFO curve shape driving the auto-panner sweep.",
        "type": "select",
        "options": [
          "Triangle",
          "Sine",
          "Square",
          "Ramp"
        ]
      },
      {
        "name": "Source Selection",
        "range": "Mono / Stereo",
        "defaultVal": "Mono",
        "description": "Sets the input channel configuration before spatial panning occurs.",
        "type": "switch",
        "options": [
          "Mono",
          "Stereo"
        ]
      }
    ],
    "proTips": [
      "Apply on keyboard pads or Rhodes electric pianos using the Sine wave LFO at 1.5 Hz with the Width set to 120% to create a lush, wrapping stereo environment that leaves the center open for the lead vocal.",
      "Set Pan Mode to Triggered on transient-heavy sounds like hand percussion or high-hats; this forces the pan position to jump across the stereo field on every hit, adding dynamic movement to static grooves."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad engl savage 120 guitar amplifier",
    "displayName": "UAD ENGL Savage 120 Guitar Amplifier",
    "category": "Guitar & Bass",
    "description": "Recreates the Engl Savage 120 120-watt high-gain beast, famous for its surgical precision, razor-sharp transients, and brutal metal grit.",
    "hardwareModel": "Engl Savage 120 Tube Head",
    "parameters": [
      {
        "name": "Gain Channel 4",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Sets high gain metal crunch level.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts channel bass response.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts midrange punch.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high frequency cut.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts treble presence in the power amp stage.",
        "type": "knob"
      },
      {
        "name": "Lead Boost",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages extra preamp tube stage.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "The definitive amp model for ultra-fast progressive metal and djent rhythm tracks.",
      "Use the clean channel with bright switch on for glassy modern ambient keys.",
      "The contour switch is highly reactive; use it to instantly scoop mids for metal."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ams rmx16 expanded digital reverb",
    "displayName": "UAD AMS RMX16 Expanded Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "A low-latency legacy version of the legendary AMS RMX16 digital reverb, famous for its era-defining 'Non-Lin 2' gated snare reverb.",
    "hardwareModel": "AMS RMX16 Digital Reverb",
    "parameters": [
      {
        "name": "Program Select",
        "range": "Ambassador / Non-Lin / Chorus / Echo / Hall / Plate",
        "defaultVal": "Hall",
        "description": "Selects physical AMS digital microcode algorithm.",
        "type": "select",
        "options": [
          "Ambassador",
          "Non-Lin",
          "Chorus",
          "Echo",
          "Hall",
          "Plate"
        ]
      },
      {
        "name": "Decay Time",
        "range": "0.1 to 9.9 s",
        "defaultVal": "2.4 s",
        "description": "Reverb tail length fader.",
        "type": "knob"
      },
      {
        "name": "Pre-Delay",
        "range": "0 to 125 ms",
        "defaultVal": "10 ms",
        "description": "Pre delay prior to early reflections blooming.",
        "type": "knob"
      },
      {
        "name": "Low EQ",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Applies low frequency shelving EQ filter to wet signal.",
        "type": "knob"
      },
      {
        "name": "High EQ",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Applies high frequency shelving EQ filter to wet signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Apply the classic Non-Lin 2 algorithm on snare drums for the iconic 1980s Phil Collins snare sound.",
      "Use the Ambience algorithm to add massive, luxurious room depth to acoustic pop vocals.",
      "Keep the wet mix low; a little RMX16 goes a long way to glue synth lines."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad pure plate reverb",
    "displayName": "UAD Pure Plate Reverb",
    "category": "Reverbs & Delays",
    "description": "The essence of physical plate reverberation. Simple, CPU-efficient, and beautifully modeled, delivering the signature shimmering organic wash of classic steel plates.",
    "hardwareModel": "UA Pure Plate Reverb",
    "parameters": [
      {
        "name": "Reverb Time",
        "range": "0.5 s to 5.5 s",
        "defaultVal": "2.0 s",
        "description": "Sets overall plate reverberation decay length.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 120 ms",
        "defaultVal": "15 ms",
        "description": "Sets timing delay before early reflections and plate decay trigger.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-12 dB to +6 dB (Shelf)",
        "defaultVal": "0 dB",
        "description": "Controls low-end shelving gain on the reverberated output.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-12 dB to +6 dB (Shelf)",
        "defaultVal": "0 dB",
        "description": "Controls high-end shelving gain to shape the brightness of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Adjusts dry to wet signal ratio. Set to 100% for aux send returns.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a clean, articulate vocal space, set Pre-delay around 20-30 ms so that sibilant consonants aren't buried in the shimmering plate reverb.",
      "Use the Treble EQ dial to add a +2dB or +4dB boost, giving the reverb decay tail a gorgeous, silky airiness.",
      "For deep acoustic guitars, roll the Bass EQ down to -3dB to avoid low-mid mud accumulating in the stereo soundstage."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ssl 4000 g bus compressor collection",
    "displayName": "UAD SSL 4000 G Bus Compressor Collection",
    "category": "Dynamics",
    "description": "The ultimate console master bus compressor. Legendary for its ability to unify, glue, and add commercial radio energy to full stereo mixes, drum buses, or guitar groups.",
    "hardwareModel": "Solid State Logic SSL G-Series Stereo Console Master Bus Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-20 dB to +20 dB",
        "defaultVal": "+20 dB",
        "description": "Sets the compression threshold trigger point.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 10:1",
        "defaultVal": "4:1",
        "description": "Selects active compression ratio curve.",
        "type": "select",
        "options": [
          "2:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1 ms / 0.3 ms / 1.0 ms / 3.0 ms / 10 ms / 30 ms",
        "defaultVal": "30 ms",
        "description": "Selects static transient attack speed.",
        "type": "select",
        "options": [
          "0.1 ms",
          "0.3 ms",
          "1.0 ms",
          "3.0 ms",
          "10 ms",
          "30 ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.1 s / 0.3 s / 0.6 s / 1.2 s / Auto",
        "defaultVal": "Auto",
        "description": "Adjusts recovery speed. Auto uses a dynamic dual-stage timing network.",
        "type": "select",
        "options": [
          "0.1 s",
          "0.3 s",
          "0.6 s",
          "1.2 s",
          "Auto"
        ]
      },
      {
        "name": "Makeup Gain",
        "range": "-5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Compensates master stereo output volume levels.",
        "type": "knob"
      },
      {
        "name": "Sidechain High Pass",
        "range": "Off / 18 Hz to 150 Hz",
        "defaultVal": "Off",
        "description": "Cuts sub-bass frequencies from entering sidechain gain detection.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The classic 'Mix Glue' formula: Ratio 4:1, Attack 30ms, Release Auto, and adjust Threshold to draw a rhythmic 1 to 3 dB of gain reduction.",
      "Engage the Sidechain High Pass filter at 80Hz to allow deep kick drums and sub-basses to pass through cleanly without pumping the entire master mix.",
      "Utilize the built-in Mix/Blend control to perform high-ratio parallel master bus compression, preserving natural transients while pulling up soft room elements."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad antares auto-tune realtime",
    "displayName": "UAD Antares Auto-Tune Realtime",
    "category": "Dynamics",
    "description": "The gold standard of real-time vocal pitch correction. Designed specifically for low-latency UAD DSP hardware tracking, it delivers seamless, natural-sounding pitch correction or the iconic, hard-tuned modern pop/hip-hop vocal effect with zero tracking delay.",
    "hardwareModel": "Antares Auto-Tune Pitch Correction Processor",
    "parameters": [
      {
        "name": "Retune Speed",
        "range": "0ms to 400ms",
        "defaultVal": "20ms",
        "description": "Controls how fast the pitch correction snaps the audio to the target note.",
        "type": "knob"
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Preserves natural tuning variations on sustained vocal notes.",
        "type": "knob"
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Provides natural corrective expression by leaving pitch variance uncorrected outside a targeted range.",
        "type": "knob"
      },
      {
        "name": "Key",
        "range": "C / C# / D / D# / E / F / F# / G / G# / A / A# / B",
        "defaultVal": "C",
        "description": "Sets the root key of the pitch correction scale.",
        "type": "select",
        "options": [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B"
        ]
      },
      {
        "name": "Scale",
        "range": "Major / Minor / Chromatic",
        "defaultVal": "Chromatic",
        "description": "Sets the active target interval scale constraints.",
        "type": "select",
        "options": [
          "Major",
          "Minor",
          "Chromatic"
        ]
      },
      {
        "name": "Natural Vibrato",
        "range": "-12 to +12",
        "defaultVal": "0",
        "description": "Amplifies or tames the natural vibrato profile of the incoming vocalist.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a totally transparent performance correction, set Retune Speed to a moderate 20ms to 50ms and increase Humanize to around 30 to allow natural pitch glides during fast vocal transitions.",
      "To get the modern signature trap or pop hard-tuned sound, set Retune Speed instantly to 0 (fastest) and turn Flex-Tune to 0, locking the vocalist's pitch directly to the target scale grid."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad eden wt800 bass amplifier",
    "displayName": "UAD Eden WT800 Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "An exceptional emulation of the premium Eden World Tour 800 hybrid bass amplifier. Renowned for its warm tube preamp, clinical semi-parametric EQ, and signature 'Enhance' scoop filter.",
    "hardwareModel": "Eden World Tour 800 Bass Amplifier",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Controls initial hybrid valve pre-amp gain.",
        "type": "knob"
      },
      {
        "name": "Enhance Filter",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Sweeps Eden signature multi-band frequency scoop and bass/treble lift.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low frequency shelf.",
        "type": "knob"
      },
      {
        "name": "Midrange",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts sweepable mid band frequency levels.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts high frequency shelf.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "Off to High",
        "defaultVal": "Off",
        "description": "Controls the built-in optical bass compressor threshold.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The 'Enhance' knob is Eden's secret weapon. Dialing it to 10 o'clock automatically scoops boxy low-mids while boosting sub weight and treble detail, giving you an instant premium slap bass tone.",
      "The onboard Compressor is highly transparent. Use subtle settings (around 3 on the dial) to smoothly catch bass transient spikes.",
      "If playing in a busy, dense keyboard-heavy track, back off the Enhance filter and boost Midrange at 400Hz to make your bass lines perfectly legible."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad fuchs train ii guitar amplifier",
    "displayName": "UAD Fuchs Train II Guitar Amplifier",
    "category": "Guitar & Bass",
    "description": "Authentically emulates the boutique Fuchs Train II head, celebrated for its exceptionally fast transient response, clean headroom, and biting lead tones.",
    "hardwareModel": "Fuchs Train II Boutique Tube Amplifier",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Controls input volume and crunch.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "High frequency tone sweep.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Low frequency cabinet tone.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts extreme high-frequency response in the power amp stage.",
        "type": "knob"
      },
      {
        "name": "Bright Switch",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Boosts high frequencies at the preamp input stage.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Outstanding for fusion jazz and complex progressive rock solos. Run the Preamp Gain at 6 to generate a touch-sensitive overdrive that cleans up perfectly with your guitar's volume knob.",
      "Responds instantly to pick dynamics; play soft for clean tones, or dig in hard with the gain set at 7 to trigger a screaming, bright biting lead.",
      "Keep treble at 4 and presence at 3 to prevent ice-pick pickup resonance when using bright single-coil bridge pickups."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad moog multimode filter collection",
    "displayName": "UAD Moog Multimode Filter Collection",
    "category": "Equalizers",
    "description": "The definitive analog ladder filter. Delivers the legendary rich, sweeping resonance, aggressive input-drive saturation, and high-performance LFO/Envelope modulations of Moog modules.",
    "hardwareModel": "Moog Music Multimode Filter System",
    "parameters": [
      {
        "name": "Filter Cutoff",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Determines the corner frequency of the Moog transistor ladder filter.",
        "type": "knob"
      },
      {
        "name": "Resonance",
        "range": "0 to 100",
        "defaultVal": "20",
        "description": "Controls filter resonance peak. High values trigger absolute self-oscillation.",
        "type": "knob"
      },
      {
        "name": "Drive",
        "range": "+0 dB to +20 dB",
        "defaultVal": "+0 dB",
        "description": "Drives input signal into the ladder inputs, adding warm, fat harmonic distortion.",
        "type": "knob"
      },
      {
        "name": "Filter Mode",
        "range": "Low Pass / Band Pass / High Pass",
        "defaultVal": "Low Pass",
        "description": "Selects active filter band configuration.",
        "type": "select",
        "options": [
          "Low Pass",
          "Band Pass",
          "High Pass"
        ]
      },
      {
        "name": "Envelope Amount",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Modulates filter cutoff frequency using the input audio's dynamic amplitude envelope.",
        "type": "knob"
      },
      {
        "name": "LFO Rate",
        "range": "0.05 Hz to 25 Hz",
        "defaultVal": "1.0 Hz",
        "description": "Controls the frequency speed of the low frequency oscillator.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Drive the 'Drive' knob past +10 dB to saturate the physical transistor ladder inputs, delivering a lush, gritty fuzz that beefs up virtual synths or live bass guitars.",
      "Set Resonance high (past 80%) to generate standard self-oscillation. Sweeping the Cutoff will yield classic space-age laser sound effects.",
      "Engage the LFO Rate and set Waveform to Square to create synchronized, rhythmic pumping filter gates on synth pads."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ssl 4000 e channel strip collection",
    "displayName": "UAD SSL 4000 E Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The definitive 1980s mixing console strip. Aggressive dynamics gating, versatile VCA compressor, and highly interactive Black/Brown knob EQ bands.",
    "hardwareModel": "Solid State Logic 4000 E-Series Console",
    "parameters": [
      {
        "name": "Input Trim",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts master gain staging before processing.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-30 dB to +10 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the compression start point.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to infinity:1",
        "defaultVal": "2:1",
        "description": "Sets the compression slope.",
        "type": "knob"
      },
      {
        "name": "EQ Black/Brown Switch",
        "range": "Black / Brown",
        "defaultVal": "Black",
        "description": "Switches EQ filter response from 'Black' (steeper, cleaner) to 'Brown' (wider, warmer).",
        "type": "switch",
        "options": [
          "Black",
          "Brown"
        ]
      },
      {
        "name": "High EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for high EQ band.",
        "type": "knob"
      },
      {
        "name": "Low EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for low EQ band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Switch the Black/Brown EQ button. Black EQ is cleaner with steeper filters, whereas Brown EQ is broader, gentler, and has a wider, more musical shelf.",
      "The Gate has an extremely fast attack threshold. Set the Gate Range to 40 dB and threshold around -12 dB to cleanly isolate fast, transient drum sounds like snare drums."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad oto biscuit 8-bit filter effects",
    "displayName": "UAD OTO Biscuit 8-bit Filter Effects",
    "category": "Tape & Saturation",
    "description": "Meticulously models the OTO Biscuit hardware, a French cult-classic 8-bit digital sampler/biscuiting machine, famous for its gritty sample-rate crushing.",
    "hardwareModel": "OTO Biscuit 8-Bit Effects Processor",
    "parameters": [
      {
        "name": "Bit Crush Depth",
        "range": "1 to 8 Bits",
        "defaultVal": "8 Bits",
        "description": "Selects the digital bit-depth resolution.",
        "type": "knob"
      },
      {
        "name": "Sample Rate Clock",
        "range": "250 to 32000 Hz",
        "defaultVal": "32000 Hz",
        "description": "Sets the digital clock frequency rate.",
        "type": "knob"
      },
      {
        "name": "Filter Cutoff",
        "range": "20 to 15000 Hz",
        "defaultVal": "15000 Hz",
        "description": "Sets analog resonant low-pass filter smoothing.",
        "type": "knob"
      },
      {
        "name": "Filter Resonance",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Sets resonance feedback on the integrated analog low-pass filter.",
        "type": "knob"
      },
      {
        "name": "Mode Selector",
        "range": "Naked / Delay / Pitch / Reverb / Filter",
        "defaultVal": "Naked",
        "description": "Determines active DSP effect processor module.",
        "type": "select",
        "options": [
          "Naked",
          "Delay",
          "Pitch",
          "Reverb",
          "Filter"
        ]
      }
    ],
    "proTips": [
      "The ultimate tool for lo-fi beats; run high-quality drum loops through it to add grit. Use the Filter Cutoff around 1.2 kHz to round out harsh, high-frequency aliasing.",
      "Slightly reduce the sample rate to add authentic SP1200 style digital character on vocal chops.",
      "Toggle off specific bits manually using the matrix switches to create interesting bit-crushing distortions on synth basses."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad fuchs overdrive supreme 50 amplifier",
    "displayName": "UAD Fuchs Overdrive Supreme 50 Amplifier",
    "category": "Guitar & Bass",
    "description": "The ultimate boutique 'D-Style' guitar amplifier. Emulating the hand-wired Fuchs Overdrive Supreme, it delivers liquid, tube-driven guitar sustain, highly touch-sensitive midrange overdrive, and premium spring reverb.",
    "hardwareModel": "Fuchs Overdrive Supreme 100W Head",
    "parameters": [
      {
        "name": "Clean Gain",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Controls clean channel preamp volume and initial tube drive.",
        "type": "knob"
      },
      {
        "name": "Overdrive Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the dedicated boutique tube overdrive circuit for smooth, compressed sustain.",
        "type": "knob"
      },
      {
        "name": "Overdrive Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets the output volume of the overdrive channel.",
        "type": "knob"
      },
      {
        "name": "Bright Switch",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Introduces high-frequency boost to the preamp stage.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Deep Switch",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Introduces low-frequency shelf boost for increased cabinet weight.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Spring Reverb",
        "range": "0 to 10",
        "defaultVal": "2",
        "description": "Controls the level of emulated physical spring reverb tank.",
        "type": "knob"
      }
    ],
    "proTips": [
      "This amp is legendary for jazz-fusion and blues solos. Set the Overdrive Gain around 7 and engage the 'Deep' switch. This adds incredible vocal-like midrange sustain.",
      "Use the 'Bright' switch on clean tracks to add glassy, sparkling high-end detail, perfect for funk chords.",
      "Pair the Fuchs with the dynamic microphone cabinet IR to get a tight, focused cabinet sound that sits perfectly in a pop-rock mix."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_subsynth subharmonic synth",
    "displayName": "UAD bx_subsynth Subharmonic Synth",
    "category": "Dynamics",
    "description": "Meticulously modeled on the legendary dbx 120A subharmonic synthesizer, the Brainworx bx_subsynth is the ultimate tool for generating clean, earth-shattering sub-bass. It generates subharmonics across three discrete frequency bands, offering unmatched low-end density, surgical control, and mono-compatibility.",
    "hardwareModel": "dbx 120A Subharmonic Synthesizer",
    "parameters": [
      {
        "name": "Sub Gen Master",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Determines the master amount of generated subharmonics.",
        "type": "knob"
      },
      {
        "name": "24-36 Hz Level",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls subharmonic synthesis output level for the lowest bass octave band.",
        "type": "knob"
      },
      {
        "name": "36-56 Hz Level",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls subharmonic synthesis output level for the middle bass octave band.",
        "type": "knob"
      },
      {
        "name": "56-80 Hz Level",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls subharmonic synthesis output level for the highest bass octave band.",
        "type": "knob"
      },
      {
        "name": "Squeeze",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls compression depth on the generated subharmonics to smooth transients.",
        "type": "knob"
      },
      {
        "name": "Low Cut Filter",
        "range": "15 Hz to 120 Hz",
        "defaultVal": "20 Hz",
        "description": "Sets the steep low-cut high-pass filter frequency to eliminate mud.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To fatten up electronic hip-hop kicks, turn up the 36-56 Hz band to 40% while keeping Squeeze around 25% for a thick, controlled tail that translates on club sound systems.",
      "For thin DI bass guitars, generate subharmonics in the 56-80 Hz band to add natural weight. Set the Low Cut filter to 25 Hz to eliminate energy-robbing subsonic rumble."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad api 2500 bus compressor",
    "displayName": "UAD API 2500 Bus Compressor",
    "category": "Dynamics",
    "description": "The ultimate punchy VCA stereo master bus compressor. Delivers incredible transient grab, harmonic density, and the signature 'thrust' circuit that keeps low-end frequencies solid and dynamic.",
    "hardwareModel": "API 2500 Stereo Bus Compressor Hardware",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-20 dBu to +10 dBu",
        "defaultVal": "+10 dBu",
        "description": "Determines signal level where compression begins.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 10:1",
        "defaultVal": "2:1",
        "description": "Selects active compression ratio curve.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.03 ms / 0.1 ms / 0.3 ms / 1.0 ms / 3.0 ms / 10 ms / 30 ms",
        "defaultVal": "30 ms",
        "description": "Determines transient onset response speed.",
        "type": "select",
        "options": [
          "0.03 ms",
          "0.1 ms",
          "0.3 ms",
          "1.0 ms",
          "3.0 ms",
          "10 ms",
          "30 ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.05 s / 0.1 s / 0.2 s / 0.5 s / 1.0 s / 2.0 s / Variable",
        "defaultVal": "0.5 s",
        "description": "Adjusts speed of recovery to unity gain.",
        "type": "select",
        "options": [
          "0.05 s",
          "0.1 s",
          "0.2 s",
          "0.5 s",
          "1.0 s",
          "2.0 s",
          "Variable"
        ]
      },
      {
        "name": "Thrust Filter",
        "range": "Norm / Med / Loud",
        "defaultVal": "Norm",
        "description": "Activates sidechain spectral filter to preserve low-end power.",
        "type": "switch",
        "options": [
          "Norm",
          "Med",
          "Loud"
        ]
      },
      {
        "name": "Type Mode",
        "range": "Old / New",
        "defaultVal": "New",
        "description": "Switches feedback (Old) vs feed-forward (New) detection architecture.",
        "type": "switch",
        "options": [
          "Old",
          "New"
        ]
      }
    ],
    "proTips": [
      "Engage the patented 'Thrust' filter to Loud or Medium. This places a high-pass filter on the sidechain detector so that sub-kick and heavy bass do not over-trigger the compressor.",
      "The 'Old' compression mode mimics classic feedback compression (smoother, vintage), while the 'New' mode runs feed-forward compression (ultra-fast, modern, clean, hard-hitting).",
      "Use extremely slow attack times (e.g., 30ms) and fast releases (e.g., 0.1s) with a low ratio of 2:1 on your master bus to clamp down on stray peaks while maintaining transient punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad sphere mic collection",
    "displayName": "UAD Sphere Mic Collection",
    "category": "Preamps & Microphones",
    "description": "An advanced microphone modeling system that emulates the sound of over 30 of the most legendary ribbon, condenser, and dynamic microphones ever made. When paired with the UA Sphere dual-diaphragm microphone, it allows producers to change mic models, polar patterns, proximity effect, and axis alignment even after recording.",
    "hardwareModel": "Townsend Labs / Universal Audio Sphere L22 Microphone Modeling System",
    "parameters": [
      {
        "name": "Mic Model",
        "range": "LD-47 / LD-251 / LD-67 / DN-57 / RB-121",
        "defaultVal": "LD-47",
        "description": "Selects the specific vintage microphone model emulation.",
        "type": "select",
        "options": [
          "LD-47",
          "LD-251",
          "LD-67",
          "DN-57",
          "RB-121"
        ]
      },
      {
        "name": "Polar Pattern",
        "range": "Omni to Figure-8",
        "defaultVal": "Cardioid",
        "description": "Continuously adjusts the virtual microphone capsule polar pattern.",
        "type": "knob"
      },
      {
        "name": "Proximity",
        "range": "-100% to +100%",
        "defaultVal": "0%",
        "description": "Adjusts the proximity bass boost effect without changing microphone position.",
        "type": "knob"
      },
      {
        "name": "Dual Mode",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Enables blending of two completely different vintage mic models.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Filter",
        "range": "Off / 50 Hz / 80 Hz / 120 Hz / 150 Hz",
        "defaultVal": "Off",
        "description": "Sets the high-pass rumble filter frequency.",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "80 Hz",
          "120 Hz",
          "150 Hz"
        ]
      },
      {
        "name": "Axis",
        "range": "-180 to +180 degrees",
        "defaultVal": "0 degrees",
        "description": "Simulates rotating the physical microphone off-axis from the source.",
        "type": "knob"
      }
    ],
    "proTips": [
      "When tracking vocals, choose the LD-251 model for stellar, pristine high-end. If sibilance is an issue, dynamically adjust the Axis control to 15 degrees off-axis to smooth out the transients without using EQ.",
      "For acoustic guitars, engage Dual Mode and blend a vintage ribbon model like the RB-121 with a clean small-diaphragm condenser like the SD-451 to capture both warm body and transient sparkle."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad chandler limited zener limiter",
    "displayName": "UAD Chandler Limited Zener Limiter",
    "category": "Dynamics",
    "description": "Inspired by the legendary EMI TG12413 recording consoles used at Abbey Road, this dual-channel feedback limiter incorporates rare germanium diodes and discrete circuitry to deliver unmatched vintage saturation, mojo, and classic British control.",
    "hardwareModel": "Chandler Limited TG12413 Zener Limiter",
    "parameters": [
      {
        "name": "Operation Mode",
        "range": "Comp / Limit / THD",
        "defaultVal": "Comp",
        "description": "Selects the mode: feedback compression, brickwall limiting, or pure total harmonic distortion preamp.",
        "type": "select",
        "options": [
          "Comp",
          "Limit",
          "THD"
        ]
      },
      {
        "name": "Input Gain",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Determines how hard the signal drives the Zener feedback envelope and germanium saturation stage.",
        "type": "knob"
      },
      {
        "name": "Sidechain Filter",
        "range": "Flat / 50 Hz / 100 Hz / 150 Hz / 200 Hz / 300 Hz",
        "defaultVal": "Flat",
        "description": "Applies a high-pass filter in the detector loop to ignore low frequencies.",
        "type": "select",
        "options": [
          "Flat",
          "50 Hz",
          "100 Hz",
          "150 Hz",
          "200 Hz",
          "300 Hz"
        ]
      },
      {
        "name": "Attack Time",
        "range": "Fast / Medium / Slow / 1 to 11",
        "defaultVal": "Medium",
        "description": "Selects the attack constant. Custom EMI curves are mapped by number.",
        "type": "select",
        "options": [
          "Fast",
          "Medium",
          "Slow",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11"
        ]
      },
      {
        "name": "Release Time",
        "range": "Fast / Slow / 1 to 11 / Auto",
        "defaultVal": "Medium",
        "description": "Selects the recovery constant. Auto provides modern dual-stage recovery.",
        "type": "select",
        "options": [
          "Fast",
          "Slow",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "Auto"
        ]
      },
      {
        "name": "Output Control",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets output makeup volume to match processed and bypassed levels.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the 'Limit' mode for maximum vintage bite and extreme transient control. This is the classic Abbey Road sound, turning room mics into massive explosive drum walls.",
      "For master bus gluing, switch to 'Comp' mode. Set a slow attack (around 10ms), use the sidechain filter at 150 Hz to prevent bass frequencies from pumping the compressor, and seek only 1-2 dB of gain reduction.",
      "Turn up the Input Gain and back off the Output Control to saturate the custom discrete gain stage. The germanium diodes introduce gorgeous, rich second-harmonic distortion that thickens thin digital mixes."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ada std-1 stereo tapped delay",
    "displayName": "UAD ADA STD-1 Stereo Tapped Delay",
    "category": "Reverbs & Delays",
    "description": "Meticulously emulates the ultra-rare 1980s analog delay hardware. Utilizing bucket-brigade (BBD) technology, six independent delay taps, and advanced LFO modulation, the ADA STD-1 delivers iconic, wide stereo chorusing, flanging, and sweeping, spacey delay modulations.",
    "hardwareModel": "ADA STD-1 Stereo Tapped Delay",
    "parameters": [
      {
        "name": "Delay Time",
        "range": "1.3 ms to 51.2 ms",
        "defaultVal": "10 ms",
        "description": "Controls primary bucket-brigade hardware delay line length.",
        "type": "knob"
      },
      {
        "name": "LFO Rate",
        "range": "0.1 Hz to 25 Hz",
        "defaultVal": "1.0 Hz",
        "description": "Sets the sweep speed of the built-in delay line modulation.",
        "type": "knob"
      },
      {
        "name": "LFO Depth",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Adjusts the width and intensity of the LFO modulation sweep.",
        "type": "knob"
      },
      {
        "name": "Feedback Level",
        "range": "-100% to +100%",
        "defaultVal": "0%",
        "description": "Controls the feedback routing. Negative values flip the phase of the repeats.",
        "type": "knob"
      },
      {
        "name": "Tap Pan",
        "range": "Left / Center / Right",
        "defaultVal": "Center",
        "description": "Pans the six independent BBD taps across the stereo spectrum.",
        "type": "select",
        "options": [
          "Left",
          "Center",
          "Right"
        ]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Balances raw input dry level with processed wet delay signals.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Create a massive, ultra-wide stereo guitar sound by running a mono DI guitar track through the STD-1. Set Delay Time around 10ms, select divergent pan positions for taps 1-6, and apply subtle LFO modulation (Rate at 1 Hz, Depth at 15%).",
      "To get a classic 80s vocal doubling effect, set Delay Time to its minimum range. Pan the direct signal center and feed multiple taps hard left and right with high feedback to create a lush, shimmering BBD chorus."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad manley voxbox channel strip",
    "displayName": "UAD Manley VOXBOX Channel Strip",
    "category": "Channel Strips",
    "description": "The absolute pinnacle of all-tube high-end vocal processor channel strips. Features a gorgeous Class A tube preamp, dynamic opto compressor placed BEFORE the preamp to prevent distortion, a Pultec-style passive EQ, and an ultra-precise vocal de-esser/limiter module.",
    "hardwareModel": "Manley Laboratories VOXBOX Vacuum Tube Channel Strip",
    "parameters": [
      {
        "name": "Preamp Input Gain",
        "range": "40 dB to 60 dB",
        "defaultVal": "45 dB",
        "description": "Step selector for input vacuum tube gain drive.",
        "type": "switch",
        "options": [
          "40 dB",
          "45 dB",
          "50 dB",
          "55 dB",
          "60 dB"
        ]
      },
      {
        "name": "Preamp Low Cut Filter",
        "range": "Off / 80 Hz / 120 Hz",
        "defaultVal": "Off",
        "description": "Steep custom low-cut filter to manage vocal sibilants and rumble.",
        "type": "switch",
        "options": [
          "Off",
          "80 Hz",
          "120 Hz"
        ]
      },
      {
        "name": "Compressor Threshold",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Controls 3:1 opto compression threshold.",
        "type": "knob"
      },
      {
        "name": "EQ Mid Frequency",
        "range": "200 Hz to 7.2 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Sets center frequency for passive mid-range boost EQ.",
        "type": "knob"
      },
      {
        "name": "EQ Mid Gain",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts passive mid-range boost level.",
        "type": "knob"
      },
      {
        "name": "De-esser Threshold",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets dynamic sibilant compression threshold.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The compressor is uniquely positioned BEFORE the tube preamp—this lets you smooth out peaks and manage vocal dynamics without overdriving or clipping the sensitive tube input stage.",
      "The mid-parametric EQ operates on passive inductors for incredibly rich, vintage vocal warmth. Try a 2-3dB boost at 1.5 kHz or 3.0 kHz to give vocals clear presence and articulation.",
      "The de-esser/limiter features a dedicated 10% opto limiter that can operate at 10 kHz to pin down sibilants dynamically without dulling the performance."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ampeg b15n bass amplifier",
    "displayName": "UAD Ampeg B15N Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "The undisputed king of recorded bass tones. The Ampeg B-15N Portaflex plugin emulates the iconic 1960s all-tube bass combo, delivering the legendary round, warm, and highly expressive character that defined Motown and classic rock. Powered by Brainworx, it features unmatched physical modeling of both the 1964 and 1966 bias circuits, matched cabinet impulses, and premium preamp staging.",
    "hardwareModel": "Ampeg B-15N Portaflex Tube Bass Amplifier",
    "parameters": [
      {
        "name": "Amp Model Selector",
        "range": "1964 / 1966",
        "defaultVal": "1964",
        "description": "Switches between the 1964 and 1966 all-tube bias amp circuit modes.",
        "type": "switch",
        "options": [
          "1964",
          "1966"
        ]
      },
      {
        "name": "Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the primary preamp volume gain driving the tube power stage.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Low-frequency shelving equalizer to sculpt bass cabinet weight.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "High-frequency shelving equalizer to adjust bite and articulation.",
        "type": "knob"
      },
      {
        "name": "Input Gain",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Determines raw input drive signal level entering the tube stage.",
        "type": "knob"
      },
      {
        "name": "Cabinet Bypass",
        "range": "Active / Bypassed",
        "defaultVal": "Active",
        "description": "Bypasses the simulated cabinet impulse responses for DI output processing.",
        "type": "switch",
        "options": [
          "Active",
          "Bypassed"
        ]
      }
    ],
    "proTips": [
      "For the definitive Motown roundness, select the 1964 Bias mode, keep the Volume around 4, and slightly boost the Bass EQ to 2 o'clock while rolling off the Treble EQ to 10 o'clock.",
      "Use the Cabinet bypass on a parallel auxiliary track, driving the preamp stage hard (Input Gain to +6 dB) to blend a warm, overdriven tube grit under your clean DI bass track."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad galaxy tape echo",
    "displayName": "UAD Galaxy Tape Echo",
    "category": "Reverbs & Delays",
    "description": "The gold-standard multi-head tape delay. Captures the pitch wow/flutter, warm magnetic tape saturation, and lush, grainy spring reverb of the legendary Roland Space Echo.",
    "hardwareModel": "Roland RE-201 Space Echo",
    "parameters": [
      {
        "name": "Mode Selector",
        "range": "1 to 11",
        "defaultVal": "5",
        "description": "Selects combinations of playback heads 1, 2, 3, and the spring reverb.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11"
        ]
      },
      {
        "name": "Repeat Rate",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Controls the physical speed of the tape, setting delay duration.",
        "type": "knob"
      },
      {
        "name": "Intensity",
        "range": "0 to 100",
        "defaultVal": "35",
        "description": "Adjusts feedback repetition. Higher values trigger self-oscillation.",
        "type": "knob"
      },
      {
        "name": "Echo Volume",
        "range": "0 to 100",
        "defaultVal": "40",
        "description": "Sets the output volume of the wet delay tape playback signal.",
        "type": "knob"
      },
      {
        "name": "Reverb Volume",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets the level of the gritty, mechanical spring reverb tank.",
        "type": "knob"
      },
      {
        "name": "Tape Age",
        "range": "New / Used / Old",
        "defaultVal": "Used",
        "description": "Changes the age of the loaded tape formula, adding high-cut filtering and wow/flutter.",
        "type": "switch",
        "options": [
          "New",
          "Used",
          "Old"
        ]
      }
    ],
    "proTips": [
      "Rotate the Mode Selector through modes 1 to 11 to combine the three staggered playback tape heads with the analog spring reverb tank.",
      "Turn the Intensity knob past 50% (12 o'clock) to send the delay line into beautiful, self-oscillating feedback loops.",
      "Set Tape Age to 'Old' to attenuate high frequencies in the feedback loop and add vintage pitch drift (wow & flutter)."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad studio d chorus",
    "displayName": "UAD Studio D Chorus",
    "category": "Reverbs & Delays",
    "description": "Meticulously models the legendary Roland SDD-320 Dimension D chorus unit. Renowned for its unique spatial widening without obvious modulation artifacts, it delivers subtle, beautiful analog stereo width and lush dimension utilizing bucket-brigade circuits and interactive push-buttons.",
    "hardwareModel": "Roland SDD-320 Dimension D Chorus",
    "parameters": [
      {
        "name": "Dimension Mode",
        "range": "Buttons 1, 2, 3, 4, or combinations",
        "defaultVal": "4",
        "description": "Selects active BBD delay line combinations for stereo spatial depth.",
        "type": "select",
        "options": [
          "Button 1",
          "Button 2",
          "Button 3",
          "Button 4",
          "All Buttons"
        ]
      },
      {
        "name": "Mono/Stereo Switch",
        "range": "Mono / Stereo",
        "defaultVal": "Stereo",
        "description": "Enables raw mono or widened spatial stereo signal processing path.",
        "type": "switch",
        "options": [
          "Mono",
          "Stereo"
        ]
      },
      {
        "name": "Input Level",
        "range": "Off to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the input level of the dry signal driving the internal electronics.",
        "type": "knob"
      },
      {
        "name": "Active/Bypass",
        "range": "Active / Off",
        "defaultVal": "Active",
        "description": "Toggles between enabling the chorus processing or bypassing it completely.",
        "type": "switch",
        "options": [
          "Active",
          "Off"
        ]
      }
    ],
    "proTips": [
      "To add instant width and vocal glide without the 'warble' of a typical chorus, engage Mode 4. It provides the deepest spatial depth and makes lead vocals sit perfectly wide in a busy pop mix.",
      "Try pressing multiple buttons simultaneously (e.g., Mode 1 and Mode 3) as the original hardware did, to yield custom complex BBD delay-line combinations that work wonderfully on synthesizer pads."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad brigade chorus",
    "displayName": "UAD Brigade Chorus",
    "category": "Reverbs & Delays",
    "description": "Captures the legendary bucket-brigade dual-mode chorus and vibrato of the legendary 1976 Boss CE-1 Chorus Ensemble. Known for its lush analog warmth, organic depth, and distinct preamp saturation, it instantly adds classic 1970s and 80s movement to guitars, electric pianos, and vocals.",
    "hardwareModel": "Boss CE-1 Chorus Ensemble",
    "parameters": [
      {
        "name": "Effect Mode",
        "range": "Chorus / Vibrato",
        "defaultVal": "Chorus",
        "description": "Switches the internal circuit architecture between wide, shimmering chorus or pitch-modulating vibrato.",
        "type": "switch",
        "options": [
          "Chorus",
          "Vibrato"
        ]
      },
      {
        "name": "Chorus Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls chorus wet depth and modulation intensity.",
        "type": "knob"
      },
      {
        "name": "Vibrato Rate",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the Speed of the pitch modulation sweep in Vibrato mode.",
        "type": "knob"
      },
      {
        "name": "Vibrato Depth",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the depth/pitch-excursion level in Vibrato mode.",
        "type": "knob"
      },
      {
        "name": "Input Level",
        "range": "-infinity to +10 dB",
        "defaultVal": "0 dB",
        "description": "Drives the integrated high-impedance solid-state hardware preamp stage.",
        "type": "knob"
      },
      {
        "name": "Direct/Effect Switch",
        "range": "Direct / Effect",
        "defaultVal": "Effect",
        "description": "Outputs dry/wet mix (Effect) or wet-only signal (Direct) for parallel auxiliary loops.",
        "type": "switch",
        "options": [
          "Direct",
          "Effect"
        ]
      }
    ],
    "proTips": [
      "Drive the Input Level knob until the clip LED flashes slightly on drum overheads or Rhodes keys to get that famous, highly musical CE-1 solid-state preamp saturation.",
      "Switch to Vibrato mode with Rate at 4 and Depth at 5 on an electric guitar track to recreate the iconic, watery warble heard on classic post-punk and new wave recordings."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad fender 55 tweed deluxe amplifier",
    "displayName": "UAD Fender 55 Tweed Deluxe Amplifier",
    "category": "Guitar & Bass",
    "description": "Recreates the historic 1955 Fender Tweed Deluxe amplifier. Captured in meticulous physical detail down to the interactive tube behaviors, speaker cabinet variations, and dual-input jumping, it provides the signature warm, rich clean tones and raw, exploding tube-saturation of the legendary 5E3 circuit.",
    "hardwareModel": "1955 Fender Deluxe (5E3 Tweed) Amplifier",
    "parameters": [
      {
        "name": "Instrument Volume",
        "range": "1 to 12",
        "defaultVal": "1",
        "description": "Controls gain and drive levels for the Instrument channel inputs.",
        "type": "knob"
      },
      {
        "name": "Mic Volume",
        "range": "1 to 12",
        "defaultVal": "1",
        "description": "Adjusts output and gain interactive behavior for the Mic channel inputs.",
        "type": "knob"
      },
      {
        "name": "Tone",
        "range": "1 to 12",
        "defaultVal": "6",
        "description": "Sweeps the overall high-frequency and low-frequency tonal balance.",
        "type": "knob"
      },
      {
        "name": "Speaker Select",
        "range": "JP12 / Vintage / JBL",
        "defaultVal": "Vintage",
        "description": "Selects the speaker model to change speaker compression and response curves.",
        "type": "select",
        "options": [
          "JP12",
          "Vintage",
          "JBL"
        ]
      },
      {
        "name": "Input Select",
        "range": "Inst 1 / Inst 2 / Mic 1 / Mic 2 / Jumped",
        "defaultVal": "Inst 1",
        "description": "Selects physical input configuration including jumped dual-channel operation.",
        "type": "select",
        "options": [
          "Inst 1",
          "Inst 2",
          "Mic 1",
          "Mic 2",
          "Jumped"
        ]
      }
    ],
    "proTips": [
      "To experience the iconic exploding Tweed crunch, select the 'Jumped' input, set both Instrument and Mic Volume controls to 8 or higher, and back off your guitar volume slightly to control the bloom.",
      "Switch the speaker cab to the 'JBL' option to tighten up the fuzzy low-end and add a glassy, hi-fi top-end sheen that is perfect for classic country or clean funk rhythms."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad chandler limited curve bender eq",
    "displayName": "UAD Chandler Limited Curve Bender EQ",
    "category": "Equalizers",
    "description": "The majestic mastering EQ born from the legendary EMI TG12345 recording console used at Abbey Road. Infuses master tracks with classic British solid-state transformer character, crisp harmonic drive, and vintage shelving beauty.",
    "hardwareModel": "Chandler Limited EMI TG12345 Curve Bender EQ",
    "parameters": [
      {
        "name": "Gain Multiplier",
        "range": "x1 / x1.5",
        "defaultVal": "x1",
        "description": "Toggles the gain range. Use x1 for fine mastering adjustments (+/- 5dB) and x1.5 for active mixing (+/- 15dB).",
        "type": "switch",
        "options": [
          "x1",
          "x1.5"
        ]
      },
      {
        "name": "Low Frequency",
        "range": "35 / 50 / 70 / 91 / 150 / 200 Hz",
        "defaultVal": "91 Hz",
        "description": "Selects low shelf/peak band center frequency.",
        "type": "select",
        "options": [
          "35 Hz",
          "50 Hz",
          "70 Hz",
          "91 Hz",
          "150 Hz",
          "200 Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-5 to +5 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Controls amplification or attenuation of the low band.",
        "type": "knob"
      },
      {
        "name": "High Frequency",
        "range": "3.6k / 4.9k / 6.8k / 10k / 16k / 20k Hz",
        "defaultVal": "16k Hz",
        "description": "Selects high shelf/peak band center frequency.",
        "type": "select",
        "options": [
          "3.6k Hz",
          "4.9k Hz",
          "6.8k Hz",
          "10k Hz",
          "16k Hz",
          "20k Hz"
        ]
      },
      {
        "name": "High Gain",
        "range": "-5 to +5 dB (Stepped)",
        "defaultVal": "0 dB",
        "description": "Controls amplification or attenuation of the high shelf.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the Multiply switch (x1 / x1.5) to toggle between broad, subtle mastering-grade curves and more aggressive, surgical color filters.",
      "Boost 3.3 kHz or 4.2 kHz on mid-range instruments like electric guitars or rock keyboards to give them the authentic Abbey Road vintage presence.",
      "To add rich weight to low end, use the 91 Hz low band boost coupled with the high pass filter set to 28 Hz or 36 Hz to keep sub-bass clear."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad oxford limiter v2",
    "displayName": "UAD Oxford Limiter V2",
    "category": "Dynamics",
    "description": "A world-renowned professional mastering limiter that combines highly advanced look-ahead peak prevention with a unique, artistic 'Enhance' section that adds perceived loudness and dynamic excitement without flattening transients.",
    "hardwareModel": "Sonnox Oxford Limiter DSP Engine",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls the input drive feeding the brickwall limiter stage.",
        "type": "knob"
      },
      {
        "name": "Pre-Process Attack",
        "range": "0.05 ms to 10 ms",
        "defaultVal": "1.0 ms",
        "description": "Adjusts look-ahead attack timing for the initial transient catch.",
        "type": "knob"
      },
      {
        "name": "Pre-Process Release",
        "range": "0.1 ms to 10 s",
        "defaultVal": "100 ms",
        "description": "Sets the recovery timing of the brickwall limiting envelope.",
        "type": "knob"
      },
      {
        "name": "Enhance Amount",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Dials in the unique harmonic and perceived loudness enhancement filter.",
        "type": "knob"
      },
      {
        "name": "Ceiling",
        "range": "-18 dB to 0 dB",
        "defaultVal": "-0.1 dB",
        "description": "Sets the absolute peak limit threshold for the output stage.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The Enhance fader is the magic of this limiter. It boosts average program level without changing peak thresholds. Set it to 30-50% to add expensive analog warmth and upfront character to your master.",
      "Set the Auto Gain switch to 'On' for rapid peak limiting evaluation. It maintains subjective volume level so you can accurately hear the compressor's sonic footprint without loudness bias.",
      "Adjust the attack and release settings carefully. For heavy, bass-driven electronic music, a slower attack (around 1-2 ms) prevents crushing transient punch, while a fast release preserves low-end clarity."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad oxford envolution envelope shaper",
    "displayName": "UAD Oxford Envolution Envelope Shaper",
    "category": "Dynamics",
    "description": "A highly advanced, frequency-dependent envelope shaper. Offering independent control over Transient and Sustain envelopes with customizable frequency bands, allowing surgical control over drums, acoustic guitar pick, and room acoustics.",
    "hardwareModel": "Sonnox Oxford Envolution DSP Engine",
    "parameters": [
      {
        "name": "Transient Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts the volume of the detected attack transient envelope.",
        "type": "knob"
      },
      {
        "name": "Transient Attack",
        "range": "0.1 ms to 100 ms",
        "defaultVal": "5.0 ms",
        "description": "Adjusts the attack time constant of the transient detector.",
        "type": "knob"
      },
      {
        "name": "Sustain Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts the level of the release/sustain envelope.",
        "type": "knob"
      },
      {
        "name": "Sustain Release",
        "range": "5.0 ms to 10.0 s",
        "defaultVal": "100 ms",
        "description": "Sets the recovery duration of the sustain decay.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Sets the balance between dry input and processed transient output.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To add spectacular crack and snap to a dull snare, boost Transient Gain (+4 dB to +6 dB) and set Transient Frequency to 3.5 kHz. This adds sharp strike without raising muddy ring.",
      "Draw out immense room sound and drum decay without slamming the mix with heavy compression. Boost Sustain Gain and dial in a long Sustain Release (1s to 2s) to pull up ambient tail.",
      "To tame annoying pick noise on acoustic guitar, set a negative Transient Gain (-3 dB to -5 dB). The guitar will sound warmer and blend perfectly behind lead vocals."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_digital v3 eq collection",
    "displayName": "UAD bx_digital V3 EQ Collection",
    "category": "Equalizers",
    "description": "The premier Mid/Side mastering equalizer. Delivers surgical stereo and mid/side equalization, advanced stereo-width widening controls, and precise bass management filters.",
    "hardwareModel": "Brainworx bx_digital V3 Equalizer",
    "parameters": [
      {
        "name": "Stereo Width",
        "range": "0% to 400%",
        "defaultVal": "100%",
        "description": "Sets output stereo field width. Values past 100% widen side elements relative to the mid signal.",
        "type": "knob"
      },
      {
        "name": "Mono Maker",
        "range": "20 Hz to 22 kHz",
        "defaultVal": "20 Hz",
        "description": "Sums all stereo low-end frequencies below the selected cutoff to 100% mono.",
        "type": "knob"
      },
      {
        "name": "Mid Channel Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets final gain level for the Mid channel signal.",
        "type": "knob"
      },
      {
        "name": "Side Channel Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets final gain level for the Side channel signal.",
        "type": "knob"
      },
      {
        "name": "Bass Shift",
        "range": "-6 dB to +6 dB (M/S Shelving)",
        "defaultVal": "0 dB",
        "description": "Applies a highly interactive low shelving filter to balance weight.",
        "type": "knob"
      },
      {
        "name": "Presence Shift",
        "range": "-6 dB to +6 dB (M/S Shelving)",
        "defaultVal": "0 dB",
        "description": "Applies a highly interactive high-mid shelving filter to control clarity and harshness.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use 'Mono Maker' to sum low frequencies below 100 Hz to pure mono, tightening the low end and widening the rest of the stereo panorama.",
      "Increase 'Stereo Width' slightly (around 110% to 125%) on master buses to expand the perceived width of backing vocals and panning delays.",
      "Engage the 'Bass Shift' filter on the Side channel to add thick low-frequency shelving to the sides without muddying the center phantom image."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad marshall jmp 2203 amplifier",
    "displayName": "UAD Marshall JMP 2203 Amplifier",
    "category": "Guitar & Bass",
    "description": "Recreates the legendary Marshall JMP 2203 100-watt master volume head, providing the raw, metallic crunch of early heavy metal.",
    "hardwareModel": "Marshall JMP 2203 100W Tube Head",
    "parameters": [
      {
        "name": "Master Volume",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Controls final power-amp volume.",
        "type": "knob"
      },
      {
        "name": "Preamp Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets preamp distortion intensity.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Parametric midrange EQ filter.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "High-frequency presence response sweep.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Keep Master Volume high (7+) to get classic British power-tube clipping.",
      "Excellent on rock electric rhythm guitars; boost Middle for punchy definition.",
      "Add a TS808 pedal model in front of the amp to tighten up fast palm mutes."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad oxide tape recorder",
    "displayName": "UAD Oxide Tape Recorder",
    "category": "Tape & Saturation",
    "description": "Streamlined magnetic tape saturation. Offers the rich low-end 'head bump', transient rounding, and harmonic cohesion of physical tape machines in an incredibly easy-to-use package.",
    "hardwareModel": "Universal Audio Oxide Tape Saturation System",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls the input signal level driving the magnetic tape saturation engine.",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls final clean makeup output volume.",
        "type": "knob"
      },
      {
        "name": "Tape Speed",
        "range": "15 IPS / 30 IPS",
        "defaultVal": "15 IPS",
        "description": "Selects tape transport speed. 15 IPS emphasizes low end; 30 IPS has flatter high end.",
        "type": "switch",
        "options": [
          "15 IPS",
          "30 IPS"
        ]
      },
      {
        "name": "Tape Formula",
        "range": "GP9 / 456",
        "defaultVal": "GP9",
        "description": "Selects tape formulation: GP9 is modern with higher headroom; 456 is vintage and saturates faster.",
        "type": "switch",
        "options": [
          "GP9",
          "456"
        ]
      },
      {
        "name": "EQ Curve",
        "range": "NAB / CCIR",
        "defaultVal": "NAB",
        "description": "Switches the active high frequency pre-emphasis and de-emphasis curve standards.",
        "type": "switch",
        "options": [
          "NAB",
          "CCIR"
        ]
      }
    ],
    "proTips": [
      "Drive the Input Gain hard to slam the virtual tape, allowing the VU meters to ride in the red for thick tape saturation and natural limiting.",
      "Switch to 15 IPS tape speed to get a beefy, warm low-end boost (head bump) on bass guitars or kick drums.",
      "Use 30 IPS tape speed on vocal groups and string ensembles for high fidelity and smooth, organic transient leveling."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad eventide h910 harmonizer",
    "displayName": "UAD Eventide H910 Harmonizer",
    "category": "Reverbs & Delays",
    "description": "The official emulation of the world's first commercial digital pitch-shifter and delay. Released in 1975, it delivers incredibly warm, lo-fi digital pitch-shifting, organic feedback modulation, and signature stereo widening.",
    "hardwareModel": "Eventide H910 Pitch Harmonizer",
    "parameters": [
      {
        "name": "Pitch Ratio",
        "range": "0.90 to 1.10",
        "defaultVal": "1.00",
        "description": "Controls the pitch-shifting interval in fine micro-steps.",
        "type": "knob"
      },
      {
        "name": "Delay Time",
        "range": "0 ms / 7.5 ms / 15 ms / 30 ms / 60 ms / 112 ms",
        "defaultVal": "0 ms",
        "description": "Sets the early digital delay buffer length.",
        "type": "select",
        "options": [
          "0 ms",
          "7.5 ms",
          "15 ms",
          "30 ms",
          "60 ms",
          "112 ms"
        ]
      },
      {
        "name": "Feedback",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Feeds the pitch-shifted output back into the input buffer for cascading pitches.",
        "type": "knob"
      },
      {
        "name": "Anti-Feedback",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Activates organic sweep frequency modulation to prevent feedback build-up.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Input Level",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the input drive feeding the early digital AD/DA converters.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends the processed pitch/delay signal with dry input.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The classic 'Micro-Pitch' widening trick: Insert H910 on an aux. Set Pitch Ratio slightly sharp (1.015), Delay to 15ms, and pan hard right. Set a second H910 slightly flat (0.985), Delay to 30ms, and pan left.",
      "Engage the 'Anti-Feedback' switch. This unique circuit slightly modulates the pitch back and forth, preventing static room resonances and introducing a lush, organic chorusing warble.",
      "Push the 'Input Level' slightly into the red. The early AD/DA converters on the original hardware had a beautiful, gritty lo-fi crunch that adds incredible presence and saturation to vocals and synth leads."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad marshall bluesbreaker 1962 amplifier",
    "displayName": "UAD Marshall Bluesbreaker 1962 Amplifier",
    "category": "Guitar & Bass",
    "description": "Captures the open, warm, and highly dynamic British overdrive of the iconic 1962 Bluesbreaker combo, famous for its sweet tremolo circuit.",
    "hardwareModel": "Marshall 1962 Bluesbreaker Combo Amp",
    "parameters": [
      {
        "name": "Volume I",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "High-treble channel input drive.",
        "type": "knob"
      },
      {
        "name": "Volume II",
        "range": "0 to 10",
        "defaultVal": "2",
        "description": "Normal-dark channel input drive.",
        "type": "knob"
      },
      {
        "name": "Speed",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets rate of internal tremolo oscillator.",
        "type": "knob"
      },
      {
        "name": "Tremolo Intensity",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Controls depth of the tremolo circuit.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use as a dynamic blues tracking amp; responds beautifully to light pick touch.",
      "Turn on the speed-tremolo for a lush, organic volume swirl.",
      "Drive Channel I hard for vintage crunch, Channel II for warm dark jazz."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad marshall silver jubilee 2555 amplifier",
    "displayName": "UAD Marshall Silver Jubilee 2555 Amplifier",
    "category": "Guitar & Bass",
    "description": "Emulates the heavy Marshall Silver Jubilee 2555 tube amp, celebrated for its aggressive high-gain preamp and singing mid-range sustain.",
    "hardwareModel": "Marshall Silver Jubilee 2555 Tube Amp",
    "parameters": [
      {
        "name": "Lead Master",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Preamp lead channel master volume.",
        "type": "knob"
      },
      {
        "name": "Input Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets preamp distortion drive level.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Controls bite and air high-frequency EQ.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Guitar cabinet bass tone control.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The gold-standard amp model for heavy hard-rock rhythm tracks.",
      "Pull the Output Master to 10 to hear massive power-amp sag and singing feedback.",
      "Carve out guitar boxiness by keeping Middle EQ around 4."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad akg bx 20 spring reverb",
    "displayName": "UAD AKG BX 20 Spring Reverb",
    "category": "Reverbs & Delays",
    "description": "The absolute crown jewel of spring reverberation. Models the legendary AKG dual-channel mechanical spring system, delivering dark, dense, highly-organic, and lush modulated acoustic spaces.",
    "hardwareModel": "AKG BX 20 Stereo Spring Reverb",
    "parameters": [
      {
        "name": "Decay Time",
        "range": "1.5 s to 4.5 s",
        "defaultVal": "3.0 s",
        "description": "Controls the tension pad on the spring mechanics, setting reverb tail duration.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 150 ms",
        "defaultVal": "20 ms",
        "description": "Sets the physical delay onset before the audio excites the spring coils.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Filters or boosts low frequencies inside the spring recovery stage.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Filters or boosts high frequencies in the spring recovery stage.",
        "type": "knob"
      },
      {
        "name": "Stereo Width",
        "range": "Mono / Stereo / M/S",
        "defaultVal": "Stereo",
        "description": "Controls stereo separation of the dual independent spring recovery circuits.",
        "type": "select",
        "options": [
          "Mono",
          "Stereo",
          "M/S"
        ]
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends direct dry audio with processed spring reverb decay.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 'M/S' or 'Stereo' and use the dual channels independently to create massive, distinct left and right spring decay structures.",
      "Set Decay Time past 3.0s to generate a sprawling, warm ambient wash that wraps around synths, guitar soundscapes, or acoustic drums.",
      "Roll down the 'Bass EQ' slightly (around -2dB) to prevent low-mid resonance from piling up on auxiliary send buses."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad tube-tech eq collection",
    "displayName": "UAD Tube-Tech EQ Collection",
    "category": "Equalizers",
    "description": "The gold standard of Pultec-style tube equalizers. Bundles the PE 1C Program Equalizer for broad, silky low/high shelf sweetening and the ME 1B Mid-Range Equalizer for pristine mid-frequency carving.",
    "hardwareModel": "Tube-Tech PE 1C and ME 1B Tube Equalizers",
    "parameters": [
      {
        "name": "Low Freq (PE 1C)",
        "range": "20 / 30 / 60 / 100 Hz",
        "defaultVal": "30 Hz",
        "description": "Sets low shelving target frequency for the PE 1C unit.",
        "type": "select",
        "options": [
          "20 Hz",
          "30 Hz",
          "60 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Boost (PE 1C)",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "0",
        "description": "Boosts low-frequency shelving band on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "Low Atten (PE 1C)",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "0",
        "description": "Attenuates low-frequency shelving band on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "High Boost Freq (PE 1C)",
        "range": "1 / 1.5 / 2 / 3 / 4 / 5 / 8 / 10 / 12 / 16 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets target frequency for high-frequency peaking boost on PE 1C.",
        "type": "select",
        "options": [
          "1 kHz",
          "1.5 kHz",
          "2 kHz",
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "8 kHz",
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ]
      },
      {
        "name": "High Boost Gain (PE 1C)",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "0",
        "description": "Adjusts peaking high boost gain on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "High Atten Gain (PE 1C)",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "0",
        "description": "Adjusts high shelf shelving attenuation on the PE 1C.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the legendary 'Pultec low-end trick' on the PE 1C: select 30Hz or 60Hz and boost and attenuate simultaneously to tighten kick drum subs while clearing boxy low-mids.",
      "Open up backing vocal groups or stereo bus mixes with the PE 1C by choosing a high boost of 12kHz or 16kHz with a wide Bandwidth (around 7) and a subtle +2dB boost.",
      "On the ME 1B, select 700Hz or 1kHz and dial in an attenuation of -2dB to clear out boxy or nasal characters from vocals or acoustic guitars."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ampeg svt-vr bass amplifier",
    "displayName": "UAD Ampeg SVT-VR Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "An impeccable emulation of the monstrous, multi-stage 300-watt all-tube SVT-VR bass rig. Famed for its physical raw power and legendary warm tube growl, this plugin delivers the definitive rock-and-roll bass backbone with deep, authentic speaker cabinet options.",
    "hardwareModel": "Ampeg SVT-VR Classic Bass Amplifier",
    "parameters": [
      {
        "name": "Volume",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets the input level feeding Channel 1's preamp tubes.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Boosts or cuts low-frequency shelf response.",
        "type": "knob"
      },
      {
        "name": "Midrange EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the level of the semi-parametric midrange EQ band.",
        "type": "knob"
      },
      {
        "name": "Mid Frequency Select",
        "range": "220 Hz / 800 Hz / 3 kHz",
        "defaultVal": "800 Hz",
        "description": "Selects the center frequency for the interactive midrange control.",
        "type": "select",
        "options": [
          "220 Hz",
          "800 Hz",
          "3 kHz"
        ]
      },
      {
        "name": "Treble EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts high-frequency brightness and pick attack.",
        "type": "knob"
      },
      {
        "name": "Ultra Hi/Lo Switches",
        "range": "Off / Ultra Hi / Ultra Lo / Both",
        "defaultVal": "Off",
        "description": "Engages immediate dramatic sub-bass shelf boost or top-end sparkle filter.",
        "type": "select",
        "options": [
          "Off",
          "Ultra Hi",
          "Ultra Lo",
          "Both"
        ]
      }
    ],
    "proTips": [
      "For classic aggressive rock bass, set Channel 1 Volume to 7, select 800Hz on the Mid Frequency switch, and boost Mid EQ to +3dB. This injects the signature SVT bite that carves beautifully through thick electric guitar walls.",
      "Engage the 'Ultra Lo' switch to introduce an instant, structural low-frequency boost centered around 40Hz with an interactive mid-scoop, yielding massive chest-thumping weight for reggae or modern drop-tuned metal."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ampeg svt-3 pro bass amplifier",
    "displayName": "UAD Ampeg SVT-3 Pro Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "An authentic emulation of the professional Ampeg SVT-3 PRO hybrid bass head. Combining a rich 12AX7 tube preamp with a highly versatile active 3-band tone stack and unique tube voltage tube grit control.",
    "hardwareModel": "Ampeg SVT-3 PRO Hybrid Bass Head",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the 12AX7 preamp tubes for warm compression and grit.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-end shelf level.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the midrange gain band.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-end string attack and bite.",
        "type": "knob"
      },
      {
        "name": "Tube Voltage",
        "range": "Low to High",
        "defaultVal": "High",
        "description": "Varies plate voltage of preamp valves to change compression texture and drive.",
        "type": "knob"
      },
      {
        "name": "Ultra Lo",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages deep sub-bass boost with low-mid frequency scoop.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Use the 'Tube Voltage' knob to vary the plate voltage feeding the preamp tubes. Lower voltage introduces classic Ampeg tube growl and soft compression, ideal for rock bass tracking.",
      "Engage the 'Ultra Lo' boost switch to add a deep, scoop-like low-end foundation to 5-string bass tracks, perfect for modern metal or reggae.",
      "The 'Midrange Frequency' selector acts like a parametric sweep. Sweep it to 800Hz and boost to add signature growl that cuts through busy guitar walls."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad neve 88rs channel strip collection",
    "displayName": "UAD Neve 88RS Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The pinnacle of large-format console architecture. Captures the sound of the ultimate high-headroom Neve 88RS desk, delivering pristine, modern, punchy analog saturation, an ultra-smooth four-band parametric EQ, a fast gate/expander, and transparent VCA compression.",
    "hardwareModel": "Neve 88RS Large-Format Mixing Console",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the console preamp gain. High values introduce modern Neve harmonic grit.",
        "type": "knob"
      },
      {
        "name": "Low Cut Filter",
        "range": "Out / 20 Hz to 300 Hz",
        "defaultVal": "Out",
        "description": "Applies a steep 18dB/octave high-pass filter.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-30 dB to +20 dB",
        "defaultVal": "+20 dB",
        "description": "Adjusts the threshold for the VCA compressor module.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to 10:1 (Continuous)",
        "defaultVal": "2:1",
        "description": "Sets the compression slope.",
        "type": "knob"
      },
      {
        "name": "High EQ Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls gain for the high shelving band.",
        "type": "knob"
      },
      {
        "name": "Low EQ Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls gain for the low shelving band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Enable the Pre-EQ (P-EQ) button in the dynamics module to route the VCA compressor BEFORE the EQ, allowing you to sculpt the compressed tone surgically.",
      "Drive the Preamp Input Gain hard to introduce warm, harmonically rich console saturation, then back down the fader to keep output levels safe.",
      "Engage the Hysteresis control on the Gate module to prevent chattering/rapid toggling on trailing decay tails of drums or background instruments."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad marshall plexi super lead 1959 amplifier",
    "displayName": "UAD Marshall Plexi Super Lead 1959 Amplifier",
    "category": "Guitar & Bass",
    "description": "A faithful emulation of the legendary 100-watt British stack. Developed by Softube, it captures the raw power, reactive speaker cabinet impedance, and classic dual-input blending of the definitive late 1960s rock amplifier.",
    "hardwareModel": "Marshall Plexi Super Lead 1959",
    "parameters": [
      {
        "name": "Volume I",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the gain of the High Treble channel.",
        "type": "knob"
      },
      {
        "name": "Volume II",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the gain of the Normal channel.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high frequencies.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts midrange frequencies.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts low frequencies.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts upper-mid and high-frequency power-amp response.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For the ultimate classic rock crunch, patch the inputs together (jumped). Dial Volume I to 7 (2 o'clock) and Volume II to 4 (10 o'clock) to blend biting high-end sizzle with thick low-end body.",
      "Turn down the guitar's physical volume knob to about 5 or 6; the emulation reacts dynamically, cleaning up the distortion into a glassy, woody tone perfect for Hendrix-style rhythm playing."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad tube-tech cl 1b compressor",
    "displayName": "UAD Tube-Tech CL 1B Compressor",
    "category": "Dynamics",
    "description": "An authentic emulation of the iconic Danish blue optical compressor. Renowned for its incredibly smooth, warm, and highly musical tube compression that effortlessly glues vocals, bass, and acoustic guitars without destroying transients.",
    "hardwareModel": "Tube-Tech CL 1B Opto Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 dB to 0 dB",
        "defaultVal": "-10 dB",
        "description": "Sets the compression threshold level.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 to 10:1",
        "defaultVal": "3:1",
        "description": "Sets the compression ratio.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.5 ms to 300 ms",
        "defaultVal": "10 ms",
        "description": "Sets the attack time.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.05 s to 4 s",
        "defaultVal": "0.5 s",
        "description": "Sets the release time.",
        "type": "knob"
      },
      {
        "name": "Attack/Release Select",
        "range": "Manual / Preset / Fixed",
        "defaultVal": "Manual",
        "description": "Selects manual, fixed, or combined program-dependent attack and release behavior.",
        "type": "select",
        "options": [
          "Manual",
          "Preset",
          "Fixed"
        ]
      },
      {
        "name": "Gain",
        "range": "0 dB to +30 dB",
        "defaultVal": "10 dB",
        "description": "Applies output makeup gain.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On lead pop vocals, select 'Fixed' mode. This introduces a dual-time constant release where fast transients recover quickly while the overall average level is leveled out smoothly, keeping the vocal beautifully upfront.",
      "For bass guitar, switch to 'Manual' control with a medium-slow Attack (around 12 o'clock) and a fast Release (around 9 o'clock). This allows the initial string pluck transient to slip through untouched before clamping down for ultimate low-end sustain."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ibanez tube screamer ts808 overdrive",
    "displayName": "UAD Ibanez Tube Screamer TS808 Overdrive",
    "category": "Guitar & Bass",
    "description": "The legendary green overdrive pedal. Known for its iconic mid-range hump and organic, tube-like clipping, it is the premier choice for boosting tube amplifiers into rich sustain or tightening heavy rhythm guitar tracks.",
    "hardwareModel": "Ibanez Tube Screamer TS808 Overdrive",
    "parameters": [
      {
        "name": "Overdrive",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the level of distortion and sustain.",
        "type": "knob"
      },
      {
        "name": "Tone",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high-frequency brightness and mid-range focus.",
        "type": "knob"
      },
      {
        "name": "Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the output level of the pedal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To tighten a modern high-gain metal guitar tone, insert the pedal before a dirty amp model. Pull the Overdrive down to 1 or 2, crank the Level to 8 or 9, and set the Tone to 6. This cuts flabby sub-bass and pushes the midrange hard for aggressive palm-mutes.",
      "For blues-rock lead sustain on clean or slightly broken-up amps, set Overdrive to 7, Tone to 4, and Level to 6. This creates a fat, warm singing lead tone with rich harmonic feedback."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad raw distortion",
    "displayName": "UAD Raw Distortion",
    "category": "Guitar & Bass",
    "description": "A meticulous emulation of the early-1980s ProCo RAT distortion pedal. Powered by Unison technology, it delivers the raw, high-gain clipping, gritty midrange, and signature 'Filter' EQ sweep that defined early punk, grunge, and heavy metal.",
    "hardwareModel": "ProCo RAT Distortion Guitar Pedal",
    "parameters": [
      {
        "name": "Distortion",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Adjusts the amount of hard-clipping distortion.",
        "type": "knob"
      },
      {
        "name": "Filter",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the high-cut frequency. Note that turning clockwise cuts high frequencies (reverse operation).",
        "type": "knob"
      },
      {
        "name": "Volume",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Controls the overall output volume.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Remember that the Filter knob works in reverse: turning it clockwise reduces high end. On clean electric guitars, set Distortion to 5, and sweep the Filter clockwise to around 7 to get a dark, thick, violin-like sustain without harsh upper-mid bite.",
      "Use the pedal as a parallel effect on a drum room bus. Send a copy of the room mics to a stereo auxiliary channel with the Raw Distortion. Crank the Distortion to 8, roll the Filter to 4, and blend it back in around -15dB below the dry tracks to add explosive industrial power."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad bermuda triangle distortion",
    "displayName": "UAD Bermuda Triangle Distortion",
    "category": "Guitar & Bass",
    "description": "A faithful emulation of the legendary early-1970s 'Bermuda Triangle' version of the Electro-Harmonix Big Muff Pi. It delivers the ultimate, thick, singing fuzz sustain, scooped mids, and massive low-end wall of sound that defined alternative rock and stoner metal.",
    "hardwareModel": "Electro-Harmonix Big Muff Pi (V1 'Bermuda Triangle')",
    "parameters": [
      {
        "name": "Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets the output volume of the fuzz effect.",
        "type": "knob"
      },
      {
        "name": "Sustain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the amount of heavy fuzz clipping and endless sustain.",
        "type": "knob"
      },
      {
        "name": "Tone",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Balances treble and bass, sweeping from a deep bassy thud to high-frequency screaming bite with a classic mid-frequency scoop.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To cut through a dense mix, feed the Bermuda Triangle into a mid-forward overdrive pedal like the TS808. Set the Big Muff's Sustain to 6, Tone to 5, and use the TS808 to restore the scooped midrange frequencies for a screaming, focused lead guitar.",
      "On bass guitar, duplicate the track and apply the Bermuda Triangle to the high-passed parallel channel (above 200 Hz). Crank the Sustain to 8, roll the Tone to 4, and blend it with the clean DI track to achieve a massive Muse-style synth-bass fuzz roar without sacrificing low-end phase alignment."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad friedman amplifiers collection",
    "displayName": "UAD Friedman Amplifiers Collection",
    "category": "Guitar & Bass",
    "description": "A superb emulation of boutique Friedman amplifiers, including the high-gain powerhouse BE-100 and the vintage-inspired Dirty Shirley. Developed by Brainworx, this collection delivers everything from clean plexi-style sparkle to crushing, modern high-gain brown sounds.",
    "hardwareModel": "Friedman BE-100 and Dirty Shirley Amplifiers",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the preamp gain and overdrive depth.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the low-frequency EQ response.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the midrange EQ response.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the high-frequency EQ response.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high-frequency negative feedback in the power section.",
        "type": "knob"
      },
      {
        "name": "Master",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets the power amp master volume.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On the BE-100 model, engage the 'FAT' switch and set the Presence to 6 while keeping the Middle at 6.5. This thickens single-coil pickups, turning a Stratocaster into a massive, singing lead instrument.",
      "For punchy, tight rhythm guitars, select the BE-100 channel with the SAT (Saturation) switch engaged, roll the Bass back to 4 to prevent cabinet mud, and set Master volume to 7 to let the virtual power tubes compress."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad sound machine wood works",
    "displayName": "UAD Sound Machine Wood Works",
    "category": "Guitar & Bass",
    "description": "A specialized DSP-driven acoustic guitar re-voicing processor. It removes the harsh, artificial 'quack' and dry thinness of acoustic piezo pickups, simulating the complex cabinet body resonance and spatial acoustics of a premium studio microphone setup in real-time.",
    "hardwareModel": "Sound Machine Wood Works Acoustic Guitar Processor",
    "parameters": [
      {
        "name": "Studio Mode",
        "range": "Studio / Dreadnought / Jumbo",
        "defaultVal": "Dreadnought",
        "description": "Selects the acoustic body style emulation.",
        "type": "select",
        "options": [
          "Studio",
          "Dreadnought",
          "Jumbo"
        ]
      },
      {
        "name": "Source/Direct",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Controls the blend of direct piezo pickup signal.",
        "type": "knob"
      },
      {
        "name": "Studio/Mic",
        "range": "0% to 100%",
        "defaultVal": "80%",
        "description": "Controls the level of modeled studio microphone acoustic sound.",
        "type": "knob"
      },
      {
        "name": "Treble Shaper",
        "range": "-5 to +5",
        "defaultVal": "0",
        "description": "Adjusts high-frequency clarity and pick attack warmth.",
        "type": "knob"
      },
      {
        "name": "Low Cut",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a high-pass filter to clean up low-end room boom and feedback.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "For fingerstyle acoustic guitar, choose 'Studio' mode, set Source/Direct to 15%, and Studio/Mic to 85%. Push the Treble Shaper to +2 to emphasize the delicate finger picks and wooden fret detail.",
      "When tracking acoustic guitar live in a busy rock band mix, use 'Dreadnought' mode, engage the Low Cut switch, and bring the Source/Direct knob up to 40% to keep enough transient 'snap' and phase stability to cut through the drums."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad manley variable mu limiter",
    "displayName": "UAD Manley Variable Mu Limiter",
    "category": "Dynamics",
    "description": "The definitive emulation of Manley's flagship vacuum tube compressor. Operating on the variable-delta-mu principle where tube gain is continually modulated, it provides the ultimate velvety stereo glue, warm harmonic depth, and cohesive low-end control for the master bus and vocal groups.",
    "hardwareModel": "Manley Variable Mu Limiter Compressor",
    "parameters": [
      {
        "name": "Input",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the input level, driving the tube circuitry and determining threshold behavior.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "-20 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets the compression threshold.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "15 ms to 70 ms",
        "defaultVal": "30 ms",
        "description": "Determines the variable compressor attack speed.",
        "type": "knob"
      },
      {
        "name": "Recovery",
        "range": "0.1 s to 8 s",
        "defaultVal": "0.2 s",
        "description": "Sets the recovery (release) time, including manual steps and Auto options.",
        "type": "select",
        "options": [
          "0.1s",
          "0.2s",
          "0.4s",
          "0.6s",
          "0.8s",
          "1.6s",
          "2s to 8s (Auto)"
        ]
      },
      {
        "name": "Compress/Limit",
        "range": "Compress / Limit",
        "defaultVal": "Compress",
        "description": "Toggles between a soft-knee 1.5:1 ratio and a stiffer, punchier 4:1 to 20:1 limit ratio.",
        "type": "switch",
        "options": [
          "Compress",
          "Limit"
        ]
      },
      {
        "name": "Output",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the final makeup gain output level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For legendary master bus glue: set Compress mode, Attack to Medium-Slow (around 2 o'clock), Recovery to 0.4s or 0.2s, and drive the Input until you get a maximum of 1 to 1.5 dB of gain reduction. This instantly pulls a digital mix together with expensive-sounding tube depth.",
      "Engage the Sidechain High-Pass Filter (HPF) on the bottom panel. This prevents sub-bass energy below 100 Hz from triggering the compression, keeping your kick drum punchy and avoiding unwanted mix pumping."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad vertigo vsc-2 compressor",
    "displayName": "UAD Vertigo VSC-2 Compressor",
    "category": "Dynamics",
    "description": "An authentic emulation of the 'King of VCA' compressors. Built around four custom hand-built discrete VCA-1979 blocks, it delivers an incredibly punchy, crystal-clear, and pristine 'mastering-grade' cohesion across the stereo mix bus or drum groups.",
    "hardwareModel": "Vertigo Sound VSC-2 Quad VCA Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-22 dBu to +15 dBu",
        "defaultVal": "0 dBu",
        "description": "Sets the compression threshold level.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1.5:1 / 2:1 / 4:1 / 8:1 / 10:1 / Brick",
        "defaultVal": "2:1",
        "description": "Selects the compression ratio.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "4:1",
          "8:1",
          "10:1",
          "Brick"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1 ms to 40 ms",
        "defaultVal": "10 ms",
        "description": "Sets the compression response speed.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.1 s to 1.2 s / Auto",
        "defaultVal": "Auto",
        "description": "Sets the recovery speed.",
        "type": "select",
        "options": [
          "0.1s",
          "0.3s",
          "0.6s",
          "1.2s",
          "Auto"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / 60 Hz / 90 Hz",
        "defaultVal": "Off",
        "description": "Filters out sub-bass frequencies from entering the sidechain detector.",
        "type": "select",
        "options": [
          "Off",
          "60 Hz",
          "90 Hz"
        ]
      },
      {
        "name": "Make-Up",
        "range": "-22 dB to +22 dB",
        "defaultVal": "0 dB",
        "description": "Controls the final clean VCA output makeup gain.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On the master bus, choose the ultra-gentle 1.5:1 ratio, set Attack to 10 ms, and Release to 'Auto'. This creates an incredibly transparent, invisible dynamic control that glues the tracks together without changing the frequency balance.",
      "For explosive parallel drums, set the Ratio to 'Brick', Attack to 0.3 ms (fast), and Release to 0.1 s. Drive the Threshold hard until you achieve 8-10 dB of compression, then blend this track in parallel under your dry kit for immense power."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad vertigo vsm-3 saturator",
    "displayName": "UAD Vertigo VSM-3 Saturator",
    "category": "Tape & Saturation",
    "description": "A masterfully engineered emulation of the Vertigo VSM-3 Satellite harmonic generator. It allows for highly precise, targeted mastering-grade saturation, split independently into warm 2nd-order (FET-style) and biting 3rd-order (Zener-style) harmonic distortion with flexible Mid/Side routing.",
    "hardwareModel": "Vertigo Sound VSM-3 Satellite",
    "parameters": [
      {
        "name": "2nd Harmonic Drive",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Controls the depth of second-order FET 'subharmonic' warmth.",
        "type": "knob"
      },
      {
        "name": "2nd Harmonic Level",
        "range": "Off / -30 dB to 0 dB",
        "defaultVal": "-12 dB",
        "description": "Sets the output volume of the processed second-order harmonic.",
        "type": "knob"
      },
      {
        "name": "3rd Harmonic Drive",
        "range": "0% to 100%",
        "defaultVal": "15%",
        "description": "Controls the depth of third-order Zener diode 'gritty' distortion.",
        "type": "knob"
      },
      {
        "name": "3rd Harmonic Level",
        "range": "Off / -30 dB to 0 dB",
        "defaultVal": "-15 dB",
        "description": "Sets the output volume of the processed third-order harmonic.",
        "type": "knob"
      },
      {
        "name": "Input Level",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets the overall input gain driving the system.",
        "type": "knob"
      },
      {
        "name": "Monitoring",
        "range": "Stereo / Mid / Side",
        "defaultVal": "Stereo",
        "description": "Toggles the monitoring focus for Mid/Side or Stereo processing.",
        "type": "select",
        "options": [
          "Stereo",
          "Mid",
          "Side"
        ]
      }
    ],
    "proTips": [
      "To make a mix sound wider, switch the 2nd Harmonic processor to 'Side' mode. Saturate only the side channels to bring out stereo-focused reverbs, acoustic guitars, and synths without cluttering the center lead vocal or kick drum.",
      "On a dull vocal, feed 3rd Harmonic (Zener) in 'Track' mode, set the Filter to 'Hi' (aiming at 5kHz+), crank the 3rd Drive to 50%, and slowly blend the 3rd Level up. It acts as an incredibly rich, non-linear exciter that adds expensive 'air' and presence."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad massenburg designworks mdweq5 eq",
    "displayName": "UAD Massenburg DesignWorks MDWEQ5 EQ",
    "category": "Equalizers",
    "description": "The industry-standard high-resolution parametric EQ, designed by the pioneer of parametric equalization himself, George Massenburg. Featuring high-precision, double-precision processing with zero phase distortion, it is the ultimate choice for surgical corrective equalization and mastering.",
    "hardwareModel": "Massenburg DesignWorks MDW Parametric EQ 5",
    "parameters": [
      {
        "name": "Band 1 Type",
        "range": "LF Shelving / Peaking / Low Cut",
        "defaultVal": "Low Cut",
        "description": "Selects filter type for Band 1.",
        "type": "select",
        "options": [
          "LF Shelving",
          "Peaking",
          "Low Cut"
        ]
      },
      {
        "name": "Band 3 Frequency",
        "range": "10 Hz to 20 kHz",
        "defaultVal": "1000 Hz",
        "description": "Sets the center frequency for the midrange band.",
        "type": "knob"
      },
      {
        "name": "Band 3 Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the cut or boost level for the midrange band.",
        "type": "knob"
      },
      {
        "name": "Band 3 Q",
        "range": "0.1 to 25.6",
        "defaultVal": "1.0",
        "description": "Adjusts the bandwidth (Q factor) of the midrange filter, allowing extremely narrow notches.",
        "type": "knob"
      },
      {
        "name": "Band 5 Frequency",
        "range": "10 Hz to 20 kHz",
        "defaultVal": "10000 Hz",
        "description": "Sets the center frequency for the high frequency band.",
        "type": "knob"
      },
      {
        "name": "Band 5 Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the cut or boost level for the high band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The MDWEQ5 is famous for its surgical precision and zero phase distortion. To remove an annoying frequency or room resonance from an acoustic guitar, set Q to 25.0, boost the gain to +12 dB, sweep the frequency to locate the whistle, and then notch it down to -10 dB.",
      "For mastering, use the High Shelf (Band 5) set around 12 kHz, with a broad Q of 0.5. Gently boost by 0.5 to 1.5 dB. Because of Massenburg's ultra-clean filter math, this adds incredible airy sweetness without any digital harshness."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ams rmx16 digital reverb",
    "displayName": "UAD AMS RMX16 Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "The definitive 1980s microprocessor-controlled digital reverb. Used on countless legendary recordings from Phil Collins to Kate Bush, it is famous for its unique 12-bit converters and lush, characteristic 'Non-Lin 2' and 'Ambience' algorithms.",
    "hardwareModel": "AMS RMX16 Digital Reverberation System",
    "parameters": [
      {
        "name": "Program Select",
        "range": "Ambience / Room / Hall / Plate / Non-Lin / Reverse / Chorus",
        "defaultVal": "Plate",
        "description": "Selects the digital reverb algorithm.",
        "type": "select",
        "options": [
          "Ambience",
          "Room",
          "Hall",
          "Plate",
          "Non-Lin 2",
          "Reverse 1",
          "Chorus"
        ]
      },
      {
        "name": "Decay Time",
        "range": "0.1s to 9.9s",
        "defaultVal": "2.4s",
        "description": "Adjusts the decay time in seconds.",
        "type": "knob"
      },
      {
        "name": "Pre-Delay",
        "range": "0 ms to 300 ms",
        "defaultVal": "10 ms",
        "description": "Sets pre-delay time before reverb onset.",
        "type": "knob"
      },
      {
        "name": "High Filter",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Controls high-frequency dampening of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Low Filter",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Controls low-frequency roll-off of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls processed dry/wet balance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 'Non-Lin 2' on a snare drum auxiliary send. Set Decay Time to 0.8s, and Pre-Delay to 20ms. This provides that classic, massive 80s gated snare explosion without needing an actual noise gate.",
      "To add stereo width to dry electric guitars, select the 'Ambience' program, drop Decay Time to 0.4s, and set the Wet/Dry Mix to 25%. It places the dry guitars in an expensive-sounding 3D space while keeping their transient bite."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad summit audio tla-100a compressor",
    "displayName": "UAD Summit Audio TLA-100A Compressor",
    "category": "Dynamics",
    "description": "A faithful emulation of the classic Summit Audio TLA-100A, a modern legend in soft-knee optical compression. Blending the smooth response of a tube leveling amplifier with the speed of solid-state technology, it is beloved for its warm, simple, and forgiving vocal leveling.",
    "hardwareModel": "Summit Audio TLA-100A Tube Leveling Amplifier",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the output makeup gain of the compressor.",
        "type": "knob"
      },
      {
        "name": "Gain Reduction",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Sets the threshold of the opto-electronic compression cell.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "Fast / Medium / Slow",
        "defaultVal": "Medium",
        "description": "Sets the attack time of the optical envelope detector.",
        "type": "switch",
        "options": [
          "Fast",
          "Medium",
          "Slow"
        ]
      },
      {
        "name": "Release",
        "range": "Fast / Medium / Slow",
        "defaultVal": "Medium",
        "description": "Sets the release recovery speed.",
        "type": "switch",
        "options": [
          "Fast",
          "Medium",
          "Slow"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / Low Cut / High Pass",
        "defaultVal": "Off",
        "description": "Applies high-pass filtering to the internal detector path to avoid bass pumping.",
        "type": "select",
        "options": [
          "Off",
          "Low Cut",
          "High Pass"
        ]
      }
    ],
    "proTips": [
      "On a dynamic lead vocal, select 'Medium' for both Attack and Release. Dial the Gain Reduction until you hit -4 dB on peak lines. The TLA-100A will smoothly iron out the dynamic changes without any audible artifacts.",
      "To glue an acoustic guitar track, select 'Slow' Attack to let the initial pick attack through, and 'Fast' Release. Bring the Gain Reduction to 3, then boost the Gain knob slightly to saturate the output tube emulation."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad elysia alpha compressor",
    "displayName": "UAD elysia alpha compressor",
    "category": "Dynamics",
    "description": "A masterclass emulation of Elysia's reference class-A analog mastering compressor. Renowned for its outstanding transparency, innovative M/S processing, 'Auto Fast' attack adjustments, and integrated soft-clipper, it is the ultimate tool for final dynamic polishing.",
    "hardwareModel": "Elysia Alpha Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-20 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets the compression threshold.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.01 ms to 120 ms",
        "defaultVal": "20 ms",
        "description": "Controls the speed at which compression begins.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "10 ms to 3.0 s",
        "defaultVal": "200 ms",
        "description": "Sets the compression recovery speed.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1:1.1 to 1:5.0",
        "defaultVal": "1:1.2",
        "description": "Sets the compression slope ratio, optimized for mastering precision.",
        "type": "knob"
      },
      {
        "name": "Auto Fast",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Enables a dynamic auto-fast attack time for transient peaks.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Warmth",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Toggles an analog slew-rate limiter filter for tube-like warmth.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Engage the 'Auto Fast' switch on the Attack panel. This allows the compressor to use a slow attack for musical timing, but dynamically speeds up when a sudden loud transient (like a kick or snare) hits, protecting the master bus from clipping without sounding squeezed.",
      "To tame harsh digital mixes, toggle the 'Warmth' switch on. This engages a custom class-A circuit that slews the high frequencies, adding a rich tape-like soft-focus texture to the top end of the stereo field."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad elysia mpressor",
    "displayName": "UAD elysia mpressor",
    "category": "Dynamics",
    "description": "A meticulous emulation of Elysia's creative VCA compressor. Famous for its pristine discrete class-A circuitry, extreme punch, negative ratios, and 'Anti Log' release curves, it is a powerhouse for aggressive drum-shaping and sound-design.",
    "hardwareModel": "Elysia Mpressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-26 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets the compression threshold level.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1:2.0 to -1:0.5",
        "defaultVal": "1:2.0",
        "description": "Sets the ratio. Includes unique negative ratios where the output volume drops as input exceeds threshold.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.01 ms to 120 ms",
        "defaultVal": "10 ms",
        "description": "Sets the attack response speed.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "10 ms to 4.0 s / Auto",
        "defaultVal": "100 ms",
        "description": "Sets the compressor recovery time.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "0 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets output makeup gain.",
        "type": "knob"
      },
      {
        "name": "Anti Log",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Switches to an anti-logarithmic release curve for explosive pumping effects.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "To create an explosive, pumping room sound on drum overheads, set a negative ratio (e.g., -1:1.5) with a fast Attack (1 ms) and engage the 'Anti Log' release. The drums will sound wildly energetic, pumping rhythmically with the groove.",
      "Use the on-board 'Auto Fast' feature on acoustic guitars. This lets you set a slow attack time (around 30 ms) to keep the pick-strikes woody and dynamic, while ensuring sudden loud strums don't overload the digital headroom."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad thermionic culture vulture distortion",
    "displayName": "UAD Thermionic Culture Vulture Distortion",
    "category": "Tape & Saturation",
    "description": "The Thermionic Culture Vulture is an authentic emulation of the highly prized, dual-channel all-valve distortion/saturation processor. Famous for injecting glorious vintage tube character, from subtle warming second harmonics to extreme triode/pentode square-wave clipping, it excels on acoustic drums, electronic loops, aggressive bass lines, and master busses.",
    "hardwareModel": "Thermionic Culture Vulture Dual-Channel Valve Distortion",
    "parameters": [
      {
        "name": "Drive",
        "range": "1 to 11",
        "defaultVal": "1",
        "description": "Increases preamp drive and gain to push the vacuum tubes into overdrive.",
        "type": "knob"
      },
      {
        "name": "Function",
        "range": "Triode / Pentode 1 / Pentode 2",
        "defaultVal": "Triode",
        "description": "Changes the tube operational mode and even/odd harmonic distortion curves.",
        "type": "select",
        "options": [
          "Triode",
          "Pentode 1",
          "Pentode 2"
        ]
      },
      {
        "name": "Bias",
        "range": "0.15 mA to 1.0 mA",
        "defaultVal": "0.3 mA",
        "description": "Controls the current through the valve, changing the texture from gated fizz to open crunch.",
        "type": "knob"
      },
      {
        "name": "Overdrive",
        "range": "Normal / Overdrive",
        "defaultVal": "Normal",
        "description": "Engages an aggressive front-end boost to force the unit into severe saturation.",
        "type": "switch",
        "options": [
          "Normal",
          "Overdrive"
        ]
      },
      {
        "name": "Low Pass Filter",
        "range": "Off / 6 kHz / 9 kHz",
        "defaultVal": "Off",
        "description": "A high-frequency roll-off filter to smooth out harsh top-end artifacts.",
        "type": "select",
        "options": [
          "Off",
          "6 kHz",
          "9 kHz"
        ]
      },
      {
        "name": "Output Level",
        "range": "0 to 10",
        "defaultVal": "10",
        "description": "Sets the final output level of the channel.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To glue and warm up a drum bus, select Triode ('T') mode, set Bias around 0.3mA, and gently push the Drive until the meters flicker on peaks. This adds rich second-harmonic distortion without destroying transient snap.",
      "For aggressive bass grit, switch the Function to Pentode 1 ('P1'), turn on the Overdrive switch, and back off the Bias below 0.2mA to starve the valves, introducing an asymmetric, gated fuzz tone.",
      "Use it as a parallel effect on lead vocals: set the mode to 'T' with high Drive, engage the 9 kHz Low Pass filter to tame harsh sibilance, and blend it in at 10-15% wet to add density and mid-range cut."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad tonelux tilt eq",
    "displayName": "UAD Tonelux Tilt EQ",
    "category": "Equalizers",
    "description": "Designed in partnership with Tonelux, the Tilt EQ is a highly intuitive, one-knob equalizer that pivots around a central frequency (600 Hz). Sweeping it clockwise boosts highs while carving out lows for instant brightness; sweeping counter-clockwise boosts lows while cutting highs for instant warmth, maintaining phase-coherent, natural-sounding results.",
    "hardwareModel": "Tonelux Tilt Equalizer Module",
    "parameters": [
      {
        "name": "Tilt Control",
        "range": "-10 to +10 (Warm to Loud)",
        "defaultVal": "0",
        "description": "Adjusts high/low pivot balance centered at 600 Hz.",
        "type": "knob"
      },
      {
        "name": "High-Pass Filter",
        "range": "Off / 20 Hz to 800 Hz",
        "defaultVal": "Off",
        "description": "Attenuates low-frequency rumble with a smooth high-pass filter.",
        "type": "knob"
      },
      {
        "name": "Low-Pass Filter",
        "range": "Off / 3 kHz to 20 kHz",
        "defaultVal": "Off",
        "description": "Smooths out harsh high frequencies with a low-pass filter.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On overheads or room mics, turn the Tilt knob to +2 (Loud/Bright) to quickly clear out muddy room build-up and make the cymbal decay sparkle with a single twist.",
      "For thin acoustic guitars, turn the Tilt knob counter-clockwise to around -1.5 (Warm) to add a gentle, natural low-end bloom while smoothing out harsh pick attacks.",
      "Use the High Pass Filter alongside the Tilt control: turn Tilt to +3 for high-end sheen, but sweep the HPF to 80 Hz to ensure the sub-bass remains completely clean."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad valley people dyna-mite dynamics",
    "displayName": "UAD Valley People Dyna-mite Dynamics",
    "category": "Dynamics",
    "description": "The Valley People Dyna-mite is a legendary, ultra-versatile dynamics processor from the 1980s. Known for its notoriously aggressive character, it can act as an extreme peak limiter, a brickwall gate, an expander, or a key-input ducker. It is highly prized for its unique, lightning-fast 'propellant' detector circuitry that turns drums into explosive, punchy masterpieces.",
    "hardwareModel": "Valley People Dyna-mite Gate/Limiter",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the operating threshold level for the gate or limiter.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "50 ms to 5 s",
        "defaultVal": "200 ms",
        "description": "Controls gain recovery timing.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Gate / Exp / Limit",
        "defaultVal": "Limit",
        "description": "Selects active dynamic processing configuration mode.",
        "type": "select",
        "options": [
          "Gate",
          "Exp",
          "Limit"
        ]
      },
      {
        "name": "Detector",
        "range": "Peak / Avg",
        "defaultVal": "Peak",
        "description": "Toggles between instantaneous Peak detection and Average detection modes.",
        "type": "switch",
        "options": [
          "Peak",
          "Avg"
        ]
      },
      {
        "name": "Release Mode",
        "range": "Fast / Slow",
        "defaultVal": "Fast",
        "description": "Toggles between basic fast recovery envelope and slower program-dependent auto-release.",
        "type": "switch",
        "options": [
          "Fast",
          "Slow"
        ]
      },
      {
        "name": "Range",
        "range": "0 dB to 60 dB",
        "defaultVal": "60 dB",
        "description": "Limits the maximum amount of gain reduction applied to the signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To create explosive room mics, set the Mode to 'Limit', Detector to 'Peak', and release to 'Fast'. Turn the threshold down until you achieve 15-20dB of gain reduction to smash the transients and bring out massive room bloom.",
      "Use it as a gate on snare or tom drums: set Mode to 'Gate' and adjust Threshold so only the direct hits pass. The Dyna-mite's lightning-fast release envelope cuts bleed with a musical, vintage punch.",
      "For clean vocals that sit perfectly in a dense mix, set to 'Limit' mode with 'Avg' detection. This produces a smoother, level-leveling characteristic that tames volume swings without sounding overtly squashed."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad neve 1073 preamp and eq collection",
    "displayName": "UAD Neve 1073 Preamp and EQ Collection",
    "category": "Preamps & Microphones",
    "description": "The Neve 1073 Preamp & EQ Collection is the definitive emulation of Rupert Neve's legendary class-A transistor mic/line preamp and EQ. It offers rich, warm, and authoritative console saturation alongside its highly musical 3-band EQ, featuring the famous fixed high-frequency shelf, semi-parametric mid-band, and low-cut filter.",
    "hardwareModel": "Neve 1073 Channel Amplifier",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "-20 dB to +80 dB",
        "defaultVal": "0 dB",
        "description": "Controls the class-A transistor input stage gain, adding rich harmonic saturation at higher settings.",
        "type": "knob"
      },
      {
        "name": "High Shelf Gain",
        "range": "-16 dB to +16 dB",
        "defaultVal": "0 dB",
        "description": "Controls the fixed 12 kHz high-shelving equalizer band boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Frequency",
        "range": "Off / 360 Hz / 700 Hz / 1.6 kHz / 3.2 kHz / 4.8 kHz / 7.2 kHz",
        "defaultVal": "Off",
        "description": "Selects the active frequency band for the peaking mid EQ.",
        "type": "select",
        "options": [
          "Off",
          "360 Hz",
          "700 Hz",
          "1.6 kHz",
          "3.2 kHz",
          "4.8 kHz",
          "7.2 kHz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls the mid-frequency band boost or cut.",
        "type": "knob"
      },
      {
        "name": "Low Frequency",
        "range": "Off / 35 Hz / 60 Hz / 110 Hz / 220 Hz",
        "defaultVal": "Off",
        "description": "Selects the active shelving frequency for the low EQ band.",
        "type": "select",
        "options": [
          "Off",
          "35 Hz",
          "60 Hz",
          "110 Hz",
          "220 Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-16 dB to +16 dB",
        "defaultVal": "0 dB",
        "description": "Controls the low-frequency band shelving boost or cut.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 50 Hz / 80 Hz / 160 Hz / 300 Hz",
        "defaultVal": "Off",
        "description": "Selects the high-pass passive filter cutoff frequency.",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "80 Hz",
          "160 Hz",
          "300 Hz"
        ]
      }
    ],
    "proTips": [
      "Engage Unison mode on your Apollo interface to match the exact physical 1073 input impedance. Crank the Red Gain knob past 50 dB and back off the output fader to introduce rich class-A harmonic saturation to vocals and bass.",
      "The fixed 12 kHz High Shelf is legendary. Boost it by +2 to +4 dB on acoustic guitars or lead vocals to introduce a silky, expensive 'air' that never sounds harsh or sibilant.",
      "Use the High Pass Filter at 80 Hz combined with a slight boost at 110 Hz on your low shelf. This classic 'push-pull' trick tightens low-end mud while emphasizing the solid punch of kick drums and bass lines."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad chandler gav19t guitar amplifier",
    "displayName": "UAD Chandler GAV19T Guitar Amplifier",
    "category": "Guitar & Bass",
    "description": "The Chandler GAV19T is an all-tube, 19-watt guitar amplifier head inspired by legendary vintage British amp circuits from Selmer, Watkins, and Marshall. Delivering rich, responsive, and highly customizable overdrive, it features a unique tube bias selector, a versatile preamp boost section, and interactive tone controls.",
    "hardwareModel": "Chandler Limited GAV19T 19W Tube Head",
    "parameters": [
      {
        "name": "Drive Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives input preamp valves into thick organic compression and overdrive.",
        "type": "knob"
      },
      {
        "name": "Bias Mode",
        "range": "Normal / Slick / Raw",
        "defaultVal": "Normal",
        "description": "Adjusts tube bias voltage to alter tone saturation characteristics.",
        "type": "select",
        "options": [
          "Normal",
          "Slick",
          "Raw"
        ]
      },
      {
        "name": "Boost",
        "range": "Off / Treble / Mid / Bass / Full",
        "defaultVal": "Off",
        "description": "Selects high-gain preamp boost voicing mode.",
        "type": "select",
        "options": [
          "Off",
          "Treble",
          "Mid",
          "Bass",
          "Full"
        ]
      },
      {
        "name": "Bass EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls low-frequency body of the cabinet.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls pick articulation bite.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set the Bias control to 'Raw' to starvation-bias the tubes, creating an aggressive, fuzzy, classic-rock style clipping that sounds incredible on stoner rock and garage rock riffs.",
      "Use the 'Boost' selector in 'Treble' mode to add immediate bite and clarity to muddy humbucker pickups, allowing lead lines to stand out in a dense mix without excessive EQing.",
      "For sweet, dynamic blues-crunch, keep the Bias on 'Slick', set Drive around 4, and use your guitar's volume pot to clean up the signal back to glass-like tones."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_refinement",
    "displayName": "UAD bx_refinement",
    "category": "Dynamics",
    "description": "The Brainworx bx_refinement is a highly effective, specialized mastering/mixing processor designed to remove harshness, sibilance, and digital grit from recordings without sacrificing clarity. Using dynamic band-rejection technology and analog tube emulation, it smooths out aggressive high-mids and treble in complex stereo material.",
    "hardwareModel": "Brainworx bx_refinement",
    "parameters": [
      {
        "name": "Damp",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Adjusts the depth of sibilance/harshness removal dynamic processing.",
        "type": "knob"
      },
      {
        "name": "Solo Damp",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Isolates the dynamic damping control band to hear exactly what harshness is being removed.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Saturation",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Injects vintage analog-style harmonic tube saturation to restore body and presence.",
        "type": "knob"
      },
      {
        "name": "Dynamic",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Controls the responsiveness of the damping band relative to signal transient spikes.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "-100% to +100%",
        "defaultVal": "0%",
        "description": "Boosts or cuts high-frequency content to bring back breath and clarity without reintroducing harshness.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On modern, overly-bright female vocals, adjust the Damp control until the harsh 'essing' sounds natural, and set Dynamics to around 60% to dynamically pull down high-frequency sibilance only when it peaks.",
      "To sweeten a mastering bus that suffers from digital fatigue, dial in 20% Damp, and boost the Presence control slightly (+10% to +20%) to bring back pleasant, soft high-end air.",
      "Turn on 'Solo Damp' to isolate and monitor exactly what frequencies the plugin is pulling out, allowing you to fine-tune the Damp frequency focus with surgical precision."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_saturator v2",
    "displayName": "UAD bx_saturator V2",
    "category": "Tape & Saturation",
    "description": "The Brainworx bx_saturator V2 is a powerful multi-band, Mid/Side saturation processor designed to increase perceived loudness, add warmth, and control transients. Featuring independent Mid and Side processing channels across adjustable crossover bands, it allows you to saturate specific frequencies and stereo planes with analog-style harmonic drive.",
    "hardwareModel": "Brainworx bx_saturator V2",
    "parameters": [
      {
        "name": "Mid Drive",
        "range": "0 to 60 dB",
        "defaultVal": "0 dB",
        "description": "Sets the saturation drive level for the Mid channel.",
        "type": "knob"
      },
      {
        "name": "Side Drive",
        "range": "0 to 60 dB",
        "defaultVal": "0 dB",
        "description": "Sets the saturation drive level for the Side channel.",
        "type": "knob"
      },
      {
        "name": "Crossover Frequency",
        "range": "10 Hz to 22 kHz",
        "defaultVal": "220 Hz",
        "description": "Sets the high/low frequency split boundary for multi-band processing.",
        "type": "knob"
      },
      {
        "name": "Saturator Gain",
        "range": "-12 to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts output level of saturated signals.",
        "type": "knob"
      },
      {
        "name": "M/S Solo",
        "range": "Stereo / Mid / Side",
        "defaultVal": "Stereo",
        "description": "Isolates the Mid or Side signal channel paths for easy auditing.",
        "type": "select",
        "options": [
          "Stereo",
          "Mid",
          "Side"
        ]
      }
    ],
    "proTips": [
      "To make acoustic guitars sound incredibly wide and airy without muddying the center image, set the Crossover to 300 Hz, isolate the Side High band, and push the Side Drive to 15-20% saturation.",
      "On mastering sessions, use a crossover around 150 Hz. Keep the Low bands clean to retain sub-bass headroom, while applying a gentle 3-5% saturation to the Mid High band to glue the mid-range instruments together.",
      "Engage the Solo switches to hear exactly what harmonic distortion you are introducing to the Mid and Side channels separately, ensuring you aren't adding digital clipping or over-compressing transient signals."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ua 610-a tube preamp and eq",
    "displayName": "UAD UA 610-A Tube Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "The UA 610-A tube preamplifier and EQ module is a faithful emulation of Bill Putnam Sr.'s iconic console design that tracked classic artists like Frank Sinatra, Ray Charles, and Neil Young. It delivers lush, saturated tube warmth, rich low-end bloom, and smooth vintage shelving EQ.",
    "hardwareModel": "Universal Audio 610-A Modular Amplifier",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Controls tube input stage saturation.",
        "type": "knob"
      },
      {
        "name": "Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Attenuates output volume of the preamp.",
        "type": "knob"
      },
      {
        "name": "High Shelf Freq",
        "range": "4.5 kHz / 10 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects the High shelving frequency.",
        "type": "switch",
        "options": [
          "4.5 kHz",
          "10 kHz"
        ]
      },
      {
        "name": "High Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Controls High EQ shelf amplification or attenuation.",
        "type": "knob"
      },
      {
        "name": "Low Shelf Freq",
        "range": "50 Hz / 100 Hz",
        "defaultVal": "100 Hz",
        "description": "Selects the Low shelving frequency.",
        "type": "switch",
        "options": [
          "50 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Controls Low EQ shelf amplification or attenuation.",
        "type": "knob"
      },
      {
        "name": "Impedance",
        "range": "500 ohms / 2.0k ohms",
        "defaultVal": "2.0k ohms",
        "description": "Selects input impedance; lower values create a darker and softer transient sound profile.",
        "type": "switch",
        "options": [
          "500 ohms",
          "2.0k ohms"
        ]
      }
    ],
    "proTips": [
      "Insert the 610-A on your lead vocal channel in Unison mode. Toggle the Impedance to 500 ohms to slightly darken and damp harsh transients on modern condenser mics, giving them a retro, ribbon-like character.",
      "To achieve a fat, vintage bass tone, boost the Low Shelf Gain to +3 dB at 50 Hz, and push the input Gain knob to +5 dB to compress the signals naturally through the virtual vacuum tubes.",
      "Use the 4.5 kHz High Shelf to add vintage presence and bite to electric guitars, while simultaneously cutting the Low Shelf at 100 Hz to prevent interference with the bass guitar."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ua 610-b tube preamp and eq",
    "displayName": "UAD UA 610-B Tube Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "The UA 610-B Tube Preamp & EQ is a modern recreation of Putnam's legendary 610 tube console channel. It offers rich vacuum tube flavor, sweet high/low shelving filters, and variable impedance controls, making it an essential tool for injecting analog warmth and harmonically rich overdrive into any source.",
    "hardwareModel": "Universal Audio 610-B Tube Preamp & EQ",
    "parameters": [
      {
        "name": "Gain",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Controls preamp input stage saturation in 5 dB steps.",
        "type": "knob"
      },
      {
        "name": "Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Provides final output leveling gain stage control.",
        "type": "knob"
      },
      {
        "name": "Impedance",
        "range": "500 ohms / 2.0k ohms / Hi-Z",
        "defaultVal": "2.0k ohms",
        "description": "Adjusts mic/instrument input impedance parameters.",
        "type": "select",
        "options": [
          "500 ohms",
          "2.0k ohms",
          "Hi-Z"
        ]
      },
      {
        "name": "High Shelf Freq",
        "range": "4.5 kHz / 10 kHz",
        "defaultVal": "10 kHz",
        "description": "Switches high EQ shelving frequency focus.",
        "type": "switch",
        "options": [
          "4.5 kHz",
          "10 kHz"
        ]
      },
      {
        "name": "High Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts high shelving band amplification.",
        "type": "knob"
      },
      {
        "name": "Low Shelf Freq",
        "range": "70 Hz / 100 Hz",
        "defaultVal": "100 Hz",
        "description": "Switches low EQ shelving frequency focus.",
        "type": "switch",
        "options": [
          "70 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low shelving band amplification.",
        "type": "knob"
      }
    ],
    "proTips": [
      "When tracking active bass guitar, use the Hi-Z input setting in Unison mode, set Low Shelf to 70 Hz, and boost +1.5 dB. It adds a thick, tube-compressed bottom-end weight that instantly glues the bass to the drums.",
      "For clean but warm vocals, set the Gain to -5 dB to keep the preamp in its linear zone, and push the Level to 8. This utilizes the clean output headroom while retaining just enough classic vacuum tube color.",
      "To dirty up a snare drum or keyboard loop, reverse the approach: crank the Gain knob to +10 dB, set the Level down to 3, and enjoy a rich, fuzzy tube saturation that cuts through any mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad dangerous bax eq collection",
    "displayName": "UAD Dangerous BAX EQ Collection",
    "category": "Equalizers",
    "description": "The Dangerous Music BAX EQ is a premium, high-fidelity mastering and bus equalizer based on Peter Baxandall's legendary 1950s shelving designs. Delivering ultra-transparent, sweet, and wide shelving curves, it reshapes the frequency extremes of entire stereo mixes or sub-groups without causing phase distortion or color shifts.",
    "hardwareModel": "Dangerous Music BAX EQ Master Edition",
    "parameters": [
      {
        "name": "Low Cut Filter",
        "range": "Out / 12 Hz / 18 Hz / 24 Hz / 30 Hz / 36 Hz / 43 Hz / 54 Hz",
        "defaultVal": "Out",
        "description": "Surgical high-pass filter with extremely musical curves.",
        "type": "select",
        "options": [
          "Out",
          "12 Hz",
          "18 Hz",
          "24 Hz",
          "30 Hz",
          "36 Hz",
          "43 Hz",
          "54 Hz"
        ]
      },
      {
        "name": "Low EQ Frequency",
        "range": "74 Hz / 84 Hz / 98 Hz / 116 Hz / 138 Hz / 166 Hz / 230 Hz",
        "defaultVal": "84 Hz",
        "description": "Selects the center frequency for the low shelving EQ band.",
        "type": "select",
        "options": [
          "74 Hz",
          "84 Hz",
          "98 Hz",
          "116 Hz",
          "138 Hz",
          "166 Hz",
          "230 Hz"
        ]
      },
      {
        "name": "Low EQ Boost/Cut",
        "range": "-5.0 dB to +5.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Adjusts Low EQ boost or cut in stepped 0.5 dB mastering divisions.",
        "type": "knob"
      },
      {
        "name": "High EQ Frequency",
        "range": "1.6 kHz / 1.8 kHz / 2.0 kHz / 2.2 kHz / 2.5 kHz / 7.1 kHz / 18 kHz",
        "defaultVal": "7.1 kHz",
        "description": "Selects the center frequency for the high shelving EQ band.",
        "type": "select",
        "options": [
          "1.6 kHz",
          "1.8 kHz",
          "2.0 kHz",
          "2.2 kHz",
          "2.5 kHz",
          "7.1 kHz",
          "18 kHz"
        ]
      },
      {
        "name": "High EQ Boost/Cut",
        "range": "-5.0 dB to +5.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Adjusts High EQ boost or cut in stepped 0.5 dB mastering divisions.",
        "type": "knob"
      },
      {
        "name": "High Cut Filter",
        "range": "Out / 11 kHz / 12 kHz / 18 kHz / 20 kHz / 22 kHz / 28 kHz / 70 kHz",
        "defaultVal": "Out",
        "description": "Steep low-pass filter with musically smooth roll-offs.",
        "type": "select",
        "options": [
          "Out",
          "11 kHz",
          "12 kHz",
          "18 kHz",
          "20 kHz",
          "22 kHz",
          "28 kHz",
          "70 kHz"
        ]
      }
    ],
    "proTips": [
      "Engage the Low Cut filter at 12 Hz or 18 Hz on your master fader to filter out mud and ultra-low subsonic energy. This instantly frees up crucial headroom for limiters to sound louder and cleaner.",
      "Add an expensive, shimmering 'air' to your final mix by setting the High EQ shelf to 18 kHz and boosting by +0.5 or +1.0 dB. This adds breath to lead vocals and expands the stereo field beautifully.",
      "To control harsh digital treble in overheads while retaining their brightness, boost +1.5 dB with the 7.1 kHz High EQ shelf, but pair it with a High Cut Filter set to 22 kHz to roll off extreme top-end fuzz."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad fairchild tube limiter collection",
    "displayName": "UAD Fairchild Tube Limiter Collection",
    "category": "Dynamics",
    "description": "The Fairchild Tube Limiter Collection represents the gold standard in variable-mu tube compression. Modeled from the legendary 660 (mono) and 670 (stereo) vintage hardware, it is famous for its warm, lush tube coloration, smooth feedback compression curves, and program-dependent attack/release Time Constants.",
    "hardwareModel": "Fairchild 670 / 660 Feedback Compressor/Limiter",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 to 20",
        "defaultVal": "10",
        "description": "Controls the level going into the tube processing path.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Controls the point at which dynamic limiting/compression begins.",
        "type": "knob"
      },
      {
        "name": "Time Constant",
        "range": "1 to 6",
        "defaultVal": "1",
        "description": "Selects pre-configured hardware attack/release time combinations.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / 50 Hz to 250 Hz",
        "defaultVal": "Off",
        "description": "Low frequency filter in the sidechain control loop to prevent bass frequencies from pumping the compression.",
        "type": "knob"
      },
      {
        "name": "AGC Mode",
        "range": "Left/Right / Stereo / Mid/Side",
        "defaultVal": "Stereo",
        "description": "Determines the internal sidechain and signal linking configuration.",
        "type": "select",
        "options": [
          "Left/Right",
          "Stereo",
          "Mid/Side"
        ]
      }
    ],
    "proTips": [
      "On a stereo drum bus or master fader, select Time Constant 5 or 6. These are the classic program-dependent settings with multi-stage recovery times, giving you smooth, musical glue that adapts to the song.",
      "Switch the AGC mode to Mid/Side. This lets you compress the center (kick, snare, lead vocals) separately from the sides (guitars, reverbs, overheads), allowing you to widen your mix dynamically.",
      "For vintage bass guitar tracking, use the Fairchild 660 model. Engage 2 to 3 dB of gain reduction on Time Constant 2 to add rich second-harmonic distortion and level out aggressive finger pluck transients."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad maag eq4 eq",
    "displayName": "UAD Maag EQ4 EQ",
    "category": "Equalizers",
    "description": "The Mäag Audio EQ4 is a legendary six-band equalizer famous for its incredible clarity and natural, musical top-end response. It features very broad, overlapping band filters and the world-renowned 'Air Band' high shelf, making it a favorite of leading audio engineers for adding brilliant presence and air to vocals and master busses.",
    "hardwareModel": "Mäag Audio EQ4 500-Series Equalizer",
    "parameters": [
      {
        "name": "Air Band Frequency",
        "range": "2.5 / 5 / 10 / 20 / 40 kHz",
        "defaultVal": "20 kHz",
        "description": "Selects target shelf frequency for the world-famous Air Band.",
        "type": "select",
        "options": [
          "2.5 kHz",
          "5 kHz",
          "10 kHz",
          "20 kHz",
          "40 kHz"
        ]
      },
      {
        "name": "Air Band Gain",
        "range": "0 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Boosts ultra-high-frequency air to add vocal shine or mix breath.",
        "type": "knob"
      },
      {
        "name": "Sub Gain (10 Hz)",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low-frequency sub weight at 10 Hz.",
        "type": "knob"
      },
      {
        "name": "40 Hz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low-frequency punch at 40 Hz.",
        "type": "knob"
      },
      {
        "name": "160 Hz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low-mid warmth and body at 160 Hz.",
        "type": "knob"
      },
      {
        "name": "650 Hz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts mid-range definition and throatiness at 650 Hz.",
        "type": "knob"
      },
      {
        "name": "2.5 kHz Gain",
        "range": "-4.5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts upper-mid bite and string/vocal attack at 2.5 kHz.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To make a lead vocal float on top of a dense pop or rock mix, select the 20 kHz Air Band frequency and boost +3 to +5 dB. This adds crystalline high-frequency lift without any harsh digital resonance.",
      "The 160 Hz band is the secret weapon for acoustic instruments. Boost it slightly (+1.5 dB) to add instant body and warmth, or cut it slightly (-1 dB) on sibilant vocals to eliminate chesty mud.",
      "Use the 10 Hz 'Sub' band to tighten and shape the sub-bass of electronic kicks and 808s. Because the shelving curve is exceptionally wide, it raises the deepest fundamentals cleanly."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad api vision channel strip legacy",
    "displayName": "UAD API Vision Channel Strip Legacy",
    "category": "Channel Strips",
    "description": "The API Vision Channel Strip Legacy is a precise emulation of API's flagship analog console. It combines the 212L preamp, the punchy 225L compressor/limiter, the 235L gate/expander, the highly interactive 550L four-band parametric EQ, and selectable filters to deliver legendary American punch, midrange bite, and headroom.",
    "hardwareModel": "API Vision Channel Strip Console",
    "parameters": [
      {
        "name": "212L Preamp Gain",
        "range": "0 to +65 dB",
        "defaultVal": "0 dB",
        "description": "Controls active mic preamp class-A dynamic amplification level.",
        "type": "knob"
      },
      {
        "name": "225L Comp Threshold",
        "range": "+10 to -20 dB",
        "defaultVal": "+10 dB",
        "description": "Controls threshold point for discrete feedback compressor.",
        "type": "knob"
      },
      {
        "name": "225L Comp Release",
        "range": "50 ms to 3 s",
        "defaultVal": "500 ms",
        "description": "Controls release times of dynamic gain reduction loop.",
        "type": "knob"
      },
      {
        "name": "225L Comp Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 6:1 / 10:1 / Limit",
        "defaultVal": "2:1",
        "description": "Selects dynamic processing compression slope ratios.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1",
          "10:1",
          "Limit"
        ]
      },
      {
        "name": "550L EQ High Freq",
        "range": "2 kHz to 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects active frequency for 550L EQ High band.",
        "type": "select",
        "options": [
          "2 kHz",
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "7 kHz",
          "10 kHz",
          "12.5 kHz",
          "15 kHz",
          "20 kHz"
        ]
      },
      {
        "name": "550L EQ High Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-band shelving or peaking EQ gain in 2 dB steps.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Engage the 'New' (Feed-Forward) or 'Old' (Feedback) switch on the 225L compressor. Use 'Old' for smooth, vintage-style leveling on vocals, and 'New' for hard-hitting, aggressive transient control on acoustic snare drums.",
      "The API 550L EQ is highly interactive and features proportional Q. Boost the 1.5 kHz or 3 kHz mid-range band by +2 to +4 dB on electric guitars to let them slice through a heavy rock mix with classic API grit.",
      "Use the 235L Gate in Expander ('EXP') mode for a highly musical, smooth drum gate. Set the threshold just below the head hits to cleanly attenuate background cymbal bleed without introducing harsh gating artifacts."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad engl 646 vs guitar amplifier",
    "displayName": "UAD ENGL 646 VS Guitar Amplifier",
    "category": "Guitar & Bass",
    "description": "The ENGL E646 Victor Smolski Signature Edition guitar amplifier is a modern high-gain masterpiece. Powered by 6L6 tubes, this four-channel beast is meticulously engineered to provide blistering metal distortion, tight lightning-fast bass response, and immense note-to-note articulation for technical drop-tuned metal riffs.",
    "hardwareModel": "ENGL E646 Victor Smolski Master Class 100W Tube Head",
    "parameters": [
      {
        "name": "Channel Select",
        "range": "Clean / Crunch / Lead Ch3 / Lead Ch4",
        "defaultVal": "Lead Ch3",
        "description": "Selects active preamp distortion channel.",
        "type": "select",
        "options": [
          "Clean",
          "Crunch",
          "Lead Ch3",
          "Lead Ch4"
        ]
      },
      {
        "name": "Preamp Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls input stage saturation of selected channel.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts low-frequency response.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts midrange punch and vocal frequency contours.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts high-frequency pick attack bite.",
        "type": "knob"
      },
      {
        "name": "Master Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the output power-amp level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To dial in a cutting modern metal rhythm tone, use Lead Channel 3. Set the Gain around 4.5, boost the Middle knob to 6.5, and keep Bass at 4.5 to prevent the low-end from flubbing out during palm mutes.",
      "Switch to Lead Channel 4 for soaring guitar solos. Channel 4 has more compressed high-mid harmonics, allowing artificial pinch harmonics to scream and sweep picking lines to remain highly articulate.",
      "Utilize the built-in Noise Gate in the plugin cabinet window. Turn it up until the hiss from high-gain settings is completely silenced during stops, creating ultra-tight progressive metal 'djent' rhythms."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad engl 765 rt guitar amplifier",
    "displayName": "UAD ENGL 765 RT Guitar Amplifier",
    "category": "Guitar & Bass",
    "description": "The ENGL Retro Tube 100 guitar amplifier emulation delivers classic British-style organic overdrive, warm EL34 tube compression, and vintage rock crunch. Featuring two channels with independent gain controls and a bright boost switch, it ranges from sparkling blues clean tones to saturated hard-rock distortion.",
    "hardwareModel": "ENGL Retro Tube 100W Head (E765)",
    "parameters": [
      {
        "name": "Channel Select",
        "range": "Clean / Lead",
        "defaultVal": "Clean",
        "description": "Switches between clean/blues and high-gain overdrive channels.",
        "type": "switch",
        "options": [
          "Clean",
          "Lead"
        ]
      },
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Sets the preamp tube saturation level.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls cabinet low-frequency EQ response.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls midrange body and presence.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls high-frequency pick edge and bite.",
        "type": "knob"
      },
      {
        "name": "Bright",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Injects vintage top-end brilliance to clean channels.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "For classic vintage-rock rhythm guitar, select the Lead channel, turn off the Bright switch, and set Gain to 6. This unleashes a warm, dynamic mid-forward crunch that reacts beautifully to your pick attack.",
      "To get a sparkling clean tone with plenty of tube chime, select the Clean channel, engage the Bright switch, and set Gain around 3. This is perfect for funk rhythms and delicate arpeggiated chords.",
      "When using high-output humbuckers, dial the Bass control down to 4 and boost the Middle control to 7. This prevents the low-mid frequencies from masking vocal frequencies in a busy mix."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad bx_tuner",
    "displayName": "UAD bx_tuner",
    "category": "Guitar & Bass",
    "description": "A precise, fast-acting digital tuner utility designed specifically for guitar and bass players. Featuring an easy-to-read LED display, precise cent-level pitch tracking, and output muting or dimming controls, it serves as the perfect start to any instrument signal chain.",
    "hardwareModel": "Brainworx bx_tuner",
    "parameters": [
      {
        "name": "Output Mode",
        "range": "Mute / Dim / Thru",
        "defaultVal": "Mute",
        "description": "Determines the audio behavior when the tuner is active.",
        "type": "switch",
        "options": [
          "Mute",
          "Dim",
          "Thru"
        ]
      },
      {
        "name": "Reference Pitch",
        "range": "415 Hz to 466 Hz",
        "defaultVal": "440 Hz",
        "description": "Sets the base tuning calibration standard.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Insert this plugin at the very beginning of your physical signal path before any gate or overdrive pedals to ensure maximum pitch-detection sensitivity.",
      "Set the output mode to 'Mute' for silent tuning on stage or during live studio recording sessions."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad pultec passive eq collection",
    "displayName": "UAD Pultec Passive EQ Collection",
    "category": "Equalizers",
    "description": "The definitive emulation of the highly coveted, classic passive tube EQs. Modeled on vintage EQP-1A, MEQ-5, and HLF-3C units, this collection captures the musical, interlocking filter curves and rich vacuum tube output stages that add high-end silk and low-end authority to any mix.",
    "hardwareModel": "Pultec EQP-1A, MEQ-5, and HLF-3C Passive Equalizers",
    "parameters": [
      {
        "name": "Low Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Boosts low-frequency shelf.",
        "type": "knob"
      },
      {
        "name": "Low Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Attenuates low-frequency shelf.",
        "type": "knob"
      },
      {
        "name": "Low Frequency",
        "range": "20 Hz / 30 Hz / 60 Hz / 100 Hz",
        "defaultVal": "30 Hz",
        "description": "Sets low shelf cutoff frequency.",
        "type": "select",
        "options": [
          "20 Hz",
          "30 Hz",
          "60 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "High Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Boosts high-frequency peak.",
        "type": "knob"
      },
      {
        "name": "High Frequency",
        "range": "3 kHz / 4 kHz / 5 kHz / 8 kHz / 10 kHz / 12 kHz / 16 kHz",
        "defaultVal": "16 kHz",
        "description": "Sets high boost center frequency.",
        "type": "select",
        "options": [
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "8 kHz",
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ]
      },
      {
        "name": "High Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Attenuates high-frequency shelf.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Perform the iconic 'Pultec trick' on kick drums by setting Low Frequency to 60 Hz, then simultaneously boosting to 5 and cutting to 4 to tighten sub frequencies while removing low-mid mud.",
      "Use the MEQ-5 mid-range equalizer to boost lead vocals at 3 kHz (dial to 3) for clean presence that glides effortlessly above acoustic instrumentation."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad millennia nseq-2 eq",
    "displayName": "UAD Millennia NSEQ-2 EQ",
    "category": "Equalizers",
    "description": "A pristine emulation of the legendary high-end mastering EQ. It features Millennia's Twin Topology design, enabling the user to switch the entire signal path from a solid-state class-A discrete JFET circuit to a classic high-voltage triode vacuum tube stage, delivering unmatched warmth or clinical transparency.",
    "hardwareModel": "Millennia NSEQ-2 Parametric Equalizer",
    "parameters": [
      {
        "name": "Twin Topology",
        "range": "Tube / JFET",
        "defaultVal": "JFET",
        "description": "Switches signal path electronics.",
        "type": "switch",
        "options": [
          "Tube",
          "JFET"
        ]
      },
      {
        "name": "LF Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Sets low band boost/cut level.",
        "type": "knob"
      },
      {
        "name": "LMF Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Sets low-mid band boost/cut level.",
        "type": "knob"
      },
      {
        "name": "HMF Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Sets high-mid band boost/cut level.",
        "type": "knob"
      },
      {
        "name": "HF Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Sets high band boost/cut level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Choose JFET mode on stereo mixes for crisp, fast transient performance, boosting 16 kHz by 1.5 dB for ultra-clean high-end polish.",
      "Switch to vacuum tube topology to relax aggressive digital transients on acoustic recordings or overhead drum microphones."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ocean way studios room modeler",
    "displayName": "UAD Ocean Way Studios Room Modeler",
    "category": "Reverbs & Delays",
    "description": "An acoustic room modeling plugin that captures the legendary rooms and mic collections of EastWest/Ocean Way Studios. It lets you place dry tracks (drums, vocals, guitars) inside Studio A or B, choosing near, mid, and far microphone models and physical placements for deep three-dimensional space.",
    "hardwareModel": "Ocean Way Recording Studios Acoustic Environments",
    "parameters": [
      {
        "name": "Studio Select",
        "range": "Studio A / Studio B",
        "defaultVal": "Studio A",
        "description": "Toggles active studio acoustic space.",
        "type": "switch",
        "options": [
          "Studio A",
          "Studio B"
        ]
      },
      {
        "name": "Source Select",
        "range": "Drums / Vocal / Guitar / Piano / Horns / Strings",
        "defaultVal": "Drums",
        "description": "Adjusts source dispersion algorithm.",
        "type": "select",
        "options": [
          "Drums",
          "Vocal",
          "Guitar",
          "Piano",
          "Horns",
          "Strings"
        ]
      },
      {
        "name": "Distance Near",
        "range": "1 to 20 feet",
        "defaultVal": "4 feet",
        "description": "Sets near-mic virtual position distance.",
        "type": "knob"
      },
      {
        "name": "Distance Mid",
        "range": "5 to 30 feet",
        "defaultVal": "12 feet",
        "description": "Sets mid-mic virtual position distance.",
        "type": "knob"
      },
      {
        "name": "Distance Far",
        "range": "10 to 50 feet",
        "defaultVal": "25 feet",
        "description": "Sets far-mic virtual position distance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Turn dry MIDI drums into a living live kit by setting the plugin to Studio A, choosing 'Drums', and blending the compressed 'Far' room microphone pair under the direct signals.",
      "Add spatial dimension to a dry lead vocal by choosing 'Vocal' inside Studio B, setting a tube ribbon mic on the 'Mid' fader at a distance of 8 feet."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad oxford inflator",
    "displayName": "UAD Oxford Inflator",
    "category": "Dynamics",
    "description": "A legendary loudness and saturation tool that increases apparent volume and presence without altering dynamic range or clipping peaks. It adds warmth, excitement, and analog-style fullness, making individual tracks or full mixes pop.",
    "hardwareModel": "Sonnox Oxford Inflator Digital Processor",
    "parameters": [
      {
        "name": "Effect",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls loudness expansion blend.",
        "type": "knob"
      },
      {
        "name": "Curve",
        "range": "-50 to +50",
        "defaultVal": "0",
        "description": "Adjusts harmonic generation curve behavior.",
        "type": "knob"
      },
      {
        "name": "Clip 0dB",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Prevents signals from exceeding digital zero.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Input",
        "range": "-10 dB to +6 dB",
        "defaultVal": "0 dB",
        "description": "Sets drive level entering the processor.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Place on master bus with Effect at 100% and Curve at +5 for a clean volume jump and thick, cohesive midrange.",
      "Drive Bass guitars with Input at +2 dB and Clip 0dB active to color the performance with rich harmonics that make the low end audible on small consumer devices."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad spl twintube saturation",
    "displayName": "UAD SPL TwinTube Saturation",
    "category": "Tape & Saturation",
    "description": "An authentic emulation of the analog hardware processor that combines two separate tube processing stages in a single unit. It features a Saturation control for warm, musical harmonic distortion and a Harmonics control to dynamically excite presence across specific frequencies.",
    "hardwareModel": "SPL TwinTube Processor",
    "parameters": [
      {
        "name": "Saturation",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts tube saturation distortion intensity.",
        "type": "knob"
      },
      {
        "name": "Harmonics",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts harmonic high-frequency boost.",
        "type": "knob"
      },
      {
        "name": "Frequency Select",
        "range": "2 kHz / 3 kHz / 6 kHz / 10 kHz",
        "defaultVal": "2 kHz",
        "description": "Selects frequency band to process.",
        "type": "select",
        "options": [
          "2 kHz",
          "3 kHz",
          "6 kHz",
          "10 kHz"
        ]
      },
      {
        "name": "Tube ON",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages tube emulation circuitry.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "To add analog gloss to female vocals, turn on Harmonics, select 10 kHz, and bring the control up to 3 for sparkling presence.",
      "Set Saturation to 5 on bass DI tracks to add physical growl, compressing dynamic spikes naturally while filling out sub-lows."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad teletronix la-2a leveler collection",
    "displayName": "UAD Teletronix LA-2A Leveler Collection",
    "category": "Dynamics",
    "description": "The legendary optical tube compressors in a premium triple-revision bundle. It features the aggressive Silver model, the smooth and standard Gray model, and the slow, warm original 1950s LA-2, all meticulously modeled down to the T4 optical cell and tube feedback paths.",
    "hardwareModel": "Teletronix LA-2A Silver, LA-2A Gray, & LA-2 Tube Levelers",
    "parameters": [
      {
        "name": "Peak Reduction",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets compressor threshold level.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "0 to 100",
        "defaultVal": "40",
        "description": "Adjusts output level makeup volume.",
        "type": "knob"
      },
      {
        "name": "Compress / Limit",
        "range": "Compress / Limit",
        "defaultVal": "Compress",
        "description": "Toggles optical compression ratio.",
        "type": "switch",
        "options": [
          "Compress",
          "Limit"
        ]
      }
    ],
    "proTips": [
      "Select the 'Silver' model on pop vocals for fast-acting control that clamps transient peaks elegantly without sucking the air out of the performance.",
      "Utilize the 'LA-2' original tube model for acoustic backing tracks; its slow, pillowy release time provides smooth sustain that easily glues background elements."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad api 500 eq collection",
    "displayName": "UAD API 500 EQ Collection",
    "category": "Equalizers",
    "description": "The ultimate compilation of classic API EQ modules, featuring the 550A 3-band parametric EQ and the 560 10-band graphic EQ. Both models emulate the legendary proportional-Q design, narrowing filter bandwidth at higher gains for focused, high-headroom acoustic shaping.",
    "hardwareModel": "API 550A 3-Band & API 560 10-Band Equalizers",
    "parameters": [
      {
        "name": "LF Freq",
        "range": "30 Hz / 40 Hz / 50 Hz / 100 Hz / 200 Hz / 300 Hz / 400 Hz",
        "defaultVal": "100 Hz",
        "description": "Sets low band center frequency.",
        "type": "select",
        "options": [
          "30 Hz",
          "40 Hz",
          "50 Hz",
          "100 Hz",
          "200 Hz",
          "300 Hz",
          "400 Hz"
        ]
      },
      {
        "name": "LF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets low band boost or cut level.",
        "type": "select",
        "options": [
          "-12 dB",
          "-9 dB",
          "-6 dB",
          "-4 dB",
          "-2 dB",
          "0 dB",
          "+2 dB",
          "+4 dB",
          "+6 dB",
          "+9 dB",
          "+12 dB"
        ]
      },
      {
        "name": "MF Freq",
        "range": "75 Hz / 150 Hz / 180 Hz / 240 Hz / 500 Hz / 800 Hz / 1 kHz / 1.5 kHz / 3 kHz / 5 kHz",
        "defaultVal": "1.5 kHz",
        "description": "Sets mid band center frequency.",
        "type": "select",
        "options": [
          "75 Hz",
          "150 Hz",
          "180 Hz",
          "240 Hz",
          "500 Hz",
          "800 Hz",
          "1 kHz",
          "1.5 kHz",
          "3 kHz",
          "5 kHz"
        ]
      },
      {
        "name": "MF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets mid band boost or cut level.",
        "type": "select",
        "options": [
          "-12 dB",
          "-9 dB",
          "-6 dB",
          "-4 dB",
          "-2 dB",
          "0 dB",
          "+2 dB",
          "+4 dB",
          "+6 dB",
          "+9 dB",
          "+12 dB"
        ]
      },
      {
        "name": "HF Freq",
        "range": "2.5 kHz / 5 kHz / 7 kHz / 10 kHz / 12.5 kHz / 15 kHz / 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets high band center frequency.",
        "type": "select",
        "options": [
          "2.5 kHz",
          "5 kHz",
          "7 kHz",
          "10 kHz",
          "12.5 kHz",
          "15 kHz",
          "20 kHz"
        ]
      },
      {
        "name": "HF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets high band boost or cut level.",
        "type": "select",
        "options": [
          "-12 dB",
          "-9 dB",
          "-6 dB",
          "-4 dB",
          "-2 dB",
          "0 dB",
          "+2 dB",
          "+4 dB",
          "+6 dB",
          "+9 dB",
          "+12 dB"
        ]
      }
    ],
    "proTips": [
      "Utilize the proportional-Q design on snare drums with the 550A; dial +4 dB at 5 kHz to add attack without introducing broad harshness.",
      "Use the 560 10-band graphic EQ on electric guitars; scoop 2 dB at 500 Hz to let vocals breathe, then boost +3 dB at 1.5 kHz for maximum focus."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad softube vintage amp room",
    "displayName": "UAD Softube Vintage Amp Room",
    "category": "Guitar & Bass",
    "description": "A classic guitar recording suite simulating three of the most influential tube guitar amps in history: the Marshall JCM800, the Fender Twin Reverb, and the Vox AC30. It features physical speaker cabinet modeling and continuous virtual microphone movement in a realistic room.",
    "hardwareModel": "Marshall JCM800, Fender Twin, & Vox AC30 Guitar Amplifiers",
    "parameters": [
      {
        "name": "Amp Selection",
        "range": "White (Marshall) / Brown (Fender) / Green (Vox)",
        "defaultVal": "Brown (Fender)",
        "description": "Selects the active amplifier model to emulate.",
        "type": "select",
        "options": [
          "White (Marshall)",
          "Brown (Fender)",
          "Green (Vox)"
        ]
      },
      {
        "name": "Volume / Gain",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Controls tube input gain levels.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls low frequency tone.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls high frequency tone.",
        "type": "knob"
      },
      {
        "name": "Mic Distance",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Adjusts virtual microphone physical distance.",
        "type": "slider"
      }
    ],
    "proTips": [
      "Set selection to 'Green' for Vox AC30 tone, turning the Volume to 6 and moving the microphone closer to the edge for thick, jangly rhythm guitar.",
      "Choose the 'Brown' Fender Twin model with Bass at 4 and Treble at 7, then back the mic away to 50% to capture realistic wooden room ambiance."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad softube metal amp room",
    "displayName": "UAD Softube Metal Amp Room",
    "category": "Guitar & Bass",
    "description": "Designed specifically for heavy metal and hard rock tracking, this plugin delivers raw, high-gain tube distortion modeled after a custom modified Marshall JCM800 head. It includes two speaker cabinet options and a dual-microphone placement engine.",
    "hardwareModel": "Marshall JCM800 High-Gain Modified Amplifier",
    "parameters": [
      {
        "name": "Preamp Gain",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Determines the level of high-gain tube preamp saturation.",
        "type": "knob"
      },
      {
        "name": "Master Volume",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Sets power amp output and speaker compression.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts low end resonance.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts midrange scoop.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls bite and edge.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets ultra-high harmonic air focus.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For clean but tight palm mutes, dial the Preamp Gain to 7, scoop the Middle to 3, and sweep the microphone close to the center cone.",
      "Blend the dual cabinets 50/50 to pair the direct transient impact of the modern cab with the rich mids of the vintage enclosure."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad softube bass amp room",
    "displayName": "UAD Softube Bass Amp Room",
    "category": "Guitar & Bass",
    "description": "A comprehensive bass recording plugin that models the clean power and rich crunch of the Hiwatt DR103 tube head. It provides a dry studio DI blend control, three selectable speaker cabinets, and flexible microphone positioning for ultimate low-end control.",
    "hardwareModel": "Hiwatt DR103 Custom 100 Amplifier & Classic Bass Cabinets",
    "parameters": [
      {
        "name": "DI Blend",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Fades between the direct clean DI signal and the mic'd speaker cabinet.",
        "type": "knob"
      },
      {
        "name": "Cabinet Selection",
        "range": "8x10 (Classic) / 4x10 (Modern) / 1x15 (Deep)",
        "defaultVal": "8x10 (Classic)",
        "description": "Selects physical speaker dimensions.",
        "type": "select",
        "options": [
          "8x10 (Classic)",
          "4x10 (Modern)",
          "1x15 (Deep)"
        ]
      },
      {
        "name": "Amp Drive",
        "range": "0 to 10",
        "defaultVal": "4",
        "description": "Controls tube gain and preamp grit.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls high-headroom low band tone.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls high band string articulation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For standard rock bass tracks, set DI Blend to 40% and push Amp Drive to 6. This layers focused, clean DI low frequencies with aggressive mid-range tube drive.",
      "Select the '1x15 Deep' cabinet for smooth dub, hip-hop, or soul bass lines, keeping Bass EQ at 6 while rolling Treble EQ down to 3."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad precision k-stereo ambience recovery",
    "displayName": "UAD Precision K-Stereo Ambience Recovery",
    "category": "Reverbs & Delays",
    "description": "Co-designed with mastering guru Bob Katz, this specialized processing utility uses patented M-S and psychoacoustic algorithms to recover the natural ambient depth and stereo width of a mix without altering its frequency balance.",
    "hardwareModel": "Bob Katz K-Stereo Ambience Recovery Processor",
    "parameters": [
      {
        "name": "Ambience Level",
        "range": "-24 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls recovered depth volume.",
        "type": "knob"
      },
      {
        "name": "Stereo Width",
        "range": "0% to 200%",
        "defaultVal": "100%",
        "description": "Controls psychoacoustic stereo expansion.",
        "type": "knob"
      },
      {
        "name": "Deep / Wide Mode",
        "range": "Deep / Wide",
        "defaultVal": "Deep",
        "description": "Switches between two room processing algorithms.",
        "type": "switch",
        "options": [
          "Deep",
          "Wide"
        ]
      },
      {
        "name": "Ambience Filter",
        "range": "Off / 50 Hz / 150 Hz / 300 Hz",
        "defaultVal": "Off",
        "description": "Rolls off low end from width processor.",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "150 Hz",
          "300 Hz"
        ]
      }
    ],
    "proTips": [
      "On stereo masters, set Ambience Level to +1.5 dB and Width to 110% to add subtle, organic space to a dry, sterile acoustic mix.",
      "Set the Ambience Filter to '300 Hz' to prevent the kick drum and bass fundamentals from getting widened, keeping your center solid."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad shadow hills mastering compressor",
    "displayName": "UAD Shadow Hills Mastering Compressor",
    "category": "Dynamics",
    "description": "An authoritative emulation of the elite mastering powerhouse. It delivers two-stage compression—an optical leveling circuit in series with a discrete VCA compressor—before running through selectable Nickel, Iron, or Steel output transformers.",
    "hardwareModel": "Shadow Hills Mastering Compressor",
    "parameters": [
      {
        "name": "Optical Threshold",
        "range": "-20 to +20",
        "defaultVal": "0",
        "description": "Controls opto-attenuator compression.",
        "type": "knob"
      },
      {
        "name": "VCA Threshold",
        "range": "-20 to +20",
        "defaultVal": "0",
        "description": "Controls discrete VCA compression.",
        "type": "knob"
      },
      {
        "name": "VCA Ratio",
        "range": "1.2:1 / 2:1 / 3:1 / 4:1 / 6:1 / 10:1 / Flood",
        "defaultVal": "2:1",
        "description": "Selects secondary compressor slope.",
        "type": "select",
        "options": [
          "1.2:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1",
          "10:1",
          "Flood"
        ]
      },
      {
        "name": "Transformer Select",
        "range": "Nickel / Iron / Steel",
        "defaultVal": "Nickel",
        "description": "Switches output analog transformer behavior.",
        "type": "select",
        "options": [
          "Nickel",
          "Iron",
          "Steel"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / 90 Hz / 150 Hz / 250 Hz",
        "defaultVal": "Off",
        "description": "Applies HPF to internal detection paths.",
        "type": "select",
        "options": [
          "Off",
          "90 Hz",
          "150 Hz",
          "250 Hz"
        ]
      }
    ],
    "proTips": [
      "Select the 'Nickel' transformer for acoustic or classical tracks to introduce high-end sweetening, catching just 1 dB of gain reduction on both compressor stages.",
      "For heavy rock drums, switch to the 'Steel' transformer to punch up the low-mids, setting the VCA compressor to a 3:1 ratio with the 150 Hz sidechain filter engaged."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad oxford eq",
    "displayName": "UAD Oxford EQ",
    "category": "Equalizers",
    "description": "A surgical digital equalizer modeled after the high-end Sony OXF-R3 digital console. It offers five fully parametric bands with four distinct EQ curve types, making it equally powerful for clinical narrow cuts and broad, musical shelving shapes.",
    "hardwareModel": "Sonnox Oxford 5-Band Parametric EQ",
    "parameters": [
      {
        "name": "EQ Curve Type",
        "range": "Type 1 / Type 2 / Type 3 / Type 4",
        "defaultVal": "Type 1",
        "description": "Selects filter slope math algorithm.",
        "type": "switch",
        "options": [
          "Type 1",
          "Type 2",
          "Type 3",
          "Type 4"
        ]
      },
      {
        "name": "LF Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets low shelf/bell boost and cut.",
        "type": "knob"
      },
      {
        "name": "LMF Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets low-mid band boost and cut.",
        "type": "knob"
      },
      {
        "name": "HMF Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets high-mid band boost and cut.",
        "type": "knob"
      },
      {
        "name": "HF Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets high shelf/bell boost and cut.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 'Type 1' for surgical corrections; configure a narrow Q to notch out ringing mud at 250 Hz on vocals without disturbing surrounding frequencies.",
      "Choose 'Type 3' on your master bus, boosting the HF shelf by +1.5 dB at 12 kHz to introduce a luxurious console airiness."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad ua 1176 limiter collection",
    "displayName": "UAD UA 1176 Limiter Collection",
    "category": "Dynamics",
    "description": "The absolute standard in fast-acting FET limiting. This collection features the Bluestripe, Blackface, and highly efficient SE models, capturing their legendary lightning-fast attack, distortion-inducing program-dependent release, and the historic All-Button ratio mode.",
    "hardwareModel": "Universal Audio 1176LN, 1176SE, & Bluestripe FET Limiters",
    "parameters": [
      {
        "name": "Input",
        "range": "-infinity to 0 dB",
        "defaultVal": "-20 dB",
        "description": "Drives level into the gain-reduction circuit.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-infinity to 0 dB",
        "defaultVal": "-20 dB",
        "description": "Sets output makeup gain.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "20 microseconds to 800 microseconds",
        "defaultVal": "400 microseconds",
        "description": "Determines compression response rate.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "50 milliseconds to 1100 milliseconds",
        "defaultVal": "500 milliseconds",
        "description": "Determines compressor recovery rate.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "4:1 / 8:1 / 12:1 / 20:1 / All-Button",
        "defaultVal": "4:1",
        "description": "Sets the compression slope.",
        "type": "select",
        "options": [
          "4:1",
          "8:1",
          "12:1",
          "20:1",
          "All-Button"
        ]
      }
    ],
    "proTips": [
      "For parallel drum smashing, use the Bluestripe revision in 'All-Button' ratio, setting Attack to 3 and Release to 7 for explosive room decays.",
      "For pop vocals, use the Blackface Rev E. Set the Attack to 3 to let vocal consonants bite through before the FET clamping begins."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad mxr flanger-doubler",
    "displayName": "UAD MXR Flanger-Doubler",
    "category": "Reverbs & Delays",
    "description": "A meticulous emulation of the late-1970s bucket-brigade device (BBD) delay processor. Highly sought-after for its distinctive analog grit, it provides legendary pitch-bending flanging, warm chorusing, and short doubling delay effects with organic modulation characteristics.",
    "hardwareModel": "MXR Flanger/Doubler (Model 126)",
    "parameters": [
      {
        "name": "Manual",
        "range": "0.05ms to 50ms",
        "defaultVal": "0.2ms",
        "description": "Manually adjusts the delay time when LFO modulation is inactive or combined.",
        "type": "knob"
      },
      {
        "name": "Width",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Controls the sweep range of the LFO delay modulation.",
        "type": "knob"
      },
      {
        "name": "Speed",
        "range": "0.1 Hz to 10 Hz",
        "defaultVal": "0.5 Hz",
        "description": "Sets the rate of the LFO sweep generator.",
        "type": "knob"
      },
      {
        "name": "Regen",
        "range": "-100% to +100%",
        "defaultVal": "0%",
        "description": "Feeds back the wet delay signal into the input, introducing hollow comb-filter effects.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Flanger / Doubler",
        "defaultVal": "Flanger",
        "description": "Selects the delay range: Flanger (0.1ms to 5ms) or Doubler (17ms to 53ms).",
        "type": "switch",
        "options": [
          "Flanger",
          "Doubler"
        ]
      }
    ],
    "proTips": [
      "To create a classic 1970s double-tracking effect on rock vocals, switch the Mode to Doubler, set Width to 0%, and adjust Manual to around 30ms to split the stereo field without pitch wobble.",
      "For a rich, swooshing jet-plane flanger on drums, select Flanger mode, set Regen to 80%, dial the Speed to 0.2 Hz, and push Width to 90%."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad little labs vog bass enhancer",
    "displayName": "UAD Little Labs VOG Bass Enhancer",
    "category": "Equalizers",
    "description": "A precise physical emulation of the 'Voice of God' resonant high-pass filter. Highly acclaimed for its ability to isolate and sweep low frequencies, it adds massive, clean, and tight low-end weight while rolling off sub-bass mud to protect headrooms.",
    "hardwareModel": "Little Labs VOG (Voice of God)",
    "parameters": [
      {
        "name": "Frequency",
        "range": "20 Hz to 300 Hz",
        "defaultVal": "60 Hz",
        "description": "Sweeps the resonant peak filter to focus the low-end boost.",
        "type": "knob"
      },
      {
        "name": "Amplitude",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the height and intensity of the resonant bass peak boost.",
        "type": "knob"
      },
      {
        "name": "Frequency Range",
        "range": "Low / High",
        "defaultVal": "Low",
        "description": "Sets the operating spectrum, shifting the frequency sweep window.",
        "type": "switch",
        "options": [
          "Low",
          "High"
        ]
      },
      {
        "name": "Effect Bypass",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Enables or bypasses the active resonance filter circuitry.",
        "type": "switch",
        "options": [
          "In",
          "Out"
        ]
      }
    ],
    "proTips": [
      "On thin bass drums, set Frequency Range to Low, sweep the Frequency knob to around 55 Hz, and raise the Amplitude to 7. This creates chest-thumping sub-bass while rolling off subsonic mud below 40 Hz.",
      "For voiceover or vocals that need an authoritative proximity-effect, switch the Range to High, place the Frequency around 110 Hz, and gently boost Amplitude to make the voice pop without muddying low-mids."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ampex atr-102 tape recorder",
    "displayName": "UAD Ampex ATR-102 Tape Recorder",
    "category": "Tape & Saturation",
    "description": "The definitive mastering-grade 2-track tape machine emulation. Revered for its ability to impart legendary cohesion, musical high-frequency saturation, and low-end 'head bump' glue to entire mixes and stereo buses.",
    "hardwareModel": "Ampex ATR-102 2-Track Tape Recorder",
    "parameters": [
      {
        "name": "Tape Speed",
        "range": "3.75 IPS / 7.5 IPS / 15 IPS / 30 IPS",
        "defaultVal": "15 IPS",
        "description": "Selects tape speed, significantly altering the frequency response and head bump character.",
        "type": "select",
        "options": [
          "3.75 IPS",
          "7.5 IPS",
          "15 IPS",
          "30 IPS"
        ]
      },
      {
        "name": "Tape Formula",
        "range": "GP9 / 456 / 900 / 250",
        "defaultVal": "456",
        "description": "Sets the virtual tape formulation, dictating dynamic saturation thresholds.",
        "type": "select",
        "options": [
          "GP9",
          "456",
          "900",
          "250"
        ]
      },
      {
        "name": "Record Level",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Controls the input gain driving the virtual tape heads, increasing compression and warmth.",
        "type": "knob"
      },
      {
        "name": "Bias",
        "range": "-50% to +150%",
        "defaultVal": "100%",
        "description": "Alters the high-frequency bias current, shaping high-end response and harmonic distortion.",
        "type": "knob"
      },
      {
        "name": "Tape Width",
        "range": "0.25 inch / 0.5 inch / 1 inch",
        "defaultVal": "0.5 inch",
        "description": "Adjusts the virtual tape path and tape head hardware configurations.",
        "type": "select",
        "options": [
          "0.25 inch",
          "0.5 inch",
          "1 inch"
        ]
      }
    ],
    "proTips": [
      "For classic stereo master bus processing, select 15 IPS, use 456 formulation on 0.5-inch tape, and adjust Record Level until your peaks compress by only 1 dB to 2 dB for natural glue.",
      "Use 30 IPS with GP9 tape on a 1-inch tape width configuration when mastering acoustic, classical, or jazz recordings for modern, pristine linearity with subtle organic depth."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad bx_digital v2 eq",
    "displayName": "UAD bx_digital V2 EQ",
    "category": "Equalizers",
    "description": "A powerhouse mastering EQ engineered for advanced Mid/Side (M/S) processing. It enables precise independent tone control over the stereo center (Mid) and the sides, complete with surgical band-solos and proprietary low-end mono-makers.",
    "hardwareModel": "Brainworx bx_digital V2 Mastering EQ",
    "parameters": [
      {
        "name": "Mono-maker",
        "range": "Off to 400 Hz",
        "defaultVal": "Off",
        "description": "Filters low frequency stereo content, summing all frequencies below this point to pure mono.",
        "type": "knob"
      },
      {
        "name": "Stereo Width",
        "range": "0% to 400%",
        "defaultVal": "100%",
        "description": "Controls the side channel gain relative to the mid, altering the wide stereo imaging.",
        "type": "knob"
      },
      {
        "name": "Mid High Shelf",
        "range": "-12 to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the high shelving EQ for the central Mid channel.",
        "type": "knob"
      },
      {
        "name": "Side High Shelf",
        "range": "-12 to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the high shelving EQ for the outer Side channel, controlling perceived air.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To center low-end energy on dance and electronic mixes, turn the Mono-maker to 110 Hz. This guarantees kick and bass frequencies remain phase-coherent on large sound systems.",
      "Add clean, expensive width to rock acoustic guitars by setting Stereo Width to 115% and boosting the Side High Shelf at 12 kHz by 1.5 dB."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad spl vitalizer mk2-t",
    "displayName": "UAD SPL Vitalizer MK2-T",
    "category": "Equalizers",
    "description": "A legendary psychoacoustic master equalizer designed to optimize perceived volume and clarify dense mixes. Utilizing a high-end tube stage, it integrates patented sound unmasking and low-end processing to add space, shine, and depth.",
    "hardwareModel": "SPL Tube Vitalizer MK2-T",
    "parameters": [
      {
        "name": "Sub Bass",
        "range": "Soft to Tight",
        "defaultVal": "Soft",
        "description": "Controls the low-frequency character between a warm, soft bloom and a hard punch.",
        "type": "knob"
      },
      {
        "name": "Bass Level",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Balances the level of sub-bass enhancement.",
        "type": "knob"
      },
      {
        "name": "Mid-Hi Tune",
        "range": "1 kHz to 22 kHz",
        "defaultVal": "3.5 kHz",
        "description": "Sets the crossover point for mid-to-high frequency unmasking.",
        "type": "knob"
      },
      {
        "name": "Process",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Blends the processed high-mid signal with the dry material.",
        "type": "knob"
      },
      {
        "name": "Stereo Expander",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Widens the stereo soundstage by utilizing precise phase manipulation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Inject life into flat master tracks by setting Mid-Hi Tune to 5 kHz, turning Process to 3, and raising the Stereo Expander to 4 for subtle, musical widening and air.",
      "To tighten a muddy bass synth or drum subgroup, sweep the Sub Bass parameter toward 'Tight' and boost Bass Level by 2.5 dB for high-impact transient weight."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad lexicon 224 digital reverb",
    "displayName": "UAD Lexicon 224 Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "A definitive recreation of the historic 1978 hardware unit that shaped the reverb architecture of modern pop music. It captures the complex dual-decay matrix, gritty input/output converters, and lush chorus/plate algorithms of the physical unit.",
    "hardwareModel": "Lexicon 224 Digital Reverberator",
    "parameters": [
      {
        "name": "Program",
        "range": "1 to 9",
        "defaultVal": "1 Concert",
        "description": "Selects the digital algorithm, from halls and plates to chorus and echo effects.",
        "type": "select",
        "options": [
          "1 Concert",
          "2 Hall",
          "3 Room",
          "4 Plate",
          "5 Room",
          "6 Small Plate",
          "7 Chorus",
          "8 Echo",
          "9 Inverse"
        ]
      },
      {
        "name": "Bass Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the low-frequency decay time, running independently of the mid frequencies.",
        "type": "slider"
      },
      {
        "name": "Mid Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the mid-frequency decay time, which defines the perceived size of the reverb space.",
        "type": "slider"
      },
      {
        "name": "Crossover",
        "range": "100 Hz to 10.9 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Determines the split frequency where Bass Decay meets Mid Decay control.",
        "type": "slider"
      },
      {
        "name": "Pre-Delay",
        "range": "0ms to 256ms",
        "defaultVal": "24ms",
        "description": "Adjusts the delay time before the onset of early reflections and decay tail.",
        "type": "slider"
      }
    ],
    "proTips": [
      "For a rich, blooming vocal halo, choose Program 4 (Constant Plate), set Mid Decay to 3.2s, Bass Decay to 1.2s, and push Pre-Delay to 80ms to keep consonants clear.",
      "To quickly dial in a vintage 80s gated drum room, use Program 9 (Inverse Reverb) on a parallel snare send, and pull Mid Decay down to 1.5s for instant, explosive decay cutoff."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ssl 4000 e legacy channel strip",
    "displayName": "UAD SSL 4000 E Legacy Channel Strip",
    "category": "Channel Strips",
    "description": "An authentic emulation of the classic Solid State Logic 4000 E console strip. It integrates legendary Black and Brown knob equalizer curves, dynamic VCA compression, and ultra-fast gate/expander circuits for aggressive, forward-sounding tracks.",
    "hardwareModel": "Solid State Logic 4000 E Console Channel Strip",
    "parameters": [
      {
        "name": "EQ Type",
        "range": "Black / Brown",
        "defaultVal": "Black",
        "description": "Selects between the clean, resonant Black-Knob and musical, smoother Brown-Knob EQ models.",
        "type": "switch",
        "options": [
          "Black",
          "Brown"
        ]
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to infinity",
        "defaultVal": "4:1",
        "description": "Sets the slope of the integrated VCA compressor.",
        "type": "knob"
      },
      {
        "name": "Gate/Exp Threshold",
        "range": "-40 dB to +10 dB",
        "defaultVal": "-20 dB",
        "description": "Adjusts the threshold for the expander or noise gate section.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 16 Hz to 350 Hz",
        "defaultVal": "Off",
        "description": "Engages the 18dB/octave high pass filter to sweep away sub-bass rumble.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Engage 'Black' EQ mode, and boost 8 kHz by 2.5 dB on rock overheads for the signature glassy, expensive cymbal brightness.",
      "To tighten a dynamic snare track, set the Compressor Ratio to 4:1, pull down the threshold for 5 dB of gain reduction, and use the gate section with a fast release to eliminate high-hat bleed."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ssl 4000 g legacy bus compressor",
    "displayName": "UAD SSL 4000 G Legacy Bus Compressor",
    "category": "Dynamics",
    "description": "A meticulous emulation of the legendary Solid State Logic G-Series analog center-section bus compressor. Revered as the ultimate audio 'glue' box, it provides legendary cohesive punch and dynamic energy to entire mixes.",
    "hardwareModel": "Solid State Logic G-Series Stereo Bus Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets the level at which the VCA compression circuit begins to attenuate.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 10:1",
        "defaultVal": "4:1",
        "description": "Sets the compression curve slope.",
        "type": "switch",
        "options": [
          "2:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1ms / 0.3ms / 1ms / 3ms / 10ms / 30ms",
        "defaultVal": "30ms",
        "description": "Determines how fast the compressor responds to transient peaks.",
        "type": "switch",
        "options": [
          "0.1ms",
          "0.3ms",
          "1ms",
          "3ms",
          "10ms",
          "30ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.1s / 0.3s / 0.6s / 1.2s / Auto",
        "defaultVal": "Auto",
        "description": "Controls release time, including the classic program-dependent Auto setting.",
        "type": "switch",
        "options": [
          "0.1s",
          "0.3s",
          "0.6s",
          "1.2s",
          "Auto"
        ]
      },
      {
        "name": "Makeup Gain",
        "range": "-5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Applies volume compensation after master bus gain reduction.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To glue a stereo mix bus, use a 2:1 ratio, a slow 30ms attack to protect your punchy transients, and set the release to Auto. Aim for 2-3 dB of peak gain reduction.",
      "To squash parallel drum room mics for aggressive energy, set the Ratio to 4:1, Attack to 1ms, and Release to 0.1s to pump up room reflections."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad studer a800 tape recorder",
    "displayName": "UAD Studer A800 Tape Recorder",
    "category": "Tape & Saturation",
    "description": "A world-class emulation of the multichannel 2-inch tape machine that defined recording history. This plugin delivers the authentic low-end warmth, head bump, and organic tape saturation that glues multitrack drums and thickens vocals.",
    "hardwareModel": "Studer A800 Multichannel Tape Recorder",
    "parameters": [
      {
        "name": "Tape Speed",
        "range": "7.5 IPS / 15 IPS / 30 IPS",
        "defaultVal": "15 IPS",
        "description": "Selects tape speed; 15 IPS offers the fattest low-end bump, while 30 IPS offers linear high-end clarity.",
        "type": "select",
        "options": [
          "7.5 IPS",
          "15 IPS",
          "30 IPS"
        ]
      },
      {
        "name": "Tape Formula",
        "range": "250 / 456 / 900 / GP9",
        "defaultVal": "456",
        "description": "Sets the specific magnetic formulation emulation, affecting saturation saturation levels.",
        "type": "select",
        "options": [
          "250",
          "456",
          "900",
          "GP9"
        ]
      },
      {
        "name": "Input",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Drives the tape record head input, introducing classic tape saturation.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts playback output trim to maintain proper level staging.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On acoustic drum kits, run the Studer A800 across all individual tracks at 15 IPS using the 456 tape formula. Drive the Input until you get subtle low-end compression on kicks and snares.",
      "For pristine, clean modern vocals, select 30 IPS and the GP9 tape formula. It provides a linear frequency response while rounding off sharp, sibilant vocal transients."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ep-34 tape echo",
    "displayName": "UAD EP-34 Tape Echo",
    "category": "Reverbs & Delays",
    "description": "A stellar emulation of vintage solid-state Echoplex tape delay processors. It faithfully captures the unique slide-out tape head delay adjustment, preamp-driven clipping, self-oscillation feedback loop behaviors, and warm, deteriorating repeats.",
    "hardwareModel": "Echoplex EP-3 / EP-4 Tape Delays",
    "parameters": [
      {
        "name": "Echo Delay",
        "range": "100ms to 800ms",
        "defaultVal": "350ms",
        "description": "Sets delay time by sliding the virtual playback tape head along the path.",
        "type": "slider"
      },
      {
        "name": "Echo Repeats",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Controls the feedback circuit, introducing wild self-oscillation at maximum settings.",
        "type": "knob"
      },
      {
        "name": "Echo Volume",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Balances the dry signal path against the wet, warm tape delay lines.",
        "type": "knob"
      },
      {
        "name": "Record Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the preamplifier stage, introducing rich analog solid-state saturation to the delay path.",
        "type": "knob"
      },
      {
        "name": "Bass/Treble",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Tone-sculpting control to make the delay repeats sound darker or brighter.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To produce vintage dub-style echo builds, map a MIDI controller to Echo Repeats, push it above 8 to trigger self-oscillation, then sweep the Echo Delay slider for pitch-bent effects.",
      "Turn Record Volume to 8 and lower the Output stage on lead guitar solos. This adds a sweet, saturated solid-state warmth that helps solos float effortlessly over a busy mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision enhancer hz",
    "displayName": "UAD Precision Enhancer Hz",
    "category": "Dynamics",
    "description": "A specialized UA-designed psychoacoustic sub-bass enhancement processor. It generates synthetic low-frequency harmonics, enabling sub-bass and bass lines to translate clearly on small consumer speakers and headphones without raising master peak levels.",
    "hardwareModel": "Universal Audio Precision Enhancer Hz",
    "parameters": [
      {
        "name": "Effect",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Determines the mix percentage of the generated bass harmonics.",
        "type": "knob"
      },
      {
        "name": "Frequency",
        "range": "40 Hz to 320 Hz",
        "defaultVal": "80 Hz",
        "description": "Sets the crossover detection frequency for sub-harmonic generation.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "A / B / C / D",
        "defaultVal": "A",
        "description": "Selects different harmonic profiles, shifting from subtle odd-harmonics to heavy bass saturation.",
        "type": "select",
        "options": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      {
        "name": "Effect Solo",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Bypasses dry signal to solo only the generated bass sub-harmonics.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      }
    ],
    "proTips": [
      "To make synth or acoustic bass translate perfectly on smartphone speakers, select Mode B, set Frequency to 110 Hz, and boost Effect to 20% to generate essential mid-bass harmonics.",
      "Use the 'Effect Solo' switch to audit and monitor exactly what frequencies you are exciting, ensuring you aren't adding mud to your drum and bass frequencies."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad manley massive passive eq collection",
    "displayName": "UAD Manley Massive Passive EQ Collection",
    "category": "Equalizers",
    "description": "A faithful emulation of the legendary two-channel tube passive equalizer. It models the complex interaction of the physical inductors and tube amplification stages, allowing engineers to apply heavy boosts to high-end air and low-end punch without harshness.",
    "hardwareModel": "Manley Massive Passive Stereo Tube Equalizer",
    "parameters": [
      {
        "name": "Low Shelf/Bell (Band 1)",
        "range": "Shelf / Bell",
        "defaultVal": "Shelf",
        "description": "Changes the low-frequency band structure from a shelf to a bell curve.",
        "type": "switch",
        "options": [
          "Shelf",
          "Bell"
        ]
      },
      {
        "name": "Gain (Band 1)",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the degree of cut or boost for the first passive band.",
        "type": "knob"
      },
      {
        "name": "Frequency (Band 1)",
        "range": "22 Hz to 1k Hz",
        "defaultVal": "47 Hz",
        "description": "Selects the passive inductor frequency step for the low-frequency band.",
        "type": "select",
        "options": [
          "22 Hz",
          "33 Hz",
          "47 Hz",
          "68 Hz",
          "100 Hz",
          "150 Hz",
          "220 Hz",
          "330 Hz",
          "470 Hz",
          "680 Hz",
          "1k Hz"
        ]
      },
      {
        "name": "Bandwidth (Band 1)",
        "range": "Sharp to Broad",
        "defaultVal": "Broad",
        "description": "Alters the Q factor of the low band's passive curve.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 22 / 39 / 68 / 120 / 220 Hz",
        "defaultVal": "Off",
        "description": "Engages the stepped, passive high-pass filter circuit.",
        "type": "select",
        "options": [
          "Off",
          "22 Hz",
          "39 Hz",
          "68 Hz",
          "120 Hz",
          "220 Hz"
        ]
      }
    ],
    "proTips": [
      "For a stunning, expensive-sounding vocal top-end, set Band 4 to Broad Bell at 16 kHz and boost it by 4 dB. It adds pristine 'air' without bringing out harsh sibilance.",
      "Add immense warmth to rock mixes by setting Band 1 to 47 Hz in Shelf mode with a broad bandwidth, boosting it by 2.5 dB to elevate the bass weight smoothly."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad trident a-range eq",
    "displayName": "UAD Trident A-Range EQ",
    "category": "Equalizers",
    "description": "An authentic model of the legendary console equalizer from the Trident A-Range desk. Prized for its colorful inductor-based band interaction, it adds signature presence, grit, and aggressive bite to vocals and electric guitars.",
    "hardwareModel": "Trident A-Range Console Equalizer",
    "parameters": [
      {
        "name": "Low Cut",
        "range": "Off / 25 Hz / 50 Hz / 100 Hz",
        "defaultVal": "Off",
        "description": "Engages high-pass filters; multiple buttons can be combined for steeper filtering curves.",
        "type": "select",
        "options": [
          "Off",
          "25 Hz",
          "50 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the low-frequency shelving boost or cut.",
        "type": "slider"
      },
      {
        "name": "Mid Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls the selected mid-frequency parametric boost or cut.",
        "type": "slider"
      },
      {
        "name": "Mid Frequency",
        "range": "250 to 9k Hz",
        "defaultVal": "1k Hz",
        "description": "Selects the center frequency for the mid-range band.",
        "type": "select",
        "options": [
          "250 Hz",
          "500 Hz",
          "1k Hz",
          "2k Hz",
          "3k Hz",
          "5k Hz",
          "7k Hz",
          "9k Hz"
        ]
      },
      {
        "name": "High Cut",
        "range": "Off / 9k / 12k / 15k Hz",
        "defaultVal": "Off",
        "description": "Engages low-pass filters to control top-end harshness.",
        "type": "select",
        "options": [
          "Off",
          "9k Hz",
          "12k Hz",
          "15k Hz"
        ]
      }
    ],
    "proTips": [
      "To help rock or metal electric guitars cut through a busy mix, set Mid Frequency to 3 kHz and push the gain slider up to +4 dB to engage the legendary inductor bite.",
      "Combine the 50 Hz and 100 Hz Low Cut buttons simultaneously to create a unique, sharp, resonant cut slope that cleans mud while retaining low punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad empirical labs el7 fatso compressor",
    "displayName": "UAD Empirical Labs EL7 FATSO Compressor",
    "category": "Tape & Saturation",
    "description": "An elite recreation of Empirical Labs' analog tape simulator and optimizer. Combining custom clipper-harmonic generation, dynamic high-frequency limiters, and vintage VCA compression, it tames transient peaks with warm, analog saturation.",
    "hardwareModel": "Empirical Labs EL7 FATSO Jr. / Sr.",
    "parameters": [
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls input drive into the saturation circuit, simultaneously establishing compression threshold.",
        "type": "knob"
      },
      {
        "name": "Warmth",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets the threshold of the dynamic high-frequency limiter to emulate tape-saturation high-end roll-off.",
        "type": "knob"
      },
      {
        "name": "Compressor Mode",
        "range": "Buss / GP / Tracking / Spank",
        "defaultVal": "Buss",
        "description": "Selects compression behaviors, from gentle stereo bus processing (Buss) to aggressive brickwall limiting (Spank).",
        "type": "select",
        "options": [
          "Buss",
          "GP",
          "Tracking",
          "Spank"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a high-pass filter in the compressor's sidechain path to prevent low-end pumping.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Output Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the final playback output gain stage.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On acoustic drum rooms or overheads, select 'Spank' mode, turn Warmth to 5, and push the Input until the orange Warmth LED flashes to crush the transients while warming up the cymbals.",
      "For mix bus processing, select 'Buss' mode with the Sidechain Filter active. Drive the Input level gently so the 0 dB or 1 dB compression LEDs light up on kick drums for subtle, analog glue."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad emt 250 digital reverb",
    "displayName": "UAD EMT 250 Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "A faithful emulation of the world's first commercial digital reverb unit. Resembling an iconic physical control console, this plugin recreates the bright, shimmering spaces, lush modulation chorus, and highly musical decay characteristics of the 1976 physical hardware.",
    "hardwareModel": "EMT 250 Electronic Reverberator",
    "parameters": [
      {
        "name": "Reverb Time",
        "range": "0.4s to 4.5s",
        "defaultVal": "2.0s",
        "description": "Adjusts the overall decay duration of the generated reverb tail.",
        "type": "slider"
      },
      {
        "name": "Low Decay",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Filters and dampens low frequency decay, adjusting bass response inside the reverb.",
        "type": "slider"
      },
      {
        "name": "High Decay",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Dampens high-frequency decay, simulating carpeted damp spaces or open bright rooms.",
        "type": "slider"
      },
      {
        "name": "Pre-Delay",
        "range": "0ms / 20ms / 60ms / 140ms",
        "defaultVal": "20ms",
        "description": "Sets the discrete physical pre-delay interval before reverb reflections commence.",
        "type": "select",
        "options": [
          "0ms",
          "20ms",
          "60ms",
          "140ms"
        ]
      },
      {
        "name": "Output Mode",
        "range": "Mono / Stereo / Quad",
        "defaultVal": "Stereo",
        "description": "Alters physical-modeled microphone output arrangements.",
        "type": "switch",
        "options": [
          "Mono",
          "Stereo",
          "Quad"
        ]
      }
    ],
    "proTips": [
      "On lead vocal lines, set Reverb Time to 2.4s, choose 60ms of Pre-Delay, and boost High Decay to +2. This creates a brilliant, shimmering vocal space that stays completely clear of consonants.",
      "Switch the main program to Chorus mode, and feed a dry synth lead through the EMT 250. It generates a rich, deep, stereo modulation typical of classic 1980s pop tracks."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 31102 eq",
    "displayName": "UAD Neve 31102 EQ",
    "category": "Equalizers",
    "description": "Emulates the legendary 31102 console EQ from Neve, celebrated for its raw, aggressive midrange energy and expensive-sounding high-shelf sheen. Originally found on the Neve 8068 console, this EQ provides distinctively musical passive-sounding filters and continuous harmonic coloration when pushed.",
    "hardwareModel": "Neve 31102 Console Equalizer",
    "parameters": [
      {
        "name": "High Shelf Freq",
        "range": "10k / 12k / 16k Hz",
        "defaultVal": "10k Hz",
        "description": "Selects the high-frequency shelf shelf-point.",
        "type": "switch",
        "options": [
          "10k Hz",
          "12k Hz",
          "16k Hz"
        ]
      },
      {
        "name": "High Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "High-frequency shelf boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Freq",
        "range": "0.35k / 0.7k / 1.6k / 3.2k / 4.8k / 7.2k Hz",
        "defaultVal": "3.2k Hz",
        "description": "Mid-frequency peaking band selector.",
        "type": "switch",
        "options": [
          "0.35k Hz",
          "0.7k Hz",
          "1.6k Hz",
          "3.2k Hz",
          "4.8k Hz",
          "7.2k Hz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "Midrange boost or cut.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Boost 12 kHz by +2dB on overheads to add expensive-sounding air without introducing harsh digital fizz.",
      "Set the Mid band to 3.2 kHz and boost +3dB to bring a dull rock snare forward in a busy mix with raw, analog-style punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad 4k buss compressor",
    "displayName": "UAD 4K Buss Compressor",
    "category": "Dynamics",
    "description": "A precise emulation of the legendary Solid State Logic 4000 G console center section stereo bus compressor. Revered for its ability to 'glue' together submixes and complete master tracks, it provides punch, cohesion, and tight modern dynamic control.",
    "hardwareModel": "SSL 4000 G Series Bus Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-20 to +20 dB",
        "defaultVal": "+20 dB",
        "description": "Sets the dynamic compression threshold.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 10:1",
        "defaultVal": "4:1",
        "description": "Selects the VCA compression ratio.",
        "type": "switch",
        "options": [
          "2:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1 to 30 ms",
        "defaultVal": "30 ms",
        "description": "Sets the compressor's reaction speed.",
        "type": "switch",
        "options": [
          "0.1 ms",
          "0.3 ms",
          "1 ms",
          "3 ms",
          "10 ms",
          "30 ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.1 to 1.2s / Auto",
        "defaultVal": "Auto",
        "description": "Selects manual or program-dependent automatic release recovery.",
        "type": "switch",
        "options": [
          "0.1 s",
          "0.3 s",
          "0.6 s",
          "1.2 s",
          "Auto"
        ]
      }
    ],
    "proTips": [
      "Set Ratio to 4:1, Attack to 30ms, and Release to Auto for the classic master bus 'glue' setting, pulling down the threshold for 2-3dB of gain reduction.",
      "Use 2:1 ratio with the fastest 0.1ms attack on explosive acoustic guitar stems to dynamically smooth transients without crushing the natural decay."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad 4k channel strip",
    "displayName": "UAD 4K Channel Strip",
    "category": "Channel Strips",
    "description": "An incredibly faithful model of the classic Solid State Logic 4000 E Series console channel strip. Combines the iconic Black Knob and Brown Knob 4-band EQs with the punchy VCA dynamics compressor/expander and signature console channel saturation.",
    "hardwareModel": "Solid State Logic SL 4000 E Series Channel Strip",
    "parameters": [
      {
        "name": "Comp Threshold",
        "range": "-30 to +10 dB",
        "defaultVal": "+10 dB",
        "description": "Adjusts compressor threshold level.",
        "type": "knob"
      },
      {
        "name": "Comp Ratio",
        "range": "1:1 to infinity:1",
        "defaultVal": "1:1",
        "description": "Selects dynamic VCA ratio.",
        "type": "knob"
      },
      {
        "name": "EQ Type",
        "range": "Black / Brown",
        "defaultVal": "Black",
        "description": "Toggles between aggressive Black Knob and classic Brown Knob EQ filters.",
        "type": "switch",
        "options": [
          "Black",
          "Brown"
        ]
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 16 to 350 Hz",
        "defaultVal": "Off",
        "description": "Continuous low-cut filter control.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Toggle to 'Brown' EQ mode for acoustic guitars and vocals where wider, gentler, and smoother curves are desired over surgical precision.",
      "Engage the dynamic expander/gate on tom microphones with a fast threshold to quickly isolate drum hits and clean up low-end bleed."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad cooper time cube delay",
    "displayName": "UAD Cooper Time Cube Delay",
    "category": "Reverbs & Delays",
    "description": "Emulates the legendary Duane Cooper and Bill Putnam mechanical acoustic delay device, which achieved distinctively short, dark, and organic delays by driving sound through coiled garden hoses inside a soundproofed enclosure.",
    "hardwareModel": "Duane Cooper and Bill Putnam Cooper Time Cube Model 101",
    "parameters": [
      {
        "name": "Line 1 Delay",
        "range": "0 to 2500 ms",
        "defaultVal": "14 ms",
        "description": "Adjusts the delay time of the first channel.",
        "type": "knob"
      },
      {
        "name": "Line 2 Delay",
        "range": "0 to 2500 ms",
        "defaultVal": "16 ms",
        "description": "Adjusts the delay time of the second channel.",
        "type": "knob"
      },
      {
        "name": "Decay",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls delay line feedback amount.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "High-frequency coloration control.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set Line 1 to 14ms and Line 2 to 16ms with zero feedback to create an incredibly wide, natural stereo Haas effect on dry electric guitars.",
      "Feed a short Cooper Time Cube delay directly into a plate reverb on vocals to create deep, lush pre-delay reflections that don't muddy the mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad harrison 32c eq",
    "displayName": "UAD Harrison 32C EQ",
    "category": "Equalizers",
    "description": "Emulates the four-band fully parametric console equalizer from the Harrison 32-Series console, famous for its sweepable high-pass and low-pass filters and highly musical, interactive bands that shaped Michael Jackson's 'Thriller'.",
    "hardwareModel": "Harrison 32C Console Equalizer",
    "parameters": [
      {
        "name": "Low Pass Filter",
        "range": "Off / 1.2k to 20k Hz",
        "defaultVal": "Off",
        "description": "Sweeps the high-cut frequency.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 25 to 3150 Hz",
        "defaultVal": "Off",
        "description": "Sweeps the low-cut frequency.",
        "type": "knob"
      },
      {
        "name": "Hi Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "High band shelving boost/cut.",
        "type": "knob"
      },
      {
        "name": "Low Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Low band shelving boost/cut.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize the sweepable High Pass Filter up to 80Hz on thin vocals to clear out muddy low-end room reflections without sacrificing weight.",
      "Boost 2-3dB with the Hi Gain band on snare drums to highlight attack and splash, while pulling down the Low Pass filter slightly to roll off unwanted cymbal bleed."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad little labs ibp phase alignment",
    "displayName": "UAD Little Labs IBP Phase Alignment",
    "category": "Equalizers",
    "description": "A precise emulation of the Little Labs In-Between Phase tool, an essential studio utility designed for correcting phase anomalies, comb filtering, and time-alignment discrepancies between multiple microphones on a single source.",
    "hardwareModel": "Little Labs IBP Analog Phase Alignment Tool",
    "parameters": [
      {
        "name": "Phase Adjust",
        "range": "0 to 180 degrees",
        "defaultVal": "0 degrees",
        "description": "Provides continuously variable phase adjustment.",
        "type": "knob"
      },
      {
        "name": "Phase Center",
        "range": "Lo / Hi",
        "defaultVal": "Lo",
        "description": "Selects frequency centering optimized for low or high frequencies.",
        "type": "switch",
        "options": [
          "Lo",
          "Hi"
        ]
      },
      {
        "name": "Phase Invert",
        "range": "0 / 180",
        "defaultVal": "0",
        "description": "Flips absolute polarity by 180 degrees.",
        "type": "switch",
        "options": [
          "0",
          "180"
        ]
      },
      {
        "name": "Delay",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages micro-delay stage for time-alignment.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Insert on a bass DI track relative to a live bass amp mic, sweep Phase Adjust until you hear the low-end snap together with thick, cohesive power.",
      "Use on bottom snare microphone relative to top snare microphone to align their phase perfectly before applying any EQ or compression."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad moog multimode legacy filter",
    "displayName": "UAD Moog Multimode Legacy Filter",
    "category": "Equalizers",
    "description": "A detailed model of Moog's classic analog synthesizer filter. It provides self-oscillating resonant low-pass, high-pass, and band-pass filtering with classic ladder filter saturation, bringing raw analog grit and harmonic movement to digital stems.",
    "hardwareModel": "Moog Multimode Filter",
    "parameters": [
      {
        "name": "Cutoff",
        "range": "20 to 20000 Hz",
        "defaultVal": "20000 Hz",
        "description": "Sets the filter's cutoff frequency.",
        "type": "knob"
      },
      {
        "name": "Resonance",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls the resonant peak of the filter.",
        "type": "knob"
      },
      {
        "name": "Filter Mode",
        "range": "LPF / BPF / HPF",
        "defaultVal": "LPF",
        "description": "Toggles between low-pass, band-pass, and high-pass slopes.",
        "type": "switch",
        "options": [
          "LPF",
          "BPF",
          "HPF"
        ]
      },
      {
        "name": "Drive",
        "range": "0 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Pushes input drive for warm solid-state saturation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select the Low Pass Filter (LPF) and push Drive up to +8dB on synth-bass lines to generate rich sub-harmonics that translate on smaller speakers.",
      "Set a very low LFO Rate on a stereo electric piano track to create organic, sweepy filter textures that move subtly in the stereo field."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision enhancer khz",
    "displayName": "UAD Precision Enhancer kHz",
    "category": "Equalizers",
    "description": "A specialized psychoacoustic processor designed to breathe life, excitement, and modern high-frequency brilliance into sterile tracks, subgroups, and masters using dynamic saturation, synthesis, and shelving.",
    "hardwareModel": "Universal Audio Precision Enhancer kHz",
    "parameters": [
      {
        "name": "Sensitivity",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Controls input sensitivity to trigger processing.",
        "type": "knob"
      },
      {
        "name": "Effect Level",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Blends processed excited signal with dry input.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "A / B / C / D",
        "defaultVal": "A",
        "description": "Selects the harmonic enhancement algorithm.",
        "type": "switch",
        "options": [
          "A",
          "B",
          "C",
          "D"
        ]
      }
    ],
    "proTips": [
      "On acoustic guitars, select Mode B and keep the Effect Level low (around 15%) to restore high-end sparkle without introducing transient harshness.",
      "Use Mode A on a dull lead vocal track to synthesise pleasant upper-mid air, allowing the vocal to sit directly on top of a dense electronic beat."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad dbx 160 compressor",
    "displayName": "UAD dbx 160 Compressor",
    "category": "Dynamics",
    "description": "A meticulous emulation of the classic dbx 160 VU solid-state compressor, highly prized for its rapid VCA response, hard-knee compression, and grit-inducing vintage character on drums, bass, and aggressive guitars.",
    "hardwareModel": "dbx 160 VU Compressor/Limiter",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 to +20 dB",
        "defaultVal": "+20 dB",
        "description": "Sets the compressor threshold.",
        "type": "knob"
      },
      {
        "name": "Compression",
        "range": "1:1 to Infinity:1",
        "defaultVal": "1:1",
        "description": "Adjusts VCA ratio.",
        "type": "knob"
      },
      {
        "name": "Output Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Applies makeup output volume.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Slam rock room mics at a high Compression ratio of 10:1 and pull down the threshold to generate explosive, pumping drum room sustain.",
      "Lock rock bass guitars in place by dialing a 4:1 ratio, adjusting threshold for -5dB of gain reduction, and letting the VCA add punchy mid-frequency bite."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad spl transient designer",
    "displayName": "UAD SPL Transient Designer",
    "category": "Dynamics",
    "description": "Emulates the legendary German-engineered dynamic envelope processor, letting you independently boost or cut the attack and sustain phases of audio signals regardless of input levels or thresholds.",
    "hardwareModel": "SPL Transient Designer 9842",
    "parameters": [
      {
        "name": "Attack",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Amplifies or dampens transient onset.",
        "type": "knob"
      },
      {
        "name": "Sustain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Amplifies or dampens signal decay tail.",
        "type": "knob"
      },
      {
        "name": "Output Gain",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts output make-up gain level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Crank Attack to +4dB on a dull kick or snare drum to instantly add 'crack' and definition without touch-adjusting a compressor's attack/release.",
      "Pull Sustain down to -5dB on ringy toms to dry up their tail bleed, creating a tight and focused decay without applying artificial gating."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad precision buss compressor",
    "displayName": "UAD Precision Buss Compressor",
    "category": "Dynamics",
    "description": "A modern, ultra-transparent VCA-style dual-stereo bus compressor designed for master and group bus duties, combining flexible controls like automatic release and sidechain filtering with a low-distortion signal path.",
    "hardwareModel": "Universal Audio Precision Buss Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-30 to +10 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the compression threshold point.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1.5:1 / 2:1 / 4:1 / 10:1",
        "defaultVal": "2:1",
        "description": "Selects compressor ratio.",
        "type": "switch",
        "options": [
          "1.5:1",
          "2:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1 to 100 ms",
        "defaultVal": "10 ms",
        "description": "Sets transient reaction speed.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.1 to 1.2 s / Auto",
        "defaultVal": "Auto",
        "description": "Adjusts recovery speed.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select the 1.5:1 ratio on a master bus for microscopic, near-invisible master gluing that respects the natural dynamics of acoustic ensembles.",
      "Set the sidechain filter parameter to 120Hz on modern EDM tracks so that deep sub-bass frequencies do not trigger unwanted compressor pumping."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision de-esser",
    "displayName": "UAD Precision De-Esser",
    "category": "Dynamics",
    "description": "A high-precision, dual-band dynamic processor designed to target and suppress unwanted high-frequency sibilance and harshness on vocals, overheads, and master tracks with surgical accuracy.",
    "hardwareModel": "Universal Audio Precision De-Esser",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 to 0 dB",
        "defaultVal": "0 dB",
        "description": "Sets de-esser threshold level.",
        "type": "knob"
      },
      {
        "name": "Frequency",
        "range": "2k to 16k Hz",
        "defaultVal": "6k Hz",
        "description": "Sets the center band of sibilance detection.",
        "type": "knob"
      },
      {
        "name": "Split Mode",
        "range": "Split / Wide",
        "defaultVal": "Split",
        "description": "Toggles between split-band gain reduction or wide-band gain reduction.",
        "type": "switch",
        "options": [
          "Split",
          "Wide"
        ]
      }
    ],
    "proTips": [
      "Always use 'Split' mode on vocal tracks to isolate and suppress harsh sibilant 'S' spikes without dulling the entire vocal range's air.",
      "Sweep the Frequency knob down to 3kHz on harsh acoustic guitars to tame string pluck click-noises without destroying body warmth."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision maximizer",
    "displayName": "UAD Precision Maximizer",
    "category": "Dynamics",
    "description": "A proprietary dynamic peak-limiting and harmonic-shaping plugin designed to increase the perceived volume, warmth, and density of program material without degrading punch, transient detail, or master headroom.",
    "hardwareModel": "Universal Audio Precision Maximizer",
    "parameters": [
      {
        "name": "Limit",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls peak-limiting drive amount.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Wet/Dry parallel processing blend.",
        "type": "knob"
      },
      {
        "name": "Shape",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Contours even and odd-order tube-style saturation curves.",
        "type": "knob"
      },
      {
        "name": "Band Mode",
        "range": "1-Band / 3-Band",
        "defaultVal": "3-Band",
        "description": "Toggles between wide-band or multi-band harmonic processing.",
        "type": "switch",
        "options": [
          "1-Band",
          "3-Band"
        ]
      }
    ],
    "proTips": [
      "Set the Band Mode to 3-Band on master tracks to excite low, mid, and high bands independently, producing an overall louder and denser commercial master.",
      "Blend the processor at 40% Mix on drum subgroups to introduce punchy, parallel tape-like saturation while preserving clean transient bite underneath."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad teletronix la-3a audio leveler",
    "displayName": "UAD Teletronix LA-3A Audio Leveler",
    "category": "Dynamics",
    "description": "A faithful emulation of the classic solid-state optical compressor, combining the smooth opto compression character of the tube-based LA-2A with the fast, punchy transient response of solid-state circuitry.",
    "hardwareModel": "Teletronix LA-3A Audio Leveler",
    "parameters": [
      {
        "name": "Peak Reduction",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Pushes input drive against the optical cell for compression.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Controls output makeup volume level.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Limit / Compress",
        "defaultVal": "Compress",
        "description": "Toggles between a gentle 2:1 compressor curve and a steep limiter curve.",
        "type": "switch",
        "options": [
          "Limit",
          "Compress"
        ]
      }
    ],
    "proTips": [
      "Insert on heavy electric rock guitars with Mode set to Compress and shave off 3-4dB to glue them instantly into a dense wall of sound.",
      "Use on lead vocals on top of an LA-2A in a serial compression chain to catch fast, stray transients that opto-tubes might miss."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 88rs legacy channel strip",
    "displayName": "UAD Neve 88RS Legacy Channel Strip",
    "category": "Channel Strips",
    "description": "A low-latency, DSP-efficient legacy version of the Neve 88RS channel strip. Ideal for tracking or managing massive track-count mixing projects while delivering the smooth console summing, musical EQ, and dynamics of Neve's flagship console.",
    "hardwareModel": "Neve 88RS Console Channel Strip",
    "parameters": [
      {
        "name": "Compressor Threshold",
        "range": "-30 to +10 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts compressor threshold level.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to infinity:1",
        "defaultVal": "3:1",
        "description": "Selects compression ratio.",
        "type": "knob"
      },
      {
        "name": "Low Pass Filter",
        "range": "Off / 3k to 30k Hz",
        "defaultVal": "Off",
        "description": "Selects low-pass filter frequency.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 20 to 300 Hz",
        "defaultVal": "Off",
        "description": "Selects high-pass filter frequency.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize this legacy version across every channel of a massive drum multi-track session to build low-latency, classic Neve console dynamic summing.",
      "Engage the built-in expander/gate with a fast release on live tom-toms to isolate direct hits and eliminate low frequency floor rumble."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad helios type 69 legacy eq",
    "displayName": "UAD Helios Type 69 Legacy EQ",
    "category": "Equalizers",
    "description": "Emulation of the rare, highly musical analog EQ found in the Helios Type 69 consoles used at Olympic Studios, Island Studios, and on legendary rock recordings. Famous for its unique passive mid-band and distinct low-frequency shelving or sub-harmonic boost options.",
    "hardwareModel": "Helios Type 69 Console EQ",
    "parameters": [
      {
        "name": "Mid Frequency",
        "range": "0.7 to 6.0 kHz",
        "defaultVal": "0.7 kHz",
        "description": "Selects the target frequency for the mid-range band.",
        "type": "select",
        "options": [
          "0.7 kHz",
          "1.0 kHz",
          "1.4 kHz",
          "2.0 kHz",
          "2.8 kHz",
          "3.5 kHz",
          "4.5 kHz",
          "6.0 kHz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "-15dB to +15dB",
        "defaultVal": "0 dB",
        "description": "Sets the boost or cut amount for the selected mid frequency.",
        "type": "knob"
      },
      {
        "name": "Bass Cut/Boost",
        "range": "-15dB to +15dB",
        "defaultVal": "0 dB",
        "description": "Sets the boost or cut amount for the low-end band.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 40Hz / 80Hz",
        "defaultVal": "Off",
        "description": "Toggles the built-in step high pass filter.",
        "type": "switch",
        "options": [
          "Off",
          "40Hz",
          "80Hz"
        ]
      }
    ],
    "proTips": [
      "Use the 10 kHz high shelf to add an instantly recognizable open air and bite to electric guitars and rock snare drums.",
      "Select 60 Hz on the low-frequency selector and boost to add authoritative, punchy weight to kick drums and bass guitars without causing mud."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 1081 eq",
    "displayName": "UAD Neve 1081 EQ",
    "category": "Equalizers",
    "description": "Emulation of Neve's legendary 1972 channel amplifier and equalizer, famous for its punchy, highly flexible four-band design with high and low bandpass filters. It offers detailed surgical control with classic Neve console warmth.",
    "hardwareModel": "Neve 1081 Channel Amplifier",
    "parameters": [
      {
        "name": "Hi-Mid Frequency",
        "range": "1.5k to 8.2kHz",
        "defaultVal": "1.5 kHz",
        "description": "Selects high-mid band target frequency.",
        "type": "select",
        "options": [
          "1.5 kHz",
          "2.2 kHz",
          "3.3 kHz",
          "3.9 kHz",
          "4.7 kHz",
          "5.6 kHz",
          "6.8 kHz",
          "8.2 kHz"
        ]
      },
      {
        "name": "Hi-Mid Gain",
        "range": "-18dB to +18dB",
        "defaultVal": "0 dB",
        "description": "Controls high-mid band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "Low-Mid Gain",
        "range": "-18dB to +18dB",
        "defaultVal": "0 dB",
        "description": "Controls low-mid band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 31 to 315 Hz",
        "defaultVal": "Off",
        "description": "Selects high pass filter step value.",
        "type": "select",
        "options": [
          "Off",
          "31 Hz",
          "47 Hz",
          "68 Hz",
          "100 Hz",
          "150 Hz",
          "220 Hz",
          "270 Hz",
          "315 Hz"
        ]
      }
    ],
    "proTips": [
      "Set the High Pass filter to 47 Hz or 68 Hz on vocal tracks to clean up sub-bass mud while maintaining a warm Neve low-end chest tone.",
      "The High-Mid band is extremely powerful for bringing out attack on acoustic guitars; select 3.3 kHz or 4.7 kHz and boost 2-4 dB for a shiny, forward character."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 33609 stereo limiter compressor",
    "displayName": "UAD Neve 33609 Stereo Limiter Compressor",
    "category": "Dynamics",
    "description": "Perfect emulation of the legendary diode-bridge compressor/limiter first introduced in 1969. Famous for its discrete, feedback-style compression that glues stereo tracks, master buses, and drum groups with unmistakable analog fatness.",
    "hardwareModel": "Neve 33609 Stereo Compressor/Limiter",
    "parameters": [
      {
        "name": "Compressor Threshold",
        "range": "-20dBu to +10dBu",
        "defaultVal": "+10 dBu",
        "description": "Sets the signal level at which compression begins.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1.5:1 to 6:1",
        "defaultVal": "1.5:1",
        "description": "Selects compression slope severity.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1"
        ]
      },
      {
        "name": "Compressor Recovery",
        "range": "100ms to Auto2",
        "defaultVal": "100ms",
        "description": "Selects compressor recovery time constant.",
        "type": "select",
        "options": [
          "100ms",
          "400ms",
          "800ms",
          "1.5s",
          "Auto1",
          "Auto2"
        ]
      },
      {
        "name": "Limiter Threshold",
        "range": "+4dBm to +20dBm",
        "defaultVal": "+20 dBm",
        "description": "Sets threshold for the independent peak limiter stage.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For master bus glue, use a low 1.5:1 or 2:1 ratio, a slow Recovery setting of Auto1 or Auto2, and adjust the threshold for a gentle 1 to 2 dB of gain reduction.",
      "Instantly beef up a drum group by selecting a fast 100ms or 400ms recovery time, driving the threshold for 4-6 dB of compression, and blending in parallel."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 1073 legacy eq",
    "displayName": "UAD Neve 1073 Legacy EQ",
    "category": "Equalizers",
    "description": "The classic DSP-efficient emulation of the most famous console module in recording history. Provides the legendary high shelf air, the gritty, punchy mid-band, and the signature rich low-end saturation of the Neve 1073.",
    "hardwareModel": "Neve 1073 Channel Amplifier",
    "parameters": [
      {
        "name": "High Shelf",
        "range": "-16dB to +16dB",
        "defaultVal": "0 dB",
        "description": "Adjusts 12 kHz high-frequency shelving boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Frequency",
        "range": "360Hz to 7.2kHz",
        "defaultVal": "360 Hz",
        "description": "Selects mid-band bell filter target frequency.",
        "type": "select",
        "options": [
          "360 Hz",
          "700 Hz",
          "1.6 kHz",
          "3.2 kHz",
          "4.8 kHz",
          "7.2 kHz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "-18dB to +18dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level of mid band.",
        "type": "knob"
      },
      {
        "name": "Low Frequency",
        "range": "35Hz to 220Hz",
        "defaultVal": "35 Hz",
        "description": "Selects low-frequency shelving band target.",
        "type": "select",
        "options": [
          "35 Hz",
          "60 Hz",
          "110 Hz",
          "220 Hz"
        ]
      }
    ],
    "proTips": [
      "Boost the fixed 12 kHz high shelf by 2 to 4 dB to add that signature Neve expensive high-end air to vocals, acoustic guitars, and drum overheads.",
      "To cure thin-sounding snare drums, select 110 Hz or 220 Hz on the low band and boost 2-3 dB for an instant, warm chest punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision multiband compressor",
    "displayName": "UAD Precision Multiband Compressor",
    "category": "Dynamics",
    "description": "A high-fidelity, five-band spectral dynamics processor designed for precision mastering, mixing, and clinical track control. It offers transparent compression, expansion, and limiting with customizable crossover points and filter slopes.",
    "hardwareModel": "Universal Audio Precision Multiband Compressor",
    "parameters": [
      {
        "name": "Bands Active",
        "range": "1 to 5",
        "defaultVal": "5",
        "description": "Selects active operational dynamic bands.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5"
        ]
      },
      {
        "name": "Threshold",
        "range": "-60dB to 0dB",
        "defaultVal": "0 dB",
        "description": "Sets dynamic threshold for selected frequency band.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1:1 to 20:1",
        "defaultVal": "1:1",
        "description": "Sets compression or expansion slope.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.1ms to 500ms",
        "defaultVal": "10 ms",
        "description": "Sets response speed of envelope detection.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "10ms to 5000ms",
        "defaultVal": "100 ms",
        "description": "Sets envelope recovery speed of band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Perfect for taming low-end build-up on a master bus; isolate the lowest band below 120 Hz with a fast 10 ms attack and automatic release to act as a dynamic low-frequency control.",
      "Use it as a precise high-frequency de-esser or harshness controller on vocals or harsh acoustic guitars by isolating the 3 kHz to 8 kHz band with a high ratio (4:1 or higher) and fast attack."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision equalizer",
    "displayName": "UAD Precision Equalizer",
    "category": "Equalizers",
    "description": "A pristine, dual-channel, four-band parametric equalizer designed specifically for stereo mastering and critical program mixing. Operates with absolute digital purity, minimal phase shift, and stepped control points for perfect recall.",
    "hardwareModel": "Universal Audio Precision Equalizer",
    "parameters": [
      {
        "name": "Low-Cut Filter",
        "range": "Off / 10 to 120 Hz",
        "defaultVal": "Off",
        "description": "Enables sharp high-pass filter curve at selected step.",
        "type": "select",
        "options": [
          "Off",
          "10 Hz",
          "20 Hz",
          "30 Hz",
          "40 Hz",
          "50 Hz",
          "60 Hz",
          "80 Hz",
          "100 Hz",
          "120 Hz"
        ]
      },
      {
        "name": "High Shelf Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on high-shelf band.",
        "type": "knob"
      },
      {
        "name": "High-Mid Frequency",
        "range": "2.0k to 16.0kHz",
        "defaultVal": "2.0 kHz",
        "description": "Selects high-mid band center frequency.",
        "type": "select",
        "options": [
          "2.0 kHz",
          "2.8 kHz",
          "4.0 kHz",
          "5.6 kHz",
          "8.0 kHz",
          "11.2 kHz",
          "16.0 kHz"
        ]
      },
      {
        "name": "Low-Mid Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on low-mid parametric band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize the 10 Hz or 20 Hz low-cut filter on your master bus to safely strip away sub-sonic rumble and gain massive headroom without altering the audible bass response.",
      "Use the 16 kHz High-Mid frequency band with a very subtle 0.5 to 1 dB boost in stereo link mode to open up the top-end of a master with zero phase smear."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad emt 140 plate reverb",
    "displayName": "UAD EMT 140 Plate Reverb",
    "category": "Reverbs & Delays",
    "description": "Meticulous emulation of the legendary German physical plate reverb. It models three unique plates (A, B, and C) stored at The Plant Studios, delivering the dense, silky, and infinitely lush decay that defined modern vocal reverb.",
    "hardwareModel": "EMT 140 Steel Plate Reverb",
    "parameters": [
      {
        "name": "Plate Select",
        "range": "Plate A / Plate B / Plate C",
        "defaultVal": "Plate A",
        "description": "Selects between three plates with different damping qualities.",
        "type": "select",
        "options": [
          "Plate A",
          "Plate B",
          "Plate C"
        ]
      },
      {
        "name": "Reverb Time",
        "range": "0.5s to 5.0s",
        "defaultVal": "2.0s",
        "description": "Determines decay length of the virtual plate surface.",
        "type": "knob"
      },
      {
        "name": "Pre-Delay",
        "range": "0ms to 250ms",
        "defaultVal": "0ms",
        "description": "Adjusts time gap before reverb onset.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off to 500 Hz",
        "defaultVal": "Off",
        "description": "Cuts low frequencies from input source before entering plate.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select Plate A for high-frequency silk and vintage vocal shines, while Plate B offers a warmer, more balanced low-mid response suitable for acoustic guitars and drum rooms.",
      "Always use 30 to 60 ms of Pre-Delay on lead vocals to allow the dry vocal transients to pop through cleanly before the dense plate reverb tail blossoms."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision limiter",
    "displayName": "UAD Precision Limiter",
    "category": "Dynamics",
    "description": "A professional-grade, single-band look-ahead brickwall limiter designed for stereo mastering and final program mixing. Delivers 100% color-free, transparent peak control with absolute brickwall protection against inter-sample clipping.",
    "hardwareModel": "Universal Audio Precision Limiter",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-24dB to 0dB",
        "defaultVal": "0 dB",
        "description": "Sets brickwall input drive and compression point.",
        "type": "knob"
      },
      {
        "name": "Ceiling",
        "range": "-12dB to 0dB",
        "defaultVal": "0 dB",
        "description": "Sets ultimate peak output limit.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.01ms to 1000ms",
        "defaultVal": "1.00 ms",
        "description": "Sets limiter recovery envelope timing.",
        "type": "knob"
      },
      {
        "name": "Mode",
        "range": "Fast / Slow",
        "defaultVal": "Fast",
        "description": "Toggles transient detection response behavior.",
        "type": "switch",
        "options": [
          "Fast",
          "Slow"
        ]
      }
    ],
    "proTips": [
      "To prevent digital distortion on consumer playback devices, always set the Ceiling control to -0.2 dB or -0.5 dB to avoid inter-sample peak clips.",
      "Use the Slow release mode on acoustic, classical, or jazz masters for a highly transparent, organic volume increase that leaves delicate transient tails unaltered."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad softube amp room half-stack",
    "displayName": "UAD Softube Amp Room Half-Stack",
    "category": "Guitar & Bass",
    "description": "A faithful emulation of the classic British 100-watt tube amp half-stack. Delivers the legendary roaring heavy rock crunch, rich power amp saturation, and massive mid-range projection that defined hard rock and heavy metal.",
    "hardwareModel": "Marshall JCM800 2203 with 1960A 4x12 Cabinet",
    "parameters": [
      {
        "name": "Pre-Amp Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Sets input overdrive and gain stages.",
        "type": "knob"
      },
      {
        "name": "Master Volume",
        "range": "0 to 10",
        "defaultVal": "6",
        "description": "Controls output stage volume and power-amp saturation.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Low frequency eq tone.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Mid frequency focus tone.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "High-frequency brilliance tone.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To achieve the classic 80s brown sound, crank the Pre-Amp Volume to 8, scoop the Middle slightly to 4, and let the virtual cabinet microphone capture the edge of the speaker cone.",
      "Clean up the tone beautifully by rolling back your physical guitar volume knob to 4 or 5; this amp simulation is highly touch-sensitive and cleans up naturally."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad softube bass amp room 8x10",
    "displayName": "UAD Softube Bass Amp Room 8x10",
    "category": "Guitar & Bass",
    "description": "A stunningly accurate recreation of the iconic Ampeg SVT tube bass head and its companion 810 cabinet. It delivers the thunderous, earth-shaking low-end, growling tube overdrive, and punchy transients heard on countless rock, funk, and metal records.",
    "hardwareModel": "Ampeg SVT Bass Amplifier with 8x10 Cabinet",
    "parameters": [
      {
        "name": "Gain",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets input pre-amplifier tube drive level.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "-15dB to +15dB",
        "defaultVal": "0 dB",
        "description": "Sets low frequency EQ boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid",
        "range": "-15dB to +15dB",
        "defaultVal": "0 dB",
        "description": "Sets parametric mid-frequency EQ level.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "-15dB to +15dB",
        "defaultVal": "0 dB",
        "description": "Sets high-frequency EQ level.",
        "type": "knob"
      },
      {
        "name": "DI / Amp Blend",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Blends direct injection raw signal with wet microphone cabinet signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set the DI/Amp Blend to 40% Wet (DI) and 60% Amp to capture the punchy sub-bass definition of the clean direct signal combined with the warm tube mid-range grit of the 8x10 cabinet.",
      "Crank the input Gain to 7 or 8 to get a natural tube compression and aggressive grit that helps bass guitars sit beautifully in thick rock and metal mixes."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad teletronix la-2a legacy leveler",
    "displayName": "UAD Teletronix LA-2A Legacy Leveler",
    "category": "Dynamics",
    "description": "The original legacy emulation of the legendary Teletronix LA-2A opto compressor. Featuring a warm, tube-driven electro-optical system, it provides exceptionally smooth, program-dependent compression perfect for vocals and bass.",
    "hardwareModel": "Teletronix LA-2A Opto Leveling Amplifier",
    "parameters": [
      {
        "name": "Peak Reduction",
        "range": "0 to 100",
        "defaultVal": "30",
        "description": "Controls input dynamic attenuation amount.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "0 to 100",
        "defaultVal": "40",
        "description": "Adjusts output make-up amplification stage.",
        "type": "knob"
      },
      {
        "name": "Limit/Compress",
        "range": "Limit / Compress",
        "defaultVal": "Compress",
        "description": "Changes compression knee from gentle to brickwall limiting.",
        "type": "switch",
        "options": [
          "Limit",
          "Compress"
        ]
      }
    ],
    "proTips": [
      "Perfect for acoustic or clean pop vocals: set the switch to Compress, adjust Peak Reduction for a gentle 2 to 4 dB of gain reduction on peaks, and use Gain to bring the level back up.",
      "Run an electric bass guitar through this unit with Peak Reduction set to hit 5 to 7 dB of compression on strong notes to level out the performance with warm, rich sustain."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ua 1176ln legacy limiter",
    "displayName": "UAD UA 1176LN Legacy Limiter",
    "category": "Dynamics",
    "description": "The ultra-fast legacy emulation of the iconic 1176LN solid-state peak limiter. Utilizing the famous FET-style gain reduction circuit, it provides instant attack times and explosive energy, making it a staple for drums, vocals, and guitars.",
    "hardwareModel": "Universal Audio 1176LN Peak Limiter",
    "parameters": [
      {
        "name": "Input",
        "range": "0 to 40",
        "defaultVal": "30",
        "description": "Adjusts threshold and input volume level.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "0 to 40",
        "defaultVal": "18",
        "description": "Sets the final make-up gain volume.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "1 to 7",
        "defaultVal": "3",
        "description": "Sets speed of compression attack (1 slowest to 7 fastest).",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "1 to 7",
        "defaultVal": "5",
        "description": "Sets speed of compression recovery (1 slowest to 7 fastest).",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "4:1 / 8:1 / 12:1 / 20:1 / All",
        "defaultVal": "4:1",
        "description": "Selects slope ratio or classic multi-button mode.",
        "type": "select",
        "options": [
          "4:1",
          "8:1",
          "12:1",
          "20:1",
          "All Buttons In"
        ]
      }
    ],
    "proTips": [
      "Engage the All Buttons In ratio mode on a room microphone or parallel drum group to crush the room signal and squeeze out explosive drum sustain and aggressive energy.",
      "For dynamic rock vocals, use a 4:1 ratio, set the Attack to 3 to let the initial transient pop through, and set the Release to 7 for maximum exciting detail."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ua 1176se legacy limiter",
    "displayName": "UAD UA 1176SE Legacy Limiter",
    "category": "Dynamics",
    "description": "A highly DSP-efficient, single-ended legacy emulation of the classic 1176 FET compressor. Tailored for larger mixes where CPU power is key, it delivers the same legendary lightning-fast attack and punchy FET saturation in a lightweight package.",
    "hardwareModel": "Universal Audio 1176SE Peak Limiter",
    "parameters": [
      {
        "name": "Input",
        "range": "0 to 40",
        "defaultVal": "30",
        "description": "Controls input level and automatic compression threshold.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "0 to 40",
        "defaultVal": "18",
        "description": "Sets output make-up gain level.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "1 to 7",
        "defaultVal": "3",
        "description": "Sets speed of compression attack (1 slowest to 7 fastest).",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "1 to 7",
        "defaultVal": "5",
        "description": "Sets speed of compression recovery (1 slowest to 7 fastest).",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "4:1 to 20:1",
        "defaultVal": "4:1",
        "description": "Selects compression knee slope ratio.",
        "type": "select",
        "options": [
          "4:1",
          "8:1",
          "12:1",
          "20:1"
        ]
      }
    ],
    "proTips": [
      "Because of its low DSP footprint, drop this on all individual tom-tom tracks; use 12:1 ratio, fast attack (6), and fast release (7) to capture and shape dynamic hits.",
      "Use on parallel guitar buses with a 4:1 ratio and fast release (7) to fatten up electric rhythm tracks without eating up precious DSP resources."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad pultec-pro legacy eq",
    "displayName": "UAD Pultec-Pro Legacy EQ",
    "category": "Equalizers",
    "description": "The iconic legacy combination of the EQP-1A Program Equalizer and MEQ-5 Mid-Range Equalizer. Captures the smooth, silky tube curves, resonant passive circuit, and the legendary low-end Pultec trick of boosting and cutting at the same time.",
    "hardwareModel": "Pultec EQP-1A & MEQ-5 Equalizers",
    "parameters": [
      {
        "name": "Low Frequency",
        "range": "20Hz to 100Hz",
        "defaultVal": "30Hz",
        "description": "Selects target shelf for low-frequency boost and attenuation.",
        "type": "select",
        "options": [
          "20Hz",
          "30Hz",
          "60Hz",
          "100Hz"
        ]
      },
      {
        "name": "Low Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Controls boost amount of selected low shelf frequency.",
        "type": "knob"
      },
      {
        "name": "Low Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Controls attenuation amount of selected low shelf frequency.",
        "type": "knob"
      },
      {
        "name": "Mid Peak Freq",
        "range": "200Hz to 7kHz",
        "defaultVal": "1.5kHz",
        "description": "Selects MEQ-5 mid-band peak frequency point.",
        "type": "select",
        "options": [
          "200Hz",
          "300Hz",
          "500Hz",
          "700Hz",
          "1kHz",
          "1.5kHz",
          "2kHz",
          "3kHz",
          "4kHz",
          "5kHz",
          "7kHz"
        ]
      },
      {
        "name": "High Boost Freq",
        "range": "3kHz to 16kHz",
        "defaultVal": "10kHz",
        "description": "Selects EQP-1A high-frequency shelving boost point.",
        "type": "select",
        "options": [
          "3kHz",
          "4kHz",
          "5kHz",
          "8kHz",
          "10kHz",
          "12kHz",
          "16kHz"
        ]
      }
    ],
    "proTips": [
      "Execute the classic Pultec Low End Trick on kick drums: select 30Hz or 60Hz, then simultaneously boost and attenuate by 3 to 4 units on the dials to tighten up sub-bass while boosting punch.",
      "To bring a vocal forward without introducing harshness, select 3kHz or 5kHz on the MEQ-5 mid band and boost by 2 to 3 units for warm analog presence."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad fairchild 670 legacy limiter",
    "displayName": "UAD Fairchild 670 Legacy Limiter",
    "category": "Dynamics",
    "description": "A stunning legacy emulation of the holy grail of tube compressors. Models the complex variable-mu design with 20 vacuum tubes and 4 custom-wound transformers, delivering a majestic, warm, and highly musical compression to the stereo bus.",
    "hardwareModel": "Fairchild 670 Variable-Mu Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts signal levels above which compression occurs.",
        "type": "knob"
      },
      {
        "name": "Time Constant",
        "range": "Position 1 to 6",
        "defaultVal": "Position 1",
        "description": "Selects pre-programmed attack and release timing profiles.",
        "type": "select",
        "options": [
          "Position 1",
          "Position 2",
          "Position 3",
          "Position 4",
          "Position 5",
          "Position 6"
        ]
      },
      {
        "name": "AGC Mode",
        "range": "Left/Right / Lat/Vert",
        "defaultVal": "Left/Right",
        "description": "Toggles between standard dual-stereo and Mid-Side processing paths.",
        "type": "switch",
        "options": [
          "Left/Right",
          "Lat/Vert"
        ]
      }
    ],
    "proTips": [
      "Switch the AGC Mode to Lat/Vert (Mid/Side processing) on a master bus to compress the center channel (Mid) separately from the stereo field (Side) for maximum stereo width and vocal control.",
      "Select Time Constant Position 5 or 6 (automatic program-dependent release) on acoustic guitar groups or lush vocal harmonies to get incredibly smooth, breathing compression that moves with the performance."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad dreamverb room modeler",
    "displayName": "UAD DreamVerb Room Modeler",
    "category": "Reverbs & Delays",
    "description": "DreamVerb is Universal Audio's premier proprietary acoustic room modeling tool, allowing users to design custom acoustic spaces by choosing materials, room shapes, and adjusting decay characteristics in deep detail. It uses unique algorithms to analyze and simulate the physics of sound reflection.",
    "hardwareModel": "Proprietary Universal Audio Room Modeling Algorithm",
    "parameters": [
      {
        "name": "Reflections Shape",
        "range": "Cube / Box / Cylinder / Dome / Sphere / Horseshoe",
        "defaultVal": "Cube",
        "description": "Sets the geometric boundaries of the virtual room.",
        "type": "select",
        "options": [
          "Cube",
          "Box",
          "Cylinder",
          "Dome",
          "Sphere",
          "Horseshoe"
        ]
      },
      {
        "name": "Late Reverb Decay",
        "range": "0.1s to 30s",
        "defaultVal": "1.5s",
        "description": "Controls the decay time of the late reflection tail.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Blends the dry input signal with the processed reverb.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Blend Early Reflections at 70% and Late Reverb at 30% to create a highly realistic, tight wooden drum booth with a 0.8s decay.",
      "Utilize the Materials panel to select plaster and wood surfaces to give acoustic guitars a warm, organic resonance."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad cambridge eq",
    "displayName": "UAD Cambridge EQ",
    "category": "Equalizers",
    "description": "A highly precise, surgical digital equalizer designed to provide clean, transparent frequency shaping with multiple filter types and slopes. Known for its extremely low DSP usage and flexible 5-band parametric controls plus comprehensive high-pass and low-pass filters.",
    "hardwareModel": "Proprietary Universal Audio Cambridge EQ",
    "parameters": [
      {
        "name": "HP Freq",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "20 Hz",
        "description": "Sets the high-pass filter cutoff frequency.",
        "type": "knob"
      },
      {
        "name": "HP Slope",
        "range": "6 dB to 36 dB",
        "defaultVal": "12 dB",
        "description": "Toggles the attenuation slope steepness of the high-pass filter.",
        "type": "select",
        "options": [
          "6 dB",
          "12 dB",
          "18 dB",
          "24 dB",
          "30 dB",
          "36 dB"
        ]
      },
      {
        "name": "Band 3 Freq",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "1 kHz",
        "description": "Adjusts the center frequency for the middle parametric band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the 36 dB/octave High Pass filter cut set to 30 Hz to aggressively clean up muddy sub-bass rumble without touching the kick drum's punch.",
      "Select the 'Type I' shelving response for extremely transparent surgical notched cuts on harsh vocal frequencies."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad realverb-pro room modeler",
    "displayName": "UAD RealVerb-Pro Room Modeler",
    "category": "Reverbs & Delays",
    "description": "RealVerb-Pro is UA's classic proprietary acoustic simulator that allows users to design virtual rooms by cross-fading between different materials and shapes, providing highly realistic space simulations with independent control over early reflections and late decay.",
    "hardwareModel": "Proprietary Universal Audio RealVerb-Pro Algorithm",
    "parameters": [
      {
        "name": "Room Shape",
        "range": "Cube to Sphere",
        "defaultVal": "Cube",
        "description": "Morphs the shape of the acoustic space from angular to spherical.",
        "type": "slider"
      },
      {
        "name": "Reverb Time",
        "range": "0.1s to 20s",
        "defaultVal": "1.2s",
        "description": "Controls the length of the late acoustic tail decay.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Blends wet processed space with dry signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Crossfade between 40% Wood and 60% Plaster materials to simulate a warm, lived-in living room that adds intimacy to dry acoustic guitars.",
      "Keep the Wet/Dry Mix around 15-20% and use a short 0.9s decay to make thin lead vocals sound like they were recorded in a high-end commercial studio."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad pultec eqp-1a legacy eq",
    "displayName": "UAD Pultec EQP-1A Legacy EQ",
    "category": "Equalizers",
    "description": "The classic legacy emulation of the legendary Pultec EQP-1A tube equalizer. Famous for its passive design and unique ability to simultaneously boost and attenuate the same low frequency, creating a tight, focused low-end punch that cannot be replicated with standard EQs.",
    "hardwareModel": "Pultec EQP-1A Program Equalizer",
    "parameters": [
      {
        "name": "Low Freq",
        "range": "20 Hz to 100 Hz",
        "defaultVal": "30 Hz",
        "description": "Selects the low frequency shelf band.",
        "type": "select",
        "options": [
          "20 Hz",
          "30 Hz",
          "60 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts low shelving frequency boost.",
        "type": "knob"
      },
      {
        "name": "Low Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts low shelving frequency attenuation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize the famous 'Pultec Trick' on kick drums: select 60 Hz, boost to 5, and attenuate to 4 to gain massive weight while clearing out mud in the lower mids.",
      "Open up dark overheads or vocals by selecting 12 kHz or 16 kHz and boosting to 4 to add a beautiful, silky passive tube air."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad precision mix rack collection",
    "displayName": "UAD Precision Mix Rack Collection",
    "category": "Channel Strips",
    "description": "A bundle of highly efficient, low-latency utility processors designed for clean, precise track processing. It combines the Precision Channel Strip (EQ & Dynamics) and Precision Reflection Engine, offering transparent tone-shaping and dynamics control ideal for clean tracking or live sound.",
    "hardwareModel": "Proprietary Universal Audio Precision Channel Strip",
    "parameters": [
      {
        "name": "Band 1 Freq",
        "range": "20 Hz to 2 kHz",
        "defaultVal": "100 Hz",
        "description": "Sets the low-band EQ center frequency.",
        "type": "knob"
      },
      {
        "name": "Band 1 Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-band EQ boost or cut.",
        "type": "knob"
      },
      {
        "name": "Comp Threshold",
        "range": "-60 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Determines the signal level at which compressor engagement begins.",
        "type": "knob"
      },
      {
        "name": "Comp Ratio",
        "range": "1:1 to 20:1",
        "defaultVal": "1:1",
        "description": "Sets the compression slope ratio.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the Precision Channel Strip as an ultra-low DSP utility option on background vocal groups, dialing in a gentle 2:1 ratio and high-pass filtering around 120 Hz.",
      "Engage the EQ's narrow Q factor to surgically notch out problematic resonances on acoustic instruments during live tracking."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad roland re-201 tape delay",
    "displayName": "UAD Roland RE-201 Tape Delay",
    "category": "Reverbs & Delays",
    "description": "An authentic emulation of the legendary 1974 Roland RE-201 Space Echo tape delay. It perfectly captures the warm tape saturation, mechanical wow and flutter, multi-head configurations, and the unique pitch-warping self-oscillation that has defined countless dub, rock, and ambient recordings.",
    "hardwareModel": "Roland RE-201 Space Echo",
    "parameters": [
      {
        "name": "Mode Selector",
        "range": "1 to 12",
        "defaultVal": "1",
        "description": "Selects the operational combinations of tape playback heads and spring reverb.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12"
        ]
      },
      {
        "name": "Repeat Rate",
        "range": "Slow to Fast",
        "defaultVal": "Medium",
        "description": "Controls the rotational tape speed to adjust delay time.",
        "type": "knob"
      },
      {
        "name": "Intensity",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Adjusts feedback repetition amounts, enabling self-oscillation at high settings.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set the Mode Selector to 5 or 11 to combine multiple playback tape heads, creating rhythmic, syncopated echo patterns perfect for guitars or synthesizers.",
      "Turn Intensity up past 7 on vocals during transitions to drive the tape loop into rich, glorious, self-oscillating pitch-bends, then back off to prevent total feedback."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad roland dimension d chorus",
    "displayName": "UAD Roland Dimension D Chorus",
    "category": "Reverbs & Delays",
    "description": "A pristine emulation of the legendary Roland SDD-320 Dimension D spatial enhancer. Unlike traditional warbly choruses, the Dimension D provides a subtle, phase-coherent stereo widening effect that adds air, width, and depth without sounding overly processed or detuned.",
    "hardwareModel": "Roland SDD-320 Dimension D",
    "parameters": [
      {
        "name": "Dimension Mode",
        "range": "Off / 1 / 2 / 3 / 4",
        "defaultVal": "Off",
        "description": "Selects spatial enhancement preset intensity levels or turns circuit off.",
        "type": "select",
        "options": [
          "Off",
          "1",
          "2",
          "3",
          "4"
        ]
      },
      {
        "name": "Input Mode",
        "range": "Mono / Stereo",
        "defaultVal": "Stereo",
        "description": "Selects input channel processing topology.",
        "type": "switch",
        "options": [
          "Mono",
          "Stereo"
        ]
      }
    ],
    "proTips": [
      "Press buttons 1 and 4 simultaneously to unlock the unique 'secret' mode that yields a deeper, more dramatic stereo image on synth pads and backing vocals.",
      "Insert on a mono acoustic guitar or lead vocal to widen the sound across the stereo spectrum cleanly, maintaining perfect mono compatibility."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad roland ce-1 chorus",
    "displayName": "UAD Roland CE-1 Chorus",
    "category": "Guitar & Bass",
    "description": "A masterful emulation of the historic 1976 Roland CE-1 Chorus Ensemble pedal, the circuit that birthed the legendary Boss chorus sound. Known for its lush, warm analog bucket-brigade delay (BBD) chorusing and deep, liquid vibrato, it adds unmistakable vintage flavor and organic pitch modulation.",
    "hardwareModel": "Roland CE-1 Chorus Ensemble",
    "parameters": [
      {
        "name": "Mode Selector",
        "range": "Chorus / Vibrato",
        "defaultVal": "Chorus",
        "description": "Toggles active circuit between chorus spatializing and direct pitch vibrato.",
        "type": "switch",
        "options": [
          "Chorus",
          "Vibrato"
        ]
      },
      {
        "name": "Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls depth of chorus sweep or vibrato speed.",
        "type": "knob"
      },
      {
        "name": "Depth",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Adjusts the physical width of the vibrato circuit.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Switch the mode to Vibrato, dial Depth to 4 and Intensity to 6 on electric pianos to emulate the classic, wobbling Rhodes speaker movement.",
      "Drive the Input Level control until the clip light blinks occasionally on clean guitars to get the signature warm, slightly saturated BBD preamp color."
    ],
    "authorizationStatus": "Demo not started"
  }
];
