const fs = require('fs');
let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

const regex = /("?defaultVal"?:[^}]*})\s*\n\s*}\s*\n,\s*\n\s*{/g;
srcCode = srcCode.replace(regex, (match, p1) => {
  return p1 + '\n    ]\n  },\n  {';
});

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax errors');
