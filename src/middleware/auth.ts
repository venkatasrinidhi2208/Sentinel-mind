/**
 * Authentication & Security Middleware
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

import { Request, Response, NextFunction } from 'express';

export function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Allow public access to GET routes & static frontend assets
  if (req.method === 'GET' || req.path.startsWith('/public') || !req.path.startsWith('/api')) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  const configuredSecret = process.env.API_KEY_SECRET || 'sentinel-mind-secure-dev-key';

  // In production mode, require valid header or dev key fallback
  if (process.env.NODE_ENV === 'production') {
    if (apiKey !== configuredSecret && authHeader !== `Bearer ${configuredSecret}`) {
      res.status(401).json({ error: 'Unauthorized: Invalid or missing API key token.' });
      return;
    }
  }

  next();
}
