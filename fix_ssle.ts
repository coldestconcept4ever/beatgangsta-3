import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ssl 4000 e legacy channel strip"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ssl 4000 e legacy channel strip",
    "displayName": "UAD SSL 4000 E Legacy Channel Strip",
    "category": "Channel Strips",
    "description": "An authentic emulation of the classic Solid State Logic 4000 E console strip. It integrates legendary Black and Brown knob equalizer curves, dynamic VCA compression, and ultra-fast gate/expander circuits for aggressive, forward-sounding tracks.",
    "hardwareModel": "Solid State Logic 4000 E Console Channel Strip",
    "parameters": [
      {
        "name": "Input Trim",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the input level.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "+10 dB to -20 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the threshold for the compressor.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to infinity",
        "defaultVal": "4:1",
        "description": "Sets the slope of the integrated VCA compressor.",
        "type": "knob"
      },
      {
        "name": "Compressor Attack",
        "range": "Fast / Slow",
        "defaultVal": "Slow",
        "description": "Sets compressor attack time.",
        "type": "switch",
        "options": ["Slow", "Fast"]
      },
      {
        "name": "Compressor Release",
        "range": "0.1s to 4s",
        "defaultVal": "0.1s",
        "description": "Sets compressor release time.",
        "type": "knob"
      },
      {
        "name": "Gate/Expander Threshold",
        "range": "-30 dB to +10 dB",
        "defaultVal": "-30 dB",
        "description": "Adjusts the threshold for the expander or noise gate section.",
        "type": "knob"
      },
      {
        "name": "Gate Range",
        "range": "0 to 40 dB",
        "defaultVal": "40 dB",
        "description": "Adjusts the depth of the gate attenuation.",
        "type": "knob"
      },
      {
        "name": "Gate Release",
        "range": "0.1s to 4s",
        "defaultVal": "0.1s",
        "description": "Sets gate release time.",
        "type": "knob"
      },
      {
        "name": "EQ Black/Brown Switch",
        "range": "Black / Brown",
        "defaultVal": "Black",
        "description": "Selects between the clean, resonant Black-Knob and musical, smoother Brown-Knob EQ models.",
        "type": "switch",
        "options": [
          "Black",
          "Brown"
        ]
      },
      {
        "name": "High EQ Freq",
        "range": "1.5 kHz to 16 kHz",
        "defaultVal": "8 kHz",
        "description": "Sets high band frequency.",
        "type": "knob"
      },
      {
        "name": "High EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets high band gain.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Freq",
        "range": "0.6 kHz to 7 kHz",
        "defaultVal": "2 kHz",
        "description": "Sets high-mid band frequency.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets high-mid band gain.",
        "type": "knob"
      },
      {
        "name": "H-Mid EQ Q-Factor",
        "range": "0.5 to 3",
        "defaultVal": "1",
        "description": "Sets high-mid band Q.",
        "type": "knob"
      },
      {
        "name": "L-Mid EQ Freq",
        "range": "0.2 kHz to 2.5 kHz",
        "defaultVal": "0.6 kHz",
        "description": "Sets low-mid band frequency.",
        "type": "knob"
      },
      {
        "name": "L-Mid EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets low-mid band gain.",
        "type": "knob"
      },
      {
        "name": "Low EQ Freq",
        "range": "30 Hz to 450 Hz",
        "defaultVal": "100 Hz",
        "description": "Sets low band frequency.",
        "type": "knob"
      },
      {
        "name": "Low EQ Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets low band gain.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Engage 'Black' EQ mode, and boost 8 kHz by 2.5 dB on rock overheads for the signature glassy, expensive cymbal brightness.",
      "To tighten a dynamic snare track, set the Compressor Ratio to 4:1, pull down the threshold for 5 dB of gain reduction, and use the gate section with a fast release to eliminate high-hat bleed."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad ssl 4000 e channel strip collection": \[/, '"uad ssl 4000 e legacy channel strip": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

