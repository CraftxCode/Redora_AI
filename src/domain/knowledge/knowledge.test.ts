import { describe, expect, it } from 'vitest';
import { redoraKnowledge, knowledgeBase } from '../../data/redoraKnowledge';
import { INTEGRATIONS, PLANS } from '../../data/redoraFacts';
import { decideRoute, isStandalone } from '../chat/router';
import { findUnsupportedIntegration } from './integrationCheck';

const top = (q: string) => knowledgeBase.retrieve(q);
const route = (q: string) => decideRoute(q, top(q));

describe('knowledge base integrity', () => {
  it('has unique ids and every related topic resolves', () => {
    const ids = new Set<string>();
    for (const e of redoraKnowledge) {
      expect(ids.has(e.id), `duplicate id ${e.id}`).toBe(false);
      ids.add(e.id);
    }
    for (const e of redoraKnowledge) {
      for (const r of e.relatedTopics) expect(ids.has(r), `${e.id} → ${r}`).toBe(true);
    }
  });

  it('covers every required category', () => {
    const cats = new Set(redoraKnowledge.map((e) => e.category));
    for (const c of ['general', 'account', 'billing', 'pricing', 'features', 'security', 'integrations', 'troubleshooting', 'api', 'support', 'plans']) {
      expect(cats.has(c as never), c).toBe(true);
    }
  });

  it('keeps plan prices consistent with the plan facts', () => {
    const entry = knowledgeBase.getById('plans-overview')!;
    for (const p of PLANS.filter((x) => x.priceMonthly > 0)) expect(entry.answer).toContain(`$${p.priceMonthly}/month`);
  });

  it('gives every troubleshooting entry the four-part structure', () => {
    for (const e of redoraKnowledge.filter((x) => x.id.startsWith('trouble-'))) {
      for (const label of ['Possible cause:', 'Immediate solution:', 'Alternative solution:', 'Escalation path:']) {
        expect(e.answer, `${e.id} ${label}`).toContain(label);
      }
    }
  });

  it('never contains the forbidden phrases', () => {
    for (const e of redoraKnowledge) expect(e.answer).not.toMatch(/i don'?t know|i have no idea/i);
  });
});

describe('retrieval + routing', () => {
  const cases: Array<[string, string]> = [
    ['What is Redora?', 'general-what-is-redora'],
    ['What plans do you offer?', 'plans-overview'],
    ['How do I reset my password?', 'account-reset-password'],
    ['What payment methods are supported?', 'billing-payment-methods'],
    ['How do I contact support?', 'support-contact'],
    ['Who are you?', 'general-who-are-you'],
    ['Who developed this?', 'general-developer'],
    ['What is Pro?', 'plan-pro'],
    ['payment failed', 'trouble-billing-failed'],
    ['I think my account was hacked', 'security-compromised'],
    ['How do I enable 2FA', 'account-enable-2fa'],
  ];
  it.each(cases)('answers %s locally from %s', (q, id) => {
    expect(top(q).hits[0]?.entry.id).toBe(id);
    expect(route(q)).toBe('local');
  });

  it('sends conversational/comparison questions to the AI', () => {
    expect(route('Which plan should I choose for a team of 8 and why?')).toBe('ai');
    expect(route('Explain how automations use my AI requests')).toBe('ai');
  });

  it('reports low confidence for unrelated text', () => {
    expect(top('banana smoothie recipe').confidence).toBe('low');
  });

  it('only caches standalone messages', () => {
    expect(isStandalone('How much storage does the Pro plan include?')).toBe(true);
    expect(isStandalone('what about those again')).toBe(false);
  });
});

describe('unsupported integration detection', () => {
  const find = (q: string) => findUnsupportedIntegration(q, INTEGRATIONS);
  it('flags unknown services', () => {
    expect(find('Can I connect Redora to an imaginary service called XYZ?')).toBe('XYZ');
    expect(find('Can I integrate Redora with Microsoft Teams?')).toBe('Microsoft Teams');
  });
  it('accepts documented services and non-service nouns', () => {
    expect(find('Can I connect Redora to Slack?')).toBeNull();
    expect(find('connect with Google Drive and Notion')).toBeNull();
    expect(find('How do I connect to my account?')).toBeNull();
    expect(find('How do I reset my password?')).toBeNull();
  });
});
