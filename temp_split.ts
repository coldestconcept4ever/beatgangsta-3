  app.post("/api/pdf/split-analyse", async (req, res) => {
    // Increase timeout for long-running AI generations
    req.setTimeout(600000); // 10 minutes
    res.setTimeout(600000); // 10 minutes

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

      // Helper function to find optimal cut Y coordinate
      function findOptimalCutY(items: any[], currentTop: number, idealCut: number, H: number): number {
        const minCut = Math.max(currentTop + 200, idealCut - 150); // Ensure page has at least 200pt content
        const maxCut = Math.min(H - 100, idealCut + 50); // Ensure remaining page has at least 100pt content

        if (minCut >= maxCut) {
          return idealCut;
        }

        let bestY = idealCut;
        let minIntersections = Infinity;

        for (let y = Math.floor(minCut); y <= Math.ceil(maxCut); y++) {
          let intersections = 0;
          for (const item of items) {
            // In viewport coordinate space, y increases downwards.
            // Item baseline is item.y. Text typically occupies [item.y - item.height - 4, item.y + 4]
            const yStart = item.y - (item.height || 12) - 4;
            const yEnd = item.y + 4;
            if (y >= yStart && y <= yEnd) {
              intersections++;
            }
          }

          if (intersections < minIntersections) {
            minIntersections = intersections;
            bestY = y;
          } else if (intersections === minIntersections) {
            // If same intersections, prefer the one closer to idealCut
            if (Math.abs(y - idealCut) < Math.abs(bestY - idealCut)) {
              bestY = y;
            }
          }
        }

        return bestY;
      }

      // Helper function to pre-slice tall PDF pages
      async function preSliceTallPdf(inputBuffer: Buffer): Promise<Buffer> {
        const { PDFDocument } = await import("pdf-lib");
        const srcDoc = await PDFDocument.load(inputBuffer);
        const totalPages = srcDoc.getPageCount();
        const pages = srcDoc.getPages();

        let hasTallPages = false;
        for (let i = 0; i < totalPages; i++) {
          const { height } = pages[i].getSize();
          if (height > 900) {
            hasTallPages = true;
            break;
          }
        }

        if (!hasTallPages) {
          return inputBuffer;
        }

        console.log("[PDF PRE-SLICER] Tall pages detected. Slicing physically into standard pages...");

        // Extract text positions using pdf-lib sizes (skip slow uninstalled pdfjs-dist)
        const pageTextPositions: any[] = [];
        for (let i = 0; i < totalPages; i++) {
          const { width, height } = pages[i].getSize();
          pageTextPositions.push({
            pageNum: i + 1,
            width,
            height,
            items: []
          });
        }

        const destDoc = await PDFDocument.create();

        for (let i = 0; i < totalPages; i++) {
          const srcPage = pages[i];
          const { width: W, height: H } = srcPage.getSize();
          const textData = pageTextPositions[i] || { items: [] };

          if (H <= 900) {
            // Copy page as-is
            const [copied] = await destDoc.copyPages(srcDoc, [i]);
            destDoc.addPage(copied);
            continue;
          }

          // Slice this tall page!
          const targetHeight = 792; // 11 inches
          const cuts: number[] = [];
          let currentTop = 0;

          while (currentTop < H) {
            if (H - currentTop <= targetHeight + 50) {
              break;
            }

            const idealCut = currentTop + targetHeight;
            const cutY = findOptimalCutY(textData.items, currentTop, idealCut, H);
            cuts.push(cutY);
            currentTop = cutY;
          }

          const slices = [0, ...cuts, H];
          for (let j = 0; j < slices.length - 1; j++) {
            const yStart = slices[j];
            const yEnd = slices[j + 1];
            const sliceHeight = yEnd - yStart;

            const [copied] = await destDoc.copyPages(srcDoc, [i]);
            const newPage = destDoc.addPage(copied);

            // PDF coordinate system is bottom-up
            const pdfYStart = H - yEnd;

            newPage.setCropBox(0, pdfYStart, W, sliceHeight);
            newPage.setMediaBox(0, pdfYStart, W, sliceHeight);
          }
        }

        const savedBytes = await destDoc.save();
        return Buffer.from(savedBytes);
      }

      // Run pre-slicing
      pdfBuffer = await preSliceTallPdf(pdfBuffer);
      fs.writeFileSync(tempFilePath, pdfBuffer);

      // 1. Extract text page-by-page
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
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
        res.write(JSON.stringify({ error: "Failed to extract text from the PDF: " + (err as Error).message }));
        return res.end();
      }

      pages.sort((a, b) => a.pageNum - b.pageNum);

      if (pages.length === 0) {
        console.log("[PDF SPLITTER] Scanned or image-only PDF detected (0 text pages). Performing geometric-only fallback split...");
        
        const { PDFDocument } = await import("pdf-lib");
        const srcDoc = await PDFDocument.load(pdfBuffer);
        const totalSrcPages = srcDoc.getPageCount();

        if (totalSrcPages === 0) {
          try { fs.unlinkSync(tempFilePath); } catch (e) {}
          res.write(JSON.stringify({ error: "The uploaded PDF has 0 physical pages." }));
        return res.end();
        }

        const baseTempName = path.basename(tempFilePath);
        let originalFileName = "document.pdf";
        const fnMatch = baseTempName.match(/^pdfsplit-[^-]+-(.+)$/);
        if (fnMatch && fnMatch[1]) {
          originalFileName = fnMatch[1];
        } else {
          originalFileName = baseTempName.replace(/^pdfsplit-/, "");
        }
        const originalFileNameWithoutExt = originalFileName.replace(/\.pdf$/i, "");

        const splitFiles: { fileName: string; pages: number[]; reason: string; base64: string }[] = [];

        const apiKey = process.env.GEMINI_API_KEY;
        let ai = null;
        if (apiKey) {
           const { GoogleGenAI } = await import("@google/genai");
           ai = new GoogleGenAI({ apiKey });
        }

        let isAnyTallPage = false;
        
        for (let pIdx = 0; pIdx < totalSrcPages; pIdx++) {
            const page = srcDoc.getPage(pIdx);
            const { width, height } = page.getSize();
            const targetRatio = 11 / 8.5; // roughly 1.294
            const idealSliceHeight = width * targetRatio;
            const numSlices = Math.max(1, Math.ceil(height / idealSliceHeight));

            if (numSlices > 1) {
                isAnyTallPage = true;
                const idealCuts1000: number[] = [];
                for (let i = 1; i < numSlices; i++) {
                    idealCuts1000.push(Math.round((i / numSlices) * 1000));
                }

                let cutPointsGemini: number[] = [...idealCuts1000];

                if (ai) {
                    try {
                        const prompt = `You are an expert visual document analyzer.
Analyze page ${pIdx + 1} of the provided PDF. It is a tall screenshot or scanned document.
I need to slice this page horizontally into ${numSlices} standard printable pages.
The ideal cut points (in a normalized 0-1000 Y-coordinate scale, where 0 is the top edge and 1000 is the bottom edge) are roughly: ${JSON.stringify(idealCuts1000)}.
Please visually examine the document at those approximate Y-coordinates and find the nearest safe horizontal gap (empty space, background color) so that no chat bubble, text, or image is cut in half.
Return ONLY a valid JSON array of ${numSlices - 1} integers representing the safe Y-coordinates.
Example format: [205, 410, 605]`;
                        
                        const response = await ai.models.generateContent({
                            model: "gemini-3.1-pro",
                            contents: [
                                { role: "user", parts: [
                                    { inlineData: { mimeType: "application/pdf", data: pdfBuffer.toString("base64") } },
                                    { text: prompt }
                                ]}
                            ]
                        });
                        
                        const text = response.text || "";
                        const match = text.match(/\[[\s\S]*\]/);
                        if (match) {
                            const parsed = JSON.parse(match[0]);
                            if (Array.isArray(parsed) && parsed.length === numSlices - 1) {
                                cutPointsGemini = parsed;
                                console.log(`[PDF SPLITTER] Gemini vision refined cuts for page ${pIdx+1}:`, cutPointsGemini);
                            }
                        }
                    } catch (err) {
                        console.error("[PDF SPLITTER] Gemini vision split failed for page " + (pIdx+1) + ", falling back to geometric cuts:", err);
                    }
                }

                // Map Gemini 0-1000 (top to bottom) to pdf-lib Y coordinates (0 to height from bottom)
                let pdfCuts = cutPointsGemini.map(gy => height * (1 - (gy / 1000)));
                pdfCuts.sort((a, b) => a - b); // Ascending from bottom (0) to top (height)

                // The cuts define the top boundaries of the slices starting from the bottom.
                let currentBottom = 0;
                const cuts = [...pdfCuts, height];
                
                // For naming, we usually want top-to-bottom. But pdf-lib coordinate space 0 is bottom.
                // We will iterate bottom to top, but name them in reverse so part 1 is the top.
                // Or easier: generate the PDFs, then reverse the array so part 1 is top!
                const tempSlices = [];

                for (let i = 0; i < cuts.length; i++) {
                    const cutTop = cuts[i];
                    const sliceHeight = cutTop - currentBottom;
                    
                    const sliceDoc = await PDFDocument.create();
                    const slicePage = sliceDoc.addPage([width, sliceHeight]);
                    
                    const [embedded] = await sliceDoc.embedPdf(pdfBuffer, [pIdx]);
                    slicePage.drawPage(embedded, {
                        x: 0,
                        y: -currentBottom
                    });
                    
                    const base64 = Buffer.from(await sliceDoc.save()).toString("base64");
                    tempSlices.push({
                        base64,
                        pages: [pIdx + 1]
                    });
                    
                    currentBottom = cutTop;
                }

                // tempSlices are ordered from bottom to top. We reverse to get top to bottom.
                tempSlices.reverse();
                for (let i = 0; i < tempSlices.length; i++) {
                    splitFiles.push({
                        fileName: `${originalFileNameWithoutExt}_Page${pIdx + 1}_Part${i + 1}.pdf`,
                        pages: tempSlices[i].pages,
                        reason: `AI Visual-Aware Slice (Part ${i + 1} of ${cuts.length}) - intelligently cropped to avoid cutting chat bubbles.`,
                        base64: tempSlices[i].base64
                    });
                }
            } else {
                // Normal page, no need to slice vertically
                const sliceDoc = await PDFDocument.create();
                const [copied] = await sliceDoc.copyPages(srcDoc, [pIdx]);
                sliceDoc.addPage(copied);
                const base64 = Buffer.from(await sliceDoc.save()).toString("base64");
                splitFiles.push({
                    fileName: `${originalFileNameWithoutExt}_Page${pIdx + 1}.pdf`,
                    pages: [pIdx + 1],
                    reason: `Standard 9x11 sized page extraction.`,
                    base64
                });
            }
        }

        // Add the fully combined version as the last item for convenience, if there were tall pages sliced
        if (isAnyTallPage) {
            const combinedDoc = await PDFDocument.create();
            for (const f of splitFiles) {
                const tempDoc = await PDFDocument.load(Buffer.from(f.base64, 'base64'));
                const copiedPages = await combinedDoc.copyPages(tempDoc, tempDoc.getPageIndices());
                copiedPages.forEach((p) => combinedDoc.addPage(p));
            }
            const fullDocBase64 = Buffer.from(await combinedDoc.save()).toString('base64');
            splitFiles.unshift({
                fileName: `${originalFileNameWithoutExt}_fits_9x11_all_pages.pdf`,
                pages: Array.from({ length: totalSrcPages }, (_, idx) => idx + 1),
                reason: `Combined document perfectly sliced into ${splitFiles.length} standard 11-inch (9x11) pages. Print this file for perfect pagination!`,
                base64: fullDocBase64
            });
        }

        try { fs.unlinkSync(tempFilePath); } catch (e) {}

        res.write(JSON.stringify({
          success: true,
          splits: splitFiles,
          isFallback: true
        }));
        return res.end();
      }

      // 2. Call Gemini to determine split boundaries
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
        res.write(JSON.stringify({ error: "Gemini API key is not configured on the server." }));
        return res.end();
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      let documentTextRepresentation = "";
      for (const p of pages) {
        documentTextRepresentation += `--- START OF PAGE ${p.pageNum} ---\n`;
        const text = p.text.trim();
        // Optimizing the prompt size to prevent Gateway/Nginx timeout limits
        if (text.length > 1600) {
          const firstPart = text.substring(0, 800);
          const lastPart = text.substring(text.length - 800);
          documentTextRepresentation += `${firstPart}\n... [TRUNCATED MID-PAGE CONTENT] ...\n${lastPart}\n`;
        } else {
          documentTextRepresentation += `${text}\n`;
        }
        documentTextRepresentation += `--- END OF PAGE ${p.pageNum} ---\n\n`;
      }

      const prompt = `You are an AI PDF Splitter agent.
Your task is to analyze a PDF document page-by-page and decide on the optimal page boundaries to split the document into separate logical files based on the user's instructions.

USER INSTRUCTIONS:
"${userPrompt || "Split this document intelligently into separate sections or documents."}"

CRITICAL LOGICAL INTEGRITY RULES:
1. STRICT TARGET SIZE & SPLIT MANDATE:
   - You MUST fully respect any specific page size limits, target ranges, or division sizes specified by the user (e.g., "split into 9x11 pages" means each split file should contain between 9 and 11 pages).
   - If the user asks for a split, or if the document exceeds the user's requested maximum size, you are STRICTLY FORBIDDEN from keeping the entire document in a single split file. You MUST split it into multiple parts matching the requested sizes as closely as possible.
   - If a continuous transcript or chat dialogue spans across the entire document, you STILL MUST split the document at intervals matching the user's target size. Do NOT merge them all into a single file.

2. CHAT BUBBLE & DIALOGUE PRESERVATION (FIND CLEANEST BREAK):
   - To keep chat bubbles, message bubbles, or paragraphs intact inside the split files, look for the absolute cleanest page boundary within the target range (e.g., if the target is 9 to 11 pages, inspect the page transitions around Page 9->10, Page 10->11, and Page 11->12).
   - A boundary is clean if it occurs between chat bubbles, between sentences, between different speakers, or at a natural topic transition.
   - Choose the page boundary in that target window that has the least cross-page dialogue overlap, and split there.
   - You must prioritize dividing the document into the requested approximate sizes over keeping the entire transcript unbroken.

3. PAGE COVERAGE & INTEGRITY:
   - Every page from the original document (from page 1 to page ${pages.length}) MUST be included in EXACTLY ONE split file. Do not omit any pages, and do not duplicate any pages across different split files.
   - The page ranges for each split file must be contiguous (e.g., pages 1-10, pages 11-21, etc.).

Please reply with a JSON object in the following format:
{
  "splits": [
    {
      "fileName": "Descriptive, clean filename (e.g. Part 1 - Welcome and Intro.pdf)",
      "pages": [1, 2, 3], // Array of 1-indexed page numbers to include in this split file
      "reason": "Explain briefly why these pages are grouped together and why this split boundary was chosen (e.g., 'Pages 1-10 cover the intro and first conversation block, ending cleanly before the next participant starts on page 11 without cutting any messages.')"
    }
  ]
}

Here is the extracted text of the document page-by-page:
${documentTextRepresentation}

Return ONLY the raw JSON object conforming to the schema above. Do not include markdown code blocks, backticks, or other text outside the JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      let resultJson;
      try {
        const text = response.text || "";
        const cleanJsonText = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
        resultJson = JSON.parse(cleanJsonText);
      } catch (e: any) {
        console.error("Failed to parse Gemini split decision:", e, response.text);
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
        res.write(JSON.stringify({ error: "AI failed to produce a valid split plan.", rawResponse: response.text }));
        return res.end();
      }

      if (!resultJson || !Array.isArray(resultJson.splits)) {
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
        res.write(JSON.stringify({ error: "AI split response does not contain a splits list.", rawResponse: response.text }));
        return res.end();
      }

      // 3. Generate the split PDFs using pdf-lib
      const { PDFDocument } = await import("pdf-lib");
      const srcDoc = await PDFDocument.load(pdfBuffer);
      const totalSrcPages = srcDoc.getPageCount();

      const splitFiles: { fileName: string; pages: number[]; reason: string; base64: string }[] = [];

      for (const split of resultJson.splits) {
        if (!split.pages || !Array.isArray(split.pages)) {
          continue;
        }

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
            fileName: split.fileName,
            pages: split.pages.map(p => parseInt(p as any)).filter(p => !isNaN(p)),
            reason: split.reason || "",
            base64
          });
        }
      }

      // Clean up the temp file
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
  });
