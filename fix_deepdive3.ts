import fs from 'fs';

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

const regexes = [
    /\(aim for \d+-\d+\)\./g,
    /aim for \d+-\d+\+?\)?/g,
    /\(AT LEAST \d+ parameters per plugin, and up to \d+ if it is a complex channel strip plugin\)/g,
    /AT LEAST \d+ parameter settings \(and up to \d+ if it is a complex channel strip plugin\)\./g,
    /\(EVERY available parameter per plugin, ?(aim for \d+-\d+\+?)?\)/g,
    /Be exhaustive and do NOT be lazy\./g,
    /Provide EVERY available parameter found on the actual plugin( \(\))?/gi
];

regexes.forEach(regex => {
    content = content.replace(regex, '');
});

fs.writeFileSync(file, content);
console.log("Cleanup 3 done");
