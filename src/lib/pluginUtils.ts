export const CHANNEL_STRIP_NAMES = [
  'ssl e-channel',
  'ssl g-channel',
  'neve 88rs',
  'api vision',
  'focusrite scarlett',
  'scheps omni channel',
  'bx_console',
  'channel strip',
  'ssl 4000 e',
  'ssl 4000 g',
  'neve vrs',
  'api 550',
  'api 560',
  'api 2500'
];

export const isChannelStrip = (pluginName: string): boolean => {
  return CHANNEL_STRIP_NAMES.some(name => pluginName.toLowerCase().includes(name.toLowerCase()));
};
