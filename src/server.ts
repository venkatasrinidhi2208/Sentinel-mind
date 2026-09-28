/**
 * Server Configuration with Security & Audit Middlewares
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import { validateEnvironment } from './config/env';
import { securityHeadersMiddleware, rateLimiterMiddleware, inputSanitizerMiddleware } from './middleware/security';
import { apiKeyAuthMiddleware } from './middleware/auth';

import healthRoutes from './routes/health.routes';
import serviceRoutes from './routes/service.routes';
import incidentRoutes from './routes/incident.routes';
import chaosRoutes from './routes/chaos.routes';

dotenv.config();
const config = validateEnvironment();

const app = express();

// Security Middlewares (Aashrith)
app.use(securityHeadersMiddleware);
app.use(rateLimiterMiddleware);
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(inputSanitizerMiddleware);
app.use(apiKeyAuthMiddleware);

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

export default app;
