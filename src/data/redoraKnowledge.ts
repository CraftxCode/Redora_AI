/**
 * Redora's local knowledge base (ADR-002/003). Pure data, grouped by domain in ./knowledge.
 * `knowledgeBase` is consumed by the client (instant answers) and the server (AI context).
 */
import type { KnowledgeEntry } from '../domain/knowledge/types';
import { KnowledgeRetriever } from '../domain/knowledge/retriever';
import { generalEntries } from './knowledge/general';
import { accountEntries } from './knowledge/account';
import { plansBillingEntries } from './knowledge/plansBilling';
import { featuresApiEntries } from './knowledge/featuresApi';
import { securitySupportEntries } from './knowledge/securitySupport';
import { integrationEntries } from './knowledge/integrations';
import { troubleshootingEntries } from './knowledge/troubleshooting';
import { menuEntries } from './knowledge/menus';

export const redoraKnowledge: readonly KnowledgeEntry[] = [
  ...menuEntries,
  ...generalEntries,
  ...accountEntries,
  ...plansBillingEntries,
  ...featuresApiEntries,
  ...securitySupportEntries,
  ...integrationEntries,
  ...troubleshootingEntries,
];

export const knowledgeBase = new KnowledgeRetriever(redoraKnowledge);

export { QUICK_ACTIONS } from './knowledge/menus';
