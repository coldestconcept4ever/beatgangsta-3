const fs = require('fs');
const out = fs.readFileSync('out.txt', 'utf8');
const lines = out.split('\n').filter(l => l.startsWith('desc:'));
console.log(`Found ${lines.length} descs.`);
console.log(lines.slice(0, 30).join('\n'));
