import fs from 'fs';
import { UAD_DATABASE } from './src/data/uadDatabase.ts';

const PRESETS_PATH = './src/data/uadPresets.ts';
let pContent = fs.readFileSync(PRESETS_PATH, 'utf-8');
const pLines = pContent.split('\n');

const fixedLines = [];
let currentPlugin = "";
for (const line of pLines) {
  const match = line.match(/^\s*"([^"]+)": \[/);
  if (match) {
    currentPlugin = match[1];
  }

  if (line.includes('"Output":')) {
    const pluginEntry = UAD_DATABASE.find(p => p.name === currentPlugin);
    if (pluginEntry) {
      const hasOutputGain = pluginEntry.parameters.some(p => p.name === "Output Gain");
      const hasOutput = pluginEntry.parameters.some(p => p.name === "Output");
      
      if (hasOutputGain && !hasOutput) {
        fixedLines.push(line.replace('"Output":', '"Output Gain":'));
      } else {
        fixedLines.push(line);
      }
    } else {
      fixedLines.push(line);
    }
  } else if (line.includes('"Compression":')) {
     const pluginEntry = UAD_DATABASE.find(p => p.name === currentPlugin);
     if (pluginEntry) {
       const hasCompressionRatio = pluginEntry.parameters.some(p => p.name === "Compression Ratio");
       const hasCompression = pluginEntry.parameters.some(p => p.name === "Compression");
       
       if (hasCompressionRatio && !hasCompression) {
         fixedLines.push(line.replace('"Compression":', '"Compression Ratio":'));
       } else {
         fixedLines.push(line);
       }
     } else {
       fixedLines.push(line);
     }
  }
  else {
    fixedLines.push(line);
  }
}

fs.writeFileSync(PRESETS_PATH, fixedLines.join('\n'), 'utf-8');
