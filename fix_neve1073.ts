import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 1073 preamp and eq collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 1073 preamp and eq collection",
    "displayName": "UAD Neve 1073 Preamp and EQ Collection",
    "category": "Preamps & Microphones",
    "description": "The Neve 1073 Preamp & EQ Collection is the definitive emulation of Rupert Neve's legendary class-A transistor mic/line preamp and EQ. It offers rich, warm, and authoritative console saturation alongside its highly musical 3-band EQ, featuring the famous fixed high-frequency shelf, semi-parametric mid-band, and low-cut filter.",
    "hardwareModel": "Neve 1073 Channel Amplifier",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-20 dB to +80 dB",
        "defaultVal": "0 dB",
        "description": "Controls the class-A transistor input stage gain, adding rich harmonic saturation at higher settings.",
        "type": "knob"
      },
      {
        "name": "High Shelf EQ Gain",
        "range": "-16 dB to +16 dB",
        "defaultVal": "0 dB",
        "description": "Controls the fixed 12 kHz high-shelving equalizer band boost or cut.",
        "type": "knob"
      },
      {
        "name": "Mid Band Frequency",
        "range": "Off / 360 Hz / 700 Hz / 1.6 kHz / 3.2 kHz / 4.8 kHz / 7.2 kHz",
        "defaultVal": "Off",
        "description": "Selects the active frequency band for the peaking mid EQ.",
        "type": "select",
        "options": [
          "Off",
          "360 Hz",
          "700 Hz",
          "1.6 kHz",
          "3.2 kHz",
          "4.8 kHz",
          "7.2 kHz"
        ]
      },
      {
        "name": "Mid Band Gain",
        "range": "-18 dB to +18 dB",
        "defaultVal": "0 dB",
        "description": "Controls the mid-frequency band boost or cut.",
        "type": "knob"
      },
      {
        "name": "Low Band Frequency",
        "range": "Off / 35 Hz / 60 Hz / 110 Hz / 220 Hz",
        "defaultVal": "Off",
        "description": "Selects the active shelving frequency for the low EQ band.",
        "type": "select",
        "options": [
          "Off",
          "35 Hz",
          "60 Hz",
          "110 Hz",
          "220 Hz"
        ]
      },
      {
        "name": "Low Band Gain",
        "range": "-16 dB to +16 dB",
        "defaultVal": "0 dB",
        "description": "Controls the low-frequency band shelving boost or cut.",
        "type": "knob"
      },
      {
        "name": "High Pass Filter Freq",
        "range": "Off / 50 Hz / 80 Hz / 160 Hz / 300 Hz",
        "defaultVal": "Off",
        "description": "Selects the high-pass passive filter cutoff frequency.",
        "type": "select",
        "options": [
          "Off",
          "50 Hz",
          "80 Hz",
          "160 Hz",
          "300 Hz"
        ]
      },
      {
        "name": "Output Level",
        "range": "-24 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls the final output level.",
        "type": "knob"
      },
      {
        "name": "Phase Invert",
        "range": "In / Out",
        "defaultVal": "Out",
        "description": "Inverts the phase of the signal.",
        "type": "switch",
        "options": [
          "Out",
          "In"
        ]
      },
      {
        "name": "EQ In/Out",
        "range": "In / Out",
        "defaultVal": "In",
        "description": "Bypasses or engages the EQ section.",
        "type": "switch",
        "options": [
          "In",
          "Out"
        ]
      }
    ],
    "proTips": [
      "Engage Unison mode on your Apollo interface to match the exact physical 1073 input impedance. Crank the Red Gain knob past 50 dB and back off the output fader to introduce rich class-A harmonic saturation to vocals and bass.",
      "The fixed 12 kHz High Shelf is legendary. Boost it by +2 to +4 dB on acoustic guitars or lead vocals to introduce a silky, expensive 'air' that never sounds harsh or sibilant.",
      "Use the High Pass Filter at 80 Hz combined with a slight boost at 110 Hz on your low shelf. This classic 'push-pull' trick tightens low-end mud while emphasizing the solid punch of kick drums and bass lines."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad neve 1073": \[/, '"uad neve 1073 preamp and eq collection": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

