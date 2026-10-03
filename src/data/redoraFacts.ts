/**
 * Single source of truth for every FICTIONAL Redora fact.
 * The UI (plans, support cards, integrations) and the knowledge base both read from here,
 * so pricing, limits and contacts can never contradict each other.
 * All values are DEMO data — not real-world commercial information.
 */

export const COMPANY = {
  name: 'Redora',
  category: 'AI Productivity & Digital Workspace Platform',
  founded: 2026,
  headquarters: 'Lahore, Pakistan',
  website: 'https://redora-ai-demo.example',
  supportEmail: 'support@redora-ai-demo.example',
  salesEmail: 'sales@redora-ai-demo.example',
  docsUrl: 'https://redora-ai-demo.example/docs',
  statusUrl: 'https://redora-ai-demo.example/status',
  communityUrl: 'https://redora-ai-demo.example/community',
} as const;

export const DEVELOPER = {
  name: 'Muhammad Umar',
  role: 'AI Application Developer',
  project: 'Redora AI',
  purpose:
    'AI-powered customer-support application demonstrating modern frontend engineering, AI integration, API architecture and interactive UI/UX.',
  credit: 'Designed & Developed by Muhammad Umar',
} as const;

export const ANNUAL_DISCOUNT = 0.2;

export type PlanId = 'free' | 'starter' | 'pro' | 'business';

export interface Plan {
  readonly id: PlanId;
  readonly name: string;
  readonly priceMonthly: number;
  readonly blurb: string;
  readonly workspaces: string;
  readonly members: number;
  readonly storageGb: number;
  readonly aiRequests: number;
  /** Verbatim feature list for this tier. */
  readonly features: readonly string[];
  /** Business inherits Pro (assumption documented in README). */
  readonly inherits?: PlanId;
  readonly highlighted?: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'free', name: 'Free', priceMonthly: 0, blurb: 'For trying Redora on your own.',
    workspaces: '1', members: 3, storageGb: 2, aiRequests: 50,
    features: ['1 workspace', '3 team members', '2 GB storage', '50 AI requests/month', 'Basic task management', 'Basic integrations'],
  },
  {
    id: 'starter', name: 'Starter', priceMonthly: 9, blurb: 'For students and freelancers who automate.',
    workspaces: '3', members: 10, storageGb: 25, aiRequests: 500,
    features: ['3 workspaces', '10 team members', '25 GB storage', '500 AI requests/month', 'Advanced tasks', 'Automations', 'Analytics'],
  },
  {
    id: 'pro', name: 'Pro', priceMonthly: 19, blurb: 'For small teams that build on Redora.',
    workspaces: 'Unlimited', members: 25, storageGb: 100, aiRequests: 2000, highlighted: true,
    features: ['Unlimited workspaces', '25 team members', '100 GB storage', '2,000 AI requests/month', 'Advanced AI', 'Advanced automations', 'Priority support', 'Developer API'],
  },
  {
    id: 'business', name: 'Business', priceMonthly: 49, blurb: 'For organisations that need control.',
    workspaces: 'Unlimited', members: 100, storageGb: 500, aiRequests: 10000, inherits: 'pro',
    features: ['Unlimited workspaces', '100 team members', '500 GB storage', '10,000 AI requests/month', 'Advanced permissions', 'Team analytics', 'SSO', 'Audit logs', 'Priority support'],
  },
];

export const getPlan = (id: PlanId): Plan => PLANS.find((p) => p.id === id) as Plan;

export const formatUsd = (n: number): string => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const annualTotal = (plan: Plan): number => Math.round(plan.priceMonthly * 12 * (1 - ANNUAL_DISCOUNT) * 100) / 100;

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Bank Transfer'] as const;

export interface Integration {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly summary: string;
  readonly freePlan: boolean;
}

export const INTEGRATIONS: readonly Integration[] = [
  { id: 'slack', name: 'Slack', aliases: ['slack'], summary: 'Send task, automation and activity notifications to Slack channels.', freePlan: true },
  { id: 'google-drive', name: 'Google Drive', aliases: ['google drive', 'gdrive', 'drive'], summary: 'Attach Drive files to projects and tasks and trigger automations on new files.', freePlan: true },
  { id: 'github', name: 'GitHub', aliases: ['github', 'git hub'], summary: 'Link issues and pull requests to Redora tasks.', freePlan: false },
  { id: 'notion', name: 'Notion', aliases: ['notion'], summary: 'Import pages and keep documents in sync with a Redora workspace.', freePlan: false },
  { id: 'zapier', name: 'Zapier', aliases: ['zapier', 'zap'], summary: 'Bridge Redora to thousands of apps through Zapier workflows.', freePlan: false },
  { id: 'google-calendar', name: 'Google Calendar', aliases: ['google calendar', 'gcal', 'google'], summary: 'Show task due dates on your calendar and create tasks from events.', freePlan: true },
];

export const integrationNames = (): string =>
  INTEGRATIONS.map((i) => i.name).reduce((acc, n, i, a) => (i === 0 ? n : i === a.length - 1 ? `${acc} and ${n}` : `${acc}, ${n}`), '');

export interface SupportChannel {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly href: string;
  readonly blurb: string;
}

export const SUPPORT_CHANNELS: readonly SupportChannel[] = [
  { id: 'general', title: 'General support', value: COMPANY.supportEmail, href: `mailto:${COMPANY.supportEmail}`, blurb: 'Accounts, billing, troubleshooting.' },
  { id: 'sales', title: 'Sales', value: COMPANY.salesEmail, href: `mailto:${COMPANY.salesEmail}`, blurb: 'Plans, teams and custom integrations.' },
  { id: 'docs', title: 'Documentation', value: COMPANY.docsUrl, href: COMPANY.docsUrl, blurb: 'Guides and API reference.' },
  { id: 'status', title: 'Status', value: COMPANY.statusUrl, href: COMPANY.statusUrl, blurb: 'Live service health.' },
  { id: 'community', title: 'Community', value: COMPANY.communityUrl, href: COMPANY.communityUrl, blurb: 'Ask other Redora users.' },
];

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly features: readonly string[];
}

export const PRODUCTS: readonly Product[] = [
  { id: 'workspace', name: 'Redora Workspace', summary: 'A collaborative cloud workspace for files, projects, documents and teams.', features: ['Projects', 'Tasks', 'Documents', 'Team members', 'Activity history', 'Workspace permissions', 'Search', 'Notifications'] },
  { id: 'assist', name: 'Redora Assist', summary: 'The built-in AI assistant for writing, summarising and planning.', features: ['Writing', 'Summarization', 'Brainstorming', 'Research assistance', 'Document analysis', 'Task planning', 'Productivity guidance'] },
  { id: 'automate', name: 'Redora Automate', summary: 'No-code workflow automation. Pick a trigger, chain the actions.', features: ['New document uploaded', 'Summarize document', 'Create task', 'Notify team'] },
  { id: 'analytics', name: 'Redora Analytics', summary: 'A dashboard for how work is actually moving.', features: ['Project statistics', 'Task completion', 'Team activity', 'Workspace usage', 'Automation activity'] },
  { id: 'api', name: 'Redora API', summary: 'A developer API for connecting Redora to your own applications.', features: ['Authentication', 'Workspace data', 'Projects', 'Tasks', 'Documents', 'Automation triggers', 'Activity events'] },
];
