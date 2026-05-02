const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// I'll make sure to get all the constraints back.
content = content.replace(
  /deep dives \(EVERY available parameter per plugin/g,
  'deep dives (AT LEAST 10 parameters per plugin, and up to 30 if it is a complex channel strip plugin) (EVERY available parameter per plugin'
);

content = content.replace(
  /list of all parameters \(typically 20-50 settings\)\./g,
  'list of all parameters (typically 20-50 settings). Ensure every plugin in the vocalElements chain has AT LEAST 10 parameters in its deepDive (and up to 30 if it is a complex channel strip plugin).'
);
content = content.replace(
  /list of all parameters \(typically 25-50 settings\)\./g,
  'list of all parameters (typically 25-50 settings). Ensure every plugin in the vocalElements chain has AT LEAST 10 parameters in its deepDive (and up to 30 if it is a complex channel strip plugin).'
);

fs.writeFileSync('src/services/geminiService.ts', content);
console.log('Restoration complete part 2');
