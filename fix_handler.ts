import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const handler = `
  const handleManualResearchAndAdd = async () => {
    if (!manualPluginName.trim() || !manualPluginBrand.trim()) return;
    setIsResearching(true);
    try {
      const pluginToResearch: VSTPlugin = {
        name: manualPluginName.trim(),
        vendor: manualPluginBrand.trim(),
        type: 'vst'
      };
      // Use the geminiService function to get category & parameters
      const researchedPlugin = await researchPluginParameters(pluginToResearch, i18n.language);
      
      setPlugins(prev => {
        // Prevent duplicates
        if (prev.some(p => p.name === researchedPlugin.name && p.vendor === researchedPlugin.vendor)) {
          return prev;
        }
        return [...prev, researchedPlugin];
      });
      
      setManualPluginName('');
      setManualPluginBrand('');
    } catch (err) {
      console.error('Failed to research plugin:', err);
      // Fallback: add it without parameters
      setPlugins(prev => {
        if (prev.some(p => p.name === manualPluginName.trim() && p.vendor === manualPluginBrand.trim())) {
          return prev;
        }
        return [...prev, { name: manualPluginName.trim(), vendor: manualPluginBrand.trim(), type: 'vst' }];
      });
      setManualPluginName('');
      setManualPluginBrand('');
    } finally {
      setIsResearching(false);
    }
  };

  const handleTypeBeatSearch = async () => {`;

content = content.replace(/  const handleTypeBeatSearch = async \(\) => \{/, handler);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
