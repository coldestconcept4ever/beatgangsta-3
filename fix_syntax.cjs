const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

srcCode = srcCode.replace(
  '{"index":7,"name":"Trigger Align","min":-5,"max":5,"defaultVal":1,"unit":"ms"}\n    \n}',
  '{"index":7,"name":"Trigger Align","min":-5,"max":5,"defaultVal":1,"unit":"ms"}\n    ]\n}'
);

srcCode = srcCode.replace(
  '{"index":3,"name":"Manual Gain","min":-20,"max":20,"defaultVal":0}\n    \n}',
  '{"index":3,"name":"Manual Gain","min":-20,"max":20,"defaultVal":0}\n    ]\n}'
);

srcCode = srcCode.replace(
  '{"index":3,"name":"Channel Mode","min":0,"max":2,"defaultVal":0}\n    \n}',
  '{"index":3,"name":"Channel Mode","min":0,"max":2,"defaultVal":0}\n    ]\n}'
);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed syntax errors');
