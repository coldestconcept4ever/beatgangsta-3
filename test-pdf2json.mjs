import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import PDFParser from "pdf2json";

async function run() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText('Hello World from pdf2json');
  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // 1 = raw text
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}
run().then(res => console.log("SUCCESS:", res)).catch(console.error);
