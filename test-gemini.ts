import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "hello",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "STRING" as any
        }
      }
    });
    console.log("STRING worked", res.text);
  } catch (e: any) {
    console.error("STRING failed", e.message);
  }
}
run();
