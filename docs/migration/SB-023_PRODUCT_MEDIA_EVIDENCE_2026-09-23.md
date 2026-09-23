# SB-023 — Evidências de conclusão: `product_media` e proveniência

**Data:** 23/09/2026  
**Card:** `[SB-023][P0] Popular product_media e proveniência`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Repositório:** `b-bonfim/vektua-xyz`  
**Branch:** `sb-023-product-media-provenance-20260923`  
**PR:** #44 — MERGED em 23/09/2026  
**Merge:** `24a59f4ac14bf0979b9138e235fdcb0809d0a524`  
**GitHub Actions:** não utilizado.

## Resultado executivo

**CONCLUÍDO NO ESCOPO DO SB-023.** O PR #44 foi confirmado como merged em `main`; o Trello deve ser atualizado somente após a verificação final do estado remoto.

A migration remota `20260923140147_sb_023_seed_product_media_provenance` foi aplicada com sucesso e reconciliada contra os objetos reais do bucket `product-media`.

Resultado verificado:
- **37** linhas em `product_media`;
- **28** produtos com mídia;
- **0** linhas sem `product_id`;
- **0** `storage_path` sem objeto correspondente;
- **0** objetos órfãos no lote `product-media`;
- **37/37** linhas classificadas como `remix`;
- **37/37** com `file_state='verified'`;
- **28** imagens primárias, exatamente uma por produto;
- **0** produtos com falha de sequência de galeria;
- **0** ativos conceituais reclassificados como REMIX;
- **2** produtos sem mídia porque não possuem objeto REMIX no lote migrado: `CAN-PESSOA-001` e `CAN-PET-001`;
- **0** produtos `published/public` no estado atual; portanto a população da tabela não promoveu nenhum SKU ao storefront por si só.

## Entradas verificadas

### SB-019 — inventário congelado
Origem canônica dos bytes/proveniência:
- commit: `b17dbb1ff6b1a352801b75bb02ac4de99f461700`;
- diretório: `public/images/products/remix/`;
- manifesto: `docs/migration/SB-019_REMIX_MANIFEST_2026-09-22.csv`;
- 37 arquivos / 28 SKUs.

### SB-022 — Storage
PR #43 foi confirmado como merged antes da execução do SB-023.
O SB-022 provou 37/37 uploads, 23.879.271 bytes e igualdade de hash/tamanho. O bucket contém 37 objetos no padrão `{sku}/{filename}`.

## Implementação

Cada objeto válido do bucket `product-media` é associado ao produto pelo primeiro segmento do path, que é o SKU.

Mapeamento:
- `product_id`: FK resolvida por SKU;
- `storage_bucket`: `product-media`;
- `storage_path`: path real do objeto;
- `media_type`: `remix`;
- `gallery_position`: zero-based, preservando a ordem 1-based do manifesto;
- `is_primary`: somente posição 0;
- `is_public`: `true` como **intenção de publicação da mídia**, não como liberação comercial do produto;
- `file_state`: `verified`;
- `origin_reference`: commit Git congelado + caminho original;
- `source_media_id`: `null`, pois o lote não contém mídia-fonte armazenada em `product_media`.

A migration é idempotente por `ON CONFLICT (product_id, storage_bucket, storage_path) DO NOTHING` e possui assertions que abortam a execução se as contagens, objetos, proveniência, ordem ou primária divergirem.

## Reconciliação das DoD

- [x] **Toda mídia publicada possui `product_id`.**  
  37/37 linhas possuem FK válida; linhas sem `product_id`: 0.

- [x] **`storage_path` resolve para objeto existente.**  
  Objetos ausentes: 0 em 37; join verificado contra `storage.objects` em modo somente leitura.

- [x] **Ordem da galeria é preservada.**  
  Todas as galerias são contíguas de 0 a N-1. Quatro SKUs têm múltiplas imagens: `G-CHV-JJ-01` (3), `G-ORG-HS-01` (3), `S-HAL-DEC-01` (4), `S-NAT-PRE-01` (3).

- [x] **Imagem principal é definida de forma determinística.**  
  Exatamente uma primária por produto, sempre `gallery_position=0`: 28/28.

- [x] **REMIX permanece classificada como REMIX.**  
  37/37 registros têm `media_type='remix'`; `origin_reference` obrigatório e preenchido.

- [x] **Conceitual permanece classificada como conceitual.**  
  O lote SB-022 contém exclusivamente REMIX. Nenhum ativo conceitual entrou no bucket público nem foi transformado em REMIX; `concept_rows=0`. As constraints existentes ainda impedem `concept/reference` de serem públicas/galeria por padrão.

- [x] **Arquivo órfão não aparece no storefront por engano.**  
  0 objetos órfãos no lote. Além disso, a policy existente de leitura pública de `product_media` exige mídia `remix/verified/public` **e** produto pai `published/public`. No estado atual há 0 produtos `published/public` com mídia.

## Resultado bruto da consulta de reconciliação

```json
{
  "rows": 37,
  "bad_origin": 0,
  "remix_rows": 37,
  "bad_gallery": 0,
  "concept_rows": 0,
  "primary_rows": 28,
  "verified_rows": 37,
  "reference_rows": 0,
  "real_photo_rows": 0,
  "public_intent_rows": 37,
  "products_with_media": 28,
  "orphan_storage_objects": 0,
  "products_without_media": 2,
  "rows_without_product_id": 0,
  "storage_objects_missing": 0,
  "published_public_products_with_media": 0
}
```

## Segurança e limites

A tentativa de simular `SET ROLE anon` via conector SQL foi recusada pela própria permissão do conector (`permission denied to set role "anon"`). Isso **não é tratado como teste aprovado**. O teste ofensivo efetivo de API/RLS continua reservado ao SB-030.

Os Security Advisors pós-migration reportaram achados pré-existentes no domínio Auth/Admin (duas tabelas privadas com RLS sem policy, uma função SECURITY DEFINER executável por authenticated e leaked-password protection desabilitada). Nenhum finding apontou esta população de `product_media` ou os objetos do bucket. Esses itens permanecem fora do escopo do SB-023 e não foram mascarados.

A execução deste card:
- não altera objetos do Storage;
- não publica produtos;
- não faz cutover do storefront;
- não comprova licença, foto real, preço, estoque, capacidade, conformidade ou Founder Gate;
- não elimina o catálogo estático.

## Evidências versionadas

- Migration: `supabase/migrations/20260923140147_sb_023_seed_product_media_provenance.sql`
- Query de reconciliação: `docs/migration/SB-023_PRODUCT_MEDIA_RECONCILIATION_2026-09-23.sql`
- Este relatório: `docs/migration/SB-023_PRODUCT_MEDIA_EVIDENCE_2026-09-23.md`
- PR: https://github.com/b-bonfim/vektua-xyz/pull/44
- Merge: `24a59f4ac14bf0979b9138e235fdcb0809d0a524`

## Próximo passo

**SB-024 — Executar reconciliação catálogo origem × Supabase.**

Nenhuma ação manual do Founder é necessária para concluir o SB-023.
