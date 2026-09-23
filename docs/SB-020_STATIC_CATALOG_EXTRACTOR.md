# SB-020 — Extrator do catálogo estático

**Data:** 22/09/2026 · **Prioridade:** P0 · **Owner:** Engineering · **Escopo:** dataset para migração, sem seed remoto.

## Origem correta

`lib/commercial-catalog.ts` fornece `commercialProducts` e `commercialLines`. Consolida `lib/catalog.ts`, `lib/sku-copy.ts` e `lib/sku-names.ts`. No estado inspecionado em 22/09/2026, o catálogo comercial contém nove produtos de origem mais 21 chaveiros; extrair apenas `lib/catalog.ts` omite os novos SKUs. O adaptador atualmente utilizado pelo site é `lib/catalog-repository/static-catalog-repository.ts`.

## Contrato e artefatos

- `scripts/catalog/extract-static-catalog.mjs`: processa os exports TypeScript reais em ambiente Node local com `typescript` já declarado nas devDependencies. Não consulta banco, redes, Drives ou APIs; não muda o catálogo nem a vitrine.
- `scripts/tests/extract-static-catalog.test.mjs`: testes unitários isolados com fixtures de dados válidos, duplicados, inválidos e mídia ausente.
- `data/catalog/static-catalog.seed.json`: **pendente de geração no checkout integral**. Deverá conter `schemaVersion`, fonte e hash SHA-256, linhas comerciais e registros `sku`, `slug`, `line`, `name`, `description`, `collection`, `personalized` e mídia `{primary,gallery}`. Campos textuais e ordem da galeria são preservados, inclusive repetição da capa quando a origem a contém.
- `data/catalog/static-catalog.validation.json`: **pendente de geração no checkout integral**. Deverá conter hash do dataset, contagens, lista de inconsistências e `valid`.

A serialização tem ordenação estável e **não inclui timestamp**. O hash das fontes incorpora conteúdo e caminho dos quatro arquivos TypeScript. Reexecutar sobre o mesmo checkout deve produzir bytes idênticos. Em `--check`, o script compara os JSONs existentes com a extração recomputada e falha diante de qualquer drift.

Os caminhos de imagem, inclusive imagens de linha, capa e toda a galeria, são conferidos contra `public/`: nomes exatos (até no Windows), existência de arquivo, ausência de travessia e impedimento de symlink para fora da pasta. Em caso de erro, o comando sai com status 1 e **não sobrescreve o dataset anterior**. O relatório de inconsistências é exibido no terminal.

**Proveniência e autorização:** caminhos REMIX são referências locais, não prova de origem, licença, fotografia física ou arquivo já armazenado no Supabase. Não inventar `origin_reference`, `file_state='verified'` ou `is_public=true`. Esses estados exigem evidências nas etapas SB-021/SB-016 e gates comerciais próprios. Produtos personalizados sem imagem permanecem sem imagem fictícia. Preços demonstrativos/`demo` de `lib/catalog.ts` ficam intencionalmente fora desta exportação; preço comercial é tratado separadamente.

## Comandos manuais sem GitHub Actions

Na raiz de checkout limpo e atualizado, com Node >=22.13 e dependências instaladas via `npm ci`:

```bash
node --test scripts/tests/extract-static-catalog.test.mjs
node scripts/catalog/extract-static-catalog.mjs --write
node scripts/catalog/extract-static-catalog.mjs --check
node scripts/catalog/extract-static-catalog.mjs --check
```

Depois, inspecionar os dois JSONs, registrar contagens, lista de problemas vazia, hash SHA-256, commit de origem e saída dos comandos. Versionar os JSONs em commit/PR próprio sem editar seus conteúdos manualmente. Se houver erro, corrigir fonte/caminho mediante revisão rastreável e reexecutar. Não marcar DoD de execução completa apenas com teste unitário.

## Critérios de aceite e evidências

| DoD | Evidência disponível neste estágio | Pendente |
|---|---|---|
| Lê fonte sem alterar dados | Revisão de código do script | Executar no checkout integral |
| Exporta todos os campos e mídia | Projeção e teste unitário | Gerar dataset real versionado |
| SKU duplicado e slug duplicado | Testes unitários isolados | Confrontar catálogo real |
| Linha inválida | Teste unitário isolado | Confrontar catálogo real |
| Imagem ausente | Teste unitário isolado | Varredura real dos assets |
| Mesmo commit → mesmo resultado | Teste de bytes em fixture | Duas verificações `--check` sobre o checkout |

**Não executado neste card:** seed Supabase, criação de Storage, RLS/API, importação de imagens, preços, publicação comercial, deploy ou alterações de frontend. `SB-021` é o responsável pelo seed e reconciliação origem/destino. Impeccable não se aplica a tarefa exclusivamente backend. A conclusão do cartão depende dos dois JSONs reais e logs, e não pode ser inferida dos testes isolados.
