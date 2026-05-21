const axios = require('axios');
(async () => {
  try {
    const res = await axios.options('https://cdn.discordapp.com/attachments/1452802071014150244/1507037503746740244/OsamaSon_-_off_that_Instrumental.mp3?ex=6a10718c&is=6a0f200c&hm=e36506d80c1fb61', {
      headers: {
        'Origin': 'https://www.beatgangsta.com',
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log("Success CORS:", res.headers);
  } catch (e) {
    if (e.response) {
       console.log("Error CORS status:", e.response.status);
       console.log("Headers:", e.response.headers);
    } else {
       console.error("Network error:", e.message);
    }
  }
})();
