import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                { text: "Hello, reply with JSON: {\"reply\": \"hi\"}" }
            ],
            config: {
                responseMimeType: "application/json",
                // @ts-ignore
                customAction: "critique"
            }
        });
        console.log("Success:", response.text);
    } catch (e: any) {
        console.error("Error:", e.message);
    }
};

test();
