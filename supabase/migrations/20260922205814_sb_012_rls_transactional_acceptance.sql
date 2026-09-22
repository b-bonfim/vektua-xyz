-- SB-012 transactional RLS acceptance: synthetic fixtures are rolled back inside a PL/pgSQL subtransaction.
-- Successful application means every assertion passed; no test catalogue rows persist.
DO $test$
DECLARE
  line_visible uuid := gen_random_uuid();
  line_inactive uuid := gen_random_uuid();
  product_visible uuid := gen_random_uuid();
  product_draft uuid := gen_random_uuid();
  product_suspended uuid := gen_random_uuid();
  product_hidden uuid := gen_random_uuid();
  product_inactive_line uuid := gen_random_uuid();
  variant_visible uuid := gen_random_uuid();
  variant_draft uuid := gen_random_uuid();
  got bigint;
BEGIN
  BEGIN
    INSERT INTO public.product_lines(id,slug,name,position,status) VALUES
      (line_visible,'sb012-test-active','SB012 synthetic active line',99991,'active'),
      (line_inactive,'sb012-test-inactive','SB012 synthetic inactive line',99992,'inactive');
    INSERT INTO public.products(id,sku,slug,product_line_id,name,status,visibility) VALUES
      (product_visible,'SB012TEST-PUBLIC','sb012-test-public',line_visible,'SB012 synthetic public','published','public'),
      (product_draft,'SB012TEST-DRAFT','sb012-test-draft',line_visible,'SB012 synthetic draft','draft','public'),
      (product_suspended,'SB012TEST-SUSP','sb012-test-susp',line_visible,'SB012 synthetic suspended','suspended','public'),
      (product_hidden,'SB012TEST-HIDDEN','sb012-test-hidden',line_visible,'SB012 synthetic hidden','published','hidden'),
      (product_inactive_line,'SB012TEST-LINE','sb012-test-line',line_inactive,'SB012 synthetic inactive line product','published','public');
    INSERT INTO public.product_variants(id,product_id,variant_sku,options,status) VALUES
      (variant_visible,product_visible,'SB012TEST-VAR-OK','{"color":"green"}'::jsonb,'active'),
      (variant_draft,product_visible,'SB012TEST-VAR-DRAFT','{"color":"red"}'::jsonb,'draft');
    INSERT INTO public.product_prices(product_id,variant_id,channel_code,currency_code,sale_unit,amount,status) VALUES
      (product_visible,NULL,'site','BRL','unidade',12.50,'active'),
      (product_draft,NULL,'site','BRL','unidade',11.50,'active'),
      (product_visible,NULL,'mercado_livre','BRL','unidade',22.50,'active'),
      (product_visible,variant_draft,'site','BRL','unidade',13.50,'active'),
      (product_inactive_line,NULL,'site','BRL','unidade',15.50,'active');
    INSERT INTO public.product_media(product_id,storage_bucket,storage_path,media_type,is_public,origin_reference) VALUES
      (product_visible,'private-evidence','sb012/private-reference.png','reference',false,NULL);
    INSERT INTO public.site_settings(key,value,value_type,is_public,is_critical) VALUES
      ('site.announcement_text','"SB012 synthetic public"'::jsonb,'text',true,false),
      ('site.whatsapp_default_message','"SB012 synthetic private"'::jsonb,'text',false,false);

    EXECUTE 'SET LOCAL ROLE anon';
    IF current_user <> 'anon' THEN RAISE EXCEPTION 'SB012 FAIL: role switch not anon'; END IF;
    SELECT count(*) INTO got FROM public.product_lines WHERE slug LIKE 'sb012-test-%';
    IF got <> 1 THEN RAISE EXCEPTION 'SB012 FAIL: active line visibility, got %',got; END IF;
    SELECT count(*) INTO got FROM public.products WHERE sku LIKE 'SB012TEST-%';
    IF got <> 1 THEN RAISE EXCEPTION 'SB012 FAIL: product published/public visibility, got %',got; END IF;
    SELECT count(*) INTO got FROM public.product_variants WHERE variant_sku LIKE 'SB012TEST-%';
    IF got <> 1 THEN RAISE EXCEPTION 'SB012 FAIL: active variant visibility, got %',got; END IF;
    SELECT count(*) INTO got FROM public.product_prices WHERE product_id IN (product_visible,product_draft,product_inactive_line);
    IF got <> 1 THEN RAISE EXCEPTION 'SB012 FAIL: only eligible site price visible, got %',got; END IF;
    SELECT count(*) INTO got FROM public.product_media WHERE product_id=product_visible;
    IF got <> 0 THEN RAISE EXCEPTION 'SB012 FAIL: private media visible'; END IF;
    SELECT count(*) INTO got FROM public.site_settings WHERE key LIKE 'site.%';
    IF got <> 1 THEN RAISE EXCEPTION 'SB012 FAIL: public setting visibility, got %',got; END IF;

    BEGIN
      EXECUTE 'INSERT INTO public.products DEFAULT VALUES';
      RAISE EXCEPTION 'SB012 FAIL: anon INSERT unexpectedly allowed';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    BEGIN
      EXECUTE 'UPDATE public.products SET name=name WHERE id=$1' USING product_visible;
      RAISE EXCEPTION 'SB012 FAIL: anon UPDATE unexpectedly allowed';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    BEGIN
      EXECUTE 'DELETE FROM public.products WHERE id=$1' USING product_visible;
      RAISE EXCEPTION 'SB012 FAIL: anon DELETE unexpectedly allowed';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    BEGIN
      EXECUTE 'SELECT origin_reference FROM public.product_media LIMIT 1';
      RAISE EXCEPTION 'SB012 FAIL: origin_reference unexpectedly exposed';
    EXCEPTION WHEN insufficient_privilege THEN NULL;
    END;
    RAISE EXCEPTION 'SB012_TEST_ROLLBACK';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'SB012_TEST_ROLLBACK' THEN
      RAISE NOTICE 'SB012_RLS_ACCEPTANCE_PASS: anon read filters and INSERT/UPDATE/DELETE/hidden-column denial; all synthetic rows rolled back';
    ELSE
      RAISE;
    END IF;
  END;
END;
$test$;