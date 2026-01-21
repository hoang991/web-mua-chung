
-- HƯỚNG DẪN:
-- 1. Vào trang quản trị Supabase > SQL Editor
-- 2. Chạy đoạn script này để tạo bảng và Storage

-- === PHẦN 1: TẠO BẢNG DỮ LIỆU ===
CREATE TABLE IF NOT EXISTS public.config (
    key TEXT PRIMARY KEY,
    value JSONB
);

CREATE TABLE IF NOT EXISTS public.pages (
    slug TEXT PRIMARY KEY,
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    type TEXT, -- 'blog' hoặc 'supplier'
    data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    type TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- === PHẦN 2: BẢO MẬT (RLS) ===
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Policy đơn giản cho phép đọc/ghi công khai (Cần siết chặt khi production)
CREATE POLICY "Public Access Config" ON public.config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Pages" ON public.pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Media" ON public.media FOR ALL USING (true) WITH CHECK (true);

-- === PHẦN 3: REALTIME ===
ALTER PUBLICATION supabase_realtime ADD TABLE public.config, public.pages, public.products, public.posts, public.submissions, public.media;

-- === PHẦN 4: STORAGE (LƯU ẢNH) ===
-- Tạo bucket 'images' nếu chưa có
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép xem ảnh công khai
CREATE POLICY "Public View Images" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- Cho phép upload ảnh (Tạm thời cho phép tất cả, nên giới hạn cho authenticated user)
CREATE POLICY "Public Upload Images" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );
CREATE POLICY "Public Delete Images" ON storage.objects FOR DELETE USING ( bucket_id = 'images' );
