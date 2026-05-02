const { GoogleGenAI, Type } = require('@google/genai');

async function test() {
  const ai = new GoogleGenAI({ apiKey: "DUMMY_KEY" });
  try {
    const req = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: "hi" }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
             prop1: {
                type: "INVALID_TYPE"
             }
          }
        }
      }
    });
    await req;
  } catch (e) {
    console.error("ERROR CAUGHT:", e.message);
  }
}
test();
