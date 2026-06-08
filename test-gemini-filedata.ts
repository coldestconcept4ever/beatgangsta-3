import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    fileData: {
                        fileUri: "https://generativelanguage.googleapis.com/v1beta/files/testabc123",
                        mimeType: "audio/mpeg"
                    }
                },
                { text: "analyze it" }
            ]
        });
        console.log("Success:", response.text);
    } catch (e: any) {
        console.error("Error with fileData:", e.message);
    }
};

test();
