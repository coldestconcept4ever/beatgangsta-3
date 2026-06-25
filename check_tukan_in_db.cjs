const fs = require('fs');

const code = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

// Let's count occurrences of "Tukan"
const regex = /"name"\s*:\s*"[^"]*Tukan[^"]*"/gi;
const matches = code.match(regex);
console.log(`Found ${matches ? matches.length : 0} plugins containing "Tukan" in jsfxResearch.ts`);

if (matches) {
  console.log('Sample of matches:');
  console.log(matches.slice(0, 20));
}
