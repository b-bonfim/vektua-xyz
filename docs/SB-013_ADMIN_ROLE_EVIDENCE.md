# SB-013 — Evidências de conclusão do modelo de papéis administrativos

**Data:** 2026-09-22 · **Status:** CONCLUÍDO no escopo RBAC, sem ativar Portal Admin.  
**Card:** https://trello.com/c/MZDjzn2C/70-sb-013p1-preparar-modelo-de-pap%C3%A9is-administrativos — movido para **Concluído**, confirmado por nova leitura do Trello em 22/09/2026.  
**Projeto Supabase:** `tbffwwjqkusiupahjqux` · **Git branch:** `sb-013-admin-role-foundation` · **base SHA main:** `47434bc3cf79688b3898da3025be50f0a970fc92`.  
**Migration aplicada:** `20260922210907_sb_013_admin_role_foundation` · **Arquivo:** `supabase/migrations/20260922210907_sb_013_admin_role_foundation.sql`.  
**ADR:** `docs/SB-013_ADMIN_ROLE_MODEL.md`.  
**PR #36:** https://github.com/b-bonfim/vektua-xyz/pull/36 · **MERGED via squash**, resposta `merged:true`, merge SHA `6ccd7dd3cfed99d0343c4b2703d3e599ab5eabcb`. Este próprio fechamento é um commit documental posterior ao merge.

## DoD do cartão, uma a uma

| Critério | Resultado e evidência |
|---|---|
| Estratégia de papéis documentada | **PASS (documental):** ADR descreve autenticação separada de autorização, menor privilégio, fail closed, ciclo de aprovações, fronteiras server-side/RLS e auditoria. |
| Papéis `founder`, `admin`, `catalog_editor`, `operations`, `viewer` | **PASS:** `pg_constraint` confirmou CHECK com exatamente os cinco papéis; ADR contém matriz de atribuições futuras. |
| Autenticação não equivale a admin | **PASS (modelo):** nenhuma atribuição inicial; default `is_active=false`; `anon` e `authenticated` sem schema USAGE, sem grants CRUD/leitura de papéis ou EXECUTE do verificador. Login real é SB-014. |
| Fonte de autorização server-side/RLS | **PASS (fundação):** tabelas privadas com RLS ON e função de verificação com `auth.uid()` consultando atribuição ativa; nenhuma policy administrativa ativa ou autorização baseada apenas em botões/UI. Integração efetiva futura não está coberta. |
| Allowlist/tabela de papéis auditável | **PASS (estrutura):** FK `auth.users`, PK por usuário, referência não vazia, trigger de INSERT/UPDATE/DELETE habilitado e tabela audit privada. O ciclo operacional com usuário real não foi testado e não está sendo declarado. |
| Não criar admin fictício | **PASS:** tabelas `admin_role_assignments` e `admin_role_audit` com zero registros após DDL. Migration não faz INSERT/seed em `auth.users` ou atribuições. |

## Evidências executadas no Supabase

1. Inspeção inicial: seis tabelas `public` com RLS, migrations SB-007 a SB-012 presentes; busca de schema `app_private`/`private` retornou `[]`.
2. `Supabase.apply_migration` → `success:true`; `Supabase.list_migrations` confirmou `20260922210907_sb_013_admin_role_foundation`.
3. Inventário SQL pós-DDL → `assignments=0`, `audit_events=0`, `public_rls_tables=6`, `private_rls_tables=2`.
4. Privilégios por `has_schema_privilege`, `has_table_privilege` e `has_function_privilege` para **ambos** `anon` e `authenticated` → `private_schema_usage=false`, `can_read_roles=false`, `can_assign_roles=false`, `can_change_roles=false`, `can_read_audit=false`, `can_execute_role_check=false`. Tentativa de executar o checker com o SQL role do conector recebeu `42501 permission denied`; não foi corrigido concedendo privilégio amplo.
5. Inspeção grants nas tabelas `public` → `anon=0` e `authenticated=0` tabelas com INSERT, UPDATE ou DELETE; nenhuma abertura administrativa do SB-012.
6. Inspeção `pg_proc`/`pg_trigger` → duas funções `SECURITY DEFINER`, ambas `search_path=''`; trigger `admin_role_change_audit` habilitado (`O`). `pg_constraint` → PK user_id, FK `auth.users(id) ON DELETE CASCADE`, CHECK dos cinco papéis e referência obrigatória.
7. Security Advisors → **2 INFO** `rls_enabled_no_policy` nas tabelas PRIVADAS, deliberados enquanto browser/portal não tem permissão; sem finding material. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy . Performance Advisors → **5 INFO** `unused_index` em índices públicos preexistentes, tabelas vazias; não atribuídos ao SB-013. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index .

## Evidência GitHub e Trello

- Branch dedicada criada na `main` SHA base indicada, três arquivos revisados pelo diff de PR #36 (98 linhas SQL, ADR e evidências). PR foi confirmado `mergeable:true` e incorporado com SHA indicado. Não houve GitHub Actions.
- Descrição do cartão SB-013 atualizada com seis DoD, IDs, links, Advisors, escopo e limites. A movimentação para a lista `Concluído` foi confirmada via `Trello.trelloReadCard`; não houve arquivamento nem publicação do site.

## Limites e próximo passo

**Não executados e não inferidos:** provisionamento de usuário real, teste funcional do trigger com alterações de papel, testes login/logout, proteção dinâmica `/admin`, HTTP negativo, CRUD admin ou armazenamento privado. O acesso público do catálogo permanece somente leitura. SB-014 cobre Auth e rotas; futuras migrations terão de acrescentar grants/policies estritas com testes reais; nunca expor `service_role` no cliente. O DB owner pode contornar auditoria por trigger; registros de aprovações e logs adicionais serão necessários em operação real.

A CLI Supabase não estava instalada: migration foi aplicada remotamente como exceção e o arquivo versionado foi imediatamente reconciliado com o número de versão retornado; rebuild local/paridade byte a byte não comprovados e devem ser checados antes do cutover. Para correções, usar migration nova de forward-fix; não editar o histórico aplicado. Nenhuma branch paga de banco, despesa ou lançamento foi autorizado. A Skill `impeccable` é específica de interfaces; não havia interface a implementar neste card.

**Founder Gate:** nenhum novo gate de comercialização ou de usuário administrativo foi aprovado pelo SB-013. Primeiro provisionamento real exige decisão expressa do Founder e verificação apropriada na etapa subsequente.
