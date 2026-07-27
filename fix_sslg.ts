import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ssl 4000 g legacy bus compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ssl 4000 g legacy bus compressor",
    "displayName": "UAD SSL 4000 G Legacy Bus Compressor",
    "category": "Dynamics",
    "description": "A meticulous emulation of the legendary Solid State Logic G-Series analog center-section bus compressor. Revered as the ultimate audio 'glue' box, it provides legendary cohesive punch and dynamic energy to entire mixes.",
    "hardwareModel": "Solid State Logic G-Series Stereo Bus Compressor",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Sets the level at which the VCA compression circuit begins to attenuate.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 / 4:1 / 10:1",
        "defaultVal": "4:1",
        "description": "Sets the compression curve slope.",
        "type": "switch",
        "options": [
          "2:1",
          "4:1",
          "10:1"
        ]
      },
      {
        "name": "Attack",
        "range": "0.1ms / 0.3ms / 1ms / 3ms / 10ms / 30ms",
        "defaultVal": "30ms",
        "description": "Determines how fast the compressor responds to transient peaks.",
        "type": "switch",
        "options": [
          "0.1ms",
          "0.3ms",
          "1ms",
          "3ms",
          "10ms",
          "30ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.1s / 0.3s / 0.6s / 1.2s / Auto",
        "defaultVal": "Auto",
        "description": "Controls release time, including the classic program-dependent Auto setting.",
        "type": "switch",
        "options": [
          "0.1s",
          "0.3s",
          "0.6s",
          "1.2s",
          "Auto"
        ]
      },
      {
        "name": "Make-Up",
        "range": "-5 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Applies volume compensation after master bus gain reduction.",
        "type": "knob"
      },
      {
        "name": "SC Filter",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Sidechain filter.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Wet/dry blend.",
        "type": "knob"
      },
      {
        "name": "Headroom",
        "range": "4 to 28 dB",
        "defaultVal": "16",
        "description": "Operating headroom.",
        "type": "knob"
      },
      {
        "name": "Rate",
        "range": "1 to 60 s",
        "defaultVal": "10",
        "description": "Auto fade rate.",
        "type": "knob"
      },
      {
        "name": "Fade",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Auto fade switch.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "In",
        "range": "Off / On",
        "defaultVal": "On",
        "description": "Bypass switch.",
        "type": "switch",
        "options": ["Off", "On"]
      }
    ],
    "proTips": [
      "To glue a stereo mix bus, use a 2:1 ratio, a slow 30ms attack to protect your punchy transients, and set the release to Auto. Aim for 2-3 dB of peak gain reduction.",
      "To squash parallel drum room mics for aggressive energy, set the Ratio to 4:1, Attack to 1ms, and Release to 0.1s to pump up room reflections."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad ssl 4000 g bus compressor collection": \[/, '"uad ssl 4000 g legacy bus compressor": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

