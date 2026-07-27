import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const replacement = `  {
    "name": "uad ams rmx16 expanded digital reverb",
    "displayName": "UAD AMS RMX16 Expanded Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "An exacting emulation of the legendary AMS RMX16 digital reverb, featuring the original 9 programs plus 9 rare custom programs, famous for its era-defining 'NonLin 2' gated snare reverb.",
    "hardwareModel": "AMS RMX16 Digital Reverb",
    "parameters": [
      {
        "name": "Input",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the input level to the reverb processor.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls the wet/dry balance of the effect.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the overall output level.",
        "type": "knob"
      },
      {
        "name": "Program",
        "range": "Ambience / Room / Hall / Plate / Echo / Chorus / NonLin 2 / Reverse 1 / Reverse 2 / Delay / Freeze / Image / NonLin 1 / Plate 2 / Hall 2 / Room 2 / Chorus 2 / Hall C",
        "defaultVal": "NonLin 2",
        "description": "Selects the digital reverb algorithm.",
        "type": "select",
        "options": [
          "Ambience",
          "Room",
          "Hall",
          "Plate",
          "Echo",
          "Chorus",
          "NonLin 2",
          "Reverse 1",
          "Reverse 2",
          "Delay",
          "Freeze",
          "Image",
          "NonLin 1",
          "Plate 2",
          "Hall 2",
          "Room 2",
          "Chorus 2",
          "Hall C"
        ]
      },
      {
        "name": "Decay Time",
        "range": "0.0 to 9.9 s",
        "defaultVal": "2.4 s",
        "description": "Sets the length of the reverb tail or effect duration.",
        "type": "knob"
      },
      {
        "name": "Pre Delay",
        "range": "0 to 990 ms",
        "defaultVal": "10 ms",
        "description": "Sets the time before the onset of reverberation.",
        "type": "knob"
      },
      {
        "name": "Low",
        "range": "-9 to +9",
        "defaultVal": "0",
        "description": "Adjusts the low-frequency decay characteristics.",
        "type": "knob"
      },
      {
        "name": "High",
        "range": "-9 to +9",
        "defaultVal": "0",
        "description": "Adjusts the high-frequency decay characteristics.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 'NonLin 2', dial in a short Decay Time, and apply it to a snare drum for the classic 1980s Phil Collins explosive gated snare effect.",
      "The 'Ambience' program is fantastic for adding invisible space and size to vocals without washing them out in a long reverb tail.",
      "The Expanded version's 'Chorus 2' and 'Delay' programs offer great pitch-thickening and rhythmic options beyond standard reverb."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

const regex = /\{\s*"name":\s*"uad ams rmx16 expanded digital reverb"[\s\S]*?"Authorized for all devices"\s*\}/;
content = content.replace(regex, replacement);

fs.writeFileSync(DB_PATH, content, 'utf-8');
