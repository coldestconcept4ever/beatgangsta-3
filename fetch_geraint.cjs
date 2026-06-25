const https = require('https');
const fs = require('fs');

const url = 'https://geraintluff.github.io/jsfx/index.xml';

https.get(url, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    fs.writeFileSync('geraint_index.xml', data, 'utf8');
    console.log('Successfully fetched Geraint index.xml, size:', data.length);
    
    // Parse reapack names
    const reapackRegex = /<reapack\s+name="([^"]+)"[^>]*>/g;
    let match;
    const names = [];
    while ((match = reapackRegex.exec(data)) !== null) {
      names.push(match[1]);
    }
    console.log('Found', names.length, 'plugins in Geraint Luff pack:');
    console.log(names);
  });
});
