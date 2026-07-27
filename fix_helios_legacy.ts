import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad helios type 69 legacy eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad helios type 69 legacy eq",
    "displayName": "UAD Helios Type 69 Legacy EQ",
    "category": "Equalizers",
    "description": "Emulation of the rare, highly musical analog EQ found in the Helios Type 69 consoles used at Olympic Studios, Island Studios, and on legendary rock recordings. Famous for its unique passive mid-band and distinct low-frequency shelving or sub-harmonic boost options.",
    "hardwareModel": "Helios Type 69 Console EQ",
    "parameters": [
      {
        "name": "10k Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Fixed 10 kHz high-shelf boost/cut.",
        "type": "knob"
      },
      {
        "name": "Mid Freq",
        "range": "0.7 to 6.0 kHz",
        "defaultVal": "0.7 kHz",
        "description": "Selects the target frequency for the mid-range band.",
        "type": "switch",
        "options": [
          "0.7 kHz",
          "1.0 kHz",
          "1.4 kHz",
          "2.0 kHz",
          "2.8 kHz",
          "3.5 kHz",
          "4.5 kHz",
          "6.0 kHz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "Peak or Trough (-15 to +15 dB)",
        "defaultVal": "0 dB",
        "description": "Sets the boost (peak) or cut (trough) amount for the selected mid frequency.",
        "type": "knob"
      },
      {
        "name": "Bass Freq",
        "range": "50 Hz / 100 Hz / 200 Hz / 300 Hz",
        "defaultVal": "50 Hz",
        "description": "Selects the bass band frequency.",
        "type": "switch",
        "options": ["50 Hz", "100 Hz", "200 Hz", "300 Hz"]
      },
      {
        "name": "Bass Gain",
        "range": "-15 to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets the boost or cut amount for the low-end band.",
        "type": "knob"
      },
      {
        "name": "EQ Bypass",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses the EQ circuitry.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "Phase Invert",
        "range": "In / Out",
        "defaultVal": "Out",
        "description": "Flips the phase of the signal.",
        "type": "switch",
        "options": ["In", "Out"]
      }
    ],
    "proTips": [
      "Use the 10 kHz high shelf to add an instantly recognizable open air and bite to electric guitars and rock snare drums.",
      "Select 60 Hz on the low-frequency selector and boost to add authoritative, punchy weight to kick drums and bass guitars without causing mud."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
