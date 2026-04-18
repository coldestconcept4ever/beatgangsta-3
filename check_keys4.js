import fs from 'fs';

const keys = [
  'no_description_available',
  'vendor_label',
  'type_label',
  'friend_rig_loaded',
  'check_link_correct',
  'invalid_rig_format',
  'could_not_read_rig',
  'rig_manager',
  'sync_gear_with_friends',
  'import_friend_rig_desc',
  'paste_friend_link',
  'or',
  'upload_rig_file',
  'share_your_link',
  'share_rig_desc',
  'no_cloud_rig_created',
  'restore_gear_from_rig',
  'system_backup',
  'system_backup_desc',
  'export_full_backup',
  'restore_backup',
  'cloud_storage',
  'connect_google_drive',
  'backup_to_cloud',
  'restore_from_cloud',
  'setup_cloud_backup',
  'no_rig_imported',
  'no_rig_imported_desc',
  'filter_by',
  'their_gear',
  'your_gear',
  'no_recipes_found',
  'no_recipes_found_desc',
  'friend_starred_recipes',
  'reimagine_button',
  'options',
  'compare',
  'reimagine'
];

const langs = ['en', 'es', 'fr', 'ru', 'pt'];

const content = fs.readFileSync('src/i18n.ts', 'utf-8');

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];
  
  // A more robust way to extract language blocks
  const langRegex = new RegExp(`"${lang}":\\s*\\{\\s*"translation":\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'g');
  const langRegex2 = new RegExp(`${lang}:\\s*\\{\\s*translation:\\s*\\{([\\s\\S]*?)\\}\\s*\\}`, 'g');
  
  let match = langRegex.exec(content) || langRegex2.exec(content);
  
  if (!match) {
      console.log(`Could not find language block for ${lang}`);
      continue;
  }
  
  const langContent = match[1];

  console.log(`Checking ${lang}...`);
  for (const key of keys) {
    if (!langContent.includes(`"${key}":`)) {
      console.log(`Missing key: ${key} in ${lang}`);
    }
  }
}
