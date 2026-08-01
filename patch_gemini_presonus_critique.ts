import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const filterStr = `  const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const pluginListStr = filteredPlugins.map(p => {`;

content = content.replace(
  /const pluginListStr = plugins\.map\(p => \{/g,
  filterStr
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched getMixCritique");
