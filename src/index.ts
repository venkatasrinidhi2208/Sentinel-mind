/**
 * SentinelMind — Autonomous SRE & Incident Remediation Agent
 * Server Bootstrap Entry Point
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
