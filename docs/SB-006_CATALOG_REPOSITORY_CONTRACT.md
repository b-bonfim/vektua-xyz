# SB-006 — Contrato da camada de repositórios do catálogo

**Data:** 22/09/2026  
**Card:** [SB-006][P0] Definir contrato da camada de repositórios  
**Owner:** Engineering  
**Status documental:** IMPLEMENTADO EM BRANCH; QA/merge registrados separadamente na evidência final  
**Restrição:** GitHub Actions não é utilizado.

## Objetivo

Criar uma fronteira de aplicação estável entre o storefront e a persistência do catálogo, sem introduzir queries Supabase em componentes React e sem antecipar o cutover previsto nos cartões SB-025–SB-027.

## Contrato público

A interface `CatalogRepository` expõe:

- `listProducts(query?)`: lista produtos com filtros necessários ao storefront atual;
- `getProductBySlug(slug)`: resolve a ficha de produto;
- `getLines()`: lista as linhas comerciais.

As operações retornam `Promise` desde o primeiro contrato para que o adapter Supabase futuro não obrigue uma segunda mudança de interface.

### Consultas cobertas

`CatalogProductQuery` suporta:

- `line`;
- `query`;
- `collection`;
- `excludeProductId`;
- `limit`.

Esses campos cobrem catálogo geral, páginas por linha, busca, recortes por coleção e produtos relacionados sem acoplar o domínio a uma tabela específica.

## Tipos públicos

Os tipos em `lib/catalog-repository/types.ts` são tipos de domínio da aplicação. Eles não importam nem expõem tipos gerados de tabelas.

Quando o adapter Supabase for implementado no SB-025, tipos gerados do banco podem ser usados **internamente no adapter**, mas devem ser convertidos explicitamente para `CatalogProduct` e `CatalogLine` antes de atravessar a fronteira do repositório.

## Adapter estático

`StaticCatalogRepository` adapta `commercialProducts` e `commercialLines`, preservando a fonte atual do catálogo.

O adapter:

- implementa todas as operações do contrato;
- preserva a classificação das quatro linhas;
- suporta busca normalizada;
- suporta filtro por linha e coleção;
- suporta exclusão de produto e limite para relacionados;
- clona a galeria ao retornar o tipo público.

## Limite deliberado do SB-006

Este cartão **não** implementa o adapter Supabase e **não** ativa a seleção dinâmica da fonte.

A sequência do cronograma permanece:

1. SB-025 implementa `SupabaseCatalogRepository`;
2. SB-026 introduz `CATALOG_SOURCE=static|supabase`;
3. SB-027 adapta o storefront para o fluxo assíncrono.

Até essa sequência, o runtime existente continua usando a fonte estática. Portanto, definir `CATALOG_SOURCE=static` no ambiente não altera o comportamento atual neste cartão.

## Regra de componentes

Nenhum componente do storefront pode importar o cliente Supabase, `@supabase/supabase-js` ou executar `.from(...)` diretamente para catálogo. A persistência deve ficar atrás de um adapter que implemente `CatalogRepository`.

## Validação

O teste estrutural `scripts/tests/catalog-repository-contract.mjs` verifica:

- presença das três operações obrigatórias;
- filtros necessários ao storefront;
- ausência de acoplamento do contrato a tipos do banco/Supabase;
- implementação do contrato pelo adapter estático;
- ausência de consulta direta ao Supabase nos componentes do storefront;
- preservação do runtime estático nesta etapa.

Comando:

```bash
node scripts/tests/catalog-repository-contract.mjs
```

Saída esperada:

```text
SB006_CATALOG_REPOSITORY_CONTRACT_PASS
```
