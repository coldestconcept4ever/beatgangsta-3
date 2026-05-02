import { Type } from '@google/genai';

const schema1 = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          purpose: { type: Type.STRING },
          deepDive: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
              required: ["parameter", "value", "explanation"]
            }
          }
        },
        required: ["name", "purpose", "deepDive"]
};

// other schemas in geminiService.ts:
const schema3 = {
        type: Type.OBJECT,
        properties: {
          trackingChain: {
            type: Type.OBJECT,
            properties: {
              unisonPlugin: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              },
              inserts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              dawRoutingInstructions: { type: Type.STRING },
              dspUsageNote: { type: Type.STRING }
            },
            required: ["inserts"]
          }
        },
        required: ["trackingChain"]
      };

function checkNode(node: any, path: string = "root") {
    if (!node || typeof node !== "object") return;
    if (node.type === "ARRAY" && !node.items) {
        console.error(`ERROR: Node at ${path} is of type ARRAY but missing 'items'`);
        process.exitCode = 1;
    }
    if (node.properties && node.type !== "OBJECT") {
        console.error(`ERROR: Node at ${path} has properties but is not type OBJECT`);
        process.exitCode = 1;
    }
    for (const key in node) {
        if (typeof node[key] === "object") {
            checkNode(node[key], `${path}.${key}`);
        }
    }
}
checkNode(schema1);
checkNode(schema3);
console.log("Other schema validation check completed!");
