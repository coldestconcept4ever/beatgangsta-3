const { Project, Application, Channel, Vst3Plugin, Track } = require('dawproject-typescript');
const p = new Project();
const tr = new Track();
p.structure = [tr];
tr.channel = new Channel();
const v = new Vst3Plugin();
v.name='TestPlugin';
v.deviceID='foo';
v.vst3Id='foo';
v.uniqueId='foo';
v.pluginId='foo';
tr.channel.devices = [v];
let xml = p.toXml();

console.log("Original:");
console.log(xml);

xml = xml
  .replace(/<Vst3Plugin /g, '<vst3Plugin ')
  .replace(/<\/Vst3Plugin>/g, '</vst3Plugin>')
  .replace(/<Vst2Plugin /g, '<vst2Plugin ')
  .replace(/<\/Vst2Plugin>/g, '</vst2Plugin>')
  .replace(/<BuiltInDevice /g, '<builtInDevice ')
  .replace(/<\/BuiltInDevice>/g, '</builtInDevice>');

// Studio One expects pluginId for VST3 and uniqueId for VST2
// The library outputs deviceID for both
xml = xml.replace(/<vst3Plugin ([^>]+)deviceID="([^"]+)"/g, '<vst3Plugin $1pluginId="$2"');
xml = xml.replace(/<vst2Plugin ([^>]+)deviceID="([^"]+)"/g, '<vst2Plugin $1uniqueId="$2"');

// Fallback for any other deviceID remaining
xml = xml.replace(/deviceID=/g, 'pluginId=');

console.log("\nFixed:");
console.log(xml);
