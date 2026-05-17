const fs = require('fs');

const file = 'src/i18n.ts';
let content = fs.readFileSync(file, 'utf8');

const enKeys = `
      "daw_garage_band": "Garage Band",
      "daw_garage_band_desc": "Supports AU plugins on macOS",
      "daw_garage_band_step1": "Open <1>Finder</1> and press <3>Command + Shift + G</3>.",
      "daw_garage_band_step2": "Type <1>/Library/Audio/Plug-Ins/Components</1> and hit Enter.",
      "daw_garage_band_step3": "Select the <1>.component</1> files for your plugins and copy their names.",
      "daw_garage_band_step4": "BeatGangsta will identify your plugins from the list.",`;

const esKeys = `
      "daw_garage_band": "Garage Band",
      "daw_garage_band_desc": "Soporta plugins AU en macOS",
      "daw_garage_band_step1": "Abre el <1>Finder</1> y presiona <3>Command + Shift + G</3>.",
      "daw_garage_band_step2": "Escribe <1>/Library/Audio/Plug-Ins/Components</1> y pulsa Intro.",
      "daw_garage_band_step3": "Selecciona los archivos <1>.component</1> de tus plugins y copia sus nombres.",
      "daw_garage_band_step4": "BeatGangsta identificará tus plugins a partir de la lista.",`;

const frKeys = `
      "daw_garage_band": "Garage Band",
      "daw_garage_band_desc": "Prend en charge les plugins AU sur macOS",
      "daw_garage_band_step1": "Ouvrez le <1>Finder</1> et appuyez sur <3>Command + Shift + G</3>.",
      "daw_garage_band_step2": "Tapez <1>/Library/Audio/Plug-Ins/Components</1> et appuyez sur Entrée.",
      "daw_garage_band_step3": "Sélectionnez les fichiers <1>.component</1> de vos plugins et copiez leurs noms.",
      "daw_garage_band_step4": "BeatGangsta identifiera vos plugins à partir de la liste.",`;

const ruKeys = `
      "daw_garage_band": "Garage Band",
      "daw_garage_band_desc": "Поддерживает плагины AU в macOS",
      "daw_garage_band_step1": "Откройте <1>Finder</1> и нажмите <3>Command + Shift + G</3>.",
      "daw_garage_band_step2": "Введите <1>/Library/Audio/Plug-Ins/Components</1> и нажмите Enter.",
      "daw_garage_band_step3": "Выберите файлы <1>.component</1> ваших плагинов и скопируйте их имена.",
      "daw_garage_band_step4": "BeatGangsta идентифицирует ваши плагины из списка.",`;

const ptKeys = `
      "daw_garage_band": "Garage Band",
      "daw_garage_band_desc": "Suporta plugins AU no macOS",
      "daw_garage_band_step1": "Abra o <1>Finder</1> e pressione <3>Command + Shift + G</3>.",
      "daw_garage_band_step2": "Digite <1>/Library/Audio/Plug-Ins/Components</1> e pressione Enter.",
      "daw_garage_band_step3": "Selecione os arquivos <1>.component</1> dos seus plugins e copie os nomes deles.",
      "daw_garage_band_step4": "BeatGangsta irá identificar seus plugins a partir da lista.",`;

const insertTranslations = (content, lang, translationsStr) => {
  const regex = new RegExp(`('${lang}':\\s*\\{\\s*translation:\\s*\\{[\\s\\S]*?)(\\s*\\}\\s*\\})`, 'g');
  let matchCount = 0;
  
  if (lang === 'en' || lang === 'es' || lang === 'fr' || lang === 'ru' || lang === 'pt') {
       const altRegex = new RegExp(`(${lang}:\\s*\\{\\s*translation:\\s*\\{[\\s\\S]*?)(\\s*\\}\\s*\\})`, 'g');
       content = content.replace(altRegex, (match, p1, p2) => {
         matchCount++;
         return p1 + translationsStr + p2;
       });
  }

  content = content.replace(regex, (match, p1, p2) => {
    matchCount++;
    return p1 + translationsStr + p2;
  });
  console.log('Modified language: ', lang, ' Matches: ', matchCount);
  return content;
};

content = insertTranslations(content, 'en', enKeys);
content = insertTranslations(content, 'es', esKeys);
content = insertTranslations(content, "es-ES", esKeys);
content = insertTranslations(content, 'fr', frKeys);
content = insertTranslations(content, 'ru', ruKeys);
content = insertTranslations(content, 'pt', ptKeys);

fs.writeFileSync(file, content);
console.log('Added GarageBand support to i18n!');
