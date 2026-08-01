import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// Function to replace plugin filtering in the functions
const filterStr = `  const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = filteredPlugins.slice(0, 50);`;

// Let's replace `const limitedPlugins = plugins.slice(0, 50);` with the new filter
content = content.replace(/const limitedPlugins = plugins\.slice\(0, 50\);/g, filterStr);

// Update starredStr across the file to be more strict
content = content.replace(
  /const starredStr = starredPlugins\.length > 0 \? `\\nCRITICAL: The user has STARRED \(favorited\) the following plugins\. You MUST prioritize using these plugins in your recipes whenever possible:\\n\$\{starredPlugins\.join\(', '\)\}` : '';/g,
  "const starredStr = starredPlugins.length > 0 ? `\\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track/step whenever possible:\\n${starredPlugins.join(', ')}` : '';"
);

// Specifically for getAlbumMasteringGuide
content = content.replace(
  /const dawStr = dawType \? `\\nThe user is using \$\{dawType\} as their DAW\. Include specific instructions or tips for \$\{dawType\} where relevant\.` : '';/g,
  `const dawStr = dawType ? \`\\nThe user is using \${dawType} as their DAW. Include specific instructions or tips for \${dawType} where relevant.\` : '';
  const starredStr = starredPlugins.length > 0 ? \`\\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track's mastering chain:\\n\${starredPlugins.join(', ')}\` : '';`
);

// Add starredStr into the getAlbumMasteringGuide prompt
content = content.replace(
  /Analog Hardware available:\n\s*\$\{hardwareListStr\}\n\s*\$\{dawStr\}/,
  `Analog Hardware available:
    \${hardwareListStr}
    
    \${dawStr}
    \${starredStr}`
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched geminiService.ts");
