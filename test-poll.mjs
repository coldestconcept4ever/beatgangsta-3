import * as fs from 'fs';
const typesStr = fs.readFileSync('node_modules/@google/genai/dist/index.d.ts', 'utf-8') 
                 + fs.readFileSync('node_modules/@google/genai/src/types.ts', 'utf-8');
console.log("Found matches for 'getFile':");
console.log(typesStr.split('\n').filter(l => l.toLowerCase().includes('get') && l.toLowerCase().includes('file')).join('\n'));
