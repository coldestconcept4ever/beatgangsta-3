const fs = require('fs');
let content = fs.readFileSync('src/utils/safeParameterMapper.ts', 'utf-8');

content = content.replace(/\\(\[\\\\d\\.\\\]\\+\\)\\s\\*db/gi, "([+-]?[\\\\d.]+)\\\\s*db");

fs.writeFileSync('src/utils/safeParameterMapper.ts', content);
console.log("Patched regex");
