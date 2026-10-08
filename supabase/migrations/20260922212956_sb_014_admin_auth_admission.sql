-- SB-014 | Fail-closed, read-only administrative admission check.
-- Depends on SB-013 app_private.admin_role_assignments and auth.sessions.
-- No users, roles, catalog writes, public tables, or admin CRUD permissions are created.
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
         AND a.is_active IS TRUE
         AND a.role IN ('founder', 'admin', 'catalog_editor', 'operations', 'viewer')
    );
$fn$;
COMMENT ON FUNCTION public.can_access_admin() IS
  'SB-014: boolean admission for current verified JWT user AND live auth.sessions row AND active private role. Does not grant CRUD or expose private rows.';
REVOKE ALL ON FUNCTION public.can_access_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_admin() TO authenticated;
COMMIT;
