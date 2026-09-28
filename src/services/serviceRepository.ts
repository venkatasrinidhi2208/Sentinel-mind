/**
 * Service & Telemetry Data Repository
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Microservice, ServiceHealthReport } from '../models/service.model';

class ServiceRepository {
  private services: Map<string, Microservice> = new Map();

  constructor() {
    this.seedDefaultServices();
  }

  public seedDefaultServices(): void {
    const initialServices: Microservice[] = [
      {
        id: 'srv-user-api',
        name: 'User & Auth API',
        type: 'api',
        status: 'healthy',
        healthScore: 98,
        uptimePercentage: 99.95,
        activeConnections: 1420,
        latencyMs: 42,
        memoryUsageMb: 340,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-postgres-cluster',
        name: 'PostgreSQL Core DB',
        type: 'database',
        status: 'healthy',
        healthScore: 96,
        uptimePercentage: 99.99,
        activeConnections: 95,
        latencyMs: 12,
        memoryUsageMb: 1240,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-redis-cache',
        name: 'Redis L2 Cache Cluster',
        type: 'cache',
        status: 'healthy',
        healthScore: 99,
        uptimePercentage: 99.98,
        activeConnections: 2800,
        latencyMs: 3,
        memoryUsageMb: 850,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'srv-payment-gateway',
        name: 'Payment & Checkout Service',
        type: 'api',
        status: 'healthy',
        healthScore: 97,
        uptimePercentage: 99.91,
        activeConnections: 480,
        latencyMs: 65,
        memoryUsageMb: 410,
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const service of initialServices) {
      this.services.set(service.id, service);
    }
  }

  public getAllServices(): Microservice[] {
    return Array.from(this.services.values());
  }

  public getServiceById(id: string): Microservice | undefined {
    return this.services.get(id);
  }

  public updateService(id: string, updates: Partial<Microservice>): Microservice | undefined {
    const existing = this.services.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.services.set(id, updated);
    return updated;
  }

  public resetAllServicesToHealthy(): void {
    this.seedDefaultServices();
  }

  public getHealthReport(): ServiceHealthReport {
    const all = this.getAllServices();
    const healthyCount = all.filter((s) => s.status === 'healthy').length;
    const degradedCount = all.filter((s) => s.status === 'degraded').length;
    const criticalCount = all.filter((s) => s.status === 'critical').length;

    let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (criticalCount > 0) overallStatus = 'critical';
    else if (degradedCount > 0) overallStatus = 'degraded';

    return {
      overallStatus,
      totalServices: all.length,
      healthyCount,
      degradedCount,
      criticalCount,
      services: all,
      timestamp: new Date().toISOString(),
    };
  }
}

export const serviceRepository = new ServiceRepository();
