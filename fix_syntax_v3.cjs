const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// Fix the specifically observed unterminated string
srcCode = srcCode.replace(
  '     ",\n    "category": "Time & Modulation",',
  '      ],\n    "category": "Time & Modulation",'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error');
