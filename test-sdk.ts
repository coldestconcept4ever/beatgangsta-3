import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getUnifiedRecipeSchema } from './src/services/geminiService.ts';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: "dummy" });

const reqBody: any = {
    contents: [
        {
            role: "user",
            parts: [{ text: "Generate a beat" }]
        }
    ],
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "OBJECT",
            properties: {
                recipes: {
                    type: "ARRAY",
                    items: getUnifiedRecipeSchema()
                }
            },
            required: ["recipes"]
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    }
};

genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: reqBody.contents,
    config: reqBody.config
}).then(r => {
    console.log(r);
}).catch(e => {
    console.log("SDK ERROR", e.message, e);
});
