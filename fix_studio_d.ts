import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad studio d chorus"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad studio d chorus",
    "displayName": "UAD Studio D Chorus",
    "category": "Reverbs & Delays",
    "description": "Meticulously models the legendary Roland SDD-320 Dimension D chorus unit. Renowned for its unique spatial widening without obvious modulation artifacts, it delivers subtle, beautiful analog stereo width and lush dimension utilizing bucket-brigade circuits and interactive push-buttons.",
    "hardwareModel": "Roland SDD-320 Dimension D Chorus",
    "parameters": [
      {
        "name": "Dimension Mode",
        "range": "Off / 1 / 2 / 3 / 4 / All",
        "defaultVal": "4",
        "description": "Selects active BBD delay line combinations for stereo spatial depth.",
        "type": "select",
        "options": [
          "Off",
          "1",
          "2",
          "3",
          "4",
          "All"
        ]
      },
      {
        "name": "Mono / Stereo",
        "range": "Mono / Stereo",
        "defaultVal": "Stereo",
        "description": "Enables raw mono or widened spatial stereo signal processing path.",
        "type": "switch",
        "options": ["Mono", "Stereo"]
      }
    ],
    "proTips": [
      "To add instant width and vocal glide without the 'warble' of a typical chorus, engage Mode 4. It provides the deepest spatial depth and makes lead vocals sit perfectly wide in a busy pop mix.",
      "Engage 'All' buttons as the original hardware did to yield custom complex BBD delay-line combinations that work wonderfully on synthesizer pads."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

const presetReplacement = `"uad studio d chorus": [
    {
      "name": "Wide Vocal Dimension",
      "description": "Classic setting on Button 4 for the maximum spatial widening of lead vocals.",
      "settings": {
        "Dimension Mode": 4,
        "Mono / Stereo": 1
      }
    },
    {
      "name": "All Buttons In Synth",
      "description": "Aggressive, ultra-wide dimensional shift achieved by depressing all mode buttons.",
      "settings": {
        "Dimension Mode": 5,
        "Mono / Stereo": 1
      }
    }
  ],
  "uad hemisphere mic collection": [`;

pContent = pContent.replace(/"uad hemisphere mic collection": \[/, presetReplacement);
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

