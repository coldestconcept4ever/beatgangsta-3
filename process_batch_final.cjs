const { execSync } = require('child_process');

const repos = [
  { name: "chmaha Scripts", url: "https://github.com/chmaha/ReaClassical/raw/main/index.xml", pack: "chmaha Scripts" },
  { name: "Claudiohbsantos Scripts", url: "https://github.com/Claudiohbsantos/Claudiohbsantos-Scripts/raw/master/index.xml", pack: "Claudiohbsantos Scripts" },
  { name: "Erriez", url: "https://github.com/Erriez/erriez-reaper-jsfx/raw/master/index.xml", pack: "Erriez" },
  { name: "Juan_R", url: "https://github.com/juanriccio/Reaperism/raw/master/index.xml", pack: "Juan_R's Reaperism" },
  { name: "kawa Scripts", url: "https://bitbucket.org/kawaCat/reascript-m2bpack/raw/master/index.xml", pack: "kawa Scripts" },
  { name: "mrlimbic scripts", url: "https://github.com/mrlimbic/reascripts/raw/master/index.xml", pack: "mrlimbic scripts" },
  { name: "ply Scripts", url: "https://ply.github.io/ReaScripts/index.xml", pack: "ply Scripts" },
  { name: "RCJacH Scripts", url: "https://github.com/RCJacH/ReaScripts/raw/master/index.xml", pack: "RCJacH Scripts" },
  { name: "ReJJ", url: "https://github.com/Justin-Johnson/ReJJ/raw/master/index.xml", pack: "ReJJ" },
  { name: "Souk21 ReaPack", url: "https://github.com/Souk21/REAPER-scripts-and-effects/raw/master/index.xml", pack: "Souk21 ReaPack" },
  { name: "Tormy Van Cool", url: "https://github.com/tormyvancool/TormyVanCool_ReaPack_Scripts/raw/master/index.xml", pack: "Tormy Van Cool ReaPack Scripts" },
  { name: "X-Raym MIDI Makey Makey", url: "https://github.com/X-Raym/MIDI-Makey-Makey/raw/master/index.xml", pack: "X-Raym MIDI Makey Makey" },
  { name: "zaibuyidao Scripts", url: "https://github.com/zaibuyidao/ReaScripts/raw/master/index.xml", pack: "zaibuyidao Scripts" }
];

for (const repo of repos) {
  console.log(`\n--- Processing ${repo.name} ---`);
  try {
    execSync(`node clean_temp.cjs`);
    execSync(`node process_repo.cjs "${repo.name}" "${repo.url}" "${repo.pack}"`);
    execSync(`node append_to_db.cjs`);
  } catch (e) {
    console.error(`Error processing ${repo.name}: ${e.message}`);
  }
}
