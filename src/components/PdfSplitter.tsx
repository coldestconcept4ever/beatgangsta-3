import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Scissors, Download, FileText, Sparkles, Loader2, RefreshCw, HelpCircle, CheckCircle, AlertTriangle, Copy, Check } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface SplitFile {
  fileName: string;
  pages: number[];
  reason: string;
  base64: string;
}

interface PdfSplitterProps {
  onClose: () => void;
  theme: string;
}

export const PdfSplitter: React.FC<PdfSplitterProps> = ({ onClose, theme }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [splits, setSplits] = useState<SplitFile[]>([]);
  const [error, setError] = useState<string>('');
  const [copiedError, setCopiedError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyError = () => {
    if (!error) return;
    navigator.clipboard.writeText(error);
    setCopiedError(true);
    setTimeout(() => setCopiedError(false), 2000);
  };

  const isCrazyBird = theme === 'crazy-bird';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setError('');
        setSplits([]);
      } else {
        setError('Please upload a valid PDF document.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setError('');
        setSplits([]);
      } else {
        setError('Please upload a valid PDF document.');
      }
    }
  };

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleDownload = (split: SplitFile) => {
    try {
      const blob = base64ToBlob(split.base64, 'application/pdf');
      saveAs(blob, split.fileName);
    } catch (err: any) {
      setError(`Failed to download split file: ${err.message || err}`);
    }
  };

  const handleDownloadAll = async () => {
    if (splits.length === 0) return;
    try {
      setProgress('Zipping files...');
      const zip = new JSZip();
      
      splits.forEach((split) => {
        const blob = base64ToBlob(split.base64, 'application/pdf');
        zip.file(split.fileName, blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${selectedFile?.name?.replace('.pdf', '') || 'split'}_intelligent_splits.zip`);
      setProgress('');
    } catch (err: any) {
      setError(`Failed to create ZIP package: ${err.message || err}`);
      setProgress('');
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSplits([]);
    setProgress('Preparing upload...');

    try {
      const chunkSize = 2 * 1024 * 1024; // 2MB chunks
      const totalSize = selectedFile.size;
      const totalChunks = Math.ceil(totalSize / chunkSize);
      const sessionId = Math.random().toString(36).substring(2, 15);
      const fileName = selectedFile.name;

      let tempFilePath = '';

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, totalSize);
        const chunkBlob = selectedFile.slice(start, end);
        const arrayBuffer = await chunkBlob.arrayBuffer();

        setProgress(`Uploading chunk ${chunkIndex + 1} of ${totalChunks}... (${Math.round((start / totalSize) * 100)}%)`);

        const res = await fetch(`/api/pdf/upload-chunk?fileName=${encodeURIComponent(fileName)}&chunkIndex=${chunkIndex}&totalChunks=${totalChunks}&sessionId=${sessionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          body: arrayBuffer
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to upload chunk ${chunkIndex + 1}`);
        }

        const data = await res.json();
        if (data.completed) {
          tempFilePath = data.tempFilePath;
        }
      }

      setProgress('Analyzing with Gemini to find logical boundaries...');

      // 2. Call backend split-analyse endpoint
      const res = await fetch('/api/pdf/split-analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempFilePath,
          userPrompt: userPrompt.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process PDF.');
      }

      setSplits(data.splits || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred during PDF splitting.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setSelectedFile(null);
    setUserPrompt('');
    setSplits([]);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${
          isCrazyBird ? 'bg-zinc-900 border-red-900/40' : 'bg-zinc-900 border-white/10'
        } my-8`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${
          isCrazyBird ? 'border-red-900/40 bg-zinc-950' : 'border-white/10 bg-zinc-950/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Scissors size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI PDF Splitter
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded uppercase tracking-wider font-semibold border border-emerald-500/20">
                  Intelligent
                </span>
              </h2>
              <p className="text-zinc-400 text-xs mt-0.5">Split documents without breaking messages or continuous information</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex gap-3 items-start justify-between">
              <div className="flex gap-3 items-start">
                <AlertTriangle className="shrink-0 mt-0.5 text-red-400" size={16} />
                <div className="break-all">{error}</div>
              </div>
              <button
                onClick={handleCopyError}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white text-xs font-semibold transition-all border border-red-500/30 cursor-pointer"
                title="Copy full error message"
              >
                {copiedError ? <Check size={12} /> : <Copy size={12} />}
                {copiedError ? 'Copied!' : 'Copy Error Log'}
              </button>
            </div>
          )}

          {splits.length === 0 ? (
            <div className="space-y-5">
              {/* File Uploader */}
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'border-zinc-700 hover:border-zinc-500 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400 border border-zinc-700">
                    <Upload size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200">Drag & drop your PDF file here</h3>
                  <p className="text-zinc-500 text-xs mt-1">or click to browse your local files</p>
                  <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-zinc-950/50 rounded-full border border-zinc-800 text-[10px] text-zinc-400">
                    <FileText size={10} /> Supports any text-based PDF
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/15 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-zinc-200 truncate">{selectedFile.name}</h4>
                      <p className="text-zinc-500 text-xs mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetState}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw size={12} />
                    Replace
                  </button>
                </div>
              )}

              {/* Instructions / Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-emerald-400" />
                  Split Instructions (Optional)
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g. 'Split into separate conversations', 'Separate each invoice', or leave blank for automatic smart split based on topic changes..."
                  rows={3}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm transition-all resize-none"
                />
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Tip: Gemini automatically analyzes each page transition and ensures page cuts never happen mid-sentence, mid-bullet, or inside continuous chat bubbles.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSplit}
                disabled={loading || !selectedFile}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Scissors size={18} />
                    <span>Analyze & Split PDF</span>
                  </>
                )}
              </button>

              {/* Loader with nice messages */}
              {loading && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-2 animate-pulse">
                  <p className="text-zinc-300 text-xs font-semibold">{progress}</p>
                  <p className="text-zinc-500 text-[10px]">This may take up to a minute for long documents with lots of text.</p>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" size={16} />
                    Splitting Complete!
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Gemini generated {splits.length} split documents intelligently</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={resetState}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    Start Over
                  </button>
                  <button 
                    onClick={handleDownloadAll}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all font-bold flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Download size={12} />
                    Download All (.zip)
                  </button>
                </div>
              </div>

              {progress && (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg text-center text-xs border border-emerald-500/15 animate-pulse">
                  {progress}
                </div>
              )}

              {/* List of Splits */}
              <div className="space-y-3">
                {splits.map((split, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-zinc-400 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                          Pages: {split.pages.join(', ')}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-200 truncate">{split.fileName}</h4>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed italic pr-2">
                        "{split.reason}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(split)}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 hover:text-emerald-400 cursor-pointer border border-zinc-700/60"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
