import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad brigade chorus"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad brigade chorus",
    "displayName": "UAD Brigade Chorus",
    "category": "Reverbs & Delays",
    "description": "Captures the legendary bucket-brigade dual-mode chorus and vibrato of the legendary 1976 Boss CE-1 Chorus Ensemble. Known for its lush analog warmth, organic depth, and distinct preamp saturation, it instantly adds classic 1970s and 80s movement to guitars, electric pianos, and vocals.",
    "hardwareModel": "Boss CE-1 Chorus Ensemble",
    "parameters": [
      {
        "name": "Effect Mode",
        "range": "Chorus / Vibrato",
        "defaultVal": "Chorus",
        "description": "Switches the internal circuit architecture between wide, shimmering chorus or pitch-modulating vibrato.",
        "type": "select",
        "options": [
          "Chorus",
          "Vibrato"
        ]
      },
      {
        "name": "Chorus Intensity",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls chorus wet depth and modulation intensity.",
        "type": "knob"
      },
      {
        "name": "Vibrato Rate",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the Speed of the pitch modulation sweep in Vibrato mode.",
        "type": "knob"
      },
      {
        "name": "Vibrato Depth",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Controls the depth/pitch-excursion level in Vibrato mode.",
        "type": "knob"
      },
      {
        "name": "Input Level",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the integrated high-impedance solid-state hardware preamp stage.",
        "type": "knob"
      },
      {
        "name": "Direct / Effect",
        "range": "Direct / Effect",
        "defaultVal": "Effect",
        "description": "Toggles between bypassing the effect (Direct) and enabling it (Effect).",
        "type": "select",
        "options": ["Direct", "Effect"]
      }
    ],
    "proTips": [
      "Drive the Input Level knob until the clip LED flashes slightly on drum overheads or Rhodes keys to get that famous, highly musical CE-1 solid-state preamp saturation.",
      "Switch to Vibrato mode with Rate at 4 and Depth at 5 on an electric guitar track to recreate the iconic, watery warble heard on classic post-punk and new wave recordings."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

const presetReplacement = `"uad brigade chorus": [
    {
      "name": "Lush Warm Chorus",
      "description": "The classic, lush analog CE-1 chorus effect for electric guitar and keyboards.",
      "settings": {
        "Effect Mode": 0,
        "Chorus Intensity": 70,
        "Input Level": 64,
        "Direct / Effect": 1
      }
    },
    {
      "name": "Watery Vibrato",
      "description": "Vintage pitch modulation with a medium-fast rate and deep intensity.",
      "settings": {
        "Effect Mode": 1,
        "Vibrato Rate": 40,
        "Vibrato Depth": 50,
        "Input Level": 64,
        "Direct / Effect": 1
      }
    }
  ],
  "uad hemisphere mic collection": [`;

pContent = pContent.replace(/"uad hemisphere mic collection": \[/, presetReplacement);
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

