import express from 'express';
import serverless from 'serverless-http';
import { createApp } from '../../server/app';
import { loadConfig } from '../../server/config/env';
import { createLogger } from '../../server/lib/logger';
import { createAiProvider } from '../../server/modules/ai/createAiProvider';
import { ChatService } from '../../server/modules/chat/ChatService';
import { knowledgeBase } from '../../src/data/redoraKnowledge';

const config = loadConfig();
const logger = createLogger(config.logLevel);
const chatService = new ChatService({
  provider: createAiProvider(config.ai),
  retriever: knowledgeBase,
  logger,
  maxTokens: config.ai.maxTokens,
});

const functionApp = express();
functionApp.use((req, _res, next) => {
  const functionPrefix = '/.netlify/functions/api';
  if (req.url === functionPrefix) req.url = '/api';
  else if (req.url.startsWith(`${functionPrefix}/`)) {
    req.url = `/api${req.url.slice(functionPrefix.length)}`;
  }
  next();
});
functionApp.use(createApp({ config, logger, chatService }));

export const handler = serverless(functionApp);
