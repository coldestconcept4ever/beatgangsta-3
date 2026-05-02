const { GoogleGenAI } = require('@google/genai');

async function test() {
  const ai = new GoogleGenAI({ apiKey: "DUMMY_KEY" });
  try {
    const req = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: "hi" }] }
    });
    const p = await req;
    console.log("Req stringified by SDK natively?", p);
  } catch (e) {
    console.error("ERROR CAUGHT:");
    console.error(e.message);
  }
}
test();
