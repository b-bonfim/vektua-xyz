-- SB-008 — canonical products
-- Policies/grants are intentionally deferred to SB-012.
-- RLS is enabled from creation to avoid an unsecured exposure window.
-- Re-execution fails safely because CREATE TABLE is intentionally not IF NOT EXISTS.

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null,
  slug text not null,
  product_line_id uuid not null references public.product_lines(id) on update restrict on delete restrict,
  name text not null,
  description text,
  collection text,
  category text,
  personalized boolean not null default false,
  status text not null default 'draft',
  visibility text not null default 'hidden',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_sku_key unique (sku),
  constraint products_slug_key unique (slug),
  constraint products_sku_nonempty check (length(btrim(sku)) > 0),
  constraint products_slug_nonempty check (length(btrim(slug)) > 0),
  constraint products_slug_format check (
    slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint products_name_nonempty check (length(btrim(name)) > 0),
  constraint products_description_nonempty_when_present check (
    description is null or length(btrim(description)) > 0
  ),
  constraint products_collection_nonempty_when_present check (
    collection is null or length(btrim(collection)) > 0
  ),
  constraint products_category_nonempty_when_present check (
    category is null or length(btrim(category)) > 0
  ),
  constraint products_status_check check (
    status in ('draft', 'publishable', 'published', 'suspended')
  ),
  constraint products_visibility_check check (
    visibility in ('hidden', 'public', 'unlisted')
  ),
  constraint products_timestamps_order_check check (updated_at >= created_at)
);

create index products_product_line_id_idx
  on public.products (product_line_id);

create index products_status_idx
  on public.products (status);

alter table public.products enable row level security;

revoke all on table public.products from anon, authenticated;

comment on table public.products is
  'Canonical products for Vektua XYZ. Lifecycle status is application state and does not represent commercial/gate approval.';

comment on column public.products.product_line_id is
  'Primary commercial line. The referenced line is protected from deletion while products depend on it.';

comment on column public.products.status is
  'Application lifecycle: draft, publishable, published, suspended. It does not infer Founder, Quality, legal, pricing, or launch approval.';

comment on column public.products.visibility is
  'Storefront visibility intent: hidden, public, unlisted. Effective anonymous access is controlled separately by grants and RLS policies in SB-012.';

comment on column public.products.updated_at is
  'Last-update timestamp. Automatic maintenance is an application/admin responsibility until a dedicated trigger is introduced and versioned.';
