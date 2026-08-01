import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
content = content.replace(
  "import { VSTPlugin, Hardware, XpandPreset } from '../types';",
  "import { VSTPlugin, Hardware, XpandPreset, MixCritique } from '../types';"
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Fixed import");
