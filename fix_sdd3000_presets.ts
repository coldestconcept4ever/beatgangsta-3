import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const oldPresets = `"uad korg sdd-3000 digital delay": [
    {
      "name": "The Edge Dotted Eighths",
      "description": "The definitive rhythmic digital delay configuration with moderate triangle modulation, high feedback, and low-end filtering.",
      "settings": {
        "Input Level": 64,
        "Input Attenuator": 65,
        "Delay Time": 75,
        "Feedback": 45,
        "Filter High Cut": 50,
        "Filter Low Cut": 25,
        "Mod Waveform": 32,
        "Mod Frequency": 12,
        "Mod Intensity": 25
      }
    },
    {
      "name": "Retro Slapback Drive",
      "description": "Short slapback delay with the input level pushed hard to saturate the preamplifier, adding grit and thickness to guitar lines.",
      "settings": {
        "Input Level": 0,
        "Input Attenuator": 80,
        "Delay Time": 24,
        "Feedback": 15,
        "Filter High Cut": 0,
        "Filter Low Cut": 0,
        "Mod Waveform": 0,
        "Mod Frequency": 4,
        "Mod Intensity": 10
      }
    }
  ]`;

const newPresets = `"uad korg sdd-3000 digital delay": [
    {
      "name": "The Edge Dotted Eighths",
      "description": "The definitive rhythmic digital delay configuration with moderate triangle modulation, high feedback, and low-end filtering.",
      "settings": {
        "Input Attenuator": 1,
        "Input Level": 6.5,
        "Delay Time": 380,
        "Feedback": 4.5,
        "Filter Low Cut": 1,
        "Filter High Cut": 1,
        "Mod Waveform": 0,
        "Mod Frequency": 1.2,
        "Mod Intensity": 2.5,
        "Hold": 0,
        "Output Attenuator": 1,
        "Balance": 0,
        "Mode": 0
      }
    },
    {
      "name": "Retro Slapback Drive",
      "description": "Short slapback delay with the input level pushed hard to saturate the preamplifier, adding grit and thickness to guitar lines.",
      "settings": {
        "Input Attenuator": 0,
        "Input Level": 8,
        "Delay Time": 120,
        "Feedback": 1.5,
        "Filter Low Cut": 0,
        "Filter High Cut": 0,
        "Mod Waveform": 0,
        "Mod Frequency": 0.4,
        "Mod Intensity": 1,
        "Hold": 0,
        "Output Attenuator": 1,
        "Balance": 0,
        "Mode": 0
      }
    }
  ]`;

content = content.replace(oldPresets, newPresets);
fs.writeFileSync(DB_PATH, content, 'utf-8');
