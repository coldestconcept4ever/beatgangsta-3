import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 33609 stereo limiter compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 33609 stereo limiter compressor",
    "displayName": "UAD Neve 33609 Stereo Limiter Compressor",
    "category": "Dynamics",
    "description": "Perfect emulation of the legendary diode-bridge compressor/limiter first introduced in 1969. Famous for its discrete, feedback-style compression that glues stereo tracks, master buses, and drum groups with unmistakable analog fatness.",
    "hardwareModel": "Neve 33609 Stereo Compressor/Limiter",
    "parameters": [
      {
        "name": "Compressor In",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses the compressor section.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "Compressor Threshold",
        "range": "-20dBu to +10dBu",
        "defaultVal": "+10 dBu",
        "description": "Sets the signal level at which compression begins.",
        "type": "knob"
      },
      {
        "name": "Compressor Recovery",
        "range": "100ms / 400ms / 800ms / 1.5s / Auto1 / Auto2",
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
        "name": "Compressor Gain",
        "range": "0 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Makeup gain for the compressor section.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 6:1",
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
        "name": "Limiter In",
        "range": "In / Out",
        "defaultVal": "Out",
        "description": "Bypasses the limiter section.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "Limiter Threshold",
        "range": "+4dBm to +15dBm",
        "defaultVal": "+15 dBm",
        "description": "Sets threshold for the independent peak limiter stage.",
        "type": "knob"
      },
      {
        "name": "Limiter Recovery",
        "range": "50ms / 100ms / 200ms / 800ms / Auto1 / Auto2",
        "defaultVal": "50ms",
        "description": "Sets the limiter recovery time.",
        "type": "switch",
        "options": [
          "50ms",
          "100ms",
          "200ms",
          "800ms",
          "Auto1",
          "Auto2"
        ]
      },
      {
        "name": "Limiter Attack",
        "range": "Fast / Slow",
        "defaultVal": "Slow",
        "description": "Selects limiter attack time.",
        "type": "switch",
        "options": ["Fast", "Slow"]
      }
    ],
    "proTips": [
      "For master bus glue, use a low 1.5:1 or 2:1 ratio, a slow Recovery setting of Auto1 or Auto2, and adjust the threshold for a gentle 1 to 2 dB of gain reduction.",
      "Instantly beef up a drum group by selecting a fast 100ms or 400ms recovery time, driving the threshold for 4-6 dB of compression, and blending in parallel."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad neve 33609": \[/, '"uad neve 33609 stereo limiter compressor": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

