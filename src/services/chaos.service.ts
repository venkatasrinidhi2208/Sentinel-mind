/**
 * Chaos Engineering Trigger Service
 * Developed by: Sri (Backend & Core Architecture)
 */

import { Incident } from '../models/incident.model';
import { incidentService } from './incident.service';

export type ChaosType = 'db_connection_leak' | 'redis_oom' | 'payment_timeout' | 'auth_latency';

export class ChaosService {
  public triggerChaosScenario(type: ChaosType): Incident {
    switch (type) {
      case 'db_connection_leak':
        return incidentService.createIncident({
          serviceId: 'srv-postgres-cluster',
          title: 'PostgreSQL Connection Exhaustion Alert',
          severity: 'CRITICAL',
          errorSignature: 'PostgreSQL Fatal Error: FATAL remaining connection slots reserved for non-replication superuser connections',
          stackTrace: 'Error: ConnectionPoolExhausted\n  at PostgresPool.acquireConnection (/app/db/pool.ts:42)\n  at AuthController.login (/app/controllers/auth.ts:18)\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)',
        });

      case 'redis_oom':
        return incidentService.createIncident({
          serviceId: 'srv-redis-cache',
          title: 'Redis OOM Buffer Overflow Alert',
          severity: 'HIGH',
          errorSignature: 'OOM command not allowed when used memory > maxmemory (Redis Server Error 503)',
          stackTrace: 'ReplyError: OOM command not allowed when used memory > maxmemory\n  at RedisClient.writeCommand (/app/cache/redis.ts:112)\n  at SessionStore.setSession (/app/middleware/session.ts:54)',
        });

      case 'payment_timeout':
        return incidentService.createIncident({
          serviceId: 'srv-payment-gateway',
          title: 'Payment Gateway 504 Gateway Timeout Alert',
          severity: 'CRITICAL',
          errorSignature: 'HTTP 504 Gateway Timeout on /v1/charge: External Payment Webhook Connection Deadlock',
          stackTrace: 'FetchError: network timeout at https://api.stripe.internal/v1/charges\n  at Timeout._onTimeout (/app/services/payment.ts:88)\n  at listOnTimeout (node:internal/timers:573:17)',
        });

      case 'auth_latency':
      default:
        return incidentService.createIncident({
          serviceId: 'srv-user-api',
          title: 'User API High Latency Degradation',
          severity: 'MEDIUM',
          errorSignature: 'HTTP 502 Bad Gateway - API Endpoint /api/v1/auth Response Latency > 4500ms',
          stackTrace: 'Error: GatewayTimeout\n  at ExpressApp.handleRequest (/app/server.ts:120)\n  at Router.dispatch (/app/router.ts:45)',
        });
    }
  }
}

export const chaosService = new ChaosService();
