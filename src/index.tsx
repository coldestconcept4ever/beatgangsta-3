
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Automatically reload the page if a dynamically imported module fails to load
// This typically happens after a new deployment when the old chunks are no longer available
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected. Reloading page...', event);
  window.location.reload();
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div></div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
