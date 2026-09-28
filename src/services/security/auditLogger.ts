/**
 * Security Audit Logging Service
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export class AuditLoggerService {
  private auditLogs: AuditLogEntry[] = [];

  public logEvent(action: string, actor: string, targetId: string, details: string, ipAddress: string = '127.0.0.1'): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      action,
      actor,
      targetId,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(entry);
    console.log(`[SECURITY AUDIT] ${entry.timestamp} | ${action} by ${actor} on ${targetId}: ${details}`);
    return entry;
  }

  public getAuditHistory(): AuditLogEntry[] {
    return [...this.auditLogs];
  }
}

export const auditLoggerService = new AuditLoggerService();
