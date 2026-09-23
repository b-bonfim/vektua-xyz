BEGIN;
-- SB-018: private evidence boundary. No public exposure or storefront integration.
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false);

-- SB-013's self-only role check is exposed solely for evaluating Storage RLS.
-- No access to app_private tables/sequences is granted to browser roles.
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_admin_role(text[]) TO authenticated;

-- Metadata visibility only for active Founder/Admin with a fresh Auth session.
CREATE POLICY sb018_evidence_bucket_admin_select
ON storage.buckets FOR SELECT TO authenticated
USING (
  id = 'evidence'
  AND (SELECT public.can_access_admin())
  AND (SELECT app_private.has_admin_role(ARRAY['founder','admin']::text[]))
);

CREATE POLICY sb018_evidence_object_admin_select
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'evidence'
  AND (SELECT public.can_access_admin())
  AND (SELECT app_private.has_admin_role(ARRAY['founder','admin']::text[]))
);

-- Enforce opaque filenames and bounded, typed prefixes; never include names/emails.
CREATE POLICY sb018_evidence_object_admin_insert
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'evidence'
  AND (SELECT public.can_access_admin())
  AND (SELECT app_private.has_admin_role(ARRAY['founder','admin']::text[]))
  AND name ~ '^(gates|tests|qa)/[A-Za-z0-9_-]{1,64}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{1,8}$'
);
-- No UPDATE/DELETE policies: evidence is append-only to browser roles;
-- future retention and disposal require a separate reviewed policy/procedure.
COMMIT;
