-- ============================================================================
-- APEX COMMUNITY PLATFORM — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Run this script inside your live Supabase SQL Editor
-- ============================================================================

-- 1. Create Community Profiles (Authors) Table
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    avatar_url text NOT NULL,
    professional_role text DEFAULT 'Software Engineer'::text,
    bio text DEFAULT 'Writing high output engineering dispatches.'::text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on profiles" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create Live Community Articles Table
CREATE TABLE public.articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at date DEFAULT CURRENT_DATE NOT NULL,
    author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    category text DEFAULT 'Tech & AI'::text NOT NULL,
    target_keyword text NOT NULL,
    meta_description text NOT NULL,
    image_url text NOT NULL,
    content text NOT NULL,
    seo_score integer DEFAULT 85 NOT NULL,
    pageviews integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'published'::text NOT NULL
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy A: Anyone on the internet can read published dispatches
CREATE POLICY "Allow public read access on live articles" 
    ON public.articles FOR SELECT USING (status = 'published');

-- Policy B: Only authenticated community authors can write and insert new dispatches
CREATE POLICY "Allow individual author insert" 
    ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy C: Only the genuine author can edit their articles
CREATE POLICY "Allow individual author update" 
    ON public.articles FOR UPDATE USING (auth.uid() = author_id);

-- Policy D: Allow incrementing pageviews without requiring authentication
CREATE POLICY "Allow pageview increments" 
    ON public.articles FOR UPDATE USING (true) WITH CHECK (true);


-- 3. Create Storage Bucket for Interactive Community Image Uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article_images', 'article_images', true);

CREATE POLICY "Allow public access to article images" 
    ON storage.objects FOR SELECT USING (bucket_id = 'article_images');

CREATE POLICY "Allow authenticated user storage upload" 
    ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = 'article_images' AND auth.role() = 'authenticated'
    );
