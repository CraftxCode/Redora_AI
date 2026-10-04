import type { RequestHandler } from 'express';
import { POLLINATIONS_KEY_HEADER, normalizePollinationsKey } from '../../../src/domain/ai/pollinationsKey';
import type { ChatRequest } from '../../../src/domain/chat/contracts';
import { SENSITIVE_WARNING, detectSensitiveData } from '../../../src/domain/safety/sensitiveData';
import { AppError } from '../../lib/errors';
import type { ChatService } from './ChatService';

export const createChatController = (service: ChatService): RequestHandler => async (req, res) => {
  const body = req.body as ChatRequest;
  const texts = [body.message, ...body.history.map((h) => h.content)];
  if (texts.some((t) => detectSensitiveData(t).length > 0)) {
    throw new AppError('SENSITIVE_DATA', 422, SENSITIVE_WARNING);
  }
  // Optional per-request key from the footer configuration; a malformed value is ignored (server key applies).
  const apiKey = normalizePollinationsKey(req.get(POLLINATIONS_KEY_HEADER));
  res.json(await service.reply(body, { apiKey }));
};
