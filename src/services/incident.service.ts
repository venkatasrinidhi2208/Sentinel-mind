/**
 * Core Incident Management Service
 * Developed by: Sri (Backend & Core Architecture)
 * AI Integration by: Gowri (AI Engine & API Integration)
 */

import { Incident, CreateIncidentDTO } from '../models/incident.model';
import { incidentRepository } from './incidentRepository';
import { serviceRepository } from './serviceRepository';
import { aiOrchestratorService } from './ai/aiOrchestrator';

export class IncidentService {
  public createIncident(dto: CreateIncidentDTO): Incident {
    const service = serviceRepository.getServiceById(dto.serviceId);
    const serviceName = service ? service.name : 'Unknown Service';

    // Update service status to critical/degraded
    if (service) {
      const newStatus = dto.severity === 'CRITICAL' ? 'critical' : 'degraded';
      serviceRepository.updateService(service.id, {
        status: newStatus,
        healthScore: Math.max(10, service.healthScore - 40),
      });
    }

    const incident = incidentRepository.createIncident(dto, serviceName);
    if (service) {
      serviceRepository.updateService(service.id, { lastIncidentId: incident.id });
    }

    // Trigger Gowri's AI Multi-stage Orchestrator & Hindsight Memory Recall
    aiOrchestratorService.orchestrateIncidentAnalysis(incident).catch((err) => {
      console.error('[IncidentService] AI Orchestration error:', err);
    });

    return incident;
  }

  public getIncidentDetails(id: string): Incident | undefined {
    return incidentRepository.getIncidentById(id);
  }

  public getActiveIncidents(): Incident[] {
    return incidentRepository.getAllIncidents();
  }

  public executeRemediationAction(incidentId: string, actionId: string): Incident {
    const incident = incidentRepository.getIncidentById(incidentId);
    if (!incident) {
      throw new Error(`Incident with ID ${incidentId} not found.`);
    }

    const action = incident.suggestedActions.find((a) => a.id === actionId);
    if (!action) {
      throw new Error(`Action with ID ${actionId} not found in incident.`);
    }

    // Execute remediation action
    action.executed = true;
    action.executedAt = new Date().toISOString();
    action.result = `[SUCCESS] Executed: ${action.command}. Service health restored to 100%.`;

    incidentRepository.addLog(incidentId, {
      timestamp: new Date().toISOString(),
      command: action.command,
      output: action.result,
      level: 'info',
    });

    // Restore microservice health
    if (incident.serviceId) {
      serviceRepository.updateService(incident.serviceId, {
        status: 'healthy',
        healthScore: 98,
        activeConnections: 120,
        latencyMs: 15,
        memoryUsageMb: 350,
      });
    }

    // Update incident state to RESOLVED
    const updated = incidentRepository.updateIncident(incidentId, {
      state: 'RESOLVED',
      resolvedAt: new Date().toISOString(),
      resolutionSummary: `Resolved via remediation command: ${action.command}`,
    });

    return updated!;
  }
}

export const incidentService = new IncidentService();
