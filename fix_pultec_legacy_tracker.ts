import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 123,
  name: "uad pultec eqp-1a legacy eq",
  displayName: "UAD Pultec EQP-1A Legacy EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
