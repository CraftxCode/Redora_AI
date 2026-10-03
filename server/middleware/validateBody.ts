import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/errors';

export const validateBody = <T>(schema: ZodType<T>): RequestHandler => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(new AppError('INVALID_REQUEST', 400, 'Please send a message of up to 500 characters.'));
  req.body = parsed.data;
  return next();
};
