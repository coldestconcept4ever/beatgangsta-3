import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad teletronix la-2a leveler collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad teletronix la-2a leveler collection",
    "displayName": "UAD Teletronix LA-2A Leveler Collection",
    "category": "Dynamics",
    "description": "The legendary optical tube compressors in a premium triple-revision bundle. It features the aggressive Silver model, the smooth and standard Gray model, and the slow, warm original 1950s LA-2, all meticulously modeled down to the T4 optical cell and tube feedback paths.",
    "hardwareModel": "Teletronix LA-2A Silver, LA-2A Gray, & LA-2 Tube Levelers",
    "parameters": [
      {
        "name": "Peak Reduction",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets compressor threshold level.",
        "type": "knob"
      },
      {
        "name": "Gain",
        "range": "0 to 100",
        "defaultVal": "40",
        "description": "Adjusts output level makeup volume.",
        "type": "knob"
      },
      {
        "name": "Limit/Compress Switch",
        "range": "Compress / Limit",
        "defaultVal": "Compress",
        "description": "Toggles optical compression ratio.",
        "type": "switch",
        "options": [
          "Compress",
          "Limit"
        ]
      },
      {
        "name": "Meter Select",
        "range": "Gain Reduction / Output",
        "defaultVal": "Gain Reduction",
        "description": "Selects what the VU meter displays.",
        "type": "select",
        "options": [
          "Gain Reduction",
          "Output"
        ]
      }
    ],
    "proTips": [
      "Select the 'Silver' model on pop vocals for fast-acting control that clamps transient peaks elegantly without sucking the air out of the performance.",
      "Utilize the 'LA-2' original tube model for acoustic backing tracks; its slow, pillowy release time provides smooth sustain that easily glues background elements."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uadx la-2a silver": \[/, '"uad teletronix la-2a leveler collection": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
