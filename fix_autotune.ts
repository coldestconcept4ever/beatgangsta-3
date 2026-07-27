import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad antares auto-tune realtime"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad antares auto-tune realtime",
    "displayName": "UAD Antares Auto-Tune Realtime",
    "category": "Dynamics",
    "description": "The gold standard of real-time vocal pitch correction. Designed specifically for low-latency UAD DSP hardware tracking, it delivers seamless, natural-sounding pitch correction or the iconic, hard-tuned modern pop/hip-hop vocal effect with zero tracking delay.",
    "hardwareModel": "Antares Auto-Tune Pitch Correction Processor",
    "parameters": [
      {
        "name": "Input Type",
        "range": "Soprano / Alto/Tenor / Low Male / Instrument / Bass Inst",
        "defaultVal": "Alto/Tenor",
        "description": "Matches the pitch tracking algorithm to the input source's register for optimal, glitch-free pitch detection.",
        "type": "select",
        "options": [
          "Soprano",
          "Alto/Tenor",
          "Low Male",
          "Instrument",
          "Bass Inst"
        ]
      },
      {
        "name": "Retune Speed",
        "range": "0 to 400",
        "defaultVal": "20",
        "description": "Controls how fast the pitch correction snaps the audio to the target note.",
        "type": "knob"
      },
      {
        "name": "Humanize",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Preserves natural tuning variations on sustained vocal notes.",
        "type": "knob"
      },
      {
        "name": "Flex-Tune",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Provides natural corrective expression by leaving pitch variance uncorrected outside a targeted range.",
        "type": "knob"
      },
      {
        "name": "Natural Vibrato",
        "range": "-12 to +12",
        "defaultVal": "0",
        "description": "Amplifies or tames the natural vibrato profile of the incoming vocalist.",
        "type": "knob"
      },
      {
        "name": "Key",
        "range": "C / C# / D / D# / E / F / F# / G / G# / A / A# / B",
        "defaultVal": "C",
        "description": "Sets the root key of the pitch correction scale.",
        "type": "select",
        "options": [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B"
        ]
      },
      {
        "name": "Scale",
        "range": "Major / Minor / Chromatic / 26 others",
        "defaultVal": "Chromatic",
        "description": "Sets the active target interval scale constraints.",
        "type": "select",
        "options": [
          "Major",
          "Minor",
          "Chromatic",
          "26 others"
        ]
      },
      {
        "name": "Detune",
        "range": "427.4 Hz to 452.9 Hz",
        "defaultVal": "440.0 Hz",
        "description": "Calibrates the target reference frequency of A4.",
        "type": "knob"
      },
      {
        "name": "Tracking",
        "range": "1 to 100",
        "defaultVal": "50",
        "description": "Controls how relaxed the pitch tracker is. Higher values prevent flutter on noisy vocals.",
        "type": "knob"
      }
    ],
    "proTips": [
      "For a totally transparent performance correction, set Retune Speed to a moderate 20 to 50 and increase Humanize to around 30 to allow natural pitch glides during fast vocal transitions.",
      "To get the modern signature trap or pop hard-tuned sound, set Retune Speed instantly to 0 (fastest) and turn Flex-Tune to 0, locking the vocalist's pitch directly to the target scale grid."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
