import { entry } from './builders';
import type { KnowledgeCategory } from '../../domain/knowledge/types';

interface Menu { key: string; label: string; category: KnowledgeCategory; intro: string; topics: readonly string[]; }

export const MENUS: readonly Menu[] = [
  { key: 'account', label: 'Account Help', category: 'account', intro: 'I can help with sign-in, passwords, email, 2FA, teams and workspace roles.', topics: ['account-create', 'account-sign-in', 'account-reset-password', 'account-change-email', 'account-enable-2fa', 'team-invite-members', 'team-change-role', 'team-leave-workspace'] },
  { key: 'plans', label: 'Plans & Pricing', category: 'pricing', intro: 'Redora has Free, Starter, Pro and Business plans. Pick one to see what is included.', topics: ['plans-overview', 'plan-free', 'plan-starter', 'plan-pro', 'plan-business', 'plans-compare', 'plans-annual'] },
  { key: 'billing', label: 'Billing', category: 'billing', intro: 'Payments, renewals, cancellations and refunds.', topics: ['billing-payment-methods', 'billing-cycle', 'billing-cancel', 'billing-refund-policy', 'billing-refund-request', 'trouble-billing-failed'] },
  { key: 'features', label: 'Features', category: 'features', intro: 'Redora is five products working together.', topics: ['feature-workspace', 'feature-assist', 'feature-automate', 'feature-analytics', 'feature-api'] },
  { key: 'security', label: 'Security', category: 'security', intro: 'How Redora protects your account and what to do if something looks wrong.', topics: ['security-overview', 'account-enable-2fa', 'security-sessions', 'security-compromised', 'security-audit-logs'] },
  { key: 'integrations', label: 'Integrations', category: 'integrations', intro: 'Connect Redora to the tools you already use.', topics: ['integrations-overview', 'integration-slack', 'integration-google-drive', 'integration-github', 'integration-notion', 'integration-zapier', 'integration-google-calendar'] },
  { key: 'troubleshooting', label: 'Troubleshooting', category: 'troubleshooting', intro: 'Something not working? Choose the closest problem.', topics: ['trouble-login-failed', 'trouble-verification-email', 'trouble-file-upload-failed', 'trouble-integration-disconnected', 'trouble-automation-failed', 'trouble-billing-failed', 'trouble-api-auth-failed', 'trouble-slow-dashboard'] },
  { key: 'support', label: 'Contact Support', category: 'support', intro: 'Reach a human through the demo support channels.', topics: ['support-contact', 'support-sales', 'support-status'] },
];

export const MENU_ALL_ID = 'menu-all';

export const menuEntries = [
  entry({
    id: MENU_ALL_ID, category: 'general', title: 'Support topics', priority: 10,
    keywords: ['browse support topics', 'support topics', 'help topics', 'what can you help with', 'how can you help', 'i need help', 'main menu'],
    answer: 'I can help with Redora accounts, plans, billing, features, integrations, security and troubleshooting. Choose an area below, or type your question in your own words.',
    relatedTopics: MENUS.map((m) => `menu-${m.key}`),
  }),
  ...MENUS.map((m) =>
    entry({
      id: `menu-${m.key}`, category: m.category, title: m.label, priority: 10,
      keywords: [`${m.key} help`, `${m.key} topics`, `browse ${m.key}`],
      answer: `${m.intro}\n\nChoose a topic below, or just type your question.`,
      relatedTopics: m.topics,
    }),
  ),
];

export const QUICK_ACTIONS = MENUS.map((m) => ({ label: m.label, entryId: `menu-${m.key}` }));
