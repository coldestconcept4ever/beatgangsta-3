const fs = require('fs');

async function main() {
    try {
        const file = 'src/data/jsfxResearch.ts';
        const content = fs.readFileSync(file, 'utf8');

        const prefixIndex = content.indexOf('export const JSFX_DATABASE: JSFXProfile[] = [');
        if (prefixIndex === -1) {
            console.error('JSFX_DATABASE not found!');
            process.exit(1);
        }

        const prefix = content.substring(0, prefixIndex + 'export const JSFX_DATABASE: JSFXProfile[] = ['.length);
        const suffixIndex = content.lastIndexOf('];');
        if (suffixIndex === -1) {
            console.error('Closing bracket not found!');
            process.exit(1);
        }

        const arrayBody = content.substring(prefixIndex + 'export const JSFX_DATABASE: JSFXProfile[] = ['.length, suffixIndex).trim();

        // Evaluate the array body as a JS array
        const jsArray = eval('[' + arrayBody + ']');
        console.log('Original database size:', jsArray.length);

        const unique = [];
        const seen = new Set();
        let skipped = 0;
        for (const item of jsArray) {
            if (!item) {
                skipped++;
                continue;
            }
            const key = item.name + '::' + (item.packRequired || '');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }

        console.log('Skipped empty/null items:', skipped);
        console.log('Deduplicated database size:', unique.length);

        const formatted = unique.map(item => `  ${JSON.stringify(item, null, 4)}`).join(',\n');
        const newContent = prefix + '\n' + formatted + '\n];\n';

        fs.writeFileSync(file, newContent);
        console.log('Database written and deduplicated successfully.');
    } catch (err) {
        console.error('Error during deduplication:', err);
        process.exit(1);
    }
}

main();
