import type { RequestHandler } from 'express';

/** Same-origin by default. Adds CORS headers only for explicitly allowed origins. */
export const createCors = (allowed: readonly string[]): RequestHandler => (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Pollinations-Key');
    if (req.method === 'OPTIONS') return void res.sendStatus(204);
  }
  return next();
};
