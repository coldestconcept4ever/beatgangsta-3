import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad api 2500 bus compressor"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad api 2500 bus compressor",
    "displayName": "UAD API 2500 Bus Compressor",
    "category": "Dynamics",
    "description": "The ultimate punchy VCA stereo master bus compressor. Delivers incredible transient grab, harmonic density, and the signature 'thrust' circuit that keeps low-end frequencies solid and dynamic.",
    "hardwareModel": "API 2500 Stereo Bus Compressor Hardware",
    "parameters": [
      {
        "name": "Threshold",
        "range": "-20 dBu to +10 dBu",
        "defaultVal": "+10 dBu",
        "description": "Determines signal level where compression begins.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "1.5:1 / 2:1 / 3:1 / 4:1 / 10:1 / infinity",
        "defaultVal": "2:1",
        "description": "Selects active compression ratio curve.",
        "type": "select",
        "options": [
          "1.5:1",
          "2:1",
          "3:1",
          "4:1",
          "10:1",
          "infinity"
        ]
      },
      {
        "name": "Attack",
        "range": "0.03 / 0.1 / 0.3 / 1.0 / 3.0 / 10 / 30 ms",
        "defaultVal": "30 ms",
        "description": "Determines transient onset response speed.",
        "type": "select",
        "options": [
          "0.03 ms",
          "0.1 ms",
          "0.3 ms",
          "1.0 ms",
          "3.0 ms",
          "10 ms",
          "30 ms"
        ]
      },
      {
        "name": "Release",
        "range": "0.05 / 0.1 / 0.2 / 0.5 / 1.0 / 2.0 s / Variable",
        "defaultVal": "0.5 s",
        "description": "Adjusts speed of recovery to unity gain.",
        "type": "select",
        "options": [
          "0.05 s",
          "0.1 s",
          "0.2 s",
          "0.5 s",
          "1.0 s",
          "2.0 s",
          "Variable"
        ]
      },
      {
        "name": "Variable Release",
        "range": "0.05 s to 3 s",
        "defaultVal": "0.5 s",
        "description": "Continuous control for release time when Variable is selected.",
        "type": "knob"
      },
      {
        "name": "Knee Mode",
        "range": "Soft / Med / Hard",
        "defaultVal": "Hard",
        "description": "Selects the compression knee shape.",
        "type": "select",
        "options": ["Soft", "Med", "Hard"]
      },
      {
        "name": "Thrust Filter",
        "range": "Norm / Med / Loud",
        "defaultVal": "Norm",
        "description": "Activates sidechain spectral filter to preserve low-end power.",
        "type": "select",
        "options": [
          "Norm",
          "Med",
          "Loud"
        ]
      },
      {
        "name": "Type Mode",
        "range": "Old / New",
        "defaultVal": "New",
        "description": "Switches feedback (Old) vs feed-forward (New) detection architecture.",
        "type": "select",
        "options": [
          "Old",
          "New"
        ]
      },
      {
        "name": "L/R Link",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Determines stereo linking behavior between left and right channels.",
        "type": "knob"
      },
      {
        "name": "Makeup Gain",
        "range": "0 to 24 dB",
        "defaultVal": "0",
        "description": "Adjusts output makeup gain.",
        "type": "knob"
      },
      {
        "name": "Manual / Auto Gain",
        "range": "Manual / Auto",
        "defaultVal": "Manual",
        "description": "Toggles manual or automatic makeup gain.",
        "type": "select",
        "options": ["Manual", "Auto"]
      }
    ],
    "proTips": [
      "Engage the patented 'Thrust' filter to Loud or Medium. This places a high-pass filter on the sidechain detector so that sub-kick and heavy bass do not over-trigger the compressor.",
      "The 'Old' compression mode mimics classic feedback compression (smoother, vintage), while the 'New' mode runs feed-forward compression (ultra-fast, modern, clean, hard-hitting).",
      "Use extremely slow attack times (e.g., 30ms) and fast releases (e.g., 0.1s) with a low ratio of 2:1 on your master bus to clamp down on stray peaks while maintaining transient punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad api 2500": \[/, '"uad api 2500 bus compressor": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

