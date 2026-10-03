import type { RequestHandler } from 'express';
import type { Logger } from '../lib/logger';

export const requestLogger = (logger: Logger): RequestHandler => (req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    if (!req.path.startsWith('/api')) return;
    logger.info('request', { method: req.method, path: req.path, status: res.statusCode, ms: Math.round(performance.now() - start) });
  });
  next();
};
