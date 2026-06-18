-- Fix: Revoke EXECUTE on handle_new_user from PUBLIC
-- The previous REVOKE from anon/authenticated didn't work because
-- the default grant is to PUBLIC which both roles inherit
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- Grant back only to the roles that need it (postgres superuser for trigger execution)
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Clean up duplicate storage policies for media bucket
-- Keep the ones named insert_media_objects / update_media_objects / delete_media_objects
-- Remove the older media_bucket_* duplicates
DROP POLICY IF EXISTS media_bucket_delete ON storage.objects;
DROP POLICY IF EXISTS media_bucket_update ON storage.objects;
DROP POLICY IF EXISTS media_bucket_upload ON storage.objects;
