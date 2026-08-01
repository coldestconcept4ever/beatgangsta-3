import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const filterStr = `  const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => {`;

content = content.replace(
  /const isStudioOne = dawType\?\.toLowerCase\(\)\.includes\('studio one'\);\n\s*const filteredPlugins = plugins\.filter\(p => \{\n\s*if \(!isStudioOne && \(p\.vendor\.toLowerCase\(\)\.includes\('presonus'\) \|\| p\.name\.toLowerCase\(\)\.includes\('presonus'\)\)\) \{\n\s*return false;\n\s*\}\n\s*return true;\n\s*\}\);\n\s*const pluginListStr = filteredPlugins\.map\(p => \{/g,
  filterStr
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched getMixCritique starred");
