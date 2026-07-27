import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad thermionic culture vulture distortion"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad thermionic culture vulture distortion",
    "displayName": "UAD Thermionic Culture Vulture Distortion",
    "category": "Tape & Saturation",
    "description": "The Thermionic Culture Vulture is an authentic emulation of the highly prized, dual-channel all-valve distortion/saturation processor. Famous for injecting glorious vintage tube character, from subtle warming second harmonics to extreme triode/pentode square-wave clipping, it excels on acoustic drums, electronic loops, aggressive bass lines, and master busses.",
    "hardwareModel": "Thermionic Culture Vulture Dual-Channel Valve Distortion",
    "parameters": [
      {
        "name": "Drive",
        "range": "1 to 11",
        "defaultVal": "1",
        "description": "Increases preamp drive and gain to push the vacuum tubes into overdrive.",
        "type": "knob"
      },
      {
        "name": "Function Select",
        "range": "Triode / Pentode 1 / Pentode 2",
        "defaultVal": "Triode",
        "description": "Changes the tube operational mode and even/odd harmonic distortion curves.",
        "type": "select",
        "options": [
          "Triode",
          "Pentode 1",
          "Pentode 2"
        ]
      },
      {
        "name": "Bias",
        "range": "0.15 mA to 1.0 mA",
        "defaultVal": "0.3 mA",
        "description": "Controls the current through the valve, changing the texture from gated fizz to open crunch.",
        "type": "knob"
      },
      {
        "name": "Overdrive",
        "range": "Normal / Overdrive",
        "defaultVal": "Normal",
        "description": "Engages an aggressive front-end boost to force the unit into severe saturation.",
        "type": "switch",
        "options": [
          "Normal",
          "Overdrive"
        ]
      },
      {
        "name": "Low Pass Filter",
        "range": "Off / 6 kHz / 9 kHz",
        "defaultVal": "Off",
        "description": "A high-frequency roll-off filter to smooth out harsh top-end artifacts.",
        "type": "select",
        "options": [
          "Off",
          "6 kHz",
          "9 kHz"
        ]
      },
      {
        "name": "Output Level",
        "range": "0 to 10",
        "defaultVal": "10",
        "description": "Sets the final output level of the channel.",
        "type": "knob"
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends the processed wet signal with the dry input signal.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To glue and warm up a drum bus, select Triode ('T') mode, set Bias around 0.3mA, and gently push the Drive until the meters flicker on peaks. This adds rich second-harmonic distortion without destroying transient snap.",
      "For aggressive bass grit, switch the Function Select to Pentode 1 ('P1'), turn on the Overdrive switch, and back off the Bias below 0.2mA to starve the valves, introducing an asymmetric, gated fuzz tone.",
      "Use it as a parallel effect on lead vocals: set the mode to 'T' with high Drive, engage the 9 kHz Low Pass filter to tame harsh sibilance, and blend it in at 10-15% wet to add density and mid-range cut."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
pContent = pContent.replace(/"uad thermionic culture vulture": \[/, '"uad thermionic culture vulture distortion": [');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');

