/** Centralised, validated server configuration. The only place `process.env` is read. */
import 'dotenv/config';
import { z } from 'zod';

const emptyToUndefined = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);
const opt = <T extends z.ZodType>(schema: T) => z.preprocess(emptyToUndefined, schema.optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  POLLINATIONS_API_KEY: opt(z.string()),
  POLLINATIONS_MODEL: z.preprocess(emptyToUndefined, z.string().default('openai')),
  POLLINATIONS_API_URL: z.preprocess(emptyToUndefined, z.url().default('https://gen.pollinations.ai/v1/chat/completions')),
  AI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000),
  AI_MAX_TOKENS: z.coerce.number().int().min(100).max(2000).default(650),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(1000).default(20),
  CORS_ORIGINS: z.preprocess(emptyToUndefined, z.string().default('')),
  TRUST_PROXY: z.preprocess((v) => v === 'true' || v === true, z.boolean()),
});

export interface ServerConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  corsOrigins: string[];
  trustProxy: boolean;
  rateLimitPerMinute: number;
  ai: { apiKey?: string; model: string; apiUrl: string; timeoutMs: number; maxTokens: number };
}

export function loadConfig(source: NodeJS.ProcessEnv = process.env): ServerConfig {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration — ${details}`);
  }
  const e = parsed.data;
  return {
    nodeEnv: e.NODE_ENV,
    port: e.PORT,
    logLevel: e.LOG_LEVEL,
    corsOrigins: e.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
    trustProxy: e.TRUST_PROXY,
    rateLimitPerMinute: e.RATE_LIMIT_PER_MINUTE,
    ai: { apiKey: e.POLLINATIONS_API_KEY, model: e.POLLINATIONS_MODEL, apiUrl: e.POLLINATIONS_API_URL, timeoutMs: e.AI_TIMEOUT_MS, maxTokens: e.AI_MAX_TOKENS },
  };
}
