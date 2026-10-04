/**
 * Optional per-request Pollinations key. Shared by the browser (sends it) and the
 * server (validates it), so both sides agree on what a usable key looks like.
 */
export const POLLINATIONS_KEY_HEADER = 'X-Pollinations-Key';

/** Printable ASCII with no whitespace: safe to place in an HTTP header and a Bearer token. */
const KEY_PATTERN = /^[\x21-\x7E]{8,256}$/;

/** Returns the trimmed key, or undefined when it is missing or malformed. */
export function normalizePollinationsKey(value: string | null | undefined): string | undefined {
  const key = value?.trim();
  return key && KEY_PATTERN.test(key) ? key : undefined;
}
