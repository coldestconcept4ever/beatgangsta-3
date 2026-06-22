const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// The line is:      ",
// It should be:      ],
srcCode = srcCode.replace(
  '     ",\n    "category":',
  '      ],\n    "category":'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error via regex finally hopefully');
