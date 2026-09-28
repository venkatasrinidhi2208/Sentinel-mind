/**
 * SentinelMind — Autonomous SRE & Incident Remediation Agent
 * Server Bootstrap Entry Point
 * 
 * Integrated Team Stack:
 * - Sri: Backend & REST Architecture
 * - Shreyas: Frontend & UX Dashboard
 * - Gowri: AI Engine & Hindsight Memory
 * - Aashrith: Security, Testing & DevOps
 */

import app from './server';

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(`🛡️  SENTINEL-MIND AUTONOMOUS SRE ENGINE RUNNING`);
    console.log(`====================================================`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================\n`);
  });
}

export default app;
