-- SB-009 forward-fix: cover composite FK identified by Supabase Performance Advisor.
-- Append-only change; prior migration is immutable and remains reproducible.
create index product_prices_variant_product_fk_idx
  on public.product_prices (variant_id, product_id)
  where variant_id is not null;