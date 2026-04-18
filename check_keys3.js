import fs from 'fs';

const keys = [
  'all_gear',
  'all',
  'type',
  'vendor',
  'instruments_category',
  'drum_kits_category',
  'dynamics_category',
  'equalizers_category',
  'reverb_delay_category',
  'modulation_category',
  'distortion_saturation_category',
  'utility_metering_category',
  'creative_fx_category',
  'analog_hardware_category',
  'other_category'
];

const langs = ['en', 'es', 'fr', 'ru', 'pt'];

const content = fs.readFileSync('src/i18n.ts', 'utf-8');

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];
  const nextLang = langs[i + 1];
  
  let langContent = '';
  if (nextLang) {
    langContent = content.split(`${lang}: {`)[1].split(`${nextLang}: {`)[0];
  } else {
    langContent = content.split(`${lang}: {`)[1];
  }

  console.log(`Checking ${lang}...`);
  for (const key of keys) {
    if (!langContent.includes(`"${key}":`)) {
      console.log(`Missing key: ${key} in ${lang}`);
    }
  }
}
