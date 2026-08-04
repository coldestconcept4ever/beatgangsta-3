export interface VSTDatabaseEntry {
  name: string;
  displayName: string;
  vendor: string;
  category: string;
  description: string;
  parameters: any[];
}

export const VST_DATABASE: VSTDatabaseEntry[] = [
  {
    name: "bx_console ssl 9000 j",
    displayName: "bx_console SSL 9000 J",
    vendor: "Brainworx / Plugin Alliance",
    category: "Channel Strips",
    description: "Emulation of the legendary Solid State Logic 9000 J series console channel strip. Features TMT (Tolerance Modeling Technology) for authentic analog variation between channels, providing deep, punchy low-end and pristine high-end. Includes EQ, Dynamics, and Filters.",
    parameters: [
      { name: "TMT Channel", description: "Selects the specific modeled channel (1-72) to introduce slight analog component tolerances.", type: "knob" },
      { name: "V-Gain", description: "Simulates analog noise floor.", type: "knob" },
      { name: "THD", description: "Adds harmonic distortion to the signal.", type: "knob" },
      { name: "Compressor Threshold", description: "Sets the level at which compression begins.", type: "knob" },
      { name: "Compressor Ratio", description: "Compression ratio.", type: "knob" },
      { name: "Compressor Attack", description: "Fast or Slow attack time.", type: "switch" },
      { name: "Compressor Release", description: "Release time.", type: "knob" },
      { name: "EQ LF", description: "Low frequency gain and frequency selection.", type: "knob" },
      { name: "EQ LMF", description: "Low-mid frequency gain, frequency, and Q.", type: "knob" },
      { name: "EQ HMF", description: "High-mid frequency gain, frequency, and Q.", type: "knob" },
      { name: "EQ HF", description: "High frequency gain and frequency selection.", type: "knob" },
      { name: "Filters (HPF/LPF)", description: "High-pass and low-pass filter frequency controls.", type: "knob" },
      { name: "EQ to Dynamics", description: "Places EQ before Dynamics in the signal chain.", type: "switch" }
    ]
  },
  {
    name: "lurssen mastering console",
    displayName: "IK Multimedia - Lurssen Mastering Console",
    vendor: "IK Multimedia / Gavin Lurssen",
    category: "Mastering Console",
    description: "Multi-processor mastering console emulating Gavin Lurssen's proprietary hardware chain and mastering philosophy. Features a 5-band fixed EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz) with 1dB integer stepped gain dials, a master Push control that shifts all 5 EQ dials simultaneously, continuous Input Drive (-15dB to +15dB), and 40 Style/Genre presets.",
    parameters: [
      { name: "Input Drive", description: "Controls input gain and harmonic saturation (-15.0 dB to +15.0 dB, float/decimal allowed e.g. 2.8 dB).", type: "knob" },
      { name: "60Hz EQ", description: "Low sub-shelf filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "120Hz EQ", description: "Low-mid bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "3kHz EQ", description: "Midrange bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "6kHz EQ", description: "Presence bell filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "10kHz EQ", description: "High air shelf filter gain. STEPPED IN WHOLE 1 dB INTEGERS ONLY (e.g. -2 dB, -1 dB, 0 dB, +1 dB, +2 dB). No fractions or decimals.", type: "stepped-knob" },
      { name: "Push", description: "Master EQ gain offset control (-100% to +100%). NOTE: Turning Push moves/shifts ALL FIVE EQ band dials simultaneously in unison (+100% pushes all 5 dials up by +10 dB, -100% pulls all 5 dials down by -10 dB).", type: "knob" },
      { name: "Style / Genre Preset", description: "Loads one of 40 genre-specific mastering chain presets (e.g. Pop Rock, Hard Rock, Hip Hop, EDM, Americana, Jazz, Country).", type: "selector" }
    ]
  }
];
