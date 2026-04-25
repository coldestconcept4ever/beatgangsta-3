import fs from "fs";
const p = fs.readFileSync('node_modules/@google/genai/src/types.ts', 'utf-8');
console.log(p.split('\n').filter(l => l.includes('fileData')).join('\n'));
