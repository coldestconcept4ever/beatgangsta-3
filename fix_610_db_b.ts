import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regexB = /\{\s*"name":\s*"uad ua 610-b tube preamp and eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacementB = `  {
    "name": "uad ua 610-b tube preamp and eq",
    "displayName": "UAD UA 610-B Tube Preamp and EQ",
    "category": "Preamps & Microphones",
    "description": "The UA 610-B Tube Preamp & EQ is a modern recreation of Putnam's legendary 610 tube console channel. It offers rich vacuum tube flavor, sweet high/low shelving filters, and variable impedance controls, making it an essential tool for injecting analog warmth and harmonically rich overdrive into any source.",
    "hardwareModel": "Universal Audio 610-B Tube Preamp & EQ",
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
        "range": "500 ohms / 2.0k ohms / Hi-Z",
        "defaultVal": "2.0k ohms",
        "description": "Adjusts mic/instrument input impedance parameters.",
        "type": "select",
        "options": [
          "500 ohms",
          "2.0k ohms",
          "Hi-Z"
        ]
      },
      {
        "name": "High Shelf Freq",
        "range": "4.5 kHz / 7 kHz / 10 kHz",
        "defaultVal": "10 kHz",
        "description": "Switches high EQ shelving frequency focus.",
        "type": "select",
        "options": [
          "4.5 kHz",
          "7 kHz",
          "10 kHz"
        ]
      },
      {
        "name": "High Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts high shelving band amplification.",
        "type": "knob"
      },
      {
        "name": "Low Shelf Freq",
        "range": "70 Hz / 100 Hz / 200 Hz",
        "defaultVal": "100 Hz",
        "description": "Switches low EQ shelving frequency focus.",
        "type": "select",
        "options": [
          "70 Hz",
          "100 Hz",
          "200 Hz"
        ]
      },
      {
        "name": "Low Shelf Gain",
        "range": "-9 to +9 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts low shelving band amplification.",
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
      "When tracking active bass guitar, use the Hi-Z input setting in Unison mode, set Low Shelf to 70 Hz, and boost +1.5 dB. It adds a thick, tube-compressed bottom-end weight that instantly glues the bass to the drums.",
      "For clean but warm vocals, set the Gain to -5 dB to keep the preamp in its linear zone, and push the Level to 8. This utilizes the clean output headroom while retaining just enough classic vacuum tube color.",
      "To dirty up a snare drum or keyboard loop, reverse the approach: crank the Gain knob to +10 dB, set the Level down to 3, and enjoy a rich, fuzzy tube saturation that cuts through any mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regexB, replacementB);
fs.writeFileSync(DB_PATH, content, 'utf-8');

