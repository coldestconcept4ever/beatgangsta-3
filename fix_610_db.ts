import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regexA = /\{\s*"name":\s*"uad ua 610-a tube preamp and eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacementA = `  {
    "name": "uad ua 610-a tube preamp and eq",
    "displayName": "UAD UA 610-A Tube Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "The UA 610-A tube preamplifier and EQ module is a faithful emulation of Bill Putnam Sr.'s iconic console design that tracked classic artists like Frank Sinatra, Ray Charles, and Neil Young. It delivers lush, saturated tube warmth, rich low-end bloom, and smooth vintage shelving EQ.",
    "hardwareModel": "Universal Audio 610-A Modular Amplifier",
    "parameters": [
      {
        "name": "Gain Step",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Controls tube input stage saturation in coarse 5 dB steps.",
        "type": "knob"
      },
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Attenuates or boosts the level driving the tube stage.",
        "type": "knob"
      },
      {
        "name": "Impedance",
        "range": "500 ohms / 2.0k ohms",
        "defaultVal": "2.0k ohms",
        "description": "Selects input impedance; lower values create a darker and softer transient sound profile.",
        "type": "select",
        "options": [
          "500 ohms",
          "2.0k ohms"
        ]
      },
      {
        "name": "High Shelf Freq",
        "range": "4.5 kHz / 10 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects the High shelving frequency.",
        "type": "select",
        "options": [
          "4.5 kHz",
          "10 kHz"
        ]
      },
      {
        "name": "High Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Controls High EQ shelf amplification or attenuation.",
        "type": "knob"
      },
      {
        "name": "Low Shelf Freq",
        "range": "50 Hz / 100 Hz",
        "defaultVal": "100 Hz",
        "description": "Selects the Low shelving frequency.",
        "type": "select",
        "options": [
          "50 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Controls Low EQ shelf amplification or attenuation.",
        "type": "knob"
      },
      {
        "name": "Master Level",
        "range": "-20 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Sets the final makeup output level.",
        "type": "knob"
      },
      {
        "name": "Phase Invert",
        "range": "In / Out",
        "defaultVal": "Out",
        "description": "Inverts the phase of the signal.",
        "type": "switch",
        "options": ["Out", "In"]
      }
    ],
    "proTips": [
      "Insert the 610-A on your lead vocal channel in Unison mode. Toggle the Impedance to 500 ohms to slightly darken and damp harsh transients on modern condenser mics, giving them a retro, ribbon-like character.",
      "To achieve a fat, vintage bass tone, boost the Low Shelf Gain to +3 dB at 50 Hz, and push the input Gain knob to +5 dB to compress the signals naturally through the virtual vacuum tubes.",
      "Use the 4.5 kHz High Shelf to add vintage presence and bite to electric guitars, while simultaneously cutting the Low Shelf at 100 Hz to prevent interference with the bass guitar."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regexA, replacementA);
fs.writeFileSync(DB_PATH, content, 'utf-8');
