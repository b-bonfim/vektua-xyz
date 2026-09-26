# SB-026 — `CATALOG_SOURCE=static|supabase`

**Data:** 23/09/2026  
**Card:** [SB-026][P0] Introduzir `CATALOG_SOURCE=static|supabase`  
**Owner:** Engineering  
**Restrição:** GitHub Actions não é utilizado.

## Objetivo

Introduzir um ponto único de seleção da fonte do catálogo para permitir evolução, cutover e rollback sem espalhar a decisão pelos componentes.

## Configuração

A variável de ambiente é **server-side**:

| Variável | Valor | Comportamento |
|---|---|---|
| `CATALOG_SOURCE` | ausente ou vazio | usa `static` como default seguro |
| `CATALOG_SOURCE` | `static` | retorna o `StaticCatalogRepository` existente |
| `CATALOG_SOURCE` | `supabase` | retorna exclusivamente `SupabaseCatalogRepository` |
| `CATALOG_SOURCE` | qualquer outro valor | lança erro explícito com os valores aceitos |

Não existe fallback silencioso de `supabase` para `static`. Se o Supabase estiver selecionado e falhar, o erro permanece observável; rollback é uma decisão de configuração.

Quando `CATALOG_SOURCE=supabase`, permanecem obrigatórias as variáveis já definidas no SB-005:

- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

A leitura pública continua usando publishable key; `service_role` não participa do caminho público.

## Fronteira de código

A seleção está centralizada em:

- `lib/catalog-repository/catalog-source.ts`.

Exports públicos da camada:

- `getCatalogSource()`;
- `createCatalogRepository()`;
- `getCatalogRepository()`;
- `CatalogSource`.

Nenhum arquivo em `app/` ou `components/` lê `CATALOG_SOURCE`. A adaptação do storefront para consumir a factory/repositório assíncrono permanece no SB-027.

## Verificação estrutural

```bash
npm run verify:catalog-source
```

Resultado esperado:

```text
SB026_CATALOG_SOURCE_STRUCTURAL_PASS
defaultSource=static
invalidValue=explicit-error
staticRepository=StaticCatalogRepository
supabaseRepository=SupabaseCatalogRepository
uiFlagReferences=0
```

## Build matrix sem GitHub Actions

Para produzir a evidência de build nos dois modos, com as variáveis públicas do Supabase disponíveis no ambiente:

```bash
npm run build:catalog-source-matrix
```

O comando executa, em sequência e sem GitHub Actions:

1. limpeza dos artefatos de build;
2. `CATALOG_SOURCE=static npm run build:hostinger`;
3. nova limpeza;
4. `CATALOG_SOURCE=supabase npm run build:hostinger`.

Resultado final esperado:

```text
SB026_BUILD_PASS source=static
SB026_BUILD_PASS source=supabase
SB026_BUILD_MATRIX_PASS
```

Para validar apenas o build framework/Cloudflare em vez do artefato Hostinger:

```bash
SB026_BUILD_SCRIPT=build npm run build:catalog-source-matrix
```

## Rollback

O mecanismo de rollback técnico é deliberadamente simples: configurar `CATALOG_SOURCE=static` e reiniciar/rebuildar a aplicação conforme a plataforma de hospedagem. O ensaio operacional completo de rollback, rotas, carrinho e WhatsApp pertence ao SB-032.

## Escopo não antecipado

Este card não:

- converte componentes para leitura assíncrona;
- publica produtos;
- altera status de produtos no Supabase;
- altera RLS ou schema;
- executa cutover comercial;
- testa o rollback completo do SB-032;
- libera Launch Gate.

## Referência Supabase

O projeto usa `@supabase/supabase-js` com publishable key. Em 23/09/2026, a documentação vigente do Supabase continua recomendando publishable keys para novos clientes e RLS para o controle de acesso público. O projeto `tbffwwjqkusiupahjqux` foi conferido como `ACTIVE_HEALTHY`.
