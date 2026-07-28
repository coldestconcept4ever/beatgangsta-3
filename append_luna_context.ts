import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const lunaContextBlock = `
      if (dawType === 'LUNA') {
        if (lunaSumming !== 'off') {
          fullContext += \`\\n\\nCRITICAL LUNA DIRECTIVE: The user has enabled \${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the \${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.\`;
        }
        if (lunaTape !== 'off') {
          fullContext += \`\\n\\nCRITICAL LUNA DIRECTIVE: The user has enabled \${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the \${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.\`;
        }
      }
`;

content = content.replace(
  /      if \(isJsfxMode\) \{/,
  lunaContextBlock + '      if (isJsfxMode) {'
);

const lunaGenContextBlock = `
    let finalGenerationContext = generationContext;
    if (dawType === 'LUNA') {
      if (lunaSumming !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the \${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.\`;
      }
      if (lunaTape !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\\n\\n" : "") + \`CRITICAL LUNA DIRECTIVE: The user has enabled \${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the \${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.\`;
      }
    }
`;

content = content.replace(
  /      const response = await getCustomBeatRecommendations\(plugins, typeBeatSearch.trim\(\), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n\.language, isMultiBandMode, generationBPM, generationContext, isJsfxMode, installedJsfxPacks, xpandPresets\);/,
  lunaGenContextBlock + '      const response = await getCustomBeatRecommendations(plugins, typeBeatSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);'
);

content = content.replace(
  /      const response = await getSongBeatRecommendations\(plugins, songSearch.trim\(\), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n\.language, isMultiBandMode, generationBPM, generationContext, isJsfxMode, installedJsfxPacks, xpandPresets\);/,
  lunaGenContextBlock + '      const response = await getSongBeatRecommendations(plugins, songSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);'
);

content = content.replace(
  /      const response = await getBeatRecommendations\(plugins, analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n\.language, isMultiBandMode, generationBPM, generationContext, isJsfxMode, installedJsfxPacks, xpandPresets\);/,
  lunaGenContextBlock + '      const response = await getBeatRecommendations(plugins, analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);'
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
