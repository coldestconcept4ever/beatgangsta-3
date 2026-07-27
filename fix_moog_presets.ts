import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /"uad moog multimode filter": \[\s*\{\s*"name": "Lush Sweeping Resonator"[\s\S]*?"LFO Amount": 0\s*\}\s*\}\s*\],/;

const replacement = `"uad moog multimode filter collection": [
    {
      "name": "Lush Sweeping Resonator",
      "description": "Warm transistor ladder sweeping 4-pole filter driven with substantial envelope modulation reacting to audio dynamics.",
      "settings": {
        "Drive": 40,
        "Env Amount": 85,
        "Smooth / Fast": 0,
        "Filter Cutoff": 50,
        "Resonance": 65,
        "Spacing": 0,
        "Poles": 3,
        "LFO Amount": 35,
        "LFO Rate": 30,
        "LFO Wave": 1,
        "Mix": 100,
        "Output": 0
      }
    },
    {
      "name": "Gritty Sub Drive Filter",
      "description": "Aggressive low end warmth filter designed for synth or bass guitars, utilizing a heavy input overdrive.",
      "settings": {
        "Drive": 75,
        "Env Amount": 0,
        "Smooth / Fast": 1,
        "Filter Cutoff": 20,
        "Resonance": 35,
        "Spacing": 0,
        "Poles": 3,
        "LFO Amount": 0,
        "LFO Rate": 0,
        "LFO Wave": 0,
        "Mix": 100,
        "Output": 0
      }
    }
  ],`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
