import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// We will duplicate `getMixCritique` but adapt the prompt for album mastering.
// Actually, it might be easier to just inject the Album Mastering logic directly inside `getMixCritique` if `isAlbumMasteringMode` is true, 
// OR create a separate function. Let's create a separate function.

const newFunc = `
export const getAlbumMasteringGuide = async (
  plugins: VSTPlugin[],
  userContext: string = "",
  language: string = 'en',
  uploadedStems: any[] = [],
  analogInstruments: Hardware[] = [],
  analogHardware: Hardware[] = [],
  starredPlugins: string[] = [],
  stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>,
  combinedPhysicalMetrics?: { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number },
  dawType: string | null = null,
  lunaSumming: string = 'off',
  lunaTape: string = 'off'
): Promise<MixCritique> => {
  const ai = getAI();
  const limitedPlugins = plugins.slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => \`\${p.vendor} - \${p.name} (\${p.type}) [Parameters: \${p.parameters?.join(', ') || 'N/A'}]\`).join('\\n');

  let hardwareListStr = [...analogInstruments, ...analogHardware].map(h => h.name).join('\\n');

  const dawStr = dawType ? \`\\nThe user is using \${dawType} as their DAW. Include specific instructions or tips for \${dawType} where relevant.\` : '';

  let stemsContext = uploadedStems.map((stem, index) => {
    const metrics = stemsPhysicalMetrics?.[stem.id];
    let metricsStr = metrics ? \`(LUFS: \${metrics.integratedLufs.toFixed(1)}, True Peak: \${metrics.truePeak.toFixed(1)}dB)\` : '';
    return \`Track \${index + 1}: \${stem.file?.name || 'Unknown'} \${metricsStr}\`;
  }).join('\\n');

  let prompt = \`
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
  \`;

  let parts: any[] = [{ text: prompt }];

  // Upload each stem file to Gemini and add to parts
  for (const stem of uploadedStems) {
    if (stem.file && stem.geminiFileUri) {
      parts.push({
        fileData: {
          mimeType: stem.mimeType || 'audio/mpeg',
          fileUri: stem.geminiFileUri
        }
      });
      parts.push({ text: \`Audio for \${stem.file.name}\` });
    }
  }

  const model = ai.models.get({
    model: "gemini-2.5-pro",
    systemInstruction: "You are an elite, Grammy-winning mastering engineer. You output only valid JSON. Do not use markdown blocks for JSON.",
  });

  const response = await model.generateContent({
    contents: parts,
    config: {
        responseMimeType: 'application/json',
        temperature: 0.2
    }
  });

  const text = response.text || "";
  try {
    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      title: data.title || "Album Mastering Guide",
      overallFeedback: data.overallFeedback || "",
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      actionPlan: data.actionPlan || []
    };
  } catch (err) {
    console.error("Failed to parse Album Mastering JSON:", err);
    throw new Error("Failed to generate album mastering guide. Please try again.");
  }
};
`;

content += newFunc;

// Also add it to exports of geminiService if we are just appending. Actually, appending means it gets exported automatically.
fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Added getAlbumMasteringGuide");
