const fs = require('fs');

let content = fs.readFileSync('src/i18n.ts', 'utf8');

// The replacement was:
// return p1 + translationsStr + p2;
// p2 is `}}` and possibly spaces/newlines.

// We can find all occurrences of daw_garage_band in the file and remove them to clean the file, then re-insert properly.
const regex = /\{\{([a-zA-Z0-9_]+)\n\s*"daw_garage_band": "Garage Band",[\s\S]*?"daw_garage_band_step4[^"]+",[ \t]*\}\}"/g;

let count = 0;
content = content.replace(regex, (match, p1) => {
    count++;
    return '{{' + p1 + '}}"';
});

console.log("Fixed occurrences with variables: ", count);

Object.keys({
  en: '"Remove {{type\n',
  es: '"Eliminar {{type\n',
  'es-ES': '"Eliminar {{type\n',
  fr: '"Supprimer {{type\n',
  ru: '"Удалить {{type\n',
  pt: '"Remover {{type\n'
}).forEach(lang => {
   // Wait, maybe we just use a general regex to rip out daw_garage_band
});

// Let's just simply remove all daw_garage_band lines and reconstruct the broken JSON manually.

let lines = content.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes('"daw_garage_band":')) {
      skip = true;
      // The previous line must be something like `"remove_item": "Remove {{type`
      // We append `}}",` to the previous line.
      if (newLines.length > 0) {
         let prev = newLines[newLines.length - 1];
         if (prev.endsWith('{{type')) {
             newLines[newLines.length - 1] = prev + '}}",';
         } else if (prev.match(/\{\{[a-zA-Z0-9_]+$/)) {
             newLines[newLines.length - 1] = prev + '}}",';
         }
      }
   }
   
   if (skip) {
      if (lines[i].includes('}}",') && lines[i].includes('daw_garage_band_step4')) {
          skip = false;
          // The line is `"daw_garage_band_step4": "...",}}",`
          // we already appended `}}",` to prev line, so we just drop this line.
      }
   } else {
      newLines.push(lines[i]);
   }
}

fs.writeFileSync('src/i18n.ts', newLines.join('\n'));
console.log('Cleaned up file.');
