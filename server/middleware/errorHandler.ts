import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorBody } from '../../src/domain/chat/contracts';
import { AppError } from '../lib/errors';
import type { Logger } from '../lib/logger';

export const notFound: RequestHandler = (_req, res) => {
  const body: ApiErrorBody = { error: { code: 'NOT_FOUND', message: 'Route not found.' } };
  res.status(404).json(body);
};

/** Single place where errors become HTTP responses. Raw errors never reach the client. */
export const createErrorHandler = (logger: Logger): ErrorRequestHandler => (err, req, res, _next) => {
  let status = 500;
  let body: ApiErrorBody = { error: { code: 'INTERNAL', message: 'Something went wrong on our side.' } };

  if (err instanceof AppError) {
    status = err.status;
    body = { error: { code: err.code, message: err.message } };
    logger.warn('request failed', { code: err.code, status, path: req.path, cause: err.cause });
  } else if (err instanceof ZodError || (err as { type?: string })?.type === 'entity.parse.failed') {
    status = 400;
    body = { error: { code: 'INVALID_REQUEST', message: 'The request was not valid.' } };
    logger.warn('invalid request', { path: req.path });
  } else {
    logger.error('unhandled error', { path: req.path, err });
  }
  res.status(status).json(body);
};
