import type {
  Confidence,
  KnowledgeCategory,
  KnowledgeEntry,
  RetrievalHit,
  RetrievalResult,
} from './types';
import { containsSequence, isStopword, tokenize } from './text';

interface IndexedEntry {
  entry: KnowledgeEntry;
  keywordTokens: string[][];
  titleTokens: string[];
}

export interface RetrieveOptions {
  limit?: number;
  minScore?: number;
}

const HIGH_SCORE = 8.5;
const HIGH_GAP = 4;
const MEDIUM_SCORE = 5;

/**
 * Lightweight keyword retriever (ADR-003). No embeddings, no network:
 * contiguous keyword phrases score highest, then all-tokens-present, then title overlap.
 */
export class KnowledgeRetriever {
  private readonly index: IndexedEntry[];
  private readonly byId: Map<string, KnowledgeEntry>;

  constructor(entries: readonly KnowledgeEntry[]) {
    this.byId = new Map(entries.map((e) => [e.id, e]));
    this.index = entries.map((entry) => ({
      entry,
      keywordTokens: entry.keywords.map(tokenize).filter((t) => t.length > 0),
      titleTokens: tokenize(entry.title).filter((t) => !isStopword(t)),
    }));
  }

  getById(id: string): KnowledgeEntry | undefined {
    return this.byId.get(id);
  }

  resolve(ids: readonly string[]): KnowledgeEntry[] {
    return ids.flatMap((id) => {
      const e = this.byId.get(id);
      return e ? [e] : [];
    });
  }

  retrieve(query: string, { limit = 3, minScore = 2 }: RetrieveOptions = {}): RetrievalResult {
    const tokens = tokenize(query);
    const tokenSet = new Set(tokens);
    const hits: RetrievalHit[] = [];

    for (const item of this.index) {
      const score = this.score(item, tokens, tokenSet);
      if (score >= minScore) hits.push({ entry: item.entry, score });
    }
    hits.sort((a, b) => b.score - a.score);
    const top = hits.slice(0, limit);
    return { hits: top, confidence: this.confidence(top), category: this.dominantCategory(top) };
  }

  private score(item: IndexedEntry, tokens: string[], tokenSet: Set<string>): number {
    let score = 0;
    for (const kw of item.keywordTokens) {
      if (containsSequence(tokens, kw)) {
        score += 3 + kw.length * 2.5;
      } else if (kw.length > 1 && kw.every((t) => tokenSet.has(t))) {
        score += 1.5 * kw.length;
      }
    }
    for (const t of item.titleTokens) if (tokenSet.has(t)) score += 0.8;
    return score > 0 ? score + item.entry.priority / 20 : 0;
  }

  private confidence(hits: readonly RetrievalHit[]): Confidence {
    const [first, second] = hits;
    if (!first) return 'low';
    if (first.score >= HIGH_SCORE && (!second || first.score - second.score >= HIGH_GAP)) return 'high';
    return first.score >= MEDIUM_SCORE ? 'medium' : 'low';
  }

  private dominantCategory(hits: readonly RetrievalHit[]): KnowledgeCategory | null {
    const totals = new Map<KnowledgeCategory, number>();
    for (const h of hits) totals.set(h.entry.category, (totals.get(h.entry.category) ?? 0) + h.score);
    let best: KnowledgeCategory | null = null;
    let bestScore = 0;
    for (const [cat, s] of totals) {
      if (s > bestScore) {
        best = cat;
        bestScore = s;
      }
    }
    return best;
  }
}
