import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ams rmx16 digital reverb"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ams rmx16 legacy",
    "displayName": "UAD AMS RMX16 Digital Reverb (Legacy)",
    "category": "Reverbs & Delays",
    "description": "The definitive 1980s microprocessor-controlled digital reverb. Used on countless legendary recordings from Phil Collins to Kate Bush, it is famous for its unique 12-bit converters and lush, characteristic 'Non-Lin 2' and 'Ambience' algorithms.",
    "hardwareModel": "AMS RMX16 Digital Reverberation System",
    "parameters": [
      {
        "name": "Program Select",
        "range": "Ambience / Room / Hall / Plate / Non-Lin / Reverse / Chorus",
        "defaultVal": "Plate",
        "description": "Selects the digital reverb algorithm.",
        "type": "select",
        "options": [
          "Ambience",
          "Room",
          "Hall",
          "Plate",
          "Non-Lin 2",
          "Reverse 1",
          "Chorus"
        ]
      },
      {
        "name": "Decay Time",
        "range": "0.1s to 9.9s",
        "defaultVal": "2.4s",
        "description": "Adjusts the decay time in seconds.",
        "type": "knob"
      },
      {
        "name": "Pre-Delay",
        "range": "0 ms to 300 ms",
        "defaultVal": "10 ms",
        "description": "Sets pre-delay time before reverb onset.",
        "type": "knob"
      },
      {
        "name": "High Filter",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Controls high-frequency dampening of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Low Filter",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Controls low-frequency roll-off of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Controls processed dry/wet balance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Select 'Non-Lin 2' on a snare drum auxiliary send. Set Decay Time to 0.8s, and Pre-Delay to 20ms. This provides that classic, massive 80s gated snare explosion without needing an actual noise gate.",
      "To add stereo width to dry electric guitars, select the 'Ambience' program, drop Decay Time to 0.4s, and set the Wet/Dry Mix to 25%. It places the dry guitars in an expensive-sounding 3D space while keeping their transient bite."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
