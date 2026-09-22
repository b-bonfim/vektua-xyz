# SB-009 — Relatório de evidências e DoD

**Data:** 22/09/2026 (horário de referência: Brasília)  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Cartão:** https://trello.com/c/ffnNniYi  
**Dependência SB-008:** https://trello.com/c/1Q6Mqbn1 — concluída.  
**Branch:** `sb-009-variants-prices` · **Base inicial da main:** `ea944802dcd35cbc7e3e5cb3c16cb0ab8c122cc7`  
**PR:** https://github.com/b-bonfim/vektua-xyz/pull/32  
**Migrations remotas aplicadas (histórico consultado após cada DDL):**
- `20260922191916_sb_009_model_variants_prices` — primeira migration, sucesso retornado pelo conector.
- `20260922191959_sb_009_index_variant_product_fk` — forward-fix de índice de FK composta, sucesso retornado pelo conector.

**SQL versionado:**
- [`supabase/migrations/20260922191916_sb_009_model_variants_prices.sql`](../supabase/migrations/20260922191916_sb_009_model_variants_prices.sql)
- [`supabase/migrations/20260922191959_sb_009_index_variant_product_fk.sql`](../supabase/migrations/20260922191959_sb_009_index_variant_product_fk.sql)

**Tipos TypeScript:** `lib/supabase/database.types.ts`, atualizado na branch a partir dos tipos gerados pelo conector Supabase para o projeto após as migrations.  
**Documentação:** `docs/SB-009_VARIANTS_PRICES.md`.

## Conferências remotas executadas

1. `list_migrations`: versões SB-007, SB-008, SB-009 (duas) presentes, na ordem indicada.
2. `list_tables(verbose=true)`: `product_variants` e `product_prices` presentes, ambas RLS habilitada e `rows=0`. `products` e `product_lines` preservadas.
3. `information_schema.columns`: `variant_id` anulável; `amount numeric` anulável e sem default; `currency_code`, `sale_unit` e `channel_code` obrigatórios e sem default; `status` nasce `draft`.
4. `pg_constraint`: unicidade de SKU e opções por produto; FK de variante para produto; FK composta `(variant_id, product_id)`; checks de moeda/unidade/canal, quantidade não monetária, valor positivo/NULL, status e `active` exige valor.
5. `pg_indexes`: índices únicos parciais de preço-base `(product_id,channel_code) WHERE variant_id IS NULL` e variante `(variant_id,channel_code) WHERE variant_id IS NOT NULL` presentes; índice adicional `(variant_id,product_id)` observado.
6. `information_schema.role_table_grants`: **0 linhas** para privilégios de `anon` ou `authenticated` nas duas novas tabelas.
7. `pg_policies`: **0 linhas** nas duas tabelas, intencional até SB-012; `pg_class.relrowsecurity` confirmou `true` nas duas.
8. `SELECT COUNT(*)`: `product_variants=0`, `product_prices=0`; nenhuma seed aplicada.

## Casos exclusivamente fictícios / de teste

Um `SELECT` usando CTE `VALUES` sem INSERT avaliou **a expressão das constraints**, retornando:

| Caso | Passa checks? | Interpretação |
|---|---|---|
| `unknown_price`: `amount NULL`, `draft` | true | Valor desconhecido preservado como ausência, não zero. |
| `positive_test_value`: `amount 12.34`, `draft` | true | Exemplo numérico estritamente fictício: não cadastrado. |
| `zero_rejected`: `amount 0`, `draft` | false | Zero não satisfaz expressão de check. |
| `active_without_price_rejected`: `amount NULL`, `active` | false | Preço ativo sem valor não satisfaz check. |
| `invalid_currency_rejected`: `brl` minúsculo | false | Exige código maiúsculo. |

**Precisão do escopo de testes:** essas cinco linhas foram avaliadas por SELECT, não inseridas. A presença efetiva das constraints foi verificada no catálogo do Postgres. Não foram realizados INSERTs/ROLLBACK em transação, testes de violações por DML, build local nem checkout ponta a ponta; não promover esses itens a PASS. A ausência de CLI/local runner não impede verificar a modelagem e o DoD específico do cartão, mas tais testes devem ocorrer nas etapas de integração/QA.

## Advisors depois das alterações

**Security Advisor** em 22/09/2026 19:19:45Z: apenas INFO `rls_enabled_no_policy` em `product_lines`, `products`, `product_variants` e `product_prices`. As duas novas tabelas mantêm RLS e nenhum grant de browser; policy/grant deliberadamente no SB-012. Referência de remediação: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy.

**Performance Advisor inicial** em 19:19:49Z: INFO `unindexed_foreign_keys` para `product_prices_variant_product_fkey` (além de INFO `unused_index`). A correção foi aplicada como migration incremental `20260922191959`, sem editar a anterior. **Performance Advisor posterior**, 19:20:45Z: alerta de FK não indexada ausente; somente INFO `unused_index` (seis índices de quatro tabelas atualmente vazias). Referência: https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys e https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index.

## Matriz de DoD do cartão

| Critério | Resultado | Prova |
|---|---|---|
| Variantes por produto sem obrigatoriedade | ATENDIDO estruturalmente | `products` sem FK obrigatória para variante, `product_variants.product_id` FK; tabela vazia. |
| Preço fora de texto descritivo | ATENDIDO | tabela `product_prices`, sem coluna `price` em `products`. |
| Preço futuro por canal sem duplicar produto | ATENDIDO | `channel_code`, FK produto/variante, índices únicos parciais. |
| Moeda e unidade explícitas | ATENDIDO | `currency_code` e `sale_unit` NOT NULL/sem default com checks. |
| Ausente não vira zero | ATENDIDO no schema | `amount` nullable, sem default; zero rejeitado; integração ainda não desenvolvida. |
| Nenhum seed de preço fictício | ATENDIDO | migrations sem DML; contagem remota zero; exemplo em CTE somente leitura. |
| Migration + casos fictícios | ATENDIDO | 2 arquivos SQL versionados + casos fictícios acima. |

**Conclusão delimitada:** DoD estrutural do SB-009 atendido; nada aqui indica preço aprovado, publicação, faturamento, regularização ou lançamento. O projeto permanece sem seed/cutover. A aplicação remota foi reconciliada em arquivos de migration com os mesmos SQL e versões conferidas no histórico.

## Trabalho restante por owner

- **Engineering — SB-012:** criar e testar grants/policies RLS de leitura autorizada e escrita administrativa com testes positivos e negativos antes de expor API.
- **Engineering — integração posterior:** mapear seleção de variante, consulta de preços por canal, ausência de preços e testes DML/integrados.
- **Finance + Founder — gate econômico/comercial separado:** apurar custos, tributos e preços reais por SKU×canal, aprovar valores e conservar evidência; não é resultado deste card.
- **Quality/Founder:** gates de direitos, conformidade, produto e lançamento permanecem independentes.
- **Impeccable:** não acionado para alteração de interface porque este card é exclusivamente de schema e documentos.

**Recuperação:** migrations remotas imutáveis; mudanças posteriores exclusivamente via nova migration forward-fix. Não executar drop nem rollback destrutivo em produção. **GitHub Actions:** nenhum workflow criado, executado ou reexecutado neste trabalho.
