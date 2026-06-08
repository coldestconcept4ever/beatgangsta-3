import fs from 'fs';

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\$\{RC20_SPEC_PROMPT\}/g, '${RC20_SPEC_PROMPT}\n    ${ATR102_SPEC_PROMPT}');

fs.writeFileSync(file, content);
console.log('done replacing');
