const fs = require('fs');
fs.writeFileSync('user_input.txt', process.env.USER_PROMPT || '');
