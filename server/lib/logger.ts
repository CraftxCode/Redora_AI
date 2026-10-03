/** Minimal structured logger with secret redaction. Swap for pino/winston without touching callers. */
type Level = 'debug' | 'info' | 'warn' | 'error';
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface Logger {
  debug(msg: string, ctx?: Record<string, unknown>): void;
  info(msg: string, ctx?: Record<string, unknown>): void;
  warn(msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, ctx?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): Logger;
}

const SECRET_KEY = /key|secret|token|authorization|password/i;

function sanitize(value: unknown, depth = 0): unknown {
  if (value instanceof Error) return { name: value.name, message: value.message };
  if (depth > 3 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => sanitize(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, SECRET_KEY.test(k) ? '[redacted]' : sanitize(v, depth + 1)]),
  );
}

export function createLogger(level: Level = 'info', bindings: Record<string, unknown> = {}, sink: (line: string) => void = console.log): Logger {
  const emit = (lvl: Level, msg: string, ctx?: Record<string, unknown>) => {
    if (ORDER[lvl] < ORDER[level]) return;
    sink(JSON.stringify({ time: new Date().toISOString(), level: lvl, msg, ...(sanitize({ ...bindings, ...ctx }) as object) }));
  };
  return {
    debug: (m, c) => emit('debug', m, c),
    info: (m, c) => emit('info', m, c),
    warn: (m, c) => emit('warn', m, c),
    error: (m, c) => emit('error', m, c),
    child: (b) => createLogger(level, { ...bindings, ...b }, sink),
  };
}
