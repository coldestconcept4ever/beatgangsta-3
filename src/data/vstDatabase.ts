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
  }
];
