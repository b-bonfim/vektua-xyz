-- SB-007 — canonical product lines
-- Remote Supabase migration version: 20260922185539
-- Policies/grants are intentionally deferred to SB-012.
-- Re-execution fails safely because CREATE TABLE is intentionally not IF NOT EXISTS.

create table public.product_lines (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text,
  position integer not null,
  status text not null default 'active',

  constraint product_lines_slug_key unique (slug),
  constraint product_lines_slug_nonempty check (length(btrim(slug)) > 0),
  constraint product_lines_slug_format check (
    slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint product_lines_name_nonempty check (length(btrim(name)) > 0),
  constraint product_lines_position_nonnegative check (position >= 0),
  constraint product_lines_status_check check (status in ('active', 'inactive'))
);

create index product_lines_position_idx
  on public.product_lines (position, slug);

alter table public.product_lines enable row level security;

comment on table public.product_lines is
  'Canonical commercial product lines for Vektua XYZ. Public access policies are defined separately in SB-012.';

comment on column public.product_lines.position is
  'Explicit storefront/admin ordering; lower values sort first.';

comment on column public.product_lines.status is
  'Lifecycle switch for a line: active or inactive. Deactivation preserves history.';
