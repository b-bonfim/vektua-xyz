-- SB-014 forward-fix: any role assignment write advances updated_at (SB-013 audit trigger).
-- Administrative sessions created before the most recent role update cannot regain
-- access after disable -> re-enable. New sign-in AFTER the update is required.
-- This check does not delete an Auth session or revoke unrelated Supabase access.
BEGIN;
CREATE OR REPLACE FUNCTION public.can_access_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $fn$
  SELECT auth.uid() IS NOT NULL
    AND NULLIF(auth.jwt() ->> 'session_id', '') IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM app_private.admin_role_assignments a
      JOIN auth.sessions s ON s.user_id = a.user_id
      WHERE a.user_id = auth.uid()
        AND s.id::text = (auth.jwt() ->> 'session_id')
        AND (s.not_after IS NULL OR s.not_after > now())
        AND s.created_at > a.updated_at
        AND a.is_active IS TRUE
        AND a.role IN ('founder', 'admin', 'catalog_editor', 'operations', 'viewer')
    );
$fn$;
COMMENT ON FUNCTION public.can_access_admin() IS
  'SB-014 forward fix: user + live session + active private role, and session CREATED AFTER last role update; stale sessions cannot regain admin privilege after role restoration. Boolean only; no grants to tables.';
REVOKE ALL ON FUNCTION public.can_access_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_admin() TO authenticated;
COMMIT;
