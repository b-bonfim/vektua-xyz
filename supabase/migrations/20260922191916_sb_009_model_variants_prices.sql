-- SB-009 — optional variants and channel-aware prices.
-- Depends on 20260922190558_sb_008_create_products.
-- No product, variant, price, or fictitious seed is inserted.
-- RLS/grants for browser roles remain closed until SB-012.

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update restrict on delete restrict,
  variant_sku text not null,
  label text,
  options jsonb not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_variant_sku_key unique (variant_sku),
  constraint product_variants_id_product_id_key unique (id, product_id),
  constraint product_variants_product_options_key unique (product_id, options),
  constraint product_variants_sku_nonempty check (length(btrim(variant_sku)) > 0),
  constraint product_variants_label_nonempty_when_present check (label is null or length(btrim(label)) > 0),
  constraint product_variants_options_object_nonempty check (
    jsonb_typeof(options) = 'object' and options <> '{}'::jsonb
  ),
  constraint product_variants_status_check check (status in ('draft', 'active', 'inactive')),
  constraint product_variants_timestamps_check check (updated_at >= created_at)
);

create index product_variants_product_id_idx
  on public.product_variants (product_id);

alter table public.product_variants enable row level security;
revoke all on table public.product_variants from anon, authenticated;

comment on table public.product_variants is
  'Optional product options. A product without variants has no row here. Status is not a commercial or compliance approval.';
comment on column public.product_variants.options is
  'JSON object with explicit option name/value pairs (e.g. {"cor":"preto","tamanho":"P"}); no arbitrary price fields.';

create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update restrict on delete restrict,
  variant_id uuid,
  channel_code text not null,
  currency_code text not null,
  sale_unit text not null,
  amount numeric(12,2),
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_prices_variant_product_fkey foreign key (variant_id, product_id)
    references public.product_variants (id, product_id) on update restrict on delete restrict,
  constraint product_prices_channel_format check (channel_code ~ '^[a-z][a-z0-9_]*$'),
  constraint product_prices_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint product_prices_sale_unit_format check (sale_unit ~ '^[a-z][a-z0-9_]*$'),
  constraint product_prices_amount_positive_when_present check (amount is null or amount > 0),
  constraint product_prices_status_check check (status in ('draft', 'active', 'inactive')),
  constraint product_prices_active_requires_amount check (status <> 'active' or amount is not null),
  constraint product_prices_timestamps_check check (updated_at >= created_at)
);

-- A single base (non-variant) price per product/channel; NULL must not bypass uniqueness.
create unique index product_prices_base_channel_key
  on public.product_prices (product_id, channel_code)
  where variant_id is null;

-- Each variant has its own channel-specific price without duplicating the product.
create unique index product_prices_variant_channel_key
  on public.product_prices (variant_id, channel_code)
  where variant_id is not null;

create index product_prices_product_id_idx
  on public.product_prices (product_id);

alter table public.product_prices enable row level security;
revoke all on table public.product_prices from anon, authenticated;

comment on table public.product_prices is
  'Explicit prices by product or variant and transaction channel. No seed, zero default, approval, publication, or price calculation is implied.';
comment on column public.product_prices.variant_id is
  'NULL means base product price; non-NULL variant must belong to the same product_id.';
comment on column public.product_prices.channel_code is
  'Explicit transaction channel code, e.g. site or mercado_livre; not a rigid channel enum.';
comment on column public.product_prices.currency_code is
  'Required ISO-style three-letter uppercase currency code. There is intentionally no default.';
comment on column public.product_prices.sale_unit is
  'Required sale unit code such as unidade or kit; not inferred from product description.';
comment on column public.product_prices.amount is
  'Nullable for unknown price. Missing price stays NULL; zero and negative prices are rejected.';
comment on column public.product_prices.status is
  'Draft by default. Active is application state only, not evidence of Founder approval, margin, legal compliance or publication.';
