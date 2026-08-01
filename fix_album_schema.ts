import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const oldSchema = `  const schema = {
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
  };`;

const newSchema = `  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      overallFeedback: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      actionPlan: {
        type: Type.ARRAY,
        description: "CRITICAL: You MUST generate EXACTLY " + uploadedStems.length + " items in this array, one for each uploaded stem.",
        items: {
          type: Type.OBJECT,
          properties: {
            targetStem: { type: Type.STRING },
            issue: { type: Type.STRING },
            solution: { type: Type.STRING },
            recommendedChain: {
              type: Type.ARRAY,
              description: "CRITICAL: You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "CRITICAL: You MUST provide EXHAUSTIVE, deeply detailed parameters. Do not just suggest the plugin, tell them EXACTLY how to set every single knob. For Pro-Q 3, there MUST be exactly 6 items.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING }
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
  };`;

content = content.replace(oldSchema, newSchema);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Fixed schema type enum issue");
