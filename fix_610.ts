import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

// I need to split the "uad ua 610 tube preamp and eq collection" preset array into two arrays.
const collectionKey = '"uad ua 610 tube preamp and eq collection": [';
const blockRegex = /"uad ua 610 tube preamp and eq collection": \[\s*\{\s*"name": "610-A Vocal Warmth",[\s\S]*?"Master Level": 75\s*\}\s*,\s*\{\s*"name": "610-B Driven Bass Tube",[\s\S]*?"Master Level": 60\s*\}\s*\]/;

const replacement = `"uad ua 610-a tube preamp and eq": [
    {
      "name": "610-A Vocal Warmth",
      "description": "A rich, classic tube vocal preamp preset using the 610-A model. Adds immediate tube harmonic depth, gentle low-end bloom, and open high shelf presence.",
      "settings": {
        "Input Level": 65,
        "Gain Step": 64,
        "Impedance": 127,
        "High Shelf Freq": 127,
        "High Shelf Gain": 80,
        "Low Shelf Freq": 0,
        "Low Shelf Gain": 72,
        "Master Level": 75
      }
    }
  ],
  "uad ua 610-b tube preamp and eq": [
    {
      "name": "610-B Driven Bass Tube",
      "description": "Pushes the modern 610-B preamp stage hard to saturate the virtual vacuum tubes, combined with a 70Hz low shelf boost to beef up electric bass guitars.",
      "settings": {
        "Input Level": 85,
        "Gain Step": 32,
        "Impedance": 0,
        "High Shelf Freq": 0,
        "High Shelf Gain": 64,
        "Low Shelf Freq": 0,
        "Low Shelf Gain": 96,
        "Master Level": 60
      }
    }
  ]`;

pContent = pContent.replace(blockRegex, replacement);
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

