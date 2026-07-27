import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

if (!content.includes('import { VST_DATABASE }')) {
  content = content.replace(
    /import \{ getSimplifiedJSFXDatabase \}/,
    `import { getSimplifiedJSFXDatabase }\nimport { VST_DATABASE } from '../data/vstDatabase';`
  );
}

const vstDiktat = `
  let vstDiktat = "";
  if (!isJsfxMode) {
    const activeVstDB = VST_DATABASE.filter(db => plugins.some(p => p.name.toLowerCase() === db.name.toLowerCase()));
    if (activeVstDB.length > 0) {
      vstDiktat = \`
      ==================================================
      🚨🚨 NON-UAD/NON-JSFX VST DATABASE DIRECTIVE 🚨🚨
      The user is utilizing the following specific VST plugins which have strict parameter maps defined in their database.
      When recommending settings for these plugins, YOU MUST strictly use the exact parameter names defined here:
      \${JSON.stringify(activeVstDB, null, 2)}
      
      SPECIAL NOTE ON BX_CONSOLE SSL 9000 J:
      If this plugin is used, it features "TMT Channel" emulation. If the user asks to emulate summing with it, or requests it on every track, ensure you assign a different, specific TMT Channel number (1-72) to each track's instance to create true analog variation and width.
      ==================================================
      \`;
    }
  }
`;

content = content.replace(
  /let lunaDiktat = "";/,
  `${vstDiktat}\n  let lunaDiktat = "";`
);

content = content.replace(
  /\$\{lunaDiktat\}/,
  `\${lunaDiktat}\n    \${vstDiktat}`
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
