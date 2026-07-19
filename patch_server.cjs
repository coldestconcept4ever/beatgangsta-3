const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
let newSplit = fs.readFileSync('temp_split.ts', 'utf8');

server = server.replace(/  app\.post\("\/api\/pdf\/split-analyse", async \(req, res\) => \{[\s\S]*?^  \}\);\n/m, newSplit + '\n');
fs.writeFileSync('server.ts', server);
