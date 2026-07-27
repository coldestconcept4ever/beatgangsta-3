import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

const replacement = `"uad antares auto-tune realtime": [
    {
      "name": "Hard Pitch T-Pain Style",
      "description": "Zero retune speed and zero humanize for maximum robotic pitch correction.",
      "settings": {
        "Input Type": 1,
        "Retune Speed": 0,
        "Humanize": 0,
        "Flex-Tune": 0,
        "Natural Vibrato": 0,
        "Key": 0,
        "Scale": 2,
        "Detune": 440,
        "Tracking": 50
      }
    },
    {
      "name": "Transparent Pop Vocal",
      "description": "Gentle pitch correction that allows natural expression and vibrato to pass through.",
      "settings": {
        "Input Type": 1,
        "Retune Speed": 40,
        "Humanize": 30,
        "Flex-Tune": 25,
        "Natural Vibrato": 0,
        "Key": 0,
        "Scale": 2,
        "Detune": 440,
        "Tracking": 50
      }
    }
  ],
  "uad antares auto-tune realtime x": [`;

content = content.replace(/"uad antares auto-tune realtime x": \[/, replacement);
fs.writeFileSync(DB_PATH, content, 'utf-8');
