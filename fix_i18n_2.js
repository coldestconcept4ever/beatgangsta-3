import fs from 'fs';

const i18nPath = 'src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

// The script previously did: content.replace(/\\}\\}"/g, '');
// This removed `}}"` from things like `"Remove {{type}}"` -> `"Remove {{type`
// Wait, if it removed `}}"` then it would be `"Remove {{type` followed by `,`
// So it became `"Remove {{type,`
// Let's fix this by replacing `\{\{([a-zA-Z]+),` with `\{\{$1\}\}",`
content = content.replace(/\{\{([a-zA-Z]+),/g, '{{$1}}",');

// Also check for `}} plugins."` which became ` plugins.`
// Wait, `content.replace(/\\}\\}\\s*plugins\\."/g, '');`
// This removed `}} plugins."` from `"{{count}} plugins."` -> `"{{count`
// Let's fix `"loaded_plugins_count": "Loaded {{count`
content = content.replace(/"loaded_plugins_count": "Loaded \{\{count/g, '"loaded_plugins_count": "Loaded {{count}} plugins."');
content = content.replace(/"loaded_plugins_count": "\{\{count/g, '"loaded_plugins_count": "{{count}} plugins chargés."');
content = content.replace(/"loaded_plugins_count": "Загружено плагинов: \{\{count/g, '"loaded_plugins_count": "Загружено плагинов: {{count}}."');
// Wait, let's just do a regex replace for `\{\{count$` or something.
// Let's just fix the specific broken lines.

fs.writeFileSync(i18nPath, content);
console.log('Fixed i18n.ts again');
