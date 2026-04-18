import { execSync } from 'child_process';
import fs from 'fs';

try {
  execSync('npx tsc --noEmit', { encoding: 'utf-8' });
  console.log('No errors found!');
} catch (error) {
  const output = error.stdout || error.message;
  const lines = output.split('\n');
  const linesToDelete = [];

  for (const line of lines) {
    const match = line.match(/src\/i18n\.ts\((\d+),\d+\): error TS1117:/);
    if (match) {
      linesToDelete.push(parseInt(match[1], 10));
    }
  }

  if (linesToDelete.length > 0) {
    // Sort descending so we can delete from bottom to top without messing up line numbers
    linesToDelete.sort((a, b) => b - a);
    
    // Remove duplicates just in case
    const uniqueLinesToDelete = [...new Set(linesToDelete)];

    let fileContent = fs.readFileSync('src/i18n.ts', 'utf-8').split('\n');
    
    for (const lineNum of uniqueLinesToDelete) {
      console.log(`Deleting line ${lineNum}: ${fileContent[lineNum - 1]}`);
      fileContent.splice(lineNum - 1, 1);
    }

    fs.writeFileSync('src/i18n.ts', fileContent.join('\n'));
    console.log(`Deleted ${uniqueLinesToDelete.length} duplicate lines.`);
  } else {
    console.log('No TS1117 errors found.');
    console.log(output);
  }
}
