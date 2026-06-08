import fs from 'fs';

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

// Scrub all instances of demanding high parameter counts or extreme detail
const regexes = [
    /Aim for \d+-\d+\+? settings( for complex (plugins|modules))?/g,
    /aim for \d+-\d+ settings( for complex (plugins|modules))?/g,
    /MATCH THE EXTREME DETAIL(&#39;|&apos;)?( LEVEL)? OF A FULL BEAT RECIPE\.?/g,
    /MATCH THE EXTREME DETAIL OF A FULL BEAT RECIPE\.?/g,
    /aim for 20-40\+ parameters for professional tools\./g,
    /Provide EVERY available parameter found on the actual plugin interface(\.)?( )?/g,
    /Do NOT be lazy;/g,
    /if a plugin has many controls, list them all\./g,
    /NEVER invent fake parameters, but be absolutely exhaustive with the real ones\./g,
    /Be thorough;/g,
    /ensure every possible control is accounted for\./g
];

regexes.forEach(regex => {
    content = content.replace(regex, '');
});

fs.writeFileSync(file, content);
console.log("Cleanup done");
