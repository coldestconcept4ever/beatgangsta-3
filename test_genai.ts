import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if(!apiKey) {
    console.error("No API key");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Tell me a joke",
      config: {
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
        ]
      }
    });
    console.log(res.text);
  } catch (e: any) {
    console.error("ERROR", e.message);
  }
}
test();
