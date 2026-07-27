import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad neve 88rs channel strip collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad neve 88rs channel strip collection",
    "displayName": "UAD Neve 88RS Channel Strip Collection",
    "category": "Channel Strips",
    "description": "The pinnacle of large-format console architecture. Captures the sound of the ultimate high-headroom Neve 88RS desk, delivering pristine, modern, punchy analog saturation, an ultra-smooth four-band parametric EQ, a fast gate/expander, and transparent VCA compression.",
    "hardwareModel": "Neve 88RS Large-Format Mixing Console",
    "parameters": [
      {
        "name": "Input Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Sets the console preamp gain. High values introduce modern Neve harmonic grit.",
        "type": "knob"
      },
      {
        "name": "High Cut Filter",
        "range": "Out / 7.5 kHz to 18 kHz",
        "defaultVal": "Out",
        "description": "Applies a steep 12dB/octave low-pass filter.",
        "type": "knob"
      },
      {
        "name": "Low Cut Filter",
        "range": "Out / 31.5 Hz to 315 Hz",
        "defaultVal": "Out",
        "description": "Applies a steep 12dB/octave high-pass filter.",
        "type": "knob"
      },
      {
        "name": "Gate Threshold",
        "range": "-25 dBu to +15 dBu",
        "defaultVal": "-25 dBu",
        "description": "Adjusts the threshold for the Gate/Expander module.",
        "type": "knob"
      },
      {
        "name": "Gate Release",
        "range": "0.01 s to 3.0 s",
        "defaultVal": "0.1 s",
        "description": "Sets the Gate/Expander recovery speed.",
        "type": "knob"
      },
      {
        "name": "Compressor Threshold",
        "range": "-30 dBu to +20 dBu",
        "defaultVal": "+20 dBu",
        "description": "Adjusts the threshold for the VCA compressor module.",
        "type": "knob"
      },
      {
        "name": "Compressor Ratio",
        "range": "1:1 to 10:1 (Continuous)",
        "defaultVal": "2:1",
        "description": "Sets the compression slope.",
        "type": "knob"
      },
      {
        "name": "Compressor Release",
        "range": "0.01 s to 3.0 s / Auto",
        "defaultVal": "0.1 s",
        "description": "Sets the VCA compressor recovery speed.",
        "type": "knob"
      },
      {
        "name": "High EQ Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls gain for the high shelving band.",
        "type": "knob"
      },
      {
        "name": "Low EQ Gain",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Controls gain for the low shelving band.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Enable the Pre-EQ (P-EQ) button in the dynamics module to route the VCA compressor BEFORE the EQ, allowing you to sculpt the compressed tone surgically.",
      "Drive the Preamp Input Gain hard to introduce warm, harmonically rich console saturation, then back down the fader to keep output levels safe.",
      "Engage the Hysteresis control on the Gate module to prevent chattering/rapid toggling on trailing decay tails of drums or background instruments."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad neve 88rs": \[/, '"uad neve 88rs channel strip collection": [');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

