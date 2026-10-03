import { entry } from './builders';
import { COMPANY, DEVELOPER, PRODUCTS } from '../redoraFacts';

export const generalEntries = [
  entry({
    id: 'general-what-is-redora', category: 'general', title: 'What is Redora?', priority: 10,
    keywords: ['what is redora', 'about redora', 'tell me about redora', 'what does redora do', 'redora overview', 'what is this platform'],
    answer: `Redora is an all-in-one ${COMPANY.category.toLowerCase()} for individuals, students, freelancers, teams, startups and businesses.\n\nIt brings together:\n${PRODUCTS.map((p) => `- ${p.name}: ${p.summary}`).join('\n')}\n\nImportant: Redora is a fictional product used for a portfolio demo.`,
    relatedTopics: ['plans-overview', 'general-products', 'general-demo-disclaimer'],
  }),
  entry({
    id: 'general-products', category: 'general', title: 'Redora products', priority: 8,
    keywords: ['products', 'modules', 'what products', 'redora products', 'services do you offer', 'what can redora do'],
    answer: `Redora has five products:\n${PRODUCTS.map((p) => `- ${p.name}: ${p.summary}`).join('\n')}\n\nPick one and I can go deeper.`,
    relatedTopics: ['feature-workspace', 'feature-assist', 'feature-automate', 'feature-analytics', 'feature-api'],
  }),
  entry({
    id: 'general-company', category: 'general', title: 'About the company', priority: 6,
    keywords: ['company', 'headquarters', 'where are you based', 'founded', 'when was redora founded', 'where is redora located'],
    answer: `Redora was founded in ${COMPANY.founded} and is headquartered in ${COMPANY.headquarters} (fictional demo company).\n\nWebsite: ${COMPANY.website} (DEMO link)`,
    relatedTopics: ['general-what-is-redora', 'support-contact'],
  }),
  entry({
    id: 'general-who-are-you', category: 'general', title: 'Who is Redora AI?', priority: 10,
    keywords: ['who are you', 'what are you', 'your name', 'are you a bot', 'are you human', 'are you ai', 'introduce yourself'],
    answer: `I’m Redora AI, the intelligent customer-support assistant for the Redora platform. I can help with Redora accounts, plans, billing, features, integrations, security, troubleshooting and general product guidance.\n\nI was developed by ${DEVELOPER.name} as a modern AI application engineering project.`,
    relatedTopics: ['general-what-is-redora', 'general-developer'],
  }),
  entry({
    id: 'general-developer', category: 'general', title: 'Who built Redora AI?', priority: 9,
    keywords: ['who developed', 'who created', 'who built', 'who made', 'developer', 'creator', 'muhammad umar', 'about this project', 'portfolio'],
    answer: `Redora AI was created by ${DEVELOPER.name}, an ${DEVELOPER.role}.\n\nPurpose: ${DEVELOPER.purpose}\n\nThe stack is React, TypeScript, Tailwind, GSAP, Node.js, Express and Pollinations AI.`,
    relatedTopics: ['general-who-are-you', 'general-demo-disclaimer'],
  }),
  entry({
    id: 'general-demo-disclaimer', category: 'general', title: 'Is Redora real?', priority: 8,
    keywords: ['is redora real', 'is this real', 'fictional', 'is this a demo', 'real company', 'real prices', 'real product'],
    answer: `Redora is a fictional product built for portfolio and educational purposes. All prices, policies, limits, emails and URLs are DEMO data and are not real-world commercial information.\n\nThe assistant itself is real: it answers from a local knowledge base and uses an AI model for natural-language questions.`,
    relatedTopics: ['general-developer', 'general-what-is-redora'],
  }),
  entry({
    id: 'general-languages', category: 'general', title: 'Languages', priority: 4,
    keywords: ['language', 'languages', 'multilingual', 'translate', 'urdu', 'spanish', 'arabic'],
    answer: 'Redora AI is multilingual-ready: you can ask questions in other languages and the AI assistant will try to reply in the same language. Instant local answers are currently written in English.\n\nIf a reply is unclear, ask again in English or contact support.',
    relatedTopics: ['support-contact'],
  }),
] as const;
