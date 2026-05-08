/**
 * Sanitizes a JSON string by removing common LLM artifacts like markdown code blocks.
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
  
  // Try to extract the outermost balanced {} or []
  const firstBrace = sanitized.indexOf('{');
  const firstBracket = sanitized.indexOf('[');

  let startIdx = -1;
  let isOpenBrace = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isOpenBrace = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isOpenBrace = false;
  }

  if (startIdx !== -1) {
    let depth = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = startIdx; i < sanitized.length; i++) {
      const char = sanitized[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (isOpenBrace) {
          if (char === '{') depth++;
          else if (char === '}') {
            depth--;
            if (depth === 0) return sanitized.substring(startIdx, i + 1);
          }
        } else {
          if (char === '[') depth++;
          else if (char === ']') {
            depth--;
            if (depth === 0) return sanitized.substring(startIdx, i + 1);
          }
        }
      }
    }
    
    // If it never reaches depth 0, fallback to returning from startIdx
    return sanitized.substring(startIdx);
  }
  
  return sanitized;
};
