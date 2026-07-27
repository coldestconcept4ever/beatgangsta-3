import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad teletronix la-3a audio leveler"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
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
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Wet/Dry mix for parallel compression.",
        "type": "knob"
      },
      {
        "name": "HF Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Sidechain high-frequency emphasis for de-essing.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Insert on heavy electric rock guitars with Mode set to Compress and shave off 3-4dB to glue them instantly into a dense wall of sound.",
      "Use on lead vocals on top of an LA-2A in a serial compression chain to catch fast, stray transients that opto-tubes might miss."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"Gain Level": /g, '"Gain": ');
pContent = pContent.replace(/"Mode Select": /g, '"Mode": ');
pContent = pContent.replace(/"Sidechain Mod \(HF\)": /g, '"HF Filter": ');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

