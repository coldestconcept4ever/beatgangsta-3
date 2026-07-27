import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad manley voxbox channel strip"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad manley voxbox channel strip",
    "displayName": "UAD Manley VOXBOX Channel Strip",
    "category": "Channel Strips",
    "description": "The absolute pinnacle of all-tube high-end vocal processor channel strips. Features a gorgeous Class A tube preamp, dynamic opto compressor placed BEFORE the preamp to prevent distortion, a Pultec-style passive EQ, and an ultra-precise vocal de-esser/limiter module.",
    "hardwareModel": "Manley Laboratories VOXBOX Vacuum Tube Channel Strip",
    "parameters": [
      {
        "name": "Preamp Input Gain",
        "range": "40 dB to 60 dB",
        "defaultVal": "45 dB",
        "description": "Step selector for input vacuum tube gain drive.",
        "type": "select",
        "options": [
          "40 dB",
          "45 dB",
          "50 dB",
          "55 dB",
          "60 dB"
        ]
      },
      {
        "name": "Preamp Low Cut Filter",
        "range": "Flat / 80 Hz / 120 Hz",
        "defaultVal": "Flat",
        "description": "Steep custom low-cut filter to manage vocal sibilants and rumble.",
        "type": "select",
        "options": [
          "Flat",
          "80 Hz",
          "120 Hz"
        ]
      },
      {
        "name": "Compressor Threshold",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Controls 3:1 opto compression threshold.",
        "type": "knob"
      },
      {
        "name": "Compressor Attack",
        "range": "Fast / Med Fast / Med / Med Slow / Slow",
        "defaultVal": "Med",
        "description": "Sets the opto compressor attack speed.",
        "type": "select",
        "options": ["Fast", "Med Fast", "Med", "Med Slow", "Slow"]
      },
      {
        "name": "Compressor Release",
        "range": "Fast / Med Fast / Med / Med Slow / Slow",
        "defaultVal": "Med",
        "description": "Sets the opto compressor release speed.",
        "type": "select",
        "options": ["Fast", "Med Fast", "Med", "Med Slow", "Slow"]
      },
      {
        "name": "EQ Mid Frequency",
        "range": "200 Hz to 7.2 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Sets center frequency for passive mid-range dip EQ.",
        "type": "knob"
      },
      {
        "name": "EQ Mid Gain",
        "range": "-10 dB to 0 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts passive mid-range cut level.",
        "type": "knob"
      },
      {
        "name": "De-esser Threshold",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets dynamic sibilant compression threshold.",
        "type": "knob"
      },
      {
        "name": "De-esser Frequency",
        "range": "3 kHz / 6 kHz / 9 kHz / 12 kHz / Limit",
        "defaultVal": "3 kHz",
        "description": "Selects the target frequency band for the De-Esser, or functions as a Limiter.",
        "type": "select",
        "options": ["3 kHz", "6 kHz", "9 kHz", "12 kHz", "Limit"]
      }
    ],
    "proTips": [
      "The compressor is uniquely positioned BEFORE the tube preamp—this lets you smooth out peaks and manage vocal dynamics without overdriving or clipping the sensitive tube input stage.",
      "The mid-parametric EQ operates on passive inductors for incredibly rich, vintage vocal warmth. Try a 2-3dB boost at 1.5 kHz or 3.0 kHz to give vocals clear presence and articulation.",
      "The de-esser/limiter features a dedicated 10% opto limiter that can operate at 10 kHz to pin down sibilants dynamically without dulling the performance."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad manley voxbox": \[/, '"uad manley voxbox channel strip": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

