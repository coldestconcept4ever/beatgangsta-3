import * as fs from 'fs';
const text = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /^[^=]+\.(dll|vst3)=/i;
console.log(regex.test('Audio Damage. Inc.,Basic x64,VST2,1.0.0.0,Last year'));
console.log(regex.test('<Section path="021A09FB/FIN-MICRO.dll">'));
console.log(regex.test('<Attribute id="VST2:UniqueID" value="1179209033"/>'));
console.log(regex.test('<Settings xmlns:x="https://ccl.dev/xml" name="Plugins-en" version="1">'));
