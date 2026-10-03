import { describe, expect, it, vi } from 'vitest';
import { INTEGRATIONS } from '../../../data/redoraFacts';
import { knowledgeBase } from '../../../data/redoraKnowledge';
import { ChatApiError, type ChatApi } from '../../../services/chatApi';
import { ChatOrchestrator } from './ChatOrchestrator';
import { StorageResponseCache } from './responseCache';

function setup(send: ChatApi['send'] = async () => ({ reply: 'AI says hi', source: 'ai' as const, relatedTopics: [] })) {
  const spy = vi.fn(send);
  const orchestrator = new ChatOrchestrator({ retriever: knowledgeBase, api: { send: spy }, cache: new StorageResponseCache(null), integrations: INTEGRATIONS });
  return { orchestrator, send: spy };
}

describe('ChatOrchestrator', () => {
  it('answers common questions locally without calling the AI', async () => {
    const { orchestrator, send } = setup();
    expect(await orchestrator.respond({ text: 'What is Redora?', history: [] })).toMatchObject({ type: 'answer', source: 'local' });
    expect(send).not.toHaveBeenCalled();
  });

  it('warns about secrets and never calls the AI', async () => {
    const { orchestrator, send } = setup();
    expect((await orchestrator.respond({ text: 'my password is Hunter2!', history: [] })).type).toBe('warning');
    expect(send).not.toHaveBeenCalled();
  });

  it('answers unsupported integrations from the catalog', async () => {
    const { orchestrator, send } = setup();
    const out = await orchestrator.respond({ text: 'Can I connect Redora to an imaginary service called XYZ?', history: [] });
    expect(out.type === 'answer' && out.content).toContain('not currently listed');
    expect(out.type === 'answer' && out.content).toContain('Google Calendar');
    expect(send).not.toHaveBeenCalled();
  });

  it('uses one AI request for conversational questions, then serves repeats from cache', async () => {
    const { orchestrator, send } = setup();
    const q = 'Which plan should I pick for a team of eight that wants automations?';
    expect(await orchestrator.respond({ text: q, history: [] })).toMatchObject({ type: 'answer', source: 'ai' });
    expect(await orchestrator.respond({ text: q, history: [] })).toMatchObject({ type: 'answer', source: 'cache' });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('resolves explicit topics instantly', async () => {
    const { orchestrator, send } = setup();
    const out = await orchestrator.respond({ text: 'Billing', entryId: 'menu-billing', history: [] });
    expect(out.type === 'answer' && out.topics.length).toBeGreaterThan(3);
    expect(send).not.toHaveBeenCalled();
  });

  it('degrades gracefully: failure plus best local answer', async () => {
    const { orchestrator } = setup(async () => { throw new ChatApiError('AI_UNAVAILABLE', 'down', true); });
    const out = await orchestrator.respond({ text: 'Why was my payment declined when I tried to pay the invoice', history: [] });
    expect(out.type).toBe('failure');
    if (out.type === 'failure') {
      expect(out.error.retryable).toBe(true);
      expect(out.fallback?.content).toBeTruthy();
    }
  });
});

describe('StorageResponseCache', () => {
  it('expires entries and bounds its size', () => {
    let now = 0;
    const cache = new StorageResponseCache(null, { ttlMs: 100, maxEntries: 2, now: () => now });
    cache.set('one two three', { reply: 'a', topics: [] });
    cache.set('four five six', { reply: 'b', topics: [] });
    cache.set('seven eight nine', { reply: 'c', topics: [] });
    expect(cache.get('one two three')).toBeNull();
    expect(cache.get('Seven, eight nine!')?.reply).toBe('c');
    now = 500;
    expect(cache.get('seven eight nine')).toBeNull();
  });
});
