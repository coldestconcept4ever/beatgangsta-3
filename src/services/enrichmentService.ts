import { Type } from '@google/genai';
import { Hardware } from '../types';
import { generateContentViaBackend } from './geminiService';

export const enrichHardware = async (items: string[], turnstileToken: string | null = null, sessionId: string | null = null): Promise<Hardware[]> => {
  if (!items || items.length === 0) return [];

  try {
    const response = await generateContentViaBackend(
      'gemini-3-flash-preview',
      `For the following list of musical instruments and hardware, identify the brand (vendor) and type (instrument or hardware) for each. Here is the list: ${items.join(', ')}\n\nCRITICAL: Return EXACTLY a JSON array of objects with 'name', 'vendor', and 'type' keys. 'type' must be 'instrument' or 'hardware'.`,
      {
        responseMimeType: 'application/json'
      },
      turnstileToken,
      sessionId
    );

    const hardware: Hardware[] = JSON.parse(response.text || '[]');
    return hardware;
  } catch (e) {
    console.error("Failed to parse hardware enrichment response:", e);
    return [];
  }
};
