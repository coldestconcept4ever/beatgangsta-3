import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function testModel(modelName: string) {
  try {
    const res = await ai.models.generateContent({
      model: modelName,
      contents: "hello",
    });
    console.log(`Model ${modelName}: OK`);
  } catch (e: any) {
    console.error(`Model ${modelName}: FAIL - ${e.message}`);
  }
}

async function run() {
  await testModel("gemini-3.5-flash");
  await testModel("gemini-3.1-pro-preview");
  await testModel("gemini-3-flash-preview");
  await testModel("gemini-3.1-flash-preview");
  await testModel("gemini-3.1-pro-preview");
}
run();
