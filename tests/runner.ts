/**
 * Unified Test Suite Execution Runner
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

import { runIncidentServiceTests } from './unit/incident.service.test';
import { runAITests } from './unit/aiOrchestrator.test';
import { runIntegrationTests } from './integration/api.test';
import { runE2ETests } from './e2e/workflow.e2e.test';

async function executeTestSuite() {
  console.log('====================================================');
  console.log('  SENTINEL-MIND UNIFIED TEST SUITE RUNNER  ');
  console.log('====================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;
  const allErrors: string[] = [];

  // 1. Run Backend Unit Tests (Sri)
  console.log('--> Running Backend Service Unit Tests (Sri)...');
  const backendRes = runIncidentServiceTests();
  totalPassed += backendRes.passed;
  totalFailed += backendRes.failed;
  allErrors.push(...backendRes.errors);
  console.log(`   Passed: ${backendRes.passed}, Failed: ${backendRes.failed}\n`);

  // 2. Run AI Layer Tests (Gowri)
  console.log('--> Running AI Layer & Hindsight Tests (Gowri)...');
  const aiRes = runAITests();
  totalPassed += aiRes.passed;
  totalFailed += aiRes.failed;
  allErrors.push(...aiRes.errors);
  console.log(`   Passed: ${aiRes.passed}, Failed: ${aiRes.failed}\n`);

  // 3. Run Integration Tests (Aashrith)
  console.log('--> Running API Integration Tests (Aashrith)...');
  const intRes = runIntegrationTests();
  totalPassed += intRes.passed;
  totalFailed += intRes.failed;
  allErrors.push(...intRes.errors);
  console.log(`   Passed: ${intRes.passed}, Failed: ${intRes.failed}\n`);

  // 4. Run E2E Tests (Aashrith)
  console.log('--> Running End-to-End Workflow Tests (Aashrith)...');
  const e2eRes = await runE2ETests();
  totalPassed += e2eRes.passed;
  totalFailed += e2eRes.failed;
  allErrors.push(...e2eRes.errors);
  console.log(`   Passed: ${e2eRes.passed}, Failed: ${e2eRes.failed}\n`);

  console.log('====================================================');
  console.log(`SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('====================================================');

  if (totalFailed > 0) {
    console.error('\nFAILURES DETECTED:');
    allErrors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log('\n✨ ALL TESTS PASSED SUCCESSFULLY! PROJECT IS PRODUCTION READY.');
    process.exit(0);
  }
}

executeTestSuite().catch((err) => {
  console.error('Test Runner Unhandled Error:', err);
  process.exit(1);
});
