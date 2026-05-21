const axios = require('axios');
(async () => {
  try {
    const res = await axios.get('https://cdn.discordapp.com/attachments/1452802071014150244/1507037503746740244/OsamaSon_-_off_that_Instrumental.mp3?ex=6a10718c&is=6a0f200c&hm=e36506d80c1fb61', {
      responseType: 'arraybuffer'
    });
    console.log("Success! size:", res.data.length);
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response) {
       console.error("Status:", e.response.status);
    }
  }
})();
