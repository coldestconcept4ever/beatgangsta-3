import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 121,
  name: "uad cambridge eq",
  displayName: "UAD Cambridge EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});
data.auditHistory.push({
  number: 122,
  name: "uad realverb-pro room modeler",
  displayName: "UAD RealVerb-Pro Room Modeler",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
