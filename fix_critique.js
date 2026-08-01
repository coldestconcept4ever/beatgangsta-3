const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
content = content.replace(/\$\{query\?\.toLowerCase\(\)\.includes\('guitar'\) \? "CRITICAL:.*?" : ""\}/g, "");
fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Fixed query error in getMixCritique");
