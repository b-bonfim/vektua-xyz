# SB-014 — Parecer da Skill documental 08 Quality (escopo limitado)

**Data local:** 22/09/2026. **Escopo:** PR #37, migration de autorização, Auth/ACL SQL, Supabase Security Advisors e documentação oficial. **Emissor:** mesmo ChatGPT, etapa Quality após Engineering, **não revisão independente, certificação ou Founder Gate.** **Resultado:** `BLOCK RECOMMENDED` especificamente para merge/deploy/liberação de `/admin` enquanto faltarem provas de ponta a ponta. O código de correção e migration podem permanecer em review.

## EVIDÊNCIA VERIFICADA

- Função `public.can_access_admin()` sem argumentos, `RETURNS boolean`, `LANGUAGE sql STABLE SECURITY DEFINER`, owner `postgres`, `SET search_path=''` e referências de tabelas totalmente qualificadas. Usa `auth.uid()` e `auth.jwt()->>'session_id'` sob contexto do token PostgREST. Verifica `auth.sessions.user_id/id/not_after`, papel ativo em `app_private.admin_role_assignments` e nova condição `s.created_at > a.updated_at`. Não utiliza `user_metadata`, não retorna registros e não concede CRUD.
- `proacl` explicita EXECUTE para postgres, service_role e authenticated. `has_function_privilege('anon',...) = false`; `has_function_privilege('authenticated',...) = true`. RLS `app_private.admin_role_assignments` ligado; authenticated/anon sem SELECT nessa tabela. A primeira migration tinha mesmo perfil; forward-fix preservou grants.
- `get_advisors(security)` após forward-fix: 2 INFO `rls_enabled_no_policy` em duas tabelas privadas (isolamento deliberado); 1 WARN `authenticated_security_definer_function_executable` da função booleana; 1 WARN `auth_leaked_password_protection` desligada. Não mascarar nem afirmar zero achados.
- Projeto de Supabase com plano Free consultado. Documentação indica leaked-password protection disponível Pro e superior. Nenhum upgrade, compra ou política paga executada.
- Corrigido código GitHub: login recusado tenta POST `/auth/v1/logout?scope=local` só da sessão recém-emitida e só considera sucesso em HTTP 2xx; logout comum mesma regra; proxy e resposta negada limpam cookie. Teste em mock e estrutura não atesta revogação remota num login REAL.

## RISCOS / PROPORCIONALIDADE

1. **SECURITY DEFINER — WARN persistente, de desenho:** chamar função elevada por authenticated pode ser perigoso se expuser linhas, aceitar argumentos amplos, SQL dinâmico ou permissões de escrita. Nesta revisão está delimitada a booleano do próprio usuário, identidade e sessão ativa + epoch e tabela privada, `search_path` vazio, sem `PUBLIC/anon`, sem grants de SELECT. Restrição permite justificar tecnicamente sua existência, mas não elimina advertência do linter nem garante ausência de defeitos. Alterações futuras na função exigem nova revisão; não resolver alerta abrindo a tabela privada aos usuários.
2. **Sessões:** role desativado bloqueia próxima consulta; role restaurado não ressuscita JWT anterior sob `created_at > updated_at`. Uma sessão Auth anterior pode continuar existindo e possivelmente dar acesso a APIs NÃO relacionadas ao admin conforme outras policies: isto NÃO constitui logout global do Supabase. A sessão órfã anterior foi contada como 1 e barrada pelo epoch, mas não foi deletada. Se `POST logout` remoto falhar, somente cookie do browser é apagado; exigir verificação operacional.
3. **Senha comprometida — WARN aberto:** verificação HIBP desativada em plano Free; recomendação sem gasto automático: senha exclusiva/longa gerada por gerenciador, MFA se aplicável, revisão de política de tentativas e incidentes; Founder deve avaliar eventual Pro com orçamento próprio ou aceitar formalmente o risco residual conforme competência. Nenhuma mitigação adicional foi verificada nesta rodada.
4. **Cache/infra:** response `Set-Cookie` pode vazar se cache compartilhado de reverse proxy/CDN estiver inadequado, mesmo com no-store em app. Falta prova do hPanel e cabeçalhos do login positivo no HEAD novo. A comparação `Origin` versus origem do request pode ser afetada pelo proxy; validar no host efetivo sem enfraquecer a verificação arbitrariamente.

## Condições antes de reavaliar

- Engineering: A06 com papel inativo e browser limpo, confirmar que contagem de `auth.sessions` não aumenta permanentemente e nenhum cookie válido é emitido; reinserir papel somente com autorização registrada, verificar sessão antiga segue negada e novo login funciona.
- Engineering: A08 com sessão positiva nova, clicar Sair, confirmar remoção somente da sessão atual, sem afetar outras, e URLs profundas 303; verificar log genérico e fallback em falha simulada.
- Engineering: A09 coletar headers sanitizados da resposta **positiva** (`Cache-Control`, `Vary`, `Pragma`, apenas flags `Set-Cookie` sem valor), negativa, `/admin` e URL profunda nos servidores dev/standalone; no Hostinger validar HTTPS, bypass `/admin` + `/admin/*`, não armazenar/compartilhar `Set-Cookie`.
- Engineering: reconstrução do HEAD atual `npm ci`, `check:npm-lock`, preflight, regressão, `build`, `build:hostinger`, teste da paridade de migrations quando Docker disponível; revisão humana do PR e proteção de endpoints novos.
- Founder/Quality: decidir e registrar mitigação do aviso de leaked passwords sem presumir plano pago, e revisar evidências consolidadas.

**Parecer:** BLOCK RECOMMENDED até obtenção das evidências acima. Founder não autorizou GO neste ato. Sem merge, deploy, certificação, aprovação autônoma ou mudança de custos.

Fontes: `docs/SB-014_ADMIN_AUTH_ARCHITECTURE.md`, `docs/SB-014_ADMIN_AUTH_EVIDENCE.md`, relatório manual recebido, consultas Supabase; https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable ; https://supabase.com/docs/guides/auth/signout ; https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
