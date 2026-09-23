# SB-017 — Evidências de implantação e critérios de aceite

**Data da verificação:** 22/09/2026, ~22h BRT / 23/09 UTC · **Status:** IMPLEMENTADO NO BANCO, TESTE NEGATIVO HTTP PENDENTE; **NÃO DECLARAR DoD 100%/CONCLUÍDO**. Card: https://trello.com/c/YeGa58dL. Projeto: `tbffwwjqkusiupahjqux`.

## Rastreabilidade

- Branch: `sb-017-private-customer-references` (base `main` SHA `b17dbb1ff6b1a352801b75bb02ac4de99f461700`; main mudou durante a execução de outros cards).
- SQL revisado ANTES de aplicar: `docs/SB-017_PRIVATE_BUCKET_SQL_SOURCE.md`, commit `a6bd510d74efa042b85f85c95be9647fe16d7a6e`.
- Supabase `apply_migration` retornou `success:true`; `list_migrations` confirmou `20260923010326_sb_017_create_private_customer_references`.
- Migration Git: `supabase/migrations/20260923010326_sb_017_create_private_customer_references.sql`, commit `685144da0ccd3561df99fc17df9ab1e2fabb8552`.
- SQL remoto em `supabase_migrations.schema_migrations`: uma instrução, MD5 do `statements[1]` = `59e705da007e5711b636268a00bb23b2`, 830 caracteres. Não declarar paridade byte a byte com Git ou rebuild local sem executar.
- Nenhum GitHub Actions invocado; nenhuma alteração de site, key, cliente ou publicação.

## Consultas remotas e resultados efetivos

```sql
SELECT id,name,public,file_size_limit,allowed_mime_types,created_at
FROM storage.buckets WHERE id='customer-references';
```

Resultado: `id/name=customer-references`, `public=false`, `file_size_limit=10485760`, MIME `image/jpeg,image/png,image/webp`, `created_at=2026-09-23 01:03:26.770525+00`.

```sql
SELECT c.relrowsecurity AS objects_rls,
 (SELECT count(*) FROM storage.objects WHERE bucket_id='customer-references') AS object_count
FROM pg_class c WHERE c.oid='storage.objects'::regclass;
```

Resultados observados: `objects_rls=true`, `object_count=0`; RLS de `storage.buckets=true`. A inspeção de policies começou com zero policies globais, mas **outros cards foram aplicados durante esta rodada**. Inspeção posterior mostrou três policies `sb018_*` explicitamente restritas a `bucket_id='evidence'`; consulta ao bucket de clientes retornou `0` policies que mencionem `customer-references`, `0` possíveis policies de leitura amplas pela consulta executada e `0` objetos. Reinspecionar policies imediatamente antes do teste negativo, pois migrações concorrentes alteram o baseline. A ausência de uma policy para este bucket é deny-by-default pela RLS, embora não substitua teste HTTP.

Tentativa de simular acesso anônimo via `execute_sql` com `SET LOCAL ROLE anon` falhou com `SQLSTATE 42501: permission denied to set role "anon"` (limitação do conector). Tentativa de chamar endpoint Storage por ambiente de execução falhou por DNS indisponível; acesso via web também não foi possível. Não contar ausência de objeto, erro DNS ou falta de permissões do conector como teste HTTP negativo aprovado.

Advisors após aplicação: **Security** 2 INFO de RLS sem policy nas tabelas privadas `app_private`, 1 WARN `public.can_access_admin()` SECURITY DEFINER executável por authenticated, 1 WARN Auth leaked-password protection desabilitada. Esses dois WARN não foram causados por SB-017 e devem ser triados por Engineering/Quality nos cards de Auth; não ignorar no Go/No-Go. **Performance** 5 INFO de índices sem uso no catálogo ainda vazio. Documentação de remediation: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable ; https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection ; https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index .

## Matriz DoD (não inflar comprovação)

| Critério do Trello | Estado | Evidência ou falta |
|---|---|---|
| Bucket privado | PASS SQL | `public=false`, migration aplicada. |
| Não existe leitura pública anônima | PROTEÇÃO CONFIGURADA; teste HTTP PENDENTE | Bucket privado + RLS/policies inspecionadas; sem objeto-canário acessível para teste real. |
| Não existe listagem pública | PROTEÇÃO CONFIGURADA; teste HTTP PENDENTE | Bucket sob RLS; falta POST de listagem com publishable key contra canário presente. |
| Path vinculado a pedido/trabalho sem nome pessoal | ESPECIFICAÇÃO REGISTRADA; implementação futura | `docs/SB-017_CUSTOMER_REFERENCES.md`, convenção de UUIDs. Modelo real SB-053. |
| Administração exige autorização real | FAIL CLOSED atual; teste positivo futuro | Modelo SB-013/SB-014; nenhuma policy de `customer-references` concede acesso ao papel `authenticated`. Dashboard privilegiado tem trilha própria e não foi auditado. |
| URL assinada tem expiração definida se utilizada | DOCUMENTADO, NÃO EXERCIDO | Proposta 300 s, nenhuma URL emitida; handler/auditoria futuros. |
| Retenção permanece pendente | PASS de documentação | PRD RF-14/RNF-17/D-10; não receber dados reais. |
| Nenhuma foto real nos testes | PASS no escopo executado | 0 objetos e nenhuma foto carregada por esta implementação. |

**Bloqueio de conclusão:** falta teste negativo HTTP usando PNG canário sintético realmente presente; evidência sanitizada de código HTTP + resposta/ausência de listagem e exclusão do canário. Manual completo: `SB-017_ROTEIRO_VALIDACAO_MANUAL_2026-09-22.md` (entregue ao Founder). Até confirmação, manter cartão na L99 e registrar implementação parcial. **Owner do teste manual:** Founder (Dashboard/terminal); **owner da avaliação e reconciliação:** Engineering/Quality. Não ativar upload de clientes até política de retenção aprovada, controles de acesso e G3.

## Recuperação

Forward-fix somente mediante nova migration. Não apagar a migration histórica; nunca tornar o bucket público para contornar o teste. Não apagar bucket sem verificar se há objetos/consumidores e sem aprovação pertinente. Antes do cutover, reconciliar remoto↔Git e rodar rebuild local com CLI fora do GitHub Actions.