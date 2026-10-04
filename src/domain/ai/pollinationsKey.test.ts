import { describe, expect, it } from 'vitest';
import { normalizePollinationsKey } from './pollinationsKey';

describe('normalizePollinationsKey', () => {
  it('trims and accepts printable keys', () => {
    expect(normalizePollinationsKey('  sk_abcdef123456  ')).toBe('sk_abcdef123456');
  });

  it('rejects missing, short, spaced, non-ASCII and oversized values', () => {
    expect(normalizePollinationsKey(undefined)).toBeUndefined();
    expect(normalizePollinationsKey(null)).toBeUndefined();
    expect(normalizePollinationsKey('')).toBeUndefined();
    expect(normalizePollinationsKey('short')).toBeUndefined();
    expect(normalizePollinationsKey('has a space inside')).toBeUndefined();
    expect(normalizePollinationsKey('clé-with-accent-123')).toBeUndefined();
    expect(normalizePollinationsKey('k'.repeat(257))).toBeUndefined();
  });
});
