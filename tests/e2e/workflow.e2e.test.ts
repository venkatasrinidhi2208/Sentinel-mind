/**
 * End-to-End Workflow E2E Test Suite
 * Developed by: Aashrith (Security, Testing & DevOps)
 * 
 * Verifies full journey: Chaos Trigger -> Alert -> AI Hindsight Recall -> Remediation Execution -> Service Recovery
 */

import { chaosService } from '../../src/services/chaos.service';
import { incidentService } from '../../src/services/incident.service';
import { serviceRepository } from '../../src/services/serviceRepository';

export function runE2ETests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  try {
    // 1. Inject Chaos: DB Connection Leak
    const incident = chaosService.triggerChaosScenario('db_connection_leak');
    if (!incident || !incident.id) {
      failed++;
      errors.push('E2E Test Step 1 Failed: Chaos trigger did not create incident');
      return { passed, failed, errors };
    }
    passed++;

    // 2. Verify Service Health Degradation
    const service = serviceRepository.getServiceById('srv-postgres-cluster');
    if (service && (service.status === 'critical' || service.status === 'degraded')) {
      passed++;
    } else {
      failed++;
      errors.push('E2E Test Step 2 Failed: Microservice status was not degraded');
    }

    // 3. Verify Remediation Action execution and recovery
    const resolved = incidentService.executeRemediationAction(incident.id, 'act-pg-clean');
    if (resolved && resolved.state === 'RESOLVED') {
      passed++;
    } else {
      failed++;
      errors.push('E2E Test Step 3 Failed: Incident remediation execution failed');
    }

    // 4. Verify Microservice is Healthy again
    const restoredService = serviceRepository.getServiceById('srv-postgres-cluster');
    if (restoredService && restoredService.status === 'healthy') {
      passed++;
    } else {
      failed++;
      errors.push('E2E Test Step 4 Failed: Microservice health was not restored to healthy');
    }
  } catch (err: any) {
    failed++;
    errors.push(`E2E Test Exception: ${err.message}`);
  }

  return { passed, failed, errors };
}
