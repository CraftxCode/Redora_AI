/** Composition root: wires configuration, adapters and services together. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { knowledgeBase } from '../src/data/redoraKnowledge';
import { createApp } from './app';
import { loadConfig } from './config/env';
import { createLogger } from './lib/logger';
import { createAiProvider } from './modules/ai/createAiProvider';
import { ChatService } from './modules/chat/ChatService';

const config = loadConfig();
const logger = createLogger(config.logLevel);

const chatService = new ChatService({
  provider: createAiProvider(config.ai),
  retriever: knowledgeBase,
  logger,
  maxTokens: config.ai.maxTokens,
});

const staticDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const app = createApp({ config, logger, chatService, staticDir });

const server = app.listen(config.port, () => {
  logger.info('Redora AI API listening', { port: config.port, env: config.nodeEnv, model: config.ai.model, apiKey: config.ai.apiKey ? 'configured' : 'anonymous' });
});

const shutdown = (signal: string) => {
  logger.info('shutting down', { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
