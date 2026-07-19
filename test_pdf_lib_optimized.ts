import { PDFDocument } from "pdf-lib";
import fs from "fs";

async function run() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([500, 1000]);
  page.drawText("Hello World at the top", { x: 50, y: 950 });
  page.drawText("Hello World at the bottom", { x: 50, y: 50 });
  const bytes = await doc.save();

  const combinedDoc = await PDFDocument.create();
  const [embedded] = await combinedDoc.embedPdf(bytes, [0]);
  
  const p1 = combinedDoc.addPage([500, 500]);
  p1.drawPage(embedded, { x: 0, y: -500 });

  const p2 = combinedDoc.addPage([500, 500]);
  p2.drawPage(embedded, { x: 0, y: 0 });

  const resultBytes = await combinedDoc.save();
  console.log("Success! Result size:", resultBytes.length);
}
run();
