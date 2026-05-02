const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/RecipeCard.tsx',
  'src/components/CritiqueCard.tsx',
  'src/App.tsx',
  'src/components/Vault.tsx',
  'src/components/StatusPage.tsx',
  'src/services/geminiService.ts'
];

filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  if (file.includes('App.tsx')) {
    content = content.replace(/instrumentsToMigrate\.length/g, "instrumentsToMigrate?.length");
    content = content.replace(/hardwareToMigrate\.length/g, "hardwareToMigrate?.length");
  }

  if (file.includes('RecipeCard.tsx')) {
    content = content.replace(/res\.recommendedChain\.length/g, "res.recommendedChain?.length");
    content = content.replace(/recipe\.artistTypes\.length/g, "recipe.artistTypes?.length");
    content = content.replace(/track\.deepDive\.length/g, "track.deepDive?.length");
    content = content.replace(/track\.fxPlugins\.length/g, "track.fxPlugins?.length");
    content = content.replace(/layer\.deepDive\.length/g, "layer.deepDive?.length");
    content = content.replace(/layer\.fxPlugins\.length/g, "layer.fxPlugins?.length");
    content = content.replace(/recipe\.busses\.length/g, "recipe.busses?.length");
    content = content.replace(/recipe\.masterPlugins\.length/g, "recipe.masterPlugins?.length");
    content = content.replace(/recipe\.gangstaVox\.trackingChain\.aux1\.length/g, "recipe.gangstaVox.trackingChain.aux1?.length");
    content = content.replace(/recipe\.gangstaVox\.trackingChain\.aux2\.length/g, "recipe.gangstaVox.trackingChain.aux2?.length");
    content = content.replace(/\.aux1\.map\(/g, ".aux1?.map(");
    content = content.replace(/\.aux2\.map\(/g, ".aux2?.map(");
    content = content.replace(/\.layers\.map\(/g, ".layers?.map(");
    content = content.replace(/\.deepDive\.map\(/g, ".deepDive?.map(");
    content = content.replace(/\.inserts\.map\(/g, ".inserts?.map(");
  }

  if (file.includes('CritiqueCard.tsx')) {
    content = content.replace(/specificHelpResults\.length/g, "specificHelpResults?.length");
    content = content.replace(/result\.recommendedChain\.length/g, "result.recommendedChain?.length");
    content = content.replace(/action\.recommendedChain\.map\(/g, "action.recommendedChain?.map(");
    content = content.replace(/plugin\.deepDive\.length/g, "plugin.deepDive?.length");
    content = content.replace(/plugin\.deepDive\.map\(/g, "plugin.deepDive?.map(");
  }

  if (file.includes('geminiService.ts')) {
    // We already fixed geminiService's adapted.recipes inside postProcessResult!
    // But anyway...
    content = content.replace(/adapted\.recipes\.length/g, "adapted.recipes?.length");
    content = content.replace(/tools\.length/g, "tools?.length");
    content = content.replace(/batchResult\.length/g, "batchResult?.length");
    content = content.replace(/researchResults\.length/g, "researchResults?.length");
    content = content.replace(/finalBatch\.length/g, "finalBatch?.length");
    content = content.replace(/uploadedStems\.length/g, "uploadedStems?.length");
  }

  fs.writeFileSync(fullPath, content);
});
