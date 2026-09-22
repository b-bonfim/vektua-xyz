# SB-006 — Evidências: contrato da camada de repositórios

**Data:** 22/09/2026  
**Card:** [SB-006][P0] Definir contrato da camada de repositórios  
**Branch:** `feat/sb-006-catalog-repository-contract-20260922`  
**Base:** `main@0a845d40363dcf70d20227b4f5d6b2aeb624fd7d`  
**SHA validado:** `329f3999cdaccb9bd3d3c40e7ef9653577e9fc65`  
**Restrição:** GitHub Actions não utilizado.

## Escopo implementado

Foram adicionados:

- `lib/catalog-repository/types.ts`: tipos públicos de catálogo independentes da persistência.
- `lib/catalog-repository/catalog-repository.ts`: interface `CatalogRepository`.
- `lib/catalog-repository/static-catalog-repository.ts`: adapter do catálogo comercial estático vigente.
- `lib/catalog-repository/index.ts`: entrypoint público da camada.
- `scripts/tests/catalog-repository-contract.mjs`: teste estrutural reproduzível.
- `docs/SB-006_CATALOG_REPOSITORY_CONTRACT.md`: contrato e limites de responsabilidade.

## Contrato

`CatalogRepository` cobre:

- `listProducts(query?)`;
- `getProductBySlug(slug)`;
- `getLines()`.

`CatalogProductQuery` cobre as necessidades atuais do storefront:

- linha;
- busca textual;
- coleção;
- exclusão de um produto;
- limite para recortes/relacionados.

As operações são assíncronas desde o contrato inicial para evitar uma segunda quebra de interface quando `SupabaseCatalogRepository` for implementado no SB-025.

## Independência de tipos de tabela

Os tipos públicos `CatalogProduct`, `CatalogLine`, `CatalogLineId` e `CatalogProductQuery` são tipos de domínio da aplicação.

A validação confirmou que o contrato público não contém referências a:

- `database.types`;
- `Database['public']`;
- `Tables<...>`;
- `@supabase/supabase-js`;
- query builder `.from(...)`.

Tipos gerados pelo Supabase, quando existirem após o schema, ficam restritos ao adapter de persistência e devem ser mapeados explicitamente para os tipos públicos.

## Adapter estático

`StaticCatalogRepository` implementa integralmente o contrato e adapta:

- `commercialProducts`;
- `commercialLines`.

O adapter mantém o conteúdo do catálogo atual e implementa filtros por linha, busca, coleção, exclusão e limite.

## Preservação do storefront estático

Comparação da branch contra `main`:

- branch `ahead_by: 2`;
- `behind_by: 0`;
- **somente arquivos novos foram adicionados**;
- nenhum arquivo existente de `app/`, `components/`, catálogo comercial ou configuração runtime foi modificado.

Isso preserva o comportamento das rotas atuais nesta etapa. O switch runtime `CATALOG_SOURCE=static|supabase` continua deliberadamente reservado ao SB-026.

## Validação do contrato

A lógica do teste `scripts/tests/catalog-repository-contract.mjs` foi executada diretamente contra os arquivos reais da branch via GitHub connector.

Resultado:

```text
SB006_CATALOG_REPOSITORY_CONTRACT_PASS
```

Validações cobertas:

- três métodos obrigatórios presentes;
- filtros necessários ao storefront presentes;
- tipos públicos sem acoplamento ao Supabase/tabelas;
- adapter estático implementa `CatalogRepository`;
- entrypoint exporta adapter estático;
- storefront não importa cliente Supabase nem executa query Supabase direta;
- runtime vigente continua apontando para catálogo estático.

O primeiro detector acusou `.from(` em `Array.from(...)` como falso positivo; o teste foi corrigido para detectar somente tokens específicos de cliente/query Supabase e reexecutado com PASS.

## Estado remoto Supabase

Projeto: `tbffwwjqkusiupahjqux` — Vektua XYZ.

Verificado em 22/09/2026:

- status: `ACTIVE_HEALTHY`;
- migrations: 0;
- tabelas no schema `public`: 0;
- nenhum DDL, migration, seed ou alteração remota foi realizado pelo SB-006.

Esse estado é esperado: o card define a fronteira da aplicação; o schema começa nos cartões SB-007 em diante.

## Impeccable

Sem escopo aplicável neste card. Nenhum arquivo de UI/frontend visual foi modificado.

## DoD

- [x] Interface de catálogo cobre `listProducts`, `getProductBySlug`, `getLines` e consultas necessárias pelo storefront.
- [x] Tipos públicos não dependem de tipos gerados diretamente por uma tabela.
- [x] Existe adapter estático para o catálogo atual.
- [x] Existe contrato para adapter Supabase futuro.
- [x] Com runtime estático, as rotas permanecem sem mudança funcional; `CATALOG_SOURCE=static` não altera o comportamento antes do SB-026.
- [x] Nenhum componente do storefront consulta Supabase diretamente neste cartão.

## Limite da evidência

Não foi executado build Next/Vinext nesta rodada porque os conectores disponíveis não expõem um runner de shell do repositório e o ambiente local desta sessão não resolve `github.com` para clonagem. O DoD deste cartão aceita **teste ou validação de build**; a conclusão usa o teste estrutural reproduzível e a prova de diff puramente aditivo, sem declarar build executado.

## Resultado

**SB-006 atende ao DoD definido para contrato de repositórios e está pronto para merge.**

Próxima etapa após merge: [SB-007][P0] Modelar `product_lines`.
