-- SB-023 — read-only reconciliation queries
-- Project: tbffwwjqkusiupahjqux
-- Date: 2026-09-23

with batch as (
  select
    pm.*,
    p.sku,
    p.name as product_name,
    p.status as product_status,
    p.visibility as product_visibility,
    o.id as storage_object_id
  from public.product_media pm
  join public.products p on p.id = pm.product_id
  left join storage.objects o
    on o.bucket_id = pm.storage_bucket
   and o.name = pm.storage_path
  where pm.origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
),
per_product as (
  select
    product_id,
    sku,
    count(*) as media_count,
    min(gallery_position) as min_position,
    max(gallery_position) as max_position,
    count(*) filter (where is_primary) as primary_count,
    count(*) filter (where is_primary and gallery_position = 0) as primary_at_zero
  from batch
  group by product_id, sku
)
select jsonb_build_object(
  'rows', (select count(*) from batch),
  'products_with_media', (select count(distinct product_id) from batch),
  'storage_objects_missing', (select count(*) from batch where storage_object_id is null),
  'rows_without_product_id', (select count(*) from public.product_media where product_id is null),
  'remix_rows', (select count(*) from batch where media_type = 'remix'),
  'concept_rows', (select count(*) from batch where media_type = 'concept'),
  'reference_rows', (select count(*) from batch where media_type = 'reference'),
  'real_photo_rows', (select count(*) from batch where media_type = 'real_photo'),
  'verified_rows', (select count(*) from batch where file_state = 'verified'),
  'public_intent_rows', (select count(*) from batch where is_public),
  'primary_rows', (select count(*) from batch where is_primary),
  'bad_origin', (select count(*) from batch where origin_reference is null or media_type <> 'remix'),
  'bad_gallery', (
    select count(*)
    from per_product
    where min_position <> 0
       or max_position <> media_count - 1
       or primary_count <> 1
       or primary_at_zero <> 1
  ),
  'orphan_storage_objects', (
    select count(*)
    from storage.objects o
    left join public.products p on p.sku = split_part(o.name, '/', 1)
    left join public.product_media pm
      on pm.storage_bucket = o.bucket_id
     and pm.storage_path = o.name
    where o.bucket_id = 'product-media'
      and (p.id is null or pm.id is null)
  ),
  'published_public_products_with_media', (
    select count(distinct product_id)
    from batch
    where product_status = 'published'
      and product_visibility = 'public'
  ),
  'products_without_media', (
    select count(*)
    from public.products p
    where not exists (
      select 1 from public.product_media pm where pm.product_id = p.id
    )
  )
) as reconciliation;

select
  p.sku,
  count(*) as media_count,
  min(pm.gallery_position) as min_position,
  max(pm.gallery_position) as max_position,
  count(*) filter (where pm.is_primary) as primary_count
from public.product_media pm
join public.products p on p.id = pm.product_id
where pm.origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
group by p.sku
order by p.sku;

select p.sku
from public.products p
where not exists (
  select 1 from public.product_media pm where pm.product_id = p.id
)
order by p.sku;
