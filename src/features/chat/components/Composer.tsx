import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send, ShieldAlert } from 'lucide-react';
import { CHAT_COPY } from '@/config/copy';
import { MAX_MESSAGE_LENGTH } from '@/domain/chat/contracts';
import { SENSITIVE_WARNING, detectSensitiveData } from '@/domain/safety/sensitiveData';

interface Props { busy: boolean; onSend: (text: string) => void; autoFocus?: boolean; inputId?: string }

export function Composer({ busy, onSend, autoFocus, inputId }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const autoId = useId();
  const id = inputId ?? autoId;
  const sensitive = detectSensitiveData(value).length > 0;
  const canSend = value.trim().length > 0 && !busy && !sensitive;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit();
  };

  return (
    <form onSubmit={submit} className="border-t border-line-1 bg-ink-900/70 p-3">
      {sensitive && (
        <p role="alert" className="mb-2 flex items-start gap-1.5 rounded-lg border border-crimson/40 bg-crimson/10 px-3 py-2 text-xs text-crimson-soft">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />{SENSITIVE_WARNING}
        </p>
      )}
      <div className="flex items-end gap-2">
        <label htmlFor={id} className="sr-only">Message Redora AI</label>
        <textarea
          id={id}
          ref={ref}
          rows={1}
          value={value}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={CHAT_COPY.placeholder}
          autoComplete="off"
          className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-xl border border-line-2 bg-ink-950 px-3.5 py-2.5 text-base text-fg transition-colors placeholder:text-fg-mute hover:border-fg-mute focus:border-crimson/70 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40 sm:text-[0.935rem]"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={busy ? 'Redora AI is replying' : 'Send message'}
          className="group grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-crimson text-white transition-all duration-300 hover:scale-105 hover:bg-crimson-bright active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:scale-100 disabled:bg-surface-3 disabled:text-fg-mute"
        >
          {busy
            ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-fg-mute/40 border-t-fg-dim" />
            : <Send aria-hidden="true" className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-0.5" />}
        </button>
      </div>
      <p className="mt-2 flex justify-between gap-3 text-[0.7rem] leading-snug text-fg-mute">
        <span>{CHAT_COPY.disclaimer}</span>
        {value.length > 400 && <span aria-live="polite" className="shrink-0 tabular-nums">{value.length}/{MAX_MESSAGE_LENGTH}</span>}
      </p>
    </form>
  );
}
