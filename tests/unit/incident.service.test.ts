/**
 * Backend Unit Tests
 * Developed by: Sri (Backend & Core Architecture)
 */

import { IncidentService } from '../../src/services/incident.service';
import { serviceRepository } from '../../src/services/serviceRepository';
import { incidentRepository } from '../../src/services/incidentRepository';

export function runIncidentServiceTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  const incidentService = new IncidentService();

  // Test 1: Create incident and verify service status updated to degraded/critical
  try {
    const incident = incidentService.createIncident({
      serviceId: 'srv-postgres-cluster',
      title: 'Unit Test DB Lock',
      severity: 'CRITICAL',
      errorSignature: 'Test Postgres Lockup Signature',
      stackTrace: 'Error: TestStackTrace',
    });

    if (incident && incident.id && incident.state === 'OPEN') {
      passed++;
    } else {
      failed++;
      errors.push('Test 1 Failed: Incident creation returned invalid object');
    }

    const service = serviceRepository.getServiceById('srv-postgres-cluster');
    if (service && (service.status === 'critical' || service.status === 'degraded')) {
      passed++;
    } else {
      failed++;
      errors.push('Test 2 Failed: Microservice status was not updated on incident creation');
    }
  } catch (err: any) {
    failed++;
    errors.push(`Test Exception: ${err.message}`);
  }

  // Test 3: Retrieve active incidents
  try {
    const active = incidentService.getActiveIncidents();
    if (Array.isArray(active) && active.length > 0) {
      passed++;
    } else {
      failed++;
      errors.push('Test 3 Failed: Active incidents list is empty');
    }
  } catch (err: any) {
    failed++;
    errors.push(`Test 3 Exception: ${err.message}`);
  }

  return { passed, failed, errors };
}
