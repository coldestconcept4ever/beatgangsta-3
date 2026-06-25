const fs = require('fs');
const databaseFile = 'src/data/jsfxResearch.ts';

async function main() {
    try {
        let databaseCode = fs.readFileSync(databaseFile, 'utf8');
        const profiles = JSON.parse(fs.readFileSync('temp_profiles.json', 'utf8'));
        console.log(`Loaded ${profiles.length} profiles from temp_profiles.json`);

        if (profiles.length === 0) {
            console.log('No profiles to append.');
            return;
        }

        const arrayStartMarker = 'export const JSFX_DATABASE: JSFXProfile[] = [';
        const arrayStart = databaseCode.indexOf(arrayStartMarker);
        if (arrayStart === -1) {
            console.error('Could not find JSFX_DATABASE array start');
            process.exit(1);
        }

        const databaseAfterStart = databaseCode.substring(arrayStart);
        let lastBracketIndexInRest = databaseAfterStart.lastIndexOf('];');

        let prefix;
        if (lastBracketIndexInRest === -1) {
            console.log('Closing bracket missing at end (truncated). Attempting recovery...');
            // Find the last complete object closing brace
            let lastBrace = databaseCode.lastIndexOf('}');
            if (lastBrace === -1) {
                console.error('File is too corrupted to recover automatically.');
                process.exit(1);
            }
            prefix = databaseCode.substring(0, lastBrace + 1);
        } else {
            const lastBracketIndex = arrayStart + lastBracketIndexInRest;
            prefix = databaseCode.substring(0, lastBracketIndex).trim();
        }

        if (!prefix.endsWith(',') && !prefix.endsWith('[')) {
            prefix += ',';
        }

        const formattedProfiles = profiles.map(p => `  ${JSON.stringify(p, null, 4)}`).join(',\n');
        const newCode = prefix + '\n' + formattedProfiles + '\n];\n';

        fs.writeFileSync(databaseFile, newCode);
        console.log(`Successfully appended ${profiles.length} profiles to ${databaseFile}`);
    } catch (err) {
        console.error('Error in append_to_db:', err);
        process.exit(1);
    }
}

main();
