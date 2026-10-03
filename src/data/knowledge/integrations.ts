import { entry } from './builders';
import { COMPANY, INTEGRATIONS, integrationNames } from '../redoraFacts';

export const integrationEntries = [
  entry({
    id: 'integrations-overview', category: 'integrations', title: 'Integrations', priority: 10,
    keywords: ['integrations', 'integration', 'supported integrations', 'what apps', 'connect apps', 'third party', 'which integrations', 'what integrations'],
    answer: `Redora currently documents integrations for ${integrationNames()}.\n${INTEGRATIONS.map((i) => `- ${i.name}: ${i.summary}`).join('\n')}\n\nThe Free plan includes basic integrations (${INTEGRATIONS.filter((i) => i.freePlan).map((i) => i.name).join(', ')}); the rest start on Starter.`,
    relatedTopics: ['integrations-unsupported', 'trouble-integration-disconnected', 'support-sales'],
  }),
  ...INTEGRATIONS.map((i) =>
    entry({
      id: `integration-${i.id}`, category: 'integrations', title: `${i.name} integration`, priority: 8,
      keywords: [...i.aliases.filter((a) => a !== 'google' && a !== 'drive' && a !== 'zap'), `${i.name.toLowerCase()} integration`, `connect ${i.name.toLowerCase()}`],
      answer: `${i.summary}\n\nTo connect it: Settings → Integrations → ${i.name} → Connect, then approve access on the ${i.name} consent screen.\nAvailability: ${i.freePlan ? 'basic connection on every plan' : 'Starter plan and above'}.\n\nIf it disconnects later, reconnect from the same screen.`,
      relatedTopics: ['integrations-overview', 'trouble-integration-disconnected'],
    }),
  ),
  entry({
    id: 'integrations-unsupported', category: 'integrations', title: 'Unsupported services', priority: 6,
    keywords: ['unsupported integration', 'other integrations', 'integration missing', 'not listed integration', 'microsoft teams', 'trello', 'jira', 'asana', 'dropbox', 'outlook', 'discord'],
    answer: `That service is not currently listed among Redora's supported integrations. The available integrations currently include ${integrationNames()}.\n\nNext best steps: check Zapier (it may bridge services that offer a Zapier connector), use the Redora API on Pro or Business, or ask ${COMPANY.salesEmail} (DEMO) about a custom integration.`,
    relatedTopics: ['integration-zapier', 'feature-api', 'support-sales'],
  }),
] as const;
