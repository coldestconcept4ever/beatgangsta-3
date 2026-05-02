import fs from 'fs';
import { Type } from '@google/genai';
import { getUnifiedRecipeSchema } from './src/services/geminiService.ts';

const payload = {
  model: 'gemini-3-flash-preview',
  contents: { parts: [{ text: "test" }] },
  config: {
    customAction: 'recipe',
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECTttttt",
      properties: {
        recipes: {
          type: "ARRAY",
          items: getUnifiedRecipeSchema()
        }
      },
      required: ["recipes"]
    }
  },
  action: 'recipe',
  userApiKey: "dummy"
};

fetch('http://localhost:3000/api/test-schema', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(r => r.json()).then(console.log).catch(console.error);
