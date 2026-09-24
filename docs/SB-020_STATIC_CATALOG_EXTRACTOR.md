# SB-020 — Extrator do catálogo estático

**Data de implementação:** 22/09/2026 · **Validação integral:** 24/09/2026 · **Prioridade:** P0 · **Owner:** Engineering · **Status:** CONCLUÍDO no escopo do extrator/dataset; seed remoto pertence ao SB-021.

## Origem correta

`lib/commercial-catalog.ts` fornece `commercialProducts` e `commercialLines`, consolidando `lib/catalog.ts`, `lib/sku-copy.ts` e `lib/sku-names.ts`. O catálogo validado contém **4 linhas**, **30 produtos** e **48 referências de mídia**. Extrair apenas `lib/catalog.ts` omitiria os SKUs adicionados posteriormente.

## Artefatos

- `scripts/catalog/extract-static-catalog.mjs`: extrator determinístico, somente leitura sobre as fontes do catálogo.
- `scripts/tests/extract-static-catalog.test.mjs`: suíte de testes do contrato.
- `data/catalog/static-catalog.seed.json`: snapshot determinístico do catálogo validado.
- `data/catalog/static-catalog.validation.json`: relatório de validação e hashes.

O dataset exporta `sku`, `slug`, `line`, `name`, `description`, `collection`, `personalized` e mídia `{primary,gallery}`. Preços demonstrativos, estados de gate e dados não pertencentes ao contrato não são importados.

## Evidência executada

Execução manual realizada em checkout local atualizado da `main` no commit de origem `c14b7036da31e214bc6d51f7829c6306da2b8eff`, sem GitHub Actions.

```text
node --test scripts/tests/extract-static-catalog.test.mjs
=> 7 testes; 7 PASS; 0 FAIL

node scripts/catalog/extract-static-catalog.mjs --write
=> PASS; linhas=4, produtos=30, referências de mídia=48
=> dataset sha256=0ab2ed30a4b2398af92b3952eb10d4fe89d49134ae4dbf480240eeea66a1cf45

node scripts/catalog/extract-static-catalog.mjs --check
=> PASS; mesmo hash

node scripts/catalog/extract-static-catalog.mjs --check
=> PASS; mesmo hash
```

O arquivo `static-catalog.validation.json` versionado confirma:

- `valid: true`
- `issues: []`
- `lines: 4`
- `products: 30`
- `mediaReferences: 48`
- `sourceSha256: 8c09b5df389a84b87c44d7919fe6159b0191fd7d35b471c58dc4e8bce4f7b019`
- `datasetSha256: 0ab2ed30a4b2398af92b3952eb10d4fe89d49134ae4dbf480240eeea66a1cf45`

O hash calculado pelo PowerShell para `static-catalog.seed.json` corresponde exatamente ao hash registrado no relatório. A exibição mojibake observada no terminal Windows não está presente no arquivo versionado: o JSON no GitHub está em UTF-8 correto.

## DoD

| Critério | Resultado |
|---|---|
| Extrator lê o catálogo vigente sem alterar seus dados | PASS — script somente leitura; snapshot gerado a partir da fonte vigente |
| Exporta SKU, slug, linha, nome, descrição, coleção, personalização e mídia | PASS — dataset versionado |
| Detecta SKU duplicado | PASS — teste automatizado + catálogo real válido |
| Detecta slug duplicado | PASS — teste automatizado + catálogo real válido |
| Detecta produto sem linha válida | PASS — teste automatizado + catálogo real válido |
| Detecta caminho de imagem inexistente | PASS — teste automatizado + catálogo real sem issues |
| Reexecução sobre o mesmo commit produz o mesmo resultado | PASS — duas execuções `--check` com hash idêntico |

## Limites

Este card **não** faz seed no Supabase, upload de Storage, alteração de RLS/API, publicação de SKU, verificação de licença, comprovação de fotografia física, preço comercial ou cutover do storefront. O relatório de validação confirma estrutura e caminhos locais do catálogo. O seed/reconciliação de origem e destino segue no **SB-021**.

Nenhum GitHub Actions foi utilizado.
