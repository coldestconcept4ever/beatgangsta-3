import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad emt 250 digital reverb"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad emt 250 digital reverb",
    "displayName": "UAD EMT 250 Digital Reverb",
    "category": "Reverbs & Delays",
    "description": "A faithful emulation of the world's first commercial digital reverb unit. Resembling an iconic physical control console, this plugin recreates the bright, shimmering spaces, lush modulation chorus, and highly musical decay characteristics of the 1976 physical hardware.",
    "hardwareModel": "EMT 250 Electronic Reverberator",
    "parameters": [
      {
        "name": "Mode Selector",
        "range": "Reverb / Chorus / Phase / Delay",
        "defaultVal": "Reverb",
        "description": "Selects the digital algorithm.",
        "type": "select",
        "options": [
          "Reverb",
          "Chorus",
          "Phase",
          "Delay"
        ]
      },
      {
        "name": "Decay (Lever 1)",
        "range": "0.4s to 4.5s",
        "defaultVal": "2.0s",
        "description": "Adjusts the overall decay duration of the generated reverb tail.",
        "type": "slider"
      },
      {
        "name": "Low Decay (Lever 2)",
        "range": "0.5 to 2.0 multiplier",
        "defaultVal": "1.0",
        "description": "Filters and dampens low frequency decay, adjusting bass response inside the reverb.",
        "type": "slider"
      },
      {
        "name": "High Decay (Lever 3)",
        "range": "0.5 to 2.0 multiplier",
        "defaultVal": "1.0",
        "description": "Dampens high-frequency decay, simulating carpeted damp spaces or open bright rooms.",
        "type": "slider"
      },
      {
        "name": "Pre-delay (Lever 4)",
        "range": "0ms / 20ms / 40ms / 60ms",
        "defaultVal": "0ms",
        "description": "Sets the discrete physical pre-delay interval before reverb reflections commence.",
        "type": "slider"
      },
      {
        "name": "Output Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends the processed wet signal with the dry input signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On lead vocal lines, set Reverb Time to 2.4s, choose 60ms of Pre-Delay, and boost High Decay to +2. This creates a brilliant, shimmering vocal space that stays completely clear of consonants.",
      "Switch the main program to Chorus mode, and feed a dry synth lead through the EMT 250. It generates a rich, deep, stereo modulation typical of classic 1980s pop tracks."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad emt 250": \[/, '"uad emt 250 digital reverb": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
