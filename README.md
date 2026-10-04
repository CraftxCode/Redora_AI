# Redora AI — *Support that actually understands.*

A premium, cinematic AI customer-support web app for **Redora**, a **fictional** digital-workspace platform.
Portfolio / educational project — **Designed & Developed by Muhammad Umar**.

> Redora is not a real company. Every plan, price, policy, email and URL is DEMO data.

## Quick start

```bash
npm install
cp .env.example .env     # optional — the app runs without a key
npm run dev              # web: http://localhost:5173  ·  api: http://localhost:8787
```

Requires Node 20+. The assistant works with **no API key**: common questions are answered locally, and the
Pollinations anonymous tier is used for open-ended ones. Add `POLLINATIONS_API_KEY` (server-side only) for better limits.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite + Express (with watch) together |
| `npm test` | Vitest: retrieval, routing, safety, orchestrator, cache, API (39 tests) |
| `npm run typecheck` | Strict TypeScript for client, server and tooling |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm start` | Express serves the API **and** `dist/` on `PORT` (default 8787) |

Production: `npm run build && npm start`, then open http://localhost:8787.

## How a message is answered (free-tier-first)

```
Browser ─► safety check ─► topic chip? ─► unsupported-integration rule ─► local retrieval
                                                                         │ high confidence & simple → instant local answer
                                                                         ▼
                                           cache hit? ─► else POST /api/chat ─► retrieve top 3 articles
                                                                         ─► Pollinations (1 call, +1 retry on 5xx/timeout)
                                                                         ─► response guard ─► browser
```

* **One AI request per message**, never automatic, send disabled while busy, double-submit blocked.
* ~65 local knowledge entries (`src/data/knowledge/*`) cover your required FAQs, 15 troubleshooting guides, plans, billing, security and integrations.
* Only the **top 3 relevant entries (≤ ~3 KB)** go to the model — never the whole knowledge base.
* Answers cached in `localStorage` (24 h, 50 entries) for standalone questions.
* If the AI fails: the exact message *"Redora AI is temporarily unable to process that request."* plus **Try Again / Browse Support Topics / Contact Support**, and the best local answer is still shown.
* A server **response guard** replaces any "I don't know"-style reply with knowledge-based guidance and trims to ≤ 400 words.
* Passwords, OTPs, recovery codes, API secrets, card numbers and CVVs are detected on client **and** server; the message is redacted, not sent, and the user is warned.

## Project structure

```
server/                    Express API (composition root: index.ts)
  config/env.ts            validated env (only place process.env is read)
  lib/                     logger (secret-redacting), AppError, retry
  middleware/              errorHandler, rateLimiter, validateBody, cors, requestLogger
  modules/ai/              AiProvider port + PollinationsProvider + factory
  modules/chat/            routes → controller → ChatService → promptBuilder / responseGuard
src/
  domain/                  framework-free, shared by client AND server (contracts, retriever, router, safety)
  data/                    redoraFacts.ts (single source of truth) + knowledge/* + redoraKnowledge.ts
  services/chatApi.ts      HTTP adapter (zod-validated responses, timeout, typed errors)
  features/<feature>/      chat, hero, demo, how-it-works, features, modules, plans, security, …
  lib/animations/          fadeUp, staggerReveal, splitReveal, scaleIn, parallax, horizontalScroll, magneticHover
  shared/                  Button, Section, ErrorBoundary, FormattedText, hooks
docs/ARCHITECTURE.md       architecture decisions (ADRs)
```

## Environment

See `.env.example`. Secrets (`POLLINATIONS_API_KEY`) exist **only** on the server; the browser calls `/api/chat`.
### Optional: add a Pollinations key from the site

The footer has a small **Pollinations API** button. It opens a dialog where a visitor can paste their own key.
The key is kept in that browser's `localStorage` and sent as an `X-Pollinations-Key` header with `/api/chat` requests only;
the server uses it for that request instead of `POLLINATIONS_API_KEY` and never stores or logs it. Remove it from the same dialog.
With no key saved, behaviour is unchanged.

`POLLINATIONS_API_URL` defaults to `https://gen.pollinations.ai/v1/chat/completions` (OpenAI-compatible); `POLLINATIONS_MODEL` defaults to `openai`.

## Editing the knowledge base

Add facts to `src/data/redoraFacts.ts` (prices, limits, contacts — used by both the UI and answers), then add or edit entries in `src/data/knowledge/`.
`npm test` verifies unique ids, resolvable related-topic links, the four-part troubleshooting structure and price consistency.

## Accessibility & performance

Semantic landmarks, skip link, keyboard-operable everything, ARIA live chat log, visible focus, `prefers-reduced-motion` respected (GSAP only runs when motion is allowed; horizontal storytelling becomes vertical on mobile/reduced motion), pointer-parallax only on fine pointers. Animations use transform/opacity; background is CSS only (no canvas/3D engine/video). Fonts are self-hosted via Fontsource.

## Notes & assumptions

* The Business plan is treated as **including everything in Pro** (plus its own items); the Free plan includes basic Slack, Google Drive and Google Calendar connections; GitHub/Notion/Zapier start on Starter. These choices are encoded in `redoraFacts.ts`.
* Muted text (`#626262`) is used only for tertiary hints; body copy uses `#A0A0A0`.
* The rate limiter is in-memory (single instance). Use a shared store if you scale horizontally.
