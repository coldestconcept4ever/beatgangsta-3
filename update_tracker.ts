import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.currentAudit = {
  number: 45,
  name: "uad antares auto-tune realtime",
  displayName: "UAD Antares Auto-Tune Realtime",
  status: "In Progress"
};

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
