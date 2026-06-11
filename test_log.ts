import fs from 'fs';

const input = fs.readFileSync('src/App.tsx', 'utf8');
const lines = input.split('\n');

for (const line of lines) {
    if (line.includes('csvParsed =')) {
        console.log(line);
    }
}
