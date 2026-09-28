/**
 * Hindsight Incident Memory Bank Model
 * Developed by: Sri (Backend & Core Architecture)
 */

export interface IncidentMemoryRecord {
  id: string;
  incidentId: string;
  topic: string;
  errorSignature: string;
  rootCause: string;
  resolutionRunbook: string;
  remediationCommand: string;
  impactedService: string;
  tags: string[];
  retainedAt: string;
}
