import { Router } from 'express';

export function createHealthRouter(info: { model: string; hasApiKey: boolean }): Router {
  const router = Router();
  router.get('/', (_req, res) => res.json({ status: 'ok', ai: { provider: 'pollinations', model: info.model, keyConfigured: info.hasApiKey } }));
  return router;
}
