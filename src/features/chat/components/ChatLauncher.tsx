import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { useChat } from '../state/ChatProvider';
import { ChatConsole } from './ChatConsole';

/** Floating launcher + non-modal dialog. Shares conversation state with the embedded demo. */
export function ChatLauncher() {
  const { panelOpen, openPanel, closePanel } = useChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (panelOpen && panelRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        panelRef.current,
        { y: 48, rotateX: -14, scale: 0.95, autoAlpha: 0, transformPerspective: 900, transformOrigin: '90% 100%' },
        { y: 0, rotateX: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power4.out' },
      );
    }
    if (!panelOpen && wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = panelOpen;
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen, closePanel]);

  return (
    <>
      {panelOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Redora AI support chat"
          className="fixed inset-x-0 bottom-0 z-50 h-[88dvh] p-0 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:max-h-[calc(100dvh-3rem)] sm:w-[410px]"
        >
          <ErrorBoundary scope="chat-panel" fallback={<p className="glass-strong m-4 rounded-2xl p-4 text-sm">Chat is unavailable right now. Please email support@redora-ai-demo.example (DEMO).</p>}>
            <ChatConsole variant="floating" className="h-full rounded-b-none sm:rounded-b-3xl" onClose={closePanel} autoFocus inputId="chat-panel-input" />
          </ErrorBoundary>
        </div>
      )}
      {!panelOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={openPanel}
          aria-label="Open Redora AI support chat"
          className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex min-h-[48px] items-center gap-3 rounded-full border border-crimson/50 bg-ink-900/90 py-3 pl-4 pr-5 text-sm font-medium shadow-glow backdrop-blur transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-crimson hover:bg-ink-900 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 sm:bottom-6 sm:right-6"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-crimson">
            <MessageSquare aria-hidden="true" className="h-4 w-4" />
            <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse-dot rounded-full border-2 border-ink-900 bg-crimson-bright" />
          </span>
          Ask Redora AI
        </button>
      )}
    </>
  );
}
