/**
 * Detects "Can I connect Redora to <unknown service>?" so the assistant can answer
 * with the catalog instead of guessing. Pure and unit-tested.
 */
import { normalize } from './text';

export interface CatalogItem {
  readonly name: string;
  readonly aliases: readonly string[];
}

const TRIGGER = /\b(connect|integrate|integration|sync|link|plug|hook)\b/i;
const FILLER = new Set([
  'a', 'an', 'the', 'my', 'our', 'your', 'some', 'any', 'another', 'other', 'new', 'different',
  'imaginary', 'fictional', 'custom', 'external', 'third', 'party', 'service', 'app', 'tool',
  'platform', 'called', 'named', 'redora', 'up', 'it', 'this', 'that', 'also',
]);
const STOP = new Set(['for', 'so', 'which', 'please', 'and', 'or', 'if', 'but', 'because', 'when', 'then', 'to', 'with', 'into']);
const NOT_A_SERVICE = new Set([
  'account', 'workspace', 'team', 'project', 'projects', 'phone', 'email', 'mobile', 'api', 'device',
  'computer', 'files', 'file', 'data', 'support', 'plan', 'billing', 'dashboard', 'automation',
]);

export function findUnsupportedIntegration(query: string, catalog: readonly CatalogItem[]): string | null {
  if (!TRIGGER.test(query)) return null;

  const words = query.match(/[A-Za-z0-9][\w.+-]*/g) ?? [];
  const lower = words.map((w) => w.toLowerCase());
  const triggerIdx = lower.findIndex((w) => /^(connect|integrate|integration|sync|link|plug|hook)$/.test(w));
  if (triggerIdx < 0) return null;

  const prepIdx = lower.findIndex((w, i) => i > triggerIdx && /^(to|with|into)$/.test(w));
  if (prepIdx < 0) return null;

  const candidate: string[] = [];
  for (let i = prepIdx + 1; i < words.length && candidate.length < 2; i += 1) {
    const w = lower[i] as string;
    if (STOP.has(w)) break;
    if (FILLER.has(w)) continue;
    candidate.push(words[i] as string);
  }
  if (candidate.length === 0) return null;

  const first = (candidate[0] as string).toLowerCase();
  if (NOT_A_SERVICE.has(first)) return null;

  const haystack = ` ${normalize(candidate.join(' '))} `;
  const wholeQuery = ` ${normalize(query)} `;
  for (const item of catalog) {
    for (const name of [item.name, ...item.aliases]) {
      const n = normalize(name);
      if (n && (haystack.includes(` ${n} `) || wholeQuery.includes(` ${n} `))) return null;
    }
  }
  return candidate.join(' ');
}
