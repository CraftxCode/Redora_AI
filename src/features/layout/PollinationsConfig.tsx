import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, Lock, ShieldAlert, X } from 'lucide-react';
import { normalizePollinationsKey } from '@/domain/ai/pollinationsKey';
import { clearPollinationsKey, savePollinationsKey } from '@/services/pollinationsKey';
import { useHasPollinationsKey } from '@/shared/hooks/usePollinationsKey';

export type ConfigOutcome = 'saved' | 'removed';

interface Props { onClose: (outcome?: ConfigOutcome) => void }

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href]';

/**
 * Optional manual Pollinations API configuration. Opened only from the footer.
 * The key is kept in this browser and sent with chat requests; nothing else in the app depends on it.
 */
export function PollinationsConfig({ onClose }: Props) {
  const titleId = useId();
  const descId = useId();
  const inputId = useId();
  const errorId = useId();
  const hasKey = useHasPollinationsKey();
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock page scroll, move focus into the dialog, and hand focus back to the footer button on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!normalizePollinationsKey(trimmed)) {
      setError('That doesn’t look like a valid key. Keys are 8 to 256 characters with no spaces.');
      return;
    }
    if (!savePollinationsKey(trimmed)) {
      setError('Your browser blocked saving the key. Allow site storage for this page and try again.');
      return;
    }
    onClose('saved');
  };

  const remove = () => {
    clearPollinationsKey();
    onClose('removed');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex animate-overlay-in items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onKeyDown={onKeyDown}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="glass-strong max-h-[100dvh] w-full max-w-md animate-sheet-in overflow-y-auto rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-panel sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-3xl leading-none">Pollinations API</h2>
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Close"
            className="-mr-2 -mt-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg-dim transition-colors hover:bg-white/5 hover:text-fg active:scale-95"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <p id={descId} className="mt-3 text-sm leading-relaxed text-fg-dim">
          Optional. Add your own Pollinations key for faster, higher-limit answers to open-ended questions. Without one, Redora AI keeps using its default connection.
        </p>

        <form onSubmit={submit} className="mt-6" noValidate>
          <label htmlFor={inputId} className="text-sm font-medium text-fg">API key</label>
          <div className="relative mt-2">
            <input
              id={inputId}
              ref={inputRef}
              name="pollinations-key"
              type={reveal ? 'text' : 'password'}
              value={value}
              maxLength={256}
              onChange={(e) => { setValue(e.target.value); setError(null); }}
              placeholder={hasKey ? 'Enter a new key to replace it' : 'Paste your key'}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              aria-invalid={error !== null}
              aria-describedby={error ? errorId : undefined}
              className="h-12 w-full rounded-xl border border-line-2 bg-ink-950 pl-3.5 pr-16 text-base text-fg transition-colors placeholder:text-fg-mute hover:border-fg-mute focus:border-crimson/70 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40 aria-[invalid=true]:border-crimson/70 sm:text-[0.935rem]"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              aria-pressed={reveal}
              aria-label={reveal ? 'Hide key' : 'Show key'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs text-fg-dim transition-colors hover:bg-white/5 hover:text-fg"
            >
              {reveal ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p id={errorId} role="alert" className="mt-2.5 flex items-start gap-1.5 text-xs leading-snug text-crimson-soft">
              <ShieldAlert aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" />{error}
            </p>
          )}
          {hasKey && !error && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-fg-dim">
              <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-crimson-soft" />A key is saved in this browser.
            </p>
          )}

          <p className="mt-5 flex items-start gap-2 rounded-xl border border-line-1 bg-white/[0.02] p-3.5 text-xs leading-relaxed text-fg-dim">
            <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-mute" />
            <span>Stored only in this browser. It is sent with your chat requests to this site’s server, which passes it to Pollinations and does not store or log it.</span>
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {hasKey ? (
              <button type="button" onClick={remove} className="min-h-[44px] rounded-full px-4 text-sm text-fg-dim transition-colors hover:text-crimson-soft sm:-ml-4">
                Remove key
              </button>
            ) : <span aria-hidden="true" />}
            <div className="flex gap-3">
              <button type="button" onClick={() => onClose()} className="min-h-[44px] flex-1 rounded-full border border-line-2 px-5 text-sm transition-colors hover:border-fg-mute hover:bg-white/[0.04] active:scale-[0.98] sm:flex-none">
                Cancel
              </button>
              <button
                type="submit"
                disabled={value.trim() === ''}
                className="min-h-[44px] flex-1 rounded-full bg-crimson px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-crimson-bright active:scale-[0.98] disabled:bg-surface-3 disabled:text-fg-mute sm:flex-none"
              >
                Save key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
