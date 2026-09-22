# Evidências de execução — SB-011

**Executado em:** 2026-09-22, horário de Brasília · **Escopo:** modelagem estrutural/configuração pública · **Owner:** Engineering. **Não representa cutover, publicação, Portal Admin ou validação E2E.**

## Identificação

- Card: https://trello.com/c/4qpgyp4H/68-sb-011p0-modelar-configura%C3%A7%C3%B5es-p%C3%BAblicas-do-site
- Supabase project: `tbffwwjqkusiupahjqux` (`ACTIVE_HEALTHY`, PostgreSQL 17); tabela `public.site_settings`.
- Base `main` Git SHA: `0251a884d488ba26a2f80588019bc5f0b3ee479c`.
- Branch Git: `sb-011-site-settings`.
- Migration real aplicada via Supabase MCP `apply_migration`: nome `sb_011_model_site_settings`.
- Histórico remoto confirmado via `list_migrations`: `20260922201127`.
- Arquivo canônico versionado: `supabase/migrations/20260922201127_sb_011_model_site_settings.sql`.
- Tipos oficiais: gerados via `generate_typescript_types`, atualização no `lib/supabase/database.types.ts`, incluindo `site_settings`.
- PR/merge SHA: registrar após criação/merge e leitura de verificação. Não presumir.

## Verificações efetivas no banco

| Critério observado | Resultado do conector |
|---|---|
| Migration registrada | `20260922201127 / sb_011_model_site_settings` |
| Tabela existente | `to_regclass('public.site_settings')` retornou tabela; `list_tables` mostra `rls_enabled=true`, `rows=0` |
| Modelo | 7 colunas: `key`, `value`, `value_type`, `is_public`, `is_critical`, `created_at`, `updated_at` |
| Unicidade e validação | 7 constraints no catálogo, incluindo PK, allowlist, tipos, shape por chave, ausência de URLs/markup, criticidade e ordem temporal |
| Timestamps automáticos | `site_settings_touch_updated_at_trg` presente (1 trigger próprio), preserva `created_at` e atualiza `updated_at` |
| Leitura por RLS | policy `site_settings_storefront_public_read`, comando `SELECT`, roles `anon`,`authenticated`, filtro `(is_public = true)` |
| Colunas públicas | `has_column_privilege('anon', 'key'/'value', 'select') = true`; `is_public` = false |
| Escrita pública | `has_table_privilege('anon', insert/update/delete)` = false; idem `authenticated` |
| Seed | 0 registros; nenhuma chave/valor real persistido |
| Status do site | frontend/carrinho/WhatsApp/deploy não alterados neste card |

### Leitura de segurança

- Papéis públicos têm SELECT **somente** de `(key, value, value_type)`; nenhum grant de escrita ou policy de escrita. `SELECT *` não é o contrato público.
- O allowlist impede nomes arbitrários; `jsonb` só aceita string/boolean coerente e com shape específico. Valores textuais rejeitam URLs/HTML. Segredos e credenciais são proibidos pelo contrato/documentação/comentário da tabela. Não alegar detecção completa de segredos ocultos em texto livre: o futuro Admin deve validá-los antes da gravação.
- A chave de telefone comercial tem `is_critical=true` obrigatório, mas o workflow de autorização/auditoria administrativa **ainda não existe**. Hoje, operações privilegiadas são necessárias para qualquer mutação.

## Advisors consultados após DDL

- **Security Advisors:** apenas `INFO rls_enabled_no_policy`, 5 findings em `product_lines`, `products`, `product_variants`, `product_prices` e `product_media`. **Nenhuma ocorrência em `site_settings`.** Tratamento geral reservado ao SB-012. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- **Performance Advisors:** apenas `INFO unused_index`, 7 findings de índices em outras tabelas vazias (product_lines/products/product_variants/product_prices/product_media). Nenhuma ocorrência em `site_settings`; sem seed, não remover índices precipitadamente. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Testes e limites honestos

- **PASS estrutural:** tabela/colunas/constraints/PK/trigger/RLS/policy/grants/histórico remoto inspecionados via `list_tables` e `execute_sql` de leitura.
- **NÃO EXECUTADO — DML transacional:** tentativa de `BEGIN; INSERT ...; ROLLBACK;` via `execute_sql` retornou `SQLSTATE 25006: cannot execute INSERT in a read-only transaction`. Portanto, não declarar testes de inserção/rejeição, atualização de timestamp ou leitura com linhas públicas/ocultas efetivamente executados; os mecanismos foram verificados por introspecção. Executar testes positivo/negativo controlados posteriormente em ambiente de teste ou caminho administrativo apropriado dentro do SB-012. Sem seed fictício em produção.
- **NÃO EXECUTADO — build/QA do frontend:** nenhum código da UI foi alterado. Sem deploy.
- **Impeccable:** revisão visual não aplicável a uma alteração exclusivamente de schema. A UX real poderá ser revisada quando houver Portal Admin/frontend em escopo.

## Desvio de protocolo e reconciliação

A CLI Supabase não estava instalada no ambiente de execução. Foi criada antes da aplicação uma cópia de SQL para revisão na branch (`docs/SB-011_SQL_STAGING.sql`). Uma primeira tentativa remota com controles de detecção textual de credenciais foi bloqueada pela ferramenta **sem aplicar schema**; `to_regclass('public.site_settings')` retornou `NULL`. O SQL foi simplificado para a lista estrita de chaves, checagens de tipo/shape e restrição de URL/markup e aplicado em uma segunda tentativa. O arquivo canônico foi criado com o timestamp **efetivamente atribuído pelo Supabase**, e o staging divergente foi excluído da branch. Não editar a migration aplicada. A restrição contratual de segredos permanece e deve ser aplicada adicionalmente no futuro Admin.

**Exceção documentada:** a fonte SQL existiu em Git antes da DDL, mas o nome timestampado final só pôde ser consolidado após a versão gerada pelo MCP, em vez de CLI local. A versão canônica e a versão remota coincidem. Verificar reprodução integral em banco local descartável antes de futuros deploys/reconstruções; não afirmar que esse teste foi realizado agora.

## Recuperação

Sem DML persistente e sem alteração de storefront. Corrigir eventuais erros com migration adicional forward-fix, sem apagar tabela/migration compartilhada; fallback estático do site segue inalterado. Não houve GitHub Actions, novo serviço pago, compra, publicação ou Founder Gate comercial.

## DoD do card

| DoD | Evidência | Resultado no escopo |
|---|---|---|
| Chave única, JSON tipado e timestamps | PK/constraints/trigger introspectados | PASS estrutural |
| Escopo inicial documentado | `docs/SB-011_SITE_SETTINGS.md`, quatro chaves exatas | PASS documental |
| Proibir segredos e credenciais | allowlist de chaves, JSON controlado, proibição expressa; validação humana futura reconhecida | PASS contratual, com risco residual de texto livre |
| Leitura somente quando pública | RLS SELECT `is_public=true` e grants por coluna, sem seed | PASS estrutural; teste com dados pendente para SB-012 |
| Configurações críticas com autorização futura | `is_critical` obrigatório para telefone, sem concessão de escrita pública; RBAC/auditoria futura documentados | PASS de modelagem; RBAC ainda não implementado |

**Conclusão restrita:** a modelagem estrutural do SB-011 está implementada e verificada por catálogo; testes dinâmicos e Portal Admin pertencem às próximas etapas. Não implica liberação da migração geral ou qualquer gate comercial.
