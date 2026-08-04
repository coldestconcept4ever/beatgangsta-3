const fs = require('fs');
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

// Undo the n" -> \n"
content = content.replace(/\\n"/g, "n\"");
// Let's also restore the "I'm sorry" correctly.
content = content.replace(/'\{"query": "", "advice": "I\\'m sorry, I couldn\\'t generate a response.", "recommendedChain": \[\]\}'/g, "'{\"query\": \"\", \"advice\": \"I\\'m sorry, I couldn\\'t generate a response.\", \"recommendedChain\": []}'");

fs.writeFileSync('src/services/geminiService.ts', content);
