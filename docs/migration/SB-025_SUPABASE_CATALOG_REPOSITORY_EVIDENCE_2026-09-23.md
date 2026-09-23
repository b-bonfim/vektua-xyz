# SB-025 — Evidências de conclusão do SupabaseCatalogRepository

**Data:** 23/09/2026  
**Card:** [SB-025][P0] Implementar `SupabaseCatalogRepository`  
**Owner:** Engineering  
**Coordenação:** VP Execution Orchestrator  
**Branch:** `feat/sb-025-supabase-catalog-repository-20260923`  
**Base:** `main@a236ef7967333a209118d793556aa162961de8c7`  
**PR:** #46 — https://github.com/b-bonfim/vektua-xyz/pull/46  
**Status desta evidência:** IMPLEMENTAÇÃO E DoD VALIDADOS NA BRANCH; merge registrado após integração  
**GitHub Actions:** não utilizado.

## 1. Dependências

- SB-006: contrato `CatalogRepository` já integrado.
- SB-024: reconciliação origem × Supabase concluída no PR #45, com 30×30 produtos, 37×37 mídias e 0 divergências. O Trello foi reconciliado para Concluído antes desta implementação.

## 2. Escopo implementado

Foram adicionados/alterados:

- `lib/catalog-repository/supabase-catalog-repository.ts`;
- `lib/catalog-repository/index.ts`;
- `lib/supabase/server.ts`;
- `lib/supabase/client.ts`;
- `lib/supabase/database.types.ts`;
- `scripts/tests/supabase-catalog-repository.mjs`;
- `docs/migration/SB-025_SUPABASE_CATALOG_REPOSITORY.md`.

O storefront continua consumindo o catálogo estático. O switch de fonte permanece reservado ao SB-026.

## 3. DoD

| Critério | Evidência | Resultado |
|---|---|---|
| Implementa todas as operações do contrato | `listProducts`, `getProductBySlug`, `getLines` na classe `SupabaseCatalogRepository` | **PASS** |
| Somente registros públicos/publicados | filtros explícitos `status=published`, `visibility=public`, linha `active`; RLS remota confirma os mesmos limites | **PASS** |
| Mídia determinística | ordenação por `gallery_position`, desempate por `storage_path` e `id`; primária por `is_primary` | **PASS** |
| Ausência sem exception não controlada | slug vazio retorna `null`; consulta usa `maybeSingle()`; ausência retorna `null` | **PASS** |
| Sem service-role na leitura pública | adapter usa cliente público; server/browser usam somente `publishableKey`; busca na branch = 0 referências a service-role no caminho público | **PASS** |
| Tipos consistentes com schema vigente | `database.types.ts` comparado byte a byte com `generate_typescript_types` remoto atual; match exato | **PASS** |
| Consultas principais verificáveis | `scripts/tests/supabase-catalog-repository.mjs` + verificação executada diretamente nos arquivos da branch e schema remoto | **PASS** |

## 4. Segurança e schema verificados

Projeto Supabase: `tbffwwjqkusiupahjqux`.

Políticas RLS conferidas em 23/09/2026:

- `product_lines_public_read`: somente `status=active`;
- `products_public_read`: somente `status=published`, `visibility=public` e linha ativa;
- `product_media_public_remix_read`: somente mídia pública, verificada, `remix`, bucket `product-media` e produto publicado/público.

Bucket `product-media`: **public=true**.

Estado atual de dados:

- 4 linhas `active`;
- 30 produtos `draft/hidden`;
- 37 mídias marcadas públicas e verificadas, ligadas a 28 SKUs.

Consequência esperada: no contexto público, o adapter não expõe os 30 produtos enquanto eles permanecerem `draft/hidden`. Isso é comportamento de segurança, não falha de migração.

## 5. Resultados de verificação

Verificação executada sobre os arquivos reais da branch + schema remoto:

```text
SB025_STRUCTURAL_AND_SCHEMA_PASS
generatedTypesExactMatch=true
serviceRoleReferences=0
```

Regressão do contrato SB-006 reexecutada sobre a branch:

```text
SB006_REGRESSION_PASS
branch ahead_by=7
branch behind_by=0
storefront permanece estático
nenhum componente passou a consultar Supabase diretamente
```

A comparação de Git confirmou alterações restritas ao adapter, tipos/clientes Supabase, teste e documentação.

## 6. Limitação de ambiente registrada

Foi tentado clone local da branch para executar `tsc`/build fora do GitHub Actions. O ambiente desta sessão não resolveu `github.com` por DNS, portanto **não há alegação de build ou tsc executado**.

Isso não bloqueia o DoD específico do SB-025, que exige adapter + testes/verificação reproduzível e consistência com o schema. Build/smoke do aplicativo permanecem gates próprios dos cartões posteriores da migração.

Nenhum GitHub Actions foi disparado ou utilizado para validar este card; os workflows existentes são limitados a branches específicas diferentes desta branch.

## 7. Ferramentas complementares

- **Impeccable:** não aplicável; o card não altera UI/UX ou arquivos visuais.
- **Google Drive:** nenhuma alteração necessária neste card. A reconciliação predecessor SB-024 já registrou o Drive apenas como corroborador de estrutura de mídia.
- **Supabase:** leitura de schema, RLS, bucket e geração de tipos executadas; nenhum DDL ou dado comercial foi alterado.

## 8. Ação manual

**Nenhuma ação manual necessária para concluir o SB-025.**

## 9. Limites de autorização

A conclusão técnica deste card não:

- publica produtos;
- libera SKU comercialmente;
- ativa `CATALOG_SOURCE=supabase`;
- altera RLS;
- executa cutover;
- libera Launch Gate.

**Founder Gate:** não requerido para concluir este adapter. O cutover permanece sujeito aos gates posteriores do cronograma.

## 10. Próximo passo

Após merge, prosseguir para **SB-026 — Implementar feature flag `CATALOG_SOURCE=static|supabase`**.
