import { clientConfig } from '@/config/env';
import {
  API_ERROR_CODES, apiErrorSchema, chatResponseSchema,
  type ApiErrorCode, type ChatRequest, type ChatResponse,
} from '@/domain/chat/contracts';

export type ChatApiErrorCode = ApiErrorCode | 'NETWORK' | 'TIMEOUT' | 'INVALID_RESPONSE' | 'ABORTED';

export class ChatApiError extends Error {
  constructor(readonly code: ChatApiErrorCode, message: string, readonly retryable: boolean) {
    super(message);
    this.name = 'ChatApiError';
  }
}

/** Port used by the orchestrator — swap for a fake in tests. */
export interface ChatApi {
  send(request: ChatRequest, signal?: AbortSignal): Promise<ChatResponse>;
}

export class HttpChatApi implements ChatApi {
  constructor(
    private readonly baseUrl: string = clientConfig.apiBaseUrl,
    private readonly timeoutMs: number = clientConfig.requestTimeoutMs,
    private readonly fetchImpl: typeof fetch = (...args) => fetch(...args),
  ) {}

  async send(request: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), this.timeoutMs);
    const onAbort = () => controller.abort('aborted');
    signal?.addEventListener('abort', onAbort, { once: true });

    try {
      const res = await this.fetchImpl(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      const payload: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const parsed = apiErrorSchema.safeParse(payload);
        const code = parsed.success ? parsed.data.error.code : 'INTERNAL';
        const message = parsed.success ? parsed.data.error.message : 'Request failed';
        throw new ChatApiError(code, message, res.status >= 500 && code !== 'INVALID_REQUEST');
      }
      const parsed = chatResponseSchema.safeParse(payload);
      if (!parsed.success) throw new ChatApiError('INVALID_RESPONSE', 'Unexpected response shape', true);
      return parsed.data;
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      if (controller.signal.aborted) {
        throw controller.signal.reason === 'timeout'
          ? new ChatApiError('TIMEOUT', 'Request timed out', true)
          : new ChatApiError('ABORTED', 'Request cancelled', false);
      }
      throw new ChatApiError('NETWORK', 'Network error', true);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }
}

export const isKnownErrorCode = (c: string): c is ApiErrorCode => (API_ERROR_CODES as readonly string[]).includes(c);
