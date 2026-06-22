const fs = require('fs');
let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

const lines = srcCode.split('\n');
lines[10341] = '    ]';

fs.writeFileSync('src/data/jsfxResearch.ts', lines.join('\n'), 'utf8');
console.log('Fixed syntax error');
