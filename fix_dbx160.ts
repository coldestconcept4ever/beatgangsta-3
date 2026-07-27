import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad dbx 160 compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad dbx 160 compressor",
    "displayName": "UAD dbx 160 Compressor",
    "category": "Dynamics",
    "description": "A meticulous emulation of the classic dbx 160 VU solid-state compressor, highly prized for its rapid VCA response, hard-knee compression, and grit-inducing vintage character on drums, bass, and aggressive guitars.",
    "hardwareModel": "dbx 160 VU Compressor/Limiter",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-40 to +20 dB",
        "defaultVal": "+20 dB",
        "description": "Sets the compressor threshold.",
        "type": "knob"
      },
      {
        "name": "Compression",
        "range": "1:1 to Infinity:1",
        "defaultVal": "1:1",
        "description": "Adjusts VCA ratio.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-20 to +20 dB",
        "defaultVal": "0 dB",
        "description": "Applies makeup output volume.",
        "type": "knob"
      },
      {
        "name": "Dry/Wet Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends dry and processed signals for parallel compression.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Slam rock room mics at a high Compression ratio of 10:1 and pull down the threshold to generate explosive, pumping drum room sustain.",
      "Lock rock bass guitars in place by dialing a 4:1 ratio, adjusting threshold for -5dB of gain reduction, and letting the VCA add punchy mid-frequency bite."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"Compression Ratio": /g, '"Compression": ');
pContent = pContent.replace(/"Output Gain": /g, '"Output": ');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
