import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const replacement = `  const schema = {
    type: 6, // Type.OBJECT
    properties: {
      title: { type: 1 }, // Type.STRING
      overallFeedback: { type: 1 },
      strengths: { type: 4, items: { type: 1 } }, // Type.ARRAY
      weaknesses: { type: 4, items: { type: 1 } },
      actionPlan: {
        type: 4,
        description: "CRITICAL: You MUST generate EXACTLY " + uploadedStems.length + " items in this array, one for each uploaded stem.",
        items: {
          type: 6,
          properties: {
            targetStem: { type: 1 },
            issue: { type: 1 },
            solution: { type: 1 },
            recommendedChain: {
              type: 4,
              description: "CRITICAL: You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain.",
              items: {
                type: 6,
                properties: {
                  name: { type: 1 },
                  purpose: { type: 1 },
                  deepDive: {
                    type: 4,
                    description: "CRITICAL: You MUST provide EXHAUSTIVE, deeply detailed parameters. Do not just suggest the plugin, tell them EXACTLY how to set every single knob. For Pro-Q 3, there MUST be exactly 6 items.",
                    items: {
                      type: 6,
                      properties: {
                        parameter: { type: 1 },
                        value: { type: 1 }
                      },
                      required: ["parameter", "value"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: ["targetStem", "issue", "solution", "recommendedChain"]
        }
      }
    },
    required: ["title", "overallFeedback", "strengths", "weaknesses", "actionPlan"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: parts,
    config: {
        systemInstruction: "You are an elite, Grammy-winning mastering engineer. You output only valid JSON. Do not use markdown blocks for JSON.",
        responseMimeType: 'application/json',
        responseSchema: schema as any,
        temperature: 0.2
    }
  });`;

content = content.replace(/  const response = await ai\.models\.generateContent\(\{\n\s*model: "gemini-3-flash-preview",\n\s*contents: parts,\n\s*config: \{\n\s*systemInstruction: "You are an elite, Grammy-winning mastering engineer\. You output only valid JSON\. Do not use markdown blocks for JSON\.",\n\s*responseMimeType: 'application\/json',\n\s*temperature: 0\.2\n\s*\}\n\s*\}\);/, replacement);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched getAlbumMasteringGuide with schema");
