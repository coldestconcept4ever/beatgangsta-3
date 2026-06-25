const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/TukanStudios/TUKAN_STUDIOS_PLUGINS/main/index2.xml';
const fileStream = fs.createWriteStream('tukan_index2.xml');

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    process.exit(1);
  }
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Successfully downloaded tukan_index2.xml!');
    const stats = fs.statSync('tukan_index2.xml');
    console.log(`File size: ${stats.size} bytes`);
    process.exit(0);
  });
}).on('error', err => {
  console.error('Error downloading:', err);
  process.exit(1);
});
