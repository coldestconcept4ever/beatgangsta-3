import fs from 'fs';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');

const regex = /"uad manley variable mu limiter": \[([\s\S]*?)\]/;
const match = pContent.match(regex);
if (match) {
  let inner = match[1];
  inner = inner.replace(/"Input Gain"/g, '"Input"');
  inner = inner.replace(/"Recovery \/ Release"/g, '"Recovery"');
  inner = inner.replace(/"Output Gain"/g, '"Output"');
  inner = inner.replace(/"HP Sidechain"/g, '"Sidechain HPF"');
  inner = inner.replace(/"Mode Select"/g, '"Compress/Limit"');
  
  pContent = pContent.replace(regex, `"uad manley variable mu limiter": [\n${inner}\n]`);
  fs.writeFileSync(PRESETS_PATH, pContent, 'utf-8');
}
