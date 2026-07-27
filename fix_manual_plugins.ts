import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add State
content = content.replace(
  /const \[searchTerm, setSearchTerm\] = useState<string>\(''\);/,
  `const [searchTerm, setSearchTerm] = useState<string>('');\n  const [manualPluginName, setManualPluginName] = useState<string>('');\n  const [manualPluginBrand, setManualPluginBrand] = useState<string>('');\n  const [isResearching, setIsResearching] = useState<boolean>(false);`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
