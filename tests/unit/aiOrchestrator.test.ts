/**
 * AI Layer & Hindsight Memory Unit Tests
 * Developed by: Gowri (AI Engine & API Integration)
 */

import { ResponseValidatorService } from '../../src/services/ai/responseValidator';

export function runAITests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  const validator = new ResponseValidatorService();

  // Test 1: Validate valid JSON output parsing
  try {
    const validJSON = JSON.stringify({
      rootCause: 'Database connection pool exhausted',
      confidence: 0.95,
      evidence: ['Log signature match'],
      warnings: ['Potential transaction lag'],
      suggestedActions: [
        {
          id: 'act-1',
          title: 'Clean pool',
          command: 'SELECT 1;',
          riskLevel: 'LOW',
          description: 'Clean idle backends',
          automated: true,
        },
      ],
    });

    const parsed = validator.validateAndParseOutput(validJSON);
    if (parsed.confidence === 0.95 && parsed.suggestedActions.length === 1) {
      passed++;
    } else {
      failed++;
      errors.push('AI Test 1 Failed: Structured JSON parsing score mismatch');
    }
  } catch (err: any) {
    failed++;
    errors.push(`AI Test 1 Exception: ${err.message}`);
  }

  // Test 2: Fallback handling on invalid JSON
  try {
    const invalidJSON = 'INVALID_NOT_JSON_CONTENT';
    const parsed = validator.validateAndParseOutput(invalidJSON);
    if (parsed.confidence === 0.5 && parsed.warnings.length > 0) {
      passed++;
    } else {
      failed++;
      errors.push('AI Test 2 Failed: Fallback on invalid JSON failed');
    }
  } catch (err: any) {
    failed++;
    errors.push(`AI Test 2 Exception: ${err.message}`);
  }

  return { passed, failed, errors };
}
