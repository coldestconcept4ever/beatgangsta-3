import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad precision maximizer"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad precision maximizer",
    "displayName": "UAD Precision Maximizer",
    "category": "Dynamics",
    "description": "A proprietary dynamic peak-limiting and harmonic-shaping plugin designed to increase the perceived volume, warmth, and density of program material without degrading punch, transient detail, or master headroom.",
    "hardwareModel": "Universal Audio Precision Maximizer",
    "parameters": [
      {
        "name": "Input",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Adjusts the input level.",
        "type": "knob"
      },
      {
        "name": "Shape",
        "range": "0% to 100%",
        "defaultVal": "50%",
        "description": "Contours even and odd-order tube-style saturation curves.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Wet/Dry parallel processing blend.",
        "type": "knob"
      },
      {
        "name": "Band Mode",
        "range": "1-Band / 3-Band",
        "defaultVal": "3-Band",
        "description": "Toggles between wide-band or multi-band harmonic processing.",
        "type": "switch",
        "options": [
          "1-Band",
          "3-Band"
        ]
      },
      {
        "name": "Limit",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Engages the final brickwall limiter.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "Output",
        "range": "-20 to 0 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the final output level ceiling.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Set the Band Mode to 3-Band on master tracks to excite low, mid, and high bands independently, producing an overall louder and denser commercial master.",
      "Blend the processor at 40% Mix on drum subgroups to introduce punchy, parallel tape-like saturation while preserving clean transient bite underneath."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
