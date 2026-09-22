# SB-011 — Verificação final do merge e encerramento estrutural

**Data:** 2026-09-22 · **Projeto:** Vektua XYZ · **Card:** https://trello.com/c/4qpgyp4H/68-sb-011p0-modelar-configura%C3%A7%C3%B5es-p%C3%BAblicas-do-site

- PR #34: https://github.com/b-bonfim/vektua-xyz/pull/34 — verificado `state=closed`, `merged=true`, `merged_at=2026-09-22T20:17:24Z`.
- Merge squash confirmado: `a40bf9b17ba3ea19cf6b935ebe7f3ba8324f9d2f`.
- Migration canônica confirmada em `main`: `supabase/migrations/20260922201127_sb_011_model_site_settings.sql`.
- Migração remota confirmada `version=20260922201127`, `name=sb_011_model_site_settings`.
- **Paridade do SQL aplicado vs arquivo canônico:** o banco retornou `octet_length(statements[1])=2802` e `md5(statements[1])=d5388d4567af24861b2a786d62f344e2`. Reprodução local exata do texto do arquivo canônico, preservando a ausência de newline final observada no diff GitHub, retornou **2802 bytes e o mesmo MD5**. MD5 é apenas comparação de igualdade operacional, não verificação de segurança criptográfica. A origem da reprodução foi o diff do PR #34; não foi executado `db reset` ou reconstrução local.
- `public.site_settings` tem 0 linhas, RLS habilitado, única policy pública SELECT `is_public=true`, sem INSERT/UPDATE/DELETE para `anon`/`authenticated`, sem leitura de `is_public`; trigger helper não executável diretamente por esses papéis.
- Advisors pós-DDL: apenas INFO sobre outras tabelas/índices; SB-012 é responsável pela revisão global RLS.
- Limite explícito: `execute_sql` está em modo read-only e rejeitou INSERT transacional (`25006`); o teste dinâmico com linhas/roles e o teste de build local **não foram executados**. A conclusão é do modelo e da inspeção estrutural, não da integração/cutover.
- Operações desta rodada usaram Supabase MCP, GitHub PR/merge e Trello, sem invocar GitHub Actions, criar serviço pago, inserir credenciais, alterar frontend ou publicar site.

**Documentação normativa do card:** `docs/SB-011_SITE_SETTINGS.md`. **Matriz de evidências:** `docs/SB-011_SITE_SETTINGS_EVIDENCE.md`. **Estratégia de recuperação:** forward-fix por nova migration, site estático permanece como fallback. **Próximo:** SB-012, RLS geral/testes com dados controlados.
