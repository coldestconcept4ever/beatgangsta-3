const fs = require('fs');
let geminiContent = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const badBlock = `  const isSpecialUser = userEmail === 'coldestconcept@gmail.com' || userEmail === 'recognizemiracles@gmail.com';
  let specialUserInstructions = '';
  if (isSpecialUser) {
    specialUserInstructions = \`
CRITICAL: The user will be using Lurssen Mastering Console and FabFilter Pro-Q 3 for every song on this album.
Their goal is for all the songs on the album to sound like they are on the same project (highly cohesive).
You MUST provide specific, actionable suggestions on how to use these two tools together effectively to achieve consistent, professional results across the entire album.
Example Workflow:
1. Use FabFilter Pro-Q 3 first for surgical EQ, track matching, and fixing resonances.
2. Use Lurssen Mastering Console last as the final analog "glue" to impart a unified tone and dynamic control.
Suggest consistent presets or workflows across the tracks.
\`;
  }

  let prompt = \``;

geminiContent = geminiContent.replace(badBlock, '  let prompt = `');

// now put it in the right place
const targetPromptSearch = '  let stemsContext = uploadedStems.map((stem, index) => {';
const newTargetBlock = `  const isSpecialUserAlbum = userEmail === 'coldestconcept@gmail.com' || userEmail === 'recognizemiracles@gmail.com';
  let specialUserInstructions = '';
  if (isSpecialUserAlbum) {
    specialUserInstructions = \`
CRITICAL: The user will be using Lurssen Mastering Console and FabFilter Pro-Q 3 for every song on this album.
Their goal is for all the songs on the album to sound like they are on the same project (highly cohesive).
You MUST provide specific, actionable suggestions on how to use these two tools together effectively to achieve consistent, professional results across the entire album.
Example Workflow:
1. Use FabFilter Pro-Q 3 first for surgical EQ, track matching, and fixing resonances.
2. Use Lurssen Mastering Console last as the final analog "glue" to impart a unified tone and dynamic control.
Suggest consistent presets or workflows across the tracks.
\`;
  }

  let stemsContext = uploadedStems.map((stem, index) => {`;

geminiContent = geminiContent.replace(targetPromptSearch, newTargetBlock);
fs.writeFileSync('src/services/geminiService.ts', geminiContent);
console.log("Fixed!");
