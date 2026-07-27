import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 31102 eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 31102 eq",
    "displayName": "UAD Neve 31102 EQ",
    "category": "Equalizers",
    "description": "Emulates the legendary 31102 console EQ from Neve, celebrated for its raw, aggressive midrange energy and expensive-sounding high-shelf sheen. Originally found on the Neve 8068 console, this EQ provides distinctively musical passive-sounding filters and continuous harmonic coloration when pushed.",
    "hardwareModel": "Neve 31102 Console Equalizer",
    "parameters": [
      {
        "name": "Phase Invert",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Inverts the phase of the signal.",
        "type": "switch",
        "options": ["Off", "On"]
      },
      {
        "name": "EQ In/Out",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses the EQ circuitry.",
        "type": "switch",
        "options": ["In", "Out"]
      },
      {
        "name": "High Shelf Freq",
        "range": "10k / 12k / 16k Hz",
        "defaultVal": "10k Hz",
        "description": "Selects the high-frequency shelf shelf-point.",
        "type": "switch",
        "options": [
          "10k Hz",
          "12k Hz",
          "16k Hz"
        ]
      },
      {
        "name": "High Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "High-frequency shelf boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Freq",
        "range": "0.35k / 0.7k / 1.6k / 3.2k / 4.8k / 7.2k Hz",
        "defaultVal": "3.2k Hz",
        "description": "Mid-frequency peaking band selector.",
        "type": "switch",
        "options": [
          "0.35k Hz",
          "0.7k Hz",
          "1.6k Hz",
          "3.2k Hz",
          "4.8k Hz",
          "7.2k Hz"
        ]
      },
      {
        "name": "Mid Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "Midrange boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Q",
        "range": "Wide / Narrow",
        "defaultVal": "Wide",
        "description": "Selects the bandwidth (Q) of the midrange filter.",
        "type": "switch",
        "options": ["Wide", "Narrow"]
      },
      {
        "name": "Low Freq",
        "range": "35 / 60 / 110 / 220 Hz",
        "defaultVal": "60 Hz",
        "description": "Low-frequency peaking band selector.",
        "type": "switch",
        "options": [
          "35 Hz",
          "60 Hz",
          "110 Hz",
          "220 Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-16 to +16 dB",
        "defaultVal": "0 dB",
        "description": "Low-frequency boost or cut.",
        "type": "knob"
      },
      {
        "name": "Low Cut Freq",
        "range": "Off / 45 / 70 / 160 / 360 Hz",
        "defaultVal": "Off",
        "description": "Selects the low-cut (high-pass) filter frequency.",
        "type": "switch",
        "options": [
          "Off",
          "45 Hz",
          "70 Hz",
          "160 Hz",
          "360 Hz"
        ]
      },
      {
        "name": "High Cut Freq",
        "range": "Off / 14k / 10k / 8k / 6k / 4k Hz",
        "defaultVal": "Off",
        "description": "Selects the high-cut (low-pass) filter frequency.",
        "type": "switch",
        "options": [
          "Off",
          "14k Hz",
          "10k Hz",
          "8k Hz",
          "6k Hz",
          "4k Hz"
        ]
      }
    ],
    "proTips": [
      "Boost 12 kHz by +2dB on overheads to add expensive-sounding air without introducing harsh digital fizz.",
      "Set the Mid band to 3.2 kHz and boost +3dB to bring a dull rock snare forward in a busy mix with raw, analog-style punch."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

