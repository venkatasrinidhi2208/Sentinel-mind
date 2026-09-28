/**
 * Incident Telemetry and Remediation Data Model
 * Developed by: Sri (Backend & Core Architecture)
 */

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentState = 'OPEN' | 'ANALYZING' | 'RECALLING_MEMORY' | 'REMEDIATION_READY' | 'RESOLVED' | 'CLOSED';

export interface DiagnosticLog {
  timestamp: string;
  command: string;
  output: string;
  level: 'info' | 'warn' | 'error';
}

export interface RemediationAction {
  id: string;
  title: string;
  command: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  automated: boolean;
  executed: boolean;
  executedAt?: string;
  result?: string;
}

export interface HindsightMemoryMatch {
  matchedIncidentId: string;
  confidenceScore: number; // 0 to 1
  rootCause: string;
  pastResolution: string;
  retrievedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  serviceId: string;
  serviceName: string;
  severity: SeverityLevel;
  state: IncidentState;
  errorSignature: string;
  stackTrace: string;
  logs: DiagnosticLog[];
  memoryMatch?: HindsightMemoryMatch;
  suggestedActions: RemediationAction[];
  resolutionSummary?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CreateIncidentDTO {
  serviceId: string;
  title: string;
  severity: SeverityLevel;
  errorSignature: string;
  stackTrace: string;
}
