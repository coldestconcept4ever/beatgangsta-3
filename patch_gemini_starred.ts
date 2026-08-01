import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const replacementStr = `  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);`;

content = content.replace(/const limitedPlugins = filteredPlugins\.slice\(0, 50\);/g, replacementStr);

const replacementStr2 = `  const limitedPlugins = [
    ...plugins.filter(p => starredPlugins.includes(p.name)),
    ...plugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);`;

content = content.replace(/const limitedPlugins = plugins\.slice\(0, 50\);/g, replacementStr2);


fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched starred logic");
