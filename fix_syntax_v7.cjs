const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// The line is:      ",
// It could be that the char is not a normal quote, or the whitespace is weird.
// Let's replace the whole faulty line with known good chars.
const lines = srcCode.split('\n');
lines[6594] = '      ],'; // Line 6595 (index 6594)

fs.writeFileSync('src/data/jsfxResearch.ts', lines.join('\n'), 'utf8');
console.log('Fixed syntax error by index');
