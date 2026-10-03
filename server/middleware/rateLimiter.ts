import type { RequestHandler } from 'express';
import { AppError } from '../lib/errors';

/** In-memory fixed-window limiter, per IP. Enough for a single-instance demo (see ADR-007). */
export function createRateLimiter(opts: { windowMs: number; max: number; now?: () => number }): RequestHandler {
  const now = opts.now ?? Date.now;
  const hits = new Map<string, { count: number; resetAt: number }>();

  const sweep = setInterval(() => {
    const t = now();
    for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
  }, opts.windowMs);
  sweep.unref();

  return (req, res, next) => {
    const key = req.ip ?? 'unknown';
    const t = now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      hits.set(key, { count: 1, resetAt: t + opts.windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > opts.max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - t) / 1000));
      return next(new AppError('RATE_LIMITED', 429, 'Too many requests. Please wait a moment and try again.'));
    }
    return next();
  };
}
