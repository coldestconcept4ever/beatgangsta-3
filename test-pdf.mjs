import fs from "fs";
import pdfParse from "pdf-parse";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage();
page.drawText('Hello World');
const pdfBytes = await pdfDoc.save();
const buffer = Buffer.from(pdfBytes);
try {
  const result = await pdfParse(buffer);
  console.log("PDF parsed successfully!");
  console.log(result.text);
} catch (e) {
  console.error("FAILED", e);
}
