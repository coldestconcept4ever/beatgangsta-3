const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// I'm tired of guessing. Let's find the closing brace that is missing a ]
// Replace faulty lines 6600-6602 or similar
srcCode = srcCode.replace(
  '      \n}',
  '    ]\n}'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error by adding missing bracket');
