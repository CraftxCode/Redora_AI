import type { ChatRequest, ChatResponse, TopicRef } from '../../../src/domain/chat/contracts';
import type { KnowledgeRetriever } from '../../../src/domain/knowledge/retriever';
import { wordCount } from '../../../src/domain/knowledge/text';
import { AiProviderError, AppError } from '../../lib/errors';
import type { Logger } from '../../lib/logger';
import { withRetry } from '../../lib/retry';
import type { AiProvider } from '../ai/AiProvider';
import { buildMessages } from './promptBuilder';
import { guardReply } from './responseGuard';

export interface ChatServiceDeps {
  provider: AiProvider;
  retriever: KnowledgeRetriever;
  logger: Logger;
  maxTokens: number;
  retryDelayMs?: number;
}

/** Business logic for one chat turn: retrieve → prompt → one AI call (+1 retry) → guard. */
export class ChatService {
  constructor(private readonly deps: ChatServiceDeps) {}

  async reply({ message, history }: ChatRequest, options: { apiKey?: string | undefined } = {}): Promise<ChatResponse> {
    const { provider, retriever, logger, maxTokens } = this.deps;

    // Short follow-ups ("and the second one?") need the previous question for retrieval.
    const lastUser = [...history].reverse().find((h) => h.role === 'user')?.content ?? '';
    const retrievalQuery = wordCount(message) < 5 && lastUser ? `${lastUser} ${message}` : message;
    const { hits } = retriever.retrieve(retrievalQuery, { limit: 3 });

    let raw: string;
    try {
      raw = await withRetry(
        () => provider.complete({ messages: buildMessages(message, history, hits.map((h) => h.entry)), maxTokens, apiKey: options.apiKey }),
        {
          retries: 1,
          delayMs: this.deps.retryDelayMs ?? 400,
          shouldRetry: (e) => e instanceof AiProviderError && e.retryable,
          onRetry: (e, attempt) => logger.warn('retrying AI request', { attempt, reason: (e as Error).message }),
        },
      );
    } catch (error) {
      if (error instanceof AiProviderError) {
        logger.error('AI provider failed', { provider: provider.name, kind: error.kind, status: error.status });
        if (error.kind === 'timeout') throw new AppError('AI_TIMEOUT', 504, 'Redora AI took too long to respond.', error);
      }
      throw new AppError('AI_UNAVAILABLE', 502, 'Redora AI is temporarily unable to process that request.', error);
    }

    return {
      reply: guardReply(raw, hits),
      source: 'ai',
      relatedTopics: this.relatedTopics(hits.map((h) => h.entry.relatedTopics)),
    };
  }

  private relatedTopics(groups: ReadonlyArray<readonly string[]>): TopicRef[] {
    const seen = new Set<string>();
    const out: TopicRef[] = [];
    for (const id of groups.flat()) {
      if (seen.has(id)) continue;
      seen.add(id);
      const entry = this.deps.retriever.getById(id);
      if (entry) out.push({ id: entry.id, title: entry.title });
      if (out.length === 4) break;
    }
    return out;
  }
}
