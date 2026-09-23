# SB-024 — Reconciliação catálogo origem × Supabase

**Data:** 23/09/2026  
**Prioridade:** P0  
**Owner do card:** QA / Engineering  
**Coordenação:** VP Execution Orchestrator  
**Projeto Supabase:** `tbffwwjqkusiupahjqux` (Vektua XYZ)  
**Origem operacional:** storefront em `main` no commit `b4224f41d07b2301e850ec95012cb08e8ab2864b`  
**Status da reconciliação:** **PASS — 0 divergências**  
**GitHub Actions:** **não utilizado**

## 1. Objetivo e escopo

Provar equivalência entre o catálogo que alimenta o storefront e o catálogo migrado para o Supabase antes de qualquer cutover.

A origem canônica usada neste card é `lib/commercial-catalog.ts`, que consolida o catálogo legado e os novos chaveiros. O adaptador estático do site consome esse catálogo. A comparação foi feita contra `public.products`, `public.product_lines` e `public.product_media` no projeto Supabase Vektua XYZ.

O Google Drive foi usado como corroborador da organização de mídia por SKU/linha. A prova file-level da reconciliação deste card vem da origem efetivamente usada pelo storefront em Git + estado atual do Supabase; não se promoveu uma varredura do Drive a equivalência binária nova.

## 2. Snapshot das fontes

### Git / storefront

- `main`: `b4224f41d07b2301e850ec95012cb08e8ab2864b`
- `lib/commercial-catalog.ts`: blob `1091fd5a8681f94285e0d26e7c985965df3b3187`
- `lib/catalog.ts`: blob `8ed9d6773c020511dbe19cb41a3e8a9e5fb08084`
- Produtos comerciais esperados: **30**
- Distribuição esperada:
  - Objetos & Colecionáveis / `objetos`: **4**
  - Datas & Coleções / `datas`: **2**
  - Feitos para Você / `feitos`: **2**
  - Chaveiros / `chaveiros`: **22**
- Mídias comerciais esperadas: **37**, associadas a **28** SKUs.

### Supabase

Consulta read-only executada em 23/09/2026 no projeto `tbffwwjqkusiupahjqux`:

- `public.products`: **30** registros.
- `public.product_lines`: **4** linhas.
- `public.product_media`: **37** registros.
- SKUs com mídia: **28**.
- Mismatch total retornado pela consulta de reconciliação: **0**.

Consulta reproduzível versionada em:

`docs/migration/SB-024_CATALOG_RECONCILIATION_2026-09-23.sql`

Resultado verificado:

```json
{
  "source_product_count": 30,
  "destination_product_count": 30,
  "source_media_count": 37,
  "destination_media_count": 37,
  "source_products_with_media": 28,
  "destination_products_with_media": 28,
  "mismatch_count": 0,
  "mismatches": []
}
```

### Google Drive — corroborador de estrutura

Raiz consultada: `SKUs - Google Drive`.

Pastas de SKU visíveis por linha:

- Linha 1 — Objetos & Colecionáveis: **4** pastas SKU.
- Linha 2 — Datas & Coleções: **2** pastas SKU.
- Linha 3 — Personalizados: **0** pastas de mídia comercial.
- Linha 4 — Chaveiros: **22** pastas SKU.

Total de pastas de SKU com mídia na estrutura consultada: **28**, coerente com os **28** produtos com mídia no storefront/Supabase.

**Limite:** esta consulta ao Drive não foi usada para declarar nova igualdade binária de todos os arquivos. Integridade de bytes da cópia para Storage já pertence à evidência do SB-022.

## 3. Normalização aplicada à mídia

A diferença física de namespace entre site e Storage é esperada e não constitui divergência:

- storefront: `/images/products/remix/<arquivo>`
- Supabase Storage / `product_media.storage_path`: `<SKU>/<arquivo>`

Na reconciliação, o caminho da origem foi normalizado para `<SKU>/<basename>`.

Regras usadas:

1. Se a origem possui `gallery`, a ordem da array é a ordem esperada da galeria.
2. Se não possui `gallery` e possui apenas `image`, a imagem é tratada como galeria singleton, posição 0 e primária.
3. `is_primary=true` é esperado somente na posição 0.
4. Os dois produtos de `Feitos para Você` não possuem mídia no catálogo comercial consolidado: `commercial-catalog.ts` remove deliberadamente as imagens conceituais herdadas do catálogo legado para essa linha.

Consequentemente, `CAN-PET-001` e `CAN-PESSOA-001` com zero `product_media` no Supabase são **equivalência esperada**, e não falta de migração.

## 4. DoD do card

| Critério | Evidência | Resultado |
|---|---|---|
| Contagem de SKUs origem e destino comparada | 30 origem × 30 destino | **PASS** |
| SKUs faltantes listados | Lista vazia | **PASS — 0** |
| SKUs extras listados | Lista vazia | **PASS — 0** |
| Slugs divergentes listados | Comparação por SKU | **PASS — 0** |
| Linha por SKU comparada | 30/30 comparados | **PASS — 0 divergências** |
| Mídia principal e galeria comparadas | 37/37 tuples caminho + posição + primária; 28 SKUs com mídia | **PASS — 0 divergências** |
| Divergências zero ou aceitas/corrigidas antes do cutover | Mismatch total = 0 | **PASS** |
| Erro de migração separado de mudança comercial autorizada | Classificação abaixo | **PASS** |

## 5. Classificação das divergências

### Erros de migração

**0 identificados.**

Não há SKU faltante, SKU extra, slug divergente, linha divergente, mídia ausente/extra ou ordem/primária divergente entre a origem operacional comparada e o Supabase.

### Mudanças comerciais autorizadas

**0 diferenças novas identificadas neste card.**

O card não precisou aceitar nem mascarar qualquer diferença como mudança comercial. A arquitetura atual de quatro linhas e o catálogo corrente já estavam refletidos de forma equivalente na origem e no destino.

### Diferenças intencionais de representação técnica

Duas diferenças de representação foram classificadas como **não divergência**:

- prefixo `<SKU>/` no caminho de Storage;
- ausência de mídia comercial nos dois personalizados, conforme regra explícita de `commercial-catalog.ts`.

Nenhuma delas altera SKU, slug, linha, conteúdo da galeria comercial ou identidade do asset REMIX esperado.

## 6. Evidências dependentes preservadas

- SB-021: seed de 30 produtos / 4 linhas concluído e reconciliado.
- SB-022: 37 arquivos REMIX migrados ao bucket `product-media`, com integridade registrada.
- SB-023: 37 registros de `product_media`, 28 produtos com mídia, ordem e primária verificadas.

Essas dependências são antecedentes; o **PASS do SB-024 foi revalidado contra o estado atual** e não foi inferido apenas dos cartões anteriores.

## 7. Resultado executivo

**SB-024 atende integralmente às DoD documentadas.**

A reconciliação técnica do catálogo pode ser considerada concluída para o escopo deste card. Isso **não** constitui cutover do storefront, liberação comercial de SKU, publicação, aprovação de preço, licença, segurança, conformidade ou Launch Gate.

**Founder Gate:** não requerido para concluir esta reconciliação técnica. O Founder Gate de cutover permanece reservado ao pacote posterior (SB-034 e dependências aplicáveis).

## 8. Próximo passo

Prosseguir para **SB-025 — Implementar `SupabaseCatalogRepository`**, mantendo o storefront ainda sem cutover até os gates de aplicação, segurança, build/smoke e rollback definidos no cronograma.



## 9. Integração da evidência

- PR: **#45 — SB-024: reconcile storefront catalog with Supabase**
- URL: https://github.com/b-bonfim/vektua-xyz/pull/45
- Estado: **MERGED**
- Merge SHA: `dc2b657dfb3731bf09cdc0f6d5d31265aa4f95cd`
- Arquivos integrados:
  - `docs/migration/SB-024_CATALOG_RECONCILIATION_2026-09-23.md`
  - `docs/migration/SB-024_CATALOG_RECONCILIATION_2026-09-23.sql`
- GitHub Actions: **não utilizado**.
