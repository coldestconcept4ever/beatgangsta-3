const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const targetStr = "    - CRITICAL LURSSEN RULE: For \"IK Multimedia - Lurssen Mastering Console\", the \"Push\" parameter is measured in PERCENT (%) from 0% to 200%, NOT IN dB. If you suggest Push, NEVER use dB (e.g., say \"110%\", not \"1.2dB\").";

const newStr = "    - CRITICAL LURSSEN RULE: For \"IK Multimedia - Lurssen Mastering Console\", the \"Push\" parameter is measured in PERCENT (%) from 0% to 100% or 0% to 200% (use % symbol ONLY), NOT IN dB. If you suggest Push, YOU MUST NEVER EVER USE dB. (e.g. \"110%\", \"120%\"). The \"Input Drive\" parameter is also just a number, not dB.";

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Fixed prompt");
