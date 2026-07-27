import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad trident a-range eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad trident a-range eq",
    "displayName": "UAD Trident A-Range EQ",
    "category": "Equalizers",
    "description": "An authentic model of the legendary console equalizer from the Trident A-Range desk. Prized for its colorful inductor-based band interaction, it adds signature presence, grit, and aggressive bite to vocals and electric guitars.",
    "hardwareModel": "Trident A-Range Console Equalizer",
    "parameters": [
      {
        "name": "HF Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-frequency shelving gain.",
        "type": "slider"
      },
      {
        "name": "HF Frequency",
        "range": "8k / 10k / 12k / 15k Hz",
        "defaultVal": "10k Hz",
        "description": "Selects high-frequency shelving band.",
        "type": "select",
        "options": [
          "8k Hz",
          "10k Hz",
          "12k Hz",
          "15k Hz"
        ]
      },
      {
        "name": "HMF Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-mid frequency bell gain.",
        "type": "slider"
      },
      {
        "name": "HMF Frequency",
        "range": "3k / 5k / 7k / 9k Hz",
        "defaultVal": "5k Hz",
        "description": "Selects high-mid frequency band.",
        "type": "select",
        "options": [
          "3k Hz",
          "5k Hz",
          "7k Hz",
          "9k Hz"
        ]
      },
      {
        "name": "LMF Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-mid frequency bell gain.",
        "type": "slider"
      },
      {
        "name": "LMF Frequency",
        "range": "250 / 500 / 1k / 2k Hz",
        "defaultVal": "1k Hz",
        "description": "Selects low-mid frequency band.",
        "type": "select",
        "options": [
          "250 Hz",
          "500 Hz",
          "1k Hz",
          "2k Hz"
        ]
      },
      {
        "name": "LF Gain",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-frequency shelving gain.",
        "type": "slider"
      },
      {
        "name": "LF Frequency",
        "range": "50 / 80 / 100 / 150 Hz",
        "defaultVal": "100 Hz",
        "description": "Selects low-frequency shelving band.",
        "type": "select",
        "options": [
          "50 Hz",
          "80 Hz",
          "100 Hz",
          "150 Hz"
        ]
      },
      {
        "name": "Input Saturation",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the modeled input stage to induce pleasing distortion.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To help rock or metal electric guitars cut through a busy mix, set HMF Frequency to 3 kHz and push the gain slider up to +4 dB to engage the legendary inductor bite.",
      "Engage the low-end filters by combining frequencies to create unique, sharp, resonant cut slopes that cleans mud while retaining punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

