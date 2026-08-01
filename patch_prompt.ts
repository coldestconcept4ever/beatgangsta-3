import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const oldPrompt = `  let prompt = \`
    You are an expert audio mastering engineer. 
    The user has uploaded multiple full mixdowns of tracks intended for an album release.
    Your goal is to analyze the differences between these tracks and provide a cohesive Album Mastering Guide.
    
    Here are the tracks provided:
    \${stemsContext}
    
    User Context / Album Vibe: "\${userContext}"
    
    You MUST provide a guide of what specific mastering plugins to add on EACH track's master bus so that they all sound good together like a fine-tuned album. Match the LUFS, dynamic range, and tonal balance.
    
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
          "issue": "What this specific track needs to match the album.",
          "solution": "How to achieve this.",
          "recommendedChain": [
            {
              "name": "Exact Plugin Name from list",
              "reasoning": "Why use this on this track",
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

// Using strict replace
if(content.includes(oldPrompt)){
  content = content.replace(oldPrompt, promptReplacement);
  console.log("Success exact string match");
} else {
  // Let's find index of "let prompt =" near the end of the file and replace everything until "];" or parts
  const startIndex = content.indexOf('let prompt = `', content.length - 2500);
  const endIndex = content.indexOf('let parts:', startIndex);
  if (startIndex !== -1 && endIndex !== -1) {
    const oldSegment = content.substring(startIndex, endIndex);
    content = content.replace(oldSegment, promptReplacement + '\n  ');
    console.log("Success with substring replacement");
  } else {
     console.log("Failed to find prompt");
  }
}

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
