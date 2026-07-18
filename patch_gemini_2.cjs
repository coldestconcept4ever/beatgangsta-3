const fs = require('fs');
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const target = `and 6th: dedicated high-headroom output volume staging via a tool like JS: Volume/Pan to gain-match completely). The 6th plugin MUST be explicitly dedicated to volume gain-staging, ensuring absolutely no volume loss or signal degradation, making the vocal sit with intense gravity and clarity directly in the face of the listener. Ensure that any compression peak levels reduction is offset by matching makeup gain inside the plugin settings.`;

const replacement = `and 6th: dedicated high-headroom output volume staging via a tool like JS: Volume/Pan to gain-match completely). The 6th plugin MUST be explicitly dedicated to precise volume gain-matching, perfectly preserving the original input volume of the stem. You MUST NOT increase the overall perceived volume of the stem. Ensure that any compression peak levels reduction is exactly offset by matching makeup gain inside the plugin settings, resulting in zero net volume change.`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/services/geminiService.ts', code);
    console.log("Patched successfully");
} else {
    console.log("Target string not found!");
}
