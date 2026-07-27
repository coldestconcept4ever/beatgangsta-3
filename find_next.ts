import fs from 'fs';
import { UAD_DATABASE } from './src/data/uadDatabase.ts';

const tracker = JSON.parse(fs.readFileSync("./src/data/uadAuditTracker.json", "utf-8"));
const auditedNames = new Set(tracker.auditHistory.map((a: any) => a.name));

console.log(`Audited: ${auditedNames.size}`);

const next = UAD_DATABASE.filter(p => !auditedNames.has(p.name)).slice(0, 5);
console.log("Next to audit:");
next.forEach(p => console.log(p.name));
