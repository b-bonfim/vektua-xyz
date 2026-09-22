# SB-008 — Evidências de conclusão

**Data:** 22/09/2026  
**Card:** [SB-008][P0] Modelar `products`  
**Branch:** `feat/sb-008-products-20260922`  
**Base:** `main@f918b9013721dc15be48f37e2124a19446bcf59d`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Migration:** `20260922190558_sb_008_create_products`  
**PR:** #31 — https://github.com/b-bonfim/vektua-xyz/pull/31  
**Merge commit:** `86ca108488bab2a9bc559ded5ad866325f97ae67`  
**Status:** CONCLUÍDO E INTEGRADO À `main`.  
**GitHub Actions:** NÃO utilizado.

## Dependência SB-007

Confirmada antes da execução:
- `public.product_lines` existente;
- migration remota `20260922185539_sb_007_create_product_lines`;
- RLS habilitado;
- 0 registros;
- documentação/evidência do SB-007 integrada à `main`.

## Evidência remota do SB-008

- projeto Vektua XYZ: `ACTIVE_HEALTHY`;
- migration `20260922190558 / sb_008_create_products` registrada;
- tabela `public.products` criada;
- 0 registros após a migration;
- RLS: habilitado;
- grants observados para `anon`, `authenticated` e `service_role`: 0 na inspeção;
- policies: 0, intencionalmente adiadas ao SB-012.

## Colunas verificadas

- `id uuid primary key default gen_random_uuid()`
- `sku text not null unique`
- `slug text not null unique`
- `product_line_id uuid not null`
- `name text not null`
- `description text null`
- `collection text null`
- `category text null`
- `personalized boolean not null default false`
- `status text not null default 'draft'`
- `visibility text not null default 'hidden'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## Constraints verificadas

- PK: `products_pkey`
- UNIQUE: `products_sku_key`, `products_slug_key`
- FK: `products_product_line_id_fkey` → `product_lines(id)` com `ON UPDATE RESTRICT ON DELETE RESTRICT`
- CHECKs de SKU/slug não vazios
- CHECK de formato de slug
- CHECK de nome não vazio
- CHECKs de campos opcionais não vazios quando presentes
- CHECK de status `draft|publishable|published|suspended`
- CHECK de visibility `hidden|public|unlisted`
- CHECK `updated_at >= created_at`

## Índices verificados

- `products_pkey(id)`
- `products_sku_key(sku)`
- `products_slug_key(slug)`
- `products_product_line_id_idx(product_line_id)`
- `products_status_idx(status)`

SKU e slug já recebem índices B-tree únicos por suas constraints; não foram duplicados com índices adicionais.

## Advisors

### Security
`INFO rls_enabled_no_policy` para `product_lines` e `products`.

**Tratamento:** esperado e aceito nesta etapa. O SB-012 é o card responsável por grants/policies e pelos testes RLS positivos/negativos. RLS já está habilitado e as tabelas estão vazias.

Remediação oficial: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

### Performance
`INFO unused_index` para:
- `product_lines_position_idx`
- `products_product_line_id_idx`
- `products_status_idx`

**Tratamento:** esperado. As tabelas possuem 0 registros e ainda não são consumidas pelo storefront. Reavaliar com dados reais e queries observadas.

Remediação oficial: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

**Findings críticos/altos observados:** nenhum.

## Teste de escrita temporária

Foi tentado um teste transacional com dados temporários para validar violações de UNIQUE/CHECK/FK. O conector disponível executou `execute_sql` em transação read-only e rejeitou o primeiro INSERT com `cannot execute INSERT in a read-only transaction`.

Esse teste **não é contado como PASS**. A conclusão do SB-008 se apoia na inspeção estrutural direta das constraints/indexes/FK/RLS, que corresponde ao DoD deste card. Testes de acesso/leitura/escrita pela Data API pertencem ao SB-012.

## Tipos TypeScript

Tipos foram gerados diretamente do projeto Supabase após a migration e versionados em `lib/supabase/database.types.ts`. Os tipos públicos do domínio continuam independentes da tabela conforme SB-006.

## DoD

- [x] `id` UUID primário.
- [x] `sku` único e obrigatório.
- [x] `slug` único e obrigatório.
- [x] FK para linha primária.
- [x] Campos mínimos: nome, descrição, coleção/categoria, `personalized`, status, visibility, timestamps.
- [x] Status distingue rascunho/publicável/publicado/suspenso sem inferir gate de negócio.
- [x] Exclusão física não é o mecanismo padrão; retirada é representada por estado/visibilidade.
- [x] Índices para SKU, slug, linha e status avaliados e verificados.
- [x] Constraints impedem SKU e slug vazios.

## Limites desta conclusão

- Nenhum produto foi seedado ou migrado.
- Preços/variantes pertencem ao SB-009.
- Mídia/proveniência pertence ao SB-010.
- Policies e grants públicos pertencem ao SB-012.
- O storefront continua no catálogo estático; cutover não ocorreu.
- Nenhuma alteração visual/UI foi feita; a Skill Impeccable é explicitamente não aplicável a este card backend-only.
- Nenhuma credencial ou secret foi versionado.


## Integração GitHub

- PR #31 integrado à `main`.
- Merge commit: `86ca108488bab2a9bc559ded5ad866325f97ae67`.
- Diff do PR: 4 arquivos alterados, 316 linhas adicionadas, 0 removidas.
- Arquivos: migration SQL, tipos TypeScript gerados, documentação do modelo e evidência.
- Revisão de diff confirmou ausência de alterações fora do escopo do SB-008.
- GitHub Actions não foi utilizado como mecanismo de teste, deploy ou validação.

## Trello

- Card: https://trello.com/c/1Q6Mqbn1/65-sb-008p0-modelar-products
- A atualização para `Concluído` deve ocorrer somente após a confirmação do registro final de evidências.
