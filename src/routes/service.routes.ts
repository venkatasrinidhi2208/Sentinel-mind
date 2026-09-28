/**
 * Service & Telemetry Routes
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Router, Request, Response } from 'express';
import { serviceRepository } from '../services/serviceRepository';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const report = serviceRepository.getHealthReport();
  res.json(report);
});

router.get('/:id', (req: Request, res: Response) => {
  const service = serviceRepository.getServiceById(req.params.id);
  if (!service) {
    res.status(404).json({ error: `Service with ID ${req.params.id} not found.` });
    return;
  }
  res.json(service);
});

export default router;
