import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 1081 eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 1081 eq",
    "displayName": "UAD Neve 1081 EQ",
    "category": "Equalizers",
    "description": "Emulation of Neve's legendary 1972 channel amplifier and equalizer, famous for its punchy, highly flexible four-band design with high and low bandpass filters. It offers detailed surgical control with classic Neve console warmth.",
    "hardwareModel": "Neve 1081 Channel Amplifier",
    "parameters": [
      {
        "name": "Phase Invert",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Flips the phase of the signal.",
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
        "range": "3.3k / 4.7k / 6.8k / 10k / 15k Hz",
        "defaultVal": "10k Hz",
        "description": "Selects the high-frequency band target frequency.",
        "type": "switch",
        "options": [
          "3.3k Hz",
          "4.7k Hz",
          "6.8k Hz",
          "10k Hz",
          "15k Hz"
        ]
      },
      {
        "name": "High Gain",
        "range": "-18 to +18 dB",
        "defaultVal": "0 dB",
        "description": "High band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "High Q",
        "range": "Wide / Narrow",
        "defaultVal": "Wide",
        "description": "Toggles between bell and shelf shapes for the high band.",
        "type": "switch",
        "options": ["Wide", "Narrow"]
      },
      {
        "name": "Hi-Mid Frequency",
        "range": "1.5k to 8.2kHz",
        "defaultVal": "1.5 kHz",
        "description": "Selects high-mid band target frequency.",
        "type": "select",
        "options": [
          "1.5 kHz",
          "2.2 kHz",
          "3.3 kHz",
          "3.9 kHz",
          "4.7 kHz",
          "5.6 kHz",
          "6.8 kHz",
          "8.2 kHz"
        ]
      },
      {
        "name": "Hi-Mid Gain",
        "range": "-18 to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-mid band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "Hi-Mid Q",
        "range": "Wide / Narrow",
        "defaultVal": "Wide",
        "description": "Selects the bandwidth for the high-mid band.",
        "type": "switch",
        "options": ["Wide", "Narrow"]
      },
      {
        "name": "Low-Mid Frequency",
        "range": "220 Hz to 1.2 kHz",
        "defaultVal": "390 Hz",
        "description": "Selects low-mid band target frequency.",
        "type": "switch",
        "options": [
          "220 Hz",
          "270 Hz",
          "330 Hz",
          "390 Hz",
          "470 Hz",
          "560 Hz",
          "680 Hz",
          "820 Hz",
          "1000 Hz",
          "1200 Hz"
        ]
      },
      {
        "name": "Low-Mid Gain",
        "range": "-18 to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-mid band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "Low-Mid Q",
        "range": "Wide / Narrow",
        "defaultVal": "Wide",
        "description": "Selects the bandwidth for the low-mid band.",
        "type": "switch",
        "options": ["Wide", "Narrow"]
      },
      {
        "name": "Low Frequency",
        "range": "33 / 56 / 100 / 180 / 330 Hz",
        "defaultVal": "100 Hz",
        "description": "Selects the low band target frequency.",
        "type": "switch",
        "options": [
          "33 Hz",
          "56 Hz",
          "100 Hz",
          "180 Hz",
          "330 Hz"
        ]
      },
      {
        "name": "Low Gain",
        "range": "-18 to +18 dB",
        "defaultVal": "0 dB",
        "description": "Low band boost or cut level.",
        "type": "knob"
      },
      {
        "name": "Low Q",
        "range": "Wide / Narrow",
        "defaultVal": "Wide",
        "description": "Toggles between bell and shelf shapes for the low band.",
        "type": "switch",
        "options": ["Wide", "Narrow"]
      },
      {
        "name": "High Pass Filter",
        "range": "Off / 27 to 315 Hz",
        "defaultVal": "Off",
        "description": "Selects high pass filter step value.",
        "type": "select",
        "options": [
          "Off",
          "27 Hz",
          "47 Hz",
          "82 Hz",
          "150 Hz",
          "270 Hz"
        ]
      },
      {
        "name": "Low Pass Filter",
        "range": "Off / 3.9k to 18k Hz",
        "defaultVal": "Off",
        "description": "Selects low pass filter step value.",
        "type": "select",
        "options": [
          "Off",
          "18k Hz",
          "12k Hz",
          "8.2k Hz",
          "5.6k Hz",
          "3.9k Hz"
        ]
      }
    ],
    "proTips": [
      "Set the High Pass filter to 47 Hz or 82 Hz on vocal tracks to clean up sub-bass mud while maintaining a warm Neve low-end chest tone.",
      "The High-Mid band is extremely powerful for bringing out attack on acoustic guitars; select 3.3 kHz or 4.7 kHz and boost 2-4 dB for a shiny, forward character."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
