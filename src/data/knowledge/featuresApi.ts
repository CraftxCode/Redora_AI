import { entry, steps } from './builders';
import { PRODUCTS } from '../redoraFacts';

const bullets = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n');
const product = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const featuresApiEntries = [
  entry({
    id: 'features-overview', category: 'features', title: 'Features overview', priority: 7,
    keywords: ['features', 'what features', 'feature list', 'capabilities', 'what can i do'],
    answer: `Redora is built around five products: Workspace, Assist, Automate, Analytics and API. Plus storage, notifications, search and integrations.\n\nWhich one would you like to explore?`,
    relatedTopics: ['feature-workspace', 'feature-assist', 'feature-automate', 'feature-analytics', 'feature-api'],
  }),
  entry({
    id: 'feature-workspace', category: 'features', title: 'Redora Workspace', priority: 8,
    keywords: ['workspace', 'workspaces', 'redora workspace', 'projects', 'tasks', 'task management', 'documents', 'file storage', 'storage'],
    answer: `${product('workspace').summary}\n\nIncludes:\n${bullets(product('workspace').features)}\n\nWorkspace limits depend on your plan (Free 1, Starter 3, Pro and Business unlimited).`,
    relatedTopics: ['plans-compare', 'team-invite-members', 'trouble-storage-limit'],
  }),
  entry({
    id: 'feature-assist', category: 'features', title: 'Redora Assist (AI)', priority: 8,
    keywords: ['assist', 'redora assist', 'ai assistant', 'summarize', 'summarization', 'writing help', 'brainstorm', 'ai features'],
    answer: `${product('assist').summary}\n\nIt can help with:\n${bullets(product('assist').features)}\n\nUsage is counted in AI requests per month, which depends on your plan.`,
    relatedTopics: ['plans-ai-limits', 'trouble-ai-response-failed', 'feature-automate'],
  }),
  entry({
    id: 'feature-automate', category: 'features', title: 'Redora Automate', priority: 8,
    keywords: ['automate', 'automation', 'automations', 'workflow', 'workflows', 'no code automation', 'redora automate'],
    answer: `${product('automate').summary}\n\nExample automation:\n- Trigger: New document uploaded\n- Action: Summarize document\n- Action: Create task\n- Action: Notify team\n\nAutomations are available on Starter and above; Pro adds advanced automations.`,
    relatedTopics: ['trouble-automation-failed', 'plan-starter', 'plan-pro'],
  }),
  entry({
    id: 'feature-analytics', category: 'features', title: 'Redora Analytics', priority: 8,
    keywords: ['analytics', 'dashboard', 'reports', 'statistics', 'metrics', 'redora analytics'],
    answer: `${product('analytics').summary}\n\nThe dashboard shows:\n${bullets(product('analytics').features)}\n\nAnalytics starts on Starter; Business adds team analytics.`,
    relatedTopics: ['trouble-slow-dashboard', 'plan-business'],
  }),
  entry({
    id: 'feature-api', category: 'api', title: 'Redora API', priority: 8,
    keywords: ['api', 'redora api', 'developer api', 'rest api', 'developers', 'developer tools', 'sdk', 'webhook'],
    answer: `${product('api').summary}\n\nIt covers:\n${bullets(product('api').features)}\n\nThe developer API is included from the Pro plan upward.`,
    relatedTopics: ['api-authentication', 'trouble-api-auth-failed', 'plan-pro'],
  }),
  entry({
    id: 'api-authentication', category: 'api', title: 'API authentication', priority: 8,
    keywords: ['api key', 'api keys', 'api authentication', 'authenticate api', 'api token', 'create api key', 'bearer token'],
    answer: steps('API requests are authenticated with an API key sent as a bearer token.', [
      'Go to Settings → Developer → API keys (Pro and Business).',
      'Create a key and copy it once — it is shown only at creation.',
      'Send it in the Authorization header: Bearer <your key>.',
      'Store it in an environment variable on your server, never in front-end code.',
    ], 'Important: never paste API secrets in chat. If one leaks, revoke it and create a new key.'),
    relatedTopics: ['trouble-api-auth-failed', 'security-credentials', 'feature-api'],
  }),
] as const;
