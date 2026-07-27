import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad api vision channel strip legacy"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad api vision channel strip legacy",
    "displayName": "UAD API Vision Channel Strip Legacy",
    "category": "Channel Strips",
    "description": "The API Vision Channel Strip Legacy is a precise emulation of API's flagship analog console. It combines the 212L preamp, the punchy 225L compressor/limiter, the 235L gate/expander, the highly interactive 550L four-band parametric EQ, and selectable filters to deliver legendary American punch, midrange bite, and headroom.",
    "hardwareModel": "API Vision Channel Strip Console",
    "parameters": [
      {
        "name": "212L Preamp Gain",
        "range": "0 to +65 dB",
        "defaultVal": "0 dB",
        "description": "Controls active mic preamp class-A dynamic amplification level.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Threshold",
        "range": "+10 to -20 dB",
        "defaultVal": "+10 dB",
        "description": "Controls threshold point for discrete compressor.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Ratio",
        "range": "1.5:1 to 10:1",
        "defaultVal": "2:1",
        "description": "Selects dynamic processing compression slope ratios.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Attack",
        "range": "Fast / Slow",
        "defaultVal": "Fast",
        "description": "Selects fast or slow attack times.",
        "type": "select",
        "options": ["Fast", "Slow"]
      },
      {
        "name": "225L Compressor Release",
        "range": "50 ms to 3 s",
        "defaultVal": "500 ms",
        "description": "Controls release times of dynamic gain reduction loop.",
        "type": "knob"
      },
      {
        "name": "225L Compressor Type",
        "range": "Old (Feedback) / New (Feed-Forward)",
        "defaultVal": "Old (Feedback)",
        "description": "Selects compression style.",
        "type": "select",
        "options": ["Old (Feedback)", "New (Feed-Forward)"]
      },
      {
        "name": "550L EQ High Band Freq",
        "range": "2.5 to 20 kHz",
        "defaultVal": "10 kHz",
        "description": "Selects active frequency for 550L EQ High band.",
        "type": "knob"
      },
      {
        "name": "550L EQ High Band Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-band shelving or peaking EQ gain.",
        "type": "knob"
      },
      {
        "name": "550L EQ High-Mid Freq",
        "range": "800 Hz to 12.5 kHz",
        "defaultVal": "3 kHz",
        "description": "Selects active frequency for 550L EQ High-Mid band.",
        "type": "knob"
      },
      {
        "name": "550L EQ High-Mid Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls high-mid EQ gain.",
        "type": "knob"
      },
      {
        "name": "550L EQ Low-Mid Freq",
        "range": "75 Hz to 1 kHz",
        "defaultVal": "400 Hz",
        "description": "Selects active frequency for 550L EQ Low-Mid band.",
        "type": "knob"
      },
      {
        "name": "550L EQ Low-Mid Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-mid EQ gain.",
        "type": "knob"
      },
      {
        "name": "550L EQ Low Band Freq",
        "range": "30 Hz to 400 Hz",
        "defaultVal": "50 Hz",
        "description": "Selects active frequency for 550L EQ Low band.",
        "type": "knob"
      },
      {
        "name": "550L EQ Low Band Gain",
        "range": "-12 dB to +12 dB",
        "defaultVal": "0 dB",
        "description": "Controls low-band shelving or peaking EQ gain.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Engage the 'New' (Feed-Forward) or 'Old' (Feedback) switch on the 225L compressor. Use 'Old' for smooth, vintage-style leveling on vocals, and 'New' for hard-hitting, aggressive transient control on acoustic snare drums.",
      "The API 550L EQ is highly interactive and features proportional Q. Boost the 1.5 kHz or 3 kHz mid-range band by +2 to +4 dB on electric guitars to let them slice through a heavy rock mix with classic API grit.",
      "Use the 235L Gate in Expander ('EXP') mode for a highly musical, smooth drum gate. Set the threshold just below the head hits to cleanly attenuate background cymbal bleed without introducing harsh gating artifacts."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad api vision channel strip": \[/, '"uad api vision channel strip legacy": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

