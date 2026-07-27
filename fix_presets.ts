import fs from 'fs';

const DB_PATH = './src/data/uadPresets.ts';
let content = fs.readFileSync(DB_PATH, 'utf-8');

content = content.replace(/"uad korg sdd-3000": \[/g, '"uad korg sdd-3000 digital delay": [');

fs.writeFileSync(DB_PATH, content, 'utf-8');
