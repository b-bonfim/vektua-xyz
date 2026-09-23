-- SB-016 | Create the public commercial-media bucket (not customer uploads).
-- Only public REMIX catalog images may be placed here; see SB-010 for database rules.
-- Creation via storage.buckets is supported by the Supabase Creating Buckets guide.
-- No storage.objects SELECT/INSERT/UPDATE/DELETE policy is created here:
-- public buckets serve public URLs without an object SELECT policy; all writes
-- remain restricted to authorized project operators / trusted server credentials.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-media',
  'product-media',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp']::text[]
);
