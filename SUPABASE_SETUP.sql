
-- ==================================================================================
-- DATABASE SETUP INSTRUCTIONS
-- 1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gpwzkrlubuigqmwhbyxv
-- 2. Select "SQL Editor" from the left menu.
-- 3. Paste this entire content and click "RUN" (bottom right).
-- ==================================================================================

-- 1. CREATE DATA TABLES (If not exists)
-- Config Table (Global website settings)
CREATE TABLE IF NOT EXISTS public.config (
    key TEXT PRIMARY KEY,
    value JSONB
);

-- Pages Table (Static pages content: Home, About...)
CREATE TABLE IF NOT EXISTS public.pages (
    slug TEXT PRIMARY KEY,
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Posts Table (Blog & Supplier posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    type TEXT, -- 'blog' or 'supplier'
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Submissions Table (Registration Forms)
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    type TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Media Table (Image Library)
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SECURITY SETTINGS (ROW LEVEL SECURITY - RLS)
-- Enable RLS for all tables
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Drop old policies (to avoid duplicates if re-running)
DROP POLICY IF EXISTS "Public Read Config" ON public.config;
DROP POLICY IF EXISTS "Admin Write Config" ON public.config;
DROP POLICY IF EXISTS "Public Read Pages" ON public.pages;
DROP POLICY IF EXISTS "Admin Write Pages" ON public.pages;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Admin Write Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Posts" ON public.posts;
DROP POLICY IF EXISTS "Admin Write Posts" ON public.posts;
DROP POLICY IF EXISTS "Admin Read Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Insert Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Read Media" ON public.media;
DROP POLICY IF EXISTS "Admin Write Media" ON public.media;

-- CREATE NEW POLICIES:
-- Rule: Everyone can read, but only Authenticated Admins can write/edit.

-- Config
CREATE POLICY "Public Read Config" ON public.config FOR SELECT USING (true);
CREATE POLICY "Admin Write Config" ON public.config FOR ALL USING (auth.role() = 'authenticated');

-- Pages
CREATE POLICY "Public Read Pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admin Write Pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');

-- Products
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin Write Products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Posts
CREATE POLICY "Public Read Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admin Write Posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated');

-- Submissions (Forms)
-- Form: Guests can Insert (Submit), Admins can Manage (All)
CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Submissions" ON public.submissions FOR ALL USING (auth.role() = 'authenticated');

-- Media
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admin Write Media" ON public.media FOR ALL USING (auth.role() = 'authenticated');


-- 3. ENABLE REALTIME (CRITICAL)
-- Allows Supabase to send update signals to the website when data changes
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.config, public.pages, public.products, public.posts, public.submissions, public.media;


-- 4. STORAGE CONFIGURATION (IMAGE UPLOAD)
-- Create 'images' bucket to store files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Everyone can view images
CREATE POLICY "Public View Images" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- Only Authenticated Admins can upload/update/delete images
CREATE POLICY "Admin Upload Images" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Update Images" ON storage.objects FOR UPDATE WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Delete Images" ON storage.objects FOR DELETE USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
