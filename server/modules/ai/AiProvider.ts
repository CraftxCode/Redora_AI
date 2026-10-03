/** Port for any chat-completion backend (ADR-005). The chat service depends on this, not on Pollinations. */
export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  maxTokens: number;
}

export interface AiProvider {
  readonly name: string;
  complete(request: AiCompletionRequest): Promise<string>;
}
