import type { ChatHistoryItem } from '../../../src/domain/chat/contracts';
import type { KnowledgeEntry } from '../../../src/domain/knowledge/types';
import { COMPANY, PLANS, formatUsd, integrationNames } from '../../../src/data/redoraFacts';
import type { AiMessage } from '../ai/AiProvider';

const MAX_ENTRY_CHARS = 900;
const MAX_CONTEXT_CHARS = 3200;
const HISTORY_TURNS = 4;

const coreFacts = (): string =>
  [
    `Plans (fictional demo prices): ${PLANS.map((p) => `${p.name} ${p.priceMonthly === 0 ? '$0' : formatUsd(p.priceMonthly)}/month`).join(', ')}. Annual billing is 20% cheaper.`,
    `Integrations: ${integrationNames()}.`,
    `Support: ${COMPANY.supportEmail} · Sales: ${COMPANY.salesEmail} · Docs: ${COMPANY.docsUrl} (all DEMO).`,
  ].join('\n');

export const buildSystemPrompt = (): string =>
  [
    'You are Redora AI, the customer-support assistant for REDORA, a FICTIONAL AI productivity & digital workspace platform created as a portfolio demo by Muhammad Umar.',
    '',
    'RULES',
    '- Answer from the KNOWLEDGE below. Stay consistent with it; never invent prices, limits, features, policies or integrations.',
    '- All prices, policies, emails and URLs are fictional demo data. Never present them as real-world commercial information.',
    '- NEVER say "I don\'t know", "I have no idea" or similar. When the exact answer is missing: (1) say what is known, (2) give the closest useful guidance, (3) state the limitation plainly (for example "that is not listed in the current documentation"), (4) give the next best action such as the docs or the support email.',
    '- If asked about a service that is not an integration, say it is not currently listed and name the available integrations.',
    '- NEVER ask for passwords, one-time codes, recovery codes, API secrets or card security codes. If the user shares any, tell them not to.',
    '- If the account may be compromised: change password, enable 2FA, review active sessions, contact support.',
    '- Mention the developer (Muhammad Umar) only if the user asks who made this.',
    '',
    'STYLE',
    '- Plain text only. No markdown headings, no tables. Start with the direct answer.',
    '- Use "Steps:" with numbered lines for procedures and one "Important:" line only when it matters.',
    '- Be concise: at most 250 words. Warm, clear, professional.',
    '',
    'CORE FACTS',
    coreFacts(),
  ].join('\n');

export function buildContext(entries: readonly KnowledgeEntry[]): string {
  let used = 0;
  const blocks: string[] = [];
  for (const e of entries) {
    const body = e.answer.length > MAX_ENTRY_CHARS ? `${e.answer.slice(0, MAX_ENTRY_CHARS)}…` : e.answer;
    const block = `[${e.title}]\n${body}`;
    if (used + block.length > MAX_CONTEXT_CHARS) break;
    blocks.push(block);
    used += block.length;
  }
  return blocks.length ? blocks.join('\n\n') : 'No specific article matched. Use the core facts and point to documentation or support.';
}

export function buildMessages(message: string, history: readonly ChatHistoryItem[], entries: readonly KnowledgeEntry[]): AiMessage[] {
  return [
    { role: 'system', content: `${buildSystemPrompt()}\n\nKNOWLEDGE\n${buildContext(entries)}` },
    ...history.slice(-HISTORY_TURNS).map((h): AiMessage => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];
}
