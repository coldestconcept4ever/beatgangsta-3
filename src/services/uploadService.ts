export const uploadFileChunked = async (uploadFile: File): Promise<{ url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null> => {
  let uploadedData: { url: string, fileId: string, geminiFileUri?: string, geminiError?: string } | null = null;
  const chunkSize = 1024 * 1024; // 1MB chunks - reliable for all platform proxies
  const totalChunks = Math.ceil(uploadFile.size / chunkSize);
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  // PRIMARY METHOD: Simple Server-side assembly (yesterday's working logic)
  // We send chunks to /api/upload-chunk without geminiUploadUrl to trigger server assembly and SDK-based upload
  
  for (let i = 0; i < totalChunks; i++) {
    const offset = i * chunkSize;
    const chunk = uploadFile.slice(offset, offset + chunkSize);
    
    let retries = 3;
    let success = false;
    let lastError: any = null;

    while (retries > 0 && !success) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
        
        const url = `/api/upload-chunk?fileName=${encodeURIComponent(uploadFile.name)}&mimeType=${encodeURIComponent(uploadFile.type)}&chunkIndex=${i}&totalChunks=${totalChunks}&sessionId=${sessionId}&offset=${offset}`;

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
