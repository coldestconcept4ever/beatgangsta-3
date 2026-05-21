const https = require('https');
const req = https.request('https://cdn.discordapp.com/attachments/1452802071014150244/1507037503746740244/OsamaSon_-_off_that_Instrumental.mp3?ex=6a10718c&is=6a0f200c&hm=e36506d80c1fb61', { method: 'OPTIONS' }, (res) => {
  console.log(res.headers);
});
req.end();
