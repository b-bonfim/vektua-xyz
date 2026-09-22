-- SB-013 | Administrative role foundation. No accounts, assignments, admin grants,
-- catalog writes, Auth hook, or admin route is enabled by this migration.
-- Depends on SB-012. app_private is NOT an exposed Data API schema.
BEGIN;

CREATE SCHEMA app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated;

CREATE TABLE app_private.admin_role_assignments (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CONSTRAINT admin_role_assignments_role_check
    CHECK (role IN ('founder', 'admin', 'catalog_editor', 'operations', 'viewer')),
  is_active boolean NOT NULL DEFAULT false,
  change_reference text NOT NULL CHECK (length(btrim(change_reference)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE app_private.admin_role_assignments IS
  'SB-013: private, default-inactive, one role per real auth user. Operator-provisioned only after authorization; no browser grants or admin write policies.';
COMMENT ON COLUMN app_private.admin_role_assignments.change_reference IS
  'Required non-empty decision/ticket reference for operator provisioning, revocation and edits; no secrets or customer data.';
ALTER TABLE app_private.admin_role_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE app_private.admin_role_audit (
  event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_user_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_role text,
  new_role text,
  old_active boolean,
  new_active boolean,
  change_reference text,
  actor_auth_uid uuid,
  actor_session_role text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE app_private.admin_role_audit IS
  'SB-013: append-only application audit of assignment changes; DB owner/superuser can still bypass this control. Not a legal immutable ledger.';
ALTER TABLE app_private.admin_role_audit ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION app_private.record_admin_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $fn$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.updated_at := now();
    INSERT INTO app_private.admin_role_audit
      (subject_user_id, action, new_role, new_active, change_reference, actor_auth_uid, actor_session_role)
    VALUES (NEW.user_id, TG_OP, NEW.role, NEW.is_active, NEW.change_reference, auth.uid(), session_user);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
    INSERT INTO app_private.admin_role_audit
      (subject_user_id, action, old_role, new_role, old_active, new_active,
       change_reference, actor_auth_uid, actor_session_role)
    VALUES (NEW.user_id, TG_OP, OLD.role, NEW.role, OLD.is_active, NEW.is_active,
            NEW.change_reference, auth.uid(), session_user);
    RETURN NEW;
  ELSE
    INSERT INTO app_private.admin_role_audit
      (subject_user_id, action, old_role, old_active, change_reference, actor_auth_uid, actor_session_role)
    VALUES (OLD.user_id, TG_OP, OLD.role, OLD.is_active, OLD.change_reference, auth.uid(), session_user);
    RETURN OLD;
  END IF;
END;
$fn$;
CREATE TRIGGER admin_role_change_audit
  BEFORE INSERT OR UPDATE OR DELETE ON app_private.admin_role_assignments
  FOR EACH ROW EXECUTE FUNCTION app_private.record_admin_role_change();

-- This is an internal authorization building block for a future reviewed RLS
-- migration. There is intentionally NO EXECUTE/USAGE grant to browser roles.
CREATE FUNCTION app_private.has_admin_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $fn$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM app_private.admin_role_assignments a
      WHERE a.user_id = auth.uid()
        AND a.is_active = true
        AND a.role = ANY (allowed_roles)
    );
$fn$;
COMMENT ON FUNCTION app_private.has_admin_role(text[]) IS
  'SB-013: checks current Auth UID against private ACTIVE assignment; no public/browser EXECUTE grant yet. Future admin RLS must grant narrowly and test.';

REVOKE ALL ON ALL TABLES IN SCHEMA app_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA app_private FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION app_private.record_admin_role_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION app_private.has_admin_role(text[]) FROM PUBLIC, anon, authenticated;
COMMIT;
