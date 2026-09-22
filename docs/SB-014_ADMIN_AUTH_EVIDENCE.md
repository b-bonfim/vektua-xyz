# SB-014 — Evidências e estado de aceite (22/09/2026)

**Status:** IMPLEMENTAÇÃO EM REVIEW; DoD GLOBAL NÃO COMPROVADO; Trello mantém L99.  
**Card:** https://trello.com/c/ABBbRxhw  
**PR draft #37:** https://github.com/b-bonfim/vektua-xyz/pull/37 · branch `sb-014-auth-admin-prep` · base SHA `a1c6afbfdc88732ffad02db0d9ab7d80d7529a49` · não merged/não deployado.  
**Supabase:** `tbffwwjqkusiupahjqux`; migration aplicada `20260922212956_sb_014_admin_auth_admission` (`apply_migration: success:true`, `list_migrations` confirmou versão).

## Realizado e verificado

- Função `public.can_access_admin()` via migration: checa `auth.uid()`, `auth.sessions` viva e `app_private.admin_role_assignments.is_active`. Inspection SQL: `checks_live_sessions=true`, `checks_active_role=true`; grants: `anon=false`, `PUBLIC=false`, `authenticated=true`. Owner `postgres` tem leitura nas duas tabelas privadas consultadas. Zero CRUD ou autorização admin de catálogo adicionada.
- Inventário remoto: `auth.users=0`, atribuições admin `=0`, audit events `=0`. Nenhum usuário ou papel criado neste card; provisionamento exige decisão do Founder.
- Arquivos novos no PR: `proxy.ts`, `lib/admin/{access-policy,access,current-user}.ts`, `/admin` e `/admin/login` páginas, `POST /admin/session`, `POST /admin/logout`, SQL migration, teste de pré-checagem e ADR. Código não modifica `lib/supabase/client.ts` nem intercepta caminhos públicos; cookie admin restrito `Path=/admin`, HttpOnly, sessão <= 1h e sem refresh token.
- Teste local no ambiente isolado: `node --experimental-strip-types --test /mnt/data/sb014/scripts/tests/sb-014-auth-preflight.mjs` → **5 tests, 5 pass, 0 fail**. Este resultado é **pré-checagem de política e inspeção de arquivos**, NÃO build, TypeScript check ou teste HTTP Next/Vinext.
- Advisors pós-DDL: Security 2 INFO `rls_enabled_no_policy` em tabelas privadas (herdadas do SB-013, intencional), **1 WARN** `authenticated_security_definer_function_executable` no RPC booleano de admissão; Performance 5 INFO `unused_index` em índices públicos preexistentes. Finding WARN requer revisão específica antes do gate. https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable .
- Supabase CLI e repo completo/node_modules indisponíveis nesta sessão: migration remota aplicada excepcionalmente antes da escrita do SQL canônico, reconciliação da versão feita imediatamente; rebuild/paridade local não testada. Sem GitHub Actions.

## Matriz DoD (não transformar preparação em aprovação)

| Critério | Situação nesta rodada |
|---|---|
| Estratégia login | Documentada: Auth e-mail/senha, senha em POST mesmo domínio, autorização RBAC server-side, cookie restrito. Config real do provider pendente. |
| Público sem Auth | Matcher `/admin/:path*` e teste da função PASS; requisição HTTP real pendente. |
| Admin dinâmico/no-store | Proteções no proxy/página e headers implementados; build/CDN/HTTP pendentes. |
| Logout invalida acesso | POST remove cookie e tenta revogar Auth; sem teste de conta real ou revogação remota. |
| Redirect de não autorizado | Código redireciona 303 `/admin/login`; teste HTTP e usuário não autorizado pendentes. |
| Sem bypass por URL de edição | Prefixo `/admin/*` guardado; teste HTTP de rota profunda e toda futura action pendentes. |

## Bloqueadores / owners

1. **Founder:** confirmar configuração Email Auth, habilitar somente conta REAL após decisão de papel registrada; credenciais privadas. Projeto tem zero usuários, logo sem teste positivo possível.
2. **Engineering:** rodar `npm ci`, check do lock, build Next/Vinext, HTTP público/anônimo/autorizado/negado/logout/cache, validar same-origin no host real; reproduzir migrations e revisar PR.
3. **Quality + Engineering:** resolver ou justificar com validação específica o WARN SECURITY DEFINER, revisar CDN, RLS, dados e rota direta.
4. **Founder + Engineering:** somente com seis DoD evidenciados promover PR/merge, registrar commit/deploy conforme escopo e mover card à lista Concluído com verificação posterior.

**Resultado:** PR draft criado e DDL aplicado, mas **SEM aprovação de DoD, merge, deploy ou movimento de Trello**. Para roteiro de operador, usar arquivo de download `SB-014_ROTEIRO_MANUAL_FOUNDER_v1.0.md` entregue na conversa; não publicar senha/UUID em repositório. Em correção de DB, nova migration forward-fix (não editar migration remota aplicada).
