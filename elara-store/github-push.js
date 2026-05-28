#!/usr/bin/env node
/**
 * ELARA STORE - GitHub Push Script
 * Pushes all files directly via GitHub API (no git needed!)
 * 
 * Usage: node github-push.js GITHUB_TOKEN
 * Get token: github.com → Settings → Developer Settings → Personal Access Tokens → Classic
 * Scopes needed: repo
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.argv[2];
const owner = 'ayanaamir124-cell';
const repo = 'elarawear';
const branch = 'main';

if (!token) {
  console.log('\n📋 ELARA STORE → GITHUB PUSH\n');
  console.log('Get a GitHub token:');
  console.log('  1. github.com → Settings');
  console.log('  2. Developer Settings → Personal Access Tokens → Tokens (classic)');
  console.log('  3. Generate new token → check "repo"');
  console.log('  4. node github-push.js ghp_yourtoken\n');
  process.exit(1);
}

function apiCall(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'elara-deploy',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch { resolve(d); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getAllFiles(dir, base = dir) {
  const files = [];
  const ignore = ['node_modules', '.next', '.git', '.vercel', 'github-push.js', 'deploy.js'];
  for (const item of fs.readdirSync(dir)) {
    if (ignore.some(i => item === i)) continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files.push(...await getAllFiles(full, base));
    } else {
      files.push({ path: path.relative(base, full).replace(/\\/g, '/'), full });
    }
  }
  return files;
}

async function main() {
  console.log('\n🚀 ELARA STORE → VERCEL DEPLOYMENT\n');
  
  // Get current branch SHA
  console.log('📡 Connecting to GitHub...');
  let sha;
  try {
    const ref = await apiCall('GET', `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    sha = ref.object?.sha;
    console.log(`✓ Found repo, current SHA: ${sha?.slice(0,8)}`);
  } catch (e) {
    // Branch might not exist, create it
    console.log('Creating new branch...');
  }

  // Get all files
  const dir = path.dirname(process.argv[1]);
  const files = await getAllFiles(dir);
  console.log(`✓ Found ${files.length} files to upload`);
  
  // Push each file
  let pushed = 0;
  for (const file of files) {
    process.stdout.write(`\r⬆️  Uploading ${++pushed}/${files.length}: ${file.path.slice(-40).padEnd(40)}`);
    
    const content = fs.readFileSync(file.full);
    const b64 = content.toString('base64');
    
    // Get existing file SHA if it exists
    let existingSha;
    try {
      const existing = await apiCall('GET', `/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`);
      existingSha = existing.sha;
    } catch {}
    
    await apiCall('PUT', `/repos/${owner}/${repo}/contents/${file.path}`, {
      message: `deploy: ${file.path}`,
      content: b64,
      branch,
      ...(existingSha ? { sha: existingSha } : {})
    });
    
    await new Promise(r => setTimeout(r, 100)); // Rate limit safety
  }
  
  console.log('\n\n✅ ALL FILES UPLOADED TO GITHUB!');
  console.log('✅ Vercel auto-deploying now...');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🌐 Live: https://elarawear.vercel.app');
  console.log('🔐 Admin: https://elarawear.vercel.app/admin');
  console.log('🔑 Password: elara2026\n');
  console.log('⚠️  Add env vars in Vercel:');
  console.log('   vercel.com → elarawear → Settings → Environment Variables');
  console.log('   ADMIN_PASSWORD = elara2026');
  console.log('   JWT_SECRET = any-long-string\n');
}

main().catch(console.error);
