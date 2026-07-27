import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad emt 140 plate reverb"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad emt 140 plate reverb",
    "displayName": "UAD EMT 140 Plate Reverb",
    "category": "Reverbs & Delays",
    "description": "Meticulous emulation of the legendary German physical plate reverb. It models three unique plates (A, B, and C) stored at The Plant Studios, delivering the dense, silky, and infinitely lush decay that defined modern vocal reverb.",
    "hardwareModel": "EMT 140 Steel Plate Reverb",
    "parameters": [
      {
        "name": "Plate Select",
        "range": "A / B / C",
        "defaultVal": "A",
        "description": "Selects between three plates with different damping qualities.",
        "type": "switch",
        "options": [
          "A",
          "B",
          "C"
        ]
      },
      {
        "name": "Reverb Time",
        "range": "0.5s to 5.5s",
        "defaultVal": "2.0s",
        "description": "Determines decay length of the virtual plate surface.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0ms to 250ms",
        "defaultVal": "0ms",
        "description": "Adjusts time gap before reverb onset.",
        "type": "knob"
      },
      {
        "name": "Input Filter",
        "range": "Off / 90 / 250 Hz",
        "defaultVal": "Off",
        "description": "Reduces low-frequency buildup on input.",
        "type": "switch",
        "options": ["Off", "90 Hz", "250 Hz"]
      },
      {
        "name": "Bass Cut Filter",
        "range": "Off to 500 Hz",
        "defaultVal": "Off",
        "description": "Cuts low frequencies from the output signal.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends dry and processed signals.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select Plate A for high-frequency silk and vintage vocal shines, while Plate B offers a warmer, more balanced low-mid response suitable for acoustic guitars and drum rooms.",
      "Always use 30 to 60 ms of Pre-Delay on lead vocals to allow the dry vocal transients to pop through cleanly before the dense plate reverb tail blossoms."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad emt 140": \[/, '"uad emt 140 plate reverb": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

