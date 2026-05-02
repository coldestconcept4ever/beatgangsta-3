const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
content = content.replace(/description: "AT LEAST 10 parameter settings \(and up to 30 if it is a complex channel strip plugin\)\.",/g, '');
content = content.replace(/ Ensure every plugin in the vocalElements chain has AT LEAST 10 parameters in its deepDive \(and up to 30 if it is a complex channel strip plugin\)\./g, '');
content = content.replace(/ \(AT LEAST 10 parameters per plugin, and up to 30 if it is a complex channel strip plugin\)/g, '');
content = content.replace(/with AT LEAST 3 DISTINCT "REAL" instruments/g, 'with instruments');
content = content.replace(/\n\s*\n/g, '\n');
fs.writeFileSync('src/services/geminiService.ts', content);
console.log('Done');
