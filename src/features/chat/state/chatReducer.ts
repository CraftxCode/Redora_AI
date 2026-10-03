import { CHAT_COPY } from '@/config/copy';
import type { TopicRef } from '@/domain/chat/contracts';
import type { AnswerSource } from '../services/ChatOrchestrator';

export type MessageVariant = 'default' | 'warning' | 'error';

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  variant: MessageVariant;
  source?: AnswerSource;
  topics?: TopicRef[];
}

export interface ChatState {
  messages: UiMessage[];
  status: 'idle' | 'thinking';
  /** Id of the error message whose recovery actions are still active. */
  activeErrorId: string | null;
  /** What "Try Again" should resend. */
  lastTurn: { text: string; entryId?: string } | null;
}

export type ChatAction =
  | { type: 'user_sent'; message: UiMessage; turn: { text: string; entryId?: string } }
  | { type: 'assistant_replied'; message: UiMessage }
  | { type: 'failed'; error: UiMessage; fallback: UiMessage | null }
  | { type: 'reset' };

let counter = 0;
export const newId = (): string => `m${Date.now().toString(36)}${(counter += 1)}`;

export const welcomeMessage = (): UiMessage => ({ id: newId(), role: 'assistant', content: CHAT_COPY.welcome, variant: 'default', source: 'local' });

export const initialChatState = (): ChatState => ({ messages: [welcomeMessage()], status: 'idle', activeErrorId: null, lastTurn: null });

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'user_sent':
      return { ...state, messages: [...state.messages, action.message], status: 'thinking', activeErrorId: null, lastTurn: action.turn };
    case 'assistant_replied':
      return { ...state, messages: [...state.messages, action.message], status: 'idle' };
    case 'failed':
      return {
        ...state,
        messages: [...state.messages, action.error, ...(action.fallback ? [action.fallback] : [])],
        status: 'idle',
        activeErrorId: action.error.id,
      };
    case 'reset':
      return initialChatState();
  }
}
