import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad tube-tech eq collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad tube-tech eq collection",
    "displayName": "UAD Tube-Tech EQ Collection",
    "category": "Equalizers",
    "description": "The gold standard of Pultec-style tube equalizers. Bundles the PE 1C Program Equalizer for broad, silky low/high shelf sweetening and the ME 1B Mid-Range Equalizer for pristine mid-frequency carving.",
    "hardwareModel": "Tube-Tech PE 1C and ME 1B Tube Equalizers",
    "parameters": [
      {
        "name": "Active Unit",
        "range": "PE 1C / ME 1B / Both",
        "defaultVal": "Both",
        "description": "Selects the active equalizer module in the channel strip.",
        "type": "select",
        "options": ["PE 1C", "ME 1B", "Both"]
      },
      {
        "name": "Low Freq (PE 1C)",
        "range": "20 / 30 / 60 / 100 Hz",
        "defaultVal": "30 Hz",
        "description": "Sets low shelving target frequency for the PE 1C unit.",
        "type": "select",
        "options": [
          "20 Hz",
          "30 Hz",
          "60 Hz",
          "100 Hz"
        ]
      },
      {
        "name": "Low Boost (PE 1C)",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Boosts low-frequency shelving band on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "Low Atten (PE 1C)",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Attenuates low-frequency shelving band on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "High Boost Freq (PE 1C)",
        "range": "1 / 1.5 / 2 / 3 / 4 / 5 / 8 / 10 / 12 / 16 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets target frequency for high-frequency peaking boost on PE 1C.",
        "type": "select",
        "options": [
          "1 kHz",
          "1.5 kHz",
          "2 kHz",
          "3 kHz",
          "4 kHz",
          "5 kHz",
          "8 kHz",
          "10 kHz",
          "12 kHz",
          "16 kHz"
        ]
      },
      {
        "name": "High Boost Q (PE 1C)",
        "range": "Sharp to Broad",
        "defaultVal": "Broad",
        "description": "Adjusts bandwidth of the High Boost peaking filter on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "High Boost Gain (PE 1C)",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts peaking high boost gain on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "High Atten Freq (PE 1C)",
        "range": "5 / 10 / 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Sets target frequency for high-frequency shelving attenuation on the PE 1C.",
        "type": "select",
        "options": ["5 kHz", "10 kHz", "20 kHz"]
      },
      {
        "name": "High Atten Gain (PE 1C)",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts high shelf shelving attenuation on the PE 1C.",
        "type": "knob"
      },
      {
        "name": "Mid Boost Freq (ME 1B)",
        "range": "0.2 / 0.3 / 0.5 / 0.7 / 1 / 1.5 / 2 / 3 / 4 / 5 / 7 kHz",
        "defaultVal": "1 kHz",
        "description": "Sets target frequency for mid-range peaking boost on the ME 1B.",
        "type": "select",
        "options": [
          "0.2 kHz", "0.3 kHz", "0.5 kHz", "0.7 kHz", "1 kHz", "1.5 kHz",
          "2 kHz", "3 kHz", "4 kHz", "5 kHz", "7 kHz"
        ]
      },
      {
        "name": "Mid Boost Gain (ME 1B)",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Adjusts mid-range peaking boost gain on the ME 1B.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Use the legendary 'Pultec low-end trick' on the PE 1C: select 30Hz or 60Hz and boost and attenuate simultaneously to tighten kick drum subs while clearing boxy low-mids.",
      "Open up backing vocal groups or stereo bus mixes with the PE 1C by choosing a high boost of 12kHz or 16kHz with a wide Bandwidth (around 7) and a subtle +2dB boost.",
      "On the ME 1B, select 700Hz or 1kHz and dial in an attenuation of -2dB to clear out boxy or nasal characters from vocals or acoustic guitars."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
