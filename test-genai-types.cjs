require('dotenv').config();
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            test: { type: "STRING" }
          }
        }
      }
    });
    console.log("Success with 'STRING'");
  } catch (e) {
    console.error("Error with 'STRING'", e.message);
  }
}
test();
