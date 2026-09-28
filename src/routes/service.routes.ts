/**
 * Service & Telemetry Routes
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Router, Request, Response } from 'express';
import { serviceRepository } from '../services/serviceRepository';
import { incidentRepository } from '../services/incidentRepository';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const report = serviceRepository.getHealthReport();
  res.json(report);
});

router.post('/heal-all', (req: Request, res: Response) => {
  serviceRepository.resetAllServicesToHealthy();
  incidentRepository.clearActiveIncidents();
  res.json({
    message: 'All microservices restored to 100% healthy',
    report: serviceRepository.getHealthReport(),
  });
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
