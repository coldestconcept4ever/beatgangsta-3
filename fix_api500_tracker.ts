import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 66,
  name: "uad api 550a",
  displayName: "UAD API 550A Parametric EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

data.auditHistory.push({
  number: 67,
  name: "uad api 560",
  displayName: "UAD API 560 Graphic EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
