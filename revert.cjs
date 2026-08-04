const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

content = content.split("vocalChain: parsed.vocalChain ? applySafeParameterMappingToChain(parsed.vocalChain, undefined, false) : []").join("");

// Now fix the actual vocalChain safely!
content = content.replace(/vocalChain: parsed\.vocalChain \|\| \[\]/g, "vocalChain: parsed.vocalChain ? applySafeParameterMappingToChain(parsed.vocalChain, undefined, false) : []");

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Reverted and fixed correctly.");
