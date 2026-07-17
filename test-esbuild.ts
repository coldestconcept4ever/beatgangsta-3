if (process.env.INCLUDE_WORKER) {
  require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
}
