export const uploadFileChunked = async (uploadFile: File): Promise<{ url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null> => {
  let uploadedData: { url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null = null;
  const chunkSize = 1024 * 1024 * 4; // 4MB chunks to stay under platform limits (Vercel 4.5MB) while remaining a multiple of 256KB
  const totalChunks = Math.ceil(uploadFile.size / chunkSize);
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  // Step 1: Initialize Gemini Resumable Upload (Stateless for Vercel)
  let geminiUploadUrl: string | null = null;
  try {
    const initRes = await fetch(`/api/upload/init-gemini?fileName=${encodeURIComponent(uploadFile.name)}&mimeType=${encodeURIComponent(uploadFile.type)}&totalSize=${uploadFile.size}`, {
      method: 'POST'
    });
    if (initRes.ok) {
      const initData = await initRes.json();
      geminiUploadUrl = initData.uploadUrl;
      console.log("Gemini resumable upload initialized.");
    }
  } catch (err) {
    console.warn("Failed to initialize Gemini resumable upload, falling back to standard chunked upload:", err);
  }

  for (let i = 0; i < totalChunks; i++) {
    const offset = i * chunkSize;
    const chunk = uploadFile.slice(offset, offset + chunkSize);
    
    let retries = 3;
    let success = false;
    let lastError: any = null;

    while (retries > 0 && !success) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
        
        let url = `/api/upload-chunk?fileName=${encodeURIComponent(uploadFile.name)}&mimeType=${encodeURIComponent(uploadFile.type)}&chunkIndex=${i}&totalChunks=${totalChunks}&sessionId=${sessionId}&offset=${offset}`;
        if (geminiUploadUrl) {
          url += `&geminiUploadUrl=${encodeURIComponent(geminiUploadUrl)}`;
        }

        let response;
        const isLast = i === totalChunks - 1;
        
        if (geminiUploadUrl) {
          try {
            // Step 2a: Attempt DIRECT transfer to Google to bypass platform payload limits (Vercel/Cloud Run Proxy)
            console.log(`Attempting direct upload of chunk ${i} to Google...`);
            const googleHeaders: Record<string, string> = {
              'X-Goog-Upload-Offset': String(offset),
              'X-Goog-Upload-Command': isLast ? 'upload, finalize' : 'upload',
              'Content-Type': 'application/octet-stream'
            };
            
            response = await fetch(geminiUploadUrl, {
              method: 'PUT',
              body: chunk,
              headers: googleHeaders
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.warn(`Direct upload failed with status ${response.status}: ${errorText}. Falling back to server proxy.`);
              throw new Error("Direct upload failed");
            }
          } catch (err) {
            // Step 2b: Fallback to server proxy if direct upload fails (CORS or other network issues)
            console.log(`Direct upload chunk ${i} failed or blocked by CORS. Falling back to server proxy...`);
            response = await fetch(url, {
              method: 'POST',
              body: chunk,
              headers
            });
          }
        } else {
          // No Gemini URL, standard chunked upload
          response = await fetch(url, {
            method: 'POST',
            body: chunk,
            headers
          });
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server failed to process chunk ${i}: ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log(`Chunk ${i} uploaded successfully.`);
        
        // Handle metadata from either the direct upload response or the proxy response
        if (responseData.geminiFileUri || responseData.fileId) {
          uploadedData = { 
            url: responseData.url || uploadedData?.url || '', 
            fileId: responseData.fileId || uploadedData?.fileId || '', 
            geminiFileUri: responseData.geminiFileUri || (responseData.file ? responseData.file.uri : responseData.uri),
            geminiError: responseData.geminiError 
          };
        } else if (isLast && responseData.file?.uri) {
           // Handle Google's direct response format on the last chunk
           uploadedData = {
              url: uploadedData?.url || '',
              fileId: uploadedData?.fileId || '',
              geminiFileUri: responseData.file.uri
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
    throw new Error("Upload incomplete. Please try again.");
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
