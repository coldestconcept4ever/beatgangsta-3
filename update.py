with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                onOpenCritique={(c) => {
                  console.log("Vault onOpenCritique called with:", c);
                  setShowVault(false);
                  try {
                    setError(null); // Clear any previous errors
                    if (!c) {
                      throw new Error("Unable to open critique: the critique record is null or undefined.");
                    }
                    if (!c.id) {
                      throw new Error("Unable to open critique: the critique is missing its unique identifier (ID). The record might be corrupted.");
                    }
                    console.log("Critique valid. Setting critiques...");
                    
                    setCritiques([c]);
                    setRecipes([]);
                    setViewingRecipe(null);
                    setAudioMode('critique');
                    setInputMode('upload');
                    setMainTab(c.isGangstaVox ? 'vox' : 'beat');
                    setIsGangstaVox(!!c.isGangstaVox);
                    setFriendMode(false);
                    setImportedSaveFile(null);
                    
                    console.log("Critique state updated.");
                    // Update currentAudioInfo if the opened critique has audio
                    if (c.audioBase64 || c.audioUrl || c.geminiFileUri) {
                      setCurrentAudioInfo({
                        audioBase64: c.audioBase64 || null,
                        audioUrl: c.audioUrl || null,
                        geminiFileUri: c.geminiFileUri || null,
                        mimeType: c.mimeType || null
                      });
                    }
                    
                    // Smoothly scroll down so the opened critique details are visible
                    setTimeout(() => {
                      const el = document.getElementById('critiques-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                      }
                    }, 300);
                  } catch (err: any) {
                    console.error("Failed to open critique:", err);
                    setError(err.message || "An unexpected error occurred while loading this critique.");
                  }
                }}"""

replacement = """                onOpenCritique={(c) => {
                  console.log("Vault onOpenCritique called with:", c);
                  setShowVault(false);
                  
                  // Allow Vault to close before executing heavy state updates
                  setTimeout(() => {
                    try {
                      setError(null); // Clear any previous errors
                      if (!c) {
                        throw new Error("Unable to open critique: the critique record is null or undefined.");
                      }
                      if (!c.id) {
                        throw new Error("Unable to open critique: the critique is missing its unique identifier (ID). The record might be corrupted.");
                      }
                      console.log("Critique valid. Setting critiques...");
                      
                      setCritiques([c]);
                      setRecipes([]);
                      setViewingRecipe(null);
                      setAudioMode('critique');
                      setInputMode('upload');
                      setMainTab(c.isGangstaVox ? 'vox' : 'beat');
                      setIsGangstaVox(!!c.isGangstaVox);
                      setFriendMode(false);
                      setImportedSaveFile(null);
                      
                      console.log("Critique state updated.");
                      // Update currentAudioInfo if the opened critique has audio
                      if (c.audioBase64 || c.audioUrl || c.geminiFileUri) {
                        setCurrentAudioInfo({
                          audioBase64: c.audioBase64 || null,
                          audioUrl: c.audioUrl || null,
                          geminiFileUri: c.geminiFileUri || null,
                          mimeType: c.mimeType || null
                        });
                      }
                      
                      // Smoothly scroll down so the opened critique details are visible
                      setTimeout(() => {
                        const el = document.getElementById('critiques-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                          window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                        }
                      }, 300);
                    } catch (err: any) {
                      console.error("Failed to open critique:", err);
                      setError(err.message || "An unexpected error occurred while loading this critique.");
                    }
                  }, 50);
                }}"""

content = content.replace(target, replacement)
with open('src/App.tsx', 'w') as f:
    f.write(content)
