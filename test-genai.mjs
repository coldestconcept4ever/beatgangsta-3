import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    fs.writeFileSync('test.txt', 'Hello world');
    const uploadResult = await ai.files.upload({ file: 'test.txt', config: { mimeType: 'text/plain' } });
    console.log("Upload result:", uploadResult.uri);
    
    // try with exact same format we are sending
    const uriObj1 = uploadResult.uri;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [
          { fileData: { fileUri: uriObj1, mimeType: 'text/plain' } },
          { text: "What is in the file?" }
        ]
      }]
    });
    console.log("Success with regular URI:", response.text);
    
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
