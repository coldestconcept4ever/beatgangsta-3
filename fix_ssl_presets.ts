import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /"uad ssl 4000 g bus compressor": \[\s*\{\s*"name": "Classic Console Stereo Glue"[\s\S]*?"Mix \/ Blend": 127\s*\}\s*\}\s*\]/;

const replacement = `"uad ssl 4000 g bus compressor collection": [
    {
      "name": "Classic Console Stereo Glue",
      "description": "The legendary Solid State Logic stereo master glue setup. Ratio 4, Attack 30, Auto release, and 1-3dB reduction.",
      "settings": {
        "Threshold": 8.5,
        "Ratio": 1,
        "Attack": 5,
        "Release": 4,
        "Make-Up": 2.5,
        "SC Filter": 1,
        "Mix": 100,
        "Headroom": 16,
        "Rate": 10,
        "Fade": 0,
        "In": 1
      }
    }
  ]`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
