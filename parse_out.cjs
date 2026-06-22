const fs = require('fs');

const content = fs.readFileSync('out.txt', 'utf-8');

const plugins = [];
let currentPlugin = null;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('desc:')) {
    if (currentPlugin && currentPlugin.desc1 && line !== 'desc:' + currentPlugin.desc1) {
      if (!currentPlugin.desc2) {
        currentPlugin.desc2 = line.substring(5).trim();
      } else {
        plugins.push(currentPlugin);
        currentPlugin = { desc1: line.substring(5).trim(), sliders: [] };
      }
    } else if (!currentPlugin) {
      currentPlugin = { desc1: line.substring(5).trim(), sliders: [] };
    }
  } else if (line.startsWith('//tags:')) {
    if (currentPlugin) currentPlugin.tags = line.substring(7).trim();
  } else if (line.startsWith('//author:')) {
    if (currentPlugin) currentPlugin.author = line.substring(9).trim();
  } else if (line.startsWith('slider')) {
    if (currentPlugin) {
      currentPlugin.sliders.push(line);
    }
  }
}
if (currentPlugin) {
  plugins.push(currentPlugin);
}

console.log(`Found ${plugins.length} plugins.`);
console.dir(plugins.slice(0, 3), { depth: null });
fs.writeFileSync('plugins_raw.json', JSON.stringify(plugins, null, 2));
