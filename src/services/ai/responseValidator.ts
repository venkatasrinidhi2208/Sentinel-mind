/**
 * AI Response Schema & Hallucination Validator
 * Developed by: Gowri (AI Engine & API Integration)
 */

import { RemediationAction } from '../../models/incident.model';

export interface StructuredAIAnalysis {
  rootCause: string;
  confidence: number;
  evidence: string[];
  warnings: string[];
  suggestedActions: RemediationAction[];
}

export class ResponseValidatorService {
  public validateAndParseOutput(rawJson: string): StructuredAIAnalysis {
    try {
      const parsed = JSON.parse(rawJson);

      const rootCause = typeof parsed.rootCause === 'string' ? parsed.rootCause : 'Unknown root cause detected.';
      const confidence = typeof parsed.confidence === 'number' ? Math.min(1.0, Math.max(0.0, parsed.confidence)) : 0.75;
      const evidence = Array.isArray(parsed.evidence) ? parsed.evidence.map(String) : [];
      const warnings = Array.isArray(parsed.warnings) ? parsed.warnings.map(String) : [];

      const suggestedActions: RemediationAction[] = [];
      if (Array.isArray(parsed.suggestedActions)) {
        for (const act of parsed.suggestedActions) {
          if (act.title && act.command) {
            suggestedActions.push({
              id: act.id || `act-${Date.now().toString().slice(-4)}`,
              title: String(act.title),
              command: String(act.command),
              riskLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(act.riskLevel) ? act.riskLevel : 'MEDIUM',
              description: String(act.description || act.title),
              automated: Boolean(act.automated),
              executed: false,
            });
          }
        }
      }

      return {
        rootCause,
        confidence,
        evidence,
        warnings,
        suggestedActions,
      };
    } catch (err) {
      console.error('[ResponseValidator] JSON parse error, generating safe fallback output');
      return {
        rootCause: 'System alert signature requires further manual inspection.',
        confidence: 0.50,
        evidence: ['Raw diagnostic telemetry unparsed.'],
        warnings: ['Low confidence AI output fallback triggered.'],
        suggestedActions: [],
      };
    }
  }
}

export const responseValidatorService = new ResponseValidatorService();
