const fs = require('fs');
let content = fs.readFileSync('src/i18n.ts', 'utf8');
let lines = content.split('\n');
let newLines = [];
let seenKeys = new Map();
let currentLang = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const langMatch = line.match(/^  '?([a-zA-Z-]+)'?: \{/);
  if (langMatch) {
    currentLang = langMatch[1];
    seenKeys.set(currentLang, new Set());
  }

  const match = line.match(/^\s*"([^"]+)"\s*:/);
  if (match && currentLang) {
    const key = match[1];
    if (seenKeys.get(currentLang).has(key)) {
      continue;
    }
    seenKeys.get(currentLang).add(key);
  }
  newLines.push(line);
}
fs.writeFileSync('src/i18n.ts', newLines.join('\n'));
