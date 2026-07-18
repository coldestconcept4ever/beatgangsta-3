const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let line = 1;
let col = 1;

let parenCount = 0;
let braceCount = 0;
let bracketCount = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === '(') parenCount++;
  else if (char === ')') parenCount--;
  else if (char === '{') braceCount++;
  else if (char === '}') braceCount--;
  else if (char === '[') bracketCount++;
  else if (char === ']') bracketCount--;

  if (char === '\n') {
    line++;
    col = 1;
  } else {
    col++;
  }
}

console.log({parenCount, braceCount, bracketCount});
