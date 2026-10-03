import type { ApiErrorCode } from '../../src/domain/chat/contracts';

/** Operational error that is safe to describe to the client (never contains internals). */
export class AppError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type AiFailureKind = 'timeout' | 'http' | 'network' | 'invalid_response';

/** Raised by AI providers; mapped to AppError by the chat service. */
export class AiProviderError extends Error {
  constructor(
    readonly kind: AiFailureKind,
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'AiProviderError';
  }
  /** Retry only transient failures — never client errors or rate limits. */
  get retryable(): boolean {
    if (this.kind === 'timeout' || this.kind === 'network') return true;
    if (this.kind === 'http') return (this.status ?? 0) >= 500;
    return false;
  }
}
