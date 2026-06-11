import { Project, Utility, ContentType, MixerRole, Vst3Plugin, DeviceRole } from 'dawproject-typescript';

// Monkey patch Vst3Plugin to output lowercase xml tag name
Vst3Plugin.prototype.toXmlObject = function() {
  const pluginContent = Object.getPrototypeOf(Vst3Plugin.prototype).toXmlObject.call(this);
  return {
    vst3Plugin: pluginContent
  };
};

const project = new Project();
const track = Utility.createTrack("Lead Vocal", new Set([ContentType.AUDIO]), MixerRole.REGULAR, 0.8, 0.5);

const plugin = new Vst3Plugin();
plugin.deviceName = "Pro-Q 3";
plugin.deviceRole = DeviceRole.AUDIO_FX;
plugin.deviceID = "5653545251336166616266696c746572";
plugin.deviceVendor = "FabFilter";

track.channel.devices.push(plugin);
project.structure = [track];

console.log("GENERATED XML:");
console.log(project.toXml());
