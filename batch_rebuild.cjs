const { execSync } = require('child_process');

const repos = [
    ["chokehold", "https://github.com/chkhld/jsfx/raw/main/index.xml", "chokehold JSFX"],
    ["Claudiohbsantos", "https://github.com/Claudiohbsantos/Claudiohbsantos-Scripts/raw/master/index.xml", "Claudiohbsantos Scripts"],
    ["Erriez", "https://github.com/Erriez/erriez-reaper-jsfx/raw/master/index.xml", "Erriez"],
    ["Juan_R", "https://raw.githubusercontent.com/juanriccio/Reaperism/master/index.xml", "Juan_R's Reaperism"],
    ["kawa", "https://bitbucket.org/kawaCat/reascript-m2bpack/raw/master/index.xml", "kawa Scripts"],
    ["mrlimbic", "https://github.com/mrlimbic/reascripts/raw/master/index.xml", "mrlimbic scripts"],
    ["ply", "https://ply.github.io/ReaScripts/index.xml", "ply Scripts"],
    ["RCJacH", "https://github.com/RCJacH/ReaScripts/raw/master/index.xml", "RCJacH Scripts"],
    ["ReJJ", "https://github.com/Justin-Johnson/ReJJ/raw/master/index.xml", "ReJJ"],
    ["Souk21", "https://github.com/Souk21/REAPER-scripts-and-effects/raw/master/index.xml", "Souk21 ReaPack"],
    ["Tormy", "https://github.com/tormyvancool/TormyVanCool_ReaPack_Scripts/raw/master/index.xml", "Tormy Van Cool ReaPack Scripts"],
    ["X-Raym-MIDI", "https://github.com/X-Raym/MIDI-Makey-Makey/raw/master/index.xml", "X-Raym MIDI Makey Makey"],
    ["zaibuyidao", "https://github.com/zaibuyidao/ReaScripts/raw/master/index.xml", "zaibuyidao Scripts"]
];

async function run() {
    for (const [repoId, url, packName] of repos) {
        console.log(`\n--- Processing ${repoId} (${packName}) ---`);
        try {
            execSync(`npx -y node clean_temp.cjs`, { stdio: 'inherit' });
            // For chmaha airwindows, we'll limit to first 100 to avoid timeouts
            const limit = repoId === 'chmaha_air' ? 100 : 9999;
            execSync(`npx -y node process_repo.cjs "${repoId}" "${url}" "${packName}" 0 ${limit}`, { stdio: 'inherit' });
            execSync(`npx -y node append_to_db.cjs`, { stdio: 'inherit' });
        } catch (err) {
            console.error(`Failed to process ${repoId}:`, err.message);
        }
    }
}

run();
