import fs from 'fs';
let content = fs.readFileSync('src/components/DawSelectionModal.tsx', 'utf-8');
content = content.replace(
  /\{ id: 'Garage Band', name: t\('daw_garage_band'\), desc: t\('daw_garage_band_desc'\) \},/,
  `{ id: 'Garage Band', name: t('daw_garage_band'), desc: t('daw_garage_band_desc') },\n    { id: 'LUNA', name: 'Universal Audio LUNA', desc: 'LUNA Recording System' },`
);
fs.writeFileSync('src/components/DawSelectionModal.tsx', content, 'utf-8');
