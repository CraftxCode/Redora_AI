# Architecture decisions

**ADR-001 — Layered, feature-based structure.** Dependency flow is one-way: `domain` (pure) ← `data` ← `services` / `server` ← `features` ← `App`. Domain code imports nothing from React, Express or the DOM, so it is shared by both runtimes and unit-testable.

**ADR-002 — Local-first routing.** `ChatOrchestrator` (client) decides per message: safety → explicit topic → unsupported-integration rule → local retrieval → cache → one AI call. `decideRoute()` is a pure function: local only when retrieval confidence is high, the question is short, and it isn't comparative/multi-intent. This keeps common questions free and instant, and works offline.

**ADR-003 — Keyword retrieval, no vectors.** `KnowledgeRetriever` scores contiguous keyword phrases (highest), all-tokens-present and title overlap, with a tiny priority tie-breaker. Deterministic, ~0 ms, zero cost. Trade-off: no semantic matching — mitigated by routing low-confidence queries to the AI with the best 3 entries as context.

**ADR-004 — Shared contracts.** `src/domain/chat/contracts.ts` (zod) is imported by server and client. The server validates requests; the client validates responses, so drift fails loudly instead of rendering garbage.

**ADR-005 — Ports and adapters for AI.** `ChatService` depends on `AiProvider`. `PollinationsProvider` is the only file that knows the vendor (URL, auth header, payload). Swapping providers means one new class and one line in `createAiProvider`.

**ADR-006 — Secrets stay on the server.** Only `VITE_*` values reach the browser, and none are secrets. The key is optional (anonymous tier) and is redacted by the logger.

**ADR-007 — Resilience budget.** 20 s provider timeout, exactly one retry for timeouts/network/5xx (never 4xx/429), per-IP rate limit, 16 KB body cap, 500-char messages, ≤ 6 history items. In-memory limiter is a documented single-instance simplification.

**ADR-008 — Centralised errors.** `AppError` + one Express error handler map failures to `{error:{code,message}}`; raw provider errors are logged, never returned. The client maps codes to a single user-facing message with recovery actions. React `ErrorBoundary`s isolate each section and the chat.

**ADR-009 — Defence in depth for credentials.** `detectSensitiveData` runs in the composer (blocks send, shows warning), in the orchestrator, and in the API controller (422). Displayed/stored user text is redacted.

**ADR-010 — Motion architecture.** All GSAP runs inside `gsap.context` + `matchMedia` (`useGsap`), reverting on unmount and doing nothing under `prefers-reduced-motion`. Content is visible by default (animations use `from`), so no-JS and reduced-motion users see everything.

**ADR-011 — Single source of truth for facts.** Plans, limits, integrations and contacts live in `redoraFacts.ts`; the UI and knowledge answers are generated from it, preventing contradictions. A test asserts price consistency.
