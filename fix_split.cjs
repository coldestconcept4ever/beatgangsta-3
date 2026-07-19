const fs = require('fs');
let content = fs.readFileSync('temp_split.ts', 'utf8');

// replace the top part
content = content.replace(
  /if \(!fileName \|\| !uploads\[fileName\]\) \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: "File not found or upload incomplete" \}\);\s*\}/,
  `if (!fileName || !uploads[fileName]) {\n      return res.status(400).json({ error: "File not found or upload incomplete" });\n    }`
);

// We need to carefully insert the streaming keep-alive wrapper.
// The best way is to replace all `return res.status(XXX).json(...)` with `return res.end(JSON.stringify(...))`
// inside the try block, BUT we have to start the response only after early checks.

// early returns before we start streaming:
// lines with `return res.status(...)` up to `try {`
const beforeTryMatch = content.match(/([\s\S]*?try\s*\{)([\s\S]*)/);
if (beforeTryMatch) {
  let beforeTry = beforeTryMatch[1];
  let insideTry = beforeTryMatch[2];

  // Insert keep-alive
  beforeTry = beforeTry.replace(
    '    try {',
    `    res.writeHead(200, { "Content-Type": "application/json" });\n    const keepAliveInterval = setInterval(() => { res.write(" "); }, 15000);\n    try {`
  );

  // Replace all `return res.status(400).json(...)` or `return res.json(...)` inside `insideTry`
  insideTry = insideTry.replace(/return\s+res\.status\(\d+\)\.json\(([\s\S]*?)\);/g, 'res.write(JSON.stringify($1));\n        return res.end();');
  insideTry = insideTry.replace(/return\s+res\.json\(([\s\S]*?)\);/g, 'res.write(JSON.stringify($1));\n        return res.end();');
  
  // Also we need to wrap the catch block and add finally
  // find the final catch block in insideTry:
  // Since there might be nested try-catches, it's safer to just replace the very last `} catch (error: any) { ... }`
  // Actually, let's just do a string replacement on the end.
  const lastCatchMatch = insideTry.match(/(\s*\} catch \(error: any\) \{\s*[\s\S]*?return res\.status\(500\)\.json\([\s\S]*?\);\s*\})/);
  if (lastCatchMatch) {
    const originalLastCatch = lastCatchMatch[1];
    let newLastCatch = originalLastCatch.replace(/return\s+res\.status\(500\)\.json\(([\s\S]*?)\);/, 'res.write(JSON.stringify($1));\n      return res.end();');
    newLastCatch += '\n    } finally {\n      clearInterval(keepAliveInterval);\n    }';
    insideTry = insideTry.replace(originalLastCatch, newLastCatch);
  }

  content = beforeTry + insideTry;
}

fs.writeFileSync('temp_split.ts', content);
