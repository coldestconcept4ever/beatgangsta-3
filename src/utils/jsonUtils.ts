/**
 * Auto-repairs truncated or malformed JSON by balancing unclosed strings, arrays, and objects.
 */
export const repairTruncatedJSON = (jsonStr: string): string => {
  let str = jsonStr.trim();
  if (!str) return '{}';

  // 1. If JSON parses directly, return as is
  try {
    JSON.parse(str);
    return str;
  } catch (e) {}

  // 2. Remove trailing comma or incomplete tokens at the end
  str = str.replace(/,\s*$/, '');

  // 3. Track string state and stack of open structures ('{' or '[')
  const stack: string[] = [];
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

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
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}') {
        if (stack[stack.length - 1] === '{') stack.pop();
      } else if (char === ']') {
        if (stack[stack.length - 1] === '[') stack.pop();
      }
    }
  }

  // 4. If we ended inside an open string, close the string quote
  if (inString) {
    str += '"';
  }

  // 5. Clean up any incomplete key-value pairing (e.g. `"prop": ` or trailing comma)
  str = str.replace(/,\s*$/, '');
  str = str.replace(/:\s*$/, ': null');

  // 6. Close all remaining unclosed braces/brackets in reverse order
  while (stack.length > 0) {
    const openChar = stack.pop();
    if (openChar === '{') str += '}';
    else if (openChar === '[') str += ']';
  }

  // 7. Verify if repaired JSON is valid
  try {
    JSON.parse(str);
    return str;
  } catch (err) {
    // Slicing strategy: if mid-token truncation prevented repair, step back to last comma or bracket
    const lastComma = str.lastIndexOf(',');
    if (lastComma > 10) {
      return repairTruncatedJSON(str.substring(0, lastComma));
    }
    return str;
  }
};

/**
 * Sanitizes a JSON string by removing common LLM artifacts like markdown code blocks
 * and repairing any truncated JSON payloads automatically.
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
  
  // Extract outermost JSON structure starting index
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
    
    // If it never reaches depth 0 (e.g. truncated response), repair it automatically!
    const substring = sanitized.substring(startIdx);
    return repairTruncatedJSON(substring);
  }
  
  return repairTruncatedJSON(sanitized);
};
