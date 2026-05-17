const fs = require('fs');
let content = fs.readFileSync('src/i18n.ts', 'utf8');

// Replace &gt; with >
content = content.replace(/&gt;/g, '>');

// Add daw_cubase_step4
const step4en = 'BeatGangsta will parse your list and load your gear automatically.';
const step4es = 'BeatGangsta analizará tu lista y cargará tu equipo automáticamente.';
const step4fr = 'BeatGangsta analysera votre liste et chargera votre équipement automatiquement.';
const step4ru = 'BeatGangsta проанализирует ваш список и автоматически загрузит ваше оборудование.';
const step4pt = 'BeatGangsta irá processar sua lista e carregar seu equipamento automaticamente.';

let lines = content.split('\n');
let newLines = [];
let currentLang = 'en'; // default

for(let i=0; i<lines.length; i++) {
    const line = lines[i];
    
    if (line.match(/^\s*en:\s*\{/)) currentLang = 'en';
    if (line.match(/^\s*es:\s*\{/)) currentLang = 'es';
    if (line.match(/^\s*'es-ES':\s*\{/)) currentLang = 'es-ES';
    if (line.match(/^\s*fr:\s*\{/)) currentLang = 'fr';
    if (line.match(/^\s*ru:\s*\{/)) currentLang = 'ru';
    if (line.match(/^\s*pt:\s*\{/)) currentLang = 'pt';
    
    newLines.push(line);
    
    if (line.includes('"daw_cubase_step3":')) {
        let text = step4en;
        if (currentLang === 'es' || currentLang === 'es-ES') text = step4es;
        if (currentLang === 'fr') text = step4fr;
        if (currentLang === 'ru') text = step4ru;
        if (currentLang === 'pt') text = step4pt;
        
        const indent = line.match(/^\s*/)[0];
        newLines.push(`${indent}"daw_cubase_step4": "${text}",`);
    }
}

fs.writeFileSync('src/i18n.ts', newLines.join('\n'));
console.log('Fixed i18n formatting and added daw_cubase_step4');
