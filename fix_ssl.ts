import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ssl 4000 e channel strip collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ssl 4000 e channel strip collection",
    "displayName": "UAD SSL 4000 E Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The definitive 1980s mixing console strip. Aggressive dynamics gating, versatile VCA compressor, and highly interactive Black/Brown knob EQ bands.",
    "hardwareModel": "Solid State Logic 4000 E-Series Console",
    "parameters": [
      {
        "name": "Input Trim",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts master gain staging before processing.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "+10 dB to -20 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the compression start point.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1 to Infinity",
        "defaultVal": "1",
        "description": "Sets the compression slope.",
        "type": "knob"
      },
      {
        "name": "Compressor Attack",
        "range": "Auto / Fast",
        "defaultVal": "Auto",
        "description": "Toggles between auto attack and fast attack for the compressor.",
        "type": "select",
        "options": ["Auto", "Fast"]
      },
      {
        "name": "Compressor Release",
        "range": "0.1s to 4s",
        "defaultVal": "0.1s",
        "description": "Sets the compressor release time.",
        "type": "knob"
      },
      {
        "name": "Gate/Expander Threshold",
        "range": "-30 dB to +10 dB",
        "defaultVal": "-30 dB",
        "description": "Sets the threshold for the noise gate / expander.",
        "type": "knob"
      },
      {
        "name": "Gate Range",
        "range": "0 to 40 dB",
        "defaultVal": "0",
        "description": "Determines the depth of gain reduction when the gate is closed.",
        "type": "knob"
      },
      {
        "name": "Gate Release",
        "range": "0.1s to 4s",
        "defaultVal": "0.1s",
        "description": "Sets the gate release time.",
        "type": "knob"
      },
      {
        "name": "EQ Black/Brown Switch",
        "range": "Black / Brown",
        "defaultVal": "Black",
        "description": "Switches EQ filter response from 'Black' (steeper, cleaner) to 'Brown' (wider, warmer).",
        "type": "select",
        "options": [
          "Black",
          "Brown"
        ]
      },
      {
        "name": "High EQ Freq",
        "range": "1.5 kHz to 16 kHz",
        "defaultVal": "8 kHz",
        "description": "Sets the frequency for the High EQ band.",
        "type": "knob"
      },
      {
        "name": "High EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for the High EQ band.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Freq",
        "range": "0.6 kHz to 7 kHz",
        "defaultVal": "1.5 kHz",
        "description": "Sets the frequency for the High-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for the High-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Q-Factor",
        "range": "0.5 to 3",
        "defaultVal": "1",
        "description": "Adjusts the bandwidth (Q) of the High-Mid EQ.",
        "type": "knob"
      },
      {
        "name": "L-Mid EQ Freq",
        "range": "0.2 kHz to 2.5 kHz",
        "defaultVal": "0.6 kHz",
        "description": "Sets the frequency for the Low-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "L-Mid EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for the Low-Mid EQ band.",
        "type": "knob"
      },
      {
        "name": "Low EQ Freq",
        "range": "30 Hz to 450 Hz",
        "defaultVal": "100 Hz",
        "description": "Sets the frequency for the Low EQ band.",
        "type": "knob"
      },
      {
        "name": "Low EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Gain control for the Low EQ band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Switch the Black/Brown EQ button. Black EQ is cleaner with steeper filters, whereas Brown EQ is broader, gentler, and has a wider, more musical shelf.",
      "The Gate has an extremely fast attack threshold. Set the Gate Range to 40 dB and threshold around -12 dB to cleanly isolate fast, transient drum sounds like snare drums."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad ssl 4000 e": \[/, '"uad ssl 4000 e channel strip collection": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

