/**
 * Decides how each user turn is answered (ADR-002): safety → explicit topic →
 * unsupported-integration rule → local knowledge → cache → one AI request.
 * Pure orchestration over injected ports, so it is fully unit-testable.
 */
import type { ChatHistoryItem, TopicRef } from '@/domain/chat/contracts';
import { decideRoute, isStandalone } from '@/domain/chat/router';
import { findUnsupportedIntegration, type CatalogItem } from '@/domain/knowledge/integrationCheck';
import type { KnowledgeRetriever } from '@/domain/knowledge/retriever';
import type { KnowledgeEntry } from '@/domain/knowledge/types';
import { SENSITIVE_WARNING, detectSensitiveData } from '@/domain/safety/sensitiveData';
import { unsupportedIntegrationReply } from '@/data/responses';
import { ChatApiError, type ChatApi } from '@/services/chatApi';
import type { ResponseCache } from './responseCache';

export type AnswerSource = 'local' | 'ai' | 'cache';

export type ChatOutcome =
  | { type: 'answer'; content: string; source: AnswerSource; topics: TopicRef[] }
  | { type: 'warning'; content: string }
  | { type: 'failure'; error: ChatApiError; fallback: { content: string; topics: TopicRef[] } | null };

export interface TurnInput {
  text: string;
  /** Pre-resolved topic (quick action / follow-up chip). Skips retrieval and the AI. */
  entryId?: string;
  history: ChatHistoryItem[];
}

export interface OrchestratorDeps {
  retriever: KnowledgeRetriever;
  api: ChatApi;
  cache: ResponseCache;
  integrations: readonly CatalogItem[];
}

export class ChatOrchestrator {
  constructor(private readonly deps: OrchestratorDeps) {}

  async respond({ text, entryId, history }: TurnInput, signal?: AbortSignal): Promise<ChatOutcome> {
    const { retriever, api, cache, integrations } = this.deps;

    if (detectSensitiveData(text).length > 0) return { type: 'warning', content: SENSITIVE_WARNING };

    const direct = entryId ? retriever.getById(entryId) : undefined;
    if (direct) return this.local(direct);

    const unsupported = findUnsupportedIntegration(text, integrations);
    if (unsupported) {
      const entry = retriever.getById('integrations-unsupported');
      return { type: 'answer', source: 'local', content: unsupportedIntegrationReply(unsupported), topics: entry ? this.topics(entry) : [] };
    }

    const result = retriever.retrieve(text);
    const top = result.hits[0]?.entry;
    if (top && decideRoute(text, result) === 'local') return this.local(top);

    const standalone = isStandalone(text);
    if (standalone) {
      const cached = cache.get(text);
      if (cached) return { type: 'answer', source: 'cache', content: cached.reply, topics: cached.topics };
    }

    try {
      const res = await api.send({ message: text, history }, signal);
      if (standalone) cache.set(text, { reply: res.reply, topics: res.relatedTopics });
      return { type: 'answer', source: 'ai', content: res.reply, topics: res.relatedTopics };
    } catch (error) {
      const err = error instanceof ChatApiError ? error : new ChatApiError('NETWORK', 'Unexpected failure', true);
      if (err.code === 'SENSITIVE_DATA') return { type: 'warning', content: SENSITIVE_WARNING };
      const usable = result.confidence !== 'low' ? top : undefined;
      return { type: 'failure', error: err, fallback: usable ? { content: usable.answer, topics: this.topics(usable) } : null };
    }
  }

  private local(entry: KnowledgeEntry): ChatOutcome {
    return { type: 'answer', source: 'local', content: entry.answer, topics: this.topics(entry) };
  }

  private topics(entry: KnowledgeEntry): TopicRef[] {
    return this.deps.retriever.resolve(entry.relatedTopics).map(({ id, title }) => ({ id, title }));
  }
}
