import { Router, type RequestHandler } from 'express';
import { chatRequestSchema } from '../../../src/domain/chat/contracts';
import { validateBody } from '../../middleware/validateBody';
import type { ChatService } from './ChatService';
import { createChatController } from './chat.controller';

export function createChatRouter(service: ChatService, rateLimiter: RequestHandler): Router {
  const router = Router();
  router.post('/', rateLimiter, validateBody(chatRequestSchema), createChatController(service));
  return router;
}
