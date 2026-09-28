/**
 * Security & Secret Scanner Script
 * Developed by: Aashrith (Security, Testing & DevOps)
 */

const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  let foundSecrets = false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        if (scanDirectory(fullPath)) {
          foundSecrets = true;
        }
      }
    } else if (entry.isFile()) {
      // Check code files
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.js') || entry.name.endsWith('.env')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Check for real live API key formats
        if (content.includes('gsk_live_') || content.includes('hs_live_')) {
          console.error(`❌ [SECURITY ALERT] Hardcoded secret token found in: ${fullPath}`);
          foundSecrets = true;
        }
      }
    }
  }

  return foundSecrets;
}

console.log('🔒 Running SentinelMind Security & Secret Scan...');
const hasSecrets = scanDirectory(path.join(__dirname, '..', 'src'));

if (hasSecrets) {
  console.error('❌ Security check failed: One or more hardcoded secrets detected.');
  process.exit(1);
} else {
  console.log('✅ Security check passed: Zero hardcoded secrets found in codebase.');
  process.exit(0);
}
