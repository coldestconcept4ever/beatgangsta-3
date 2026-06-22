const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// The line is 6595 (index 6594, 0-indexed)
const lines = srcCode.split('\n');
lines[6594] = '    ]'; // This inserts the ] before the brace at 6595 (line 6596)

fs.writeFileSync('src/data/jsfxResearch.ts', lines.join('\n'), 'utf8');
console.log('Fixed syntax error by inserting ] into correct line');
