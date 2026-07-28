import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('const [lunaSumming')) {
  content = content.replace(
    /const \[dawType, setDawType\] = useState<string \| null>/,
    `const [lunaSumming, setLunaSumming] = useState<'api' | 'neve' | 'off'>('off');\n  const [lunaTape, setLunaTape] = useState<'oxide' | 'studer' | 'off'>('off');\n  const [dawType, setDawType] = useState<string | null>`
  );
  fs.writeFileSync('src/App.tsx', content, 'utf-8');
}
