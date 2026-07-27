import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 84,
  name: "uad lexicon 224 digital reverb",
  displayName: "UAD Lexicon 224 Digital Reverb",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

data.auditHistory.push({
  number: 85,
  name: "uad lexicon 224 legacy",
  displayName: "UAD Lexicon 224 Digital Reverb (Legacy)",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
