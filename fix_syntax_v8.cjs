const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

srcCode = srcCode.replace(
  '     \n}',
  '    ]\n}'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error by adding missing bracket');
