import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const promptReplacement = `  let prompt = \`
    You are an expert audio mastering engineer. 
    The user has uploaded multiple full mixdowns of tracks intended for an album release.
    Your goal is to analyze the differences between these tracks and provide a cohesive Album Mastering Guide.
    
    Here are the tracks provided:
    \${stemsContext}
    
    User Context / Album Vibe: "\${userContext}"
    
    You MUST provide an exhaustive, in-depth guide of what specific mastering plugins to add on EACH track's master bus so that they all sound good together like a fine-tuned album. Match the LUFS, dynamic range, and tonal balance.
    
    CRITICAL REQUIREMENTS:
    1. You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain.
    2. You MUST provide EXHAUSTIVE, deeply detailed parameters for EVERY SINGLE plugin suggested. Do not just suggest the plugin, tell them EXACTLY how to set every knob.
    
    \${PRO_Q_3_LAYOUT_PROMPT}
    \${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    
    ONLY use plugins from this list (the user owns these):
    \${pluginListStr}
    
    Analog Hardware available:
    \${hardwareListStr}
    
    \${dawStr}
    \${starredStr}
    
    Respond with a JSON object exactly matching this interface:
    {
      "title": "Album Mastering Strategy",
      "overallFeedback": "Your detailed analysis of the album's current cohesive state, the differences identified between the tracks, and the high-level strategy to unify them.",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "actionPlan": [
        {
          "targetStem": "Name of the Track (e.g., Track 1: name.wav)",
          "issue": "What this specific track needs to match the album. Be highly detailed.",
          "solution": "How to achieve this.",
          "recommendedChain": [
            {
              "name": "Exact Plugin Name from list",
              "purpose": "Why use this on this track",
              "deepDive": [
                {
                  "parameter": "Exact parameter name",
                  "value": "Exact value (e.g., -2dB)"
                }
              ]
            }
          ]
        }
      ]
    }
  \`;`;

// Using regex to replace the old prompt block
const regex = /let prompt = `[\s\S]*?`\;/m;
content = content.replace(regex, promptReplacement);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Updated prompt in getAlbumMasteringGuide");
