const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');
lines[8484] = '                  {audioMode !== \'critique\' && (';
code = lines.join('\n');
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Fixed line 8485');
