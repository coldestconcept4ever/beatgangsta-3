import { getUnifiedRecipeSchema } from './src/services/geminiService.ts';

const apiKey = "dummy";
const hugeText = 'a'.repeat(5 * 1024 * 1024); // 5MB string

const payload = {
    contents: [
        {
            role: "user",
            parts: [{ text: hugeText }]
        }
    ],
    generation_config: {
        response_mime_type: "application/json",
        response_schema: {
            type: "OBJECT",
            properties: {
                recipes: {
                    type: "ARRAY",
                    items: getUnifiedRecipeSchema()
                }
            },
            required: ["recipes"]
        }
    }
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(r => r.json()).then(console.log);
