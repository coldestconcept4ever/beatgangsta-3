const fs = require('fs');
let content = fs.readFileSync('src/utils/safeParameterMapper.ts', 'utf-8');

const targetStr = "  const mappedSettings = plugin.deepDive.map((setting: ParameterSetting) => {\n    const paramLower = setting.parameter.toLowerCase();";

const replacementStr = `  const mappedSettings = plugin.deepDive.map((setting: ParameterSetting) => {
    const paramLower = setting.parameter.toLowerCase();

    // Fix Lurssen Push if it incorrectly uses dB
    if (pluginNameLower.includes('lurssen') && paramLower.includes('push')) {
      if (setting.value.toLowerCase().includes('db')) {
        setting.value = setting.value.replace(/([\\d.]+)\\s*db/i, (match, p1) => {
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
    }
`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/utils/safeParameterMapper.ts', content);
console.log("Patched Lurssen mapping");
