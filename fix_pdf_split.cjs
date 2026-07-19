const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const targetBlockStart = '        let isAnyTallPage = false;';
const targetBlockEnd = '        try { fs.unlinkSync(tempFilePath); } catch (e) {}';

const newLogic = `
        let isAnyTallPage = false;
        
        const combinedDoc = await PDFDocument.create();
        let totalCreatedPages = 0;

        for (let pIdx = 0; pIdx < totalSrcPages; pIdx++) {
            const page = srcDoc.getPage(pIdx);
            const { width, height } = page.getSize();
            const targetRatio = 11 / 8.5; // roughly 1.294
            const idealSliceHeight = width * targetRatio;
            const numSlices = Math.max(1, Math.ceil(height / idealSliceHeight));

            if (numSlices > 1) {
                isAnyTallPage = true;
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

                let currentBottom = 0;
                const cuts = [...pdfCuts, height];
                
                const [embedded] = await combinedDoc.embedPdf(pdfBuffer, [pIdx]);
                
                const tempSlices = [];

                for (let i = 0; i < cuts.length; i++) {
                    const cutTop = cuts[i];
                    const sliceHeight = cutTop - currentBottom;
                    
                    const slicePage = combinedDoc.addPage([width, sliceHeight]);
                    slicePage.drawPage(embedded, {
                        x: 0,
                        y: -currentBottom
                    });
                    
                    tempSlices.push({
                        height: sliceHeight
                    });
                    totalCreatedPages++;
                    currentBottom = cutTop;
                }
                
                // tempSlices are ordered from bottom to top. pdf-lib added them in that order.
                // We actually want the final PDF to have pages in top-to-bottom order.
                // pdf-lib's addPage appends to the end.
                // Since we added them bottom-to-top, the pages are backwards for this source page.
                // We can swap them in the combinedDoc!
                const pageIndices = combinedDoc.getPageCount();
                const startIndex = pageIndices - numSlices;
                
                // A simpler way: insertPage instead of addPage so we insert them in reverse order?
                // Actually, let's fix the page order by recreating a new doc if needed, or we just insert them in the correct order!
                // Wait, it's easier to just change the loop to insert pages!
            } else {
                const [copied] = await combinedDoc.copyPages(srcDoc, [pIdx]);
                combinedDoc.addPage(copied);
                totalCreatedPages++;
            }
        }

        // We messed up the page order for the slices if we just addPage.
        // Let's fix that in a second script below by modifying the newLogic string.
`;

const startIndex = content.indexOf(targetBlockStart);
const endIndex = content.indexOf(targetBlockEnd, startIndex);
if (startIndex !== -1 && endIndex !== -1) {
    // we will write a better replacement script
}
