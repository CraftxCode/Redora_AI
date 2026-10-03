import { existsSync } from 'node:fs';
import path from 'node:path';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { ServerConfig } from './config/env';
import type { Logger } from './lib/logger';
import { createCors } from './middleware/cors';
import { createErrorHandler, notFound } from './middleware/errorHandler';
import { createRateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import type { ChatService } from './modules/chat/ChatService';
import { createChatRouter } from './modules/chat/chat.routes';
import { createHealthRouter } from './modules/health/health.routes';

export interface AppDeps {
  config: ServerConfig;
  logger: Logger;
  chatService: ChatService;
  /** Directory with the built web app. Served only if it exists. */
  staticDir?: string;
}

export function createApp({ config, logger, chatService, staticDir }: AppDeps): Express {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', 1);

  app.use(helmet());
  app.use(createCors(config.corsOrigins));
  app.use(requestLogger(logger));
  app.use(express.json({ limit: '16kb' }));

  const limiter = createRateLimiter({ windowMs: 60_000, max: config.rateLimitPerMinute });
  app.use('/api/health', createHealthRouter({ model: config.ai.model, hasApiKey: Boolean(config.ai.apiKey) }));
  app.use('/api/chat', createChatRouter(chatService, limiter));
  app.use('/api', notFound);

  if (staticDir && existsSync(path.join(staticDir, 'index.html'))) {
    app.use(express.static(staticDir, { maxAge: '1h', index: false }));
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(staticDir, 'index.html')));
  }

  app.use(createErrorHandler(logger));
  return app;
}
