import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad manley variable mu limiter"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad manley variable mu limiter",
    "displayName": "UAD Manley Variable Mu Limiter",
    "category": "Dynamics",
    "description": "The definitive emulation of Manley's flagship vacuum tube compressor. Operating on the variable-delta-mu principle where tube gain is continually modulated, it provides the ultimate velvety stereo glue, warm harmonic depth, and cohesive low-end control for the master bus and vocal groups.",
    "hardwareModel": "Manley Variable Mu Limiter Compressor",
    "parameters": [
      {
        "name": "Input",
        "range": "Min to Max",
        "defaultVal": "Center",
        "description": "Sets the input level, driving the tube circuitry and determining threshold behavior.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "Min to Max",
        "defaultVal": "Center",
        "description": "Sets the compression threshold.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "Fast to Slow",
        "defaultVal": "Medium",
        "description": "Determines the variable compressor attack speed.",
        "type": "knob"
      },
      {
        "name": "Recovery",
        "range": "Fast / Medium Fast / Medium / Medium Slow / Slow",
        "defaultVal": "Medium Fast",
        "description": "Sets the recovery (release) time.",
        "type": "select",
        "options": [
          "Fast",
          "Medium Fast",
          "Medium",
          "Medium Slow",
          "Slow"
        ]
      },
      {
        "name": "Compress/Limit",
        "range": "Compress / Limit",
        "defaultVal": "Compress",
        "description": "Toggles between a soft-knee 1.5:1 ratio and a stiffer, punchier 4:1 to 20:1 limit ratio.",
        "type": "select",
        "options": [
          "Compress",
          "Limit"
        ]
      },
      {
        "name": "Output",
        "range": "Min to Max",
        "defaultVal": "Center",
        "description": "Sets the final makeup gain output level.",
        "type": "knob"
      },
      {
        "name": "Headroom",
        "range": "0 to +30 dB",
        "defaultVal": "+16 dB",
        "description": "Adjusts the internal operating level, allowing for clean operation or aggressive saturation.",
        "type": "knob"
      },
      {
        "name": "Sidechain HPF",
        "range": "In / Out",
        "defaultVal": "Out",
        "description": "Engages a 100 Hz high-pass filter on the sidechain detector.",
        "type": "select",
        "options": ["In", "Out"]
      },
      {
        "name": "L/R Link",
        "range": "Link / Unlinked",
        "defaultVal": "Link",
        "description": "Links Left and Right channels for stereo detection.",
        "type": "select",
        "options": ["Link", "Unlinked"]
      }
    ],
    "proTips": [
      "For legendary master bus glue: set Compress mode, Attack to Medium-Slow (around 2 o'clock), Recovery to 0.4s or 0.2s, and drive the Input until you get a maximum of 1 to 1.5 dB of gain reduction. This instantly pulls a digital mix together with expensive-sounding tube depth.",
      "Engage the Sidechain High-Pass Filter (HPF) on the bottom panel. This prevents sub-bass energy below 100 Hz from triggering the compression, keeping your kick drum punchy and avoiding unwanted mix pumping."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"Input Gain"/g, '"Input"');
pContent = pContent.replace(/"Recovery \/ Release"/g, '"Recovery"');
pContent = pContent.replace(/"Output Gain"/g, '"Output"');
pContent = pContent.replace(/"HP Sidechain"/g, '"Sidechain HPF"');
pContent = pContent.replace(/"Mode Select"/g, '"Compress/Limit"');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

