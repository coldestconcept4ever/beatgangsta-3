import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const legacyRegex = /\{\s*"name":\s*"uad tube-tech cl 1b compressor"[\s\S]*?"Authorized for all devices"\s*\}/;
const legacyReplacement = `  {
    "name": "uad tube-tech cl 1b compressor",
    "displayName": "UAD Tube-Tech CL 1B Compressor (Legacy)",
    "category": "Dynamics",
    "description": "An authentic emulation of the iconic Danish blue optical compressor. Renowned for its incredibly smooth, warm, and highly musical tube compression that effortlessly glues vocals, bass, and acoustic guitars without destroying transients.",
    "hardwareModel": "Tube-Tech CL 1B Opto Compressor",
    "parameters": [
      {
        "name": "Gain",
        "range": "Off, 0 to +30 dB",
        "defaultVal": "0 dB",
        "description": "Applies output makeup gain.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "+10 dB to -40 dB",
        "defaultVal": "+10 dB",
        "description": "Sets the compression threshold level.",
        "type": "knob"
      },
      {
        "name": "Ratio",
        "range": "2:1 to 10:1",
        "defaultVal": "2:1",
        "description": "Sets the compression ratio.",
        "type": "knob"
      },
      {
        "name": "Attack",
        "range": "0.5 ms to 300 ms",
        "defaultVal": "10 ms",
        "description": "Sets the attack time.",
        "type": "knob"
      },
      {
        "name": "Release",
        "range": "0.05 s to 10 s",
        "defaultVal": "0.5 s",
        "description": "Sets the release time.",
        "type": "knob"
      },
      {
        "name": "Attack/Release Select",
        "range": "Manual / Fix / Fix-Man",
        "defaultVal": "Manual",
        "description": "Selects manual, fixed, or combined program-dependent attack and release behavior.",
        "type": "select",
        "options": [
          "Manual",
          "Fix",
          "Fix-Man"
        ]
      },
      {
        "name": "Meter Select",
        "range": "Input / Compression / Output",
        "defaultVal": "Compression",
        "description": "Determines whether the large physical VU meter displays input levels, decibels of optical gain reduction, or output levels.",
        "type": "select",
        "options": [
          "Input",
          "Compression",
          "Output"
        ]
      }
    ],
    "proTips": [
      "On lead pop vocals, select 'Fix-Man' mode. This introduces a dual-time constant release where fast transients recover quickly while the overall average level is leveled out smoothly, keeping the vocal beautifully upfront.",
      "For bass guitar, switch to 'Manual' control with a medium-slow Attack (around 12 o'clock) and a fast Release (around 9 o'clock). This allows the initial string pluck transient to slip through untouched before clamping down for ultimate low-end sustain."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(legacyRegex, legacyReplacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
