import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

content = content.replace(/responseSchema: \(typeof chunkSchema !== "undefined" \? chunkSchema : \(typeof schema !== "undefined" \? schema : undefined\)\)/g, 'responseSchema: undefined');

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Done");
