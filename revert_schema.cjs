const fs = require('fs');

const path = 'src/services/geminiService.ts';
let content = fs.readFileSync(path, 'utf-8');

// Remove explanation: { type: Type.STRING } and formatting
content = content.replace(/explanation:\s*\{\s*type:\s*Type\.STRING\s*\}/g, '');

// Remove "explanation" from required arrays
content = content.replace(/,\s*"explanation"/g, '');
content = content.replace(/"explanation"\s*,/g, '');

// Clean up trailing/leading commas in properties because of removal
content = content.replace(/,\s*\}/g, ' }');
content = content.replace(/\{\s*,/g, '{ ');
// Remove blank lines with only spaces that might be left
content = content.replace(/,\s*\n\s*\n/g, ',\n');
content = content.replace(/\n\s*,\s*\n/g, ',\n');
content = content.replace(/,\s*\n\s*\}/g, '\n}');
content = content.replace(/,\s*\}/g, '\n}');

fs.writeFileSync(path, content);
console.log('Restoration script ran.');
