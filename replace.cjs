const fs = require('fs');
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');
const search = `const klevgrandStr = isMultibandMode ? \\\`
MULTIBAND PARALLEL PROCESSING INSTRUCTION:
The user has enabled "Multiband Mode". Consider incorporating advanced multi-band parallel processing ONLY IF it genuinely helps achieve the requested sound (e.g. specialized multiband saturation, intricate frequency-targeted delay/reverb, or precise multiband widening). Do NOT force it if standard EQ/processing is better suited for the style!
- Analyze the user's plugin list (or DAW native tools like Reaper's ReaEQ/ReaXcomp/Sends, or T-RackS Quad series, Klevgrand Gaffel, etc.) to figure out the best way to split the signal into frequency bands.
- If applicable, choose 1, 2, or 3 critical channels where band-splitting makes sense for the requested style.
- First, explicitly add a 'Plugin' bubble in the fxPlugins list describing the crossover/routing method (e.g., "DAW Routing Multiband Split", "ReaEQ Band Split", or "T-RackS Quad Comp"), and provide a detailed guide in its 'deepDive' explaining EXACTLY how the user should route and split the frequencies.
- Then, list the subsequent processing plugins, setting the 'band' property on each fxPlugin (e.g., "Low", "Mid", "High") to explicitly indicate which frequency split it is processing.
- Provide tailored parameter settings in the 'deepDive' for the plugins on each individual band to explain the parallel processing strategy.
\\\` : '';`;

const repl = `const klevgrandStr = isMultibandMode ? \\\`
MULTIBAND PARALLEL PROCESSING INSTRUCTION (MANDATORY):
The user has enabled "Multiband Mode" (also known as Gaffel mode). You MUST strictly incorporate advanced multi-band parallel processing for at least one critical channel.
- Analyze the user's plugin list (or DAW native tools like Reaper's ReaEQ/ReaXcomp/Sends, or T-RackS Quad series, Klevgrand Gaffel, etc.) to figure out the best way to split the signal into frequency bands.
- If the user has "Gaffel" or "Klevgrand - Gaffel", you MUST explicitly use it to split the bands in your FX chain.
- First, explicitly add a 'Plugin' bubble in the fxPlugins list describing the crossover/routing method (e.g., "Klevgrand Gaffel Band Split", "DAW Routing Multiband Split", etc.), and provide a detailed guide in its 'deepDive' explaining EXACTLY how the user should route and split the frequencies.
- Then, list the subsequent processing plugins, setting the 'band' property on each fxPlugin (e.g., "Low", "Mid", "High") to explicitly indicate which frequency split it is processing.
- Provide tailored parameter settings in the 'deepDive' for the plugins on each individual band to explain the parallel processing strategy.
\\\` : '';`;

const occurrences = code.split(search).length - 1;
console.log('Found occurrences:', occurrences);
code = code.split(search).join(repl);
fs.writeFileSync('src/services/geminiService.ts', code);
console.log('Replaced successfully.');
