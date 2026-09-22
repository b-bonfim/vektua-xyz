-- SB-012 / Vektua XYZ: catalogue API access is explicit, read-only and fail-closed.
-- Apply after SB-007 through SB-011. No seed, admin access or Storage policy is added.
DO $guard$
BEGIN
  IF (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p')) <> 6 THEN
    RAISE EXCEPTION 'SB-012: public table inventory changed; review every exposed table before applying';
  END IF;
  IF EXISTS (SELECT 1 FROM (VALUES ('product_lines'),('products'),('product_variants'),('product_prices'),('product_media'),('site_settings')) AS expected(name) WHERE to_regclass('public.' || expected.name) IS NULL) THEN
    RAISE EXCEPTION 'SB-012: expected schema table missing';
  END IF;
END;
$guard$;

ALTER TABLE public.product_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Eliminate pre-existing broad default grants, notably product_lines INSERT/UPDATE/DELETE.
-- Preserve the internal postgres/service_role privileges and the pre-existing site_settings policy.
REVOKE ALL ON TABLE public.product_lines, public.products, public.product_variants,
  public.product_prices, public.product_media, public.site_settings
  FROM PUBLIC, anon, authenticated;

CREATE POLICY product_lines_public_read ON public.product_lines
  FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY products_public_read ON public.products
  FOR SELECT TO anon, authenticated USING (
    status = 'published' AND visibility = 'public'
    AND EXISTS (SELECT 1 FROM public.product_lines AS line
      WHERE line.id = product_line_id AND line.status = 'active')
  );
CREATE POLICY product_variants_public_read ON public.product_variants
  FOR SELECT TO anon, authenticated USING (
    status = 'active'
    AND EXISTS (SELECT 1 FROM public.products AS product
      WHERE product.id = product_id AND product.status = 'published'
        AND product.visibility = 'public')
  );
CREATE POLICY product_prices_site_public_read ON public.product_prices
  FOR SELECT TO anon, authenticated USING (
    status = 'active' AND amount IS NOT NULL AND amount > 0
    AND channel_code = 'site'
    AND EXISTS (SELECT 1 FROM public.products AS product
      WHERE product.id = product_id AND product.status = 'published'
        AND product.visibility = 'public')
    AND (variant_id IS NULL OR EXISTS (
      SELECT 1 FROM public.product_variants AS variant
      WHERE variant.id = variant_id AND variant.product_id = product_id
        AND variant.status = 'active'
    ))
  );
CREATE POLICY product_media_public_remix_read ON public.product_media
  FOR SELECT TO anon, authenticated USING (
    is_public = true AND file_state = 'verified'
    AND media_type = 'remix' AND storage_bucket = 'product-media'
    AND EXISTS (SELECT 1 FROM public.products AS product
      WHERE product.id = product_id AND product.status = 'published'
        AND product.visibility = 'public')
  );
-- site_settings_storefront_public_read from SB-011 already restricts is_public=true.

GRANT SELECT (id,slug,name,description,position,status)
  ON public.product_lines TO anon, authenticated;
GRANT SELECT (id,sku,slug,product_line_id,name,description,collection,category,personalized,status,visibility)
  ON public.products TO anon, authenticated;
GRANT SELECT (id,product_id,variant_sku,label,options,status)
  ON public.product_variants TO anon, authenticated;
GRANT SELECT (id,product_id,variant_id,channel_code,currency_code,sale_unit,amount,status)
  ON public.product_prices TO anon, authenticated;
GRANT SELECT (id,product_id,storage_bucket,storage_path,media_type,alt_text,gallery_position,is_primary)
  ON public.product_media TO anon, authenticated;
GRANT SELECT (key,value,value_type)
  ON public.site_settings TO anon, authenticated;

COMMENT ON POLICY product_lines_public_read ON public.product_lines IS 'SB-012: only active lines; visitor cannot write.';
COMMENT ON POLICY products_public_read ON public.products IS 'SB-012: only published and public products belonging to active lines; state is not a Founder approval.';
COMMENT ON POLICY product_variants_public_read ON public.product_variants IS 'SB-012: active options of storefront-visible products only.';
COMMENT ON POLICY product_prices_site_public_read ON public.product_prices IS 'SB-012: active site prices with actual positive amount and eligible variant; other channel prices stay private.';
COMMENT ON POLICY product_media_public_remix_read ON public.product_media IS 'SB-012: published product REMIX references only; internal origin_reference and source_media_id have no browser SELECT grants; object delivery is separately controlled by SB-016.';