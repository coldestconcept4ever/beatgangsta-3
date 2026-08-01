import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const targetStr = `      "actionPlan": [`;
const replacementStr = `      "actionPlan": [`;

if(content.includes(targetStr)){
    content = content.replace(targetStr, `    WARNING: DOUBLE CHECK THAT FABFILTER PRO-Q 3 IS IN EVERY SINGLE TRACK'S CHAIN. DO NOT FORGET. EVERY TRACK MUST HAVE PRO-Q 3.\n\n` + replacementStr);
    console.log("Appended warning");
}
fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
