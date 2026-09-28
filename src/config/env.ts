/**
 * Environment Configuration Security Check
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

export interface AppConfig {
  port: number;
  environment: string;
  corsOrigin: string;
  apiKeySecret: string;
  defaultAiProvider: string;
  hindsightTenantId: string;
}

export function validateEnvironment(): AppConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const environment = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const apiKeySecret = process.env.API_KEY_SECRET || 'sentinel-mind-secure-dev-key';
  const defaultAiProvider = process.env.DEFAULT_AI_PROVIDER || 'mock';
  const hindsightTenantId = process.env.HINDSIGHT_TENANT_ID || 'sentinel-mind-sre-tenant';

  // Security warning check for committed secrets
  if (apiKeySecret.includes('12345') || apiKeySecret === 'secret') {
    console.warn('⚠️ [SECURITY WARNING] Insecure API_KEY_SECRET detected in configuration!');
  }

  return {
    port,
    environment,
    corsOrigin,
    apiKeySecret,
    defaultAiProvider,
    hindsightTenantId,
  };
}
