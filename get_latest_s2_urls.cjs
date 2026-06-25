const fs = require('fs');

const xml = fs.readFileSync('tukan_index2.xml', 'utf8');

// Find the "Series 2 (Tukan)" reapack
const startIdx = xml.indexOf('name="Series 2 (Tukan)"');
if (startIdx === -1) {
  console.error('Series 2 (Tukan) reapack not found');
  process.exit(1);
}

const endIdx = xml.indexOf('</reapack>', startIdx);
const reapackBody = xml.slice(startIdx, endIdx);

// Find all version tags inside it
const versionRegex = /<version\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/version>/g;
let match;
let latestVersionName = '';
let latestVersionBody = '';

while ((match = versionRegex.exec(reapackBody)) !== null) {
  latestVersionName = match[1];
  latestVersionBody = match[2];
}

console.log(`Latest version of Series 2 is: ${latestVersionName}`);

// Now find all sources in the latest version body
const sourceRegex = /<source\s+file="([^"]+)"[^>]*>([^<]+)<\/source>/g;
let sMatch;
const s2Plugins = [];

while ((sMatch = sourceRegex.exec(latestVersionBody)) !== null) {
  const file = sMatch[1];
  const url = sMatch[2].trim();
  
  // If the file is a main plugin file (usually starts with a color name or instrument name, and does not end in .jsfx-inc, .png under S2GFX unless it's a main source)
  // Let's filter: if the URL ends in .png, but its file attribute is NOT inside "S2GFX/" directory or contains a space, let's inspect:
  if (!file.startsWith('S2GFX/')) {
    s2Plugins.push({ file, url });
  }
}

console.log(`Found ${s2Plugins.length} S2 plugins in the latest version:`);
console.log(JSON.stringify(s2Plugins, null, 2));

fs.writeFileSync('s2_latest_plugins.json', JSON.stringify(s2Plugins, null, 2), 'utf8');
