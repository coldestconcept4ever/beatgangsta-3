import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad pultec passive eq collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad pultec passive eq collection",
    "displayName": "UAD Pultec Passive EQ Collection",
    "category": "Equalizers",
    "description": "The definitive emulation of the highly coveted, classic passive tube EQs. Modeled on vintage EQP-1A, MEQ-5, and HLF-3C units, this collection captures the musical, interlocking filter curves and rich vacuum tube output stages that add high-end silk and low-end authority to any mix.",
    "hardwareModel": "Pultec EQP-1A, MEQ-5, and HLF-3C Passive Equalizers",
    "parameters": [
      {
        "name": "Low Frequency Select",
        "range": "20 / 30 / 60 / 100 Hz",
        "defaultVal": "30 Hz",
        "description": "Sets low shelf cutoff frequency.",
        "type": "select",
        "options": [
          "20 Hz",
          "30 Hz",
          "60 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Boosts low-frequency shelf.",
        "type": "knob"
      },
      {
        "name": "Low Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Attenuates low-frequency shelf.",
        "type": "knob"
      },
      {
        "name": "High Frequency Select",
        "range": "3 / 4 / 5 / 8 / 10 / 12 / 16 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets high boost center frequency.",
        "type": "select",
        "options": [
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "8 kHz",
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ]
      },
      {
        "name": "High Bandwidth (Q)",
        "range": "Sharp to Broad",
        "defaultVal": "Broad",
        "description": "Controls the bandwidth (Q) for the high frequency boost.",
        "type": "knob"
      },
      {
        "name": "High Boost",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Boosts high-frequency peak.",
        "type": "knob"
      },
      {
        "name": "High Atten Frequency",
        "range": "5 / 10 / 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets the target frequency for the high attenuation shelf.",
        "type": "select",
        "options": [
          "5 kHz",
          "10 kHz",
          "20 kHz"
        ]
      },
      {
        "name": "High Atten",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Attenuates high-frequency shelf.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Perform the iconic 'Pultec trick' on kick drums by setting Low Frequency Select to 60 Hz, then simultaneously boosting Low Boost to 5 and setting Low Atten to 4 to tighten sub frequencies while removing low-mid mud.",
      "Use a broad High Boost at 12 kHz to add expensive 'expensive air' and breathiness to vocals without introducing harshness."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad pultec eqp-1a": \[/, '"uad pultec passive eq collection": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

