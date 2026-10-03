export interface RetryOptions {
  retries: number;
  delayMs: number;
  shouldRetry: (error: unknown) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function withRetry<T>(task: () => Promise<T>, opts: RetryOptions): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= opts.retries || !opts.shouldRetry(error)) throw error;
      attempt += 1;
      opts.onRetry?.(error, attempt);
      await sleep(opts.delayMs);
    }
  }
}
