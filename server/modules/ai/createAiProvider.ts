import type { ServerConfig } from '../../config/env';
import type { AiProvider } from './AiProvider';
import { PollinationsProvider } from './PollinationsProvider';

/** Provider factory — the only place that knows which concrete backend is used. */
export function createAiProvider(config: ServerConfig['ai']): AiProvider {
  return new PollinationsProvider(config);
}
