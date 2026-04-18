const fs = require('fs');
const path = './src/services/geminiService.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/BLOCK_NONE = "BLOCK_NONE"/g, 'OFF = "OFF"');
content = content.replace(/HarmBlockThreshold\.BLOCK_NONE/g, 'HarmBlockThreshold.OFF');
fs.writeFileSync(path, content);
console.log('Replaced BLOCK_NONE with OFF');
