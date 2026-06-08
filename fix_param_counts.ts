import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const regexesToRemove = [
    /\(30-50\+ for complex plugins\)/g,
    /\(30-50\+\)/g,
    /\(typically \d+-\d+( settings)?\)/g,
    /AT LEAST \d+ parameters in its deepDive \(and up to \d+ if it is a complex channel strip plugin\)/g,
    /\(30-50\+ parameters per plugin\)/g,
    /NO LAZY OUTPUTS\. DO NOT SKIP KNOBS\./g,
    /\( exact parameter settings\)/g,
    /Ensure every plugin in the vocalElements chain has an EXHAUSTIVE list of all parameters \./g,
    /EXHAUSTIVE list of all parameters, /g,
    /EXHAUSTIVE list of all actual technical parameters found on the real plugin /g
];

regexesToRemove.forEach(regex => {
    content = content.replace(regex, '');
});

fs.writeFileSync('src/services/geminiService.ts', content);
console.log("Done");
