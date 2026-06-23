const fs = require('fs');
let code = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf8');
const regex = /<div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Lyric Tool Expandable Section \*\/\}/m;
console.log('Test result:', regex.test(code));
