# SB-014 — Evidências de correção e critérios de aceite

**Data local:** 22/09/2026 · **Status:** HOLD, DoD GLOBAL ABERTO. **PR:** https://github.com/b-bonfim/vektua-xyz/pull/37 (draft, sem merge/deploy/Actions). **Card:** https://trello.com/c/ABBbRxhw (L99). **Origem:** `SB-014_relatorio_execucao.md` fornecido pelo Founder, 22/09, commit original 019637a42636c65c42211c0f476204193b1f4ec5. Testes deste relatório anterior são REPORTADOS, não feitos por esta correção.

## Antes da correção — relatório manual recebido

- `npm ci`, lock check, preflight 5/5, `build`, `build:hostinger` exit 0; testes HTTP dev localhost:5173 e standalone 127.0.0.1:5174; NÃO representa Hostinger.
- A06 PARCIAL: login com papel inativo recusou painel mas gerou sessão Auth a mais; tentativa isolada após logout não completada. A07: revogação de papel bloqueou request, porém restaurar papel recuperava acesso com cookie antigo. A08: logout impediu acesso no browser e URL direta, mas sobrou uma sessão criada pela recusa. A09: no-store nas rotas observadas, sem capturar resposta positiva do login nem validar CDN.
- Conta real e papel `admin` provisionados conforme autorização expressa narrada no relatório; papel final ATIVO; sem dados de conta nos arquivos. Inventário desta rodada (SQL): 1 papel ativo e 1 sessão Auth remanescente, ambas preexistentes.

## Correções executadas nesta rodada (Engineering)

1. GitHub branch `sb-014-auth-admin-prep`: novo `lib/admin/revoke-session.ts` centraliza POST local-scope ao GoTrue, retorna sucesso SOMENTE após `response.ok`. `app/admin/session/route.ts` revoga o token recém-emitido quando a admissão falha, limpa cookie admin antigo e loga falha remota genericamente sem PII/segredo. `app/admin/logout/route.ts` usa helper e não disfarça erro remoto como revogação. `proxy.ts` expira cookie quando autorização falha. Nada publicado na main.
2. Supabase `apply_migration` sucesso, `list_migrations` confirmou `20260923000434_sb_014_revoke_admin_sessions_on_role_change` (nova forward-fix versionada GitHub). RPC acrescenta `s.created_at > a.updated_at`; trigger auditado SB-013 renova timestamp em toda atualização de papel. Revogar papel bloqueia logo na nova consulta e reabilitar papel NÃO recupera sessão anterior. Não apaga sessão Auth geral nem JWT; é bloqueio administrativo e exige login novo.
3. Consulta SQL após migração: clause epoch presente `true`; `anon EXECUTE=false`, `authenticated EXECUTE=true`; `auth.sessions=1` e `sessions rejetadas pela regra de epoch=1`; papel ativo=1. Não coletados ID/email/JWT. Migração anterior intacta. Aplicação remota antecedeu escrita do arquivo canônico porque CLI não disponível, versões reconciliadas; rebuild/paridade integral NÃO testados.
4. Teste regressivo de GitHub `scripts/tests/sb-014-auth-regression.mjs` copiado no contêiner com SHA git blob idêntico `d4a3b5b5e2e489f3ddb4f12ad6facb129861cc3f`: `node --experimental-strip-types --test ...` → **8/8 PASS**, zero falhas. Inclui 4 testes do helper com transporte simulado e 4 inspeções estruturais/SQL (A06/A08/A09). Parser TypeScript global examinou quatro arquivos alterados: 0 erros sintáticos. **Não são testes HTTP reais**, nem full typecheck/build do HEAD.

## Skill 08 Quality — parecer técnico com escopo, NÃO aprovação/certificação

Parecer desta mesma sessão, baseado no código/DDL, introspecção SQL, Advisors e docs públicas. `public.can_access_admin`: `SECURITY DEFINER` owner postgres, SQL STABLE, `search_path=''`, sem argumentos; retorno booleano acerca do próprio `auth.uid()`, sessão presente e papel privado ativo + epoch; ACL apenas postgres/service_role/authenticated, sem anon/PUBLIC; tabelas `app_private` sem SELECT para anon/authenticated e RLS ligado. Justificativa técnica específica para leitura privativa, **não equivale a eliminar o WARN** `authenticated_security_definer_function_executable`; manter achado documentado, revisar alterações futuras e não expandir RPC para CRUD/dados. INFO privadas sem policies é isolamento intencional, não abrir SELECT como remediação.

Segundo WARN detectado nesta rodada: `auth_leaked_password_protection` desativado. Projeto Supabase plano FREE; documento oficial informa recurso disponível Pro+. Não elevar plano nem gastar sem Founder Gate. Registrar aceitação explícita ou medidas compensatórias (senha forte gerada por gestor, MFA e proteção antiabuso/limite de tentativas, na configuração compatível), com evidência. Sem dados para afirmar MFA/compensações executadas.

**Recomendação Quality: BLOCK RECOMMENDED para liberação comercial/de produção do painel,** por retestes HTTP e cache Hostinger pendentes, risco de sessão remota na falha de logout e WARN de senhas. Não representa auditoria independente de terceiro ou aceite formal pelo Founder.

## Matriz DoD e pendências

| Critério | Estado desta versão |
|---|---|
| Login definido | Sim em arquitetura/código; conta real reportada; A06 reteste após correção ainda PENDENTE. |
| Loja pública sem auth | PASS HTTP da versão antiga reportado; regressão do HEAD e produção PENDENTES. |
| Admin dinâmico e sem cache compartilhado | Proteção e no-store em código; A09 real em login positivo, CDN e produção PENDENTES. |
| Logout invalida acesso | Código helper/clear cookie e mocks PASS; A08 real, ausência sessão extra e revogação remota PENDENTES. |
| Redirect de não autorizado | Versão antiga HTTP anônimo PASS; HEAD A06 papel inativo/limpeza sessão PENDENTE. |
| URL direta de edição sem bypass | Versão antiga testada; reteste HEAD + endpoints futuros PENDENTES. |

**Owners:** Engineering = npm ci/lock, preflight, regressão, builds, HTTP A06/A08/A09 isolados, CLI rebuild, Hostinger cache/proxy; Quality = revisão de evidência pós-reteste e mitigação dois WARN; Founder = autorizar temporariamente alteração de papel/conta e quaisquer gastos/GO. Um teste com senha do titular deve ocorrer apenas no navegador local, sem compartilhá-la aqui. **Sem marcação Concluído, merge, deploy ou GitHub Actions.**

Referências: https://supabase.com/docs/guides/auth/signout ; https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable ; https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
