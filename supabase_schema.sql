-- Existing contact messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to messages"
ON messages FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow read messages for authenticated admin"
ON messages FOR SELECT TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- ============================================================================
-- Portfolio CMS Tables (Admin editable via /admin)
-- NOTE: Replace 'gowthamrajb.dev@gmail.com' below if you use a different email
-- in Supabase Authentication -> Users, and disable public signups in Auth settings.
-- ============================================================================

-- 1. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    date TEXT NOT NULL,
    skills TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certifications"
ON certifications FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin write certifications"
ON certifications FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech TEXT[] NOT NULL DEFAULT '{}',
    architecture_image TEXT DEFAULT '',
    architecture_alt TEXT DEFAULT '',
    github TEXT DEFAULT '',
    demo TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects"
ON projects FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin write projects"
ON projects FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_name TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read skills"
ON skills FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin write skills"
ON skills FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- 4. Experience
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    period TEXT NOT NULL,
    bullets TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read experiences"
ON experiences FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin write experiences"
ON experiences FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- 5. Site Settings (single key-value map for Hero / Contact / Resume text)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
ON site_settings FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin write site_settings"
ON site_settings FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com');

-- ============================================================================
-- Storage bucket for uploaded certificates (PDF/PNG) & project diagrams
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read portfolio-assets"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin upload portfolio-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'portfolio-assets'
    AND auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com'
);

CREATE POLICY "Admin update portfolio-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'portfolio-assets'
    AND auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com'
);

CREATE POLICY "Admin delete portfolio-assets"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'portfolio-assets'
    AND auth.jwt() ->> 'email' = 'gowthamrajb.dev@gmail.com'
);
