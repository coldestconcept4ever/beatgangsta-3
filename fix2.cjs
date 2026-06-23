const fs = require('fs');
let code = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf8');
console.log(code.slice(0, 100));

