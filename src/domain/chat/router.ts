/**
 * Decides whether a question is answered locally (instant, free) or by the AI.
 * Pure function — easy to test, no I/O (ADR-002).
 */
import type { RetrievalResult } from '../knowledge/types';
import { normalize, wordCount } from '../knowledge/text';

export type Route = 'local' | 'ai';

const CONVERSATIONAL =
  /\b(compare|versus|vs|difference|why|explain|should|recommend|which|better|best|combine|both|between|worth)\b/;

export function decideRoute(query: string, result: RetrievalResult): Route {
  const [first, second] = result.hits;
  if (!first || result.confidence !== 'high') return 'ai';
  if (first.entry.id.startsWith('menu-')) return 'local';
  if (wordCount(query) > 12) return 'ai';
  if (CONVERSATIONAL.test(normalize(query))) return 'ai';
  if (second && second.entry.category !== first.entry.category && second.score >= first.score * 0.6) return 'ai';
  return 'local';
}

const ANAPHORA = /\b(it|this|they|them|those|these|previous|above|earlier|same|again)\b/;

/** A message is cacheable only when it does not depend on earlier turns. */
export function isStandalone(message: string): boolean {
  const n = normalize(message);
  return wordCount(n) >= 3 && !ANAPHORA.test(n);
}
