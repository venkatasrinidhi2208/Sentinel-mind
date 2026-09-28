/**
 * Chaos Engineering Trigger Routes
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Router, Request, Response } from 'express';
import { chaosService, ChaosType } from '../services/chaos.service';

const router = Router();

router.post('/trigger', (req: Request, res: Response) => {
  try {
    const { scenario } = req.body;
    const validScenarios: ChaosType[] = [
      'db_connection_leak',
      'redis_oom',
      'payment_timeout',
      'auth_latency',
    ];

    const targetScenario: ChaosType = validScenarios.includes(scenario)
      ? (scenario as ChaosType)
      : 'db_connection_leak';

    const incident = chaosService.triggerChaosScenario(targetScenario);
    res.status(201).json({
      message: `Chaos scenario '${targetScenario}' triggered successfully`,
      incident,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to trigger chaos scenario' });
  }
});

export default router;
