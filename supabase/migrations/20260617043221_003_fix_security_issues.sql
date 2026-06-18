-- Fix 1: Function Search Path Mutable
-- Set immutable search_path on handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'registered'
  );
  RETURN NEW;
END;
$$;

-- Fix 2: Revoke EXECUTE on handle_new_user from anon and authenticated
-- This function should only be called by the auth trigger, not via REST RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Fix 3: RLS Policy Always True on contact_messages
-- Replace with policy that validates required fields are non-empty
DROP POLICY IF EXISTS contact_insert ON public.contact_messages;
DROP POLICY IF EXISTS insert_contact_messages ON public.contact_messages;
CREATE POLICY "contact_insert" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL
    AND trim(name) <> ''
    AND email IS NOT NULL
    AND trim(email) <> ''
    AND message IS NOT NULL
    AND trim(message) <> ''
  );

-- Fix 4: RLS Policy Always True on visitor_analytics
-- Replace with policy that validates page_path is non-empty
DROP POLICY IF EXISTS analytics_insert ON public.visitor_analytics;
DROP POLICY IF EXISTS insert_visitor_analytics ON public.visitor_analytics;
CREATE POLICY "analytics_insert" ON public.visitor_analytics
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    page_path IS NOT NULL
    AND trim(page_path) <> ''
  );

-- Fix 5: Public Bucket Allows Listing
-- Remove broad SELECT policies that allow listing all files
-- Public buckets serve objects via URL without needing SELECT policies
DROP POLICY IF EXISTS select_media_objects ON storage.objects;
DROP POLICY IF EXISTS media_bucket_read ON storage.objects;
