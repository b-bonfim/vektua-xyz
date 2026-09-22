# SB-012 — Verificação final e encerramento do escopo de RLS

**Data:** 22/09/2026 · **Projeto:** `tbffwwjqkusiupahjqux` · **Card:** https://trello.com/c/6uUc4ykr/69-sb-012p0-habilitar-rls-em-todas-as-tabelas-expostas

## Execução confirmada

- PR #35 https://github.com/b-bonfim/vektua-xyz/pull/35: `state=closed`, `merged=true`, `merged_at=2026-09-22T21:02:03Z`, merge squash SHA `13ce619d56141df4c878cf7a6851a4722fdffaf8`.
- `main` contém as migrations `supabase/migrations/20260922205646_sb_012_rls_public_catalog.sql` e `supabase/migrations/20260922205814_sb_012_rls_transactional_acceptance.sql`, além de `docs/SB-012_RLS_POLICY.md` e `docs/SB-012_RLS_EVIDENCE.md`.
- Histórico remoto Supabase confirma versões `20260922205646` e `20260922205814`, ambas aplicadas com sucesso.
- Consulta após aplicação: seis tabelas em `public`, seis com RLS habilitado, seis com policy SELECT pública filtrada; zero tabelas com INSERT/UPDATE/DELETE autorizado a `anon`/`authenticated` e zero políticas de escrita. Permissões por coluna protegem proveniência e campos internos.
- Teste transacional com `SET LOCAL ROLE anon`, dados sintéticos e rollback: leitura positiva de publicáveis, invisibilidade de rascunhos/suspensos/ocultos/linha inativa, impossibilidade de INSERT/UPDATE/DELETE e SELECT de coluna privada; resultado da migration `success:true`. Consulta posterior: zero dados residuais nas seis tabelas.
- Security Advisors: nenhum finding após DDL. Performance Advisors: cinco findings `INFO unused_index`, não impeditivos neste estágio com tabelas vazias; reavaliar quando houver volume real.
- Trello foi atualizado com as sete DoD marcadas e evidências; após `move`, leitura de confirmação retornou `list.name=Concluído` para o mesmo ID do card, sem duplicação.

## Limites / condições futuras

- O teste deste cartão foi feito no Postgres sob papel `anon`. Não foi feito ataque HTTP público fim a fim; isso pertence a SB-030, juntamente com políticas Storage que serão criadas nos SB-016–SB-018.
- Nenhum dado do catálogo foi importado; frontend, pagamento, portal administrativo, Storage, publicação e cutover não foram modificados ou aprovados por este card. O Admin futuro não deve receber grants irrestritos apenas por ser `authenticated`.
- Exceção ao protocolo de sequenciamento: como a CLI não estava disponível, o MCP gerou e aplicou as migrations antes de seus arquivos homônimos serem espelhados no Git; a inversão e a necessidade de comprovar reconstrução local/paridade byte a byte antes do cutover estão registradas no relatório. Não alterar migration histórica; qualquer correção é forward-fix versionado.
- Nenhuma ação manual do Founder é necessária para encerrar o escopo SQL do SB-012. Nenhum serviço pago, chave privada ou GitHub Actions foi utilizado.

**Evidências canônicas:** `docs/SB-012_RLS_EVIDENCE.md` (matriz completa) e `docs/SB-012_RLS_POLICY.md` (contrato de acesso).
