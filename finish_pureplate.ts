import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.currentAudit.status = "Approved & Updated";

data.auditHistory.push({
  number: 43,
  name: "uad pure plate reverb",
  displayName: "UAD Pure Plate Reverb",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
