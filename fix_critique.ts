import fs from 'fs';

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Provide all parameters that exist on the actual plugin interface\. Do not generate an artificial number of parameters, just use the real parameters the plugin has\./g, 'List every parameter that exists on the actual plugin interface. Take your time to be complete and thorough. Only include the real parameters this plugin actually has.');

content = content.replace(/\\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals\. You MUST incorporate this into your analysis and advice:\\n"\${userContext}"\\n/g, '\\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice ALWAYS, IT IS THE MOST IMPORTANT INSTRUCTION:\\n"${userContext}"\\n');

fs.writeFileSync(file, content);
console.log("Done");
