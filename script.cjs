const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/services/geminiService.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/deepDive:\s*\{\s*type:\s*Type\.ARRAY,/g, 'deepDive: { type: Type.ARRAY, description: "MUST contain EXACTLY 10 parameters.",');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');