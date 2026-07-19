const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const targetBlockStart = '        let isAnyTallPage = false;';
const targetBlockEnd = '        try { fs.unlinkSync(tempFilePath); } catch (e) {}';

const newLogic = `        let isAnyTallPage = false;

        const combinedDoc = await PDFDocument.create();
        
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
                
                // We want to insert the slices in top-to-bottom order into combinedDoc.
                // Since our cuts are bottom-up (0 is bottom), we should process the cuts from top to bottom!
                // Wait, cuts array is [y1, y2, ..., height] sorted ascending (bottom to top).
                // To get top-to-bottom slices, we should iterate backwards!
                
                for (let i = cuts.length - 1; i >= 0; i--) {
                    const cutTop = cuts[i];
                    const cutBottom = i === 0 ? 0 : cuts[i - 1];
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
            reason: \`Combined document properly sliced into standard 11-inch (9x11) pages. Print this file for perfect pagination!\`,
            base64: fullDocBase64
        });

`;

const startIndex = content.indexOf(targetBlockStart);
const endIndex = content.indexOf(targetBlockEnd, startIndex);
if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) + newLogic + content.substring(endIndex);
    fs.writeFileSync('server.ts', newContent);
    console.log("Successfully replaced PDF split logic");
} else {
    console.log("Failed to find target block");
}
