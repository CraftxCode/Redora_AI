export const KNOWLEDGE_CATEGORIES = [
  'general',
  'account',
  'billing',
  'pricing',
  'features',
  'security',
  'integrations',
  'troubleshooting',
  'api',
  'support',
  'plans',
] as const;
export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

export interface KnowledgeEntry {
  readonly id: string;
  readonly category: KnowledgeCategory;
  readonly title: string;
  /** Lower-case phrases. Multi-word phrases score higher than single words. */
  readonly keywords: readonly string[];
  /** Plain text. Supports "Steps:" / "Important:" labels, "1." lists and "- " bullets. */
  readonly answer: string;
  /** Ids of entries offered as follow-up topics. */
  readonly relatedTopics: readonly string[];
  /** 1 (low) – 10 (high). Only used as a small tie-breaker. */
  readonly priority: number;
}

export interface RetrievalHit {
  readonly entry: KnowledgeEntry;
  readonly score: number;
}

export type Confidence = 'high' | 'medium' | 'low';

export interface RetrievalResult {
  readonly hits: readonly RetrievalHit[];
  readonly confidence: Confidence;
  readonly category: KnowledgeCategory | null;
}
