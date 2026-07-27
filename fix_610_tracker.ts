import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 58,
  name: "uad ua 610-a tube preamp and eq",
  displayName: "UAD UA 610-A Tube Preamp and EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

data.auditHistory.push({
  number: 59,
  name: "uad ua 610-b tube preamp and eq",
  displayName: "UAD UA 610-B Tube Preamp and EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
