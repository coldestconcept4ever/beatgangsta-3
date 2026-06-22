const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// I am manually inserting the missing bracket
const badSnippet = '     \n}';
const goodSnippet = '    ]\n}';

srcCode = srcCode.replace(badSnippet, goodSnippet);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax error by adding missing bracket directly');
