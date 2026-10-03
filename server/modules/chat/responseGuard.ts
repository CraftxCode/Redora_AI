import type { RetrievalHit } from '../../../src/domain/knowledge/types';
import { COMPANY } from '../../../src/data/redoraFacts';

const FORBIDDEN = /\b(i\s+(?:do\s*not|don'?t|dont|can'?t\s+really)\s+know|i\s+have\s+no\s+idea|i'?m\s+not\s+sure|i\s+am\s+not\s+sure|no\s+idea)\b/i;
export const MAX_REPLY_WORDS = 400;

export function truncateWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  const cut = words.slice(0, maxWords).join(' ');
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'));
  return lastStop > cut.length * 0.6 ? cut.slice(0, lastStop + 1) : `${cut}…`;
}

/** Deterministic, always-useful reply built from retrieved knowledge. */
export function composeFallback(hits: readonly RetrievalHit[]): string {
  const top = hits[0]?.entry;
  const closest = top ? `${top.answer}\n\n` : 'Redora helps with accounts, plans, billing, features, integrations, security and troubleshooting.\n\n';
  return `${closest}That may not cover your exact situation. Next best step: check the documentation (${COMPANY.docsUrl}, DEMO) or email ${COMPANY.supportEmail} (DEMO) with the details.`;
}

/** Enforces the "never leave the user without help" rule and the length budget. */
export function guardReply(raw: string, hits: readonly RetrievalHit[]): string {
  const cleaned = raw
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*\*\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!cleaned || FORBIDDEN.test(cleaned)) return truncateWords(composeFallback(hits), MAX_REPLY_WORDS);
  return truncateWords(cleaned, MAX_REPLY_WORDS);
}
