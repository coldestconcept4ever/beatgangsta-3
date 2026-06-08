import dotenv from 'dotenv';
dotenv.config();

(global as any).localStorage = { getItem: () => null };
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
(global as any).getAI_mock = () => ({
    models: {
        generateContent: async (params: any) => {
            return ai.models.generateContent(params);
        }
    }
});

const test = async () => {
    const { getCustomBeatRecommendations } = await import('./src/services/geminiService');
    const plugins = [{ vendor: "Valhalla DSP", name: "ValhallaVintageVerb", type: "Reverb", isAnalogModel: false, hasControls: true, version: "N/A" }];
    
    try {
        const response = await getCustomBeatRecommendations(plugins as any, "A cool lo-fi beat");
        console.log("Success:", JSON.stringify(response, null, 2));
    } catch (e: any) {
        console.error("Error:", e.message);
    }
};

test();
