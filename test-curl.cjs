const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key");
    process.exit(1);
}

const { getUnifiedRecipeSchema } = require('./dist/lib/schemaForTest.cjs');

const reqBody = {
    contents: [
        {
            role: "user",
            parts: [{ text: "Generate a beat" }]
        }
    ],
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: getUnifiedRecipeSchema()
    }
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
}).then(async r => {
    console.log(r.status);
    console.log(await r.text());
}).catch(e => {
    console.error(e);
});
