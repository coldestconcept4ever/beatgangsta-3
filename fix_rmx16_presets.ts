import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /"uad ams rmx16 digital reverb": \[\s*\{\s*"name": "Phil Collins 80s Gated Snare"[\s\S]*?"Mix A\/B": 95\s*\}\s*\}\s*\]/;

const replacement = `"uad ams rmx16 expanded digital reverb": [
    {
      "name": "Phil Collins 80s Gated Snare",
      "description": "Generates the legendary, explosive gated snare sound using the dense 'NonLin 2' algorithm with tight decay timing.",
      "settings": {
        "Input": 6.5,
        "Mix": 100,
        "Output": 5,
        "Program": 6,
        "Decay Time": 1.5,
        "Pre Delay": 15,
        "Low": 4,
        "High": 2
      }
    },
    {
      "name": "Lush 80s Vocal Ambience",
      "description": "A spacious, natural Ambience program setting to add deep room size to vocals without cluttering the mix.",
      "settings": {
        "Input": 5,
        "Mix": 25,
        "Output": 5,
        "Program": 0,
        "Decay Time": 3.2,
        "Pre Delay": 40,
        "Low": 0,
        "High": -2
      }
    }
  ]`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
