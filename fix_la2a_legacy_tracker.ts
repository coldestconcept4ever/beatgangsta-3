import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 115,
  name: "uad teletronix la-2a legacy leveler",
  displayName: "UAD Teletronix LA-2A Legacy Leveler",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
