/**
 * Monitored Microservice Telemetry Model
 * Developed by: Sri (Backend & Core Architecture)
 */

export type ServiceStatus = 'healthy' | 'degraded' | 'critical';

export interface Microservice {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cache' | 'auth' | 'worker';
  status: ServiceStatus;
  healthScore: number; // 0 to 100
  uptimePercentage: number;
  activeConnections: number;
  latencyMs: number;
  memoryUsageMb: number;
  lastIncidentId?: string;
  updatedAt: string;
}

export interface ServiceHealthReport {
  overallStatus: ServiceStatus;
  totalServices: number;
  healthyCount: number;
  degradedCount: number;
  criticalCount: number;
  services: Microservice[];
  timestamp: string;
}
