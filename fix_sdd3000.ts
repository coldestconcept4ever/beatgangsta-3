import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const replacement = `  {
    "name": "uad korg sdd-3000 digital delay",
    "displayName": "UAD Korg SDD-3000 Digital Delay",
    "category": "Reverbs & Delays",
    "description": "The legendary 1980s rack delay. Famous for its highly interactive, colorful analog input preamplifier circuitry, custom feedback filters, and deep pitch modulation.",
    "hardwareModel": "Korg SDD-3000 Digital Delay",
    "parameters": [
      {
        "name": "Input Attenuator",
        "range": "-30 dB / -10 dB / +4 dB",
        "defaultVal": "-10 dB",
        "description": "Sets the headroom sensitivity of the physical analog preamp section.",
        "type": "select",
        "options": [
          "-30 dB",
          "-10 dB",
          "+4 dB"
        ]
      },
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the input gain into the delay line.",
        "type": "knob"
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
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Controls the feedback level of delay repetitions.",
        "type": "knob"
      },
      {
        "name": "Filter Low Cut",
        "range": "FLAT / 125 Hz / 250 Hz / 500 Hz",
        "defaultVal": "FLAT",
        "description": "Applies low-cut dampening on delay repetitions.",
        "type": "select",
        "options": [
          "FLAT",
          "125 Hz",
          "250 Hz",
          "500 Hz"
        ]
      },
      {
        "name": "Filter High Cut",
        "range": "FLAT / 8 kHz / 4 kHz / 2 kHz",
        "defaultVal": "FLAT",
        "description": "Applies high-cut dampening on delay repetitions.",
        "type": "select",
        "options": [
          "FLAT",
          "8 kHz",
          "4 kHz",
          "2 kHz"
        ]
      },
      {
        "name": "Mod Waveform",
        "range": "Triangle / Square / Envelope / Random",
        "defaultVal": "Triangle",
        "description": "Selects the LFO modulation waveform shape.",
        "type": "select",
        "options": [
          "Triangle",
          "Square",
          "Envelope",
          "Random"
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
        "range": "0 to 10",
        "defaultVal": "1.5",
        "description": "Controls the depth of delay pitch modulation.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The input preamp is highly dynamic. Choose '-30 dB' and drive the Input Level higher to introduce sweet, organic preamplifier saturation.",
      "For a classic 'The Edge' delay sound, set delay time to a dotted eighth note value (around 350-450 ms), select Triangle modulation, and increase Intensity slightly.",
      "Use the Low Cut and High Cut filters in the feedback path to make delay repeats sit perfectly behind a live vocal without causing frequency build-ups."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

// Use regex to replace the old plugin definition
const regex = /\{\s*"name":\s*"uad korg sdd-3000 digital delay"[\s\S]*?"Authorized for all devices"\s*\}/;
content = content.replace(regex, replacement);

fs.writeFileSync(DB_PATH, content, 'utf-8');
