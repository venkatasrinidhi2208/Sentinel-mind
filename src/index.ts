/**
 * SentinelMind — Autonomous SRE & Incident Remediation Agent
 * Base Repository Entry Point
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SentinelMind Core Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SentinelMind] Server running on port ${PORT}`);
  });
}

export default app;
