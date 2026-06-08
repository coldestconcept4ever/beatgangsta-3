import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// fix line 2412
content = content.replace(/responseMimeType: "application\/json", responseSchema: undefined, safetySettings/g, (match, offset, str) => {
    // we want to replace the first with chunkSchema and second with schemaObject
    return "REPLACE_ME_LATER";
});

fs.writeFileSync('src/services/geminiService.ts', content);
