/**
 * Renders the light plain-text format used by knowledge answers and AI replies
 * (paragraphs, "1." lists, "- " bullets, "Label:" lines, **bold**, links).
 * Builds React elements only — never injects raw HTML.
 */
import { Fragment, type ReactNode } from 'react';

const LABELS = /^(Steps|Important|Why|Source|Answer|Possible cause|Immediate solution|Alternative solution|Escalation path|Next best steps|Includes|Plans)\s*:\s*(.*)$/i;
const INLINE = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={key} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part)) {
      const trimmed = part.replace(/[.,;:!?]+$/, '');
      const tail = part.slice(trimmed.length);
      return (
        <Fragment key={key}>
          <a href={trimmed} target="_blank" rel="noopener noreferrer" className="break-all text-crimson-soft underline decoration-crimson/40 underline-offset-2 hover:text-crimson-bright">{trimmed}</a>
          {tail}
        </Fragment>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return <a key={key} href={`mailto:${part}`} className="break-all text-crimson-soft underline decoration-crimson/40 underline-offset-2 hover:text-crimson-bright">{part}</a>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

type Block = { kind: 'p'; text: string } | { kind: 'ol' | 'ul'; items: string[] };

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    const ul = /^[-•*]\s+(.*)$/.exec(line);
    const kind = ol ? 'ol' : ul ? 'ul' : null;
    if (kind) {
      const last = blocks[blocks.length - 1];
      const item = (ol ?? ul)?.[1] ?? '';
      if (last && last.kind === kind) last.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else {
      blocks.push({ kind: 'p', text: line });
    }
  }
  return blocks;
}

export function FormattedText({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-[0.935rem] leading-relaxed">
      {parse(text).map((b, i) => {
        if (b.kind === 'p') {
          const m = LABELS.exec(b.text);
          return (
            <p key={i}>
              {m ? (<><strong className="font-semibold text-fg">{m[1]}:</strong>{' '}{inline(m[2] ?? '', `p${i}`)}</>) : inline(b.text, `p${i}`)}
            </p>
          );
        }
        const Tag = b.kind;
        return (
          <Tag key={i} className={b.kind === 'ol' ? 'list-decimal space-y-1.5 pl-5 marker:text-crimson-soft' : 'list-disc space-y-1.5 pl-5 marker:text-crimson-soft'}>
            {b.items.map((it, j) => <li key={j}>{inline(it, `l${i}-${j}`)}</li>)}
          </Tag>
        );
      })}
    </div>
  );
}
