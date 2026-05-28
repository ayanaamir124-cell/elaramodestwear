# 🌸 Elara Modest Wear — Complete E-Commerce Store

A premium Next.js 14 e-commerce store with a **WordPress-level hidden admin panel**.

## 🚀 Deploy in 2 Minutes

### Option A: One Command (Recommended)
```bash
bash DEPLOY_NOW.sh
```
Follow the prompts — done!

### Option B: Manual Steps
```bash
git init
git add .
git commit -m "Elara Store"
git branch -M main
git remote add origin https://github.com/ayanaamir124-cell/elarawear.git
git push -f origin main
```

## 🔐 Admin Panel (HIDDEN from public)

| | |
|---|---|
| **URL** | `elarawear.vercel.app/admin` |
| **Default Password** | `elara2026` |
| **Secret Shortcut** | Type `elaraadmin` on any page |
| **Indexed by Google?** | ❌ No — `noindex,nofollow` |
| **Visible in navbar?** | ❌ No — completely hidden |
| **Visible in footer?** | ❌ No — completely hidden |

## ⚙️ Environment Variables (add in Vercel Dashboard)

```env
ADMIN_PASSWORD=elara2026           # Change to something secure!
JWT_SECRET=any-long-random-string
NEXT_PUBLIC_SITE_URL=https://elarawear.vercel.app

# Optional — for real database (get from supabase.com free):
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 🎛️ Admin Panel Features

### Design Studio
- **Typography** — Sliders for H1/H2/H3/body font sizes, weights, letter spacing
- **Colors** — Color pickers for every brand color + live preview
- **Spacing & Layout** — Section padding, card padding, grid gaps, border radius, max width

### Page Editor
- **Hero Section** — Headline, subtitle, image upload, button text
- **Page Sections** — Show/hide stats, style guide, testimonials sections
- **Stats Editor** — Edit all 4 stat numbers and labels
- **Footer** — Tagline, store name

### Store Management
- **Products** — Add, edit, delete with image upload (4 images per product)
- **Orders** — View all orders, update status (pending/confirmed/shipped/completed/cancelled)
- **Settings** — Email, WhatsApp, Instagram, address, free shipping threshold
- **Media Library** — View all images, click to copy URL

## 📦 Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Design**: Cormorant Garamond + Jost fonts
- **State**: Zustand (cart) + React hooks
- **Backend**: Supabase (PostgreSQL + Storage)
- **Auth**: JWT cookies (7-day session)
- **Deploy**: Vercel (free tier)

## 🗄️ Database Setup (Optional)

1. Create free account at [supabase.com](https://supabase.com)
2. New Project → Open SQL Editor
3. Paste contents of `supabase/schema.sql` → Run
4. Copy API keys → Add to Vercel environment variables
5. Redeploy

*The store works without Supabase using built-in default data.*
