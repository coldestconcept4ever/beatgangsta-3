import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad fairchild tube limiter collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad fairchild tube limiter collection",
    "displayName": "UAD Fairchild Tube Limiter Collection",
    "category": "Dynamics",
    "description": "The Fairchild Tube Limiter Collection represents the gold standard in variable-mu tube compression. Modeled from the legendary 660 (mono) and 670 (stereo) vintage hardware, it is famous for its warm, lush tube coloration, smooth feedback compression curves, and program-dependent attack/release Time Constants.",
    "hardwareModel": "Fairchild 670 / 660 Feedback Compressor/Limiter",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "0 to 20",
        "defaultVal": "10",
        "description": "Controls the level going into the tube processing path.",
        "type": "knob"
      },
      {
        "name": "Threshold",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Controls the point at which dynamic limiting/compression begins.",
        "type": "knob"
      },
      {
        "name": "Time Constant",
        "range": "1 to 6",
        "defaultVal": "1",
        "description": "Selects pre-configured hardware attack/release time combinations.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6"
        ]
      },
      {
        "name": "Sidechain Filter",
        "range": "Off / 50 Hz to 250 Hz",
        "defaultVal": "Off",
        "description": "Low frequency filter in the sidechain control loop to prevent bass frequencies from pumping the compression.",
        "type": "knob"
      },
      {
        "name": "AGC Mode",
        "range": "Left/Right / Lat/Vert (M/S)",
        "defaultVal": "Left/Right",
        "description": "Determines the internal sidechain and signal linking configuration.",
        "type": "select",
        "options": [
          "Left/Right",
          "Lat/Vert (M/S)"
        ]
      },
      {
        "name": "Output Level",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls the final makeup gain.",
        "type": "knob"
      }
    ],
    "proTips": [
      "On a stereo drum bus or master fader, select Time Constant 5 or 6. These are the classic program-dependent settings with multi-stage recovery times, giving you smooth, musical glue that adapts to the song.",
      "Switch the AGC mode to Mid/Side. This lets you compress the center (kick, snare, lead vocals) separately from the sides (guitars, reverbs, overheads), allowing you to widen your mix dynamically.",
      "For vintage bass guitar tracking, use the Fairchild 660 model. Engage 2 to 3 dB of gain reduction on Time Constant 2 to add rich second-harmonic distortion and level out aggressive finger pluck transients."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad fairchild 670": \[/, '"uad fairchild tube limiter collection": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

