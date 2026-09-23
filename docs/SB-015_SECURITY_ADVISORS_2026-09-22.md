# SB-015 — Supabase Security Advisors | Evidências e triagem v1.0

**Data local:** 22/09/2026 (America/Sao_Paulo). **Projeto:** `tbffwwjqkusiupahjqux` (Vektua XYZ, `ACTIVE_HEALTHY`). **Escopo:** auditoria de Advisor após SB-012 (schema/RLS), SB-013 e migration remota SB-014; nenhuma alteração de DDL, Auth, usuário, papel, custos ou deploy neste cartão. **Responsáveis:** Engineering (verificações), Quality (triagem de riscos), Founder (decisões e gates). **Status:** execução e documentação da auditoria concluídas; **cutover e SB-014 NÃO liberados**.

## Linha do tempo e fonte primária

- Supabase `list_migrations`: SB-012 `20260922205646_sb_012_rls_public_catalog`, `20260922205814_sb_012_rls_transactional_acceptance`; SB-013 `20260922210907_sb_013_admin_role_foundation`; SB-014 `20260922212956_sb_014_admin_auth_admission`, `20260923000434_sb_014_revoke_admin_sessions_on_role_change`. O registro remoto contém também SB-007–011. Os dois registros SB-014 posteriores não constavam de `main` na inspeção e fazem parte do PR draft #37; paridade de ambiente e rebuild NÃO testados por SB-015.
- Security Advisor: execução inicial às **2026-09-23 00:21:43.205 UTC** (22/09 21:21:43 -03:00); conferência final às **2026-09-23 00:23:24.975 UTC** (22/09 21:23:24 -03:00), já após migration de revogação SB-014. Resultado idêntico: **4 ocorrências = 2 INFO + 2 WARN; 0 ERROR/critical/high retornados pelo Advisor**. `observed_at` nos dois retornos e endpoint `Supabase.get_advisors(type=security)` constituem a evidência primária. A segunda chamada revalidou o estado; **não houve correção DDL neste cartão**, portanto não declarar reexecução pós-correção de SB-015.
- Inspeções SQL somente leitura: todas as seis tabelas `public` com `relrowsecurity=true`, `anon` sem INSERT/UPDATE/DELETE; `app_private.admin_role_assignments` e `app_private.admin_role_audit` com RLS=true e sem SELECT para `anon`/`authenticated`, sem USAGE do schema privado para `authenticated`. `public.can_access_admin()` tem owner `postgres`, SECURITY DEFINER, retorno boolean; EXECUTE `anon=false`, `authenticated=true`; função inspecionada: sem parâmetros, `search_path=''`, confere UID/JWT session_id contra Auth sessions e papel ativo, com epoch `s.created_at > a.updated_at`. Há 1 atribuição administrativa no banco; não incluir identidade no relatório.
- Organização Supabase `nasfeymwbungkqjihjng`: plano **free**, confirmado via `get_organization`; recurso de proteção de senhas vazadas exige Pro ou superior, segundo documentação Supabase. Nenhum upgrade autorizado ou realizado.

## Triagem individual — classificações de gestão, não reclassificação do fornecedor

| ID/objeto | Level do Advisor | Status SB-015 | Justificativa / próxima condição | Owner |
|---|---|---|---|---|
| `0008_rls_enabled_no_policy` — `app_private.admin_role_assignments` | INFO | **ACEITO COM JUSTIFICATIVA** | Tabela deliberadamente privada e fail-closed: RLS ON, sem policies de browser, `anon`/`authenticated` sem SELECT e sem USAGE em schema. Não adicionar policy para silenciar o lint. Rever se arquitetura/grants mudarem. | Engineering/Quality |
| `0008_rls_enabled_no_policy` — `app_private.admin_role_audit` | INFO | **ACEITO COM JUSTIFICATIVA** | Auditoria privada, sem SELECT do browser e RLS ON. Não conceder leitura só para apagar INFO. Rever com portal admin. | Engineering/Quality |
| `0029_authenticated_security_definer_function_executable` — `public.can_access_admin()` | WARN | **ACEITO COM JUSTIFICATIVA LIMITADA PARA ESTE DESENHO; WARN PERSISTE** | RPC de verificação de acesso precisa ser chamada por usuário autenticado, devolve somente booleano do próprio token/sessão e não abre leitura direta às tabelas. `anon` não executa. Contudo owner postgres e SECURITY DEFINER ampliam impacto de qualquer defeito: alteração de função, RLS, Auth/ACL ou contrato de retorno exige nova revisão. A aceitação do desenho NÃO libera PR #37, autenticação real ou cutover; parecer Quality SB-014 é BLOCK RECOMMENDED até testes A06/A08/A09, infraestrutura e governança. | Engineering/Quality |
| `auth_leaked_password_protection` — Auth | WARN | **BLOQUEANTE PARA GO DO ADMIN/CUTOVER ATÉ DECISÃO E MITIGAÇÃO DOCUMENTADAS** | Proteção desativada; projeto Free e funcionalidade Pro+. Não fazer upgrade/gasto sem Founder. Avaliar ajuste de tamanho/complexidade de senha, senha exclusiva de gerenciador, MFA e proteção antiabuso **somente quando efetivamente configurados e testados**; ou decisão expressa de custo/risco residual dentro da competência. Nova verificação do Advisor após possível habilitação. | Founder + Quality + Engineering |

**Links oficiais de remediação:**
- INFO 0008: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- WARN 0029: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- WARN Auth: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Guia detalhado 0029: https://supabase.com/docs/guides/observability/advisors?queryGroups=lint&lint=0029_authenticated_security_definer_function_executable

## Critérios de aceite do cartão e limites

- [x] Advisor de segurança executado no projeto correto.
- [x] Quatro findings individualizados e classificados como aceitos com justificativa ou bloqueante, sem alegar que alertas foram corrigidos.
- [x] Zero findings classificados críticos/altos retornados; **isso não equivale a ausência de riscos materiais**. Os WARNs permanecem no Advisor.
- [x] Documentadas remediações, donos e condições de reavaliação.
- [x] Advisor executado duas vezes após as últimas migrations listadas, resultado idêntico. **Sem correção relevante aplicada por SB-015**; caso qualquer política, função, Auth ou grants mude no futuro, executar novo Advisor e atualizar este histórico antes de GO.

**Resultado gerencial:** o **trabalho de rodar/triagem/documentar SB-015 pode ser encerrado**, mas SB-014 permanece HOLD e o cutover segue bloqueado. A auditoria estática NÃO substitui testes negativos/positivos reais de APIs, isolamento de sessões, Storage (SB-016–018), QA ofensivo (SB-030), HTTPS/CDN, backup, direitos de produto, segurança de dados ou Founder Gate. Nenhuma certificação ou parecer de terceira parte foi emitido.

**Referências do projeto:** [SB-015 Trello](https://trello.com/c/EsfUedD8); [SB-012 evidências](https://github.com/b-bonfim/vektua-xyz/blob/main/docs/SB-012_RLS_EVIDENCE.md); [SB-013 modelo](https://github.com/b-bonfim/vektua-xyz/blob/main/docs/SB-013_ADMIN_ROLE_MODEL.md); [SB-014 draft PR #37](https://github.com/b-bonfim/vektua-xyz/pull/37); [SB-014 parecer Quality no branch](https://github.com/b-bonfim/vektua-xyz/blob/sb-014-auth-admin-prep/docs/SB-014_QUALITY_SECURITY_REVIEW.md).

**GitHub Actions:** não invocados; nenhum commit de aplicação, merge ou deploy realizado por SB-015. Atualização deste relatório é documental.
