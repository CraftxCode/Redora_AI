import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { knowledgeBase } from '../src/data/redoraKnowledge';
import { createApp } from './app';
import { loadConfig } from './config/env';
import { AiProviderError } from './lib/errors';
import { createLogger } from './lib/logger';
import type { AiProvider } from './modules/ai/AiProvider';
import { ChatService } from './modules/chat/ChatService';
import { guardReply } from './modules/chat/responseGuard';

const silent = createLogger('error', {}, () => undefined);

function scripted(steps: Array<string | AiProviderError>): AiProvider & { calls: number } {
  const p = {
    name: 'fake',
    calls: 0,
    async complete() {
      const step = steps[Math.min(p.calls, steps.length - 1)]!;
      p.calls += 1;
      if (step instanceof Error) throw step;
      return step;
    },
  };
  return p;
}

const servers: Array<{ close: () => void }> = [];
afterEach(() => servers.splice(0).forEach((s) => s.close()));

async function boot(provider: AiProvider, rate = 20) {
  const config = loadConfig({ RATE_LIMIT_PER_MINUTE: String(rate) } as NodeJS.ProcessEnv);
  const chatService = new ChatService({ provider, retriever: knowledgeBase, logger: silent, maxTokens: 300, retryDelayMs: 1 });
  const server = createApp({ config, logger: silent, chatService }).listen(0);
  servers.push(server);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const post = (body: unknown) => fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { post, base };
}

describe('POST /api/chat', () => {
  it('returns a guarded AI reply with related topics', async () => {
    const { post } = await boot(scripted(['Pro costs $19/month.']));
    const res = await post({ message: 'How much is the Pro plan?' });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { reply: string; source: string; relatedTopics: unknown[] };
    expect(json.reply).toContain('$19');
    expect(json.source).toBe('ai');
    expect(json.relatedTopics.length).toBeGreaterThan(0);
  });

  it('retries once on a transient failure, then succeeds', async () => {
    const provider = scripted([new AiProviderError('http', 'boom', 503), 'Recovered answer.']);
    const { post } = await boot(provider);
    expect((await post({ message: 'storage question please' })).status).toBe(200);
    expect(provider.calls).toBe(2);
  });

  it('does not retry client errors and returns a safe 502', async () => {
    const provider = scripted([new AiProviderError('http', 'bad key', 401)]);
    const { post } = await boot(provider);
    const res = await post({ message: 'hello there support' });
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain('bad key');
    expect(provider.calls).toBe(1);
  });

  it('maps timeouts to 504', async () => {
    const { post } = await boot(scripted([new AiProviderError('timeout', 'slow')]));
    expect((await post({ message: 'hello there support' })).status).toBe(504);
  });

  it('rejects secrets and invalid payloads before calling the AI', async () => {
    const provider = scripted(['x']);
    const { post } = await boot(provider);
    const secret = await post({ message: 'my password is Hunter2!' });
    expect(secret.status).toBe(422);
    expect(((await secret.json()) as { error: { code: string } }).error.code).toBe('SENSITIVE_DATA');
    expect((await post({ message: '' })).status).toBe(400);
    expect((await post({ message: 'x'.repeat(501) })).status).toBe(400);
    expect(provider.calls).toBe(0);
  });

  it('rate limits per IP', async () => {
    const { post } = await boot(scripted(['ok']), 2);
    expect((await post({ message: 'one two three' })).status).toBe(200);
    expect((await post({ message: 'one two three' })).status).toBe(200);
    expect((await post({ message: 'one two three' })).status).toBe(429);
  });
});

describe('optional per-request Pollinations key', () => {
  const recording = () => {
    const keys: Array<string | undefined> = [];
    const provider: AiProvider = {
      name: 'recording',
      async complete(request) {
        keys.push(request.apiKey);
        return 'Pro costs $19/month.';
      },
    };
    return { provider, keys };
  };
  const send = (base: string, headers: Record<string, string> = {}) =>
    fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ message: 'How much is the Pro plan?' }) });

  it('passes a valid X-Pollinations-Key to the provider for that request only', async () => {
    const { provider, keys } = recording();
    const { base } = await boot(provider);
    expect((await send(base, { 'X-Pollinations-Key': 'sk_test_1234567890' })).status).toBe(200);
    expect((await send(base)).status).toBe(200);
    expect(keys).toEqual(['sk_test_1234567890', undefined]);
  });

  it('ignores a malformed key and falls back to the server configuration', async () => {
    const { provider, keys } = recording();
    const { base } = await boot(provider);
    expect((await send(base, { 'X-Pollinations-Key': 'too short' })).status).toBe(200);
    expect(keys).toEqual([undefined]);
  });
});

describe('responseGuard', () => {
  const hits = knowledgeBase.retrieve('reset password').hits;
  it('replaces "I don\'t know" replies with useful guidance', () => {
    const out = guardReply("I don't know.", hits);
    expect(out).not.toMatch(/don't know/i);
    expect(out).toContain('Forgot password');
    expect(out).toContain('support');
  });
  it('trims very long replies', () => {
    expect(guardReply('word '.repeat(900), hits).split(/\s+/).length).toBeLessThanOrEqual(401);
  });
});
