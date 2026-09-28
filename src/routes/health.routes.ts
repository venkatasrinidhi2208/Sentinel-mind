/**
 * Health Routes
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'SentinelMind Core Server',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
