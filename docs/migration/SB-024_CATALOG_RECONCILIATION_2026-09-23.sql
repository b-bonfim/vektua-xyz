-- SB-024 — catálogo origem × Supabase
-- Snapshot da origem: main @ b4224f41d07b2301e850ec95012cb08e8ab2864b
-- lib/commercial-catalog.ts blob 1091fd5a8681f94285e0d26e7c985965df3b3187
-- lib/catalog.ts blob 8ed9d6773c020511dbe19cb41a3e8a9e5fb08084
-- Gerado em 2026-09-23. Consulta somente leitura.
--
-- Regra de normalização de mídia:
--   /images/products/remix/<arquivo> (storefront)
--   -> <SKU>/<arquivo> (Storage/product_media)
-- Para produtos sem gallery explícita, image é tratado como galeria singleton.
-- Para Feitos para Você, commercial-catalog.ts remove a imagem conceitual por desenho.

with expected_products(sku, slug, line_slug) as (
  values
    ('CAN-PESSOA-001','can-pessoa-001','feitos'),
    ('CAN-PET-001','can-pet-001','feitos'),
    ('G-CHV-ABO-01','g-chv-abo-01','chaveiros'),
    ('G-CHV-ALI-01','g-chv-ali-01','chaveiros'),
    ('G-CHV-BLO-01','g-chv-blo-01','chaveiros'),
    ('G-CHV-CAV-01','g-chv-cav-01','chaveiros'),
    ('G-CHV-CRA-01','g-chv-cra-01','chaveiros'),
    ('G-CHV-ESQ-01','g-chv-esq-01','chaveiros'),
    ('G-CHV-ESQ-02','g-chv-esq-02','chaveiros'),
    ('G-CHV-FAN-01','g-chv-fan-01','chaveiros'),
    ('G-CHV-FAN-02','g-chv-fan-02','chaveiros'),
    ('G-CHV-FAN-03','g-chv-fan-03','chaveiros'),
    ('G-CHV-GAT-01','g-chv-gat-01','chaveiros'),
    ('G-CHV-JJ-01','g-chv-jj-01','chaveiros'),
    ('G-CHV-LOB-01','g-chv-lob-01','chaveiros'),
    ('G-CHV-MAO-01','g-chv-mao-01','chaveiros'),
    ('G-CHV-MAS-01','g-chv-mas-01','chaveiros'),
    ('G-CHV-MAS-02','g-chv-mas-02','chaveiros'),
    ('G-CHV-MED-01','g-chv-med-01','chaveiros'),
    ('G-CHV-MON-01','g-chv-mon-01','chaveiros'),
    ('G-CHV-MUM-01','g-chv-mum-01','chaveiros'),
    ('G-CHV-MUM-02','g-chv-mum-02','chaveiros'),
    ('G-CHV-PAL-01','g-chv-pal-01','chaveiros'),
    ('G-CHV-POL-01','g-chv-pol-01','chaveiros'),
    ('G-ORG-HS-01','g-org-hs-01','objetos'),
    ('G-ORG-RC-01','g-org-rc-01','objetos'),
    ('G-VAS-ESC-01','g-vas-esc-01','objetos'),
    ('G-VAS-MIN-01','g-vas-min-01','objetos'),
    ('S-HAL-DEC-01','s-hal-dec-01','datas'),
    ('S-NAT-PRE-01','s-nat-pre-01','datas')
),
expected_media(sku, gallery_position, storage_path, is_primary) as (
  values
    ('G-CHV-ABO-01',0,'G-CHV-ABO-01/G-CHV-ABO-01_REMIX.webp',true),
    ('G-CHV-ALI-01',0,'G-CHV-ALI-01/G-CHV-ALI-01_REMIX.png',true),
    ('G-CHV-BLO-01',0,'G-CHV-BLO-01/G-CHV-BLO-01_REMIX.png',true),
    ('G-CHV-CAV-01',0,'G-CHV-CAV-01/G-CHV-CAV-01_REMIX.png',true),
    ('G-CHV-CRA-01',0,'G-CHV-CRA-01/G-CHV-CRA-01_REMIX.webp',true),
    ('G-CHV-ESQ-01',0,'G-CHV-ESQ-01/G-CHV-ESQ-01_REMIX.webp',true),
    ('G-CHV-ESQ-02',0,'G-CHV-ESQ-02/G-CHV-ESQ-02_REMIX.webp',true),
    ('G-CHV-FAN-01',0,'G-CHV-FAN-01/G-CHV-FAN-01_REMIX.webp',true),
    ('G-CHV-FAN-02',0,'G-CHV-FAN-02/G-CHV-FAN-02_REMIX.webp',true),
    ('G-CHV-FAN-03',0,'G-CHV-FAN-03/G-CHV-FAN-03_REMIX.webp',true),
    ('G-CHV-GAT-01',0,'G-CHV-GAT-01/G-CHV-GAT-01_REMIX.png',true),
    ('G-CHV-JJ-01',0,'G-CHV-JJ-01/G-CHV-JJ-01_REMIX.webp',true),
    ('G-CHV-JJ-01',1,'G-CHV-JJ-01/G-CHV-JJ-01_REMIX_02.webp',false),
    ('G-CHV-JJ-01',2,'G-CHV-JJ-01/G-CHV-JJ-01_REMIX_03.webp',false),
    ('G-CHV-LOB-01',0,'G-CHV-LOB-01/G-CHV-LOB-01_REMIX.webp',true),
    ('G-CHV-MAO-01',0,'G-CHV-MAO-01/G-CHV-MAO-01_REMIX.png',true),
    ('G-CHV-MAS-01',0,'G-CHV-MAS-01/G-CHV-MAS-01_REMIX.png',true),
    ('G-CHV-MAS-02',0,'G-CHV-MAS-02/G-CHV-MAS-02_REMIX.png',true),
    ('G-CHV-MED-01',0,'G-CHV-MED-01/G-CHV-MED-01_REMIX.webp',true),
    ('G-CHV-MON-01',0,'G-CHV-MON-01/G-CHV-MON-01_REMIX.png',true),
    ('G-CHV-MUM-01',0,'G-CHV-MUM-01/G-CHV-MUM-01_REMIX.png',true),
    ('G-CHV-MUM-02',0,'G-CHV-MUM-02/G-CHV-MUM-02_REMIX.webp',true),
    ('G-CHV-PAL-01',0,'G-CHV-PAL-01/G-CHV-PAL-01_REMIX.png',true),
    ('G-CHV-POL-01',0,'G-CHV-POL-01/G-CHV-POL-01_REMIX.png',true),
    ('G-ORG-HS-01',0,'G-ORG-HS-01/G-ORG-HS-01_REMIX.webp',true),
    ('G-ORG-HS-01',1,'G-ORG-HS-01/G-ORG-HS-01_REMIX_02.webp',false),
    ('G-ORG-HS-01',2,'G-ORG-HS-01/G-ORG-HS-01_REMIX_03.webp',false),
    ('G-ORG-RC-01',0,'G-ORG-RC-01/G-ORG-RC-01_REMIX.webp',true),
    ('G-VAS-ESC-01',0,'G-VAS-ESC-01/G-VAS-ESC-01_REMIX.webp',true),
    ('G-VAS-MIN-01',0,'G-VAS-MIN-01/G-VAS-MIN-01_REMIX.webp',true),
    ('S-HAL-DEC-01',0,'S-HAL-DEC-01/S-HAL-DEC-01_REMIX.webp',true),
    ('S-HAL-DEC-01',1,'S-HAL-DEC-01/S-HAL-DEC-01_REMIX_02.webp',false),
    ('S-HAL-DEC-01',2,'S-HAL-DEC-01/S-HAL-DEC-01_REMIX_03.webp',false),
    ('S-HAL-DEC-01',3,'S-HAL-DEC-01/S-HAL-DEC-01_REMIX_04.webp',false),
    ('S-NAT-PRE-01',0,'S-NAT-PRE-01/S-NAT-PRE-01_REMIX.webp',true),
    ('S-NAT-PRE-01',1,'S-NAT-PRE-01/S-NAT-PRE-01_REMIX_02.webp',false),
    ('S-NAT-PRE-01',2,'S-NAT-PRE-01/S-NAT-PRE-01_REMIX_03.webp',false)
),
actual_products as (
  select p.sku, p.slug, pl.slug as line_slug
  from public.products p
  join public.product_lines pl on pl.id = p.product_line_id
),
actual_media as (
  select p.sku, pm.gallery_position, pm.storage_path, pm.is_primary
  from public.product_media pm
  join public.products p on p.id = pm.product_id
),
mismatches as (
  select 'missing_sku'::text as kind, e.sku, e.slug as source_value, null::text as destination_value
  from expected_products e
  left join actual_products a using (sku)
  where a.sku is null

  union all
  select 'extra_sku', a.sku, null, a.slug
  from actual_products a
  left join expected_products e using (sku)
  where e.sku is null

  union all
  select 'slug_mismatch', e.sku, e.slug, a.slug
  from expected_products e
  join actual_products a using (sku)
  where e.slug is distinct from a.slug

  union all
  select 'line_mismatch', e.sku, e.line_slug, a.line_slug
  from expected_products e
  join actual_products a using (sku)
  where e.line_slug is distinct from a.line_slug

  union all
  select
    'missing_media',
    e.sku,
    e.gallery_position::text || '|' || e.storage_path || '|primary=' || e.is_primary::text,
    null
  from expected_media e
  left join actual_media a
    on a.sku=e.sku
   and a.gallery_position=e.gallery_position
   and a.storage_path=e.storage_path
   and a.is_primary=e.is_primary
  where a.sku is null

  union all
  select
    'extra_media',
    a.sku,
    null,
    a.gallery_position::text || '|' || a.storage_path || '|primary=' || a.is_primary::text
  from actual_media a
  left join expected_media e
    on e.sku=a.sku
   and e.gallery_position=a.gallery_position
   and e.storage_path=a.storage_path
   and e.is_primary=a.is_primary
  where e.sku is null
)
select jsonb_build_object(
  'source_product_count', (select count(*) from expected_products),
  'destination_product_count', (select count(*) from actual_products),
  'source_media_count', (select count(*) from expected_media),
  'destination_media_count', (select count(*) from actual_media),
  'source_products_with_media', (select count(distinct sku) from expected_media),
  'destination_products_with_media', (select count(distinct sku) from actual_media),
  'mismatch_count', (select count(*) from mismatches),
  'mismatches', coalesce((select jsonb_agg(to_jsonb(m) order by m.kind,m.sku) from mismatches m), '[]'::jsonb)
) as reconciliation;
