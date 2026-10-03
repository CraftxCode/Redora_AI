/**
 * Chat API contract — the single source of truth shared by the Express server
 * and the React client. Both sides validate against these schemas.
 */
import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_HISTORY_ITEMS = 6;
export const MAX_HISTORY_CONTENT = 1200;

export const topicRefSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});
export type TopicRef = z.infer<typeof topicRefSchema>;

export const chatHistoryItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(MAX_HISTORY_CONTENT),
});
export type ChatHistoryItem = z.infer<typeof chatHistoryItemSchema>;

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  history: z.array(chatHistoryItemSchema).max(MAX_HISTORY_ITEMS).default([]),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  reply: z.string().min(1),
  source: z.literal('ai'),
  relatedTopics: z.array(topicRefSchema),
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const API_ERROR_CODES = [
  'INVALID_REQUEST',
  'SENSITIVE_DATA',
  'RATE_LIMITED',
  'AI_UNAVAILABLE',
  'AI_TIMEOUT',
  'NOT_FOUND',
  'INTERNAL',
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum(API_ERROR_CODES),
    message: z.string(),
  }),
});
export type ApiErrorBody = z.infer<typeof apiErrorSchema>;
