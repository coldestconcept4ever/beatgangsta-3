import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad cambridge eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad cambridge eq",
    "displayName": "UAD Cambridge EQ",
    "category": "Equalizers",
    "description": "A highly precise, surgical digital equalizer designed to provide clean, transparent frequency shaping with multiple filter types and slopes. Known for its extremely low DSP usage and flexible 5-band parametric controls plus comprehensive high-pass and low-pass filters.",
    "hardwareModel": "Proprietary Universal Audio Cambridge EQ",
    "parameters": [
      {
        "name": "HP Freq",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "20 Hz",
        "description": "Sets the high-pass filter cutoff frequency.",
        "type": "knob"
      },
      {
        "name": "HP Slope",
        "range": "6 dB to 36 dB",
        "defaultVal": "12 dB",
        "description": "Toggles the attenuation slope steepness of the high-pass filter.",
        "type": "select",
        "options": [
          "6 dB",
          "12 dB",
          "18 dB",
          "24 dB",
          "30 dB",
          "36 dB"
        ]
      },
      {
        "name": "Band 3 Freq",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "1 kHz",
        "description": "Adjusts the center frequency for the middle parametric band.",
        "type": "knob"
      },
      {
        "name": "LP Freq",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "20 kHz",
        "description": "Sets the low-pass filter cutoff frequency.",
        "type": "knob"
      },
      {
        "name": "LP Slope",
        "range": "6 dB to 36 dB",
        "defaultVal": "12 dB",
        "description": "Toggles the attenuation slope steepness of the low-pass filter.",
        "type": "select",
        "options": [
          "6 dB",
          "12 dB",
          "18 dB",
          "24 dB",
          "30 dB",
          "36 dB"
        ]
      }
    ],
    "proTips": [
      "Use the 36 dB/octave High Pass filter cut set to 30 Hz to aggressively clean up muddy sub-bass rumble without touching the kick drum's punch.",
      "Select the 'Type I' shelving response for extremely transparent surgical notched cuts on harsh vocal frequencies."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
