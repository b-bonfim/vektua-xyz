# SB-014 — Autenticação administrativa preparada (ADR)

**Projeto:** Vektua XYZ · **Data:** 22/09/2026 · **Card:** https://trello.com/c/ABBbRxhw · **Status:** implementação em branch; aceitação ponta a ponta depende de operador real e teste local.
**Dependências:** SB-012/SB-013 (`docs/SB-013_ADMIN_ROLE_MODEL.md`). **Destino:** `/admin`, separado do storefront público. **Sem GitHub Actions.**

## Decisão de arquitetura

- Login de operadores existentes via **Supabase Auth e-mail/senha**, sem cadastro público; `/admin/login` é formulário mínimo preparatório, não substitui UX e hardening do card futuro SB-040.
- `app/admin/session/route.ts`: recebe senha apenas via POST same-origin/HTTPS em produção, autentica com Auth e, **antes de abrir sessão do painel**, confirma `getUser(accessToken)` e RPC `public.can_access_admin()` server-side. Credenciais inválidas e usuário sem permissão recebem mensagem genérica; não logar token ou senha.
- Migration `supabase/migrations/20260922212956_sb_014_admin_auth_admission.sql`: RPC devolve **somente booleano sobre o próprio usuário**, consulta `app_private.admin_role_assignments` ativa e `session_id` ainda presente em `auth.sessions`, sem expor registros ou conceder CRUD. `anon` e PUBLIC não têm EXECUTE; somente `authenticated`. O SECURITY DEFINER é intencional e limitado a booleano, mas gera finding WARN `authenticated_security_definer_function_executable`; registrar, justificar e reavaliar se o escopo evoluir.
- Admin usa apenas **access token** em cookie `HttpOnly; SameSite=Strict; Path=/admin; Secure` em produção; duração máxima uma hora ou expiração do JWT, o menor. **Sem refresh token**, login novamente quando expira. Não usa `lib/supabase/client.ts` nem altera estado de sessão do storefront.
- `proxy.ts` corresponde somente a `/admin/:path*`: autentica e autoriza rotas protegidas, inclusive caminhos profundos; login/session/logout têm tratamento próprio. A própria `app/admin/page.tsx` revalida server-side. Toda futura ação/endpoint de escrita DEVE revalidar permissão por operação + RLS; proxy/UI isolados não autorizam mutações. Nenhum CRUD, publicação, provisionamento nem grant de tabela admin foi criado.
- `/admin/logout` só aceita POST same-origin; tenta revogar sessão local no Auth e sempre remove cookie. JWT copiado anteriormente pode continuar criptograficamente válido até expirar, mas RPC rejeita `auth.sessions` removida quando revogação remota foi bem-sucedida. Se rede/serviço falhar, o navegador perde acesso; operador deve verificar/revogar sessão no Dashboard e desativar papel em incidente, sem afirmar revogação remota automática.
- `/admin` e `/admin/login`: renderização dinâmica, noindex; proxy/handlers `Cache-Control: private, no-store`, `Vary: Cookie`. CDN/Hostinger também precisa desabilitar cache de `/admin/*` e `Set-Cookie` antes de liberação.

## Estado verificado e divergência de protocolo

Em 22/09/2026, projeto `tbffwwjqkusiupahjqux` apresentou **0** `auth.users`, **0** atribuições de papel e **0** eventos de auditoria; nenhum usuário fictício criado. Provisionamento de operador real/papel requer ato explícito do Founder e trilha privada, não atribuição por e-mail/domínio.

`Supabase.apply_migration` retornou `success:true`; `Supabase.list_migrations` confirmou versão remota **20260922212956_sb_014_admin_auth_admission**. Consulta de grants: `anon=false`, `authenticated=true`, `PUBLIC=false`; function owner `postgres` com leitura permitida de `auth.sessions` e da tabela de papéis. Exceção à ordem ideal SB-003: CLI local não disponível; a aplicação remota antecedeu brevemente a criação do arquivo canônico, cuja versão foi imediatamente recuperada e reconciliada. Teste de rebuild/paridade local segue pendente pré-cutover. Nova correção usa nova migration, nunca edita esta.

Security Advisors após DDL: 2 INFO preexistentes `rls_enabled_no_policy` das tabelas privadas (sem acesso browser deliberadamente), 1 WARN relativo ao RPC SECURITY DEFINER exposto somente a `authenticated` e que não retorna dados sensíveis. Performance Advisors: 5 INFO `unused_index` preexistentes no catálogo. Não tratar Advisor como substituto de teste positivo/negativo real.

## Recuperação e gates

Na ausência de usuário com papel ativo, acesso negado por desenho. Em incidente, desativar atribuição com referência de decisão, invalidar sessão no Auth Dashboard e abrir forward-fix versionada; nunca retirar RLS ou expor service_role. Os testes locais de política/estrutura NÃO equivalem a build, teste HTTP Next/Vinext, teste com usuário real ou prova de deploy. **SB-014 mantém aceite aberto até provas reais.** SB-040 permanece aberto para experiência completa do portal/login.

Fontes: `docs/SUPABASE_MIGRATION_PROTOCOL.md`, `docs/SB-013_ADMIN_ROLE_MODEL.md`, https://supabase.com/docs/guides/auth/server-side/advanced-guide , https://supabase.com/docs/reference/javascript/auth-getuser , https://supabase.com/docs/guides/auth/signout , https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable .
