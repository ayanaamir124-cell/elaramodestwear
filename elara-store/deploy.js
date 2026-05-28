#!/usr/bin/env node
/**
 * ELARA STORE - AUTOMATED VERCEL DEPLOYMENT
 * Run: node deploy.js YOUR_VERCEL_TOKEN
 * Get token: https://vercel.com/account/tokens -> Create Token
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token = process.argv[2];

if (!token) {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    ELARA STORE — VERCEL DEPLOYMENT           ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log('Usage: node deploy.js YOUR_VERCEL_TOKEN\n');
  console.log('Get your token:');
  console.log('  1. Go to https://vercel.com/account/tokens');
  console.log('  2. Click "Create Token"');
  console.log('  3. Name it "elara-deploy"');
  console.log('  4. Copy the token');
  console.log('  5. Run: node deploy.js <paste-token-here>\n');
  process.exit(1);
}

// Write token to vercel auth
const authDir = path.join(process.env.HOME || process.env.USERPROFILE, '.local', 'share', 'com.vercel.cli');
fs.mkdirSync(authDir, { recursive: true });
fs.writeFileSync(path.join(authDir, 'auth.json'), JSON.stringify({ token }));

console.log('\n🚀 ELARA STORE DEPLOYMENT\n');
console.log('✓ Token configured');

try {
  console.log('✓ Building project...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✓ Build complete');
  
  console.log('⬆️  Deploying to Vercel...');
  const result = execSync(
    `vercel deploy --prod --yes --token ${token} --cwd .`,
    { stdio: 'pipe', encoding: 'utf8' }
  );
  
  const url = result.trim().split('\n').filter(l => l.includes('vercel.app') || l.includes('http')).pop() || result.trim();
  
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║            ✅ DEPLOYED LIVE!                 ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log('🌐 Store:  https://elarawear.vercel.app');
  console.log('🔐 Admin:  https://elarawear.vercel.app/admin');
  console.log('🔑 Pass:   elara2026\n');
  console.log('⚠️  Add these env vars in Vercel Dashboard:');
  console.log('   ADMIN_PASSWORD = elara2026');
  console.log('   JWT_SECRET = any-random-long-string');
  console.log('   NEXT_PUBLIC_SITE_URL = https://elarawear.vercel.app\n');
} catch (err) {
  console.error('\n❌ Deploy failed:', err.message);
  console.log('\nManual option:');
  console.log(`  vercel deploy --prod --token ${token}`);
}
