const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: lastModified: 0 -> lastModified: ''
content = content.replace(
/lastModified: 0/g,
"lastModified: ''"
);

// Fix 2: the getMixCritique signature changed and has too many arguments now in the 'else' block
const searchStr = `        critique = await getMixCritique(
          activePlugins, 
          null, 
          null, 
          'audio/mpeg', 
          isGangstaVox, 
          true, 
          fullContext, 
          null, 
          finalReferenceTrack, 
          referenceAudioBase64, 
          null, 
          referenceGeminiFileUri, 
          i18n.language, 
          uploadedStems, 
          analogInstruments, 
          analogHardware, 
          isBusMode, 
          isMultiBandMode, 
          isMasterMode, 
          isJsfxMode, 
          installedJsfxPacks, 
          starredPlugins,
          stemsPhysicalMetrics as any,
          combinedPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape
        );`;

const replaceStr = `        critique = await getMixCritique(
          activePlugins, 
          null, 
          null, 
          'audio/mpeg', 
          isGangstaVox, 
          true, 
          fullContext, 
          null, 
          finalReferenceTrack, 
          referenceAudioBase64, 
          null, 
          referenceGeminiFileUri, 
          i18n.language, 
          uploadedStems, 
          analogInstruments, 
          analogHardware, 
          isBusMode, 
          isMultiBandMode, 
          isMasterMode, 
          isJsfxMode, 
          installedJsfxPacks, 
          starredPlugins,
          undefined,
          undefined,
          stemsPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape
        );`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    console.log("Patched getMixCritique (1/2)");
}

const searchStr2 = `        const critique = await getMixCritique(
          activePlugins, 
          audioBase64, 
          audioUrl, 
          mimeType, 
          isGangstaVox, 
          hasStems, 
          fullContext, 
          null, 
          finalReferenceTrack, 
          referenceAudioBase64, 
          geminiFileUri, 
          referenceGeminiFileUri, 
          i18n.language, 
          undefined, 
          analogInstruments, 
          analogHardware, 
          isBusMode, 
          isMultiBandMode, 
          isMasterMode, 
          isJsfxMode, 
          installedJsfxPacks, 
          starredPlugins,
          physicalMetrics as any,
          referencePhysicalMetrics as any,
          undefined,
          dawType,
          lunaSumming,
          lunaTape
        );`;

// actually this might not be exactly how it's formatted. Let's just fix it with AST or more robust regex, or sed.
fs.writeFileSync('src/App.tsx', content);
console.log("Applied generic string replaces.");
