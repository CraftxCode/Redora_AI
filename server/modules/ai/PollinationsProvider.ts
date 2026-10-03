import { z } from 'zod';
import { AiProviderError } from '../../lib/errors';
import type { AiCompletionRequest, AiProvider } from './AiProvider';

export interface PollinationsConfig {
  apiUrl: string;
  apiKey?: string;
  model: string;
  timeoutMs: number;
}

const completionSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string().nullable() }) })).min(1),
});

/** OpenAI-compatible Pollinations client. The key stays on the server and is optional (anonymous tier). */
export class PollinationsProvider implements AiProvider {
  readonly name = 'pollinations';

  constructor(
    private readonly config: PollinationsConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async complete({ messages, maxTokens }: AiCompletionRequest): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetchImpl(this.config.apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({ model: this.config.model, messages, max_tokens: maxTokens, temperature: 0.4, stream: false }),
      });
      if (!response.ok) throw new AiProviderError('http', `Pollinations responded ${response.status}`, response.status);

      const parsed = completionSchema.safeParse(await response.json());
      const content = parsed.success ? parsed.data.choices[0]?.message.content?.trim() : undefined;
      if (!content) throw new AiProviderError('invalid_response', 'Pollinations returned no content');
      return content;
    } catch (error) {
      if (error instanceof AiProviderError) throw error;
      if (error instanceof Error && error.name === 'AbortError') throw new AiProviderError('timeout', 'Pollinations request timed out');
      throw new AiProviderError('network', error instanceof Error ? error.message : 'Network failure');
    } finally {
      clearTimeout(timer);
    }
  }
}
