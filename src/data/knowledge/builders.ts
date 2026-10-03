import type { KnowledgeCategory, KnowledgeEntry } from '../../domain/knowledge/types';

type EntryInput = Omit<KnowledgeEntry, 'priority' | 'relatedTopics'> & {
  priority?: number;
  relatedTopics?: readonly string[];
};

export const entry = (e: EntryInput): KnowledgeEntry => ({ priority: 5, relatedTopics: [], ...e });

export const steps = (intro: string, items: readonly string[], note?: string): string =>
  [intro, '', 'Steps:', ...items.map((s, i) => `${i + 1}. ${s}`), ...(note ? ['', note] : [])].join('\n');

interface TroubleshootInput {
  id: string;
  title: string;
  keywords: readonly string[];
  cause: string;
  fix: string;
  alt: string;
  escalate: string;
  related?: readonly string[];
}

/** Every troubleshooting answer follows the same four-part structure. */
export const troubleshoot = (t: TroubleshootInput): KnowledgeEntry =>
  entry({
    id: `trouble-${t.id}`,
    category: 'troubleshooting' satisfies KnowledgeCategory,
    title: t.title,
    keywords: t.keywords,
    relatedTopics: [...(t.related ?? []), 'support-contact'],
    priority: 6,
    answer: [
      `Possible cause: ${t.cause}`,
      `Immediate solution: ${t.fix}`,
      `Alternative solution: ${t.alt}`,
      `Escalation path: ${t.escalate}`,
    ].join('\n'),
  });
