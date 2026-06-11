import * as fs from 'fs';

const input = fs.readFileSync('user_input.txt', 'utf8');

const parsePluginsTest = (input: string) => {
    const lines = input.trim().split('\n');
    const isMixcraftXml = input.includes('<VSTPlugins>') || input.includes('<Plugin ') || input.includes('<vst-inventory>') || input.includes('<PreSonus>') || input.includes('<Components>') || input.includes('<Component ') || input.includes('<?xml') || input.includes('<Settings>') || input.includes('<ClassDescription') || input.includes('<Attributes');

    const csvLines = lines.filter(line => {
        const trimmed = line.trim().replace(/^\uFEFF/, ''); 
        if (!trimmed) return false;
        
        if (trimmed.startsWith('<') || trimmed.startsWith('?') || trimmed.startsWith('/') || trimmed.startsWith(']') || trimmed.startsWith('!') || trimmed.startsWith('<?')) {
          return false;
        }
        
        const parts = trimmed.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        return parts.length >= 2 && !trimmed.toLowerCase().includes('xmlns=') && (trimmed.includes(',') || trimmed.includes('\t')) && !trimmed.includes('<?xml');
      });

    console.log("CSV Lines count:", csvLines.length);

    let countCsvHeaderSkipped = 0;
    let csvParsedCount = 0;

    csvLines.forEach(line => {
        const trimmedLine = line.trim().replace(/^\uFEFF/, '');
        
        const lower = trimmedLine.toLowerCase();
        if (lower.startsWith('vendor,name') || lower.startsWith('"vendor","name"')) {
          countCsvHeaderSkipped++;
          return;
        }

        const parts = trimmedLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
            csvParsedCount++;
        }
    });

    console.log("CSV Parsed count:", csvParsedCount);
}

parsePluginsTest(input);
