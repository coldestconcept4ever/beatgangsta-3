const fs = require('fs');

const content = fs.readFileSync('src/i18n.ts', 'utf8');

let lines = content.split('\n');
let currentLang = null;
let seenKeys = new Set();
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  let langMatch = line.match(/^\s*([a-z]{2}):\s*\{\s*$/);
  if (langMatch) {
    currentLang = langMatch[1];
    seenKeys = new Set();
    newLines.push(line);
    continue;
  }
  
  if (line.match(/^\s*translation:\s*\{\s*$/)) {
    newLines.push(line);
    continue;
  }
  
  let keyMatch = line.match(/^\s*"([^"]+)":/);
  if (keyMatch && currentLang) {
    let key = keyMatch[1];
    if (seenKeys.has(key)) {
      console.log(`Removing duplicate key "${key}" in language "${currentLang}" at line ${i + 1}`);
      continue;
    } else {
      seenKeys.add(key);
      newLines.push(line);
    }
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync('src/i18n.ts', newLines.join('\n'));
