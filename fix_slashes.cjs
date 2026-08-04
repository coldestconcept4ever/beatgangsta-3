const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// The things that were likely broken:
// nCRITICAL -> \nCRITICAL
content = content.replace(/nCRITICAL/g, "\\nCRITICAL");
content = content.replace(/join\('n'\)/g, "join('\\n')");
content = content.replace(/join\('n'/g, "join('\\n'");
content = content.replace(/join\("n"\)/g, "join('\\n')");
content = content.replace(/'n'/g, "'\\n'");

content = content.replace(/n"/g, "\\n\"");

fs.writeFileSync('src/services/geminiService.ts', content);
