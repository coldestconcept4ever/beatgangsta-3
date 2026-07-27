import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.currentAudit = {
  number: 41,
  name: "uad korg sdd-3000 digital delay",
  displayName: "UAD Korg SDD-3000 Digital Delay",
  status: "Approved & Updated"
};

data.auditHistory.push({
  number: 41,
  name: "uad korg sdd-3000 digital delay",
  displayName: "UAD Korg SDD-3000 Digital Delay",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
