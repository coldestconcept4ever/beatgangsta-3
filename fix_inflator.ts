import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad oxford inflator"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad oxford inflator",
    "displayName": "UAD Oxford Inflator",
    "category": "Dynamics",
    "description": "A legendary loudness and saturation tool that increases apparent volume and presence without altering dynamic range or clipping peaks. It adds warmth, excitement, and analog-style fullness, making individual tracks or full mixes pop.",
    "hardwareModel": "Sonnox Oxford Inflator Digital Processor",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets drive level entering the processor.",
        "type": "knob"
      },
      {
        "name": "Effect",
        "range": "0% to 100%",
        "defaultVal": "0%",
        "description": "Controls loudness expansion blend.",
        "type": "knob"
      },
      {
        "name": "Curve",
        "range": "-50 to +50",
        "defaultVal": "0",
        "description": "Adjusts harmonic generation curve behavior.",
        "type": "knob"
      },
      {
        "name": "Output Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts output volume.",
        "type": "knob"
      },
      {
        "name": "Clip 0dB",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Prevents signals from exceeding digital zero.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      },
      {
        "name": "Band Split",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Splits the signal into frequency bands to reduce intermodulation distortion.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "Place on master bus with Effect at 100% and Curve at +5 for a clean volume jump and thick, cohesive midrange.",
      "Drive Bass guitars with Input at +2 dB and Clip 0dB active to color the performance with rich harmonics that make the low end audible on small consumer devices."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

