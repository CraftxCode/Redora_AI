import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { CHAT_COPY } from '@/config/copy';
import { MAX_HISTORY_ITEMS, MAX_HISTORY_CONTENT, type ChatHistoryItem } from '@/domain/chat/contracts';
import { redactSensitiveData } from '@/domain/safety/sensitiveData';
import { INTEGRATIONS } from '@/data/redoraFacts';
import { knowledgeBase } from '@/data/redoraKnowledge';
import { MENU_ALL_ID } from '@/data/knowledge/menus';
import { logger } from '@/lib/logger';
import { HttpChatApi } from '@/services/chatApi';
import { ChatOrchestrator } from '../services/ChatOrchestrator';
import { StorageResponseCache } from '../services/responseCache';
import { chatReducer, initialChatState, newId, type ChatState, type UiMessage } from './chatReducer';

export interface SendOptions { entryId?: string }

interface ChatContextValue extends ChatState {
  send: (text: string, options?: SendOptions) => void;
  retry: () => void;
  browseTopics: () => void;
  contactSupport: () => void;
  reset: () => void;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const safeStorage = (): Storage | null => {
  try { return window.localStorage; } catch { return null; }
};

/** Builds API history from real turns only (no welcome, warnings or errors). */
function toHistory(messages: readonly UiMessage[]): ChatHistoryItem[] {
  return messages
    .filter((m) => m.variant === 'default' && !m.content.includes('[redacted]') && m.content.trim() !== '' && m.content !== CHAT_COPY.welcome)
    .slice(-MAX_HISTORY_ITEMS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CONTENT) }));
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, undefined, initialChatState);
  const [panelOpen, setPanelOpen] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const inFlight = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const orchestrator = useMemo(
    () => new ChatOrchestrator({ retriever: knowledgeBase, api: new HttpChatApi(), cache: new StorageResponseCache(safeStorage()), integrations: INTEGRATIONS }),
    [],
  );

  const send = useCallback((raw: string, options: SendOptions = {}) => {
    const text = raw.trim();
    if (!text || inFlight.current) return; // prevents accidental double submit
    inFlight.current = true;

    const history = toHistory(stateRef.current.messages);
    const displayText = redactSensitiveData(text);
    dispatch({ type: 'user_sent', message: { id: newId(), role: 'user', content: displayText, variant: 'default' }, turn: { text: displayText, entryId: options.entryId } });

    const controller = new AbortController();
    abortRef.current = controller;

    orchestrator
      .respond({ text, entryId: options.entryId, history }, controller.signal)
      .then((outcome) => {
        if (controller.signal.aborted) return;
        if (outcome.type === 'answer') {
          dispatch({ type: 'assistant_replied', message: { id: newId(), role: 'assistant', content: outcome.content, variant: 'default', source: outcome.source, topics: outcome.topics } });
        } else if (outcome.type === 'warning') {
          dispatch({ type: 'assistant_replied', message: { id: newId(), role: 'assistant', content: outcome.content, variant: 'warning' } });
        } else {
          logger.warn('AI request failed', outcome.error.code);
          dispatch({
            type: 'failed',
            error: { id: newId(), role: 'assistant', content: CHAT_COPY.error, variant: 'error' },
            fallback: outcome.fallback ? { id: newId(), role: 'assistant', content: outcome.fallback.content, variant: 'default', source: 'local', topics: outcome.fallback.topics } : null,
          });
        }
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, [orchestrator]);

  const retry = useCallback(() => {
    const turn = stateRef.current.lastTurn;
    if (turn) send(turn.text, { entryId: turn.entryId });
  }, [send]);

  const browseTopics = useCallback(() => send('Browse support topics', { entryId: MENU_ALL_ID }), [send]);
  const contactSupport = useCallback(() => send('Contact support', { entryId: 'support-contact' }), [send]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    inFlight.current = false;
    dispatch({ type: 'reset' });
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const value = useMemo<ChatContextValue>(
    () => ({ ...state, send, retry, browseTopics, contactSupport, reset, panelOpen, openPanel, closePanel }),
    [state, send, retry, browseTopics, contactSupport, reset, panelOpen, openPanel, closePanel],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
