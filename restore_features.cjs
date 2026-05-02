const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// 1. Restore explanation fields in Type.STRING schema objects
content = content.replace(
  /parameter: \{ type: Type\.STRING \},\s*value: \{ type: Type\.STRING \} \}/g,
  'parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } }'
);
content = content.replace(
  /parameter: \{\s*type: "STRING"\s*\},\s*value: \{\s*type: "STRING"\s*\}\s*\}/g,
  'parameter: { type: "STRING" }, value: { type: "STRING" }, explanation: { type: "STRING" } }'
);

// 2. Restore explanation in required arrays
content = content.replace(
  /required: \["parameter", "value"\]/g,
  'required: ["parameter", "value", "explanation"]'
);

// 3. Keep replacing AT LEAST parts if they match in the rest of the text
const deepDiveRegex = /provides the parameter settings/g;

content = content.replace(
  /description:\s*"Provide EVERY available parameter found on the actual plugin \(typically 40-70 for professional plugins\). Detail parameter name, value, and explanation. Be exhaustive and DO NOT be lazy.",/g,
  'description: "Provide EVERY available parameter found on the actual plugin (typically 40-70 for professional plugins). Detail parameter name, value, and explanation. Be exhaustive and DO NOT be lazy. AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",'
);

content = content.replace(
  /description:\s*"Provide EVERY available parameter found on the actual plugin. Detail parameter name, value, and explanation. Be exhaustive.",/g,
  'description: "Provide EVERY available parameter found on the actual plugin. Detail parameter name, value, and explanation. Be exhaustive. AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",'
);

content = content.replace(
  /with instruments/g,
  'with AT LEAST 3 DISTINCT "REAL" instruments'
);

// restore deep dives
content = content.replace(
  /Ensure every plugin in the vocalElements chain has in its deepDive/g,
  'Ensure every plugin in the vocalElements chain has AT LEAST 10 parameters in its deepDive (and up to 30 if it is a complex channel strip plugin).'
);

fs.writeFileSync('src/services/geminiService.ts', content);
console.log('Restoration complete');
