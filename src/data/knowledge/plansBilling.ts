import { entry, steps } from './builders';
import {
  ANNUAL_DISCOUNT, COMPANY, PAYMENT_METHODS, PLANS, annualTotal, formatUsd, getPlan, type Plan,
} from '../redoraFacts';

const planLine = (p: Plan) => `- ${p.name}: ${p.priceMonthly === 0 ? '$0' : `${formatUsd(p.priceMonthly)}/month`} — ${p.workspaces} workspace${p.workspaces === '1' ? '' : 's'}, ${p.members} members, ${p.storageGb} GB, ${p.aiRequests.toLocaleString('en-US')} AI requests/month`;

const planDetail = (p: Plan): string =>
  [
    `${p.name} costs ${p.priceMonthly === 0 ? '$0/month' : `${formatUsd(p.priceMonthly)}/month`} (fictional demo price).`,
    p.inherits ? `It includes everything in ${getPlan(p.inherits).name}, plus:` : 'It includes:',
    ...p.features.map((f) => `- ${f}`),
    ...(p.priceMonthly > 0 ? ['', `Annual billing is ${ANNUAL_DISCOUNT * 100}% cheaper: ${formatUsd(annualTotal(p))}/year.`] : []),
  ].join('\n');

const planEntry = (p: Plan, keywords: string[]) =>
  entry({
    id: `plan-${p.id}`, category: 'plans', title: `${p.name} plan`, priority: 9, keywords,
    answer: planDetail(p),
    relatedTopics: ['plans-compare', 'plans-upgrade', 'plans-annual'],
  });

export const plansBillingEntries = [
  entry({
    id: 'plans-overview', category: 'pricing', title: 'Plans & pricing', priority: 10,
    keywords: ['plans', 'pricing', 'price', 'prices', 'how much', 'cost', 'what plans do you offer', 'plans and pricing', 'subscription plans', 'subscription', 'tiers'],
    answer: `Redora has four fictional demo plans:\n${PLANS.map(planLine).join('\n')}\n\nAnnual billing saves ${ANNUAL_DISCOUNT * 100}%. Want details on one plan, or help choosing?`,
    relatedTopics: ['plan-free', 'plan-starter', 'plan-pro', 'plan-business', 'plans-compare'],
  }),
  planEntry(getPlan('free'), ['free plan', 'what is free', 'free tier', 'is redora free', 'free version']),
  planEntry(getPlan('starter'), ['starter plan', 'what is starter', 'starter tier', 'redora starter']),
  planEntry(getPlan('pro'), ['pro plan', 'what is pro', 'pro tier', 'redora pro']),
  planEntry(getPlan('business'), ['business plan', 'what is business', 'business tier', 'redora business', 'enterprise']),
  entry({
    id: 'plans-compare', category: 'plans', title: 'Compare plans', priority: 8,
    keywords: ['compare plans', 'difference between plans', 'which plan', 'which plan should i choose', 'plan comparison', 'best plan', 'pro vs starter', 'starter vs pro', 'upgrade to pro'],
    answer: `Quick guide:\n- Free: trying Redora solo (1 workspace, 3 members, 50 AI requests).\n- Starter: students and freelancers who want automations and analytics.\n- Pro: small teams that need advanced AI, priority support and the developer API.\n- Business: larger teams that need SSO, audit logs and advanced permissions.\n\nTell me your team size and what you plan to automate and I can suggest one.`,
    relatedTopics: ['plans-overview', 'plans-upgrade'],
  }),
  entry({
    id: 'plans-upgrade', category: 'plans', title: 'Upgrade or downgrade', priority: 7,
    keywords: ['upgrade', 'downgrade', 'change plan', 'switch plan', 'upgrade plan', 'change my plan'],
    answer: steps('You can switch plans at any time from Billing.', [
      'Go to Settings → Billing → Plan.',
      'Choose the new plan and billing cycle.',
      'Confirm. Upgrades apply immediately; downgrades apply at the next renewal.',
    ], 'Important: a downgrade only works if your workspace fits the new plan’s limits (members, storage).'),
    relatedTopics: ['plans-compare', 'billing-cycle', 'trouble-subscription-not-activated'],
  }),
  entry({
    id: 'plans-annual', category: 'pricing', title: 'Annual discount', priority: 8,
    keywords: ['annual', 'yearly', 'annual discount', 'annual plan', 'discount', 'save money', 'pay yearly'],
    answer: `Annual billing gives a ${ANNUAL_DISCOUNT * 100}% fictional discount.\n${PLANS.filter((p) => p.priceMonthly > 0).map((p) => `- ${p.name}: ${formatUsd(annualTotal(p))}/year instead of ${formatUsd(p.priceMonthly * 12)}`).join('\n')}`,
    relatedTopics: ['billing-cycle', 'plans-overview'],
  }),
  entry({
    id: 'plans-ai-limits', category: 'plans', title: 'AI request limits', priority: 7,
    keywords: ['ai requests', 'ai limit', 'out of ai requests', 'request limit', 'monthly ai', 'ai quota', 'ai credits'],
    answer: `Monthly AI requests by plan: ${PLANS.map((p) => `${p.name} ${p.aiRequests.toLocaleString('en-US')}`).join(', ')}.\n\nThe counter resets each billing period. If you run out, Redora Assist pauses until the reset or until you upgrade.`,
    relatedTopics: ['plans-upgrade', 'trouble-ai-response-failed', 'feature-assist'],
  }),
  entry({
    id: 'billing-payment-methods', category: 'billing', title: 'Payment methods', priority: 10,
    keywords: ['payment methods', 'payment method', 'how can i pay', 'accept paypal', 'visa', 'mastercard', 'paypal', 'bank transfer', 'pay with'],
    answer: `Redora supports ${PAYMENT_METHODS.join(', ')} (fictional demo payment methods).\n\nImportant: never share card numbers or CVV codes in chat. Enter them only on the secure billing page.`,
    relatedTopics: ['billing-cycle', 'trouble-billing-failed'],
  }),
  entry({
    id: 'billing-cycle', category: 'billing', title: 'Billing cycle & renewal', priority: 8,
    keywords: ['billing cycle', 'renew', 'renewal', 'auto renew', 'monthly or annual', 'when am i charged', 'next payment'],
    answer: `You can be billed monthly or annually (annual saves ${ANNUAL_DISCOUNT * 100}%). Subscriptions renew automatically at the end of each period.\n\nYou can cancel future renewal at any time; your current billing period stays active until it ends.`,
    relatedTopics: ['billing-cancel', 'plans-annual', 'billing-refund-policy'],
  }),
  entry({
    id: 'billing-cancel', category: 'billing', title: 'Cancel a subscription', priority: 9,
    keywords: ['cancel', 'cancel subscription', 'stop subscription', 'cancel plan', 'stop renewal', 'unsubscribe'],
    answer: steps('You can cancel future renewal from Billing.', [
      'Go to Settings → Billing → Subscription.',
      'Select “Cancel renewal” and confirm.',
    ], 'Your current billing period stays active until its end date, then the workspace moves to the Free plan. Refunds follow the refund policy.'),
    relatedTopics: ['billing-refund-policy', 'account-delete'],
  }),
  entry({
    id: 'billing-refund-policy', category: 'billing', title: 'Refund policy', priority: 9,
    keywords: ['refund', 'refund policy', 'money back', 'get a refund', 'refunds'],
    answer: 'Refund policy (fictional demo):\n- You can request a refund within 14 days of your first paid subscription purchase.\n- Renewal payments are normally non-refundable unless a billing error occurred.\n- Refund requests are reviewed by support.\n\nImportant: never include passwords or authentication codes in a refund request.',
    relatedTopics: ['billing-refund-request', 'billing-cancel', 'trouble-payment-duplicated'],
  }),
  entry({
    id: 'billing-refund-request', category: 'billing', title: 'Request a refund', priority: 9,
    keywords: ['request refund', 'request a refund', 'how to get refund', 'refund request', 'ask for refund'],
    answer: `To request a refund, email ${COMPANY.supportEmail} (DEMO address) with:\n- your account email\n- the plan name\n- the payment date\n- the reason for the request\n\nImportant: never send passwords, one-time codes or card security codes.`,
    relatedTopics: ['billing-refund-policy', 'support-contact'],
  }),
  entry({
    id: 'billing-invoices', category: 'billing', title: 'Invoices & receipts', priority: 5,
    keywords: ['invoice', 'invoices', 'receipt', 'receipts', 'billing history', 'download invoice'],
    answer: steps('Invoices are available in Billing.', [
      'Go to Settings → Billing → History.',
      'Select a payment and choose “Download receipt”.',
    ], `Need a billing address changed on an invoice? Contact ${COMPANY.supportEmail} (DEMO).`),
    relatedTopics: ['billing-payment-methods', 'support-contact'],
  }),
] as const;
