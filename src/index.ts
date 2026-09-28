/**
 * SentinelMind — Autonomous SRE & Incident Remediation Agent
 * Main Server Entry Point
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.routes';
import serviceRoutes from './routes/service.routes';
import incidentRoutes from './routes/incident.routes';
import chaosRoutes from './routes/chaos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Static Frontend Application (Shreyas UX)
app.use(express.static(path.join(__dirname, '../public')));

// Register API Router Modules (Sri Backend)
app.use('/api/health', healthRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/chaos', chaosRoutes);

// Fallback to index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: `API Endpoint ${req.path} not found.` });
    return;
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SentinelMind] Core Server running on http://localhost:${PORT}`);
  });
}

export default app;
