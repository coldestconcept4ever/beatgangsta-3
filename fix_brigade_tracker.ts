import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 42,
  name: "uad brigade chorus",
  displayName: "UAD Brigade Chorus",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
