import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad studer a800 tape recorder"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
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
        "name": "Input Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Drives the tape record head input, introducing classic tape saturation.",
        "type": "knob"
      },
      {
        "name": "Output Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts playback output trim to maintain proper level staging.",
        "type": "knob"
      },
      {
        "name": "Cal Level",
        "range": "+3 dB / +6 dB / +7.5 dB / +9 dB",
        "defaultVal": "+6 dB",
        "description": "Selects the calibration operating level.",
        "type": "select",
        "options": [
          "+3 dB",
          "+6 dB",
          "+7.5 dB",
          "+9 dB"
        ]
      },
      {
        "name": "Bias",
        "range": "Under / Normal / Over",
        "defaultVal": "Normal",
        "description": "Adjusts the HF bias current.",
        "type": "knob"
      },
      {
        "name": "Sync/Repro path",
        "range": "Input / Sync / Repro",
        "defaultVal": "Repro",
        "description": "Selects the playback monitor path.",
        "type": "select",
        "options": [
          "Input",
          "Sync",
          "Repro"
        ]
      }
    ],
    "proTips": [
      "On acoustic drum kits, run the Studer A800 across all individual tracks at 15 IPS using the 456 tape formula. Drive the Input until you get subtle low-end compression on kicks and snares.",
      "For pristine, clean modern vocals, select 30 IPS and the GP9 tape formula. It provides a linear frequency response while rounding off sharp, sibilant vocal transients."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad studer a800": \[/, '"uad studer a800 tape recorder": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

