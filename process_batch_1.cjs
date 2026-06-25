const { execSync } = require('child_process');

const repos = [
  { name: "chmaha Scripts", url: "https://github.com/chmaha/ReaClassical/raw/main/index.xml" },
  { name: "Claudiohbsantos Scripts", url: "https://github.com/Claudiohbsantos/Claudiohbsantos-Scripts/raw/master/index.xml" },
  { name: "Erriez", url: "https://github.com/Erriez/erriez-reaper-jsfx/raw/master/index.xml" },
  { name: "IX", url: "https://github.com/IXix/JSFX/raw/master/index.xml" }
];

for (const repo of repos) {
  console.log(`\n--- Processing ${repo.name} ---`);
  try {
    execSync(`node clean_temp.cjs`);
    execSync(`node process_repo.cjs "${repo.name}" "${repo.url}" "${repo.name}"`);
    execSync(`node append_to_db.cjs`);
  } catch (e) {
    console.error(`Error processing ${repo.name}: ${e.message}`);
  }
}
