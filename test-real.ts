import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getUnifiedRecipeSchema } from './src/services/geminiService.ts';
dotenv.config();

const apiKey = "dummy";
const genAI = new GoogleGenAI({ apiKey: apiKey });

const reqBody: any = {
    contents: {
        parts: [{ text: "Generate a beat" }]
    },
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
        }
    }
};

genAI.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: reqBody.contents,
    config: reqBody.config
}).then(r => {
    console.log(r.text);
}).catch(e => {
    console.log("SDK ERROR", e.message);
    if (e.details) console.log(JSON.stringify(e.details, null, 2));
    if (e.response && e.response.data) console.log(JSON.stringify(e.response.data, null, 2));
});
