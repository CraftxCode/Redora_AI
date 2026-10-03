/** Client logger: verbose in dev, silent warnings/errors only in production. */
const isDev = import.meta.env.DEV;
export const logger = {
  debug: (...a: unknown[]) => { if (isDev) console.debug('[redora]', ...a); },
  warn: (...a: unknown[]) => console.warn('[redora]', ...a),
  error: (...a: unknown[]) => console.error('[redora]', ...a),
};
