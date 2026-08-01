import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const badCode = `  const model = ai.models.get({
    model: "gemini-2.5-pro",
    systemInstruction: "You are an elite, Grammy-winning mastering engineer. You output only valid JSON. Do not use markdown blocks for JSON.",
  });

  const response = await model.generateContent({
    contents: parts,
    config: {
        responseMimeType: 'application/json',
        temperature: 0.2
    }
  });`;

const goodCode = `  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: parts,
    config: {
        systemInstruction: "You are an elite, Grammy-winning mastering engineer. You output only valid JSON. Do not use markdown blocks for JSON.",
        responseMimeType: 'application/json',
        temperature: 0.2
    }
  });`;

content = content.replace(badCode, goodCode);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Fixed model calling syntax");
