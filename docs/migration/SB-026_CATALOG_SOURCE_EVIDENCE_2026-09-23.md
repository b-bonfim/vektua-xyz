# SB-026 — Evidências parciais e pendência de conclusão

**Data:** 23/09/2026  
**Card:** [SB-026][P0] Introduzir `CATALOG_SOURCE=static|supabase`  
**Owner:** Engineering  
**Coordenação:** VP Execution Orchestrator  
**Status:** **EM ANDAMENTO — BUILD MATRIX PENDENTE**  
**Branch:** `feat/sb-026-catalog-source-switch-20260923`  
**Base:** `main@bd37d0fbae9a9e072b5e4d41ec0965d46de27faf`  
**PR:** #47 — https://github.com/b-bonfim/vektua-xyz/pull/47  
**GitHub Actions:** não utilizado.

## 1. DoD

| Critério | Evidência atual | Resultado |
|---|---|---|
| Fonte selecionada por configuração documentada | `catalog-source.ts` + `docs/migration/SB-026_CATALOG_SOURCE.md` | **PASS** |
| Valor inválido falha explicitamente ou usa default seguro documentado | ausente/vazio => `static`; qualquer outro valor fora de `static|supabase` => erro explícito | **PASS** |
| `static` mantém comportamento atual | factory retorna o singleton `staticCatalogRepository`; nenhum componente foi alterado | **PASS estrutural** |
| `supabase` usa exclusivamente o adapter novo | factory retorna `createSupabaseCatalogRepository()`; não existe catch/fallback silencioso | **PASS estrutural** |
| Nenhum componente precisa conhecer a flag | diff contém zero arquivos em `app/` e `components/`; teste versionado varre os dois diretórios | **PASS estrutural** |
| Build funciona em `static` | build-matrix preparado | **PENDENTE DE EXECUÇÃO** |
| Build funciona em `supabase` | build-matrix preparado | **PENDENTE DE EXECUÇÃO** |

## 2. Arquivos alterados

- `lib/catalog-repository/catalog-source.ts`;
- `lib/catalog-repository/index.ts`;
- `scripts/tests/catalog-source-switch.mjs`;
- `scripts/tests/catalog-source-build-matrix.mjs`;
- `docs/migration/SB-026_CATALOG_SOURCE.md`;
- `package.json`.

Nenhum arquivo de UI, schema, migration, RLS, seed ou dado comercial foi alterado.

## 3. Verificações executadas nesta rodada

### Selector TypeScript

O selector foi compilado isoladamente contra stubs dos contratos importados usando TypeScript 5.8.3 disponível no ambiente.

```text
SB026_SELECTOR_TSC_PASS
```

### Scripts de verificação

Os scripts novos foram submetidos a checagem de sintaxe Node.js.

```text
SB026_BUILD_SCRIPT_SYNTAX_PASS
SB026_STRUCTURAL_TEST_SCRIPT_SYNTAX_PASS
```

### Diff

Comparação `main...feat/sb-026-catalog-source-switch-20260923` antes da evidência:

- branch ahead, sem divergência da base;
- alterações restritas à camada de catálogo, documentação, scripts de teste e scripts de pacote;
- zero arquivos de `app/` ou `components/`.

## 4. Supabase

Projeto: `tbffwwjqkusiupahjqux` — **ACTIVE_HEALTHY** em 23/09/2026.

Foi confirmada publishable key ativa. Nenhuma chave `service_role` foi adicionada ao código e nenhum DDL/dado foi alterado neste card.

A documentação Supabase vigente recomenda publishable keys para novos clientes e mantém RLS como camada de controle de acesso às linhas públicas.

## 5. Google Drive e Impeccable

- **Google Drive:** pasta `SKUs` acessível; nenhum ativo precisa ser modificado para o feature flag.
- **Impeccable:** sem escopo aplicável, pois este card não altera UI/UX.

## 6. Bloqueio para conclusão

O ambiente de execução desta sessão não resolve `github.com` por DNS:

```text
fatal: unable to access 'https://github.com/b-bonfim/vektua-xyz.git/':
Could not resolve host: github.com
```

Além disso, o runtime local não possui as dependências `node_modules` do repositório. Por isso, **não foi possível executar honestamente os dois builds completos** sem usar GitHub Actions, que está expressamente proibido.

## 7. Ação manual necessária

Em uma máquina com Node.js >= 22.13, npm 10.x, acesso à internet e checkout da PR #47:

```bash
git checkout feat/sb-026-catalog-source-switch-20260923
npm ci
npm run verify:catalog-source
npm run build:catalog-source-matrix
```

Antes do comando de build-matrix, configurar no ambiente:

- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Não registrar a publishable key em arquivos versionados.

Para concluir o DoD, o log precisa conter:

```text
SB026_CATALOG_SOURCE_STRUCTURAL_PASS
SB026_BUILD_PASS source=static
SB026_BUILD_PASS source=supabase
SB026_BUILD_MATRIX_PASS
```

Se qualquer build falhar, manter o card Em Andamento e anexar o log integral da falha.

## 8. Estado de merge

A PR #47 foi aberta como **draft** e não deve ser integrada à `main` antes da evidência dos dois builds.

## 9. Founder Gate

Nenhum Founder Gate adicional é necessário para implementar o feature flag. O cutover efetivo para Supabase permanece condicionado aos cards/gates posteriores do cronograma.
