import { Vst3Plugin } from 'dawproject-typescript';
const v3 = new Vst3Plugin();
console.log('Vst3Plugin props:', Object.getOwnPropertyNames(v3));
console.log('Vst3Plugin prototype props:', Object.getOwnPropertyNames(Vst3Plugin.prototype));
