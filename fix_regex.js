const fs = require('fs');
let content = fs.readFileSync('src/i18n.ts', 'utf8');

const regex = /"Remove \{\{type\n\s*"daw_garage_band":[\s\S]*?daw_garage_band_step4[\s\S]*?\}\}",/g;
content = content.replace(regex, '"Remove {{type}}",');
// Oh wait, did it happen for other languages? Let's check Spanish.
// What was the first `}}` in Spanish? Let's check line 1085 (remove_item).
const esRegex = /"Eliminar \{\{type\n\s*"daw_garage_band":[\s\S]*?daw_garage_band_step4[\s\S]*?\}\}",/g;
const frRegex = /"Supprimer \{\{type\n\s*"daw_garage_band":[\s\S]*?daw_garage_band_step4[\s\S]*?\}\}",/g;

// I can just replace the block `\n      "daw_garage_band": "Garage Band",[\s\S]*?"daw_garage_band_step4".*?,` globally with `""`? No, wait.
// Let's just restore i18n from a backup if one existed. Wait, I didn't create a backup. Let me write a script to fix this precisely.

// The issue was:
// `Remove {{type` + inserted code + `}}"`

// So we can do:
fs.writeFileSync('src/i18n.ts', content);
