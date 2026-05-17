const fs = require('fs');

let content = fs.readFileSync('src/components/DAWGuide.tsx', 'utf8');

// Replace &gt; with {'>'}
content = content.replace(/&gt;/g, "{'>'}");

fs.writeFileSync('src/components/DAWGuide.tsx', content);

console.log('Fixed &gt; in DAWGuide.tsx');
