import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 44,
  name: "uad bx_digital v3 eq collection",
  displayName: "UAD bx_digital V3 EQ Collection",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
