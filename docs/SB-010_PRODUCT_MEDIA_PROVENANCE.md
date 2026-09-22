# SB-010 — Mídia e proveniência do catálogo

**Data:** 22/09/2026 · **Escopo:** modelagem de dados P0 · **Supabase:** `tbffwwjqkusiupahjqux` · **Status:** migration aplicada; integração e Storage ainda não implantados.

**Fonte:** card `[SB-010][P0] Modelar mídia e proveniência`, na L99 do Trello; decisões atuais do Founder sobre utilização exclusiva de imagens com REMIX no site. A estrutura comercial vigente tem quatro linhas conforme PRD v1.1/Master Product Dossier v1.1; os playbooks antigos de três linhas são históricos neste domínio.

**Migration imutável:** `supabase/migrations/20260922193533_sb_010_model_product_media_provenance.sql` (histórico remoto `20260922193533_sb_010_model_product_media_provenance`). **Tipos:** `lib/supabase/database.types.ts`. Nenhuma alteração de storefront, seed, Auth, permissão pública ou imagem foi feita neste card.

## Contrato de `public.product_media`

| Campo | Significado |
|---|---|
| `id`, `product_id` | UUID da mídia e FK obrigatória/restritiva para `products.id`; o SKU permanece em `products.sku`, sem cópia divergente. |
| `storage_bucket`, `storage_path` | Bucket e chave RELATIVA, não URL pública ou placeholder. Par `(product_id,storage_bucket,storage_path)` é único. Caminho não aceita barra inicial, travessia `..`, segmentos `.` ou URL completa. |
| `media_type` | `real_photo`, `remix`, `concept`, `reference`, restritos por CHECK. Tipo é classificação declarada, não comprovação fotográfica ou licença. |
| `alt_text` | Texto alternativo opcional em rascunho; obrigatório para intenção de publicação; texto em branco é inválido. |
| `gallery_position` | Índice inteiro não negativo, começando em zero; `NULL` não integra galeria. Único por produto quando preenchido. |
| `is_primary` | Marcador booleano; apenas imagem pública pode ser principal; índice único parcial limita a uma principal por produto. Não exige que um produto sem imagens tenha principal fictícia. |
| `is_public` | **Intenção editorial**, `false` por padrão; NÃO concede acesso público nem representa aprovação de SKU. Só `remix` no bucket `product-media` pode ser marcado público, com `alt_text`, posição e `file_state='verified'`. |
| `file_state` | `pending` por padrão, `verified` ou `missing`; estado declarado pelo operador, NÃO substitui verificação viva do objeto. |
| `origin_reference` | Origem/referência interna obrigatória para `remix`, por exemplo identificador da imagem original no Drive, sem credenciais nem informações pessoais desnecessárias; não expor na resposta anônima. |
| `source_media_id` | FK opcional para outra mídia **do mesmo produto**; ajuda a ligar REMIX a foto original quando esta for cadastrada. FK restritiva impede apagar origem referenciada. |
| `created_at`, `updated_at` | Timestamps; ordem validada. Atualização automática não existe nesta etapa. |

### Regras obrigatórias

1. **REMIX no site:** a diretriz editorial do Founder vale mesmo se outro tipo for cadastrado. `storage_bucket='product-media'` aceita apenas `remix` e `is_public=true` exige esse bucket/tipo. A marcação não realiza upload ou publicação do site. Somente imagens com uso autorizado, aprovadas no escopo aplicável e fisicamente verificadas devem chegar ao bucket público no fluxo posterior.
2. **Referências privadas:** `reference` e `concept` não recebem posição de galeria, imagem principal ou `is_public=true`, e não podem morar no bucket público `product-media`. Fotografia pessoal de cliente não deve ser cadastrada nesta tabela genérica por padrão; futuramente SB-017/SB-053 definirão bucket privado, vínculo com pedido/trabalho, consentimentos e retenção. Não cadastrar dados pessoais ou imagem de cliente como seed.
3. **Proveniência:** todo `remix` exige `origin_reference`; `source_media_id`, quando fornecido, só pode apontar para mídia do mesmo produto. A alteração de `is_public` não remove origem. A tabela não implementa trilha histórica de cada edição: futura interface administrativa deverá auditar substituições e não sobrescrever silenciosamente ativos.
4. **Ordem:** ordenar por `(gallery_position ASC, id ASC)`; a restrição de unicidade garante posição sem empate por produto. Para trocar duas posições, o admin futuro deverá executar uma operação transacional controlada, por exemplo liberando posição temporariamente com `NULL`, respeitando CHECK de mídia pública; não presumir que trocar duas posições públicas em um UPDATE funcionará.
5. **Arquivo inexistente:** trigger `product_media_require_existing_public_object_trg` consulta `storage.objects` antes de inserir/promover/alterar objeto declarado público, rejeitando ausência ou invisibilidade do objeto. Ele é `SECURITY INVOKER` e não altera tabelas internas de Storage. **A exclusão posterior via Storage ainda pode quebrar uma mídia publicada**: o servidor deve revalidar a existência na leitura e bloquear/alertar, nunca inserir placeholder sem registro. Upload, movimentação e exclusão de objetos devem usar API Storage, não SQL nas tabelas internas.
6. **Acesso:** RLS habilitado, grants `anon`/`authenticated` revogados e nenhuma policy até SB-012. Não conceder `SELECT *` anônimo: `origin_reference` e `source_media_id` são campos internos; projetar somente dados permitidos. `is_public` não é política de acesso e produto em draft/suspenso continua bloqueado pelos gates de publicação.

## Consulta de galeria — exemplo executado, somente leitura

Esta consulta é **de servidor confiável ou sessão administrativa autorizada**, pois consulta metadados de `storage.objects`. Antes de utilizá-la no storefront, criar no SB-012 uma projeção pública reduzida e autorizada, com política de produtos e mídia. O consumidor deve tratar `MISSING_OBJECT` como erro explícito, registrar o problema e não disfarçá-lo com imagem genérica.

```sql
select
  p.sku,
  m.id as media_id,
  m.storage_bucket,
  m.storage_path,
  m.media_type,
  m.alt_text,
  m.gallery_position,
  m.is_primary,
  (o.id is not null) as object_exists,
  case when o.id is null then 'MISSING_OBJECT' else 'READY' end as delivery_state
from public.products as p
join public.product_media as m on m.product_id = p.id
left join storage.objects as o
  on o.bucket_id = m.storage_bucket and o.name = m.storage_path
where p.sku = 'SB010-EXEMPLO-SOMENTE-LEITURA'
  and m.is_public = true
  and m.media_type = 'remix'
order by m.gallery_position asc, m.id asc;
```

A execução retornou `[]`, coerente com `products=0`, `product_media=0` e ausência de buckets/objetos no momento da inspeção. **Retorno vazio NÃO valida upload, URL pública, existência de fotos nem renderização ponta a ponta.** O serviço consumidor também deve distinguir produto sem mídia de erro de consulta, e retornar estado explícito de catálogo incompleto, não inventar capa.

## Dependências e limites

- **SB-012:** políticas de acesso por estado de produto/mídia; testes positivos e negativos da API. Não criar policy anônima ampla nem conceder o campo de proveniência.
- **SB-016:** criar bucket público `product-media`, chave `{sku}/...`, MIME/tamanho/políticas; lembre que objetos em bucket público ficam acessíveis pela URL independentemente de `is_public` no banco: subir só arquivos selecionados.
- **SB-017/SB-018:** buckets privados de referências de cliente/evidências; não misturar referências sensíveis com mídia pública.
- **SB-020/SB-021:** extrator/seed real devem reconciliar caminho, classificação e origem sem criar objetos imaginários.
- **SB-045:** editor/admin deverá validar upload, auditoria, ordenação, remoção, classificação e tratamento explícito de imagem ausente. Nenhum componente UI foi alterado neste card; Impeccable não é ferramenta de backend.

## Reversibilidade

Não editar/apagar migration aplicada nem fazer DROP em produção compartilhada. Erros devem ser corrigidos por **nova migration forward-fix**, preservando referências. Nenhum catálogo, arquivo ou publicação foi migrado. Conclusão deste SB-010 é **estrutural/documental**, não libera SKU, Storage, cutover nem lançamento.

Ver relatório `docs/SB-010_PRODUCT_MEDIA_PROVENANCE_EVIDENCE.md` para evidência verificada e limitações de teste.
