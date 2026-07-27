import fs from 'fs';

const DB_PATH = './src/data/uadDatabase.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const regex = /\{\s*"name":\s*"uad moog multimode filter collection"[\s\S]*?"Authorized for all devices"\s*\}/;

const replacement = `  {
    "name": "uad moog multimode filter collection",
    "displayName": "UAD Moog Multimode Filter Collection",
    "category": "Equalizers",
    "description": "The definitive analog ladder filter. Delivers the legendary rich, sweeping resonance, aggressive input-drive saturation, and high-performance LFO/Envelope modulations of Moog modules.",
    "hardwareModel": "Moog Music Multimode Filter System",
    "parameters": [
      {
        "name": "Drive",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Drives input signal into the ladder inputs, adding warm, fat harmonic distortion.",
        "type": "knob"
      },
      {
        "name": "Env Amount",
        "range": "-10 to +10",
        "defaultVal": "0",
        "description": "Modulates filter cutoff frequency using the input audio's dynamic amplitude envelope.",
        "type": "knob"
      },
      {
        "name": "Smooth / Fast",
        "range": "Smooth / Fast",
        "defaultVal": "Smooth",
        "description": "Selects the envelope follower response time.",
        "type": "select",
        "options": ["Smooth", "Fast"]
      },
      {
        "name": "Filter Cutoff",
        "range": "20 Hz to 20 kHz",
        "defaultVal": "1.0 kHz",
        "description": "Determines the corner frequency of the Moog transistor ladder filter.",
        "type": "knob"
      },
      {
        "name": "Resonance",
        "range": "0 to 10",
        "defaultVal": "2.0",
        "description": "Controls filter resonance peak. High values trigger absolute self-oscillation.",
        "type": "knob"
      },
      {
        "name": "Spacing",
        "range": "-1.0 to +1.0",
        "defaultVal": "0",
        "description": "Offsets the Cutoff frequency between the left and right channels for stereo widening.",
        "type": "knob"
      },
      {
        "name": "Poles",
        "range": "1 / 2 / 3 / 4",
        "defaultVal": "4",
        "description": "Selects the filter slope (6, 12, 18, or 24 dB/Oct).",
        "type": "select",
        "options": ["1", "2", "3", "4"]
      },
      {
        "name": "LFO Amount",
        "range": "0 to 10",
        "defaultVal": "0",
        "description": "Sets the depth of the LFO modulation on the Filter Cutoff.",
        "type": "knob"
      },
      {
        "name": "LFO Rate",
        "range": "0.01 Hz to 25 Hz / Sync",
        "defaultVal": "1.0 Hz",
        "description": "Controls the frequency speed of the low frequency oscillator.",
        "type": "knob"
      },
      {
        "name": "LFO Wave",
        "range": "Sine / Tri / Saw Up / Saw Dn / Square / Random",
        "defaultVal": "Sine",
        "description": "Selects the shape of the LFO modulation.",
        "type": "select",
        "options": ["Sine", "Tri", "Saw Up", "Saw Dn", "Square", "Random"]
      },
      {
        "name": "Mix",
        "range": "0% to 100%",
        "defaultVal": "100%",
        "description": "Blends the dry input signal with the filtered signal.",
        "type": "knob"
      },
      {
        "name": "Output",
        "range": "-20 dB to +20 dB",
        "defaultVal": "0 dB",
        "description": "Adjusts the final output gain to compensate for drive or resonance.",
        "type": "knob"
      }
    ],
    "proTips": [
      "Drive the 'Drive' knob past +10 dB to saturate the physical transistor ladder inputs, delivering a lush, gritty fuzz that beefs up virtual synths or live bass guitars.",
      "Set Resonance high to generate standard self-oscillation. Sweeping the Cutoff will yield classic space-age laser sound effects.",
      "Use the Spacing parameter on stereo tracks to offset the cutoff frequencies of the left and right channels, creating an incredibly wide stereo image from mono sources."
    ],
    "authorizationStatus": "Authorized for all devices"
  }`;

content = content.replace(regex, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
