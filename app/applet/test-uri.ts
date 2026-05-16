import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const ai = new GoogleGenAI();
async function test() {
  try {
    fs.writeFileSync("test.txt", "hello stems");
    const uploadRes = await ai.files.upload({ file: "test.txt", config: { mimeType: "text/plain" } });
    console.log("Uploaded file URI:", uploadRes.uri);
    
    // Try asking Gemini about it with raw URI
    const res = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: uploadRes.uri, mimeType: "text/plain" } },
            { text: "What does the file say?" }
          ]
        }
      ]
    });
    console.log("Raw URI Response:", res.text);
  } catch(e) {
    if (e.status === 429) console.log("429 Out of credits as expected");
    else console.error("Error:", e);
  }
}
test();
