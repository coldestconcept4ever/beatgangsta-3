import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// The single replacement: responseMimeType: "application/json", followed by responseSchema: chunkSchema, in the chunked case.
content = content.replace(/responseMimeType:\s*"application\/json",\s*safetySettings:\s*\[/g, 'responseMimeType: "application/json", responseSchema: (typeof chunkSchema !== "undefined" ? chunkSchema : (typeof schema !== "undefined" ? schema : undefined)), safetySettings: [');

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Done");
