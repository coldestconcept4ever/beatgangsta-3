import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad harrison 32c eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad harrison 32c eq",
    "displayName": "UAD Harrison 32C EQ",
    "category": "Equalizers",
    "description": "Emulates the four-band fully parametric console equalizer from the Harrison 32-Series console, famous for its sweepable high-pass and low-pass filters and highly musical, interactive bands that shaped Michael Jackson's 'Thriller'.",
    "hardwareModel": "Harrison 32C Console Equalizer",
    "parameters": [
      {
        "name": "Phase Invert",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Inverts signal phase.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "EQ In/Out",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses the EQ circuitry.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "High Pass Filter",
        "range": "Out / 25 to 3.15k Hz",
        "defaultVal": "Out",
        "description": "Sweeps the low-cut frequency.",
        "type": "knob"
      },
      {
        "name": "Low Pass Filter",
        "range": "Out / 400 to 20k Hz",
        "defaultVal": "Out",
        "description": "Sweeps the high-cut frequency.",
        "type": "knob"
      },
      {
        "name": "HF Frequency",
        "range": "800 Hz to 16k Hz",
        "defaultVal": "8k Hz",
        "description": "High band frequency.",
        "type": "knob"
      },
      {
        "name": "HF Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "High band bell/shelving boost or cut.",
        "type": "knob"
      },
      {
        "name": "HMF Frequency",
        "range": "400 Hz to 8k Hz",
        "defaultVal": "2k Hz",
        "description": "High-mid band frequency.",
        "type": "knob"
      },
      {
        "name": "HMF Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "High-mid band bell boost or cut.",
        "type": "knob"
      },
      {
        "name": "LMF Frequency",
        "range": "200 Hz to 4k Hz",
        "defaultVal": "1k Hz",
        "description": "Low-mid band frequency.",
        "type": "knob"
      },
      {
        "name": "LMF Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Low-mid band bell boost or cut.",
        "type": "knob"
      },
      {
        "name": "LF Frequency",
        "range": "40 Hz to 800 Hz",
        "defaultVal": "100 Hz",
        "description": "Low band frequency.",
        "type": "knob"
      },
      {
        "name": "LF Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Low band bell/shelving boost or cut.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Utilize the sweepable High Pass Filter up to 80Hz on thin vocals to clear out muddy low-end room reflections without sacrificing weight.",
      "Boost 2-3dB with the Hi Gain band on snare drums to highlight attack and splash, while pulling down the Low Pass filter slightly to roll off unwanted cymbal bleed."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad harrison 32c channel eq": \[/, '"uad harrison 32c eq": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

