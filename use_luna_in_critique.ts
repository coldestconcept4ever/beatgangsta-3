import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const lunaContextBlock = `
  let finalUserContext = userContext;
  if (dawType === 'LUNA') {
    if (lunaSumming !== 'off') {
      finalUserContext = finalUserContext + (finalUserContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the \${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.\`;
    }
    if (lunaTape !== 'off') {
      finalUserContext = finalUserContext + (finalUserContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the \${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.\`;
    }
  }

  const userContextStr = finalUserContext ? \`\\nCRITICAL USER CONTEXT/ISSUES: "\${finalUserContext}"\\nAddress these issues directly in your advice and plugin choices.\` : "";
`;

content = content.replace(
  /  const userContextStr = userContext \? `\\nCRITICAL USER CONTEXT\/ISSUES: "\$\{userContext\}"\\nAddress these issues directly in your advice and plugin choices.` : "";/,
  lunaContextBlock
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
