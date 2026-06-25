const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    function get(targetUrl) {
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            get(redirectUrl);
            return;
          }
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode} for ${targetUrl}`));
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', err => reject(err));
    }
    get(url);
  });
}

function parseSliders(code) {
  const sliders = [];
  const lines = code.split('\n');
  const sliderRegex = /slider(\d+)\s*:\s*([^<]*)<([^>]+)>\s*(.*)/i;
  for (let line of lines) {
    const match = line.match(sliderRegex);
    if (match) {
      const index = parseInt(match[1]);
      let defValRaw = match[2].trim();
      const rangeParts = match[3].split(',');
      const name = match[4].trim();
      let min = 0, max = 1, step = 1;
      let options = null;
      if (rangeParts.length >= 1) min = parseFloat(rangeParts[0]) || 0;
      if (rangeParts.length >= 2) max = parseFloat(rangeParts[1]) || 1;
      if (rangeParts.length >= 3) {
        let stepRaw = rangeParts[2].trim();
        const braceMatch = stepRaw.match(/([^\{]+)?\{([^\}]+)\}/);
        if (braceMatch) {
          step = parseFloat(braceMatch[1]) || 1;
          options = braceMatch[2].split(',').map(o => o.trim());
        } else {
          step = parseFloat(stepRaw) || 1;
        }
      }
      let defaultVal = parseFloat(defValRaw);
      if (isNaN(defaultVal)) defaultVal = min;
      sliders.push({ index: index - 1, name, min, max, defaultVal, description: options ? `Options: ${options.join(', ')}` : name, options });
    }
  }
  sliders.sort((a, b) => a.index - b.index);
  return sliders;
}

async function main() {
  const xml = fs.readFileSync('mpl_index.xml', 'utf8');
  const reapackRegex = /<reapack name="([^"]+)" type="([^"]+)"[^>]*>([\s\S]*?)<\/reapack>/g;
  let match;
  const jsfxSources = [];
  
  while ((match = reapackRegex.exec(xml)) !== null) {
    const rName = match[1];
    const innerXml = match[3];
    if (innerXml.toLowerCase().includes('.jsfx')) {
       // Find latest version
       const versionRegex = /<version name="([^"]+)"[^>]*>([\s\S]*?)<\/version>/g;
       let vMatch, latestVersion;
       while ((vMatch = versionRegex.exec(innerXml)) !== null) latestVersion = vMatch;
       
       if (latestVersion) {
         const sourceRegex = /<source[^>]*file="([^"]+)"[^>]*>([^<]+)<\/source>/g;
         let sMatch;
         while ((sMatch = sourceRegex.exec(latestVersion[2])) !== null) {
           if (sMatch[1].toLowerCase().endsWith('.jsfx')) {
             jsfxSources.push({ name: rName, filename: sMatch[1], url: sMatch[2].trim() });
           }
         }
       }
    }
  }

  console.log(`Found ${jsfxSources.length} JSFX sources in MPL index.`);
  const results = [];
  for (const s of jsfxSources) {
    console.log(`Fetching ${s.filename}...`);
    try {
      const code = await fetchUrl(s.url);
      const sliders = parseSliders(code);
      results.push({
        name: `JS: MPL/${s.filename.split('/').pop().replace('.jsfx', '')}`,
        shortName: s.filename.split('/').pop().replace('.jsfx', ''),
        category: "Utility",
        description: `Specialized utility from Michael Pilyavskiy (MPL).`,
        howItWorks: "Professional REAPER script integration and DSP routing.",
        proTips: "Check the MPL forum thread on Cockos for advanced usage.",
        sliders: sliders,
        packRequired: 'MPL Scripts'
      });
    } catch (e) { console.error(e); }
    await new Promise(r => setTimeout(r, 100));
  }
  fs.writeFileSync('mpl_profiles.json', JSON.stringify(results, null, 2));
  console.log('Saved to mpl_profiles.json');
}

main();
