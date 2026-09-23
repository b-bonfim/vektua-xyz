# SB-025 — SupabaseCatalogRepository

**Data:** 23/09/2026  
**Card:** [SB-025][P0] Implementar `SupabaseCatalogRepository`  
**Owner:** Engineering  
**Restrição:** GitHub Actions não é utilizado.

## Objetivo

Implementar o adapter Supabase atrás do contrato `CatalogRepository` criado no SB-006, sem alterar ainda a fonte ativa do storefront. O switch de runtime continua reservado ao SB-026.

## Desenho

`SupabaseCatalogRepository` implementa:

- `listProducts(query?)`;
- `getProductBySlug(slug)`;
- `getLines()`.

A leitura pública usa exclusivamente o cliente Supabase com `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Nenhuma chave `service_role` é usada.

## Segurança da projeção pública

Além das políticas RLS existentes, o adapter aplica filtros explícitos:

- produto: `status=published` e `visibility=public`;
- linha: `status=active`;
- mídia: `is_public=true`, `file_state=verified`, `media_type=remix` e bucket `product-media`.

O adapter não seleciona `origin_reference` nem `source_media_id` na projeção pública.

## Mapeamento

- O ID público do produto permanece o SKU (`products.sku`), preservando o contrato e o comportamento de `excludeProductId`.
- `products.id` (UUID) é usado apenas internamente para relações e mídia.
- A mídia é ordenada deterministicamente por `gallery_position`, depois `storage_path` e `id`.
- `is_primary` define `image`; a primeira mídia ordenada é fallback.
- URLs de mídia são derivadas com `storage.from(bucket).getPublicUrl(path)`.
- `getProductBySlug` usa `maybeSingle()` e retorna `null` para slug vazio ou ausência, sem transformar not-found em exception.

## Tipos

Os clientes Supabase passam a usar `SupabaseClient<Database>`. O arquivo `lib/supabase/database.types.ts` é sincronizado com o schema remoto vigente gerado pelo Supabase.

Os tipos de tabela ficam internos ao adapter. A fronteira pública continua retornando apenas `CatalogProduct` e `CatalogLine`.

## Escopo deliberadamente não alterado

Este card não:

- ativa `CATALOG_SOURCE=supabase`;
- adapta componentes/rotas para o fluxo assíncrono;
- publica produtos;
- altera RLS;
- executa cutover;
- libera SKU comercialmente.

Esses passos pertencem aos cards posteriores do cronograma.

## Verificação reproduzível

`scripts/tests/supabase-catalog-repository.mjs` valida estruturalmente contrato, filtros, ordenação, not-found, ausência de service-role e sincronização de tipos. Quando as duas variáveis públicas do Supabase são fornecidas, o mesmo script executa probes de leitura pública contra o projeto remoto.

Comando:

```bash
node scripts/tests/supabase-catalog-repository.mjs
```

A validação TypeScript deve ser executada separadamente com:

```bash
npx tsc --noEmit
```
