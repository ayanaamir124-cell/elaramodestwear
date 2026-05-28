#!/bin/bash
set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     ELARA STORE — DEPLOY TO VERCEL           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Setting up Git...${NC}"
cd "$(dirname "$0")"
git init 2>/dev/null || true
git add -A
git commit -m "Elara Store - Complete with WordPress Admin" 2>/dev/null || true
git branch -M main 2>/dev/null || true

echo ""
echo -e "${BLUE}Step 2: Connecting to GitHub...${NC}"
echo "Repo: https://github.com/ayanaamir124-cell/elarawear"
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/ayanaamir124-cell/elarawear.git

echo ""
echo -e "${YELLOW}Enter your GitHub Personal Access Token:${NC}"
echo "(Create at: github.com → Settings → Developer Settings → Personal Access Tokens → Classic)"
read -s -p "Token: " GH_TOKEN
echo ""

git remote set-url origin "https://ayanaamir124-cell:${GH_TOKEN}@github.com/ayanaamir124-cell/elarawear.git"

echo -e "${BLUE}Step 3: Pushing to GitHub...${NC}"
git push -f origin main

echo ""
echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
echo -e "${GREEN}✅ Vercel will auto-deploy in 60-90 seconds!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Add these Environment Variables in Vercel:${NC}"
echo "Go to: https://vercel.com/ayanaamir124-cells-projects/elarawear/settings/environment-variables"
echo ""
echo "  ADMIN_PASSWORD        = elara2026 (change this!)"
echo "  JWT_SECRET            = $(openssl rand -base64 32)"
echo "  NEXT_PUBLIC_SITE_URL  = https://elarawear.vercel.app"
echo ""
echo "Optional (for real database):"
echo "  NEXT_PUBLIC_SUPABASE_URL      = from supabase.com"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY = from supabase.com"
echo "  SUPABASE_SERVICE_ROLE_KEY     = from supabase.com"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your live store: https://elarawear.vercel.app"
echo "🔐 Admin panel:     https://elarawear.vercel.app/admin"
echo "   Password:        elara2026"
echo "   Secret shortcut: Type 'elaraadmin' on any page"
echo ""
