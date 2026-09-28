/**
 * Incident Management Routes
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Router, Request, Response } from 'express';
import { incidentService } from '../services/incident.service';
import { incidentRepository } from '../services/incidentRepository';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const incidents = incidentService.getActiveIncidents();
  res.json({ count: incidents.length, incidents });
});

router.get('/memories', (req: Request, res: Response) => {
  const memories = incidentRepository.getHistoricalMemories();
  res.json({ count: memories.length, memories });
});

router.get('/:id', (req: Request, res: Response) => {
  const incident = incidentService.getIncidentDetails(req.params.id);
  if (!incident) {
    res.status(404).json({ error: `Incident ${req.params.id} not found.` });
    return;
  }
  res.json(incident);
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { serviceId, title, severity, errorSignature, stackTrace } = req.body;
    if (!serviceId || !title || !errorSignature) {
      res.status(400).json({ error: 'Missing required incident fields: serviceId, title, errorSignature' });
      return;
    }

    const incident = incidentService.createIncident({
      serviceId,
      title,
      severity: severity || 'HIGH',
      errorSignature,
      stackTrace: stackTrace || '',
    });

    res.status(201).json(incident);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create incident' });
  }
});

router.post('/:id/remediate', (req: Request, res: Response) => {
  try {
    const { actionId } = req.body;
    if (!actionId) {
      res.status(400).json({ error: 'Missing actionId in request body' });
      return;
    }

    const incident = incidentService.executeRemediationAction(req.params.id, actionId);
    res.json({
      message: 'Remediation action executed successfully',
      incident,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to execute remediation' });
  }
});

export default router;
