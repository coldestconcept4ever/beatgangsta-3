import fs from 'fs';

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/typically 40-70 for professional plugins/g, 'just however many it actually has');
content = content.replace(/typically 40-70 settings/g, 'just however many it actually has');
content = content.replace(/Aim for 40-80 settings for complex modules./g, '');
content = content.replace(/AT LEAST 10 parameter settings \(and up to 30 if it is a complex channel strip plugin\)\./g, '');

fs.writeFileSync(file, content);
console.log("Done");
