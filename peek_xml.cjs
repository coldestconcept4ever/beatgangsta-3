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

async function main() {
  const url = 'https://github.com/X-Raym/REAPER-ReaScripts/raw/master/index.xml';
  const xml = await fetchUrl(url);
  console.log(xml.substring(0, 2000));
}
main();
