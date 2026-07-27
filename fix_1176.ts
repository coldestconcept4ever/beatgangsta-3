import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ua 1176 limiter collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ua 1176 limiter collection",
    "displayName": "UAD UA 1176 Limiter Collection",
    "category": "Dynamics",
    "description": "The absolute standard in fast-acting FET limiting. This collection features the Bluestripe, Blackface, and highly efficient SE models, capturing their legendary lightning-fast attack, distortion-inducing program-dependent release, and the historic All-Button ratio mode.",
    "hardwareModel": "Universal Audio 1176LN, 1176SE, & Bluestripe FET Limiters",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-infinity to 0 dB",
        "defaultVal": "-20 dB",
        "description": "Drives level into the gain-reduction circuit.",
        "type": "knob"
      },
      {
        "name": "Output Gain",
        "range": "-infinity to 0 dB",
        "defaultVal": "-20 dB",
        "description": "Sets output makeup gain.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "20 microseconds to 800 microseconds",
        "defaultVal": "400 microseconds",
        "description": "Determines compression response rate.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "50 milliseconds to 1100 milliseconds",
        "defaultVal": "500 milliseconds",
        "description": "Determines compressor recovery rate.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "4:1 / 8:1 / 12:1 / 20:1 / All-Button",
        "defaultVal": "4:1",
        "description": "Sets the compression slope.",
        "type": "select",
        "options": [
          "4:1",
          "8:1",
          "12:1",
          "20:1",
          "All-Button"
        ]
      }
    ],
    "proTips": [
      "For parallel drum smashing, use the Bluestripe revision in 'All-Button' ratio, setting Attack to 3 and Release to 7 for explosive room decays.",
      "For pop vocals, use the Blackface Rev E. Set the Attack to 3 to let vocal consonants bite through before the FET clamping begins."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad 1176ln rev e": \[/, '"uad ua 1176 limiter collection": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

