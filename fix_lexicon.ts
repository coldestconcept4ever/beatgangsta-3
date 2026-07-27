import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad lexicon 224 digital reverb"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad lexicon 224 digital reverb",
    "displayName": "UAD Lexicon 224 Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "A definitive recreation of the historic 1978 hardware unit that shaped the reverb architecture of modern pop music. It captures the complex dual-decay matrix, gritty input/output converters, and lush chorus/plate algorithms of the physical unit.",
    "hardwareModel": "Lexicon 224 Digital Reverberator",
    "parameters": [
      {
        "name": "Program Select",
        "range": "1 to 9",
        "defaultVal": "1 Concert",
        "description": "Selects the digital algorithm, from halls and plates to chorus and echo effects.",
        "type": "select",
        "options": [
          "1 Concert",
          "2 Hall",
          "3 Room",
          "4 Plate",
          "5 Room",
          "6 Small Plate",
          "7 Chorus",
          "8 Echo",
          "9 Inverse"
        ]
      },
      {
        "name": "Reverb Time",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Master reverb decay time multiplier.",
        "type": "slider"
      },
      {
        "name": "Bass Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the low-frequency decay time, running independently of the mid frequencies.",
        "type": "slider"
      },
      {
        "name": "Crossover Frequency",
        "range": "100 Hz to 10.9 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Determines the split frequency where Bass Decay meets Treble Decay control.",
        "type": "slider"
      },
      {
        "name": "Treble Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the high-frequency decay time.",
        "type": "slider"
      },
      {
        "name": "Pre-delay",
        "range": "0ms to 256ms",
        "defaultVal": "24ms",
        "description": "Adjusts the delay time before the onset of early reflections and decay tail.",
        "type": "slider"
      },
      {
        "name": "Depth",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Adjusts the apparent distance between the listener and the sound source.",
        "type": "slider"
      },
      {
        "name": "System Noise",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Engages physical hardware modeling artifacts and system noise.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends the processed wet signal with the dry input signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a rich, blooming vocal halo, choose Program 4 (Constant Plate), set Treble Decay to 3.2s, Bass Decay to 1.2s, and push Pre-delay to 80ms to keep consonants clear.",
      "To quickly dial in a vintage 80s gated drum room, use Program 9 (Inverse Reverb) on a parallel snare send, and pull Treble Decay down to 1.5s for instant, explosive decay cutoff."
    ],
    "authorizationStatus": "Authorized for all devices"
  },
  {
    "name": "uad lexicon 224 legacy",
    "displayName": "UAD Lexicon 224 Digital Reverb (Legacy)",
    "category": "Reverbs & Delays",
    "description": "A legacy emulation of the historic 1978 Lexicon 224 reverberator.",
    "hardwareModel": "Lexicon 224 Digital Reverberator",
    "parameters": [
      {
        "name": "Program Code",
        "range": "1 to 9",
        "defaultVal": "1 Concert",
        "description": "Selects the digital algorithm.",
        "type": "select",
        "options": [
          "1 Concert",
          "2 Hall",
          "3 Room",
          "4 Plate",
          "5 Room",
          "6 Small Plate",
          "7 Chorus",
          "8 Echo",
          "9 Inverse"
        ]
      },
      {
        "name": "Bass Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the low-frequency decay time.",
        "type": "slider"
      },
      {
        "name": "Mid Decay",
        "range": "0.6s to 70s",
        "defaultVal": "2.0s",
        "description": "Sets the mid-frequency decay time.",
        "type": "slider"
      }
    ],
    "proTips": [
      "For a rich, blooming vocal halo, choose Program 4 (Constant Plate), set Mid Decay to 3.2s, Bass Decay to 1.2s."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

