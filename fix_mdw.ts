import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad massenburg designworks mdweq5 eq"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad massenburg designworks mdweq5 eq",
    "displayName": "UAD Massenburg DesignWorks MDWEQ5 EQ",
    "category": "Equalizers",
    "description": "The industry-standard high-resolution parametric EQ, designed by the pioneer of parametric equalization himself, George Massenburg. Featuring high-precision, double-precision processing with zero phase distortion, it is the ultimate choice for surgical corrective equalization and mastering.",
    "hardwareModel": "Massenburg DesignWorks MDW Parametric EQ 5",
    "parameters": [
      {
        "name": "Band 1 Type",
        "range": "High Pass / Low Shelf / Peaking",
        "defaultVal": "Low Shelf",
        "description": "Selects filter type for Band 1.",
        "type": "select",
        "options": [
          "High Pass",
          "Low Shelf",
          "Peaking"
        ]
      },
      {
        "name": "Band 1 Frequency",
        "range": "10 Hz to 24 kHz",
        "defaultVal": "100 Hz",
        "description": "Sets the center or cutoff frequency for Band 1.",
        "type": "knob"
      },
      {
        "name": "Band 1 Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the cut or boost level for Band 1.",
        "type": "knob"
      },
      {
        "name": "Band 1 Q",
        "range": "0.1 to 25.6",
        "defaultVal": "1.0",
        "description": "Adjusts the bandwidth (Q factor) of Band 1.",
        "type": "knob"
      },
      {
        "name": "Band 3 Frequency",
        "range": "10 Hz to 24 kHz",
        "defaultVal": "1000 Hz",
        "description": "Sets the center frequency for the midrange band.",
        "type": "knob"
      },
      {
        "name": "Band 3 Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the cut or boost level for the midrange band.",
        "type": "knob"
      },
      {
        "name": "Band 3 Q",
        "range": "0.1 to 25.6",
        "defaultVal": "1.0",
        "description": "Adjusts the bandwidth (Q factor) of the midrange filter, allowing extremely narrow notches.",
        "type": "knob"
      },
      {
        "name": "Band 5 Type",
        "range": "Low Pass / High Shelf / Peaking",
        "defaultVal": "High Shelf",
        "description": "Selects filter type for Band 5.",
        "type": "select",
        "options": [
          "Low Pass",
          "High Shelf",
          "Peaking"
        ]
      },
      {
        "name": "Band 5 Frequency",
        "range": "10 Hz to 24 kHz",
        "defaultVal": "10000 Hz",
        "description": "Sets the center or cutoff frequency for Band 5.",
        "type": "knob"
      },
      {
        "name": "Band 5 Gain",
        "range": "-24 dB to +24 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the cut or boost level for the high band.",
        "type": "knob"
      },
      {
        "name": "Band 5 Q",
        "range": "0.1 to 25.6",
        "defaultVal": "1.0",
        "description": "Adjusts the bandwidth (Q factor) of Band 5.",
        "type": "knob"
      }
    ],
    "proTips": [
      "The MDWEQ5 is famous for its surgical precision and zero phase distortion. To remove an annoying frequency or room resonance from an acoustic guitar, set Q to 25.6, boost the gain to +12 dB, sweep the frequency to locate the whistle, and then notch it down to -10 dB.",
      "For mastering, use the High Shelf (Band 5) set around 12 kHz, with a broad Q of 0.5. Gently boost by 0.5 to 1.5 dB. Because of Massenburg's ultra-clean filter math, this adds incredible airy sweetness without any digital harshness."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
