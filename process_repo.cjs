const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    function get(targetUrl) {
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) { get(redirectUrl); return; }
        }
        if (res.statusCode !== 200) { reject(new Error(`Status ${res.statusCode} for ${targetUrl}`)); return; }
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
  const args = process.argv.slice(2);
  const repoName = args[0];
  const indexUrl = args[1];
  const packName = args[2];
  const startIndex = parseInt(args[3]) || 0;
  const limit = parseInt(args[4]) || 9999;

  console.log(`Processing ${repoName} from ${indexUrl} (Start: ${startIndex}, Limit: ${limit})`);
  const xml = await fetchUrl(indexUrl);
  
  const reapackRegex = /<reapack([\s\S]*?)<\/reapack>/g;
  let match;
  let allJsfxSources = [];
  
  while ((match = reapackRegex.exec(xml)) !== null) {
    const inner = match[1];
    const nameMatch = inner.match(/name="([^"]+)"/);
    const typeMatch = inner.match(/type="([^"]+)"/);
    
    if (!nameMatch || !typeMatch) continue;
    
    const rName = nameMatch[1];
    const type = typeMatch[1];
    
    if (type === 'effect' || inner.toLowerCase().includes('.jsfx')) {
       const versionRegex = /<version([\s\S]*?)<\/version>/g;
       let vMatch, latestVersionInner;
       while ((vMatch = versionRegex.exec(inner)) !== null) latestVersionInner = vMatch[1];
       
       if (latestVersionInner) {
         const sourceWithFileRegex = /<source[^>]*file="([^"]+)"[^>]*>([^<]+)<\/source>/g;
         let sMatch;
         let found = false;
         while ((sMatch = sourceWithFileRegex.exec(latestVersionInner)) !== null) {
           const file = sMatch[1];
           const url = sMatch[2].trim();
           if (file.toLowerCase().endsWith('.jsfx') && !file.toLowerCase().endsWith('.jsfx-inc')) {
             allJsfxSources.push({ name: rName, filename: file, url: url });
             found = true;
           }
         }
         
         if (!found) {
           const simpleSourceRegex = /<source[^>]*>([^<]+)<\/source>/;
           const ssMatch = latestVersionInner.match(simpleSourceRegex);
           if (ssMatch) {
             const url = ssMatch[1].trim();
             if (rName.toLowerCase().endsWith('.jsfx')) {
               allJsfxSources.push({ name: rName, filename: rName, url: url });
             } else if (type === 'effect') {
                allJsfxSources.push({ name: rName, filename: rName + '.jsfx', url: url });
             }
           }
         }
       }
    }
  }

  const jsfxSources = allJsfxSources.slice(startIndex, startIndex + limit);
  console.log(`Total JSFX found: ${allJsfxSources.length}. Processing ${jsfxSources.length} items.`);
  
  const results = [];
  // Load existing if appending
  if (startIndex > 0 && fs.existsSync('temp_profiles.json')) {
      const existing = JSON.parse(fs.readFileSync('temp_profiles.json', 'utf8'));
      results.push(...existing);
  }

  for (const s of jsfxSources) {
    console.log(`Fetching [${results.length + 1}] ${s.filename}...`);
    try {
      const code = await fetchUrl(s.url);
      const sliders = parseSliders(code);
      const fileName = s.filename.split('/').pop().replace('.jsfx', '');
      results.push({
        name: `JS: ${repoName}/${fileName}`,
        shortName: fileName,
        category: fileName.toLowerCase().includes('midi') ? "MIDI" : "Utility",
        description: `High-quality tool from the ${repoName} collection.`,
        howItWorks: "Professional REAPER signal processing algorithm.",
        proTips: `An essential tool in the ${repoName} library.`,
        sliders: sliders,
        packRequired: packName
      });
    } catch (e) { console.error(`Error fetching ${s.filename}: ${e.message}`); }
    // No wait for speed, but risk of rate limit. Let's use 20ms.
    await new Promise(r => setTimeout(r, 20));
  }
  
  fs.writeFileSync('temp_profiles.json', JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} total profiles to temp_profiles.json`);
}

main().catch(console.error);
