import { LifeBuoy, ListTree, RotateCcw, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';
import { FormattedText } from '@/shared/components/FormattedText';
import type { UiMessage } from '../state/chatReducer';

interface Props {
  message: UiMessage;
  isLast: boolean;
  isActiveError: boolean;
  busy: boolean;
  onTopic: (id: string, title: string) => void;
  onRetry: () => void;
  onBrowse: () => void;
  onContact: () => void;
}

const SOURCE_LABEL = { local: 'Instant answer', cache: 'Saved answer', ai: 'AI answer' } as const;

export function MessageBubble({ message, isLast, isActiveError, busy, onTopic, onRetry, onBrowse, onContact }: Props) {
  if (message.role === 'user') {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-crimson/90 px-4 py-2.5 text-[0.935rem] leading-relaxed text-white">
          <span className="sr-only">You: </span>{message.content}
        </p>
      </li>
    );
  }

  const isError = message.variant === 'error';
  const isWarning = message.variant === 'warning';

  return (
    <li className="flex flex-col items-start gap-2">
      <div
        className={cn(
          'max-w-[92%] rounded-2xl rounded-bl-md border px-4 py-3 text-fg',
          isError ? 'border-crimson/50 bg-crimson-deep/25' : isWarning ? 'border-crimson-soft/40 bg-crimson/10' : 'border-line-1 bg-surface-2',
        )}
        {...(isError ? { role: 'alert' } : {})}
      >
        <span className="sr-only">Redora AI: </span>
        {(isError || isWarning) && (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-crimson-soft">
            <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5" />{isError ? 'Request failed' : 'Security notice'}
          </p>
        )}
        <FormattedText text={message.content} />
        {message.source && !isError && !isWarning && (
          <p className="mt-2.5 flex items-center gap-1 text-[0.68rem] tracking-wide text-fg-mute">
            <Zap aria-hidden="true" className="h-3 w-3" />{SOURCE_LABEL[message.source]}{message.source === 'local' ? ' · Redora knowledge base (DEMO)' : ''}
          </p>
        )}
        {isError && isActiveError && (
          <div className="mt-3 flex flex-wrap gap-2">
            <ActionButton onClick={onRetry} disabled={busy} icon={<RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />}>Try Again</ActionButton>
            <ActionButton onClick={onBrowse} disabled={busy} icon={<ListTree aria-hidden="true" className="h-3.5 w-3.5" />}>Browse Support Topics</ActionButton>
            <ActionButton onClick={onContact} disabled={busy} icon={<LifeBuoy aria-hidden="true" className="h-3.5 w-3.5" />}>Contact Support</ActionButton>
          </div>
        )}
      </div>
      {isLast && message.topics && message.topics.length > 0 && (
        <ul className="flex max-w-[95%] flex-wrap gap-1.5" aria-label="Related topics">
          {message.topics.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onTopic(t.id, t.title)}
                className="rounded-full border border-line-2 bg-white/[0.02] px-3 py-1.5 text-xs text-fg-dim transition-[background-color,border-color,color,transform] hover:border-crimson/60 hover:text-fg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function ActionButton({ children, icon, ...rest }: { children: string; icon: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...rest} className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-ink-900/60 px-3 py-2 text-xs font-medium transition-[background-color,border-color,transform] hover:border-crimson/70 hover:bg-crimson/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
      {icon}{children}
    </button>
  );
}
