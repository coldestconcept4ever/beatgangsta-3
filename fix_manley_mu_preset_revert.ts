import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

// I replaced globally, I need to restore them back globally, then apply specifically.
pContent = pContent.replace(/"Input"/g, '"Input Gain"');
pContent = pContent.replace(/"Recovery"/g, '"Recovery / Release"');
pContent = pContent.replace(/"Output"/g, '"Output Gain"');
pContent = pContent.replace(/"Sidechain HPF"/g, '"HP Sidechain"');
pContent = pContent.replace(/"Compress\/Limit"/g, '"Mode Select"');

// Wait, by doing this, I might break other things that legitimately had "Input", "Recovery", "Output", etc.
// Let's do it carefully.
