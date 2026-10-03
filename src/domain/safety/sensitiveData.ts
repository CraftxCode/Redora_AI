/**
 * Detects and redacts credentials a user might paste into chat. Used on both the
 * client (before sending / storing) and the server (defence in depth).
 */
export type SensitiveKind = 'password' | 'otp' | 'recovery_code' | 'api_secret' | 'card_number' | 'cvv';

export const SENSITIVE_WARNING =
  'For your security, please do not share passwords, OTPs, recovery codes, API secrets or payment security codes here.';

interface Rule {
  kind: SensitiveKind;
  pattern: RegExp;
  accept?: (match: RegExpExecArray) => boolean;
}

const hasDigitOrSymbol = (v: string): boolean => /[\d!@#$%^&*()_+=[\]{};:,.<>?/\\|~-]/.test(v);

function luhn(digits: string): boolean {
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

const RULES: Rule[] = [
  {
    kind: 'password',
    pattern: /\b(?:password|passcode|passwd|pwd)\s*(?:is|are|was|=|:)?\s*(["'“])?([^\s"'”]{4,})["'”]?/gi,
    accept: (m) => Boolean(m[1]) || hasDigitOrSymbol(m[2] ?? ''),
  },
  {
    kind: 'otp',
    pattern: /\b(?:otp|verification code|authentication code|auth code|one[- ]time (?:code|password)|2fa code|login code|sms code)\b\D{0,20}\d{4,8}\b/gi,
  },
  {
    kind: 'recovery_code',
    pattern: /\b(?:recovery|backup) (?:code|key)s?\b\W{0,5}(?:is|are)?\W{0,3}[A-Z0-9]{4,}(?:[-\s][A-Z0-9]{4,})+/gi,
    accept: (m) => /\d/.test(m[0]),
  },
  {
    kind: 'api_secret',
    pattern: /\b(?:(?:sk|rk|pk)[-_](?:live|test)?[-_]?[A-Za-z0-9]{16,}|rdr_[A-Za-z0-9_]{12,}|bearer\s+[A-Za-z0-9._-]{20,}|(?:api[ _-]?(?:key|secret|token)|secret|token)\s*(?:is|=|:)\s*["']?[A-Za-z0-9._-]{20,}["']?)/gi,
  },
  {
    kind: 'cvv',
    pattern: /\b(?:cvv2?|cvc|security code)\s*(?:is|=|:)?\s*\d{3,4}\b/gi,
  },
  {
    kind: 'card_number',
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    accept: (m) => {
      const digits = m[0].replace(/\D/g, '');
      return digits.length >= 13 && digits.length <= 19 && luhn(digits);
    },
  },
];

function* matches(text: string): Generator<{ kind: SensitiveKind; start: number; end: number }> {
  for (const rule of RULES) {
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    let m: RegExpExecArray | null = re.exec(text);
    while (m) {
      if (!rule.accept || rule.accept(m)) yield { kind: rule.kind, start: m.index, end: m.index + m[0].length };
      if (m[0].length === 0) re.lastIndex += 1;
      m = re.exec(text);
    }
  }
}

export function detectSensitiveData(text: string): SensitiveKind[] {
  return [...new Set([...matches(text)].map((m) => m.kind))];
}

export function redactSensitiveData(text: string): string {
  const spans = [...matches(text)].sort((a, b) => a.start - b.start);
  if (spans.length === 0) return text;
  let out = '';
  let cursor = 0;
  for (const s of spans) {
    if (s.start < cursor) continue;
    out += `${text.slice(cursor, s.start)}[redacted]`;
    cursor = s.end;
  }
  return out + text.slice(cursor);
}
