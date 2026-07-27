import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad precision buss compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
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
        "range": "0.1 to 32 ms",
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
      },
      {
        "name": "Filter",
        "range": "Off / 20 to 500 Hz",
        "defaultVal": "Off",
        "description": "Sets the high-pass sidechain filter frequency.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends dry and compressed signal.",
        "type": "knob"
      },
      {
        "name": "Make Up",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts makeup output volume.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select the 1.5:1 ratio on a master bus for microscopic, near-invisible master gluing that respects the natural dynamics of acoustic ensembles.",
      "Set the Filter parameter to 120Hz on modern EDM tracks so that deep sub-bass frequencies do not trigger unwanted compressor pumping."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
