const https = require('https');
const fs = require('fs');

function download(url, filename, callback) {
  https.get(url, (res) => {
    if (res.statusCode === 404) {
      callback(new Error('404 Not Found'));
      return;
    }
    if (res.statusCode !== 200) {
      callback(new Error(`Failed to download: status ${res.statusCode}`));
      return;
    }
    const fileStream = fs.createWriteStream(filename);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      callback(null);
    });
  }).on('error', err => {
    callback(err);
  });
}

const masterUrl = 'https://raw.githubusercontent.com/Suzuki-Re/Suzuki-Scripts/master/index.xml';
const mainUrl = 'https://raw.githubusercontent.com/Suzuki-Re/Suzuki-Scripts/main/index.xml';

console.log('Attempting to download index.xml from master branch...');
download(masterUrl, 'suzuki_index.xml', (err) => {
  if (err) {
    console.log('Master branch failed or returned 404. Trying main branch...');
    download(mainUrl, 'suzuki_index.xml', (err2) => {
      if (err2) {
        console.error('Failed to download index.xml from both master and main branches:', err2.message);
        process.exit(1);
      } else {
        console.log('Successfully downloaded suzuki_index.xml from main branch!');
        const stats = fs.statSync('suzuki_index.xml');
        console.log(`File size: ${stats.size} bytes`);
        process.exit(0);
      }
    });
  } else {
    console.log('Successfully downloaded suzuki_index.xml from master branch!');
    const stats = fs.statSync('suzuki_index.xml');
    console.log(`File size: ${stats.size} bytes`);
    process.exit(0);
  }
});
