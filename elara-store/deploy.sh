#!/bin/bash
# ╔════════════════════════════════════════╗
# ║  ELARA STORE — ONE-COMMAND DEPLOY     ║
# ╚════════════════════════════════════════╝
echo ""
echo "🚀 ELARA STORE DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for git
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Install from git-scm.com"
    exit 1
fi

# Setup git
git init -q 2>/dev/null || true
git checkout -b main 2>/dev/null || git checkout main 2>/dev/null || true
git add -A
git commit -q -m "Elara Store $(date '+%Y-%m-%d')" 2>/dev/null || true

echo "📋 GitHub repo: https://github.com/ayanaamir124-cell/elarawear"
echo ""
echo "Enter your GitHub Personal Access Token"
echo "(Create: github.com → Settings → Developer Settings → Personal Access Tokens → Tokens Classic → New)"
echo "Required scopes: repo, workflow"
echo ""
read -s -p "Token (hidden): " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token entered"
    exit 1
fi

git remote remove origin 2>/dev/null || true
git remote add origin "https://ayanaamir124-cell:${TOKEN}@github.com/ayanaamir124-cell/elarawear.git"

echo ""
echo "⬆️  Pushing to GitHub..."
if git push -f origin main; then
    echo ""
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo "✅ Vercel is auto-deploying now..."
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "⚠️  FINAL STEP: Add these to Vercel:"
    echo "🔗 https://vercel.com/ayanaamir124-cells-projects/elarawear/settings/environment-variables"
    echo ""
    echo "  ADMIN_PASSWORD        → elara2026"
    echo "  JWT_SECRET            → $(openssl rand -hex 32)"
    echo "  NEXT_PUBLIC_SITE_URL  → https://elarawear.vercel.app"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Live in ~90 sec: https://elarawear.vercel.app"
    echo "🔐 Admin:           https://elarawear.vercel.app/admin"  
    echo "🔑 Password:        elara2026"
    echo "⌨️  Secret shortcut: Type 'elaraadmin' on any page"
else
    echo ""
    echo "❌ Push failed. Check your token and try again."
    echo "Make sure the token has 'repo' scope."
fi
