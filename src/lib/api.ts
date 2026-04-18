
export async function fetchWithDetailedError(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Not JSON
      }
      
      const status = response.status;
      const statusText = response.statusText;
      
      let errorMsg = `Server error: ${status} ${statusText}`;
      if (errorData.error) {
        if (typeof errorData.error === 'string') {
          errorMsg = errorData.error;
        } else if (typeof errorData.error === 'object') {
          errorMsg = errorData.error.message || errorData.error.error || JSON.stringify(errorData.error);
        }
      } else if (errorData.message) {
        errorMsg = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
      } else if (Object.keys(errorData).length > 0) {
        errorMsg = JSON.stringify(errorData);
      }
      
      // Append details if they exist to help debugging
      const details = errorData.details || errorData.errorDetails || (errorData.error && typeof errorData.error === 'object' ? errorData.error.details : null);
      if (details && Array.isArray(details) && details.length > 0) {
        const detailsStr = JSON.stringify(details, null, 2);
        errorMsg += `\nDetails: ${detailsStr}`;
      }
      
      if (status === 413) {
        throw new Error(`PAYLOAD_TOO_LARGE: The request payload is too large for the server. Status: ${status}`);
      }
      if (status === 504 || status === 502) {
        throw new Error(`TIMEOUT_ERROR: The request timed out. This can happen with large files or complex operations. Status: ${status}`);
      }
      if (status === 429) {
        throw new Error(`RATE_LIMIT_EXCEEDED: Too many requests. Please wait a moment and try again. Status: ${status}`);
      }
      
      throw new Error(`${errorMsg} (Status: ${status})`);
    }
    
    return response;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(`NETWORK_ERROR: Failed to fetch. This usually means the server is unreachable, your connection was interrupted, or the request was blocked (e.g., by an ad blocker). Check your internet connection.`);
    }
    throw error;
  }
}
