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
    "name": "uad la-6176 signature channel strip",
    "displayName": "UAD LA-6176 Signature Channel Strip",
    "category": "Channel Strips",
    "description": "The premier physical emulation of Universal Audio's premier 6176 hardware channel strip. It combines the legendary, warm, harmonic-rich 610-B tube preamplifier and dual-shelving EQ with the ultra-fast, aggressive FET-based dynamic control of the iconic 1176LN Limiting Amplifier in a single, versatile, and highly responsive channel path.",
    "hardwareModel": "Universal Audio 6176 Vintage Channel Strip",
    "parameters": [
      {
        "name": "Preamp Source & Impedance",
        "range": "Mic 500 Ω / Mic 2.0 kΩ / Line 13.8 kΩ / Hi-Z 47 kΩ / Hi-Z 2.2 MΩ",
        "defaultVal": "Mic 2.0 kΩ",
        "type": "select",
        "options": [
          "Mic 500 Ω",
          "Mic 2.0 kΩ",
          "Line 13.8 kΩ",
          "Hi-Z 47 kΩ",
          "Hi-Z 2.2 MΩ"
        ],
        "description": "Sets the input source type and input impedance load. Lowering microphone impedance to 500 Ω darkens and heavily saturates passive mics."
      },
      {
        "name": "Preamp Gain",
        "range": "-10 dB / -5 dB / 0 dB / +5 dB / +10 dB",
        "defaultVal": "0 dB",
        "type": "switch",
        "options": [
          "-10 dB",
          "-5 dB",
          "0 dB",
          "+5 dB",
          "+10 dB"
        ],
        "description": "Stepped coarse input gain control of the 610 tube circuit stage."
      },
      {
        "name": "Preamp Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "type": "knob",
        "description": "Continuous level potentiometer that drives the incoming signal into the 12AX7 and 12AT7 preamp tubes."
      },
      {
        "name": "Input Pad",
        "range": "Off / -15 dB",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "-15 dB"
        ],
        "description": "Introduces a passive -15 dB attenuation pad on the microphone input to prevent overload."
      },
      {
        "name": "Phase Reverse",
        "range": "Normal / Inverted",
        "defaultVal": "Normal",
        "type": "select",
        "options": [
          "Normal",
          "Inverted"
        ],
        "description": "Reverses signal polarity by 180 degrees to resolve multi-mic alignment issues."
      },
      {
        "name": "High EQ Frequency",
        "range": "4.5 kHz / 7.0 kHz / 10 kHz",
        "defaultVal": "10 kHz",
        "type": "select",
        "options": [
          "4.5 kHz",
          "7.0 kHz",
          "10 kHz"
        ],
        "description": "Selects the high-shelving equalizer band's corner frequency."
      },
      {
        "name": "High EQ Gain",
        "range": "-9 dB to +9 dB",
        "defaultVal": "0 dB",
        "type": "knob",
        "description": "Sets continuous boost or cut gain level for the high EQ shelving band."
      },
      {
        "name": "Low EQ Frequency",
        "range": "70 Hz / 100 Hz / 200 Hz",
        "defaultVal": "100 Hz",
        "type": "select",
        "options": [
          "70 Hz",
          "100 Hz",
          "200 Hz"
        ],
        "description": "Selects the low-shelving equalizer band's corner frequency."
      },
      {
        "name": "Low EQ Gain",
        "range": "-9 dB to +9 dB",
        "defaultVal": "0 dB",
        "type": "knob",
        "description": "Sets continuous boost or cut gain level for the low EQ shelving band."
      },
      {
        "name": "Routing Mode",
        "range": "Split / Join",
        "defaultVal": "Join",
        "type": "select",
        "options": [
          "Split",
          "Join"
        ],
        "description": "In 'Join' mode, the 610 preamp output directly feeds the 1176 compressor. In 'Split' mode, both modules act as independent mono devices."
      },
      {
        "name": "1176 Input Level",
        "range": "0 to 40",
        "defaultVal": "20",
        "type": "knob",
        "description": "Adjusts the input level entering the 1176LN circuit. Since threshold is fixed, driving the input increases compression depth."
      },
      {
        "name": "1176 Output Level",
        "range": "0 to 40",
        "defaultVal": "20",
        "type": "knob",
        "description": "Adjusts final output makeup gain of the class-A line amplifier."
      },
      {
        "name": "1176 Ratio",
        "range": "1:1 / 4:1 / 8:1 / 12:1 / 20:1 / All-Button",
        "defaultVal": "4:1",
        "type": "select",
        "options": [
          "1:1",
          "4:1",
          "8:1",
          "12:1",
          "20:1",
          "All-Button"
        ],
        "description": "Sets compression ratio. '1:1' bypasses dynamic gain reduction while passing audio through active circuitry. 'All-Button' activates British Mode."
      },
      {
        "name": "1176 Attack Time",
        "range": "1 to 7 (800 µs to 20 µs)",
        "defaultVal": "3",
        "type": "knob",
        "description": "Sets compressor attack time. Control is inverted: 1 is the slowest (800 microseconds) and 7 is the fastest (20 microseconds)."
      },
      {
        "name": "1176 Release Time",
        "range": "1 to 7 (1100 ms to 50 ms)",
        "defaultVal": "5",
        "type": "knob",
        "description": "Sets compressor release time. Control is inverted: 1 is the slowest (1.1 seconds) and 7 is the fastest (50 milliseconds)."
      },
      {
        "name": "VUMeter Source",
        "range": "GR / Out +4 / Out +8",
        "defaultVal": "GR",
        "type": "select",
        "options": [
          "GR",
          "Out +4",
          "Out +8"
        ],
        "description": "Toggles VU meter to monitor gain reduction level or average output level calibrated at +4 or +8 dBm."
      }
    ],
    "proTips": [
      "For a classic, gritty indie rock vocal, set 'Preamp Source' to 'Mic 500 Ω' (to load the mic heavily), push 'Preamp Gain' to '+5 dB', and dial 'Preamp Level' to 7 or 8. This drives the dual-triode tube stage into thick, harmonic saturation before hitting the compressor.",
      "To get the famous 'drum room smash', set 'Routing Mode' to 'Join', select '1176 Ratio' as 'All-Button' (British Mode), and set both '1176 Attack Time' and '1176 Release Time' to '7' (fastest). Drive '1176 Input Level' to 30 for explosive, pumpy, high-energy room transients.",
      "Use 'Split' mode in the studio or software to run the 610 tube preamp on one channel (e.g. tracking a dry guitar) while using the 1176 section as a standalone external insert processor for bass guitar on another channel."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad antares auto-tune realtime x",
    "displayName": "UAD Antares Auto-Tune Realtime X",
    "category": "Dynamics",
    "description": "The industry-standard real-time pitch correction engine running with sub-millisecond latency on Apollo DSP hardware. Offers precise, instant tuning, classic pitch-glide effects, advanced formant correction, and intelligent humanization algorithms to correct pitch transparently or create dramatic vocal transformations in real time.",
    "hardwareModel": "Antares Auto-Tune Hardware DSP Engine & Algorithm",
    "parameters": [
      {
        "name": "Input Type",
        "range": "Soprano / Alto/Tenor / Low Male / Instrument / Bass",
        "defaultVal": "Alto/Tenor",
        "type": "select",
        "options": [
          "Soprano",
          "Alto/Tenor",
          "Low Male",
          "Instrument",
          "Bass"
        ],
        "description": "Matches the pitch tracking algorithm to the input source's register for optimal, glitch-free pitch detection."
      },
      {
        "name": "Key",
        "range": "C / C# / D / D# / E / F / F# / G / G# / A / A# / B",
        "defaultVal": "C",
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
        ],
        "description": "Sets the root key of the pitch correction scale."
      },
      {
        "name": "Scale",
        "range": "Chromatic / Major / Minor / Pentatonic / Minor Blues / Whole Tone",
        "defaultVal": "Chromatic",
        "type": "select",
        "options": [
          "Chromatic",
          "Major",
          "Minor",
          "Pentatonic",
          "Minor Blues",
          "Whole Tone"
        ],
        "description": "Selects the musical scale to which the vocal notes will be pulled."
      },
      {
        "name": "Retune Speed",
        "range": "0 ms to 400 ms",
        "defaultVal": "20 ms",
        "type": "knob",
        "description": "Sets how quickly Auto-Tune pulls the input pitch to the target scale notes. 0 ms is instantaneous (robotic), while 20-80 ms preserves natural pitch gestures."
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "0",
        "type": "knob",
        "description": "Allows natural pitch expression by ignoring safe, expressive microtonal drifts and only applying correction when the singer gets too close to scale boundaries."
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "type": "knob",
        "description": "Applies selective, dynamic speed reduction on long, sustained vocal notes to preserve natural vibrato and organic decay."
      },
      {
        "name": "Formant Correction",
        "range": "Off / On",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "On"
        ],
        "description": "When enabled, preserves the singer's natural throat resonance across large pitch transpositions to prevent the 'chipmunk' or 'giant' effect."
      },
      {
        "name": "Throat Length",
        "range": "50% to 150%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Adjusts the virtual vocal tract's physical volume. Lower values make the voice lighter and brighter; higher values add chest resonance and depth."
      },
      {
        "name": "Detune",
        "range": "430.0 Hz to 450.0 Hz",
        "defaultVal": "440.0 Hz",
        "type": "knob",
        "description": "Calibrates the target reference frequency of A4. Crucial for matching pitch correction with instruments tuned outside standard A=440."
      },
      {
        "name": "Tracking / Relax",
        "range": "1 to 100",
        "defaultVal": "50",
        "type": "knob",
        "description": "Controls how relaxed the pitch tracker is. Higher values prevent flutter on noisy, breathy, or throat-heavy vocals, while lower values offer rapid, raw tracking."
      },
      {
        "name": "Natural Vibrato",
        "range": "-12 to +12",
        "defaultVal": "0",
        "type": "knob",
        "description": "Attenuates or amplifies the singer's natural, organic vibrato depth without modifying their timing."
      },
      {
        "name": "Correction Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Blends the raw, dry input signal with the pitch-corrected signal for subtle, multi-voice or parallel tuning."
      }
    ],
    "proTips": [
      "For the iconic modern trap or hyperpop vocal effect, set 'Retune Speed' to 0 ms, disable both 'Flex-Tune' and 'Humanize', and keep 'Formant Correction' 'Off'. This locks the pitch instantaneously with highly stylized, robotic transitions.",
      "To achieve transparent, 'unheard' vocal tuning, set 'Retune Speed' to 20-50 ms, increase 'Flex-Tune' to 40-60%, and dial in 'Humanize' to 30%. This allows natural pitch slides and subtle expressive drifts to pass untouched while catching obvious flat/sharp notes.",
      "Activate 'Formant Correction' and adjust 'Throat Length' to 110-115% to add physical weight, depth, and masculine chest resonance to thin vocals, or set it to 85-92% to make a backing vocal sound lighter, airy, and feminine."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad hemisphere mic collection",
    "displayName": "UAD Hemisphere Mic Collection",
    "category": "Preamps & Microphones",
    "description": "The state-of-the-art microphone modeling system designed specifically for UA microphones. Recreates the legendary sound of vintage dynamic, ribbon, and condenser mics, complete with adjustable proximity, off-axis rotation modeling, and custom filter slopes.",
    "hardwareModel": "UA Standard Microphones & Custom Modeling DSP",
    "parameters": [
      {
        "name": "Mic Model",
        "range": "LD-87 / LD-47 / LD-67 / LD-251 / LD-12 / DN-7 / DN-57 / DN-421 / DN-441 / RB-121 / RB-4038",
        "defaultVal": "LD-87",
        "type": "select",
        "options": [
          "LD-87",
          "LD-47",
          "LD-67",
          "LD-251",
          "LD-12",
          "DN-7",
          "DN-57",
          "DN-421",
          "DN-441",
          "RB-121",
          "RB-4038"
        ],
        "description": "Selects the specific physical microphone model to emulate, recreating its distinct frequency response, transient behavior, and polar pattern characteristics."
      },
      {
        "name": "Proximity",
        "range": "-50% to +150%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Digitally models the physical distance from the source. Turn clockwise to increase bass proximity buildup; turn counter-clockwise to attenuate low-end mud."
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 50 Hz / 80 Hz / 120 Hz",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "80 Hz",
          "120 Hz"
        ],
        "description": "Engages low-frequency roll-off to clean up structural rumble, customized to the acoustic filter slopes of the selected microphone model."
      },
      {
        "name": "Axis",
        "range": "0° to 180°",
        "defaultVal": "0°",
        "type": "knob",
        "description": "Simulates angling the microphone away from the source (0° to 180° off-axis) to capture a more mellow frequency response and tame harsh high-end sibilance."
      },
      {
        "name": "Phase Polarity",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ],
        "description": "Inverts the electrical phase polarity of the microphone signal to prevent multi-mic phase cancellation."
      },
      {
        "name": "Output Gain",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Stages clean output makeup gain from the emulation engine before sending the signal downstream."
      }
    ],
    "proTips": [
      "To tame an excessively harsh, bright acoustic guitar or a sibilant vocalist, adjust the 'Axis' knob clockwise (around 30°-60°). This virtually rotates the microphone off-axis, naturally smoothing out high-frequency transients without needing heavy EQ.",
      "When dual-miking a snare drum, load Hemisphere on both the top and bottom mics. Use 'DN-57' on top and bottom, but switch the bottom mic's 'Phase Polarity' to 'Invert' to prevent low-end hollow phase cancellation.",
      "For dry, warm, intimate vocals, select 'LD-47' or 'LD-251' and increase 'Proximity' to 120%. This emulates the classic proximity effect of a singer getting close to a high-end tube condenser, adding deep chest resonance."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad c-suite c-max limiter",
    "displayName": "UAD C-Suite C-Max Limiter",
    "category": "Dynamics",
    "description": "A high-performance digital brickwall limiter developed by C-Suite Audio for real-time tracking, live streaming, and high-fidelity mastering. It merges transparent peak-limiting algorithms with dynamic transient preservation and a continuous character clipper to deliver maximum competitive loudness without high-frequency softening.",
    "hardwareModel": "C-Suite Audio DSP Mastering Limiter Design",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-30.0 dB to 0.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Pulls down the operational brickwall limiting threshold, automatically applying compensating makeup gain to increase perceived loudness."
      },
      {
        "name": "Ceiling",
        "range": "-2.00 dB to 0.00 dB",
        "defaultVal": "-0.20 dB",
        "type": "knob",
        "description": "Determines the absolute maximum peak output level allowed to leave the limiter, ensuring digital safety margins."
      },
      {
        "name": "Release",
        "range": "1.0 ms to 1000.0 ms",
        "defaultVal": "100.0 ms",
        "type": "knob",
        "description": "Controls the gain-recovery speed after a peak transient triggers attenuation, allowing fine-tuning between modern punch and organic decay."
      },
      {
        "name": "Character",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "type": "knob",
        "description": "Interpolates the limiting curve behavior. At 0%, the limiting is completely transparent; turning clockwise toward 100% blends in soft-clipping saturation to retain click transients."
      }
    ],
    "proTips": [
      "To master punchy, modern genres like EDM or Trap, dial the 'Character' knob up to 60-80%. This smoothly blends the transparent brickwall limiter into a fast soft-clipper, letting you push transient-heavy material 1.5-2 dB hotter before digital distortion becomes audible.",
      "Always set the 'Ceiling' parameter to -1.00 dB when prepping files for digital streaming platforms. This creates a critical headroom margin to prevent lossy conversion codecs (like MP3, AAC, or OGG) from clipping during playback.",
      "Place a high-quality tape emulator (such as the Studer A800) directly before the C-Max Limiter. Setting the tape machine to tape-compress transients by 1-2 dB softens high peaks naturally, allowing C-Max to work far more transparently on the master bus."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad hitsville reverb chambers",
    "displayName": "UAD Hitsville Reverb Chambers",
    "category": "Reverbs & Delays",
    "description": "Recreates the legendary, chart-topping acoustic reverb chambers located in the attic of Motown's historic Hitsville U.S.A. studios. Meticulously modeled on the custom drywall, plaster, and concrete spaces, it delivers original vintage speaker playback and physical microphone capture configurations that shaped the iconic '60s Motown sound.",
    "hardwareModel": "Hitsville U.S.A. Attic Reverb Chambers (Chamber 1 & 2)",
    "parameters": [
      {
        "name": "Chamber Select",
        "range": "Chamber 1 / Chamber 2",
        "defaultVal": "Chamber 2",
        "type": "switch",
        "options": [
          "Chamber 1",
          "Chamber 2"
        ],
        "description": "Selects between the two physical attic chambers: Chamber 1 (primarily used for instrumentation) and Chamber 2 (tailored for lead vocals)."
      },
      {
        "name": "Speaker Select",
        "range": "Original / Modern",
        "defaultVal": "Original",
        "type": "switch",
        "options": [
          "Original",
          "Modern"
        ],
        "description": "Toggles the sound source speaker inside the chamber between the vintage Altec/University horn drivers and high-fidelity modern studio monitors."
      },
      {
        "name": "Microphone",
        "range": "KM86 / U67 / D24",
        "defaultVal": "KM86",
        "type": "select",
        "options": [
          "KM86",
          "U67",
          "D24"
        ],
        "description": "Selects the custom capsule capture mic used inside the space: Neumann KM86 condenser, Neumann U67 tube, or Electro-Voice D24 dynamic."
      },
      {
        "name": "Mic Position",
        "range": "Near / Far",
        "defaultVal": "Far",
        "type": "switch",
        "options": [
          "Near",
          "Far"
        ],
        "description": "Determines physical microphone placement relative to the speaker, controlling the ratio of direct horn-drive to diffuse room acoustics."
      },
      {
        "name": "Decay",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "type": "knob",
        "description": "Varies the electronic and acoustic absorption parameters to scale the virtual reverberation decay time."
      },
      {
        "name": "Pre-delay",
        "range": "0.0 ms to 100.0 ms",
        "defaultVal": "10.0 ms",
        "type": "knob",
        "description": "Introduces a digital timing offset before signal enters the chamber, separating the dry transient from the bloom of the reverb."
      },
      {
        "name": "Low EQ",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Applies a classic Motown-style low-shelf equalization curve to shape the low-end mud or warm resonance of the reverb signal."
      },
      {
        "name": "Mid EQ",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Sweeps a custom mid-band bell filter to emphasize or attenuate the vocal presence frequencies within the chamber."
      },
      {
        "name": "High EQ",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Applies a high-frequency shelving filter to dial in modern sheen or maintain dark, vintage authenticity."
      },
      {
        "name": "Width",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Adjusts the stereo image width of the dual-microphone chamber capture, from pure center mono to ultra-wide stereo."
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0.0% to 100.0%",
        "defaultVal": "100.0%",
        "type": "knob",
        "description": "Controls the balance between the dry direct signal and the wet reverberated acoustic return."
      }
    ],
    "proTips": [
      "For the signature Motown vocal sound: load Chamber 2, select the KM86 microphone, set Mic Position to 'Far', and use the original speakers. Add about 15.0 ms of Pre-delay to separate the lead vocal transient from the reverb tail.",
      "To add rich, vintage depth to horn sections or backing vocals without muddying the mix, use Chamber 1, set Mic Position to 'Near', and aggressively roll off the 'Low EQ' by -6.0 dB to clean up low-mid build-up.",
      "When using Hitsville Reverb Chambers as a stereo aux return, keep 'Wet/Dry Mix' at 100.0% and push the 'Width' parameter fully clockwise. This delivers an expansive, immersive stereo field that beautifully wraps around center-panned dry elements."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad c-suite c-axe guitar noise suppressor",
    "displayName": "UAD C-Suite C-Axe Guitar Noise Suppressor",
    "category": "Guitar & Bass",
    "description": "A dedicated, dynamic noise suppressor engineered specifically for electric guitar and bass players. Running with ultra-low latency, it tracks signal envelope dynamics to transparently suppress single-coil hum, 60Hz electromagnetic interference, and heavy high-gain amp hiss without compromising pick-attack transients, palm-mute chunk, or natural feedback sustain.",
    "hardwareModel": "C-Suite Audio DSP Guitar Noise Suppressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-80.0 dB to 0.0 dB",
        "defaultVal": "-50.0 dB",
        "type": "knob",
        "description": "Sets the operational decibel threshold below which dynamic noise suppression and expansion engage."
      },
      {
        "name": "Attenuation",
        "range": "0.0 dB to -40.0 dB",
        "defaultVal": "-20.0 dB",
        "type": "knob",
        "description": "Determines the maximum amount of noise reduction applied to the signal floor when the guitar is not playing."
      },
      {
        "name": "Recovery Speed",
        "range": "Fast to Slow",
        "defaultVal": "Medium",
        "type": "knob",
        "description": "Fine-tunes the release and recovery timing of the suppression engine, allowing quick damping for tight rhythmic work or slow release for solos."
      },
      {
        "name": "Suppression Mode",
        "range": "Gate / Clean / High-Gain",
        "defaultVal": "High-Gain",
        "type": "select",
        "options": [
          "Gate",
          "Clean",
          "High-Gain"
        ],
        "description": "Selects the optimized DSP algorithm: 'Gate' for clinical hard gating, 'Clean' for gentle downward expansion, or 'High-Gain' for heavy-distortion hiss tracking."
      }
    ],
    "proTips": [
      "Always insert C-Axe in the very first slot of your guitar signal chain. Suppressing noise before it hits high-gain amp simulators, compressors, or distortion pedals prevents background hum from being amplified into an uncontrollable roar.",
      "For rapid palm-muted riffs, set 'Recovery Speed' toward 'Fast' so that the noise floor is immediately ducked between notes. For sustaining blues leads or ambient reverb-drenched lines, adjust it toward 'Slow' to prevent natural note decay from being chopped off.",
      "Use 'Clean' mode for acoustic guitars or pristine clean electric tones. It utilizes a soft, non-intrusive expander ratio that smoothly reduces preamp hiss and finger squeaks while maintaining organic pick dynamics and transient transparency."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad hitsville eq collection",
    "displayName": "UAD Hitsville EQ Collection",
    "category": "Equalizers",
    "description": "An exquisite emulation of the custom-built, passive graphic equalizers designed by Motown engineers to carve out the punchy, midrange-forward character of the Hitsville catalog. It includes both the original 7-band channel EQ and the dual-channel mastering equalizer for cohesive vintage vibe and stereo control.",
    "hardwareModel": "Hitsville Custom passive inductor Equalizers",
    "parameters": [
      {
        "name": "EQ Model",
        "range": "Graphic / Mastering",
        "defaultVal": "Graphic",
        "type": "switch",
        "options": [
          "Graphic",
          "Mastering"
        ],
        "description": "Switches between the original 7-band graphic channel equalizer and the expanded dual-channel mastering EQ."
      },
      {
        "name": "50 Hz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls low-end power and sub-bass weight with broad, passive inductor-based curves."
      },
      {
        "name": "130 Hz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Shapes the upper-bass and low-mid warmth, perfect for dialing in bass guitar body and snare weight."
      },
      {
        "name": "320 Hz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Attenuates mid-range boxiness or boosts to inject thick vintage body around 320 Hz."
      },
      {
        "name": "800 Hz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the critical 800 Hz band, the focal point of the iconic punchy, midrange-forward Motown sound."
      },
      {
        "name": "2 kHz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls vocal bite, presence, and horn section articulation in the upper midrange."
      },
      {
        "name": "5 kHz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Determines guitar crunch, drum snap, and overall high-frequency definition at 5 kHz."
      },
      {
        "name": "12.5 kHz Gain",
        "range": "-8.0 dB to +8.0 dB (Stepped)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Boosts to add silky analog air and high-frequency sheen or cuts to eliminate excessive sibilance."
      },
      {
        "name": "Channel Mode",
        "range": "Stereo / Dual Mono / Mid-Side",
        "defaultVal": "Stereo",
        "type": "switch",
        "options": [
          "Stereo",
          "Dual Mono",
          "Mid-Side"
        ],
        "description": "Configures channel routing for the Mastering EQ, enabling independent Mid/Side or left/right processing."
      },
      {
        "name": "Input Gain",
        "range": "-8.0 dB to +8.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts input signal level driving into the passive EQ filter circuitry."
      },
      {
        "name": "Output Gain",
        "range": "-8.0 dB to +8.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts final output signal level to achieve clean volume matching."
      }
    ],
    "proTips": [
      "The original Hitsville graphic EQ uses passive inductor-based filters that have a highly musical, wide Q. To emulate the iconic Motown vocal presence, aggressively boost 800 Hz and 2 kHz by 2 to 3 dB. This carves out a forward, punchy signature that cuts through dense mixes even on low-fidelity speakers.",
      "When using the Hitsville EQ Mastering plugin, switch 'Channel Mode' to 'Mid-Side' (M/S). Try boosting the 12.5 kHz band on the Side channel by 1.0 or 1.5 dB to expand the ambient high-frequency width and air of the mix without making the center-panned lead vocal overly harsh.",
      "To give a thin bass guitar or bass synth authentic vintage 'roundness,' apply a 2 to 3 dB boost at 50 Hz and a subtle 1 dB boost at 130 Hz. Since the passive filters interact beautifully, this creates a cohesive low-end foundation that feels warm and saturated rather than muddy."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ams dmx 15-80 s digital delay and pitch shifter",
    "displayName": "UAD AMS DMX 15-80 S Digital Delay and Pitch Shifter",
    "category": "Reverbs & Delays",
    "description": "A meticulous emulation of the world's first microprocessor-controlled, 15-bit stereo digital delay and pitch shifter. Renowned for its unique high-frequency sheen, grit, and incredible widening, it brings the distinct character and pitch-shifted space of 1980s music production directly to your DAW.",
    "hardwareModel": "AMS Custom Microprocessor 15-Bit Delay & Pitch Shifter",
    "parameters": [
      {
        "name": "Delay L",
        "range": "0 ms to 6500 ms",
        "defaultVal": "250 ms",
        "type": "knob",
        "description": "Sets the delay time for Left (Channel A) with millisecond precision, replicating the classic dual-delay board memory expansion."
      },
      {
        "name": "Delay R",
        "range": "0 ms to 6500 ms",
        "defaultVal": "350 ms",
        "type": "knob",
        "description": "Sets the delay time for Right (Channel B) with millisecond precision."
      },
      {
        "name": "Feedback L",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "type": "knob",
        "description": "Determines the amount of regeneration fed back into Left Channel A."
      },
      {
        "name": "Feedback R",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "type": "knob",
        "description": "Determines the amount of regeneration fed back into Right Channel B."
      },
      {
        "name": "Pitch Ratio L",
        "range": "0.900 to 1.100",
        "defaultVal": "1.000",
        "type": "knob",
        "description": "Adjusts pitch transposition for the left channel as a precise ratio. Recreates the legendary hardware ratio display (e.g., 1.015 for +15 cents)."
      },
      {
        "name": "Pitch Ratio R",
        "range": "0.900 to 1.100",
        "defaultVal": "1.000",
        "type": "knob",
        "description": "Adjusts pitch transposition for the right channel as a precise ratio, perfect for standard stereo widening."
      },
      {
        "name": "VCO Speed",
        "range": "0.1 Hz to 20.0 Hz",
        "defaultVal": "1.0 Hz",
        "type": "knob",
        "description": "Controls the frequency of the low-frequency oscillator modulating the delay times for deep chorus or subtle movement."
      },
      {
        "name": "VCO Depth",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "type": "knob",
        "description": "Sets the depth of delay modulation, driving tape-like wow, flutter, and organic pitch-swept chorus."
      },
      {
        "name": "Mix",
        "range": "0% to 100% Wet",
        "defaultVal": "50%",
        "type": "knob",
        "description": "Provides precise dry/wet balance, allowing insertion directly on an aux bus or a lead track."
      },
      {
        "name": "Input Level",
        "range": "-inf to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Calibrates the incoming signal hitting the unique 15-bit converters, driving vintage warmth and analog saturation."
      },
      {
        "name": "Output Level",
        "range": "-inf to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts the final output gain to keep level consistency during heavy delay and pitch transposition."
      }
    ],
    "proTips": [
      "To dial in the legendary 'Stereo Widening' effect that defined 80s lead vocals (the 'Micro-Pitch' patch), set Left Delay to 15-20 ms and Pitch Ratio L to 1.009 (approx +9 cents). Set Right Delay to 30-35 ms and Pitch Ratio R to 0.991 (approx -9 cents). Keep Feedback at 0% and set the Mix to around 30% Wet. This produces a huge, lush stereo image that never gets muddy.",
      "Activate the VCO delay modulation on high-feedback settings to generate a vintage tape-style modulated echo. Setting 'VCO Speed' around 0.5 Hz and 'VCO Depth' around 15% will cause the pitch of repeats to slowly drift and wobble, simulating the mechanical variations of vintage tape delay.",
      "For avant-garde pitch-shift spirals, set Delay L to 400 ms, Pitch Ratio L to 1.059 (transposing up a semitone), and Feedback L to 65%. Every time the delay regenerates, the pitch will step up progressively, creating a brilliant, cascading soundscape that ascends into space."
    ],
    "authorizationStatus": "Demo expired"
  },
  {
    "name": "uad manley reference microphone preamplifier",
    "displayName": "UAD Manley Reference Microphone Preamplifier",
    "category": "Preamps & Microphones",
    "description": "An authentic emulation of the legendary Manley high-end tube preamplifier circuitry. Recreating the luxurious, high-voltage Class-A vacuum tube design, it delivers exceptional warmth, sweet high-end triode tube saturation, and rich harmonic depth. Running in Apollo's Unison preamp slots, it matches the physical input impedance, custom transformer gain staging, and exact circuit behaviors of the classic hardware, providing a premium analog front-end for vocals and acoustic instruments.",
    "hardwareModel": "Manley Dual Mono Class-A Tube Microphone Preamplifier",
    "parameters": [
      {
        "name": "Gain",
        "range": "40.0 dB to 60.0 dB (5 dB Steps)",
        "defaultVal": "40.0 dB",
        "type": "select",
        "options": [
          "40 dB",
          "45 dB",
          "50 dB",
          "55 dB",
          "60 dB"
        ],
        "description": "Sets the coarse triode tube amplification level in 5 dB increments, altering the feedback, gain staging, and primary headroom of the tube circuit."
      },
      {
        "name": "Attenuate",
        "range": "0.0 dB to -24.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "A continuously variable passive input attenuator positioned before the first tube stage to control the level hitting the circuit."
      },
      {
        "name": "Low Cut",
        "range": "Flat / 80 Hz / 120 Hz",
        "defaultVal": "Flat",
        "type": "select",
        "options": [
          "Flat",
          "80 Hz",
          "120 Hz"
        ],
        "description": "Selects the high-pass filter cutoff frequency (12 dB per octave slope) to eliminate unwanted low-frequency rumble and wind noise."
      },
      {
        "name": "Phase",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ],
        "description": "Inverts the phase polarity of the microphone preamplifier signal by 180 degrees."
      }
    ],
    "proTips": [
      "For pristine, clean vocal tracking with maximum headroom, set the 'Gain' to 40 dB and use the continuously variable 'Attenuate' knob to control your peak level. This maintains maximum transient transparency.",
      "To drive the input triode stage into lush tube saturation and inject thick analog warmth into acoustic guitars or vocals, crank the 'Gain' switch to 50 dB or 55 dB and back down the passive 'Attenuate' knob to about -10 dB.",
      "Always engage the 80 Hz Low Cut filter on lead vocal sessions. This cleanly rolls off sub-bass rumble and mic stand thumps without compromising the warm body or vocal resonance of the singer."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad api vision channel strip collection",
    "displayName": "UAD API Vision Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The definitive emulation of API's flagship analog console modules, capturing the punchy, high-headroom, and aggressive solid-state character that defined modern American rock and pop. Powered by Unison technology, this plugin models the complete signal path of the 212L preamp, the 215L passive sweep filters, the 225L compressor, the 235L gate/expander, and the legendary 550L/560 proportional-Q equalizers to deliver unmatched mid-range bite and transient impact.",
    "hardwareModel": "API Vision Analog Console Modules (212L, 215L, 225L, 235L, 550L/560)",
    "parameters": [
      {
        "name": "212L Preamp Gain",
        "range": "+12.0 dB to +65.0 dB",
        "defaultVal": "+12.0 dB",
        "type": "knob",
        "description": "Sets the input level and drives the classic API 2520 discrete op-amp and custom 2622 input transformer for punchy mid-range harmonic coloration."
      },
      {
        "name": "215L Lo-Cut Filter",
        "range": "20.0 Hz to 600.0 Hz",
        "defaultVal": "20.0 Hz (Off)",
        "type": "knob",
        "description": "Continuously variable high-pass filter (12 dB per octave slope) to clean up sub-bass rumble, with an dedicated active/bypass switch."
      },
      {
        "name": "215L Hi-Cut Filter",
        "range": "1.0 kHz to 20.0 kHz",
        "defaultVal": "20.0 kHz (Off)",
        "type": "knob",
        "description": "Continuously variable low-pass filter (6 dB per octave slope) to smooth out high frequencies."
      },
      {
        "name": "225L Compressor Threshold",
        "range": "-20.0 dBu to +10.0 dBu",
        "defaultVal": "+10.0 dBu",
        "type": "knob",
        "description": "Determines the level at which the compressor begins gain reduction."
      },
      {
        "name": "225L Compressor Ratio",
        "range": "1.0:1 to Inf:1",
        "defaultVal": "2.0:1",
        "type": "knob",
        "description": "Sets the compression ratio, varying from subtle level stabilization to heavy limiting."
      },
      {
        "name": "225L Thrust Switch",
        "range": "Out / In",
        "defaultVal": "Out",
        "type": "switch",
        "options": [
          "Out",
          "In"
        ],
        "description": "Engages API's patented Thrust sidechain filter (2 dB per octave rise starting at 200 Hz), protecting low end power from pumping."
      },
      {
        "name": "225L Compressor Type",
        "range": "Old (Feed-Back) / New (Feed-Forward)",
        "defaultVal": "New (Feed-Forward)",
        "type": "switch",
        "options": [
          "Old (Feed-Back)",
          "New (Feed-Forward)"
        ],
        "description": "Selects between smooth vintage feedback compression or fast modern feed-forward compression."
      },
      {
        "name": "235L Gate Threshold",
        "range": "-80.0 dBu to +10.0 dBu",
        "defaultVal": "-80.0 dBu",
        "type": "knob",
        "description": "Sets the gate or expander open threshold level to isolate source material from background noise."
      },
      {
        "name": "550L/560 EQ Module Selector",
        "range": "550L / 560",
        "defaultVal": "550L",
        "type": "switch",
        "options": [
          "550L",
          "560"
        ],
        "description": "Switches the active equalizer module between the four-band 550L parametric and the ten-band 560 graphic EQ."
      },
      {
        "name": "550L High EQ Freq",
        "range": "2.0 kHz to 20.0 kHz",
        "defaultVal": "10.0 kHz",
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
        ],
        "description": "Selects the frequency of the high-frequency band of the 550L equalizer."
      },
      {
        "name": "550L High EQ Gain",
        "range": "-12.0 dB to +12.0 dB (2 dB Steps)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Boosts or cuts the high-frequency band using the proprietary proportional-Q circuit which narrows bandwidth at higher gains."
      }
    ],
    "proTips": [
      "For punchy acoustic drums and room mics, toggle the 225L Compressor Type to 'New' (feed-forward) mode, engage the 'Thrust' sidechain switch, and select a 4:1 ratio with a fast release to maximize decay and snap.",
      "The 550L parametric EQ uses a Proportional-Q design: small gain changes (e.g., 2 dB) are very wide and musical for sweetening, while larger moves (e.g., 6 dB+) become narrow and surgical for carving out resonances.",
      "Engage the 215L Lo-Cut filter at 80 Hz on snare and toms to aggressively roll off low-end cabinet rumble without sacrificing the punch and body of the drum shell."
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
        "name": "Input Type",
        "range": "Mic / Line",
        "defaultVal": "Mic",
        "type": "switch",
        "options": [
          "Mic",
          "Line"
        ],
        "description": "Switches the preamp circuit impedance and gain structure between Mic-level and Line-level signals."
      },
      {
        "name": "Gain",
        "range": "+12.0 dB to +65.0 dB",
        "defaultVal": "+12.0 dB",
        "type": "knob",
        "description": "Adjusts the input amplification level, driving the virtual API 2520 discrete op-amp and custom transformer into warm solid-state harmonic saturation."
      },
      {
        "name": "Pad",
        "range": "Off / -20.0 dB",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "-20 dB"
        ],
        "description": "Attenuates the incoming analog signal by -20 dB before the input transformer to protect the preamp stage from clipping with hot sources."
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 75.0 Hz",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "75 Hz"
        ],
        "description": "Engages a sharp 12 dB per octave high-pass filter at 75 Hz to cut low-frequency rumble and room vibration."
      },
      {
        "name": "Phase",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ],
        "description": "Inverts the polarity of the input signal by 180 degrees to resolve phase cancellation issues in multi-mic setups."
      },
      {
        "name": "Output Fader",
        "range": "-inf to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the clean output level trim after the preamp circuit to optimize gain-staging into the DAW or virtual mixer."
      }
    ],
    "proTips": [
      "When tracking direct electric bass, drive the Gain control up to 45 dB with the Pad engaged to saturate the API 2520 op-amp, adding thickness and weight to the low-mids.",
      "For drum overheads, leave the Pad off and set Gain to 20 dB to allow the transient peaks of the cymbals to naturally trigger the fast-responding API circuit without clipping.",
      "If you want to inject warm console color on a pre-recorded track, insert this plugin in Line mode and boost the Gain knob until the yellow LEDs illuminate, then pull down the Output Fader to balance the levels."
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
        "type": "knob",
        "description": "Controls the amount of background noise suppression applied to the incoming vocal signal."
      },
      {
        "name": "Ambience",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "type": "knob",
        "description": "Independently controls the attenuation of room reflections and ambient reverberation to dry up live mic tracks."
      },
      {
        "name": "Mode",
        "range": "Vocal / Voice",
        "defaultVal": "Vocal",
        "type": "switch",
        "options": [
          "Vocal",
          "Voice"
        ],
        "description": "Optimizes the internal signal model specifically for musical vocal phrasing or spoken word applications."
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 80 Hz / 120 Hz",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "80 Hz",
          "120 Hz"
        ],
        "description": "Cuts out unwanted low-frequency rumble and wind noise prior to the main suppression algorithms."
      },
      {
        "name": "High Cut Filter",
        "range": "Off / 8 kHz / 12 kHz",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "8 kHz",
          "12 kHz"
        ],
        "description": "Rolls off harsh high-frequency hiss or fan noise to focus the vocal range."
      },
      {
        "name": "Output Trim",
        "range": "-24.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Applies a clean gain trim to the output signal to compensate for level changes caused by noise attenuation."
      }
    ],
    "proTips": [
      "Start with Reduction set at 35% on Vocal mode during live tracking to clean up home studio reflections without deadening the singer's performance or vocal formants.",
      "For podcast recording in untreated rooms, switch to Voice mode, apply an 80 Hz Low Cut Filter, and dial up Reduction to 50% for pristine, broadcast-ready dialogue.",
      "Use the 'Ambience' knob separately from the 'Reduction' knob to attenuate persistent flutter echo or boxy room modes on acoustic guitar and vocal tracks without over-processing."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve dynamics collection",
    "displayName": "UAD Neve Dynamics Collection",
    "category": "Dynamics",
    "description": "An exquisite emulation of classic British Neve diode-bridge dynamics processors. Recreating the iconic Neve 33609 stereo bus compressor/limiter and Neve 2254 mono channel compressor/limiter, it delivers their legendary creamy, round transient response, thick density, and rich harmonic warmth. Ideal for taming drum groups, gluing the master mix bus, or adding vintage analog coloration.",
    "hardwareModel": "Neve 33609 & 2254 Diode-Bridge Limiters/Compressors",
    "parameters": [
      {
        "name": "Dynamics Model",
        "range": "33609 / 2254",
        "defaultVal": "33609",
        "type": "switch",
        "options": [
          "33609",
          "2254"
        ],
        "description": "Selects between the legendary 33609 stereo bus compressor or the creamy, color-rich 2254 mono diode-bridge channel compressor."
      },
      {
        "name": "Compressor Threshold",
        "range": "-20.0 dBu to +10.0 dBu (2 dB Steps)",
        "defaultVal": "+10.0 dBu",
        "type": "knob",
        "description": "Determines the signal level threshold above which the diode-bridge compressor begins gain reduction."
      },
      {
        "name": "Compressor Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 6:1",
        "defaultVal": "3:1",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "6:1"
        ],
        "description": "Selects the compression slope (ratio) of the diode-bridge compressor stage."
      },
      {
        "name": "Compressor Recovery",
        "range": "100 ms to 1.5 s / Auto 1 & 2",
        "defaultVal": "400 ms",
        "type": "select",
        "options": [
          "100 ms",
          "400 ms",
          "800 ms",
          "1.5 s",
          "a1 (Auto 1)",
          "a2 (Auto 2)"
        ],
        "description": "Sets the compressor release time. Auto settings provide program-dependent recovery, ideal for complex stereo program material."
      },
      {
        "name": "Limiter Threshold",
        "range": "+4.0 dBu to +15.0 dBu (0.5 dB Steps)",
        "defaultVal": "+15.0 dBu",
        "type": "knob",
        "description": "Determines the threshold of the secondary, fast-acting peak limiter circuit."
      },
      {
        "name": "Limiter Recovery",
        "range": "50 ms to 800 ms / Auto 1 & 2",
        "defaultVal": "100 ms",
        "type": "select",
        "options": [
          "50 ms",
          "100 ms",
          "200 ms",
          "800 ms",
          "a1 (Auto 1)",
          "a2 (Auto 2)"
        ],
        "description": "Sets the release time of the brickwall limiter stage, allowing clean peak containment."
      },
      {
        "name": "Limiter Attack",
        "range": "Slow (4.0 ms) / Fast (2.0 ms)",
        "defaultVal": "Slow",
        "type": "switch",
        "options": [
          "Slow",
          "Fast"
        ],
        "description": "Selects the speed of the peak limiter attack time, handling fast transients or maintaining natural envelope shape."
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / 180.0 Hz",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "180 Hz"
        ],
        "description": "Engages a 180 Hz high-pass filter in the compressor's detection circuit to prevent heavy low-frequency energy from triggering excessive pumping."
      },
      {
        "name": "Headroom Control",
        "range": "4.0 dB to 28.0 dB",
        "defaultVal": "16.0 dB",
        "type": "knob",
        "description": "Adjusts the internal operating level of the plugin to scale headroom and easily drive the virtual transformers into colorful saturation."
      },
      {
        "name": "Makeup Gain",
        "range": "0.0 dB to +20.0 dB (2 dB Steps)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls output signal volume recovery after gain reduction."
      },
      {
        "name": "Dry/Wet Mix",
        "range": "0.0% to 100.0%",
        "defaultVal": "100.0%",
        "type": "knob",
        "description": "Blends dry (unprocessed) signal with wet (compressed) signal to enable clean parallel diode-bridge compression."
      }
    ],
    "proTips": [
      "To glue a stereo mix bus seamlessly, choose the 33609 model, set the compressor to a 1.5:1 ratio, Recovery to a1 (Auto 1), and dial the Threshold to achieve a subtle 1.5 dB of gain reduction. This provides cohesive, warm vintage density without destroying dynamics.",
      "On a drum sub-mix, select the 2254 model for a thicker, chunkier tone, set Ratio to 4:1, Compressor Recovery to 100 ms, and engage the 180 Hz Sidechain Filter. This drives the drums into warm, pumping energy while preserving kick drum punch.",
      "Utilize parallel compression by slamming the compressor threshold to -10 dBu with a 6:1 ratio, then backing down the 'Dry/Wet Mix' knob to around 30% to inject thick analog weight and room ambience beneath your main drums or vocals."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad neve 1084 preamp and eq",
    "displayName": "UAD Neve 1084 Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "A precise emulation of Neve's classic Class-A channel amplifier with expanded EQ capabilities. Recreating the iconic Class-A Marinair transformer-coupled preamplifier and passive inductor EQ design, the 1084 delivers the legendary British punch, warmth, and harmonic richness. It builds upon the famous 1073 EQ by adding selectable high shelf frequencies, a mid-band High-Q switch, and a high-pass/low-pass filter network for ultimate tone-shaping control.",
    "hardwareModel": "Neve 1084 Channel Amplifier with Inductor EQ",
    "parameters": [
      {
        "name": "Input Type",
        "range": "Mic / Line",
        "defaultVal": "Mic",
        "type": "switch",
        "options": [
          "Mic",
          "Line"
        ],
        "description": "Switches the input signal path impedance and sensitivity range between Mic-level and Line-level sources."
      },
      {
        "name": "Input Gain",
        "range": "-80.0 dB to +10.0 dB (5 dB Steps)",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts the sensitivity level, driving the virtual Class-A Marinair transformer. Mic range spans -80 to -20 dB; Line range spans -20 to +10 dB."
      },
      {
        "name": "High EQ Frequency",
        "range": "10.0 kHz / 12.0 kHz / 16.0 kHz",
        "defaultVal": "12.0 kHz",
        "type": "select",
        "options": [
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ],
        "description": "Selects the target corner frequency for the high-frequency shelving filter, providing a distinct airy top-end character."
      },
      {
        "name": "High EQ Gain",
        "range": "-16.0 dB to +16.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts the boost or cut level of the high shelving filter to add beautiful top-end sheen or reduce harshness."
      },
      {
        "name": "Mid EQ Frequency",
        "range": "0.36 kHz / 0.7 kHz / 1.6 kHz / 3.2 kHz / 4.8 kHz / 7.2 kHz",
        "defaultVal": "1.6 kHz",
        "type": "select",
        "options": [
          "0.36 kHz",
          "0.7 kHz",
          "1.6 kHz",
          "3.2 kHz",
          "4.8 kHz",
          "7.2 kHz"
        ],
        "description": "Sets the center frequency of the peaking mid-band inductor-based equalizer."
      },
      {
        "name": "Mid EQ Gain",
        "range": "-18.0 dB to +18.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the amount of boost or cut applied to the selected midrange frequency band."
      },
      {
        "name": "Mid Q Factor",
        "range": "Normal / High Q",
        "defaultVal": "Normal",
        "type": "switch",
        "options": [
          "Normal",
          "High Q"
        ],
        "description": "Switches the mid-band bandwidth. Normal provides a wide, musical curve; High Q sharpens the filter for surgical notch filtering."
      },
      {
        "name": "Low EQ Frequency",
        "range": "35.0 Hz / 60.0 Hz / 110.0 Hz / 220.0 Hz",
        "defaultVal": "110.0 Hz",
        "type": "select",
        "options": [
          "35 Hz",
          "60 Hz",
          "110 Hz",
          "220 Hz"
        ],
        "description": "Sets the target frequency for the low-frequency shelving filter to manage low-end weight."
      },
      {
        "name": "Low EQ Gain",
        "range": "-16.0 dB to +16.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the boost or cut level of the low shelving filter to shape sub-bass or low midrange body."
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 45.0 Hz / 70.0 Hz / 160.0 Hz / 360.0 Hz",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "45 Hz",
          "70 Hz",
          "160 Hz",
          "360 Hz"
        ],
        "description": "Engages a step high-pass filter to clean up low-frequency rumble, floor vibration, or mic handling noise."
      },
      {
        "name": "Low Pass Filter",
        "range": "Off / 6.0 kHz / 8.0 kHz / 10.0 kHz / 14.0 kHz / 18.0 kHz",
        "defaultVal": "Off",
        "type": "select",
        "options": [
          "Off",
          "6 kHz",
          "8 kHz",
          "10 kHz",
          "14 kHz",
          "18 kHz"
        ],
        "description": "Engages a low-pass filter to roll off unnecessary high-frequency hiss, digital harshness, or cymbal bleed."
      },
      {
        "name": "Phase",
        "range": "Normal / Invert",
        "defaultVal": "Normal",
        "type": "switch",
        "options": [
          "Normal",
          "Invert"
        ],
        "description": "Inverts the signal polarity by 180 degrees to correct phase mismatches in multi-microphone configurations."
      },
      {
        "name": "EQ Bypass",
        "range": "In / Out",
        "defaultVal": "In",
        "type": "switch",
        "options": [
          "In",
          "Out"
        ],
        "description": "Completely bypasses or engages the active equalizer section, leaving the preamp saturation intact when set to Out."
      },
      {
        "name": "Output Trim",
        "range": "-24.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Adjusts the final output level of the channel strip, allowing you to drive the Input Gain heavily for vintage saturation while leveling the signal."
      }
    ],
    "proTips": [
      "Engage High Q on the mid band at 3.2 kHz to carve out narrow, harsh resonance peaks from electric guitars, while preserving the surrounding warm frequencies.",
      "Set High EQ to 16 kHz and boost 2 to 4 dB on acoustic guitars to inject a beautifully soft, expensive-sounding air band that sits perfectly in a pop mix.",
      "Drive the Input Gain to +50 or +60 dB in Mic mode to color a clean vocal track with gorgeous British transformer saturation, then engage the Low Pass Filter at 14 kHz and pull down the Output Trim to sweeten the tone and suppress analog hiss."
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
        "name": "Input Type",
        "range": "Mic / Line / Hi-Z",
        "defaultVal": "Mic",
        "type": "switch",
        "options": [
          "Mic",
          "Line",
          "Hi-Z"
        ],
        "description": "Selects the active input source, adjusting input impedance and circuit path for microphones, line-level gear, or high-impedance instruments."
      },
      {
        "name": "Preamplifier Gain",
        "range": "0.0 dB to +60.0 dB",
        "defaultVal": "30.0 dB",
        "type": "knob",
        "description": "Adjusts the twin-triode vacuum tube preamplifier's input amplification stage to dial in tube warmth and harmonic texture."
      },
      {
        "name": "High Gain Boost",
        "range": "Off / +10.0 dB",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ],
        "description": "Engages an extra +10 dB of clean gain boost inside the tube preamplifier stage, perfect for low-output microphones or extra tube drive."
      },
      {
        "name": "High Pass Filter Freq",
        "range": "Off / 30.0 Hz to 140.0 Hz",
        "defaultVal": "Off",
        "type": "knob",
        "description": "Sets the cutoff frequency of the built-in 18 dB per octave high pass filter to eliminate low-end rumble and mechanical noise."
      },
      {
        "name": "Compressor Threshold",
        "range": "-30.0 dB to +20.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Sets the input level threshold at which the slow-reacting, musical optical compressor begins level attenuation."
      },
      {
        "name": "Compressor Ratio",
        "range": "1.0:1 to 20.0:1",
        "defaultVal": "4.0:1",
        "type": "knob",
        "description": "Determines the compression ratio of the opto-compressor. Low ratios are transparent, while high ratios act as soft-knee limiters."
      },
      {
        "name": "Compressor Attack",
        "range": "2.0 ms to 200.0 ms",
        "defaultVal": "20.0 ms",
        "type": "knob",
        "description": "Sets the attack speed of the opto-circuit, letting transients pass naturally or catching peaks quickly."
      },
      {
        "name": "Compressor Release",
        "range": "100.0 ms to 10.0 s",
        "defaultVal": "500.0 ms",
        "type": "knob",
        "description": "Sets the release time of the optical level detector, allowing smooth level riding."
      },
      {
        "name": "EQ Pre-Compressor",
        "range": "Post-Comp / Pre-Comp",
        "defaultVal": "Post-Comp",
        "type": "switch",
        "options": [
          "Post-Comp",
          "Pre-Comp"
        ],
        "description": "Reorders the signal chain, placing the four-band EQ before the optical compressor in the audio path when set to Pre-Comp."
      },
      {
        "name": "EQ to Compressor Sidechain",
        "range": "Off / On",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ],
        "description": "Links the EQ mid-bands directly into the optical compressor's sidechain circuit to enable de-essing or frequency-dependent compression."
      },
      {
        "name": "Treble EQ Frequency",
        "range": "10.0 kHz / 15.0 kHz / 20.0 kHz / 32.0 kHz",
        "defaultVal": "15.0 kHz",
        "type": "select",
        "options": [
          "10 kHz",
          "15 kHz",
          "20 kHz",
          "32 kHz"
        ],
        "description": "Selects the corner frequency of the passive high shelving filter, including the legendary 32 kHz 'Air' band."
      },
      {
        "name": "Treble EQ Gain",
        "range": "-20.0 dB to +20.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the boost or cut of the passive high shelf, providing modern high-end sheen or dark vintage warmth."
      },
      {
        "name": "High Mid EQ Frequency",
        "range": "220.0 Hz to 2.8 kHz (x10: 2.2 kHz to 28.0 kHz)",
        "defaultVal": "1.0 kHz",
        "type": "knob",
        "description": "Sweeps the center frequency of the high-mid peaking band, multiplying by 10 when the range switch is active."
      },
      {
        "name": "High Mid EQ Gain",
        "range": "-16.0 dB to +16.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Sets the boost or cut amount of the high-mid parametric filter for fine vocal presence adjustment."
      },
      {
        "name": "High Mid EQ Q-Factor",
        "range": "0.2 to 2.0 (Variable)",
        "defaultVal": "1.0",
        "type": "knob",
        "description": "Adjusts the bandwidth (Q) of the high-mid peaking EQ band from broad, musical curves to narrow, surgical cuts."
      },
      {
        "name": "Low Mid EQ Frequency",
        "range": "35.0 Hz to 450.0 Hz (x10: 350.0 Hz to 4.5 kHz)",
        "defaultVal": "150.0 Hz",
        "type": "knob",
        "description": "Sweeps the center frequency of the low-mid peaking band, multiplying by 10 when the range switch is active."
      },
      {
        "name": "Low Mid EQ Gain",
        "range": "-16.0 dB to +16.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the boost or cut of the low-mid parametric filter to add chest weight or scoop out boxy resonances."
      },
      {
        "name": "Low Mid EQ Q-Factor",
        "range": "0.2 to 2.0 (Variable)",
        "defaultVal": "1.0",
        "type": "knob",
        "description": "Adjusts the bandwidth (Q) of the low-mid peaking EQ band from wide warmth to narrow surgical notch filtering."
      },
      {
        "name": "Bass EQ Frequency",
        "range": "15.0 Hz / 30.0 Hz / 60.0 Hz / 150.0 Hz",
        "defaultVal": "60.0 Hz",
        "type": "select",
        "options": [
          "15 Hz",
          "30 Hz",
          "60 Hz",
          "150 Hz"
        ],
        "description": "Sets the frequency for the passive low-end shelving or peaking equalizer stage."
      },
      {
        "name": "Bass EQ Gain",
        "range": "-24.0 dB to +24.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the low-end boost or cut. The passive circuit provides immense, clean low-end weight without muddiness."
      },
      {
        "name": "Bass EQ Mode",
        "range": "Shelf / Peak",
        "defaultVal": "Shelf",
        "type": "switch",
        "options": [
          "Shelf",
          "Peak"
        ],
        "description": "Switches the low frequency equalizer curve between a smooth shelving shape or a resonant peaking bell curve."
      },
      {
        "name": "Output Level",
        "range": "-40.0 dB to +10.0 dB",
        "defaultVal": "0.0 dB",
        "type": "knob",
        "description": "Controls the final output level of the channel strip, allowing you to pad down heavy internal saturation before returning to the DAW."
      }
    ],
    "proTips": [
      "For a classic, expensive R&B lead vocal, select the 32 kHz frequency on the Treble EQ and boost the Gain by 2 to 4 dB. This injects the ultra-smooth, silky 'high-glass' air band that Avalon is world-famous for.",
      "Keep the Compressor Ratio at 2:1 or 3:1 with a fast Attack and slow Release. This keeps the opto-attenuator riding vocal levels transparently and musical, without inducing compression artifacts.",
      "If you need to tame a sibilant vocalist, engage 'EQ to Compressor Sidechain' and use the High Mid EQ centered around 5.0 kHz to 7.0 kHz with a narrow Q. This converts the opto-compressor into an extremely smooth, premium tube de-esser."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad oxford supresser ds",
    "displayName": "UAD Oxford SuprEsser DS",
    "category": "Dynamics",
    "description": "An exceptionally surgical, professional dynamic de-esser. Utilizing a highly advanced linear-phase crossover filter with real-time FFT spectrum tracking, the SuprEsser isolates and compresses only the offending sibilance frequencies when they exceed the threshold, ensuring transparent, lisp-free vocal treatments with zero latency.",
    "hardwareModel": "Sonnox Oxford SuprEsser DS Linear-Phase Dynamic Equalizer",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-50.0 dB to 0.0 dB",
        "defaultVal": "-20.0 dB",
        "type": "knob",
        "description": "Determines the input signal level above which dynamic spectral attenuation is triggered."
      },
      {
        "name": "Center Frequency",
        "range": "20.0 Hz to 20.0 kHz",
        "defaultVal": "6.5 kHz",
        "type": "knob",
        "description": "Targets the exact central frequency of vocal sibilance, harshness, or whistling resonances."
      },
      {
        "name": "Bandwidth",
        "range": "0.10 to 4.00 Octaves",
        "defaultVal": "1.00 Octave",
        "type": "knob",
        "description": "Sets the frequency width around the selected center frequency for targeted dynamic EQ action."
      },
      {
        "name": "Max Reduction (Range)",
        "range": "0.0 dB to -24.0 dB",
        "defaultVal": "-12.0 dB",
        "type": "knob",
        "description": "Sets the absolute maximum allowable dynamic gain reduction to prevent over-de-essing or lisping."
      },
      {
        "name": "Attack Time",
        "range": "0.5 ms to 100.0 ms",
        "defaultVal": "1.0 ms",
        "type": "knob",
        "description": "Adjusts how rapidly the dynamic attenuator reacts to sibilant peaks."
      },
      {
        "name": "Release Time",
        "range": "5.0 ms to 1.0 s",
        "defaultVal": "50.0 ms",
        "type": "knob",
        "description": "Sets the recovery speed of the gain reduction circuit to prevent vocal pumping."
      },
      {
        "name": "Auto Threshold",
        "range": "Off / On",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ],
        "description": "Engages dynamic signal tracking to automatically shift the threshold based on the signal's overall volume level."
      },
      {
        "name": "Listen Mode",
        "range": "Main / Sibilance / Diff",
        "defaultVal": "Main",
        "type": "switch",
        "options": [
          "Main",
          "Sibilance",
          "Diff"
        ],
        "description": "Auditions different signal paths: Main for the processed output, Sibilance to isolate the targeted band, or Diff to hear exactly what is being subtracted."
      },
      {
        "name": "Filter Type",
        "range": "Band Pass / High Pass / Low Pass",
        "defaultVal": "Band Pass",
        "type": "switch",
        "options": [
          "Band Pass",
          "High Pass",
          "Low Pass"
        ],
        "description": "Selects the crossover filter shape: Band Pass for localized notch de-essing, High Pass for high shelf attenuation, or Low Pass for dynamic low-end control."
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Blends the dry input signal with the dynamically de-essed signal for parallel processing."
      }
    ],
    "proTips": [
      "When dealing with highly dynamic or moving vocalists, turn on 'Auto Threshold' to ensure that quiet, intimate vocal lines are de-essed just as effectively as loud, belted choruses.",
      "Set the Center Frequency around 3.5 kHz with a narrow Bandwidth and fast Attack/Release to isolate and squash the painful 'clicky' pick attack transients of clean electric guitars.",
      "Engage 'Diff' mode in the Listen Selector to hear exactly what sibilant energy is being removed, allowing you to fine-tune the Bandwidth without guessing."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad diezel vh4 amplifier",
    "displayName": "UAD Diezel VH4 Amplifier",
    "category": "Guitar & Bass",
    "description": "The definitive emulation of the heavy guitar benchmark: Diezel's legendary VH4 tube head. Capturing all four channels (Clean, Crunch, Mega, and Lead), this plugin delivers the massive, tight low-end, complex mid-range grind, and searing distortion characteristics that made the VH4 a staple for modern heavy rock and metal production.",
    "hardwareModel": "Diezel VH4 100W KT77 Tube Head & Cabinet Collection",
    "parameters": [
      {
        "name": "Channel Select",
        "range": "CH 1 / CH 2 / CH 3 / CH 4",
        "defaultVal": "CH 3",
        "type": "select",
        "options": [
          "Channel 1",
          "Channel 2",
          "Channel 3",
          "Channel 4"
        ],
        "description": "Selects the active channel preamplifier, matching the distinct tube circuitry of the physical VH4 head."
      },
      {
        "name": "Gain",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Drives the active pre-amp tube stage into saturation, scaling from pristine headroom on Channel 1 to liquid distortion on Channel 4."
      },
      {
        "name": "Bass",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Adjusts the low-frequency response of the active preamp channel's passive tone stack."
      },
      {
        "name": "Middle",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Shapes the crucial mid-range frequencies of the active pre-amp stage."
      },
      {
        "name": "Treble",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Adjusts the high-frequency response and transient bite of the active passive tone stack."
      },
      {
        "name": "Channel Volume",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Controls the output level of the active preamp channel to balance relative volume levels."
      },
      {
        "name": "Deep",
        "range": "0.0 to 10.0",
        "defaultVal": "4.0",
        "type": "knob",
        "description": "Adjusts the low-end sub-bass resonance in the power amp stage, mimicking power amp negative feedback depth."
      },
      {
        "name": "Presence",
        "range": "0.0 to 10.0",
        "defaultVal": "6.0",
        "type": "knob",
        "description": "Adjusts the high-frequency definition, edge, and biting sizzle in the power amp feedback circuit."
      },
      {
        "name": "Master Volume",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "type": "knob",
        "description": "Sets the master output level of the power amplifier, driving virtual KT77 output tube saturation."
      },
      {
        "name": "Gate Threshold",
        "range": "-120.0 dB to 0.0 dB",
        "defaultVal": "-80.0 dB",
        "type": "knob",
        "description": "Sets the threshold of the premium Brainworx noise gate to attenuate high-gain hum and hiss."
      },
      {
        "name": "Gate Range",
        "range": "0.0 dB to -90.0 dB",
        "defaultVal": "-60.0 dB",
        "type": "knob",
        "description": "Determines the maximum attenuation applied to the signal when the noise gate is closed."
      },
      {
        "name": "Tight Filter",
        "range": "Off / Pre / Post",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "Pre",
          "Post"
        ],
        "description": "Selects the high-pass filter routing: Off, Pre (before the preamp to tighten pick transients), or Post (after power amp)."
      },
      {
        "name": "Tight Frequency",
        "range": "20.0 Hz to 200.0 Hz",
        "defaultVal": "80.0 Hz",
        "type": "knob",
        "description": "Sets the cutoff frequency of the high-pass tight filter."
      },
      {
        "name": "Cab Bypass",
        "range": "Off / On",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ],
        "description": "Bypasses the recording chains (speaker cabinet and mic emulation) for use with external cabinet IR host plugins."
      },
      {
        "name": "Recording Chain Select",
        "range": "1 to 120",
        "defaultVal": "1",
        "type": "knob",
        "description": "Selects from 120 custom recording chains featuring legendary speaker cabinets, boutique microphones, and console preamps."
      },
      {
        "name": "FX Delay Time",
        "range": "1.0 ms to 1000.0 ms",
        "defaultVal": "350.0 ms",
        "type": "knob",
        "description": "Sets the delay time for the built-in FX Rack feedback delay."
      },
      {
        "name": "FX Delay Feedback",
        "range": "0% to 100%",
        "defaultVal": "25%",
        "type": "knob",
        "description": "Controls the number of delay repeats inside the FX Rack feedback loop."
      },
      {
        "name": "FX Delay Mix",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "type": "knob",
        "description": "Adjusts the wet/dry mix of the FX delay signal."
      }
    ],
    "proTips": [
      "For classic modern metal rhythm tracks, select Channel 3, dial the Gain to 5.0, set Middle to 6.0, and boost the Deep knob to 7.0 for chest-thumping low-end chunk with superb punch.",
      "Use Channel 1 (Clean) with Bass rolled back and Presence pushed to 7.0, then dial in 15% of the FX Delay Mix for a glassy, high-headroom ambient clean tone.",
      "Engage 'Pre' on the Tight Filter and set Tight Frequency to 90 Hz when tracking down-tuned or 7-string guitars to eliminate mud and flub before the preamp stage."
    ],
    "authorizationStatus": "Demo not started"
  },
  {
    "name": "uad auto-tune realtime access",
    "displayName": "UAD Auto-Tune Realtime Access",
    "category": "Dynamics",
    "description": "A highly streamlined, zero-latency edition of Antares' legendary pitch-correction technology. Tailored for live tracking, low-overhead performance, and lightning-fast workflows, it delivers essential pitch correction with a clean, lightweight interface that keeps vocals perfectly in tune.",
    "hardwareModel": "Antares Auto-Tune Access Real-time Pitch Correction",
    "parameters": [
      {
        "name": "Retune Speed",
        "range": "Fast / Medium / Slow",
        "defaultVal": "Medium",
        "type": "switch",
        "options": [
          "Fast",
          "Medium",
          "Slow"
        ],
        "description": "Determines the speed of pitch correction. 'Fast' delivers the iconic hard-tuned modern pop/trap vocal effect, while 'Slow' provides subtle, natural correction."
      },
      {
        "name": "Humanize",
        "range": "Off / Light / Normal",
        "defaultVal": "Off",
        "type": "switch",
        "options": [
          "Off",
          "Light",
          "Normal"
        ],
        "description": "Preserves natural vocal characteristics and slow pitch variations on sustained notes while still correcting faster performance transitions."
      },
      {
        "name": "Scale Key",
        "range": "C / C# / D / D# / E / F / F# / G / G# / A / A# / B",
        "defaultVal": "C",
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
        ],
        "description": "Sets the root key of the musical scale used as the target for pitch correction."
      },
      {
        "name": "Scale Type",
        "range": "Major / Minor",
        "defaultVal": "Major",
        "type": "switch",
        "options": [
          "Major",
          "Minor"
        ],
        "description": "Selects the scale type (Major or Minor) to define the set of allowed pitches for the vocal tracking engine."
      }
    ],
    "proTips": [
      "For the signature, hard-tuning 'T-Pain' modern vocal effect, set the Retune Speed to Fast and turn Humanize to Off to lock every transient instantly to the absolute scale grid.",
      "For transparent pitch leveling during live tracking or tracking demos, choose a Medium retune speed paired with Light or Normal humanize to subtly transparently center vocals without robotic artifacts.",
      "Double-check your song's scale key using a pitch analyzer before committing; a mismatched key will result in unstable note jumps and pitch flutter."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ua 175b and 176 tube compressor collection",
    "displayName": "UAD UA 175B and 176 Tube Compressor Collection",
    "category": "Dynamics",
    "description": "An incredibly rich, authentic emulation of Bill Putnam Sr.'s iconic late-1960s variable-mu tube limiters. As precursors to the legendary solid-state 1176, the UA 175B and 176 deliver a lightning-fast, program-dependent feedback compression envelope with luxurious harmonic saturation, vintage tube warmth, and unparalleled dynamic control on vocals, bass, drums, and parallel buses.",
    "hardwareModel": "Universal Audio 175B & 176 Tube Limiters Collection",
    "parameters": [
      {
        "name": "Model Select",
        "range": "UA 175B / UA 176",
        "defaultVal": "UA 176",
        "type": "switch",
        "options": [
          "UA 175B",
          "UA 176"
        ],
        "description": "Switches between the 175B (featuring a fixed 12:1 ratio) and the 176 (with selectable multi-ratio slopes) vacuum tube models, altering the compression curves and circuit saturation."
      },
      {
        "name": "Input Gain",
        "range": "0.0 to 100.0",
        "defaultVal": "30.0",
        "type": "knob",
        "description": "Adjusts the input level entering the variable-mu tube stage, driving the threshold depth and harmonic saturation concurrently."
      },
      {
        "name": "Output Level",
        "range": "0.0 to 100.0",
        "defaultVal": "60.0",
        "type": "knob",
        "description": "Sets the final post-compression makeup gain level of the virtual tube amplifier stage to compensate for gain reduction."
      },
      {
        "name": "Attack",
        "range": "1.0 to 7.0",
        "defaultVal": "3.0",
        "type": "knob",
        "description": "Controls the compressor reaction speed. Higher numbers represent faster settings, ranging from 1 (slow, ~800 µs) to 7 (ultra-fast, ~100 µs)."
      },
      {
        "name": "Release",
        "range": "1.0 to 7.0",
        "defaultVal": "4.0",
        "type": "knob",
        "description": "Determines the gain recovery speed. Higher numbers represent faster settings, ranging from 1 (slow, ~1000 ms) to 7 (fast, ~100 ms)."
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 8:1 / 12:1",
        "defaultVal": "4:1",
        "type": "select",
        "options": [
          "2:1",
          "4:1",
          "8:1",
          "12:1"
        ],
        "description": "Selects the compression ratio slope. This control is only active on the UA 176 model; the UA 175B is internally fixed at a hard 12:1 limiting slope."
      },
      {
        "name": "Sidechain HP Filter",
        "range": "Off / 20 Hz to 500 Hz",
        "defaultVal": "Off",
        "type": "knob",
        "description": "Applies a high-pass filter to the sidechain detector path, preventing heavy low-end signals from over-triggering the variable-mu compression."
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "type": "knob",
        "description": "Blends the dry (unprocessed) and wet (compressed) signals to easily configure parallel compression for vintage body with modern transient punch."
      },
      {
        "name": "Headroom",
        "range": "-4 dB to +28 dB",
        "defaultVal": "+16 dB",
        "type": "knob",
        "description": "Alters the internal operating reference level. Lowering headroom drives the virtual tube circuits harder into vintage grid clipping and harmonic saturation."
      },
      {
        "name": "Stereo Link",
        "range": "Stereo / Dual Mono",
        "defaultVal": "Stereo",
        "type": "switch",
        "options": [
          "Stereo",
          "Dual Mono"
        ],
        "description": "Sets whether the Left and Right channel sidechains operate as a linked stereo pair or compress independently as separate dual-mono circuits."
      }
    ],
    "proTips": [
      "On lead vocals, select the UA 176 model at a 4:1 ratio. Set Attack to 4.0 and Release to 5.0, then back off the Mix knob to 85% for vintage leveling with pristine transient preservation.",
      "Use the UA 175B model on bass guitars. Crank the Input Gain past 50.0 to saturate the vacuum tube grid, creating a thick, warm harmonic growl that pins the low-end perfectly.",
      "Engage the Sidechain HP Filter at 90 Hz when using the UA 176 on drum sub-mixes to prevent the kick drum from dragging down the entire overhead image, allowing clean snare smash."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad capitol chambers",
    "displayName": "UAD Capitol Chambers",
    "category": "Reverbs & Delays",
    "description": "An end-to-end physical modeling of the legendary underground concrete echo chambers at Capitol Studios in Hollywood. Created in close collaboration with Capitol's engineers, this plugin emulates the precise acoustics of Chambers 2, 3, 4, and 6, capturing their rich, high-density early reflections, custom-built amplifier signal chains, vintage microphone collections, and specialized Altec and Tannoy playback speaker arrays.",
    "hardwareModel": "Capitol Studios Echo Chambers",
    "parameters": [
      {
        "name": "Chamber Select",
        "range": "Chamber 2 / Chamber 3 / Chamber 4 / Chamber 6",
        "defaultVal": "Chamber 4",
        "description": "Loads one of the four legendary physically modeled concrete echo chambers located 30 feet beneath Capitol Studios.",
        "type": "select",
        "options": [
          "Chamber 2",
          "Chamber 3",
          "Chamber 4",
          "Chamber 6"
        ]
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 250 ms",
        "defaultVal": "0 ms",
        "description": "Introduces a discrete delay time before the source audio enters the chamber, helping to separate dry transient signals from the wash of early reflections.",
        "type": "knob"
      },
      {
        "name": "Decay",
        "range": "1.0s to 10.0s",
        "defaultVal": "3.5s",
        "description": "Continuously controls the reverberation decay time by physically moving modeled mechanical fiberglass dampener panels inside the live room.",
        "type": "knob"
      },
      {
        "name": "Microphone Select",
        "range": "KM54 / KM56 / KM84 / SM57 / 44BX / C37A",
        "defaultVal": "KM54",
        "description": "Selects the virtual pickup microphone model used to capture the room's acoustic reflections, offering small-diaphragm tubes, dynamics, ribbons, and multi-pattern condensers.",
        "type": "select",
        "options": [
          "KM54",
          "KM56",
          "KM84",
          "SM57",
          "44BX",
          "C37A"
        ]
      },
      {
        "name": "Microphone Position",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Adjusts the physical distance between speakers and microphones, altering the balance of direct-to-reflected sound and shifting the acoustic perspective from tight and focused to deep and ambient.",
        "type": "slider"
      },
      {
        "name": "Speaker Select",
        "range": "Altec 604 / Tannoy Gold",
        "defaultVal": "Altec 604",
        "description": "Selects the amplifier and speaker driver combination deployed in the chamber, transitioning between the crisp, forward response of the Altec 604 and the warm, thick character of the Tannoy Gold.",
        "type": "switch",
        "options": [
          "Altec 604",
          "Tannoy Gold"
        ]
      },
      {
        "name": "Low Cut",
        "range": "Off, 16 Hz to 150 Hz",
        "defaultVal": "Off",
        "description": "Sweepable high-pass filter that rolls off rumble, sub-bass mud, and low-frequency build-up before it enters the chamber circuit.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Baxandall style low-frequency equalizer to boost or cut the low end of the reverberation tail, ideal for shaping room bloom.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "-12.0 dB to +12.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Baxandall style high-frequency equalizer to boost air and shimmer or cut harsh sibilance and high-end reflections.",
        "type": "knob"
      },
      {
        "name": "Input",
        "range": "-inf to +12.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Adjusts the level of the incoming signal driving the chamber's virtual amplifiers, letting you drive the room harder for richer acoustics.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-inf to +12.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Controls the output master level of the plugin to balance gain staging following level changes inside the chamber.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Balances the dry signal with the wet chamber reflections.",
        "type": "knob"
      },
      {
        "name": "Wet Solo",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Mutes the dry source audio entirely, outputting only the pure wet reverberated chamber signal—crucial when loading the plugin on an auxiliary send or return track.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Stereo Link",
        "range": "On / Off",
        "defaultVal": "On",
        "description": "Links the Left and Right microphone distance and EQ settings so changes are mirrored perfectly across both channels, or unlinks them for custom asymmetric room sculpting.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      }
    ],
    "proTips": [
      "For lush, ultra-dense lead vocals, select Chamber 4 paired with the Neumann KM54 small-diaphragm tube microphone. Sweep the Microphone Position to 70% to pull the mics further back, allowing the vocal bloom to naturally wrap around the stereo image while setting Pre-delay to 45 ms to keep the dry vocal upfront and clear.",
      "For acoustic guitars and strings, choose Chamber 2 with the ribbon RCA 44BX microphone model and the Tannoy Gold speaker driver. Increase the Decay to 4.5s and dial in the Treble to +2.5 dB to introduce a gorgeous, velvety top-end sheen that sparkles without sibilance, while keeping Low Cut at 120 Hz to prevent low-end mud.",
      "When processing drums, load Chamber 6 with the Shure SM57 dynamic microphone and Altec 604 speakers. Pull the Microphone Position down to 15% for an aggressive, explosive near-speaker ambience, set the Decay to a tight 1.8s, and sweep the Low Cut to 80 Hz for an organic room texture that adds dramatic punch and realistic body."
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
        "range": "Off, 0 dB to +30 dB",
        "defaultVal": "0 dB",
        "description": "Controls the output makeup gain following optical compression.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "+10 dB to -40 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the signal level above which optical gain reduction is triggered. Positioned fully clockwise (+10) by default for zero compression.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 to 10:1",
        "defaultVal": "2:1",
        "description": "Adjusts the optical compression slope continuously.",
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
        "description": "Switches between fully adjustable controls (MAN.), fixed times (FIX), and hybrid dual-recovery mode (FIX./MAN.).",
        "type": "select",
        "options": [
          "Manual",
          "Fix",
          "Fix-Man"
        ]
      },
      {
        "name": "Sidechain Low Cut",
        "range": "Off / 80 Hz / 150 Hz",
        "defaultVal": "Off",
        "description": "Applies a high-pass filter to the sidechain signal, preventing low frequencies from over-triggering the optical compression.",
        "type": "select",
        "options": [
          "Off",
          "80 Hz",
          "150 Hz"
        ]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the dry/wet parallel blend ratio inside the plugin.",
        "type": "knob"
      },
      {
        "name": "Meter Select",
        "range": "Input / Compression / Output",
        "defaultVal": "Compression",
        "description": "Determines whether the large physical VU meter displays input levels, decibels of optical gain reduction, or output levels.",
        "type": "select",
        "options": [
          "Input",
          "Compression",
          "Output"
        ]
      }
    ],
    "proTips": [
      "Switch the Attack/Release select to 'Fix-Man' on lead vocals. This dual-stage recovery setting (combining fixed fast response with manual smooth decay) yields incredibly musical dynamic tracking that keeps vocals beautifully sitting in the pocket.",
      "For electric bass, use a high ratio (6:1) with a manual 20 ms attack and 0.3s release. Engage the Sidechain Low Cut at 80 Hz or 150 Hz to prevent deep sub-harmonics from pumping the compression, pinning down the low-end while preserving punchy string definition.",
      "Utilize the Mix knob to perform parallel vocal compression directly on the track. Dial in aggressive 10:1 ratio squashing with the Threshold down to -25 dB, then blend the Mix back to 35% to inject heavy vintage harmonic density without sacrificing performance transients."
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
        "name": "Gain",
        "range": "20 dB to 76 dB (6 dB steps)",
        "defaultVal": "32 dB",
        "description": "Adjusts the stepped input gain (in 6 dB increments) to drive the virtual pentode tube stages, adding rich vintage tube warmth and harmonic coloration.",
        "type": "knob"
      },
      {
        "name": "Low Cut",
        "range": "Off / 80 Hz / 300 Hz",
        "defaultVal": "Off",
        "description": "Selects the low-frequency cutoff point (80 Hz or 300 Hz) to roll off sub-rumble or proximity build-up.",
        "type": "select",
        "options": [
          "Off",
          "80 Hz",
          "300 Hz"
        ]
      },
      {
        "name": "Pad",
        "range": "Off / -20 dB",
        "defaultVal": "Off",
        "description": "Attenuates the incoming signal by -20 dB before the input transformer to prevent clipping from high-output microphone and line sources.",
        "type": "switch",
        "options": [
          "Off",
          "-20 dB"
        ]
      },
      {
        "name": "Phase",
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
        "name": "Output",
        "range": "-20 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Provides clean output volume attenuation to balance hot tube drive levels.",
        "type": "knob"
      },
      {
        "name": "Power",
        "range": "On / Off",
        "defaultVal": "On",
        "description": "Bypasses the plugin's emulation processing and tube circuitry entirely.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      }
    ],
    "proTips": [
      "On acoustic guitars, set the Gain to 50 dB and engage the 80 Hz High Pass Filter. This rolls off sub-rumble while driving the tube input stage, adding complex, shimmering high-frequency tube harmonics that elevate the track in the mix.",
      "Push an electric bass or synthesizers into rich overdrive by cranking the Gain to 62 dB or 68 dB. Engage the -20 dB Pad to tames hot incoming transients, and back off the Output Trim to avoid digital clipping, imparting a warm, growling tube compression and grit.",
      "For vocals needing vintage character, start with Gain at 38 dB or 44 dB for subtle pentode tube warming. Utilize the 80 Hz High Pass Filter if proximity effect is present, allowing clean, glassy vocals with maximum analog warmth."
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
        "name": "Input Type",
        "range": "Soprano / Alto-Tenor / Low Male / Instrument / Bass Inst",
        "defaultVal": "Alto/Tenor",
        "description": "Selects the optimal pitch-detection tracking range based on the vocal register or instrument frequency characteristics.",
        "type": "switch",
        "options": [
          "Soprano",
          "Alto/Tenor",
          "Low Male",
          "Instrument",
          "Bass Inst"
        ]
      },
      {
        "name": "Key",
        "range": "C to B",
        "defaultVal": "C",
        "description": "Sets the root key of the pitch correction scale.",
        "type": "switch",
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
        "range": "Chromatic / Major / Minor / Pentatonic",
        "defaultVal": "Chromatic",
        "description": "Determines the target note pattern that the pitch detector locks onto.",
        "type": "switch",
        "options": [
          "Chromatic",
          "Major",
          "Minor",
          "Major Pentatonic",
          "Minor Pentatonic"
        ]
      },
      {
        "name": "Retune Speed",
        "range": "0 ms to 400 ms",
        "defaultVal": "20 ms",
        "description": "Determines how fast the correction engine adjusts the incoming pitch to the target note. 0 ms is instantaneous (robotic), while slower settings sound natural.",
        "type": "knob"
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Controls the degree of pitch correction relaxation. Higher values preserve expressive vocal runs, vibrato, and slides, applying correction only near target notes.",
        "type": "knob"
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Applies a temporal delay to pitch correction on sustained notes, preserving the natural micro-vibrato and transition characteristics of the voice.",
        "type": "knob"
      },
      {
        "name": "Tracking",
        "range": "1 to 100",
        "defaultVal": "50",
        "description": "Adjusts the sensitivity of the pitch detector to prevent low-level noise, breath, or bleed from triggering correction artifacts.",
        "type": "knob"
      },
      {
        "name": "Classic Mode",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Engages the legendary, brighter, and more immediate tuning algorithm of Auto-Tune 5, highly sought after in modern hip-hop and pop production.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Formant Correction",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Preserves natural vocal tract resonances (formants) when pitch-shifting, avoiding the 'munchkin' or 'giant' effect when transposing.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Throat Length",
        "range": "0 to 100",
        "defaultVal": "100",
        "description": "Alters the modeled throat shape and vocal tract length when Formant Correction is active, enabling unique vocal character transformation.",
        "type": "knob"
      },
      {
        "name": "Transpose",
        "range": "-12 to +12 semitones",
        "defaultVal": "0",
        "description": "Provides clean pitch transposition across a full two-octave range, enabling easy key changes or vocal pitching.",
        "type": "knob"
      },
      {
        "name": "Detune",
        "range": "438.0 Hz to 442.0 Hz",
        "defaultVal": "440.0 Hz",
        "description": "Adjusts the overall master pitch reference of the pitch detector relative to standard A440 tuning.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the parallel balance between the direct, unprocessed vocal and the pitch-corrected vocal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For transparent modern vocal tuning, set Retune Speed between 15 ms and 25 ms, Flex-Tune to 40%, and Humanize to 20%. This ensures notes are perfectly centered while preserving the natural performance nuances, vibrato, and transitions.",
      "For the iconic, hard-tuned pop and trap 'T-Pain effect', pull the Retune Speed down to 0 ms, set Flex-Tune and Humanize to 0, and turn on Classic Mode. This locks the pitch correction-engine instantaneously to the target scale notes with aggressive transition characteristics.",
      "When pitch-shifting or transposing vocals, engage Formant Correction to preserve the organic vocal tract character. For creative sound design, adjust Throat Length to reshape vocal timber—shortening it can add a youthful brightness, while lengthening it deepens the voice."
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
        "name": "Channel Select",
        "range": "Channel 1 / Channel 2 / Channel 3",
        "defaultVal": "Channel 2",
        "description": "Selects between Channel 1 (sparkling clean/dynamic), Channel 2 (crunch/heavy rhythm), and Channel 3 (searing high-gain leads).",
        "type": "select",
        "options": [
          "Channel 1",
          "Channel 2",
          "Channel 3"
        ]
      },
      {
        "name": "Preamp Gain",
        "range": "0 to 10",
        "defaultVal": "4.5",
        "description": "Adjusts preamp input tube saturation and compression depth of the selected channel.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0 to 10",
        "defaultVal": "5.0",
        "description": "Adjusts low-shelf equalization response.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0 to 10",
        "defaultVal": "5.5",
        "description": "Adjusts core midrange presence before entering the Midcut circuit.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0 to 10",
        "defaultVal": "5.0",
        "description": "Controls top-end string clarity and pick attack bite.",
        "type": "knob"
      },
      {
        "name": "Midcut Switch",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Engages the dedicated and legendary mid-frequency scoop filter.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Midcut Intensity",
        "range": "0 to 10",
        "defaultVal": "5.0",
        "description": "Determines the depth of the frequency notch around 400 Hz when Midcut is active.",
        "type": "knob"
      },
      {
        "name": "Midcut Level",
        "range": "0 to 10",
        "defaultVal": "5.0",
        "description": "Compensates for the perceived volume loss when scooping mids via the Midcut circuit.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0 to 10",
        "defaultVal": "6.0",
        "description": "Controls the power amp stage's high-frequency sparkle and dynamic edge.",
        "type": "knob"
      },
      {
        "name": "Deep",
        "range": "0 to 10",
        "defaultVal": "3.0",
        "description": "Controls the low-frequency sub-bass resonance of the modeled power amp and speaker cabinet.",
        "type": "knob"
      },
      {
        "name": "Master Volume",
        "range": "0 to 10",
        "defaultVal": "4.0",
        "description": "Controls the overall output level of the modeled vacuum tube power amplifier.",
        "type": "knob"
      },
      {
        "name": "Cabinet Bypass",
        "range": "On / Off",
        "defaultVal": "Off",
        "description": "Bypasses the built-in Recording Chain speaker impulse responses to use external cabinet loaders.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      }
    ],
    "proTips": [
      "Engage the Midcut switch. Turn Midcut Intensity to 6.5 (around 1 o'clock) and Midcut Level to 4.5 (around 11 o'clock). This carves out mid-mud around 400 Hz, letting you track massive, high-gain rhythm guitars that don't crowd the vocal track.",
      "The Diezel Herbert has extreme power-amp headroom. Set the Master Volume higher (around 6.0) and back off on the Preamp Gain (around 3.5 to 4.5) to get a punchier, tighter transient response for progressive metal riffs.",
      "Adjust the Deep control carefully to match your monitoring environment. Since it controls sub-resonance below 100 Hz, setting it too high can easily muddy up a mix, while a sweet spot of 3.0 keeps palm mutes incredibly heavy yet controlled."
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
        "name": "Mid RT",
        "range": "0.5 s to 20.0 s",
        "defaultVal": "2.5 s",
        "description": "Adjusts the mid-frequency RT60 decay time (main reverb time) on the LARC.",
        "type": "knob"
      },
      {
        "name": "Bass Mult",
        "range": "0.2x to 4.0x",
        "defaultVal": "1.2x",
        "description": "Multiplier for low-frequency decay relative to the Mid RT.",
        "type": "knob"
      },
      {
        "name": "Crossover",
        "range": "100 Hz to 1000 Hz",
        "defaultVal": "500 Hz",
        "description": "Sets the crossover frequency where low-frequency decay transitions to mid-frequency decay.",
        "type": "knob"
      },
      {
        "name": "Treble Decay",
        "range": "100 Hz to 24.0 kHz",
        "defaultVal": "12.0 kHz",
        "description": "Sets the high-frequency cutoff where decay is rolled off, simulating room damping.",
        "type": "knob"
      },
      {
        "name": "Depth",
        "range": "0 to 99",
        "defaultVal": "50",
        "description": "Alters the apparent distance between the source and the reverberant field.",
        "type": "knob"
      },
      {
        "name": "Pre-Delay",
        "range": "0 ms to 500 ms",
        "defaultVal": "24 ms",
        "description": "Sets the separation delay buffer between the dry source and the onset of reflections.",
        "type": "knob"
      },
      {
        "name": "Size",
        "range": "4.0 m to 80.0 m",
        "defaultVal": "36.0 m",
        "description": "Sets the physical room scale, resizing the virtual acoustic space.",
        "type": "knob"
      },
      {
        "name": "Diffusion",
        "range": "0 to 99",
        "defaultVal": "50",
        "description": "Controls the density build-up rate of reverberation reflections.",
        "type": "knob"
      },
      {
        "name": "Shape",
        "range": "0 to 99",
        "defaultVal": "35",
        "description": "Alters the initial shape of the reverb decay curve, working in tandem with Spread.",
        "type": "knob"
      },
      {
        "name": "Spread",
        "range": "0 to 99",
        "defaultVal": "15",
        "description": "Adjusts the spatial envelope of the early reflection build-up.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the dry-to-wet balance of the processed output.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The 'Large Hall' algorithm is the absolute classic. Use it on vocals, strings, or backing synths with a Mid RT of 2.5 seconds to build deep, authentic spatial depth.",
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
        "name": "Bands",
        "range": "4, 8, 12, 16, 20, 24 Bands",
        "defaultVal": "16 Bands",
        "description": "Selects the number of spectral bands splitting the audio carrier.",
        "type": "knob"
      },
      {
        "name": "Carrier Source",
        "range": "Internal / External",
        "defaultVal": "Internal",
        "description": "Selects the carrier signal source. Internal utilizes the built-in synthesizer.",
        "type": "switch",
        "options": [
          "Internal",
          "External"
        ]
      },
      {
        "name": "Carrier Waveform",
        "range": "Saw / Square / PWM / Noise",
        "defaultVal": "Saw",
        "description": "Selects the waveform for the internal carrier synthesizer.",
        "type": "select",
        "options": [
          "Saw",
          "Square",
          "PWM",
          "Noise"
        ]
      },
      {
        "name": "Carrier Octave",
        "range": "-2 / -1 / 0 / +1 / +2",
        "defaultVal": "0",
        "description": "Transposes the pitch of the internal carrier synthesizer in octaves.",
        "type": "select",
        "options": [
          "-2",
          "-1",
          "0",
          "+1",
          "+2"
        ]
      },
      {
        "name": "Attack",
        "range": "0.5 ms to 500 ms",
        "defaultVal": "10 ms",
        "description": "Controls the attack response speed of the envelope follower.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "10 ms to 5.0 s",
        "defaultVal": "150 ms",
        "description": "Controls the release decay time of the envelope follower.",
        "type": "knob"
      },
      {
        "name": "Formant Freeze",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Locks the current spectral envelope filter levels in place.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Unvoiced Level",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Blends high-frequency noise transients back into the output to keep speech consonants intelligible.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Filters modulator low frequencies to clean up vocal rumble.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the blend between the wet vocoded signal and the dry modulator signal.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-inf to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the final master output level.",
        "type": "knob"
      }
    ],
    "proTips": [
      "This vocoder features a built-in carrier synthesizer. You don't need external midi routing: select a waveform (like Sawtooth) directly inside the carrier section to start vocoding instantly.",
      "Adjust the 'Bands' knob. Set to 8 bands for a highly vintage, lo-fi robotic sound, or 20 bands for modern, clear, and highly intelligible vocoded speech.",
      "Automate the 'Unvoiced Level' parameter. This blends high-frequency noise transients back into the signal, ensuring consonant letters like 'S' and 'T' remain perfectly clear."
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
        "name": "Input Trim",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the pre-dynamics digital trim input stage.",
        "type": "knob"
      },
      {
        "name": "HPF Frequency",
        "range": "Off / 20 Hz to 400 Hz",
        "defaultVal": "Off",
        "description": "Sets the high pass filter cutoff frequency to eliminate low rumble.",
        "type": "knob"
      },
      {
        "name": "LPF Frequency",
        "range": "Off / 1.0 kHz to 20 kHz",
        "defaultVal": "Off",
        "description": "Sets the low pass filter cutoff frequency to reduce high hiss.",
        "type": "knob"
      },
      {
        "name": "Gate Threshold",
        "range": "-80 dB to 0 dB",
        "defaultVal": "-60 dB",
        "description": "Sets the threshold level below which expander/gate attenuation begins.",
        "type": "knob"
      },
      {
        "name": "Gate Depth",
        "range": "0 dB to 80 dB",
        "defaultVal": "80 dB",
        "description": "Determines the maximum gain reduction applied when the gate is closed.",
        "type": "knob"
      },
      {
        "name": "Gate Hysteresis",
        "range": "0 dB to 20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the difference in threshold level between opening and closing of the gate.",
        "type": "knob"
      },
      {
        "name": "Gate Hold",
        "range": "0 ms to 2000 ms",
        "defaultVal": "0 ms",
        "description": "Holds the gate fully open for a specified duration after signal falls below threshold.",
        "type": "knob"
      },
      {
        "name": "Gate Attack",
        "range": "50 us to 100 ms",
        "defaultVal": "1.0 ms",
        "description": "Controls how quickly the gate opens after threshold is crossed.",
        "type": "knob"
      },
      {
        "name": "Gate Release",
        "range": "10 ms to 5.0 s",
        "defaultVal": "100 ms",
        "description": "Controls the decay speed at which the gate closes.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-50 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets the signal level above which compressor gain reduction begins.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to 20:1",
        "defaultVal": "1:1",
        "description": "Determines the amount of gain reduction applied to signal exceeding threshold.",
        "type": "knob"
      },
      {
        "name": "Compressor Attack",
        "range": "100 us to 100 ms",
        "defaultVal": "5.0 ms",
        "description": "Sets the response speed of compressor gain reduction.",
        "type": "knob"
      },
      {
        "name": "Compressor Release",
        "range": "10 ms to 5.0 s",
        "defaultVal": "100 ms",
        "description": "Sets the recovery speed of compressor gain reduction.",
        "type": "knob"
      },
      {
        "name": "Compressor Makeup",
        "range": "-10 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Provides manual gain makeup to offset level loss from compression.",
        "type": "knob"
      },
      {
        "name": "EQ High Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls high shelving or bell EQ gain.",
        "type": "knob"
      },
      {
        "name": "EQ High Freq",
        "range": "1.5 kHz to 20 kHz",
        "defaultVal": "8.0 kHz",
        "description": "Sets the frequency for the High EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ High Q",
        "range": "0.5 to 10",
        "defaultVal": "0.7",
        "description": "Sets the bandwidth or resonance quality factor for the High EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ High-Mid Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls parametric High-Mid EQ band gain.",
        "type": "knob"
      },
      {
        "name": "EQ High-Mid Freq",
        "range": "500 Hz to 10000 Hz",
        "defaultVal": "2.0 kHz",
        "description": "Sets the frequency for the High-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ High-Mid Q",
        "range": "0.5 to 10",
        "defaultVal": "1.0",
        "description": "Sets the bandwidth quality factor for the High-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ Low-Mid Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls parametric Low-Mid EQ band gain.",
        "type": "knob"
      },
      {
        "name": "EQ Low-Mid Freq",
        "range": "100 Hz to 2000 Hz",
        "defaultVal": "500 Hz",
        "description": "Sets the frequency for the Low-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ Low-Mid Q",
        "range": "0.5 to 10",
        "defaultVal": "1.0",
        "description": "Sets the bandwidth quality factor for the Low-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ Low Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls low shelving or bell EQ gain.",
        "type": "knob"
      },
      {
        "name": "EQ Low Freq",
        "range": "20 Hz to 400 Hz",
        "defaultVal": "100 Hz",
        "description": "Sets the frequency for the Low EQ band.",
        "type": "knob"
      },
      {
        "name": "EQ Low Q",
        "range": "0.5 to 10",
        "defaultVal": "0.7",
        "description": "Sets the bandwidth or resonance quality factor for the Low EQ band.",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the final master channel output gain level.",
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
        "name": "Gain",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Drives the high-gain preamp stage into sweet tube compression and rich British-style overdrive.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Controls the low-frequency response of the passive preamp tone stack.",
        "type": "knob"
      },
      {
        "name": "Middle",
        "range": "0.0 to 10.0",
        "defaultVal": "6.0",
        "description": "Shapes the crucial mid-range punch, giving classic British woodiness or modern heavy scoop.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts the high-frequency response, brightness, and transient pick attack articulation.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "0.0 to 10.0",
        "defaultVal": "6.0",
        "description": "Determines the high-frequency edge and biting sizzle in the power amplifier feedback stage.",
        "type": "knob"
      },
      {
        "name": "Feedback",
        "range": "0.0 to 10.0",
        "defaultVal": "4.0",
        "description": "Controls negative feedback in the power section. Higher values loosen the amp for vintage bloom, while lower values tighten bass response for modern rhythm chug.",
        "type": "knob"
      },
      {
        "name": "Gate Threshold",
        "range": "-120 dB to 0 dB",
        "defaultVal": "-80 dB",
        "description": "Sets the threshold level for the integrated Brainworx noise gate to eliminate high-gain amp hiss.",
        "type": "knob"
      },
      {
        "name": "Gate Range",
        "range": "0 dB to -90 dB",
        "defaultVal": "-60 dB",
        "description": "Determines the maximum depth of attenuation when the noise gate is closed.",
        "type": "knob"
      },
      {
        "name": "Tight Filter",
        "range": "Off / Pre / Post",
        "defaultVal": "Off",
        "description": "Filters out muddy low frequencies before (Pre) or after (Post) the amplifier stage.",
        "type": "select",
        "options": [
          "Off",
          "Pre",
          "Post"
        ]
      },
      {
        "name": "Tight Frequency",
        "range": "20 Hz to 200 Hz",
        "defaultVal": "80 Hz",
        "description": "Controls the cutoff frequency of the high-pass tight filter.",
        "type": "knob"
      },
      {
        "name": "Delay Active",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Enables or disables the built-in FX Rack digital delay.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Delay Time",
        "range": "15 ms to 2000 ms",
        "defaultVal": "350 ms",
        "description": "Sets the delay repetition interval. Can be synchronized to the host DAW tempo.",
        "type": "knob"
      },
      {
        "name": "Delay Feedback",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Determines the number of echo repetitions by feeding the output back into the input.",
        "type": "knob"
      },
      {
        "name": "Delay Mix",
        "range": "0% to 100%",
        "defaultVal": "20%",
        "description": "Controls the wet/dry balance of the digital delay effect.",
        "type": "knob"
      },
      {
        "name": "Cabinet Active",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Bypasses or engages the impulse response (IR) cabinet modeling section.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Cabinet Select",
        "range": "Preset 1 to 120",
        "defaultVal": "Preset 1",
        "description": "Selects from 120 boutique speaker cabinet and microphone setups recorded in world-class studios.",
        "type": "knob"
      },
      {
        "name": "Power Amp Active",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Toggles the emulation of the EL34 power amplifier stage when using external power amps.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
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
        "name": "Input Select",
        "range": "Mic / Line",
        "defaultVal": "Mic",
        "description": "Selects the active input source, routing either microphone-level or line-level signals through the tube preamp circuit.",
        "type": "switch",
        "options": [
          "Mic",
          "Line"
        ]
      },
      {
        "name": "Preamp Gain",
        "range": "0 to 100 (Continuous)",
        "defaultVal": "35",
        "description": "Adjusts vacuum tube preamplifier input level and saturation thickness.",
        "type": "knob"
      },
      {
        "name": "Low Cut",
        "range": "Off / 80 Hz",
        "defaultVal": "Off",
        "description": "Engages an 18 dB per octave high-pass filter at 80 Hz to eliminate low-end rumble and mud.",
        "type": "switch",
        "options": [
          "Off",
          "80 Hz"
        ]
      },
      {
        "name": "Pad",
        "range": "Off / -20 dB",
        "defaultVal": "Off",
        "description": "Attenuates the input signal by -20 dB to prevent clipping on high-level input sources.",
        "type": "switch",
        "options": [
          "Off",
          "-20 dB"
        ]
      },
      {
        "name": "Phase",
        "range": "Off / Invert",
        "defaultVal": "Off",
        "description": "Inverts the polarity of the input signal by 180 degrees to solve phase cancellation issues in multi-mic setups.",
        "type": "switch",
        "options": [
          "Off",
          "Invert"
        ]
      },
      {
        "name": "Low EQ Shelf",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls the boost or cut of the 110 Hz low shelving band.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the boost or cut amplitude for the sweepable mid-range EQ band.",
        "type": "knob"
      },
      {
        "name": "Mid EQ Freq",
        "range": "150 Hz to 7 kHz",
        "defaultVal": "1 kHz",
        "description": "Selects the center frequency for the sweepable midrange EQ band.",
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
        "name": "EQ Bypass",
        "range": "On / Off",
        "defaultVal": "On",
        "description": "Engages or completely bypasses the 3-band equalizer section.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Compressor Threshold",
        "range": "0 to 100 (Continuous)",
        "defaultVal": "0",
        "description": "Controls the threshold of the automatic-makeup optical gain cell.",
        "type": "knob"
      },
      {
        "name": "Compressor Bypass",
        "range": "On / Off",
        "defaultVal": "On",
        "description": "Engages or completely bypasses the automatic optical compressor.",
        "type": "switch",
        "options": [
          "On",
          "Off"
        ]
      },
      {
        "name": "Meter Select",
        "range": "GR / OUT",
        "defaultVal": "GR",
        "description": "Switches the VU meter between displaying gain reduction (GR) and output level (OUT).",
        "type": "switch",
        "options": [
          "GR",
          "OUT"
        ]
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
        "range": "-10.0 dB to +10.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Sets input level driving the internal mastering dynamic chain.",
        "type": "knob"
      },
      {
        "name": "Foundation",
        "range": "-10.0 to +10.0",
        "defaultVal": "0.0",
        "description": "Adjusts spectral balance tilt between low-end warmth and high-end air.",
        "type": "knob"
      },
      {
        "name": "De-Esser",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls high-frequency dynamic taming of vocal sibilance and harsh cymbals.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "-3.0 dB to +3.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Adjusts targeted low-end sub-bass shelving frequencies.",
        "type": "knob"
      },
      {
        "name": "Mids",
        "range": "-3.0 dB to +3.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Adjusts midrange body and presence in the 1 kHz region.",
        "type": "knob"
      },
      {
        "name": "Presence",
        "range": "-3.0 dB to +3.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Controls clarity and definition in the upper-midrange band.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "-3.0 dB to +3.0 dB",
        "defaultVal": "0.0 dB",
        "description": "Controls top-end sheen and airy brightness.",
        "type": "knob"
      },
      {
        "name": "Resonance Filter 1",
        "range": "Off / 160 Hz / 315 Hz",
        "defaultVal": "Off",
        "description": "Selects the frequency for taming resonances in the low frequency bands.",
        "type": "switch",
        "options": [
          "Off",
          "160 Hz",
          "315 Hz"
        ]
      },
      {
        "name": "Resonance Filter 2",
        "range": "Off / 3.15 kHz / 6.3 kHz",
        "defaultVal": "Off",
        "description": "Selects the frequency for taming resonances in the high frequency bands.",
        "type": "switch",
        "options": [
          "Off",
          "3.15 kHz",
          "6.3 kHz"
        ]
      },
      {
        "name": "Compressor Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends dry uncompressed signal with compressed signal for parallel leveling.",
        "type": "knob"
      },
      {
        "name": "Compressor Link",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Adjusts the L/R channel sidechain linking percentage.",
        "type": "knob"
      },
      {
        "name": "Compressor Mode",
        "range": "1 / 2 / 3 / 4",
        "defaultVal": "1",
        "description": "Selects the release time-constant curve: 1=Classic, 2=Auto, 3=Fast, 4=Smooth.",
        "type": "switch",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ]
      },
      {
        "name": "Mono Maker",
        "range": "20 Hz to 400 Hz",
        "defaultVal": "20 Hz",
        "description": "Folds stereo signals below this frequency into 100% monophonic sound for solid bass focus.",
        "type": "knob"
      },
      {
        "name": "Stereo Width",
        "range": "0% to 150%",
        "defaultVal": "100%",
        "description": "Expands or narrows the stereo image of the mid/side signal matrix.",
        "type": "knob"
      },
      {
        "name": "THD",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Generates tape-style Total Harmonic Distortion saturation for warmth and glue.",
        "type": "knob"
      },
      {
        "name": "Limiter Turbo",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages Limiter Turbo mode, changing dynamic threshold behavior for maximum loudness.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Output Trim",
        "range": "-2.0 dB to 0.0 dB",
        "defaultVal": "-0.2 dB",
        "description": "Adjusts final master level ceiling output for streaming security.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the 'Foundation' knob as your primary tone-sculptor. It behaves like a high-end tilt filter: dial clockwise to add high-end sheen while rolling off sub mud, or counter-clockwise for low-end body.",
      "Adjust the 'Volume' knob until you hit around -2dB of gain reduction on the integrated limiter meter. This ensures maximum loudness without squeezing the life out of your song.",
      "Engage 'Mono Maker' around 100 Hz to lock sub bass strictly to mono, keeping the low-end perfectly centered and punching hard."
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
        "name": "Gain 1",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Controls pre-amp gain for Channel 1.",
        "type": "knob"
      },
      {
        "name": "Level 1",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts output level of Channel 1.",
        "type": "knob"
      },
      {
        "name": "Bass 1",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts low frequencies for Channel 1 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Middle 1",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts midrange frequencies for Channel 1 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Treble 1",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts high frequencies for Channel 1 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Bright 1",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages high frequency boost on Channel 1.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Gain 2",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Controls pre-amp gain for Channel 2.",
        "type": "knob"
      },
      {
        "name": "Level 2",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts output level of Channel 2.",
        "type": "knob"
      },
      {
        "name": "Gain 3",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Controls pre-amp gain for Channel 3.",
        "type": "knob"
      },
      {
        "name": "Level 3",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts output level of Channel 3.",
        "type": "knob"
      },
      {
        "name": "Bass 2/3",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts low frequencies for the shared Channel 2 and 3 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Middle 2/3",
        "range": "0.0 to 10.0",
        "defaultVal": "5.5",
        "description": "Adjusts midrange frequencies for the shared Channel 2 and 3 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Treble 2/3",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts high frequencies for the shared Channel 2 and 3 passive tone stack.",
        "type": "knob"
      },
      {
        "name": "Bright 2/3",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages treble boost for Channel 2 and 3.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Voice 2/3",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Alters the midrange voicing curve of Channels 2 and 3.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
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
      },
      {
        "name": "Presence",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Adjusts high-frequency power amp feedback response.",
        "type": "knob"
      },
      {
        "name": "Depth",
        "range": "0.0 to 10.0",
        "defaultVal": "5.0",
        "description": "Controls low-frequency power amp cabinet resonance.",
        "type": "knob"
      },
      {
        "name": "Feedback",
        "range": "Low / Mid / High",
        "defaultVal": "Mid",
        "description": "Adjusts the negative feedback loop of the power amp stage to control overall feel, gain, and tightness.",
        "type": "switch",
        "options": [
          "Low",
          "Mid",
          "High"
        ]
      },
      {
        "name": "Gate Threshold",
        "range": "-120.0 dB to 0.0 dB",
        "defaultVal": "-80.0 dB",
        "description": "Sets the threshold of the premium Brainworx noise gate to attenuate high-gain hum and hiss.",
        "type": "knob"
      },
      {
        "name": "Gate Range",
        "range": "0.0 dB to -90.0 dB",
        "defaultVal": "-60.0 dB",
        "description": "Determines the maximum attenuation applied to the signal when the noise gate is closed.",
        "type": "knob"
      },
      {
        "name": "Cab Bypass",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Bypasses the recording chains (speaker cabinet and mic emulation) for use with external cabinet IR host plugins.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Recording Chain Select",
        "range": "1 to 120",
        "defaultVal": "1",
        "description": "Selects from 120 custom recording chains featuring legendary speaker cabinets, boutique microphones, and console preamps.",
        "type": "knob"
      },
      {
        "name": "FX Delay Time",
        "range": "1.0 ms to 1000.0 ms",
        "defaultVal": "350.0 ms",
        "description": "Sets the delay time for the built-in FX Rack feedback delay.",
        "type": "knob"
      },
      {
        "name": "FX Delay Feedback",
        "range": "0% to 100%",
        "defaultVal": "25%",
        "description": "Controls the number of delay repeats inside the FX Rack feedback loop.",
        "type": "knob"
      },
      {
        "name": "FX Delay Mix",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Adjusts the wet/dry mix of the FX delay signal.",
        "type": "knob"
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
        "range": "BP-251 / BP-47M / BP-67 / BP-12A / BP-C12 / BP-37A / BP-405 / BP-44 / BP-30",
        "defaultVal": "BP-47M",
        "description": "Selects vintage microphone model emulation from Bill Putnam's collection.",
        "type": "select",
        "options": [
          "BP-251",
          "BP-47M",
          "BP-67",
          "BP-12A",
          "BP-C12",
          "BP-37A",
          "BP-405",
          "BP-44",
          "BP-30"
        ]
      },
      {
        "name": "Polar Pattern",
        "range": "Omni to Figure-8 (Continuous)",
        "defaultVal": "Cardioid",
        "description": "Continuously adjusts polar response pattern from omnidirectional to figure-8, even after tracking.",
        "type": "knob"
      },
      {
        "name": "Proximity",
        "range": "-50% to +150%",
        "defaultVal": "100%",
        "description": "Adjusts proximity-effect low frequencies to control low-end weight without altering high-frequency response.",
        "type": "knob"
      },
      {
        "name": "Axis",
        "range": "0° to 180°",
        "defaultVal": "0°",
        "description": "Simulates rotating the virtual microphone off-axis to tame harsh transients or room resonances.",
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
      "Select the 'BP-251' model for vocal tracks. It has an incredibly open, rich, and highly premium high end that sits beautifully on modern pop and hip-hop leads.",
      "Adjust the Proximity control counter-clockwise on the BP-44 ribbon emulation to eliminate proximity low-end rumble while preserving its signature warm high-end roll-off.",
      "Engage the low cut at 80 Hz directly in the mic modeler to clear away room air conditioner hum before compression."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad ampeg svt-vr classic bass amplifier",
    "displayName": "UAD Ampeg SVT-VR Classic Bass Amplifier",
    "category": "Guitar & Bass",
    "description": "The definitive rock and roll bass stack. Captures the high-headroom, earth-shaking all-tube 300-watt growl of the legendary SVT amplifier and classic 8x10 speaker cabinet, modeled on Channel 2 (Normal Channel).",
    "hardwareModel": "Ampeg SVT-VR All-Tube Bass Amplifier (Channel 2)",
    "parameters": [
      {
        "name": "Volume",
        "range": "0 to 10 (Continuous)",
        "defaultVal": "4",
        "description": "Controls the input level and preamp gain of Channel 2, introducing rich tube drive at higher levels.",
        "type": "knob"
      },
      {
        "name": "Treble",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts high-frequency shelving gain to control crispness and click.",
        "type": "knob"
      },
      {
        "name": "Bass",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low-frequency response to add weight or control boominess.",
        "type": "knob"
      },
      {
        "name": "Ultra-Hi",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a high-frequency boost to add treble clarity, brightness, and attack.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Ultra-Lo",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a massive low-frequency boost coupled with a subtle mid-frequency cut for deep rumble.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Engage 'Ultra-Hi' to add crisp treble presence and clicky pick attack, helping bass lines slice clearly through dense, high-gain guitar walls.",
      "Engage 'Ultra-Lo' to add massive, rumbling sub-bass weight, but be sure to keep the Bass control balanced to avoid overloading the console bus.",
      "Crank the Volume control to saturate the virtual power tubes for organic, thick analog compression and natural harmonic growl."
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
        "range": "-20 dB to -80 dB",
        "defaultVal": "-30 dB",
        "description": "Sets input level/mic sensitivity. Automatically sets mic input impedance to 1200 Ω when set between -20 dB and -50 dB, or to 600 Ω when set between -55 dB and -80 dB.",
        "type": "knob"
      },
      {
        "name": "Pad",
        "range": "Off / -20 dB",
        "defaultVal": "Off",
        "description": "Applies a 20 dB input pad to handle hot signal levels and prevent harsh input clipping.",
        "type": "switch",
        "options": [
          "Off",
          "-20 dB"
        ]
      },
      {
        "name": "Phase",
        "range": "Normal / Inverted",
        "defaultVal": "Normal",
        "description": "Inverts the signal polarity by 180 degrees to resolve multi-microphone phase cancellation.",
        "type": "switch",
        "options": [
          "Normal",
          "Inverted"
        ]
      },
      {
        "name": "Low Cut Filter",
        "range": "Off / 80 Hz",
        "defaultVal": "Off",
        "description": "Engages an 18 dB per octave high-pass filter at 80 Hz to cut out low-frequency rumble.",
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
        "description": "Controls the output level, compensating for volume spikes after driving the input stage.",
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
    "name": "uad helios type 69 preamp and eq collection",
    "displayName": "UAD Helios Type 69 Preamp and EQ Collection",
    "category": "Equalizers",
    "description": "The sound of 1970s British rock. Emulates the legendary Helios console strips with highly musical, broad, interactive frequency bands and aggressive custom lustrum iron transformers.",
    "hardwareModel": "Helios Type 69 Console Channel Strip",
    "parameters": [
      {
        "name": "Mic/Line",
        "range": "Mic / Line",
        "defaultVal": "Mic",
        "description": "Selects between Microphone input stage and Line level input stage.",
        "type": "switch",
        "options": [
          "Mic",
          "Line"
        ]
      },
      {
        "name": "Preamplifier Gain",
        "range": "20 dB to 80 dB",
        "defaultVal": "30 dB",
        "description": "Sets input gain and drives the vintage console preamplifier.",
        "type": "knob"
      },
      {
        "name": "Pad",
        "range": "Off / -20 dB",
        "defaultVal": "Off",
        "description": "Engages a 20 dB input attenuation pad for hot signal sources.",
        "type": "switch",
        "options": [
          "Off",
          "-20 dB"
        ]
      },
      {
        "name": "Phase",
        "range": "Normal / Inverted",
        "defaultVal": "Normal",
        "description": "Inverts signal polarity by 180 degrees to resolve multi-microphone phase cancellation.",
        "type": "switch",
        "options": [
          "Normal",
          "Inverted"
        ]
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 40 Hz / 80 Hz",
        "defaultVal": "Off",
        "description": "Cuts low-frequency rumble at 40 Hz or 80 Hz with an 18 dB per octave high-pass slope.",
        "type": "switch",
        "options": [
          "Off",
          "40 Hz",
          "80 Hz"
        ]
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
      },
      {
        "name": "Output",
        "range": "-inf to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts final output level of the channel strip.",
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
  }
];
