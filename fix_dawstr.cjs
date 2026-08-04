const fs = require('fs');

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const targetStr = `  let prompt = \`
    You are an expert audio engineer and producer.`;

const newStr = `  const dawStr = dawType ? \`\\nThe user is using \${dawType} as their DAW. Include specific instructions or tips for \${dawType} where relevant in the guides or recipes.\` : '';
  const starredStr = starredPlugins.length > 0 ? \`\\nCRITICAL MANDATORY INSTRUCTION: The user has STARRED (favorited) the following plugins:\\n\${starredPlugins.join(', ')}\\nYou ABSOLUTELY MUST include these starred plugins in EVERY SINGLE track's recommended chain. This is a non-negotiable hard requirement.\` : '';

  let prompt = \`
    You are an expert audio engineer and producer.`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/services/geminiService.ts', content);
  console.log("Patched!");
} else {
  console.log("Could not find target string.");
}
