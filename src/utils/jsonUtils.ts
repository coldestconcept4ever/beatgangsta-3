import { jsonrepair } from 'jsonrepair';

/**
 * Sanitizes a JSON string by removing common LLM artifacts like markdown code blocks,
 * and uses jsonrepair to fix structural issues (like missing commas or truncated elements).
 */
export const sanitizeJSON = (jsonString: string): string => {
  if (!jsonString) return '{}';
  
  // Try to extract content inside markdown code blocks first
  const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  let sanitized = '';
  
  if (match && match[1]) {
    sanitized = match[1];
  } else {
    // Check for an unclosed code block
    const unclosedMatch = jsonString.match(/```(?:json)?\s*([\s\S]*)/);
    if (unclosedMatch && unclosedMatch[1]) {
      sanitized = unclosedMatch[1];
    } else {
      sanitized = jsonString;
    }
  }
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Try to extract the outermost {} or [] safely
  const firstBrace = sanitized.indexOf('{');
  const lastBrace = sanitized.lastIndexOf('}');
  const firstBracket = sanitized.indexOf('[');
  const lastBracket = sanitized.lastIndexOf(']');

  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = lastBrace !== -1 ? lastBrace : sanitized.length - 1;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = lastBracket !== -1 ? lastBracket : sanitized.length - 1;
  }

  if (startIdx !== -1) {
    sanitized = sanitized.substring(startIdx, endIdx + 1);
  }
  
  try {
    // Let jsonrepair handle trailing commas, unclosed brackets, etc.
    return jsonrepair(sanitized);
  } catch (err) {
    console.error("jsonrepair failed, returning best effort:", err);
    return sanitized;
  }
};
