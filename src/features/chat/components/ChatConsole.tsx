import { useEffect, useRef } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/lib/animations/gsap';
import { useChat } from '../state/ChatProvider';
import { Composer } from './Composer';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { StatusDot } from './StatusDot';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  variant: 'floating' | 'embedded';
  /** Whether this instance announces new messages to screen readers (avoid double announcements). */
  live?: boolean;
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
  inputId?: string;
}

export function ChatConsole({ variant, live = true, onClose, autoFocus, className, inputId }: Props) {
  const chat = useChat();
  const logRef = useRef<HTMLOListElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pristine = chat.messages.length === 1;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [chat.messages.length, chat.status]);

  const lastId = chat.messages[chat.messages.length - 1]?.id;

  return (
    <div className={cn('glass-strong flex min-h-0 flex-col overflow-hidden rounded-3xl shadow-panel', className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line-1 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-crimson/50 bg-crimson/10">
            <span className="h-3 w-3 rounded-full bg-crimson-bright shadow-[0_0_14px_3px_rgba(255,48,48,.6)]" />
          </span>
          <div>
            <h3 className="flex items-center gap-3 text-sm font-semibold tracking-[0.12em]">REDORA AI <StatusDot /></h3>
            <p className="text-xs text-fg-dim">Intelligent support assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!pristine && (
            <button type="button" onClick={chat.reset} aria-label="Start a new conversation" className="grid h-8 w-8 place-items-center rounded-full text-fg-dim transition-colors hover:bg-white/5 hover:text-fg">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close Redora AI" className="grid h-8 w-8 place-items-center rounded-full text-fg-dim transition-colors hover:bg-white/5 hover:text-fg">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <div ref={scrollRef} className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', variant === 'embedded' ? 'h-[420px]' : '')}>
        <ol
          ref={logRef}
          role="log"
          aria-label="Conversation with Redora AI"
          aria-live={live ? 'polite' : 'off'}
          aria-relevant="additions"
          className="space-y-3"
        >
          {chat.messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isLast={m.id === lastId}
              isActiveError={m.id === chat.activeErrorId}
              busy={chat.status === 'thinking'}
              onTopic={(id, title) => chat.send(title, { entryId: id })}
              onRetry={chat.retry}
              onBrowse={chat.browseTopics}
              onContact={chat.contactSupport}
            />
          ))}
          {chat.status === 'thinking' && <TypingIndicator />}
        </ol>
        {pristine && (
          <div className="mt-4">
            <QuickActions disabled={chat.status === 'thinking'} onPick={(label, entryId) => chat.send(label, { entryId })} />
          </div>
        )}
      </div>

      <Composer busy={chat.status === 'thinking'} onSend={(t) => chat.send(t)} autoFocus={autoFocus} inputId={inputId} />
    </div>
  );
}
