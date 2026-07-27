import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad ep-34 tape echo"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad ep-34 tape echo",
    "displayName": "UAD EP-34 Tape Echo",
    "category": "Reverbs & Delays",
    "description": "A stellar emulation of vintage solid-state Echoplex tape delay processors. It faithfully captures the unique slide-out tape head delay adjustment, preamp-driven clipping, self-oscillation feedback loop behaviors, and warm, deteriorating repeats.",
    "hardwareModel": "Echoplex EP-3 / EP-4 Tape Delays",
    "parameters": [
      {
        "name": "Delay Time",
        "range": "80ms to 700ms",
        "defaultVal": "350ms",
        "description": "Sets delay time by sliding the virtual playback tape head along the path.",
        "type": "slider"
      },
      {
        "name": "Echo Repeats",
        "range": "0 to 10",
        "defaultVal": "3",
        "description": "Controls the feedback circuit, introducing wild self-oscillation at maximum settings.",
        "type": "knob"
      },
      {
        "name": "Record Volume",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Drives the preamplifier stage, introducing rich analog solid-state saturation to the delay path.",
        "type": "knob"
      },
      {
        "name": "Echo Mix",
        "range": "0% to 100%",
        "defaultVal": "30%",
        "description": "Balances the dry signal path against the wet, warm tape delay lines.",
        "type": "knob"
      },
      {
        "name": "Wow & Flutter",
        "range": "0 to 10",
        "defaultVal": "5",
        "description": "Introduces tape speed inconsistency and pitch modulation.",
        "type": "knob"
      },
      {
        "name": "Bass/Treble",
        "range": "-10 dB to +10 dB",
        "defaultVal": "0 dB",
        "description": "Tone-sculpting control to make the delay repeats sound darker or brighter.",
        "type": "knob"
      }
    ],
    "proTips": [
      "To produce vintage dub-style echo builds, map a MIDI controller to Echo Repeats, push it above 8 to trigger self-oscillation, then sweep the Echo Delay slider for pitch-bent effects.",
      "Turn Record Volume to 8 and lower the Output stage on lead guitar solos. This adds a sweet, saturated solid-state warmth that helps solos float effortlessly over a busy mix."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
