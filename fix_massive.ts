import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad manley massive passive eq collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad manley massive passive eq collection",
    "displayName": "UAD Manley Massive Passive EQ Collection",
    "category": "Equalizers",
    "description": "A faithful emulation of the legendary two-channel tube passive equalizer. It models the complex interaction of the physical inductors and tube amplification stages, allowing engineers to apply heavy boosts to high-end air and low-end punch without harshness.",
    "hardwareModel": "Manley Massive Passive Stereo Tube Equalizer",
    "parameters": [
      {
        "name": "Low Shelf Freq",
        "range": "22 Hz to 1k Hz",
        "defaultVal": "47 Hz",
        "description": "Selects the passive inductor frequency step for the low-frequency band.",
        "type": "select",
        "options": [
          "22 Hz",
          "33 Hz",
          "47 Hz",
          "68 Hz",
          "100 Hz",
          "150 Hz",
          "220 Hz",
          "330 Hz",
          "470 Hz",
          "680 Hz",
          "1k Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the degree of cut or boost for the first passive band.",
        "type": "knob"
      },
      {
        "name": "Low Bandwidth",
        "range": "Sharp to Broad",
        "defaultVal": "Broad",
        "description": "Alters the Q factor of the low band's passive curve.",
        "type": "knob"
      },
      {
        "name": "Low Mid Freq",
        "range": "82 Hz to 3.9k Hz",
        "defaultVal": "330 Hz",
        "description": "Selects frequency for low-mid band.",
        "type": "select",
        "options": [
          "82 Hz",
          "120 Hz",
          "180 Hz",
          "270 Hz",
          "390 Hz",
          "560 Hz",
          "820 Hz",
          "1.2k Hz",
          "1.8k Hz",
          "2.7k Hz",
          "3.9k Hz"
        ]
      },
      {
        "name": "Low Mid Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets gain for low-mid band.",
        "type": "knob"
      },
      {
        "name": "High Mid Freq",
        "range": "220 Hz to 10k Hz",
        "defaultVal": "1k Hz",
        "description": "Selects frequency for high-mid band.",
        "type": "select",
        "options": [
          "220 Hz",
          "330 Hz",
          "470 Hz",
          "680 Hz",
          "1k Hz",
          "1.5k Hz",
          "2.2k Hz",
          "3.3k Hz",
          "4.7k Hz",
          "6.8k Hz",
          "10k Hz"
        ]
      },
      {
        "name": "High Mid Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets gain for high-mid band.",
        "type": "knob"
      },
      {
        "name": "High Freq",
        "range": "560 Hz to 27k Hz",
        "defaultVal": "5.6k Hz",
        "description": "Selects frequency for high band.",
        "type": "select",
        "options": [
          "560 Hz",
          "820 Hz",
          "1.2k Hz",
          "1.8k Hz",
          "2.7k Hz",
          "3.9k Hz",
          "5.6k Hz",
          "8.2k Hz",
          "12k Hz",
          "16k Hz",
          "27k Hz"
        ]
      },
      {
        "name": "High Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets gain for high band.",
        "type": "knob"
      },
      {
        "name": "High Bandwidth",
        "range": "Sharp to Broad",
        "defaultVal": "Broad",
        "description": "Alters Q factor for high band.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 22 Hz / 39 Hz / 68 Hz / 120 Hz / 220 Hz",
        "defaultVal": "Off",
        "description": "Engages the stepped, passive high-pass filter circuit.",
        "type": "select",
        "options": [
          "Off",
          "22 Hz",
          "39 Hz",
          "68 Hz",
          "120 Hz",
          "220 Hz"
        ]
      }
    ],
    "proTips": [
      "For a stunning, expensive-sounding vocal top-end, set Band 4 to Broad Bell at 16 kHz and boost it by 4 dB. It adds pristine 'air' without bringing out harsh sibilance.",
      "Add immense warmth to rock mixes by setting Band 1 to 47 Hz in Shelf mode with a broad bandwidth, boosting it by 2.5 dB to elevate the bass weight smoothly."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad manley massive passive": \[/, '"uad manley massive passive eq collection": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

