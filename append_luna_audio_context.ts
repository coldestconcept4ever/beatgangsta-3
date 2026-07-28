import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const lunaAudioGenContextBlock = `
          if (dawType === 'LUNA') {
            if (lunaSumming !== 'off') {
              finalContext = finalContext + (finalContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the \${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.\`;
            }
            if (lunaTape !== 'off') {
              finalContext = finalContext + (finalContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the \${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.\`;
            }
          }
`;

content = content.replace(
  /          response = await getAudioBeatRecommendations\(\n            plugins,/g,
  lunaAudioGenContextBlock + '\n          response = await getAudioBeatRecommendations(\n            plugins,'
);

content = content.replace(
  /            response = await getAudioBeatRecommendations\(\n              plugins\.slice\(0, 30\),/g,
  lunaAudioGenContextBlock.replace(/          /g, '            ') + '\n            response = await getAudioBeatRecommendations(\n              plugins.slice(0, 30),'
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
