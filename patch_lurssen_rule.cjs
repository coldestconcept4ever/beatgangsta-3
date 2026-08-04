const fs = require('fs');

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const targetStr = `    - CRITICAL LURSSEN RULE: For "IK Multimedia - Lurssen Mastering Console", the "Push" parameter is measured in PERCENT (%) from 0% to 100% or 0% to 200% (use % symbol ONLY), NOT IN dB. If you suggest Push, YOU MUST NEVER EVER USE dB. (e.g. "110%", "120%"). The "Input Drive" parameter is also just a number, not dB.`;

const newStr = `    - CRITICAL LURSSEN RULE: For "IK Multimedia - Lurssen Mastering Console", the "Push" parameter is measured in INTEGER PERCENTAGES (%) (use % symbol ONLY), NOT IN dB. If you suggest Push, YOU MUST NEVER EVER USE dB or decimals. (e.g. "110%", "120%"). NO FRACTIONS OR DECIMALS ALLOWED (e.g. NO 1.5%), ONLY WHOLE NUMBERS. The "Input Drive" parameter is also just a number, not dB. The exact controls available on Lurssen Mastering Console that you must provide settings for are: 1. Input Drive, 2. 5 Band EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz - adjust these in dB), 3. Push (Integer Percentage), 4. Style / Genre Preset.`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/services/geminiService.ts', content);
  console.log("Patched!");
} else {
  console.log("Could not find target string.");
}
