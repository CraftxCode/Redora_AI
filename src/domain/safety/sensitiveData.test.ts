import { describe, expect, it } from 'vitest';
import { detectSensitiveData, redactSensitiveData } from './sensitiveData';

describe('sensitive data detection', () => {
  it('flags credentials', () => {
    expect(detectSensitiveData('my password is Hunter2!')).toContain('password');
    expect(detectSensitiveData('my OTP is 482913')).toContain('otp');
    expect(detectSensitiveData('card 4242 4242 4242 4242')).toContain('card_number');
    expect(detectSensitiveData('cvv 123')).toContain('cvv');
    expect(detectSensitiveData('api key: sk_live_abcdefghijklmnop1234')).toContain('api_secret');
    expect(detectSensitiveData('recovery code A1B2-C3D4-E5F6')).toContain('recovery_code');
  });
  it('does not flag ordinary support questions', () => {
    for (const q of ['I forgot my password', 'my password is incorrect', 'order 12345678 failed', 'where do I find my recovery codes?', 'password reset email']) {
      expect(detectSensitiveData(q), q).toEqual([]);
    }
  });
  it('redacts matches', () => {
    const out = redactSensitiveData('my password is Hunter2! and cvv 123');
    expect(out).not.toContain('Hunter2');
    expect(out).not.toContain('123');
    expect(out).toContain('[redacted]');
  });
});
