import { DeepDivePlugin } from '../types';

export const createFxChain = (ctx: AudioContext, fxPlugins: DeepDivePlugin[]): { input: AudioNode, output: AudioNode } => {
  const input = ctx.createGain();
  let lastNode: AudioNode = input;

  fxPlugins.forEach(plugin => {
    let effectNode: AudioNode;
    
    // Simple mapping of plugin names to Web Audio nodes
    console.log(`Creating FX for plugin: ${plugin.name}`);
    if (plugin.name.toLowerCase().includes('reverb')) {
      effectNode = ctx.createConvolver();
      // In a real implementation, we'd load an impulse response here
      console.log(`Created Convolver for ${plugin.name}`);
    } else if (plugin.name.toLowerCase().includes('compressor')) {
      effectNode = ctx.createDynamicsCompressor();
      console.log(`Created Compressor for ${plugin.name}`);
    } else if (plugin.name.toLowerCase().includes('filter') || plugin.name.toLowerCase().includes('eq')) {
      effectNode = ctx.createBiquadFilter();
      console.log(`Created BiquadFilter for ${plugin.name}`);
    } else {
      // Fallback to gain node for unknown effects
      effectNode = ctx.createGain();
      console.log(`Created Gain for ${plugin.name}`);
    }

    lastNode.connect(effectNode);
    lastNode = effectNode;
  });

  const output = lastNode;
  return { input, output };
};
