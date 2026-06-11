import fs from 'fs';
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');
code = code.replace(/"gemini-3\.5-flash"/g, '"gemini-3-flash-preview"');
code = code.replace(/"gemini-3\.5-pro"/g, '"gemini-3-flash-preview"');
code = code.replace(/"gemini-3\.1-pro-preview"/g, '"gemini-3-flash-preview"');
fs.writeFileSync('src/services/geminiService.ts', code);
