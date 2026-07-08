const fs = require('fs');

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const extractPrompt = `const EXTRACT_RECIPE_MIDI_PROMPT = \`
    CRITICAL - EXTRACT RECIPE & FULL ARRANGEMENT MIDI:
    - **CRITICAL COMPUTE DIRECTIVE**: You MUST dedicate maximum compute time to transcribe the FULL song precisely. This is a massive operation. DO NOT rush. Do not give short 4 or 8 bar loops.
    - **ALL INSTRUMENTS**: You MUST detect and include EVERY SINGLE instrument playing in the song (Lead Synth, Pads, Bass, Plucks, Strings, Guitars, Arps, etc.) inside the "instruments" array. Do not skip any element of the arrangement.
    - **LONG SECTIONS**: You MUST output 16-bar or 32-bar MIDI arrangements for Intro, Verse, Hook, Bridge, Outro for each instrument. (e.g. up to 256 or 512 steps!).
\` + ADVANCED_MIDI_PROMPT;`;

content = content.replace(/const EXTRACT_RECIPE_MIDI_PROMPT = `[\s\S]*?` \+ ADVANCED_MIDI_PROMPT;/, '');
content = content.replace(/const RC20_SPEC_PROMPT = `/, extractPrompt + '\n\nconst RC20_SPEC_PROMPT = `');

fs.writeFileSync('src/services/geminiService.ts', content);
