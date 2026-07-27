import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad empirical labs el7 fatso compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad empirical labs el7 fatso compressor",
    "displayName": "UAD Empirical Labs EL7 FATSO Compressor",
    "category": "Tape & Saturation",
    "description": "An elite recreation of Empirical Labs' analog tape simulator and optimizer. Combining custom clipper-harmonic generation, dynamic high-frequency limiters, and vintage VCA compression, it tames transient peaks with warm, analog saturation.",
    "hardwareModel": "Empirical Labs EL7 FATSO Jr. / Sr.",
    "parameters": [
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls input drive into the saturation circuit, simultaneously establishing compression threshold.",
        "type": "knob"
      },
      {
        "name": "Output Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the final playback output gain stage.",
        "type": "knob"
      },
      {
        "name": "Warmth",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Sets the threshold of the dynamic high-frequency limiter to emulate tape-saturation high-end roll-off.",
        "type": "knob"
      },
      {
        "name": "Tranny",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Engages the transformer emulation circuit to impart low-end harmonics and thicken bass.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "Compressor Mode",
        "range": "Off / Buss / GP / Tracking / Spank",
        "defaultVal": "Buss",
        "description": "Selects compression behaviors, from gentle stereo bus processing (Buss) to aggressive brickwall limiting (Spank).",
        "type": "select",
        "options": [
          "Off",
          "Buss",
          "GP",
          "Tracking",
          "Spank"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a high-pass filter in the compressor's sidechain path to prevent low-end pumping.",
        "type": "switch",
        "options": [
          "Off",
          "On"
        ]
      }
    ],
    "proTips": [
      "On acoustic drum rooms or overheads, select 'Spank' mode, turn Warmth to 5, and push the Input until the orange Warmth LED flashes to crush the transients while warming up the cymbals.",
      "For mix bus processing, select 'Buss' mode with the Sidechain Filter active. Drive the Input level gently so the 0 dB or 1 dB compression LEDs light up on kick drums for subtle, analog glue."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad empirical labs el7 fatso": \[/, '"uad empirical labs el7 fatso compressor": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
