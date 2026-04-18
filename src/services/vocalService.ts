import { GoogleGenAI, Modality } from "@google/genai";

// Initialize AI instance. The API key is injected automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateVocals = async (
  prompt: string,
  onChunk: (audioBlob: Blob, lyrics: string) => void
): Promise<void> => {
  try {
    const response = await ai.models.generateContentStream({
      model: "lyria-3-pro-preview",
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
      },
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    // Decode base64 audio into a playable Blob
    const binary = atob(audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    
    onChunk(blob, lyrics);
  } catch (error) {
    console.error("Vocal generation failed:", error);
    throw error;
  }
};
