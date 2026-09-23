# SB-018 — Bucket privado `evidence`: contrato e evidências

**Data:** 22/09/2026 (America/Sao_Paulo, aproximadamente 22h05) · **Prioridade:** P1 · **Owners:** Engineering / Quality  
**Projeto:** `tbffwwjqkusiupahjqux` · **Card:** https://trello.com/c/0Hm9OlnT/  
**Dependência:** SB-012 concluído; integração administrativa SB-014 ainda em HOLD.  
**Escopo concluído:** criação e isolamento SQL/RLS do bucket. **Não significa portal admin pronto, upload de clientes, cutover ou lançamento.**

## 1. Artefatos e histórico

- Branch: `sb-018-private-evidence-storage`; base da `main`: `b17dbb1ff6b1a352801b75bb02ac4de99f461700`.
- Migration: `supabase/migrations/20260923010442_sb_018_private_evidence_storage.sql`.
- Histórico remoto conferido: versão `20260923010442`, nome `sb_018_private_evidence_storage`; `apply_migration` retornou `success:true`.
- Exceção operacional ao protocolo SB-003: CLI Supabase não estava instalada no ambiente desta rodada e a tentativa de invocação sem instalação não concluiu. A migration foi aplicada via MCP e o arquivo Git recebeu imediatamente o **mesmo SQL** e o nome exato retornado pelo histórico remoto. Rebuild local/paridade automatizada NÃO verificados; exigidos antes do cutover.
- Não foram usados GitHub Actions, service-role key, contas fictícias, arquivos de clientes ou compras.

## 2. Contrato de armazenamento

- Bucket `evidence`, `public=false`, sem limite de tamanho ou MIME específico por bucket nesta etapa (`NULL` = observar limites globais do projeto; revisão futura para upload real). Nenhum objeto foi inserido nesta rodada.
- Apenas os papéis ativos `founder` ou `admin`, com sessão Auth válida e posterior à última alteração de atribuição, podem visualizar metadados do bucket, listar/ler e adicionar objetos pela API Storage. Exige conjuntamente `public.can_access_admin()` (controle de sessão SB-014) e `app_private.has_admin_role(ARRAY['founder','admin'])` (fonte de papéis SB-013). Estar apenas `authenticated` não basta.
- `anon` NÃO tem policy para `evidence`, USAGE de `app_private` nem EXECUTE de `has_admin_role`. `authenticated` recebeu apenas USAGE do schema e EXECUTE da função de verificação de seu próprio papel; segue sem SELECT na tabela privada de atribuições. Não se concedeu acesso a `catalog_editor`, `operations`, `viewer` nem papéis de cliente.
- Policies aplicadas: `sb018_evidence_bucket_admin_select` em `storage.buckets`; `sb018_evidence_object_admin_select` e `sb018_evidence_object_admin_insert` em `storage.objects`. Nenhuma policy de UPDATE/DELETE: acesso de navegador é *append-only*; uma regra de descarte requer implementação futura revisada.
- O bucket não integra o bucket público `product-media`; o contrato `product_media` admite publicação apenas de `remix` em `product-media`. Nenhum objeto foi copiado para o storefront.

### Convenção de chave obrigatória

`<classe>/<id-interno>/<uuid-opaco>.<ext>`; classes aceitas por RLS: `gates`, `tests`, `qa`.

Exemplos **fictícios, não arquivos criados**:

- `gates/G1/12345678-1234-1234-1234-123456789abc.pdf`
- `tests/SB-018/12345678-1234-1234-1234-123456789abc.json`
- `qa/CASE-001/12345678-1234-1234-1234-123456789abc.png`

Usar sempre IDs internos sem dados pessoais. Proibidos nomes, CPF, email, telefone, texto livre, URL assinada ou token nos caminhos e no Trello. O segundo segmento deve representar somente ID sintético/gerencial. Regex de INSERT permite três classes, um identificador técnico curto, UUID e extensão curta em minúsculas. A regex não consegue detectar semanticamente se o identificador escolhido contém um nome: o procedimento de upload deve validar esse ponto antes de aceitar arquivos reais.

**Retenção:** categorias separadas habilitam estabelecer futuramente prazo e descarte por `gates/tests/qa`; NÃO se definiu prazo, job automático, exclusão ou política legal nesta rodada. Quality/Founder devem aprovar matriz de retenção por tipo, base/finalidade e trilha de descarte antes de automatizar. Não excluir artefatos de gate por inferência.

## 3. Evidências das cinco DoD

| DoD | Evidência obtida | Resultado no escopo |
|---|---|---|
| Bucket privado criado | SQL de leitura do Storage listou `evidence`, `public=false`, sem objetos; migration aplicada e listada | **ATENDIDA** |
| Acesso apenas a papéis administrativos autorizados | 3 policies `TO authenticated` vinculadas a sessão válida **E** papel ativo founder/admin; `anon` sem USAGE/EXECUTE da função; authenticated sem SELECT na tabela privada | **ATENDIDA por configuração**; upload positivo de usuário admin real permanece para teste E2E SB-014/SB-030 |
| Caminhos sem PII desnecessária | Convenção versionada, prefixos `gates/tests/qa`, identificador/UUID, regex na policy INSERT; exemplo válido retornou `true`, nome livre retornou `false` | **ATENDIDA como contrato e validação de formato**; conteúdo/IDs exigem revisão humana antes de uso real |
| Evidências não publicadas automaticamente | Bucket `public=false`, sem policy anônima; contrato SB-010 publica apenas `remix` de `product-media`; nenhum objeto/integração de storefront adicionado | **ATENDIDA no escopo SQL** |
| Retenção/descarte parametrizáveis futuramente | Tipos separados no primeiro segmento, INSERT não admite outro prefixo; UPDATE/DELETE negados a browser; retenção real pendente de policy/procedimento próprios | **ATENDIDA como estrutura futura**, sem declarar política de descarte aprovada |

### Checagens efetivamente realizadas

1. `Supabase.get_project`: projeto `ACTIVE_HEALTHY`.
2. Antes desta migration, consulta a `storage.buckets` retornou `[]`; após, listou os buckets `customer-references` (privado), `evidence` (privado) e `product-media` (público). Os outros dois buckets foram criados por migrations SB-016/SB-017 separadas no mesmo período, não por este card.
3. Consulta `pg_policies` retornou **três policies SB-018**, somente em `storage.buckets` e `storage.objects`; commands SELECT/SELECT/INSERT, todas `TO authenticated`, com predicados de papel e sessão.
4. Teste do regex armazenado com duas strings fictícias: formato UUID aceito (`true`), caminho contendo nome de relatório sem UUID recusado (`false`).
5. Consulta de privilégios: `anon_schema_usage=false`, `anon_function_exec=false`; `authenticated_schema_usage=true`, `authenticated_function_exec=true`, `authenticated_private_table_read=false`; `storage.objects` no bucket `evidence` = 0.
6. Tentativa de impersonar role `anon` no SQL MCP foi **recusada** com `42501 permission denied to set role "anon"`; o ambiente container não resolveu DNS do endpoint. Por isso **não foi executado teste negativo HTTP/Storage com token anon, nem teste positivo de upload admin real**. Não transformar verificação estrutural em teste E2E.

## 4. Advisors pós-migration

**Security Advisors (22/09/2026, 22h05 BRT):** 2 INFO (tabelas `app_private` intencionalmente sem policies), 2 WARN **preexistentes**: `public.can_access_admin()` SECURITY DEFINER invocável por authenticated e proteção contra senhas vazadas desativada. Ambos vinculados à revisão SB-014/SB-015; nenhum novo WARN de Storage reportado nesta consulta. Fonte oficial para revisão: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable e https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . **Não são considerados resolvidos.**

**Performance Advisors:** 5 INFO de índices de catálogo ainda não usados, sem relação causal verificada com SB-018. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index .

## 5. Limites, owner e próxima etapa

- **Engineering / SB-014 e SB-030:** obter evidências de login/sessão/atribuição reais autorizadas, tentativa de leitura/listagem/download/upload `anon` (negativo), sessão `authenticated` sem papel (negativo), `viewer` (negativo) e admin ativo (positivo), mais revogação imediata; registrar HTTP sanitizado sem JWT no relatório.
- **Quality / Founder:** resolver ou decidir adequadamente WARN de segurança SB-014 e política de retenção para dados reais; proibir colocar fotos pessoais e credenciais como teste deste card.
- **Engineering / SB-045 e Admin MVP:** definir fluxo de upload, geração de UUID, tamanho/MIME apropriados, auditoria e eventual política de deleção somente após aprovação.
- **Engineering antes de cutover:** executar rebuild/paridade de migrations no ambiente local, comparar Git ↔ Supabase, testar no ambiente alvo e registrar evidência.
- **Founder Gate:** não há pedido de gasto nem decisão comercial neste SB-018. Lançamento, cutover e uso de evidências reais seguem gates próprios.

**Recuperação:** erro na policy ou naming exige migration *forward-fix* e nova rodada de Advisors; nunca editar a migration aplicada ou apagar bucket com arquivos. Com bucket vazio, não há perda de objetos nesta entrega.
