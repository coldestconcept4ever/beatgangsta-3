const fs = require('fs');

const file = fs.readFileSync('server.ts', 'utf8');

const routeStart = '  app.post("/api/pdf/split-analyse", async (req, res) => {';
const routeEndRegex = /    \} finally \{\n      clearInterval\(keepAliveInterval\);\n    \}\n  \}\);/;

const startIndex = file.indexOf(routeStart);
const endMatch = file.match(routeEndRegex);

if (startIndex === -1 || !endMatch) {
  console.log("Could not find route boundaries");
  process.exit(1);
}

const endIndex = endMatch.index + endMatch[0].length;

const newRoute = `  app.post("/api/pdf/split-analyse", async (req, res) => {
    req.setTimeout(600000);
    res.setTimeout(600000);

    const userEmail = (req as any).session?.user?.email;
    const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
    const isLocalDev = process.env.NODE_ENV !== 'production';

    if (!isLocalDev && (!userEmail || !authorizedEmails.includes(userEmail))) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { tempFilePath, userPrompt } = req.body;
    if (!tempFilePath) {
      return res.status(400).json({ error: "Missing tempFilePath data" });
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    const keepAliveInterval = setInterval(() => { res.write(" "); }, 15000);

    try {
      if (!fs.existsSync(tempFilePath)) {
        res.write(JSON.stringify({ error: "Uploaded file not found or expired." }));
        return res.end();
      }

      let pdfBuffer = fs.readFileSync(tempFilePath);
      const { PDFDocument } = await import("pdf-lib");
      const srcDoc = await PDFDocument.load(pdfBuffer);
      const totalSrcPages = srcDoc.getPageCount();

      const baseTempName = require('path').basename(tempFilePath);
      let originalFileName = "document.pdf";
      const fnMatch = baseTempName.match(/^pdfsplit-[^-]+-(.+)$/);
      if (fnMatch && fnMatch[1]) {
        originalFileName = fnMatch[1];
      } else {
        originalFileName = baseTempName.replace(/^pdfsplit-/, "");
      }
      const originalFileNameWithoutExt = originalFileName.replace(/\\.pdf$/i, "");

      const splitFiles: { fileName: string; pages: number[]; reason: string; base64: string }[] = [];
      const apiKey = process.env.GEMINI_API_KEY;
      let ai = null;
      if (apiKey) {
         const { GoogleGenAI } = await import("@google/genai");
         ai = new GoogleGenAI({ apiKey });
      }

      // Check if there are any tall pages
      let hasTallPages = false;
      for (let i = 0; i < totalSrcPages; i++) {
        const { height } = srcDoc.getPage(i).getSize();
        if (height > 1000) { // Standard is 792. >1000 means it's an extended/tall page
          hasTallPages = true;
          break;
        }
      }

      if (hasTallPages) {
        console.log("[PDF SPLITTER] Tall page detected. Using physical vision-based slicing.");
        const combinedDoc = await PDFDocument.create();
        
        for (let pIdx = 0; pIdx < totalSrcPages; pIdx++) {
            const page = srcDoc.getPage(pIdx);
            const { width, height } = page.getSize();
            const targetRatio = 11 / 8.5; 
            const idealSliceHeight = width * targetRatio;
            const numSlices = Math.max(1, Math.ceil(height / idealSliceHeight));

            if (numSlices > 1) {
                const idealCuts1000 = [];
                for (let i = 1; i < numSlices; i++) {
                    idealCuts1000.push(Math.round((i / numSlices) * 1000));
                }

                let cutPointsGemini = [...idealCuts1000];

                if (ai) {
                    try {
                        const prompt = \`You are an expert visual document analyzer.
Analyze page \${pIdx + 1} of the provided PDF. It is a tall screenshot or scanned document.
I need to slice this page horizontally into \${numSlices} standard printable pages.
The ideal cut points (in a normalized 0-1000 Y-coordinate scale, where 0 is the top edge and 1000 is the bottom edge) are roughly: \${JSON.stringify(idealCuts1000)}.
Please visually examine the document at those approximate Y-coordinates and find the nearest safe horizontal gap (empty space, background color) so that no chat bubble, text, or image is cut in half.
Return ONLY a valid JSON array of \${numSlices - 1} integers representing the safe Y-coordinates.
Example format: [205, 410, 605]\`;
                        
                        const response = await ai.models.generateContent({
                            model: "gemini-1.5-pro",
                            contents: [
                                { role: "user", parts: [
                                    { inlineData: { mimeType: "application/pdf", data: pdfBuffer.toString("base64") } },
                                    { text: prompt }
                                ]}
                            ]
                        });
                        
                        const text = response.text || "";
                        const match = text.match(/\\[[\\s\\S]*\\]/);
                        if (match) {
                            const parsed = JSON.parse(match[0]);
                            if (Array.isArray(parsed) && parsed.length === numSlices - 1) {
                                cutPointsGemini = parsed;
                                console.log(\`[PDF SPLITTER] Gemini vision refined cuts for page \${pIdx+1}:\`, cutPointsGemini);
                            }
                        }
                    } catch (err) {
                        console.error("[PDF SPLITTER] Gemini vision split failed for page " + (pIdx+1) + ", falling back to geometric cuts:", err);
                    }
                }

                let pdfCuts = cutPointsGemini.map(gy => height * (1 - (gy / 1000)));
                pdfCuts.sort((a, b) => a - b); 

                const [embedded] = await combinedDoc.embedPdf(pdfBuffer, [pIdx]);
                
                for (let i = pdfCuts.length; i >= 0; i--) {
                    const cutTop = i === pdfCuts.length ? height : pdfCuts[i];
                    const cutBottom = i === 0 ? 0 : pdfCuts[i - 1];
                    const sliceHeight = cutTop - cutBottom;
                    
                    const slicePage = combinedDoc.addPage([width, sliceHeight]);
                    slicePage.drawPage(embedded, {
                        x: 0,
                        y: -cutBottom
                    });
                }
            } else {
                const [copied] = await combinedDoc.copyPages(srcDoc, [pIdx]);
                combinedDoc.addPage(copied);
            }
        }

        const fullDocBase64 = Buffer.from(await combinedDoc.save()).toString('base64');
        splitFiles.push({
            fileName: \`\${originalFileNameWithoutExt}_fits_9x11.pdf\`,
            pages: Array.from({ length: combinedDoc.getPageCount() }, (_, idx) => idx + 1),
            reason: \`Combined document properly sliced into standard 11-inch pages. Print this file for perfect pagination!\`,
            base64: fullDocBase64
        });

      } else {
        // Standard logical splitting for normal-sized PDFs using gemini-2.5-flash
        console.log("[PDF SPLITTER] Normal pages detected. Performing logical text-based split.");
        
        const PDFParse = (await import("pdf-parse")).default;
        const pages: { pageNum: number; text: string }[] = [];
        try {
          const parserInstance = new PDFParse({ data: pdfBuffer });
          const textResult = await parserInstance.getText();
          if (textResult && Array.isArray(textResult.pages)) {
            for (const page of textResult.pages) {
              pages.push({
                pageNum: page.num,
                text: page.text || ""
              });
            }
          }
        } catch (err) {
          console.error("Error during PDF parsing:", err);
        }

        pages.sort((a, b) => a.pageNum - b.pageNum);
        
        if (pages.length === 0) {
          res.write(JSON.stringify({ error: "The uploaded PDF has 0 text pages, and is not a tall image. Cannot perform logical split." }));
          return res.end();
        }

        let documentTextRepresentation = "";
        for (const p of pages) {
          const text = p.text.trim();
          if (text.length > 2000) {
            const firstPart = text.substring(0, 800);
            const lastPart = text.substring(text.length - 800);
            documentTextRepresentation += \`\${firstPart}\\n... [TRUNCATED MID-PAGE CONTENT] ...\\n\${lastPart}\\n\`;
          } else {
            documentTextRepresentation += \`\${text}\\n\`;
          }
          documentTextRepresentation += \`--- END OF PAGE \${p.pageNum} ---\\n\\n\`;
        }

        const prompt = \`You are an AI PDF Splitter agent.
Your task is to analyze a PDF document page-by-page and decide on the optimal page boundaries to split the document into separate logical files based on the user's instructions.

USER INSTRUCTIONS:
"\${userPrompt || "Split this document intelligently into separate sections or documents."}"

CRITICAL LOGICAL INTEGRITY RULES:
1. STRICT TARGET SIZE & SPLIT MANDATE:
   - You MUST fully respect any specific page size limits, target ranges, or division sizes specified by the user.
2. PAGE COVERAGE & INTEGRITY:
   - Every page from the original document MUST be included in EXACTLY ONE split file. Do not omit any pages.
   - The page ranges for each split file must be contiguous (e.g., pages 1-10, pages 11-21, etc.).

Please reply with a JSON object in the following format:
{
  "splits": [
    {
      "fileName": "Descriptive filename.pdf",
      "pages": [1, 2, 3], 
      "reason": "Explain briefly why these pages are grouped together."
    }
  ]
}

Here is the extracted text of the document page-by-page:
\${documentTextRepresentation}

Return ONLY the raw JSON object conforming to the schema above. Do not include markdown code blocks.\`;

        let resultJson;
        if (ai) {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          try {
            const text = response.text || "";
            const cleanJsonText = text.replace(/^\`\`\`json\\s*/i, "").replace(/\`\`\`\\s*$/, "").trim();
            resultJson = JSON.parse(cleanJsonText);
          } catch (e) {
            console.error("Failed to parse Gemini split decision:", e);
            res.write(JSON.stringify({ error: "AI failed to produce a valid split plan." }));
            return res.end();
          }
        } else {
             res.write(JSON.stringify({ error: "Gemini API key missing." }));
             return res.end();
        }

        if (!resultJson || !Array.isArray(resultJson.splits)) {
          res.write(JSON.stringify({ error: "AI split response does not contain a splits list." }));
          return res.end();
        }

        for (const split of resultJson.splits) {
          if (!split.pages || !Array.isArray(split.pages)) continue;
          
          const destDoc = await PDFDocument.create();
          const pageIndicesToCopy: number[] = [];
          
          for (const pNum of split.pages) {
            const pNumVal = parseInt(pNum as any);
            if (isNaN(pNumVal)) continue;
            const idx = pNumVal - 1;
            if (idx >= 0 && idx < totalSrcPages) {
              pageIndicesToCopy.push(idx);
            }
          }
          
          if (pageIndicesToCopy.length > 0) {
            const copiedPages = await destDoc.copyPages(srcDoc, pageIndicesToCopy);
            copiedPages.forEach((page) => destDoc.addPage(page));
            const bytes = await destDoc.save();
            const base64 = Buffer.from(bytes).toString('base64');
            splitFiles.push({
              fileName: split.fileName || \`split_\${Date.now()}.pdf\`,
              pages: split.pages.map(p => parseInt(p as any)).filter(p => !isNaN(p)),
              reason: split.reason || "",
              base64
            });
          }
        }
      }

      try { fs.unlinkSync(tempFilePath); } catch (e) {}
      
      res.write(JSON.stringify({
        success: true,
        splits: splitFiles
      }));
      return res.end();

    } catch (error: any) {
      console.error("Error in PDF split-analyse:", error);
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
      res.write(JSON.stringify({ error: error.message || "Internal server error during PDF splitting" }));
      return res.end();
    } finally {
      clearInterval(keepAliveInterval);
    }
  });`;

const newFile = file.substring(0, startIndex) + newRoute + file.substring(endIndex);
fs.writeFileSync('server.ts', newFile);
console.log("Successfully replaced route!");
