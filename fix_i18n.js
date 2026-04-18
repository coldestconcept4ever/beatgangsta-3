import fs from 'fs';

const i18nPath = 'src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

// Fix the broken "}}"
content = content.replace(/\\}\\}"/g, '');
content = content.replace(/\\}\\}\\s*plugins\\."/g, '');
content = content.replace(/\\}\\}\\s*"/g, '');

// The issue is that the keys were appended with `}}"` or similar.
// Let's just do a clean regex fix for the broken lines.
content = content.replace(/"rig_manager": "Rig Manager"\}\}"/g, '"rig_manager": "Rig Manager"');
content = content.replace(/"rig_manager": "Gestor de Equipo"\}\} plugins\."/g, '"rig_manager": "Gestor de Equipo"');
content = content.replace(/"rig_manager": "Gestionnaire d'Équipement"\}\}"/g, '"rig_manager": "Gestionnaire d\'Équipement"');
content = content.replace(/"rig_manager": "Менеджер оборудования"\}\}"/g, '"rig_manager": "Менеджер оборудования"');
content = content.replace(/"rig_manager": "Gerenciador de Equipamento"\}\}"/g, '"rig_manager": "Gerenciador de Equipamento"');

fs.writeFileSync(i18nPath, content);
console.log('Fixed i18n.ts');
