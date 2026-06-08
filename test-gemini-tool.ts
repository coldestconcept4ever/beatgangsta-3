import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "hi",
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        console.log("Success:", response.text);
    } catch (e: any) {
        console.error("Error with gemini-3-flash-preview + googleSearch tool:", e.message);
    }
};

test();
