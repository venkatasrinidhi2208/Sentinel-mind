/**
 * Incident Data Repository & Memory Bank
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Incident, CreateIncidentDTO, DiagnosticLog } from '../models/incident.model';
import { IncidentMemoryRecord } from '../models/memory.model';

class IncidentRepository {
  private incidents: Map<string, Incident> = new Map();
  private memoryRecords: Map<string, IncidentMemoryRecord> = new Map();

  constructor() {
    this.seedHistoricalIncidentMemories();
  }

  private seedHistoricalIncidentMemories(): void {
    const historicalMemories: IncidentMemoryRecord[] = [
      {
        id: 'mem-hist-001',
        incidentId: 'inc-hist-101',
        topic: 'production-incidents',
        impactedService: 'srv-postgres-cluster',
        errorSignature: 'PostgreSQL Fatal Error: FATAL remaining connection slots reserved for non-replication superuser connections',
        rootCause: 'Connection leak in User & Auth API v2.4 deployment where idle connections were not released back to the pool.',
        resolutionRunbook: 'Terminate idle leaked database backends, apply pGBouncer connection throttling, and restart Auth API replicas.',
        remediationCommand: 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = \'idle\' AND state_change < NOW() - INTERVAL \'5 minutes\';',
        tags: ['postgres', 'connection-leak', 'database', 'auth-service'],
        retainedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mem-hist-002',
        incidentId: 'inc-hist-102',
        topic: 'production-incidents',
        impactedService: 'srv-redis-cache',
        errorSignature: 'OOM command not allowed when used memory > maxmemory (Redis Server Error 503)',
        rootCause: 'Session key pattern sess:v1:* leaked without TTL expiration policy configured during flash sale event.',
        resolutionRunbook: 'Purge untagged session keys with pattern matching, flush volatile cache keys, and enforce maxmemory-policy allkeys-lru.',
        remediationCommand: 'redis-cli --pattern "sess:v1:*" --args UNLINK; redis-cli CONFIG SET maxmemory-policy allkeys-lru;',
        tags: ['redis', 'oom', 'cache', 'memory-leak'],
        retainedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mem-hist-003',
        incidentId: 'inc-hist-103',
        topic: 'production-incidents',
        impactedService: 'srv-payment-gateway',
        errorSignature: 'HTTP 504 Gateway Timeout on /v1/charge: External Payment Webhook Connection Deadlock',
        rootCause: 'Upstream gateway TLS handshake timeout during peak traffic due to stale connection socket pooling.',
        resolutionRunbook: 'Flush upstream HTTP connection pool and apply retry backoff jitter with circuit breaker pattern.',
        remediationCommand: 'systemctl restart payment-gateway-circuit-breaker && curl -X POST http://localhost:8080/internal/flush-pool',
        tags: ['payment-gateway', 'timeout', '504', 'circuit-breaker'],
        retainedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const mem of historicalMemories) {
      this.memoryRecords.set(mem.id, mem);
    }
  }

  public createIncident(dto: CreateIncidentDTO, serviceName: string): Incident {
    const id = `inc-${Date.now().toString().slice(-6)}`;
    const incident: Incident = {
      id,
      title: dto.title,
      serviceId: dto.serviceId,
      serviceName,
      severity: dto.severity,
      state: 'OPEN',
      errorSignature: dto.errorSignature,
      stackTrace: dto.stackTrace,
      logs: [
        {
          timestamp: new Date().toISOString(),
          command: 'systemctl status service',
          output: `[ALERT TRIGGERED] ${dto.title}: ${dto.errorSignature}`,
          level: 'error',
        },
      ],
      suggestedActions: [],
      createdAt: new Date().toISOString(),
    };

    this.incidents.set(id, incident);
    return incident;
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  public getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updateIncident(id: string, updates: Partial<Incident>): Incident | undefined {
    const existing = this.incidents.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.incidents.set(id, updated);
    return updated;
  }

  public clearActiveIncidents(): void {
    for (const incident of this.incidents.values()) {
      if (incident.state !== 'RESOLVED') {
        incident.state = 'RESOLVED';
        incident.resolvedAt = new Date().toISOString();
        incident.resolutionSummary = 'Manual health check & system self-heal completed.';
      }
    }
  }

  public addLog(id: string, log: DiagnosticLog): Incident | undefined {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;

    incident.logs.push(log);
    return this.updateIncident(id, { logs: incident.logs });
  }

  public getHistoricalMemories(): IncidentMemoryRecord[] {
    return Array.from(this.memoryRecords.values());
  }

  public saveMemoryRecord(record: IncidentMemoryRecord): void {
    this.memoryRecords.set(record.id, record);
  }
}

export const incidentRepository = new IncidentRepository();
