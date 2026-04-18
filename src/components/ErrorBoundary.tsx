
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Automatically reload the page if it's a chunk load error (e.g., after a new deployment)
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.name === 'ChunkLoadError'
    ) {
      const reloadKey = 'chunk_load_error_reloaded';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
        return;
      } else {
        // If we already reloaded and it still failed, clear the flag so they can try again later
        sessionStorage.removeItem(reloadKey);
      }
    }
    
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred';
      let errorDetails = '';

      // Check if the error message is a JSON string (from handleFirestoreError or similar)
      try {
        if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
          const parsed = JSON.parse(errorMessage);
          errorMessage = parsed.error || errorMessage;
          errorDetails = JSON.stringify(parsed, null, 2);
        }
      } catch (e) {
        // Not JSON, keep as is
      }

      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-2xl w-full bg-[#111] border border-red-900/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center border border-red-900/40">
                <AlertTriangle className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                <p className="text-gray-400 text-sm">The application encountered an error it couldn't recover from.</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-8">
              <p className="text-red-400 font-mono text-sm break-words mb-2">
                {errorMessage}
              </p>
              {errorDetails && (
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors uppercase tracking-widest font-bold">
                    Technical Details
                  </summary>
                  <pre className="mt-2 p-4 bg-black rounded-lg text-[10px] text-gray-400 overflow-auto max-h-48 font-mono border border-white/5">
                    {errorDetails}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500">
                If this issue persists, please contact support with the technical details provided above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
