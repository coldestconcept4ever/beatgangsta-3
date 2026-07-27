import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad galaxy tape echo"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad galaxy tape echo",
    "displayName": "UAD Galaxy Tape Echo",
    "category": "Reverbs & Delays",
    "description": "The gold-standard multi-head tape delay. Captures the pitch wow/flutter, warm magnetic tape saturation, and lush, grainy spring reverb of the legendary Roland Space Echo.",
    "hardwareModel": "Roland RE-201 Space Echo",
    "parameters": [
      {
        "name": "Mode Selector",
        "range": "1 to 11",
        "defaultVal": "5",
        "description": "Selects combinations of playback heads 1, 2, 3, and the spring reverb.",
        "type": "select",
        "options": [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11"
        ]
      },
      {
        "name": "Repeat Rate",
        "range": "0 to 100",
        "defaultVal": "50",
        "description": "Controls the physical speed of the tape, setting delay duration.",
        "type": "knob"
      },
      {
        "name": "Intensity",
        "range": "0 to 100",
        "defaultVal": "35",
        "description": "Adjusts feedback repetition. Higher values trigger self-oscillation.",
        "type": "knob"
      },
      {
        "name": "Bass EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the low frequency content of the echo and reverb signals.",
        "type": "knob"
      },
      {
        "name": "Treble EQ",
        "range": "-15 dB to +15 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the high frequency content of the echo and reverb signals.",
        "type": "knob"
      },
      {
        "name": "Echo Volume",
        "range": "0 to 100",
        "defaultVal": "40",
        "description": "Sets the output volume of the wet delay tape playback signal.",
        "type": "knob"
      },
      {
        "name": "Reverb Volume",
        "range": "0 to 100",
        "defaultVal": "0",
        "description": "Sets the level of the gritty, mechanical spring reverb tank.",
        "type": "knob"
      },
      {
        "name": "Tape Age",
        "range": "New / Used / Old",
        "defaultVal": "Used",
        "description": "Changes the age of the loaded tape formula, adding high-cut filtering and wow/flutter.",
        "type": "select",
        "options": [
          "New",
          "Used",
          "Old"
        ]
      },
      {
        "name": "Splice",
        "range": "Off / On",
        "defaultVal": "Off",
        "description": "Activates the tape splice feature for organic wow/flutter dropout.",
        "type": "switch",
        "options": ["Off", "On"]
      }
    ],
    "proTips": [
      "Rotate the Mode Selector through modes 1 to 11 to combine the three staggered playback tape heads with the analog spring reverb tank.",
      "Turn the Intensity knob past 50% (12 o'clock) to send the delay line into beautiful, self-oscillating feedback loops.",
      "Set Tape Age to 'Old' to attenuate high frequencies in the feedback loop and add vintage pitch drift (wow & flutter)."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
