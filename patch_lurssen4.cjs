const fs = require('fs');
let content = fs.readFileSync('src/utils/safeParameterMapper.ts', 'utf-8');

const targetStr = `    // Fix Lurssen Push if it incorrectly uses dB
    if (pluginNameLower.includes('lurssen') && paramLower.includes('push')) {
      if (setting.value.toLowerCase().includes('db')) {
        setting.value = setting.value.replace(/([+-]?[\\d.]+)\\s*db/i, (match, p1) => {
          // If they say 1.2dB, they probably mean something small or they hallucinated a mapping.
          // In percent, it goes 0% to 200%. 1.2 isn't meaningful.
          // But let's just clean it to a percent format if they hallucinated a number, or just hardcode to something safe.
          const val = parseFloat(p1);
          return (val * 100) + "%"; 
        });
        if (!setting.value.includes('%')) {
            setting.value = setting.value.replace(/db/i, "%");
        }
      }
    }`;

const newStr = `    // Fix Lurssen parameters if they incorrectly use dB
    if (pluginNameLower.includes('lurssen') || paramLower.includes('push') || paramLower.includes('input drive')) {
      if (paramLower.includes('push') && setting.value.toLowerCase().includes('db')) {
        setting.value = setting.value.replace(/([+-]?[\\d.]+)\\s*db/i, (match, p1) => {
          const val = parseFloat(p1);
          return (val > 0 && val < 5 ? val * 100 : val) + "%"; 
        });
        setting.value = setting.value.replace(/db/ig, "%");
        setting.explanation = setting.explanation ? setting.explanation.replace(/([+-]?[\\d.]+)\\s*db/ig, (m, p1) => (parseFloat(p1) > 0 && parseFloat(p1) < 5 ? parseFloat(p1) * 100 : parseFloat(p1)) + "%") : "";
      }
      if (paramLower.includes('input drive') && setting.value.toLowerCase().includes('db')) {
        setting.value = setting.value.replace(/([+-]?[\\d.]+)\\s*db/i, "$1");
        setting.value = setting.value.replace(/db/ig, "");
        setting.explanation = setting.explanation ? setting.explanation.replace(/db/ig, "") : "";
      }
    }`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/utils/safeParameterMapper.ts', content);
console.log("Patched Lurssen mapping again");
