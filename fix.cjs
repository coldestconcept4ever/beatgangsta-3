const fs = require('fs');
let text = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const regex = /const ELITE_PRODUCER_SECRETS_PROMPT = `([\s\S]*?)`;/;
const match = text.match(regex);
if (match) {
  let content = match[1];
  // Remove all current backslash escapes for backticks
  content = content.replace(/\\`/g, '`');
  // Now escape all backticks
  content = content.replace(/`/g, '\\`');
  text = text.replace(regex, 'const ELITE_PRODUCER_SECRETS_PROMPT = `\n' + content + '`;');
  fs.writeFileSync('src/services/geminiService.ts', text);
  console.log('Fixed backticks for real');
} else {
  console.log('Not found');
}
