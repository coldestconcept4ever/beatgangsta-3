const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// The lines 6601 are empty. I need to insert a ] at line 6601.
const lines = srcCode.split('\n');
lines[6600] = '    ]'; 

fs.writeFileSync('src/data/jsfxResearch.ts', lines.join('\n'), 'utf8');
console.log('Fixed syntax error by adding missing bracket');
