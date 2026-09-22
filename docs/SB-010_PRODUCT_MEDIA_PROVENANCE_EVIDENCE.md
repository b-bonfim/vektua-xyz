# SB-010 — Evidências de modelagem de mídia e proveniência

**Data da execução:** 2026-09-22 (America/Sao_Paulo) · **Card:** `[SB-010][P0] Modelar mídia e proveniência` · **Owner técnico:** Engineering; revisão de privacidade delimitada: Quality.

**Ambiente remoto inspecionado:** Supabase `tbffwwjqkusiupahjqux`, PostgreSQL 17.6.1. **Base Git:** `main` SHA `8f3cf39a720ff083dacc03bd655831b17591be7b`. **Branch:** `feat/sb-010-product-media-provenance`.

**Migration registrada no Supabase:** `20260922193533_sb_010_model_product_media_provenance` (`apply_migration` success=true; confirmada por `list_migrations`). **Arquivo versionado de mesmo nome:** `supabase/migrations/20260922193533_sb_010_model_product_media_provenance.sql`.

**Observação de protocolo:** excepcionalmente, a aplicação MCP no ambiente remoto ocorreu antes do arquivo Git ser criado; o SQL aplicado foi então transcrito integralmente no arquivo de migration com o timestamp real retornado pelo histórico, para reconciliar o drift. CLI local `supabase` não estava instalada neste ambiente; não houve geração de nome por CLI nem reprodução local completa. NÃO reescrever a migration aplicada; recomenda-se conferência de checksum e reconstrução limpa no ambiente local no próximo ciclo antes do cutover. O protocolo `docs/SUPABASE_MIGRATION_PROTOCOL.md` prevê migration versionada antes da aplicação: esta inversão está explicitamente registrada, não escondida.

## DoD do card — evidência concreta

| Critério | Resultado estrutural observado | Limite |
|---|---|---|
| `product_media` FK para produto | **CONFIRMADO** `product_media_product_id_fkey` para `products(id)` com RESTRICT e `product_id NOT NULL`. | DML FK negativo não executado. |
| `storage_path`, tipo, alt, posição, principal/secundária | **CONFIRMADO** colunas `storage_bucket`, `storage_path`, `media_type`, `alt_text`, `gallery_position`, `is_primary`; booleano `is_primary=false` identifica secundária quando na galeria. | Nenhuma mídia real inserida. |
| `real_photo/remix/concept/reference` | **CONFIRMADO** constraint `product_media_type_check` lista quatro valores, sem enum de tipos irrestritos. | Classificação futura exige verificação editorial. |
| `reference` não pública por padrão | **CONFIRMADO** `is_public=false` default; constraint `product_media_noncommercial_not_gallery` rejeita `reference` e `concept` públicos, principais ou na galeria; bucket `product-media` só permite `remix`. | Política de fotos pessoais/Storage privada será SB-017/SB-053. |
| Ordem determinística | **CONFIRMADO** índice único `product_media_product_position_unique (product_id,gallery_position) WHERE gallery_position IS NOT NULL`, CHECK posição >=0; consulta executada ordena `(gallery_position,id)`. Índice `product_media_one_primary_per_product` limita principal única. | Troca de posições exige operação administrativa planejada. |
| Proveniência não apagada pela publicação | **CONFIRMADO ESTRUTURALMENTE** `origin_reference` obrigatória para remix, coluna separada de `is_public`; FK de linhagem `source_media_id + product_id` e `ON DELETE RESTRICT`. | Não equivale a trilha de auditoria imutável de cada edição; SB-045 implementará isso. |
| Arquivo inexistente não vira placeholder silencioso | **CONFIRMADO ESTRUTURALMENTE** trigger `product_media_require_existing_public_object_trg` consulta `storage.objects`, bloqueia publicação se ausente/invisível. Consulta de galeria retorna `object_exists` e `delivery_state=MISSING_OBJECT`, sem `COALESCE` de foto fictícia. | Teste DML negativo e teste HTTP/Storage com arquivo real não executados; bucket ainda inexistente. Eliminação posterior precisa de reconciliação de leitura. |
| Migration + exemplo de consulta | **CONFIRMADO** SQL de migration versionado e `docs/SB-010_PRODUCT_MEDIA_PROVENANCE.md` com consulta realmente executada. | Exemplo retorna zero linhas, como esperado no schema sem catálogo. |

## Evidência remota de leitura

- `list_tables`: `product_media` criada com `product_id`, campos de mídia, proveniência e defaults.
- `list_migrations`: versão `20260922193533` presente.
- `pg_constraint`: 2 FKs (produto e origem no mesmo produto) + CHECKs para tipos, privacidade, origem, apresentação e estado.
- `pg_indexes`: 6 índices totais, incluindo PK, único por objeto/produto, único por posição, único por principal e índice para FK de origem.
- `pg_trigger`: 1 trigger de presença do objeto em Storage.
- Inspeção `pg_proc`: `security_definer=false`, `search_path` vazio; a função consulta `storage.objects` e emite erro explícito de ausência; `anon`/`authenticated` sem EXECUTE direto.
- Contagens observadas: `product_media=0`, `storage.buckets=0`, `storage.objects=0`; não houve seed, upload ou publicação.
- RLS: habilitado. `pg_policies` para `product_media=0`; grants da tabela para `anon`/`authenticated=0` até SB-012.
- Query `SELECT` de galeria com SKU explicitamente fictício executou e retornou `[]`; sintaxe válida e sem placeholder. Ver SQL no documento principal.
- Teste de expressões de path com `SELECT`: `SKU-01/remix.webp` aceito; path com `../`, path absoluto e URL HTTPS rejeitados pelo padrão regex.

## Teste transacional indisponível — NÃO contar como PASS

Tentativa de executar `BEGIN; DO $$ ... INSERTs fictícios e rejeições esperadas ... $$; ROLLBACK;` pelo `Supabase.execute_sql` retornou **`ERROR 25006: cannot execute INSERT in a read-only transaction`** na primeira inserção. Portanto **NENHUM teste DML de FK, `CHECK`, unicidade ou trigger passou de fato nesta rodada**, mesmo que a inspeção estrutural comprove sua existência. Nenhum registro transitório persistiu. Um roteiro opcional para realizar os testes em ambiente local isolado é entregue separadamente ao Founder. Não executar INSERT de teste no projeto compartilhado sem aprovação/isolamento e cleanup comprovado.

## Advisors pós-DDL

- **Security Advisor:** `INFO rls_enabled_no_policy`, 5 tabelas (`product_lines`, `products`, `product_variants`, `product_prices`, `product_media`), esperado para bloqueio fail-closed antes do **SB-012**. [Remediação oficial](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Nenhuma leitura pública foi liberada.
- **Performance Advisor:** `INFO unused_index`, 7 índices, incluindo `product_media_source_product_idx`; tabelas vazias e workload ausente. Nenhum aviso de FK sem índice foi retornado. [Remediação oficial](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index). Reavaliar com carga real sem remover índice preventivamente.
- Nenhum finding material novo que exija grant público imediato; ainda não é uma auditoria de segurança ponta a ponta.

## Tipos e Git

`Supabase.generate_typescript_types` executado para o projeto após migration. Tipos de `product_media` (Row/Insert/Update e duas Relationships) incorporados ao arquivo canônico `lib/supabase/database.types.ts` na branch. Não houve build/tsc local nesta sessão porque checkout local do repositório e CLI não estavam disponíveis. Sem GitHub Actions.

**Recuperação:** migration remota imutável; eventual correção por forward-fix versionado, sem apagar tabela/histórico. Nunca afirmar que Storage, RLS público, site, fotos, licenças ou lançamento foram validados por este card.

**Estado proposto do card:** conclusão **estrutural/documental** após PR/merge comprovados; DML negativo, bucket público/privado e integração de UI são pendências explicitamente transferidas para SB-012, SB-016/017 e SB-045. Registrar PR/merge SHA e movimento Trello somente após confirmação do conector.
