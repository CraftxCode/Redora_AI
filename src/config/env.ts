/** Typed client configuration (only VITE_* values are ever exposed to the browser — never secrets). */
export const clientConfig = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
  requestTimeoutMs: 25_000,
} as const;
