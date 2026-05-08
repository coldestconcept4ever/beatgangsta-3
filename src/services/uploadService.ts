export const uploadFileChunked = async (uploadFile: File): Promise<{ url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null> => {
  console.log("[UPLOAD_VERSION_V4] Starting resumable Gemini upload...");
  let uploadedData: { url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null = null;
  const chunkSize = 1048576 * 4; // 4MB chunks
  const totalChunks = Math.ceil(uploadFile.size / chunkSize);
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  let geminiUploadUrl = "";
  try {
    const userApiKey = localStorage.getItem('userApiKey') || '';
    const initRes = await fetch(`/api/upload/init-gemini?fileName=${encodeURIComponent(uploadFile.name)}&mimeType=${encodeURIComponent(uploadFile.type || 'audio/mpeg')}&totalSize=${uploadFile.size}`, {
       method: 'POST',
       headers: { 'x-user-api-key': userApiKey }
    });
    if (initRes.ok) {
       const initData = await initRes.json();
       geminiUploadUrl = initData.uploadUrl || "";
    }
  } catch (err) {
    console.warn("Could not init geminiUploadUrl", err);
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
        
        let url = `/api/upload-chunk?fileName=${encodeURIComponent(uploadFile.name)}&mimeType=${encodeURIComponent(uploadFile.type || 'audio/mpeg')}&chunkIndex=${i}&totalChunks=${totalChunks}&sessionId=${sessionId}&offset=${offset}&totalSize=${uploadFile.size}`;
        if (geminiUploadUrl) {
          url += `&geminiUploadUrl=${encodeURIComponent(geminiUploadUrl)}`;
        }

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
  
  // If we used direct Gemini proxy, we won't get fileId/url from Drive, but the upload completed.
  if (!uploadedData && geminiUploadUrl && totalChunks > 0) {
     console.warn("Upload finished but uploadedData is null (expected if proxying to Gemini only).");
     uploadedData = { url: '', fileId: '' }; // Fallback
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
