import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 1073 legacy eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 1073 legacy eq",
    "displayName": "UAD Neve 1073 Legacy EQ",
    "category": "Equalizers",
    "description": "The classic DSP-efficient emulation of the most famous console module in recording history. Provides the legendary high shelf air, the gritty, punchy mid-band, and the signature rich low-end saturation of the Neve 1073.",
    "hardwareModel": "Neve 1073 Channel Amplifier",
    "parameters": [
      {
        "name": "Phase",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Flips the phase of the signal.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "EQ In/Out",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses the EQ circuitry.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "High Shelf",
        "range": "-16 to +16 dB",
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
        "range": "-18 to +18 dB",
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
      },
      {
        "name": "Low Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level of low band.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 50 to 300 Hz",
        "defaultVal": "Off",
        "description": "Selects high pass filter step value.",
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
      "Boost the fixed 12 kHz high shelf by 2 to 4 dB to add that signature Neve expensive high-end air to vocals, acoustic guitars, and drum overheads.",
      "To cure thin-sounding snare drums, select 110 Hz or 220 Hz on the low band and boost 2-3 dB for an instant, warm chest punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
