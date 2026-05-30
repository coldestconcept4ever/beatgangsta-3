import { Utility, ContentType, MixerRole, Vst3Plugin, DeviceRole } from 'dawproject-typescript';
const t = Utility.createTrack("t", new Set([ContentType.AUDIO]), MixerRole.REGULAR, 0.8, 0.5);
const plugin = new Vst3Plugin();
plugin.deviceName = "Plugin";
plugin.deviceRole = DeviceRole.AUDIO_FX;
console.log(t.loaded, t.channel?.loaded, plugin.loaded);

