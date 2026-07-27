import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ampex atr-102 tape recorder"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
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
        "name": "Tape Width",
        "range": "1/4\" / 1/2\" / 1\"",
        "defaultVal": "1/2\"",
        "description": "Adjusts the virtual tape path and tape head hardware configurations.",
        "type": "select",
        "options": [
          "1/4\"",
          "1/2\"",
          "1\""
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
        "name": "Repro Level",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Sets the makeup gain from the reproduction head.",
        "type": "knob"
      },
      {
        "name": "Bias Mode",
        "range": "Normal / Over / Under",
        "defaultVal": "Normal",
        "description": "Controls bias alignment mode.",
        "type": "select",
        "options": [
          "Normal",
          "Over",
          "Under"
        ]
      },
      {
        "name": "Tape Hiss Switch",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Engages physical tape hiss.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "Hum Switch",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Engages AC power hum.",
        "type": "switch",
        "options": ["Off", "On"]
      }
    ],
    "proTips": [
      "For classic stereo master bus processing, select 15 IPS, use 456 formulation on 1/2-inch tape, and adjust Record Level until your peaks compress by only 1 dB to 2 dB for natural glue.",
      "Use 30 IPS with GP9 tape on a 1-inch tape width configuration when mastering acoustic, classical, or jazz recordings for modern, pristine linearity with subtle organic depth."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad ampex atr-102": \[/, '"uad ampex atr-102 tape recorder": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
