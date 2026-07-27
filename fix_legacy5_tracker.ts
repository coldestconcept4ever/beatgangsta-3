import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 116,
  name: "uad ua 1176ln legacy limiter",
  displayName: "UAD UA 1176LN Legacy Limiter",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});
data.auditHistory.push({
  number: 117,
  name: "uad ua 1176se legacy limiter",
  displayName: "UAD UA 1176SE Legacy Limiter",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});
data.auditHistory.push({
  number: 118,
  name: "uad pultec-pro legacy eq",
  displayName: "UAD Pultec-Pro Legacy EQ",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});
data.auditHistory.push({
  number: 119,
  name: "uad fairchild 670 legacy limiter",
  displayName: "UAD Fairchild 670 Legacy Limiter",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});
data.auditHistory.push({
  number: 120,
  name: "uad dreamverb room modeler",
  displayName: "UAD DreamVerb Room Modeler",
  auditedAt: new Date().toISOString(),
  status: "Approved"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
