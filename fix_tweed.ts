import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad fender 55 tweed deluxe amplifier"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad fender 55 tweed deluxe amplifier",
    "displayName": "UAD Fender 55 Tweed Deluxe Amplifier",
    "category": "Guitar & Bass",
    "description": "Recreates the historic 1955 Fender Tweed Deluxe amplifier. Captured in meticulous physical detail down to the interactive tube behaviors, speaker cabinet variations, and dual-input jumping, it provides the signature warm, rich clean tones and raw, exploding tube-saturation of the legendary 5E3 circuit.",
    "hardwareModel": "1955 Fender Deluxe (5E3 Tweed) Amplifier",
    "parameters": [
      {
        "name": "Instrument Volume",
        "range": "1 to 12",
        "defaultVal": "1",
        "description": "Controls gain and drive levels for the Instrument channel inputs.",
        "type": "knob"
      },
      {
        "name": "Mic Volume",
        "range": "1 to 12",
        "defaultVal": "1",
        "description": "Adjusts output and gain interactive behavior for the Mic channel inputs.",
        "type": "knob"
      },
      {
        "name": "Tone Control",
        "range": "1 to 12",
        "defaultVal": "6",
        "description": "Sweeps the overall high-frequency and low-frequency tonal balance.",
        "type": "knob"
      },
      {
        "name": "Speaker Selection",
        "range": "JP12 / Vintage / JBL",
        "defaultVal": "Vintage",
        "description": "Selects the speaker model to change speaker compression and response curves.",
        "type": "select",
        "options": [
          "JP12",
          "Vintage",
          "JBL"
        ]
      },
      {
        "name": "Mic Placement",
        "range": "On Axis / Off Axis / Edge",
        "defaultVal": "On Axis",
        "description": "Selects the microphone placement relative to the speaker cone.",
        "type": "select",
        "options": [
          "On Axis",
          "Off Axis",
          "Edge"
        ]
      },
      {
        "name": "Input Select",
        "range": "Inst 1 / Inst 2 / Mic 1 / Mic 2 / Jumped",
        "defaultVal": "Inst 1",
        "description": "Selects physical input configuration including jumped dual-channel operation.",
        "type": "select",
        "options": [
          "Inst 1",
          "Inst 2",
          "Mic 1",
          "Mic 2",
          "Jumped"
        ]
      }
    ],
    "proTips": [
      "To experience the iconic exploding Tweed crunch, select the 'Jumped' input, set both Instrument and Mic Volume controls to 8 or higher, and back off your guitar volume slightly to control the bloom.",
      "Switch the speaker cab to the 'JBL' option to tighten up the fuzzy low-end and add a glassy, hi-fi top-end sheen that is perfect for classic country or clean funk rhythms."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad fender 55 tweed deluxe": \[/, '"uad fender 55 tweed deluxe amplifier": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

