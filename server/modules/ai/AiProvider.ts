/** Port for any chat-completion backend (ADR-005). The chat service depends on this, not on Pollinations. */
export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  maxTokens: number;
  /** Optional key for this request only; falls back to the server's configured key. */
  apiKey?: string | undefined;
}

export interface AiProvider {
  readonly name: string;
  complete(request: AiCompletionRequest): Promise<string>;
}
