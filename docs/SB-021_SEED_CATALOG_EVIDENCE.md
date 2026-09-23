# SB-021 — Seed de linhas e produtos no Supabase

**Data:** 2026-09-23  
**Card:** `[SB-021][P0] Seedar linhas e produtos`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Repositório:** `b-bonfim/vektua-xyz`  
**Base da main:** `7e1ea4cbebb8a34060f852ddc7de57573c266ceb`  
**Branch:** `sb-021-seed-linhas-produtos-20260923`  
**GitHub Actions:** não utilizado.

## Escopo executado

O catálogo canônico do storefront foi lido a partir de `lib/commercial-catalog.ts` no commit-base acima. O seed cobre somente:

- `public.product_lines`;
- `public.products`.

Mídia, preços e variantes não fazem parte deste card.

## Fonte e projeção rastreável

Foi versionada a projeção dos campos efetivamente mapeados para o banco em:

`data/catalog/sb-021-seed-source.json`

Esse arquivo registra explicitamente a origem e **não substitui** os artefatos próprios de validação do SB-020.

Contagem da origem usada no seed:

- 4 linhas;
- 30 produtos;
- distribuição: Objetos & Colecionáveis = 4; Datas & Coleções = 2; Feitos para Você = 2; Chaveiros = 22;
- produtos personalizados = 2 (`CAN-PET-001` e `CAN-PESSOA-001`).

## Migration remota

Migration aplicada ao projeto compartilhado:

- version: `20260923131147`;
- name: `sb_021_seed_product_lines_products`;
- arquivo versionado: `supabase/migrations/20260923131147_sb_021_seed_product_lines_products.sql`.

A migration usa transação, `pg_advisory_xact_lock`, chaves naturais estáveis e `ON CONFLICT` para permitir reexecução controlada sem duplicar SKU/slug. Nenhum UUID gerado foi hardcoded.

**Desvio operacional reconciliado:** a aplicação remota ocorreu antes do arquivo ser gravado na branch. Antes do fechamento do card, o SQL correspondente foi capturado na migration versionada, a origem foi fixada ao commit-base e o conteúdo efetivamente persistido foi reconciliado por contagem e hash canônico. Não houve mudança de schema neste card.

## Estado inicial deliberadamente conservador

Todos os 30 produtos foram inseridos com:

- `status = 'draft'`;
- `visibility = 'hidden'`.

O seed não cria `publishable`, `published`, aprovação de Quality, liberação do Founder, licença, preço, mídia verificada ou disponibilidade comercial.

As quatro linhas foram registradas como `active` porque representam a arquitetura comercial vigente; isso não promove os produtos nelas contidos.

## Verificação pós-aplicação

Consulta direta ao Supabase após a migration:

- `product_lines = 4`;
- `products = 30`;
- `personalized = 2`;
- `draft + hidden = 30`;
- distribuição por linha: `objetos=4`, `datas=2`, `feitos=2`, `chaveiros=22`;
- produtos fora do estado inicial esperado: `0`.

Para detectar alteração silenciosa de qualquer campo material do seed, foi calculado hash canônico ordenado.

**Produtos — campos:** SKU, slug, linha, nome, descrição, coleção e personalized  
- hash esperado da origem: `71275752dfb0aa8fe576bcdf4a191c79`;
- hash lido do destino: `71275752dfb0aa8fe576bcdf4a191c79`;
- resultado: **MATCH**.

**Linhas — campos:** slug, nome, descrição, posição e status  
- hash esperado da origem: `e9cb844e4209455feb313b83f2805ee7`;
- hash lido do destino: `e9cb844e4209455feb313b83f2805ee7`;
- resultado: **MATCH**.

Isso comprova, no escopo do seed, preservação de slugs e descrições e classificação correta dos personalizados.

## Idempotência

A idempotência é garantida pela combinação de:

1. constraints `UNIQUE` já existentes em `product_lines.slug`, `products.sku` e `products.slug`;
2. `INSERT ... ON CONFLICT` por chave natural;
3. lock transacional do card;
4. ausência de inserts cegos ou UUIDs fixos.

Uma tentativa de replay via endpoint genérico `execute_sql` foi recusada pelo próprio conector por operar em transação somente leitura; não foi criada uma migration artificial de replay apenas para gerar evidência. O histórico remoto permanece limpo, com uma única migration SB-021.

## DoD

- [x] Quatro linhas comerciais vigentes representadas sem quota artificial de SKU.
- [x] Todos os 30 SKUs da origem possuem correspondência no destino.
- [x] Slugs preservados; hash canônico origem × destino confere.
- [x] Descrições preservadas; hash canônico origem × destino confere.
- [x] Produtos personalizados mantêm classificação correta (2/2).
- [x] Status inicial conservador: 30/30 em `draft/hidden`.
- [x] Seed controlado e sem duplicação por transação + lock + `ON CONFLICT` + uniques.

## Limites do aceite

SB-021 não comprova mídia no Storage, preço, variante, qualidade física, licença, direitos de terceiros, conformidade, disponibilidade ou publicação. Essas evidências pertencem a outros cards/gates.

O SB-020 mantém seu próprio histórico e critérios de aceite; esta entrega não o marca retroativamente como concluído.

## PR

Será preenchido no card Trello após criação/merge do PR desta branch.
