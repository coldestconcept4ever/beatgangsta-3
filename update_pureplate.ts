import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad pure plate reverb"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad pure plate reverb",
    "displayName": "UAD Pure Plate Reverb",
    "category": "Reverbs & Delays",
    "description": "The essence of physical plate reverberation. Simple, CPU-efficient, and beautifully modeled, delivering the signature shimmering organic wash of classic steel plates.",
    "hardwareModel": "UA Pure Plate Reverb",
    "parameters": [
      {
        "name": "Reverb Time",
        "range": "0.5 s to 5.5 s",
        "defaultVal": "2.0 s",
        "description": "Sets overall plate reverberation decay length.",
        "type": "knob"
      },
      {
        "name": "Pre-delay",
        "range": "0 ms to 120 ms",
        "defaultVal": "15 ms",
        "description": "Sets timing delay before early reflections and plate decay trigger.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-12 dB to +6 dB (Shelf)",
        "defaultVal": "0 dB",
        "description": "Controls low-end shelving gain on the reverberated output.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-12 dB to +6 dB (Shelf)",
        "defaultVal": "0 dB",
        "description": "Controls high-end shelving gain to shape the brightness of the reverb tail.",
        "type": "knob"
      },
      {
        "name": "Wet/Dry Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Adjusts dry to wet signal ratio. Set to 100% for aux send returns.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a clean, articulate vocal space, set Pre-delay around 20-30 ms so that sibilant consonants aren't buried in the shimmering plate reverb.",
      "Use the Treble EQ dial to add a +2dB or +4dB boost, giving the reverb decay tail a gorgeous, silky airiness.",
      "For deep acoustic guitars, roll the Bass EQ down to -3dB to avoid low-mid mud accumulating in the stereo soundstage."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
