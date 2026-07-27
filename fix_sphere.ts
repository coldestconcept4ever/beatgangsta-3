import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

// I'll update the options of Mic Model in uadDatabase.ts to be more representative
const regex = /"range": "LD-47 \/ LD-251 \/ LD-67 \/ DN-57 \/ RB-121",[\s\S]*?"options": \[\s*"LD-47",\s*"LD-251",\s*"LD-67",\s*"DN-57",\s*"RB-121"\s*\]/;

const replacement = `"range": "LD-47K / LD-12 / LD-67 / LD-87 / LD-414 / LD-251 / SD-451 / RB-121 / DN-57 / DN-7",
        "defaultVal": "LD-47K",
        "description": "Selects the specific vintage microphone model emulation (34 included models).",
        "type": "select",
        "options": [
          "LD-47K",
          "LD-12",
          "LD-67",
          "LD-87",
          "LD-414",
          "LD-251",
          "SD-451",
          "RB-121",
          "DN-57",
          "DN-7"
        ]`;

content = content.replace(regex, replacement);

const paramRegex = /"name": "Axis",[\s\S]*?"type": "knob"\s*\}/;
const paramReplacement = `"name": "Axis",
        "range": "0 to 180 degrees",
        "defaultVal": "0 degrees",
        "description": "Simulates rotating the physical microphone off-axis from the source.",
        "type": "knob"
      },
      {
        "name": "IsoSphere",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Reduces room coloration and acoustic reflections.",
        "type": "switch",
        "options": ["Off", "On"]
      }`;

content = content.replace(paramRegex, paramReplacement);

fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

const presetReplacement = `"uad sphere mic collection": [
    {
      "name": "Vintage 47 Vocal",
      "description": "Iconic vintage large diaphragm condenser sound, perfectly on-axis with cardioid pattern for lead vocals.",
      "settings": {
        "Mic Model": 0,
        "Polar Pattern": 50,
        "Proximity": 0,
        "Dual Mode": 0,
        "Filter": 0,
        "Axis": 0,
        "IsoSphere": 0
      }
    },
    {
      "name": "Bright Acoustic Guitar",
      "description": "Small diaphragm condenser (SD-451) with a slight off-axis rotation to tame harsh transients.",
      "settings": {
        "Mic Model": 6,
        "Polar Pattern": 50,
        "Proximity": -10,
        "Dual Mode": 0,
        "Filter": 1,
        "Axis": 15,
        "IsoSphere": 0
      }
    }
  ],
  "uad hemisphere mic collection": [`;

pContent = pContent.replace(/"uad hemisphere mic collection": \[/, presetReplacement);
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

