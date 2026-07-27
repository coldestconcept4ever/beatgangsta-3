import fs from 'fs';

const DB_PATH = './src/data/uadAuditTracker.json';
let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

data.currentAudit = data.auditHistory.length + 1; // It was starting at 1. Wait, if auditHistory has 52 items, next is 53.
fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
