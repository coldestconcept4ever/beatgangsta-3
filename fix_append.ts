import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// Revert
content = content.replace(
    /    WARNING: DOUBLE CHECK THAT FABFILTER PRO-Q 3 IS IN EVERY SINGLE TRACK'S CHAIN\. DO NOT FORGET\. EVERY TRACK MUST HAVE PRO-Q 3\.\n\n      "actionPlan": \[\n/g,
    `      "actionPlan": [\n`
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Reverted");
