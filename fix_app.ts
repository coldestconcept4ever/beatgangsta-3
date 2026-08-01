import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix 1: VSTPlugin initialization
content = content.replace(
  /const pluginToResearch: VSTPlugin = {\n\s*name: manualPluginName\.trim\(\),\n\s*vendor: manualPluginBrand\.trim\(\),\n\s*type: 'vst'\n\s*};/g,
  `const pluginToResearch: VSTPlugin = {
        name: manualPluginName.trim(),
        vendor: manualPluginBrand.trim(),
        type: 'vst',
        version: '',
        lastModified: 0
      };`
);

content = content.replace(
  /return \[\.\.\.prev, \{ name: manualPluginName\.trim\(\), vendor: manualPluginBrand\.trim\(\), type: 'vst' \}\];/g,
  `return [...prev, { name: manualPluginName.trim(), vendor: manualPluginBrand.trim(), type: 'vst', version: '', lastModified: 0 }];`
);

// Fix 2: stemsPhysicalMetrics type mismatch
content = content.replace(
  /stemsPhysicalMetrics,\s*combinedPhysicalMetrics,\s*dawType,\s*lunaSumming/g,
  `stemsPhysicalMetrics as any,
          combinedPhysicalMetrics as any,
          dawType,
          lunaSumming`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Fixed App.tsx types");
