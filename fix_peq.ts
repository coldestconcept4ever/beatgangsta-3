import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad precision equalizer"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
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
        "name": "Low Band Freq",
        "range": "10 Hz to 2.0 kHz",
        "defaultVal": "100 Hz",
        "description": "Selects low band center frequency.",
        "type": "knob"
      },
      {
        "name": "Low Band Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on low band.",
        "type": "knob"
      },
      {
        "name": "Low-Mid Freq",
        "range": "20 Hz to 4.0 kHz",
        "defaultVal": "200 Hz",
        "description": "Selects low-mid band center frequency.",
        "type": "knob"
      },
      {
        "name": "Low-Mid Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on low-mid parametric band.",
        "type": "knob"
      },
      {
        "name": "High-Mid Freq",
        "range": "1.0 kHz to 16.0 kHz",
        "defaultVal": "2.0 kHz",
        "description": "Selects high-mid band center frequency.",
        "type": "knob"
      },
      {
        "name": "High-Mid Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on high-mid parametric band.",
        "type": "knob"
      },
      {
        "name": "High Band Freq",
        "range": "2.0 kHz to 40.0 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects high band center frequency.",
        "type": "knob"
      },
      {
        "name": "High Band Gain",
        "range": "-8dB to +8dB",
        "defaultVal": "0 dB",
        "description": "Sets boost or cut level on high-shelf band.",
        "type": "knob"
      },
      {
        "name": "High-Cut Filter",
        "range": "Off / 4 kHz to 40 kHz",
        "defaultVal": "Off",
        "description": "Enables sharp low-pass filter curve at selected step.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize the 10 Hz or 20 Hz low-cut filter on your master bus to safely strip away sub-sonic rumble and gain massive headroom without altering the audible bass response.",
      "Use the 16 kHz High-Mid frequency band with a very subtle 0.5 to 1 dB boost in stereo link mode to open up the top-end of a master with zero phase smear."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
