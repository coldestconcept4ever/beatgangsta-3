import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update import
content = content.replace(
  "import { getBeatRecommendations, getCustomBeatRecommendations, getSongBeatRecommendations, getAudioBeatRecommendations, enrichPluginLibrary, validateApiKey, detectAPITier, replicateRecipeWithUserGear, getMixCritique, researchPluginParameters, verifyAndCorrectPlugin, ThinkingLevel } from './services/geminiService';",
  "import { getBeatRecommendations, getCustomBeatRecommendations, getSongBeatRecommendations, getAudioBeatRecommendations, enrichPluginLibrary, validateApiKey, detectAPITier, replicateRecipeWithUserGear, getMixCritique, researchPluginParameters, verifyAndCorrectPlugin, ThinkingLevel, getAlbumMasteringGuide } from './services/geminiService';"
);

const albumMasteringCall = `      let critique;
      if (audioMode === 'album') {
        critique = await getAlbumMasteringGuide(
          activePlugins,
          fullContext,
          i18n.language,
          uploadedStems,
          analogInstruments,
          analogHardware,
          starredPlugins,
          stemsPhysicalMetrics,
          combinedPhysicalMetrics,
          dawType,
          lunaSumming,
          lunaTape
        );
      } else {
        critique = await getMixCritique(
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
          stemsPhysicalMetrics,
          combinedPhysicalMetrics,
          dawType,
          lunaSumming,
          lunaTape
        );
      }`;

let startIdx = content.indexOf('const critique = await getMixCritique(', content.indexOf('const handleStemsSearch = async () => {'));
let endIdx = content.indexOf(');', startIdx) + 2;

if (startIdx !== -1) {
    let replacement = albumMasteringCall;
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
}

// Receipt string for album mastering
content = content.replace(
    /logReceipt\('Stems Mix Critique', stemCost\);/,
    "logReceipt(audioMode === 'album' ? 'Album Mastering Analysis' : 'Stems Mix Critique', stemCost);"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched App.tsx");
