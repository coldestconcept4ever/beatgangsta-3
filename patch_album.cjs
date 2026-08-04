const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
const searchStr = `critique = await getAlbumMasteringGuide(
          activePlugins,
          fullContext,
          i18n.language,
          uploadedStems,
          analogInstruments,
          analogHardware,
          starredPlugins,
          stemsPhysicalMetrics as any,
          combinedPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape
        );`;
const replaceStr = `critique = await getAlbumMasteringGuide(
          activePlugins,
          fullContext,
          i18n.language,
          uploadedStems,
          analogInstruments,
          analogHardware,
          starredPlugins,
          stemsPhysicalMetrics as any,
          combinedPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape,
          user?.email
        );`;

if(appContent.includes(searchStr)) {
  appContent = appContent.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Patched App.tsx");
} else {
  console.log("Could not find getAlbumMasteringGuide call in App.tsx");
}

// Patch geminiService.ts
let geminiContent = fs.readFileSync('src/services/geminiService.ts', 'utf8');
const geminiSearchStr = `lunaSumming: string = 'off',
  lunaTape: string = 'off'
): Promise<any> => {`;
const geminiReplaceStr = `lunaSumming: string = 'off',
  lunaTape: string = 'off',
  userEmail: string | null | undefined = null
): Promise<any> => {`;

if(geminiContent.includes(geminiSearchStr)) {
  geminiContent = geminiContent.replace(geminiSearchStr, geminiReplaceStr);
  
  const promptSearchStr = 'let prompt = `';
  const promptReplaceStr = `
  const isSpecialUser = userEmail === 'coldestconcept@gmail.com' || userEmail === 'recognizemiracles@gmail.com';
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
  
  geminiContent = geminiContent.replace(promptSearchStr, promptReplaceStr);
  
  const insertContextStr = 'User Context / Album Vibe: "${userContext}"';
  const insertContextReplaceStr = 'User Context / Album Vibe: "${userContext}"\n    ${specialUserInstructions}';
  
  geminiContent = geminiContent.replace(insertContextStr, insertContextReplaceStr);
  
  fs.writeFileSync('src/services/geminiService.ts', geminiContent);
  console.log("Patched geminiService.ts");
} else {
  console.log("Could not find getAlbumMasteringGuide signature in geminiService.ts");
}
