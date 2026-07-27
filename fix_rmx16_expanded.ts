import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

const regex = /"uad ams rmx16 expanded digital reverb": \[([\s\S]*?)\]/;
const match = pContent.match(regex);
if (match) {
  let inner = match[1];
  inner = inner.replace(/"Input Gain"/g, '"Input"');
  inner = inner.replace(/"Output Gain"/g, '"Output"');
  
  pContent = pContent.replace(regex, `"uad ams rmx16 expanded digital reverb": [\n${inner}\n]`);
  fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
}
