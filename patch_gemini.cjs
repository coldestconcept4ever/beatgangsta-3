const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const targetStr = `function postProcessResult(result: any) {`;

const newStr = `function postProcessResult(result: any) {
  const processChain = (chain: any[]) => {
    if (!chain || !Array.isArray(chain)) return chain;
    try {
      return applySafeParameterMappingToChain(chain, undefined, false);
    } catch (e) {
      console.warn("Error applying safe param mapping:", e);
      return chain;
    }
  };
`;

content = content.replace(targetStr, newStr);

const targetStr2 = `  const processRecipe = (recipe: any) => {`;

const newStr2 = `  const processRecipe = (recipe: any) => {
    if (recipe && recipe.instruments && Array.isArray(recipe.instruments)) {
      recipe.instruments.forEach((inst: any) => {
        if (inst && Array.isArray(inst.fxPlugins)) {
          inst.fxPlugins = processChain(inst.fxPlugins);
        }
      });
    }
    if (recipe && recipe.busses && Array.isArray(recipe.busses)) {
      recipe.busses.forEach((bus: any) => {
        if (bus && Array.isArray(bus.fxPlugins)) {
          bus.fxPlugins = processChain(bus.fxPlugins);
        }
      });
    }
`;

content = content.replace(targetStr2, newStr2);

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Patched postProcessResult in geminiService.ts");
