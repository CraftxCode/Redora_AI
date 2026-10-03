import { entry } from './builders';
import { COMPANY, SUPPORT_CHANNELS, formatUsd, getPlan } from '../redoraFacts';

export const securitySupportEntries = [
  entry({
    id: 'security-overview', category: 'security', title: 'Security overview', priority: 10,
    keywords: ['security', 'is redora secure', 'how secure', 'encryption', 'https', 'safe', 'data protection', 'privacy'],
    answer: 'Redora security (fictional demo summary):\n- Encrypted HTTPS connections\n- Encrypted stored credentials\n- Role-based access\n- Two-factor authentication\n- Session management\n- Login alerts\n- Audit logs on the Business plan\n\nImportant: Redora support will never ask for your password, one-time codes or recovery codes.',
    relatedTopics: ['account-enable-2fa', 'security-sessions', 'security-audit-logs', 'security-compromised'],
  }),
  entry({
    id: 'security-compromised', category: 'security', title: 'My account may be compromised', priority: 10,
    keywords: ['hacked', 'compromised', 'someone logged in', 'unauthorized', 'suspicious activity', 'account stolen', 'account was hacked', 'not me', 'unknown login'],
    answer: `If you think your account is compromised, act now:\n\nSteps:\n1. Change your password immediately (Settings → Security).\n2. Enable two-factor authentication.\n3. Review active sessions and sign out of any you don’t recognise.\n4. Contact support at ${COMPANY.supportEmail} (DEMO address).\n\nImportant: never share your password or codes with anyone, including in this chat.`,
    relatedTopics: ['account-change-password', 'account-enable-2fa', 'security-sessions', 'support-contact'],
  }),
  entry({
    id: 'security-sessions', category: 'security', title: 'Sessions & login alerts', priority: 7,
    keywords: ['sessions', 'active sessions', 'sign out everywhere', 'devices', 'login alerts', 'logged in devices', 'session management'],
    answer: 'You can review and end sessions at Settings → Security → Sessions. Each entry shows device, location and last activity. Select “Sign out” on any session you do not recognise, or “Sign out everywhere”.\n\nLogin alerts email you when a new device signs in.',
    relatedTopics: ['security-compromised', 'account-enable-2fa'],
  }),
  entry({
    id: 'security-credentials', category: 'security', title: 'Never share credentials', priority: 9,
    keywords: ['share password', 'send my password', 'give you my password', 'send otp', 'share otp', 'share code', 'can i send', 'do you need my password'],
    answer: 'No. Never share passwords, one-time passwords, recovery codes, API secrets or card security codes with anyone, including this assistant and Redora support. Redora will never ask for them.\n\nIf you need account help, describe what is happening without including secrets.',
    relatedTopics: ['security-overview', 'support-contact'],
  }),
  entry({
    id: 'security-audit-logs', category: 'security', title: 'Audit logs & SSO', priority: 7,
    keywords: ['audit log', 'audit logs', 'sso', 'single sign on', 'saml', 'enterprise security', 'advanced permissions'],
    answer: `Audit logs, SSO and advanced permissions are included in the Business plan (${formatUsd(getPlan('business').priceMonthly)}/month, fictional demo price). Audit logs record sign-ins, permission changes and workspace actions.\n\nQuestions about SSO setup? Contact sales or support.`,
    relatedTopics: ['plan-business', 'support-sales'],
  }),
  entry({
    id: 'support-contact', category: 'support', title: 'Contact support', priority: 10,
    keywords: ['contact support', 'contact', 'support', 'talk to a human', 'human agent', 'email support', 'customer service', 'help desk', 'speak to someone', 'support email'],
    answer: `You can reach Redora through these demo channels:\n${SUPPORT_CHANNELS.map((c) => `- ${c.title}: ${c.value} (DEMO)`).join('\n')}\n\nFor account issues, email ${COMPANY.supportEmail} with your account email and a short description. Pro and Business plans get priority support.`,
    relatedTopics: ['support-sales', 'support-status', 'billing-refund-request'],
  }),
  entry({
    id: 'support-sales', category: 'support', title: 'Sales & custom integrations', priority: 8,
    keywords: ['sales', 'talk to sales', 'custom integration', 'enterprise quote', 'bulk', 'volume', 'quote'],
    answer: `For sales, team sizing or custom integration requests, email ${COMPANY.salesEmail} (DEMO address).`,
    relatedTopics: ['support-contact', 'integrations-overview'],
  }),
  entry({
    id: 'support-status', category: 'support', title: 'Status, docs & community', priority: 7,
    keywords: ['status page', 'is redora down', 'outage', 'service status', 'documentation', 'docs', 'community', 'forum'],
    answer: `Helpful demo links:\n- Status: ${COMPANY.statusUrl}\n- Documentation: ${COMPANY.docsUrl}\n- Community: ${COMPANY.communityUrl}\n\nIf the status page shows no incident, contact support with details.`,
    relatedTopics: ['support-contact'],
  }),
] as const;
