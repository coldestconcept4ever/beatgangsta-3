const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

async function main() {
  try {
    const html = await fetchUrl('https://reapack.com/repos');
    fs.writeFileSync('reapack_repos.html', html);
    console.log('Successfully fetched ReaPack repos page');
  } catch (err) {
    console.error('Error fetching ReaPack repos:', err.message);
  }
}

main();
