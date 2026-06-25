const fs = require('fs');
if (fs.existsSync('temp_profiles.json')) fs.unlinkSync('temp_profiles.json');
console.log('Deleted temp_profiles.json');
