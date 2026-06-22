const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// Fix the unterminated string / array syntax issue
srcCode = srcCode.replace(
  '    "',
  '    ],\n  '
);
// This specific fix assumes the structure found in the view_file

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax errors');
