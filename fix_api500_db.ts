import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad api 500 eq collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad api 550a",
    "displayName": "UAD API 550A Parametric EQ",
    "category": "Equalizers",
    "description": "The API 550A is a classic 3-band parametric EQ featuring API's legendary proportional-Q design, where the filter bandwidth narrows at higher gains for focused, high-headroom acoustic shaping.",
    "hardwareModel": "API 550A 3-Band Equalizer",
    "parameters": [
      {
        "name": "Bandpass Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Engages a 50Hz to 15kHz bandpass filter.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "HF Frequency",
        "range": "2.5 / 5 / 7 / 10 / 12.5 / 15 / 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets high band center frequency.",
        "type": "select",
        "options": ["2.5 kHz", "5 kHz", "7 kHz", "10 kHz", "12.5 kHz", "15 kHz", "20 kHz"]
      },
      {
        "name": "HF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets high band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "HF Mode",
        "range": "Peak / Shelf",
        "defaultVal": "Peak",
        "description": "Sets high band filter mode.",
        "type": "switch",
        "options": ["Peak", "Shelf"]
      },
      {
        "name": "MF Frequency",
        "range": "200 Hz to 5 kHz",
        "defaultVal": "1.5 kHz",
        "description": "Sets mid band center frequency.",
        "type": "select",
        "options": ["200 Hz", "400 Hz", "600 Hz", "800 Hz", "1.5 kHz", "3 kHz", "5 kHz"]
      },
      {
        "name": "MF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets mid band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "LF Frequency",
        "range": "30 / 40 / 50 / 100 / 200 / 300 / 400 Hz",
        "defaultVal": "100 Hz",
        "description": "Sets low band center frequency.",
        "type": "select",
        "options": ["30 Hz", "40 Hz", "50 Hz", "100 Hz", "200 Hz", "300 Hz", "400 Hz"]
      },
      {
        "name": "LF Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets low band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "LF Mode",
        "range": "Peak / Shelf",
        "defaultVal": "Peak",
        "description": "Sets low band filter mode.",
        "type": "switch",
        "options": ["Peak", "Shelf"]
      }
    ],
    "proTips": [
      "Utilize the proportional-Q design on snare drums with the 550A; dial +4 dB at 5 kHz to add attack without introducing broad harshness."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad api 560",
    "displayName": "UAD API 560 Graphic EQ",
    "category": "Equalizers",
    "description": "The API 560 is a classic 10-band graphic EQ featuring API's legendary proportional-Q design for highly surgical, visual frequency shaping.",
    "hardwareModel": "API 560 10-Band Equalizer",
    "parameters": [
      {
        "name": "31 Hz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 31 Hz band.",
        "type": "knob"
      },
      {
        "name": "63 Hz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 63 Hz band.",
        "type": "knob"
      },
      {
        "name": "125 Hz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 125 Hz band.",
        "type": "knob"
      },
      {
        "name": "250 Hz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 250 Hz band.",
        "type": "knob"
      },
      {
        "name": "500 Hz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 500 Hz band.",
        "type": "knob"
      },
      {
        "name": "1 kHz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 1 kHz band.",
        "type": "knob"
      },
      {
        "name": "2 kHz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 2 kHz band.",
        "type": "knob"
      },
      {
        "name": "4 kHz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 4 kHz band.",
        "type": "knob"
      },
      {
        "name": "8 kHz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 8 kHz band.",
        "type": "knob"
      },
      {
        "name": "16 kHz",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Gain for 16 kHz band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the 560 10-band graphic EQ on electric guitars; scoop 2 dB at 500 Hz to let vocals breathe, then boost +3 dB at 1.5 kHz for maximum focus."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

