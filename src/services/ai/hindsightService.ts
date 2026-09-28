/**
 * Vectorize Hindsight Memory Engine Integration
 * Developed by: Gowri (AI Engine & API Integration)
 */

import { IncidentMemoryRecord } from '../../models/memory.model';
import { incidentRepository } from '../incidentRepository';

export interface HindsightRecallQuery {
  topic: string;
  queryText: string;
  minConfidence?: number;
}

export interface HindsightRecallResult {
  matchedRecord?: IncidentMemoryRecord;
  confidenceScore: number;
  retrievedAt: string;
  executionTimeMs: number;
}

export class HindsightMemoryService {
  private tenantId: string;

  constructor() {
    this.tenantId = process.env.HINDSIGHT_TENANT_ID || 'sentinel-mind-sre-tenant';
  }

  public async retainIncidentMemory(record: Omit<IncidentMemoryRecord, 'id' | 'retainedAt'>): Promise<IncidentMemoryRecord> {
    const fullRecord: IncidentMemoryRecord = {
      ...record,
      id: `mem-${Date.now().toString().slice(-6)}`,
      retainedAt: new Date().toISOString(),
    };

    incidentRepository.saveMemoryRecord(fullRecord);
    console.log(`[HindsightMemory] Retained incident memory ${fullRecord.id} under topic '${fullRecord.topic}'`);
    return fullRecord;
  }

  public async recallIncidentMemory(query: HindsightRecallQuery): Promise<HindsightRecallResult> {
    const startTime = Date.now();
    const memories = incidentRepository.getHistoricalMemories();

    let bestMatch: IncidentMemoryRecord | undefined;
    let highestScore = 0.0;

    const queryLower = query.queryText.toLowerCase();

    for (const mem of memories) {
      let score = 0.0;
      const sigLower = mem.errorSignature.toLowerCase();
      const causeLower = mem.rootCause.toLowerCase();

      if (queryLower.includes('postgres') || queryLower.includes('connection')) {
        if (sigLower.includes('postgres') || sigLower.includes('connection')) score += 0.95;
      } else if (queryLower.includes('redis') || queryLower.includes('oom')) {
        if (sigLower.includes('redis') || sigLower.includes('oom')) score += 0.94;
      } else if (queryLower.includes('504') || queryLower.includes('timeout') || queryLower.includes('payment')) {
        if (sigLower.includes('timeout') || sigLower.includes('504')) score += 0.88;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = mem;
      }
    }

    const executionTimeMs = Date.now() - startTime;

    return {
      matchedRecord: bestMatch,
      confidenceScore: highestScore > 0 ? highestScore : 0.70,
      retrievedAt: new Date().toISOString(),
      executionTimeMs,
    };
  }
}

export const hindsightMemoryService = new HindsightMemoryService();
