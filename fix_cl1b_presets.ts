import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

pContent = pContent.replace(/"Sidechain High Pass"/g, '"Sidechain Low Cut"');
fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
