/**
 * Multi-Stage AI Orchestration Engine
 * Developed by: Gowri (AI Engine & API Integration)
 * 
 * Pipeline: Alert -> Validation -> Hindsight Recall -> Context Construction -> LLM Inference -> Output Validation -> Result Output
 */

import { Incident } from '../../models/incident.model';
import { aiProviderService } from './aiProvider';
import { hindsightMemoryService } from './hindsightService';
import { responseValidatorService, StructuredAIAnalysis } from './responseValidator';
import { incidentRepository } from '../incidentRepository';

export class AIOrchestratorService {
  public async orchestrateIncidentAnalysis(incident: Incident): Promise<StructuredAIAnalysis> {
    console.log(`[AIOrchestrator] Starting multi-stage analysis for Incident ${incident.id}...`);

    // Stage 1: Input Validation & Telemetry Sanitization
    const sanitizedSignature = incident.errorSignature.trim();

    // Stage 2: Hindsight Memory Retrieval (Recall Phase)
    const memoryResult = await hindsightMemoryService.recallIncidentMemory({
      topic: 'production-incidents',
      queryText: `${incident.title} ${sanitizedSignature}`,
    });

    if (memoryResult.matchedRecord) {
      incidentRepository.updateIncident(incident.id, {
        memoryMatch: {
          matchedIncidentId: memoryResult.matchedRecord.incidentId,
          confidenceScore: memoryResult.confidenceScore,
          rootCause: memoryResult.matchedRecord.rootCause,
          pastResolution: memoryResult.matchedRecord.resolutionRunbook,
          retrievedAt: memoryResult.retrievedAt,
        },
      });
    }

    // Stage 3: Context Construction & System Prompting
    const contextPrompt = `
You are SentinelMind, an autonomous SRE & Incident Remediation Agent.
Analyze the following production outage alert:

Service: ${incident.serviceName}
Severity: ${incident.severity}
Error Signature: ${sanitizedSignature}
Stack Trace: ${incident.stackTrace}

Recalled Hindsight Memory Match:
${
  memoryResult.matchedRecord
    ? `Matched Past Incident ID: ${memoryResult.matchedRecord.incidentId}
Root Cause: ${memoryResult.matchedRecord.rootCause}
Past Verified Runbook: ${memoryResult.matchedRecord.resolutionRunbook}
Remediation Command: ${memoryResult.matchedRecord.remediationCommand}`
    : 'No direct historical memory match found.'
}

Produce a JSON response containing:
- rootCause: string
- confidence: number (0.0 to 1.0)
- evidence: string[]
- warnings: string[]
- suggestedActions: Array of { id, title, command, riskLevel, description, automated: true }
`;

    // Stage 4: LLM Generation
    const llmResponse = await aiProviderService.generateCompletion({
      prompt: contextPrompt,
      temperature: 0.1,
    });

    // Stage 5: Response Schema & Hallucination Validation
    const structuredResult = responseValidatorService.validateAndParseOutput(llmResponse.rawOutput);

    // Update incident in repository with suggested actions
    incidentRepository.updateIncident(incident.id, {
      state: 'REMEDIATION_READY',
      suggestedActions: structuredResult.suggestedActions,
    });

    return structuredResult;
  }
}

export const aiOrchestratorService = new AIOrchestratorService();
