const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const oldStr = "    1. You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain.\n    2. You MUST provide EXHAUSTIVE, deeply detailed parameters for EVERY SINGLE plugin suggested. Do not just suggest the plugin, tell them EXACTLY how to set every knob.";

const newStr = "    1. You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain. For Pro-Q 3, there MUST be exactly 6 adjustments and at least one dynamic EQ change.\n    2. You MUST provide EXHAUSTIVE, deeply detailed parameters for EVERY SINGLE plugin suggested. Do not just suggest the plugin, tell them EXACTLY how to set every single knob, switch, and fader.";

content = content.replace(oldStr, newStr);

const oldStarred = "const starredStr = starredPlugins.length > 0 ? `\\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track's mastering chain:\\n${starredPlugins.join(', ')}` : '';";

const newStarred = "const starredStr = starredPlugins.length > 0 ? `\\nCRITICAL MANDATORY INSTRUCTION: The user has STARRED (favorited) the following plugins:\\n${starredPlugins.join(', ')}\\nYou ABSOLUTELY MUST include these starred plugins in EVERY SINGLE track's recommended chain. This is a non-negotiable hard requirement.` : '';";

content = content.replace(oldStarred, newStarred);

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Fixed album rules");
