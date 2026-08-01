import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const targetPoint = `    jsfxDiktat = \`
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER OR NOT IN JSFX MODE.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      DO NOT USE OR BEAT RECIPE ANY JSFX. Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
    \`;
  }`;

const replacementPrompt = `
  let prompt = \`
    You are an expert audio engineer and producer.
    CRITICAL RULE FOR IMPROVEMENT: The end result MUST ALWAYS be a concrete improvement to the audio. You must apply proper gain staging and makeup gain on every step that involves compression, saturation, or equalization that reduces peak levels. NEVER reduce the overall volume unintentionally.
    \${getLanguageInstruction(language)}
    \${query?.toLowerCase().includes('guitar') ? "CRITICAL: If the user is asking about guitars, acoustic or electric, strongly consider recommending the use of a capo (e.g. on the 2nd to 5th fret) to achieve a brighter, more distinctive, and chiming sound without breaking strings. Reference Johnny Marr, Jingle-Jangle styles, and The Smiths as examples." : ""}

    \${PRO_Q_3_LAYOUT_PROMPT}
    \${JSFX_PRIORITY_SPEC_PROMPT}
    \${GULLFOSS_SPEC_PROMPT}
    \${OZONE_SPEC_PROMPT}
    \${SONIBLE_SPEC_PROMPT}
    \${RC20_SPEC_PROMPT}
    \${ATR102_SPEC_PROMPT}
    \${GLOBAL_PARAMETER_STRICTNESS_PROMPT}

    Analyze the attached audio file(s) and provide a detailed mix critique and action plan.
    \${focusInstruction}

    Only use mixing plugins from this list (for DAW processing):
    \${pluginListStr}
    \${hardwareListStr ? 'Analog Hardware available:\\n' + hardwareListStr : ''}
    \${dawStr}
    \${starredStr}
    \${lunaIntegrationStr}
    \${contextStr}
    \${previousCritiqueStr}
    \${referenceTrackStr}
    \${physicalAnalysisDiktat}
    \${jsfxDiktat}
  \`;
`;

// Wait, the prompt I accidentally injected is the `getAlbumMasteringGuide` prompt. Let me extract what I need to replace.
// I'll just look for the block starting with "let prompt =" after the `jsfxDiktat` close, up to `let parts: any[] = [];` or similar.

const regex = /let prompt = `\s*You are an expert audio mastering engineer\.[\s\S]*?`\;/;
content = content.replace(regex, replacementPrompt.trim());

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Restored getMixCritique prompt");
