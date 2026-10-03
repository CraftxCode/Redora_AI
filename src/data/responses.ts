import { COMPANY, integrationNames } from './redoraFacts';

/** Deterministic reply for services outside the integration catalog (never "I don't know"). */
export const unsupportedIntegrationReply = (service: string): string =>
  `That service is not currently listed among Redora's supported integrations. The available integrations currently include ${integrationNames()}.\n\n` +
  `“${service}” is not in the current integration catalog.\n\n` +
  'Next best steps:\n' +
  '- Check the Integrations section for supported services.\n' +
  '- Try Zapier, which may bridge services that offer a Zapier connector.\n' +
  '- On Pro or Business, build your own connection with the Redora API.\n' +
  `- Contact ${COMPANY.salesEmail} (DEMO) to ask about a custom integration.`;
