const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// I'm convinced the issue is the invisible characters or specific encoding.
// Replace the entire faulty line 6595 with a clean array close.
srcCode = srcCode.replace(
  '     ",\n    "category":',
  '      ],\n    "category":'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error');
