# SB-019 — Inventário da mídia REMIX atual (v1.0)

**Data da coleta:** 22/09/2026, horário Brasil (a API mostrou o commit de origem em 23/09/2026 00:24:10 UTC). **Owner:** Engineering / Commerce. **Natureza:** evidência documental de inventário, não upload, conversão, inspeção da peça física ou autorização comercial. **Escopo congelado:** repositório `b-bonfim/vektua-xyz`, commit de origem `b17dbb1ff6b1a352801b75bb02ac4de99f461700`, árvore da pasta REMIX `a523a76a17470284164c070064f41b95e4ea6bfa`.

## Artefato canônico

[`SB-019_REMIX_MANIFEST_2026-09-22.csv`](./SB-019_REMIX_MANIFEST_2026-09-22.csv) — 37 linhas de dados, com nome de arquivo, SKU resolvido, extensão, tamanho em bytes, Git blob SHA-1 e ordem de galeria. Para obter o caminho completo, prefixar `public/images/products/remix/` ao `filename`. O identificador `git_blob_sha1` é o SHA do objeto Git do arquivo, **não** um SHA-256 calculado sobre bytes baixados; comparar hashes de mesma natureza no SB-022. Não usar esse inventário como comprovação de licença ou autenticidade visual.

**Fontes de reconciliação:** árvore Git do commit fixado; `lib/catalog.ts` (nove produtos legados, sete não personalizados), `lib/commercial-catalog.ts` (21 chaveiros adicionais), `lib/keyring-candidates.ts` (identidade dos 21 SKUs, snapshot histórico; não usar seus antigos gates como evidência de aprovação posterior), `public/images/provenance.json`. Também foi identificada no Drive a pasta raiz de SKUs e a pasta da linha Chaveiros contendo subpastas com nomes correspondentes; não foi realizada auditoria binária arquivo a arquivo do Drive.

## Resultado verificável no snapshot

| Verificação | Resultado | Limite |
|---|---:|---|
| Arquivos diretamente em `public/images/products/remix/` | 37 | Escopo da árvore no commit fixado; não inclui variantes responsive |
| SKUs distintos resolvidos por nome + catálogo vigente | 28 | 7 produtos de catálogo anteriores + 21 chaveiros adicionados |
| Órfãos sem SKU no catálogo comercial | 0 | Comparação de identificadores nominais, não inspeção visual |
| Extensões | 11 `.png` e 26 `.webp` | Extensão nominal; conteúdo/MIME real não inspecionado |
| Tamanho agregado | 23.879.271 bytes | Soma de `size` dos blobs fornecida pela API do GitHub |
| Duplicações binárias no conjunto REMIX | 0 | 37 hashes Git blob distintos; duplicata visual/semântica não aferida |
| Arquivos excluídos ou alterados por este cartão | 0 | Apenas arquivos de documentação foram adicionados |

**Ordem da galeria preservada a partir de `lib/catalog.ts`:** `G-CHV-JJ-01`: 1,2,3; `G-ORG-HS-01`: 1,2,3; `S-HAL-DEC-01`: 1,2,3,4; `S-NAT-PRE-01`: 1,2,3. Os outros 24 SKUs têm somente uma imagem REMIX no conjunto e ordem 1. A extensão e o número de sufixo `_REMIX_02`, `_REMIX_03`, `_REMIX_04` não representam SKUs novos. A imagem principal é ordem 1 onde há uma galeria explicitamente definida, e a imagem `image` em `commercial-catalog.ts` nos demais casos.

## Classificação separada — fora de REMIX

1. **Conceituais / editoriais fora do inventário de migração comercial:** `public/images/objects.webp` (hero editorial), `public/images/collection.webp` (coleção conceitual), `public/images/pet.webp` (mockup conceitual de pet), `public/images/person.webp` (imagem ilustrativa de personalizado). `public/images/provenance.json` documenta geração conceitual de `hero-objects`, `collection` e `pet`; o catálogo identifica `person.webp` como ilustrativo. Não inferir peça fabricada, fotografia real nem liberdade de uso comercial.
2. **Placeholders SVG fora do inventário REMIX:** `public/images/products/G-CHV-JJ-01-main.svg`, `G-ORG-HS-01-main.svg`, `G-ORG-RC-01-main.svg`, `G-VAS-ESC-01-main.svg`, `G-VAS-MIN-01-main.svg`, `S-HAL-DEC-01-main.svg`, `S-NAT-PRE-01-main.svg`. Mantidos como ativos legados/ilustrativos e **não** contados como arquivos REMIX a migrar.
3. **Derivados técnicos responsivos:** `public/images/responsive/` contém arquivos nomeados com `__w480`, `__w768`, `__w1024`, como derivados de REMIX para performance. Não são originais da pasta canônica, não entram nos 37, e sua política de migração/regeneração pertence ao SB-022 e à revisão de performance. Nenhum derivado é reclassificado como novo SKU.

## Reconciliação e convenções para SB-022 / SB-023

- Identificar o SKU pelo trecho antes de `_REMIX`, preservando os dois dígitos finais do SKU (por exemplo `G-CHV-FAN-02` é SKU distinto de `G-CHV-FAN-01`). Classificar `_REMIX_02` etc. como posição da **mesma** galeria.
- O CSV identifica arquivos presentes no Git, não prova que sua cópia no Drive tenha bytes idênticos, que a peça física tenha sido fotografada ou que a imagem represente fielmente um protótipo.
- Ao migrar, preservar origem e extensão, mapear caminhos `{sku}/...`, registrar hash/tamanho de origem e destino no mesmo algoritmo, testar integridade, não apagar originais e registrar exceções por arquivo. Não executar essas ações dentro de SB-019.
- Mídias conceituais e placeholders permanecem fora da seleção automática de `product_media` do storefront. Conferir campos `image`, `gallery` e derivados responsivos antes de alterar URLs em SB-023/etapas de frontend.
- Dependência precedente `SB-016` foi observada pelo conector Supabase: o bucket `product-media` existe, é público, restringe MIME a JPEG/PNG/WebP e limite de 10 MiB. Esta leitura não substitui análise de políticas nem declara SB-016 aprovado. Nenhum objeto foi enviado neste cartão.

## Matriz de aceite do SB-019

- [x] Listagem exaustiva da pasta REMIX registrada no commit fixado e versionada no CSV.
- [x] SKU resolvido no catálogo para 37/37 arquivos; nenhum órfão nominal.
- [x] Comparação por Git blob SHA-1: 0 duplicatas binárias no escopo; equivalência visual não testada.
- [x] Extensão e tamanho registrados por arquivo.
- [x] Ordem de quatro galerias multi-imagem registrada; demais imagens com ordinal 1.
- [x] Mídia conceitual, placeholders e derivados responsivos classificados separadamente.
- [x] Nenhum asset removido ou substituído: commits exclusivamente documentais.

**Status desta entrega:** DoD documental do inventário atendida no snapshot do commit indicado; não representa conclusão dos SB-020 a SB-024, comercialização ou cutover. **Próximo owner:** Engineering em SB-020 (extrator determinístico) e posteriormente SB-022 para cópia com reconciliação; Commerce/Quality revisam uso da imagem sem declarar foto real. **Founder Gate:** nenhum novo gasto ou autorização comercial solicitado neste cartão.
