import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

pContent = pContent.replace(/"Input"/g, '"Input Gain"');
pContent = pContent.replace(/"Recovery"/g, '"Recovery / Release"');
pContent = pContent.replace(/"Output"/g, '"Output Gain"');
pContent = pContent.replace(/"Sidechain HPF"/g, '"HP Sidechain"');
pContent = pContent.replace(/"Compress\/Limit"/g, '"Mode Select"');

fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
