import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  fs.writeFileSync("test.txt", "hello world");
  try {
    const uploadResult = await ai.files.upload({
      file: "test.txt",
      config: {
        mimeType: "text/plain"
      }
    });
    console.log("Upload result:", uploadResult);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
