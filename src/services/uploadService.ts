import { convertWavToMp3 } from '../lib/audioConverter';

export const uploadFileChunked = async (
  uploadFile: File,
  onProgress?: (step: 'converting' | 'uploading', percent: number) => void
): Promise<{ url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null> => {
  let fileToUpload = uploadFile;

  const isWav = uploadFile.name.toLowerCase().endsWith('.wav') || uploadFile.type.includes('wav');
  const isHeavyAudio = uploadFile.type.startsWith('audio/') && uploadFile.size > 10 * 1024 * 1024; // > 10MB

  if (isWav || isHeavyAudio) {
    console.log(`[MANDATORY_CONVERSION] Mandatorily converting ${uploadFile.name} to 192kbps MP3 to keep within Cloudflare 10GB free budget context...`);
    if (onProgress) onProgress('converting', 0);
    try {
      fileToUpload = await convertWavToMp3(uploadFile, (p) => {
        if (onProgress) onProgress('converting', Math.round(p * 100));
      });
      console.log(`[MANDATORY_CONVERSION] Success! Original: ${(uploadFile.size / (1024 * 1024)).toFixed(2)}MB -> Converted: ${(fileToUpload.size / (1024 * 1024)).toFixed(2)}MB`);
    } catch (err) {
      console.error("[MANDATORY_CONVERSION] Browser audio conversion failed:", err);
      if (isWav) {
        throw new Error("WAV files are prohibited unless successfully converted client-side to conserve system limits. Conversion error: " + (err as any).message);
      }
    }
  }

  console.log("[UPLOAD_VERSION_V4] Checking Cloudflare R2 configurations...");
  
  if (onProgress) onProgress('uploading', 0);

  // Try direct Cloudflare R2 upload first
  try {
    const initResponse = await fetch('/api/upload/init-r2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: fileToUpload.name,
        mimeType: fileToUpload.type,
        size: fileToUpload.size
      })
    });

    if (initResponse.ok) {
      const initData = await initResponse.json();
      
      if (initData.limitReached) {
        throw new Error(initData.error || "R2 Hard Limit reached.");
      }

      if (initData.r2Enabled && initData.uploadUrl) {
        console.log("[R2_UPLOAD] Cloudflare R2 is configured. Uploading file directly to R2 bucket...");
        
        const r2PutRes = await fetch(initData.uploadUrl, {
          method: 'PUT',
          body: fileToUpload,
          headers: {
            'Content-Type': fileToUpload.type || 'application/octet-stream'
          }
        });

        if (!r2PutRes.ok) {
          throw new Error(`R2 PUT upload request failed with status: ${r2PutRes.statusText}`);
        }

        console.log("[R2_UPLOAD] File uploaded to R2 bucket successfully! Registering with Gemini File API...");
        
        const registerResponse = await fetch('/api/upload/register-r2-for-gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: initData.fileUrl,
            fileId: initData.fileId,
            fileName: fileToUpload.name,
            mimeType: fileToUpload.type,
            size: fileToUpload.size
          })
        });

        if (!registerResponse.ok) {
          const errMsg = await registerResponse.text();
          throw new Error(`Gemini File API registration failed: ${errMsg}`);
        }

        const registerData = await registerResponse.json();
        console.log("[R2_UPLOAD] Gemini registration complete!", registerData);

        if (onProgress) onProgress('uploading', 100);

        return {
          url: initData.fileUrl,
          fileId: initData.fileId,
          geminiFileUri: registerData.geminiFileUri || undefined,
          geminiError: registerData.geminiError || undefined
        };
      }
    }
  } catch (r2Error: any) {
    // If it's a "Failed to fetch" on a pre-signed URL, it's likely CORS or missing R2 config
    if (r2Error instanceof TypeError && r2Error.message === "Failed to fetch") {
        console.log("[R2_UPLOAD] Cloudflare R2 endpoint unreachable or CORS blocked. This usually means R2 is unconfigured. Falling back to Drive.");
    } else {
        console.warn("[R2_UPLOAD] Cloudflare R2 upload failed or is unconfigured. Falling back to chunked Google Drive upload flow.", r2Error);
    }
    
    if (r2Error?.message?.includes("budget") || r2Error?.message?.includes("exhausted") || r2Error?.message?.includes("limit") || r2Error?.message?.includes("Limit")) {
      // If it was rejected because of the safety limit, pass that error upward!
      throw r2Error;
    }
  }

  console.log("[UPLOAD_VERSION_V3] Starting 1MB chunked upload as fallback...");
  let uploadedData: { url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null = null;
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(fileToUpload.size / chunkSize);
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  for (let i = 0; i < totalChunks; i++) {
    const offset = i * chunkSize;
    const chunk = fileToUpload.slice(offset, offset + chunkSize);
    
    let retries = 3;
    let success = false;
    let lastError: any = null;
 
    while (retries > 0 && !success) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
        
        let url = `/api/upload-chunk?fileName=${encodeURIComponent(fileToUpload.name)}&mimeType=${encodeURIComponent(fileToUpload.type)}&chunkIndex=${i}&totalChunks=${totalChunks}&sessionId=${sessionId}&offset=${offset}&totalSize=${fileToUpload.size}`;
 
        const response = await fetch(url, {
          method: 'POST',
          body: chunk,
          headers
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server failed to process chunk ${i}: ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log(`Chunk ${i} uploaded successfully.`);
        if (onProgress) {
          onProgress('uploading', Math.round(((i + 1) / totalChunks) * 100));
        }
        
        // If it was the last chunk, we get the final file metadata
        if (responseData.geminiFileUri || responseData.fileId || responseData.url) {
          uploadedData = { 
            url: responseData.url || '', 
            fileId: responseData.fileId || '', 
            geminiFileUri: responseData.geminiFileUri,
            geminiError: responseData.geminiError 
          };
        }
        success = true;
      } catch (err: any) {
        lastError = err;
        retries--;
        if (retries > 0) {
          console.warn(`Chunk ${i} upload failed, retrying... (${retries} retries left)`, err);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
 
    if (!success) {
      console.error("Upload failed after retries:", lastError);
      throw new Error(`Chunk upload failed: ${lastError?.message || String(lastError)}`);
    }
  }
  
  if (!uploadedData) {
    throw new Error("Upload incomplete - no final response from server.");
  }
  
  return uploadedData;
};

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  try {
    await fetch('/api/delete-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId })
    });
  } catch (err) {
    console.error("Failed to delete file from Drive:", err);
  }
};
