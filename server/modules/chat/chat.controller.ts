import type { RequestHandler } from 'express';
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
  res.json(await service.reply(body));
};
