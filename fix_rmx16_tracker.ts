import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.auditHistory.push({
  number: 54,
  name: "uad ams rmx16 expanded digital reverb",
  displayName: "UAD AMS RMX16 Expanded Digital Reverb",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

data.auditHistory.push({
  number: 55,
  name: "uad ams rmx16 digital reverb", // It's still audited, just renamed
  displayName: "UAD AMS RMX16 Digital Reverb (Legacy)",
  auditedAt: new Date().toISOString(),
  status: "Approved & Updated"
});

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
