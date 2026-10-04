import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/geist';
import './index.css';
import { App } from './App';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary scope="app" fallback={<AppCrash />}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

function AppCrash() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-950 p-8 text-center">
      <div>
        <h1 className="display-md">Redora AI hit a snag.</h1>
        <p className="mt-4 text-fg-dim">Reload the page to try again.</p>
        <button className="mt-6 min-h-[44px] rounded-full border border-line-2 px-5 py-2 text-sm transition-colors hover:border-crimson/70 hover:bg-crimson/10 active:scale-95" onClick={() => window.location.reload()}>Reload</button>
      </div>
    </main>
  );
}
