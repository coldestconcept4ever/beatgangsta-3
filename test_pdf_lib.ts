import { PDFDocument } from "pdf-lib";
async function run() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([500, 1000]);
  page.drawText("Hello World at the top", { x: 50, y: 950 });
  page.drawText("Hello World at the bottom", { x: 50, y: 50 });
  const bytes = await doc.save();

  const doc2 = await PDFDocument.create();
  const [embedded] = await doc2.embedPdf(bytes, [0]);
  
  const p1 = doc2.addPage([500, 500]);
  p1.drawPage(embedded, { x: 0, y: -500 }); // top half

  const p2 = doc2.addPage([500, 500]);
  p2.drawPage(embedded, { x: 0, y: 0 }); // bottom half

  console.log("Success!");
}
run();
