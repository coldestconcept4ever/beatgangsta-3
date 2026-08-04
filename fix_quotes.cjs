const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

content = content.replace(/'method doesn't allow unregistered callers'/g, "'method doesn\\'t allow unregistered callers'");
content = content.replace(/'\{"query": "", "advice": "I'm sorry, I couldn't generate a response.", "recommendedChai\\n": \[\]\}'/g, "'{\"query\": \"\", \"advice\": \"I\\'m sorry, I couldn\\'t generate a response.\", \"recommendedChain\": []}'");

fs.writeFileSync('src/services/geminiService.ts', content);
