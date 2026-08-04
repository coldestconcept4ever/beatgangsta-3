const fs = require('fs');

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const targetStr = `1. Use FabFilter Pro-Q 3 first for surgical EQ, track matching, and fixing resonances.
2. Use Lurssen Mastering Console last as the final analog "glue" to impart a unified tone and dynamic control.
Suggest consistent presets or workflows across the tracks.`;

const newStr = `1. Use FabFilter Pro-Q 3 first for surgical EQ, track matching, and fixing resonances.
2. Use Lurssen Mastering Console last as the final analog "glue" to impart a unified tone and dynamic control.
Suggest consistent presets or workflows across the tracks.

For Lurssen Mastering Console, you MUST provide explicit settings for ALL available controls for EACH track:
1. Input Drive (number, e.g. 2.0)
2. 5 Band EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz - adjust these in dB)
3. Push (measured in INTEGER PERCENTAGES ONLY, e.g. "110%", "120%". NO FRACTIONS OR DECIMALS like 1.5%, ONLY WHOLE NUMBERS)
4. Style / Genre Preset`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/services/geminiService.ts', content);
  console.log("Patched!");
} else {
  console.log("Could not find target string.");
}
