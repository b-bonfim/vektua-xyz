-- SB-010: schema only; no bucket, uploads, seed, storefront publication or public grants.
-- Storage metadata is read-only: object existence is checked, never modified here.
create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update restrict on delete restrict,
  storage_bucket text not null,
  storage_path text not null,
  media_type text not null,
  alt_text text,
  gallery_position integer,
  is_primary boolean not null default false,
  is_public boolean not null default false,
  file_state text not null default 'pending',
  origin_reference text,
  source_media_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_media_id_product_unique unique (id, product_id),
  constraint product_media_source_same_product_fk foreign key (source_media_id, product_id)
    references public.product_media (id, product_id) on update restrict on delete restrict,
  constraint product_media_file_per_product_unique unique (product_id, storage_bucket, storage_path),
  constraint product_media_bucket_nonempty check (length(btrim(storage_bucket)) > 0),
  constraint product_media_path_safe check (
    length(btrim(storage_path)) > 0
    and storage_path = btrim(storage_path)
    and storage_path !~ '(^/|//|(^|/)\.\.?(/|$)|[?#!])'
    and storage_path !~ '^[[:alpha:]][[:alnum:]+.-]*://'
  ),
  constraint product_media_type_check check (media_type in ('real_photo', 'remix', 'concept', 'reference')),
  constraint product_media_alt_nonempty check (alt_text is null or length(btrim(alt_text)) > 0),
  constraint product_media_gallery_position_check check (gallery_position is null or gallery_position >= 0),
  constraint product_media_state_check check (file_state in ('pending', 'verified', 'missing')),
  constraint product_media_origin_nonempty check (origin_reference is null or length(btrim(origin_reference)) > 0),
  constraint product_media_remix_origin_required check (media_type <> 'remix' or origin_reference is not null),
  constraint product_media_source_not_self check (source_media_id is null or source_media_id <> id),
  constraint product_media_public_bucket_remix_only check (storage_bucket <> 'product-media' or media_type = 'remix'),
  constraint product_media_noncommercial_not_gallery check (
    media_type not in ('reference', 'concept') or (gallery_position is null and not is_primary and not is_public)
  ),
  constraint product_media_public_readiness check (
    not is_public or (
      storage_bucket = 'product-media'
      and media_type = 'remix'
      and file_state = 'verified'
      and alt_text is not null
      and gallery_position is not null
    )
  ),
  constraint product_media_primary_requires_public check (not is_primary or is_public),
  constraint product_media_timestamps_order check (updated_at >= created_at)
);

create unique index product_media_product_position_unique
  on public.product_media (product_id, gallery_position)
  where gallery_position is not null;
create unique index product_media_one_primary_per_product
  on public.product_media (product_id) where is_primary;
create index product_media_source_product_idx
  on public.product_media (source_media_id, product_id) where source_media_id is not null;

-- Fail closed at publication time: a database flag cannot create a Storage object.
create function public.product_media_require_existing_public_object()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.is_public and not exists (
    select 1 from storage.objects as o
    where o.bucket_id = new.storage_bucket and o.name = new.storage_path
  ) then
    raise exception using errcode = '23514',
      message = 'Cannot publish media: matching Storage object does not exist or is not visible to the writer';
  end if;
  return new;
end;
$$;

revoke all on function public.product_media_require_existing_public_object()
  from public, anon, authenticated;

create trigger product_media_require_existing_public_object_trg
before insert or update of is_public, storage_bucket, storage_path, file_state
on public.product_media
for each row execute function public.product_media_require_existing_public_object();

alter table public.product_media enable row level security;
revoke all on table public.product_media from anon, authenticated;

comment on table public.product_media is
  'SB-010 SKU-linked media with explicit origin, gallery order and publication intent. No public API access until SB-012. Storage buckets follow SB-016/017/018.';
comment on column public.product_media.media_type is
  'real_photo, remix, concept or reference; only REMIX assets can be marked public under the current Founder site directive.';
comment on column public.product_media.origin_reference is
  'Restricted source provenance (e.g., original asset identifier); mandatory for remix. Never expose this internal field in anonymous projections.';
comment on column public.product_media.source_media_id is
  'Optional same-product original/media lineage. RESTRICT prevents deleting an asset while referenced as a source.';
comment on column public.product_media.file_state is
  'Operator-reconciled pending/verified/missing state. Never substitutes for live Storage object existence checks at render or upload time.';
comment on column public.product_media.is_public is
  'Publication intent only; product gates, RLS, public bucket, current object existence and site cutover are separate requirements.';
comment on column public.product_media.gallery_position is
  'Zero-based deterministic gallery order; unique per product when present. NULL means not assigned to gallery.';
comment on column public.product_media.is_primary is
  'At most one primary/public gallery image per product, enforced by partial unique index.';
