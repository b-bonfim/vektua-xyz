# SB-013 — Evidências de conclusão do modelo de papéis administrativos

**Data:** 2026-09-22 · **Escopo:** schema/modelo, não ativação do Portal Admin.  
**Card:** https://trello.com/c/MZDjzn2C/70-sb-013p1-preparar-modelo-de-pap%C3%A9is-administrativos  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Branch Git:** `sb-013-admin-role-foundation` · **base main:** `47434bc3cf79688b3898da3025be50f0a970fc92`  
**Migration remota:** `20260922210907_sb_013_admin_role_foundation` (`Supabase.apply_migration`: `success:true`; `list_migrations`: versão e nome confirmados).  
**Arquivo versionado:** `supabase/migrations/20260922210907_sb_013_admin_role_foundation.sql`.  
**Contrato / ADR:** `docs/SB-013_ADMIN_ROLE_MODEL.md`.

## Critérios de aceite — DoD do cartão

| DoD | Evidência e resultado |
|---|---|
| Estratégia de papéis documentada | PASS no escopo documental: ADR define identidade Auth distinta de RBAC, privilégio mínimo, fail closed, aprovação manual futura, server-side/RLS e auditoria. |
| `founder`, `admin`, `catalog_editor`, `operations`, `viewer` previstos | PASS: `admin_role_assignments_role_check` consultado no catálogo do PostgreSQL contém exatamente os cinco valores. Matriz de permissões FUTURAS no ADR. |
| Autenticação não implica admin | PASS no schema: 0 atribuições, `is_active=false` default, `anon` e `authenticated` sem USAGE, SELECT, INSERT, UPDATE nem EXECUTE do verificador; os seis objetos públicos mantêm 0 grants de escrita ao browser. Login real fica em SB-014. |
| Autorização server-side/RLS, não UI | PASS no escopo do modelo: duas tabelas privadas com RLS ON; verificador interno consulta `auth.uid()` e role table em `app_private`. Policies administrativas de acesso/escrita deliberadamente NÃO ativadas, a implementar e testar em card futuro. |
| Allowlist/role table auditável | PASS estrutural: FK com `auth.users`, uma atribuição/usuário, referência da decisão obrigatória, trigger `admin_role_change_audit` habilitado, tabela de eventos privada. Execução de ciclo real INSERT/UPDATE/DELETE não testada sem conta real/autorização de provisionamento; não representa prova operacional de revogação/login. |
| Sem usuário administrativo fictício | PASS: 0 rows em `admin_role_assignments` e 0 em `admin_role_audit` após aplicação; migration não contém INSERT/seed em `auth.users` nem em roles. |

## Consultas realmente executadas e saídas

1. `Supabase.list_tables(project_id, schemas=['public','private'], verbose=true)` antes do DDL: seis tabelas públicas existentes, RLS ligado, sem tabela de papéis. `Supabase.list_migrations`: SB-007 a SB-012 existentes.
2. `Supabase.execute_sql`: `SELECT nspname FROM pg_namespace WHERE nspname IN ('app_private','private')` → `[]` antes do DDL. O escopo original não foi sobrescrito.
3. `Supabase.apply_migration` com SQL do SB-013 → `success:true`. `Supabase.list_migrations` em seguida → `20260922210907_sb_013_admin_role_foundation` presente.
4. Consulta de inventário após DDL → `assignments=0`, `audit_events=0`, `public_rls_tables=6`, `private_rls_tables=2`.
5. `has_schema_privilege`/`has_table_privilege`/`has_function_privilege` para `anon` e `authenticated` → em ambos: schema USAGE=false; roles SELECT/INSERT/UPDATE=false; audit SELECT=false; checker EXECUTE=false. `has_admin_role` invocada pelo usuário SQL do conector foi negada (`42501 permission denied`), consistentemente com grant fechado; a verificação foi refeita por catálogo de privilégios, sem afrouxar segurança.
6. Consulta de grants de INSERT/UPDATE/DELETE nas seis tabelas `public` → `anon=0`, `authenticated=0` tabelas com escrita.
7. Inspeção de `pg_proc`/`pg_trigger` → duas funções no schema privado (`SECURITY DEFINER`, `search_path=''`); `admin_role_change_audit` com `tgenabled='O'`.
8. Inspeção `pg_constraint` → chave primária `user_id`, FK `auth.users(id) ON DELETE CASCADE`, CHECK dos cinco papéis e CHECK de `change_reference` não vazio.
9. `Supabase.get_advisors(security)` → 2 INFO `rls_enabled_no_policy` nas duas tabelas PRIVADAS: **intencionais** (sem policy até projeto da autorização admin). Sem achado material reportado. Remediação de referência: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy .
10. `Supabase.get_advisors(performance)` → 5 INFO de índices sem uso em tabelas públicas preexistentes e vazias; não criados por SB-013. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index .

## Limites e dependências

- Testes de login e logout reais, acesso à rota `/admin`, acesso HTTP, políticas CRUD admin, criação de primeira conta e teste end-to-end de trilha/revogação: **NÃO EXECUTADOS**, fora do SB-013; SB-014 e cards futuros. Nenhuma chave privada exposta. Nenhuma liberação de escrita, catálogo ou publicação.
- CLI Supabase não instalada no ambiente; a migration remota foi aplicada excepcionalmente primeiro, e o arquivo foi criado na branch imediatamente após recuperar seu version remoto; paridade por rebuild local e teste byte a byte remoto não comprovados. Não editar migration aplicada: usar forward-fix versionado.
- Nenhum GitHub Actions executado, nenhuma branch de banco paga, nenhuma despesa ou lançamento autorizado. `impeccable` é exclusivamente UI e não se aplica ao schema deste card.

## Rastreabilidade de encerramento

O histórico remoto, arquivo versionado, ADR e consultas acima são evidências do **modelo preparado**. Commit/PR/merge e estado final Trello devem ser registrados somente após confirmação do GitHub/Trello; o presente documento não atesta antecipadamente esses atos.

**Próximo cartão:** SB-014 — definir e testar Auth e proteção de `/admin` sem expor credentials/`service_role` ou habilitar CRUD só por estar autenticado.
