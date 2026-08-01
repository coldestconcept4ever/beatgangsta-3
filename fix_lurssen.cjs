const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
const oldStr = "    2. STRICT UNIT ACCURACY: You MUST use the exact, correct unit of measurement for every parameter (e.g. Hz, kHz, dB, ms, %, etc.).";
const newStr = oldStr + "\n    - CRITICAL LURSSEN RULE: For \"IK Multimedia - Lurssen Mastering Console\", the \"Push\" parameter is measured in PERCENT (%) from 0% to 200%, NOT IN dB. If you suggest Push, NEVER use dB (e.g., say \"110%\", not \"1.2dB\").";

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Fixed Lurssen Push parameter rule");
