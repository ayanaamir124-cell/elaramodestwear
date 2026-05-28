-- ═══════════════════════════════════════════════
-- ELARA MODEST WEAR — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  category TEXT DEFAULT 'Co-ord Sets',
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (key-value)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design Tokens (key-value)
CREATE TABLE IF NOT EXISTS design_tokens (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read design" ON design_tokens FOR SELECT USING (true);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('elara-images', 'elara-images', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'elara-images');
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'elara-images');
