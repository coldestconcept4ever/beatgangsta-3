/**
 * Sanitizes a JSON string by removing common LLM artifacts like markdown code blocks.
 */
export const sanitizeJSON = (jsonString: string): string => {
  if (!jsonString) return '{}';
  
  // Remove markdown code blocks (e.g., ```json ... ``` or ``` ... ```)
  let sanitized = jsonString.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Sometimes LLMs append trailing text. Try to extract the outermost {} or []
  const firstBrace = sanitized.indexOf('{');
  const lastBrace = sanitized.lastIndexOf('}');
  const firstBracket = sanitized.indexOf('[');
  const lastBracket = sanitized.lastIndexOf(']');

  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = lastBrace;
  } else if (firstBracket !== -1 && lastBracket !== -1) {
    startIdx = firstBracket;
    endIdx = lastBracket;
  }

  if (startIdx !== -1 && endIdx !== -1) {
    sanitized = sanitized.substring(startIdx, endIdx + 1);
  }
  
  return sanitized;
};
