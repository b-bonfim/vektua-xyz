# SB-011 — Configurações públicas controladas do site

**Data:** 22/09/2026 · **Owner:** Engineering · **Escopo:** modelagem P0, não implementação do Portal Admin nem troca de fonte do storefront.

**Projeto:** `tbffwwjqkusiupahjqux` · **Migration remota:** `20260922201127_sb_011_model_site_settings` · **Arquivo canônico:** `supabase/migrations/20260922201127_sb_011_model_site_settings.sql` · **Tipos:** `lib/supabase/database.types.ts`.

## 1. Finalidade e limites

`public.site_settings` oferece um registro controlado para um conjunto PEQUENO de configurações de apresentação/contato. Não é CMS, armazenamento de HTML, código, payloads arbitrários, anúncios, SKU, preço, gateway de pagamento ou configuração de deploy. O site atual permanece na fonte estática; nenhuma configuração foi cadastrada e não houve cutover, deploy nem publicação.

## 2. Contrato de dados

| Campo | Regra |
|---|---|
| `key` | `text`, PK/única; somente as quatro chaves explicitamente autorizadas por `CHECK`. Nova chave exige nova migration revisada. |
| `value` | `jsonb` não nulo, **somente escalar**: string ou boolean; tipo/shape e tamanho validados por `CHECK`. Nenhum objeto/array. |
| `value_type` | `text` ou `boolean`, obrigatório; tem que coincidir com `jsonb_typeof(value)` e com a chave. |
| `is_public` | `boolean not null default false`; RLS de leitura verifica `is_public=true`. Configuração não publicada não aparece em leitura de `anon` ou `authenticated`. |
| `is_critical` | `boolean not null default false`; a chave de telefone é sempre `true` por CHECK; sinal para fluxo administrativo reforçado futuro, **ainda não é aprovação implementada**. |
| `created_at`,`updated_at` | `timestamptz not null default now()`, ordem validada; trigger preserva `created_at` e atualiza `updated_at` a cada UPDATE. |

### Chaves permitidas no SB-011 — nenhum valor semeado

| Chave exata | Tipo | Validação/uso pretendido | Critical |
|---|---|---|---|
| `site.announcement_text` | texto JSON string | Texto de aviso institucional, 1–180 caracteres após trim; sem HTML/URL. | não |
| `site.whatsapp_button_enabled` | JSON boolean | Preferência visual proposta, não autoriza publicação ou disponibilidade operacional. | não |
| `site.whatsapp_default_message` | texto JSON string | Mensagem padrão genérica, 1–320 caracteres; sem dados de pedido/cliente, HTML/URL. | não |
| `site.contact_whatsapp_number` | texto JSON string | Número institucional E.164, `+` seguido de 8–15 algarismos no total; mudança requer processo admin reforçado futuro. | sim |

A string `site.contact_whatsapp_number` é um **telefone público comercial**, não credencial. Nenhuma chave, telefone, mensagem ou aviso foi inserido na criação da tabela; decidir/validar valores e preencher em card posterior. Não copiar cegamente o número do código do site; conferir diretriz atual do Founder antes de seed/cutover.

## 3. Proibição de segredos e dados privados

**É proibido inserir nesta tabela:** senha, service-role, chave secreta/API key, tokens, OAuth, connection string, webhooks assinados, cookies, headers de autorização, dados pessoais de clientes, referências/fotos privadas, dados bancários, instruções de cobrança e qualquer outra informação operacional privada. Configurações sensíveis devem ficar em gerenciamento apropriado de secrets, nunca no catálogo público. O allowlist bloqueia *chaves* arbitrárias e a validação bloqueia JSON estruturado e URLs/HTML em valores textuais. **Não é possível comprovar por CHECK que toda string humana nunca contenha acidentalmente um segredo**: futuro Admin exige validação adicional, revisão humana e auditoria antes de gravar/publicar textos. Se houver suspeita de segredo, não inserir; rotacionar/revogar no provedor apropriado caso já exposto.

## 4. Segurança e uso

- `RLS=true`, policy **somente SELECT**, para `anon` e `authenticated` com expressão `is_public = true`.
- Grants **apenas SELECT de colunas** `(key, value, value_type)` para esses papéis. `SELECT *` não integra o contrato; metadados/flags/timestamps não têm grants públicos. Nenhum INSERT/UPDATE/DELETE foi concedido ou definido por policy.
- O storefront, quando conectado em card posterior, deverá consultar explicitamente: `from('site_settings').select('key,value,value_type')`. Itens não publicados somem por RLS, mesmo que um cliente saiba a chave. Não há fallback silencioso para valores inexistentes: aplicação define fallback estático conhecido até cutover.
- A futura interface Admin deve autenticar/autorizAR por identidade confiável e papel gerenciado; não usar `user_metadata` editável ou simplesmente `TO authenticated`. Para alterações críticas exigir aprovação/auditoria explícita e aplicar na camada server-side/policies de nova migration; `is_critical` sozinho **não aplica** essas regras.
- A conta de serviço privilegiada não pode ser usada no browser; as permissões do cliente público são exclusivamente de leitura. Nenhuma publicação de chave foi realizada.
- O frontend permanece estático no SB-011; integre somente após os cards de adapter, seed, QA e Gate de cutover.

## 5. Processo futuro de mudança

1. Engineering documenta a nova necessidade/chave, tipo, exposição, risco e validação exata; Quality revisa se houver dado pessoal, promessa ou risco.
2. Para nova chave ou novo formato: **migration forward-fix** e atualização da tabela de chaves permitidas + tipos + testes; não desabilitar checks nem transformar em CMS genérico.
3. Para escrita administrativa: Auth + RBAC confiáveis, autorização por escopo, auditoria (ator, timestamp, chave, antes/depois) e tratamento de alteração crítica sob aprovação aplicável. Nenhuma dessas etapas está implementada neste SB-011.
4. Valores somente públicos quando revisados, habilitados (`is_public=true`) e consumidos pelo site após cutover autorizado; não inserir segredos.

## 6. Validação e rastreabilidade

A migration remota foi aplicada via Supabase MCP e listada na história com `version=20260922201127`; tabela e RLS verificados por `list_tables` e consulta catalogal. Snapshot: 7 colunas, 7 constraints incluindo PK, 1 trigger, policy de SELECT com `is_public=true`, grants de leitura nas colunas públicas, **sem grants de escrita para anon/authenticated, sem leitura pública de `is_public`**, zero registros. Advisors: cinco alertas INFO `rls_enabled_no_policy` referentes a outras tabelas (SB-012); sete INFO `unused_index` referentes a tabelas sem seed; nenhum finding sobre `site_settings` neste snapshot. Relatório completo: `docs/SB-011_SITE_SETTINGS_EVIDENCE.md`.

**Limitação de teste:** a tentativa de INSERT transacional via `execute_sql` retornou `SQLSTATE 25006` (transação read-only). Não se declara teste DML/RLS positivo-negativo com linhas preenchidas; executar após ambiente de testes/manual controlado em SB-012, preservando ausência de seed em produção. Aceite deste card é **modelagem e política estruturais**, não validação de integração end-to-end.

## 7. Recuperação e dependências

Migrations remotas já aplicadas são imutáveis. Qualquer falha gera nova migration forward-fix; não executar DROP em projeto compartilhado. Nenhum registro foi criado para migrar/restaurar. A rollback do storefront continua sendo a seleção da fonte estática, conforme ADR-001; este card não a acionou.

**Dependências subsequentes:** SB-012 (revisão geral RLS e testes positivos/negativos com dados controlados), SB-020/021 (reconciliação e seed autorizado), adapter/cutover e Portal Admin futuro. `is_public=true` não constitui aprovação de negócio, lançamento, licença, pagamento nem disponibilidade de SKU. **Nenhuma ação manual do Founder é necessária para concluir a modelagem; decisões de valores, publicação e cutover permanecem fora do escopo.**
