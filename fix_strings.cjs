const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

content = content.replace(/type: "STRING"/g, 'type: "string"');
content = content.replace(/type: "ARRAY"/g, 'type: "array"');
content = content.replace(/type: "OBJECT"/g, 'type: "object"');

fs.writeFileSync('src/services/geminiService.ts', content);
console.log('Fixed hardcoded string types to lowercase');
