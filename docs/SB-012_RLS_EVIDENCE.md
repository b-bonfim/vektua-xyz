# SB-012 — Relatório de evidências e DoD

**Data:** 22/09/2026 (America/Sao_Paulo). **Projeto Supabase:** `tbffwwjqkusiupahjqux` (ACTIVE_HEALTHY, PostgreSQL 17). **Owner:** Engineering / Quality (papéis). **Card:** https://trello.com/c/6uUc4ykr/69-sb-012p0-habilitar-rls-em-todas-as-tabelas-expostas. **PR:** https://github.com/b-bonfim/vektua-xyz/pull/35. **Escopo:** schema de negócio `public`; seis tabelas atualmente existentes. Não é teste de penetração nem liberação de lançamento.

## 1. Linha de base observada antes da execução

- Seis tabelas públicas: `product_lines`, `products`, `product_variants`, `product_prices`, `product_media`, `site_settings`; seis com RLS já habilitado; todas sem dados.
- Cinco tabelas sem policy (`product_lines`, `products`, `product_variants`, `product_prices`, `product_media`); `site_settings` possuía policy SELECT `is_public=true` e SELECT limitado a `key,value,value_type`.
- `product_lines` possuía grants de tabela para `anon`/`authenticated`, incluindo INSERT/UPDATE/DELETE; RLS sem política de escrita impedia DML, mas os grants eram excessivos. Corrigidos.
- Security Advisor inicial: 5 findings informativos `rls_enabled_no_policy`.

## 2. Mudanças aplicadas e rastreabilidade

| Item | Evidência confirmada |
|---|---|
| Migração de segurança | `20260922205646_sb_012_rls_public_catalog`, aplicada com sucesso via Supabase MCP; arquivo Git `supabase/migrations/20260922205646_sb_012_rls_public_catalog.sql` |
| Teste transacional | `20260922205814_sb_012_rls_transactional_acceptance`, aplicada com sucesso via Supabase MCP; arquivo Git `supabase/migrations/20260922205814_sb_012_rls_transactional_acceptance.sql` |
| Git | Branch `sb-012-rls-public-catalog`, base `main@1a17a374ec6c3ae4be32bfed5abb118883bab3eb`; PR #35. Os commits e eventual SHA de merge devem ser confirmados pelo GitHub no fechamento. |
| Histórico remoto | As duas versões acima constam em `supabase_migrations.schema_migrations`; respectivas strings SQL armazenadas têm 4938 e 5329 bytes, MD5 `158e8c13bd92ac095224e706235e7c6b` e `1cbeb4334be965d83084c241828d22b5`. Hashes são identificação operacional do histórico, **não** validação de segurança nem prova autônoma de paridade byte a byte com Git. |
| Protocolo | CLI não disponível neste ambiente. Exceção documentada: aplicação MCP antes da criação dos arquivos Git porque o timestamp foi gerado pelo Supabase; versões recuperadas imediatamente do histórico e espelhadas com os mesmos nomes na branch. Não editar migrations remotas; verificar paridade/reprodução local antes do cutover (SB-029/SB-030). |

## 3. Testes efetivamente executados

A segunda migration inclui um `DO` que cria **somente dentro de um subbloco sujeito a rollback**: duas linhas comerciais (ativa/inativa), cinco produtos (publicado-público, rascunho, suspenso, oculto, linha inativa), duas variantes (ativa/rascunho), cinco preços (site válido, rascunho, marketplace, variante inativa, linha inativa), mídia privada e duas configurações (pública/privada). Alterna `current_user` para `anon`; qualquer teste inesperado emite exceção e aborta a migration. O único caminho de sucesso exige: leitura de 1 linha ativa, 1 produto publicado/público, 1 variante ativa, 1 preço site, 0 mídias privadas, 1 setting público, erros `insufficient_privilege` para INSERT/UPDATE/DELETE e bloqueio de SELECT da coluna `origin_reference`. O sentinela final força rollback dos dados fictícios. A migration `success:true` comprova que todas essas assertivas foram satisfeitas.

**Verificação independente após teste (consulta read-only):** total de linhas e fixtures residuais = 0 em todas as seis tabelas. A migration não publicou, alterou nem cadastrou produtos reais.

**Consulta estrutural pós-migração:** `public_tables=6`, `rls_enabled=6`, `tables_with_public_select=6`, `tables_with_browser_write=0`, `structural_acceptance=true`. Consulta de privilégios por coluna confirmou que `origin_reference`, `source_media_id`, `is_public`, `file_state` e campos de data de `product_media` não são selecionáveis por `anon`/`authenticated`; `site_settings` expõe só `key,value,value_type`.

**Advisors pós-DDL:** Security `lints=[]` (zero findings no instante consultado). Performance: cinco findings `INFO unused_index` em `product_lines_position_idx`, `products_product_line_id_idx`, `product_variants_product_id_idx`, `product_prices_variant_product_fk_idx`, `product_media_source_product_idx`. Tabelas estão vazias; manter índices por ora e reavaliar após carga real. Referências: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy e https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index.

## 4. Matriz DoD do cartão

| Critério | Resultado e prova |
|---|---|
| RLS habilitado em todas as tabelas públicas criadas | PASS — 6/6, inspeção de `pg_class.relrowsecurity`. |
| `anon` somente lê conteúdo publicável necessário | PASS no escopo SQL — policies SELECT com estados, variante/preço/bucket e coluna allowlist; teste transacional 1 produto visível, outros ocultos. |
| `anon` sem INSERT/UPDATE/DELETE | PASS — privilégios ausentes nas 6 tabelas; tentativas SQL como `anon` falharam no teste transacional. |
| Rascunhos/suspensos ocultos | PASS — fixtures de rascunho, suspenso, hidden e linha inativa não aparecem. |
| Policies versionadas em migration | PASS — duas migrations em histórico Supabase e arquivos homônimos no Git; merge/main deve ser verificado no fechamento. |
| Teste negativo de escrita pública | PASS — `anon` real sob `SET LOCAL ROLE`, erros de privilégios para INSERT/UPDATE/DELETE; sem mutations persistidas. |
| Teste positivo de conteúdo publicável | PASS — produto publicado/público e linha ativa retornaram exatamente um item; preço válido e variante ativa também. |

## 5. Limites e próximos owners

- **SB-016–SB-018 / Engineering + Quality:** buckets e políticas de Storage não foram criados aqui. Mídia pública real não foi testada nem declarada acessível; policy SQL é apenas referência a `product_media`.
- **SB-013 / Engineering + Quality:** papéis administrativos e autenticação futura permanecem pendentes. `authenticated` tem o mesmo SELECT público e nenhuma escrita nesta etapa.
- **SB-023 / Frontend + Engineering:** consumir somente colunas liberadas; `select('*')` pode falhar por incluir campos internos.
- **SB-030 / Quality + Engineering:** realizar testes ofensivos HTTP reais, Storage, API e exemplos finais com dados controlados; não confundir este teste SQL de DoD com pentest.
- **Founder:** nenhuma aprovação de SKU, compra, publicação comercial ou lançamento foi inferida.
- GitHub Actions **não foram utilizados**. Nenhum secret, senha, token ou chave privada foi incluído nos artefatos. Impeccable não tem superfície de UI para revisar neste card exclusivamente de backend.

## 6. Recuperação

Em caso de falha, interromper ativação do storefront e produzir nova migration de forward-fix para corrigir grants/policies; não desabilitar RLS, apagar migrations históricas ou executar rollback destrutivo. A implementação estática anterior do site permanece fora desta alteração; qualquer cutover exige seus próprios testes/gates.
