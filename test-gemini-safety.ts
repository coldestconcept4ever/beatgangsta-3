import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                { fileData: { fileUri: "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/file.mp3?alt=media", mimeType: "audio/mpeg" } },
                { text: "analyze it" }
            ],
            config: {
                responseMimeType: "application/json"
            }
        });
        console.log("Success:", response.text);
    } catch (e: any) {
        console.error("Error:", e.message);
    }
};

test();
