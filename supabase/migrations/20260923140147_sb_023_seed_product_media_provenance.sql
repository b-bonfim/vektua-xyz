-- SB-023: populate product_media from the verified SB-022 Storage batch.
-- Source bytes/provenance: Git snapshot b17dbb1ff6b1a352801b75bb02ac4de99f461700
-- Storage schema is queried read-only; no storage metadata is mutated.

with candidates as (
  select
    p.id as product_id,
    p.name as product_name,
    o.bucket_id as storage_bucket,
    o.name as storage_path,
    split_part(o.name, '/', 2) as filename,
    coalesce(
      (substring(split_part(o.name, '/', 2) from '_REMIX_([0-9]{2})\.')::int - 1),
      0
    ) as gallery_position
  from storage.objects o
  join public.products p
    on p.sku = split_part(o.name, '/', 1)
  where o.bucket_id = 'product-media'
    and array_length(string_to_array(o.name, '/'), 1) = 2
    and split_part(o.name, '/', 2) ~* ('^' || p.sku || '_REMIX(_[0-9]{2})?\.(png|webp)$')
)
insert into public.product_media (
  product_id,
  storage_bucket,
  storage_path,
  media_type,
  alt_text,
  gallery_position,
  is_primary,
  is_public,
  file_state,
  origin_reference,
  source_media_id
)
select
  c.product_id,
  c.storage_bucket,
  c.storage_path,
  'remix',
  c.product_name ||
    case
      when c.gallery_position = 0 then ''
      else ' — imagem ' || (c.gallery_position + 1)::text
    end,
  c.gallery_position,
  c.gallery_position = 0,
  true,
  'verified',
  'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:public/images/products/remix/' || c.filename,
  null
from candidates c
on conflict (product_id, storage_bucket, storage_path) do nothing;

do $$
declare
  v_storage_count integer;
  v_candidate_count integer;
  v_candidate_products integer;
  v_seed_count integer;
  v_missing_object integer;
  v_bad_type integer;
  v_bad_order integer;
  v_bad_primary integer;
  v_bad_public integer;
begin
  select count(*)
    into v_storage_count
  from storage.objects
  where bucket_id = 'product-media';

  select count(*), count(distinct p.id)
    into v_candidate_count, v_candidate_products
  from storage.objects o
  join public.products p
    on p.sku = split_part(o.name, '/', 1)
  where o.bucket_id = 'product-media'
    and array_length(string_to_array(o.name, '/'), 1) = 2
    and split_part(o.name, '/', 2) ~* ('^' || p.sku || '_REMIX(_[0-9]{2})?\.(png|webp)$');

  select count(*)
    into v_seed_count
  from public.product_media
  where origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%';

  select count(*)
    into v_missing_object
  from public.product_media pm
  left join storage.objects o
    on o.bucket_id = pm.storage_bucket
   and o.name = pm.storage_path
  where pm.origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
    and o.id is null;

  select count(*)
    into v_bad_type
  from public.product_media
  where origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
    and (
      media_type <> 'remix'
      or file_state <> 'verified'
      or origin_reference is null
    );

  select count(*)
    into v_bad_order
  from (
    select
      product_id,
      count(*) as n,
      min(gallery_position) as min_pos,
      max(gallery_position) as max_pos,
      count(distinct gallery_position) as distinct_pos
    from public.product_media
    where origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
    group by product_id
  ) x
  where min_pos <> 0
     or max_pos <> n - 1
     or distinct_pos <> n;

  select count(*)
    into v_bad_primary
  from (
    select
      product_id,
      count(*) filter (where is_primary) as primary_count,
      count(*) filter (where is_primary and gallery_position = 0) as primary_at_zero
    from public.product_media
    where origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
    group by product_id
  ) x
  where primary_count <> 1
     or primary_at_zero <> 1;

  select count(*)
    into v_bad_public
  from public.product_media
  where origin_reference like 'git:b17dbb1ff6b1a352801b75bb02ac4de99f461700:%'
    and (
      is_public is not true
      or alt_text is null
      or gallery_position is null
    );

  if v_storage_count <> 37 then
    raise exception 'SB-023 expected 37 product-media objects, found %', v_storage_count;
  end if;

  if v_candidate_count <> 37 or v_candidate_products <> 28 then
    raise exception 'SB-023 candidate mismatch: rows %, products %', v_candidate_count, v_candidate_products;
  end if;

  if v_seed_count <> 37 then
    raise exception 'SB-023 seeded row mismatch: expected 37, found %', v_seed_count;
  end if;

  if v_missing_object <> 0 then
    raise exception 'SB-023 missing Storage objects: %', v_missing_object;
  end if;

  if v_bad_type <> 0 then
    raise exception 'SB-023 provenance/type mismatch rows: %', v_bad_type;
  end if;

  if v_bad_order <> 0 then
    raise exception 'SB-023 gallery order mismatch products: %', v_bad_order;
  end if;

  if v_bad_primary <> 0 then
    raise exception 'SB-023 primary image mismatch products: %', v_bad_primary;
  end if;

  if v_bad_public <> 0 then
    raise exception 'SB-023 public readiness mismatch rows: %', v_bad_public;
  end if;
end
$$;
