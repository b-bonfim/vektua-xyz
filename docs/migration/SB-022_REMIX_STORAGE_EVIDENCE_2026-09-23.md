# SB-022 — Migração de arquivos REMIX para `product-media`

**Data:** 2026-09-23  
**Card:** `[SB-022][P0] Migrar arquivos REMIX para product-media`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Repositório:** `b-bonfim/vektua-xyz`  
**Branch documental:** `sb-022-remix-product-media-20260923`  
**GitHub Actions:** não utilizado.

## Resultado executivo

**CONCLUÍDO COM EVIDÊNCIA NO ESCOPO DO SB-022.**

Foram migrados **37/37 arquivos REMIX elegíveis**, correspondentes a **28 SKUs**, para o bucket público `product-media`, totalizando **23.879.271 bytes**. Não houve exceção, overwrite nem remoção dos arquivos de origem.

A origem canônica dos bytes foi o snapshot versionado no SB-019:
- commit de origem: `b17dbb1ff6b1a352801b75bb02ac4de99f461700`;
- diretório: `public/images/products/remix/`;
- manifesto: `docs/migration/SB-019_REMIX_MANIFEST_2026-09-22.csv`;
- quantidade esperada: 37;
- bytes esperados: 23.879.271.

O Google Drive foi usado como reconciliação de proveniência/nomenclatura. Vários arquivos no Drive continuam em PNG enquanto o snapshot comercial do repositório já contém derivados WebP otimizados; por isso **não houve substituição silenciosa dos bytes do snapshot Git por versões diferentes do Drive**.

## Estado inicial confirmado

Antes da migração:
- bucket `product-media`: existente, público;
- limite por arquivo: 10 MiB;
- MIME permitidos: JPEG, PNG e WebP;
- objetos no bucket: **0**;
- bytes no bucket: **0**;
- linhas em `public.product_media`: **0**.

## Convenção de destino

Todos os objetos foram gravados como:

`{sku}/{nome-do-arquivo}`

Exemplo:
`G-CHV-ABO-01/G-CHV-ABO-01_REMIX.webp`

Pós-migração:
- objetos: **37**;
- bytes: **23.879.271**;
- paths fora da convenção de um diretório SKU + filename: **0**;
- diretórios sem SKU correspondente em `public.products`: **0**;
- paths que falham a regra de `product_media.storage_path`: **0**;
- MIME fora da allowlist: **0**.

## Integridade da cópia

A verificação foi executada arquivo a arquivo, lendo novamente:
1. os bytes do arquivo no commit Git congelado;
2. os bytes servidos pelo Supabase Storage no destino.

Para cada arquivo:
- o tamanho da origem foi comparado ao manifesto SB-019;
- o Git blob SHA-1 recalculado foi comparado ao manifesto SB-019;
- foi calculado SHA-256 da origem;
- foi calculado SHA-256 do objeto no Storage;
- tamanho origem = tamanho destino;
- SHA-256 origem = SHA-256 destino.

**Resultado: 37/37 `verified`; 0 mismatch.**

O manifesto completo origem → destino, com hash e status por arquivo, está em:
`docs/migration/SB-022_REMIX_STORAGE_MANIFEST_2026-09-23.csv`.

## Idempotência e proteção contra overwrite

A rotina de upload utilizou `x-upsert=false`. Portanto:
- não sobrescreve silenciosamente objeto existente;
- conflito de path não é tratado como sucesso;
- rechecagem posterior foi feita por leitura/hash;
- nenhuma exclusão foi usada.

Uma primeira tentativa terminou com **0 uploads** porque o probe de objeto inexistente retornou HTTP 400 em vez de 404; a lógica foi corrigida antes da execução efetiva. O erro ficou explícito e não foi registrado como sucesso parcial.

## `product_media`: compatibilidade para o próximo card

SB-022 **não popula** `public.product_media`; isso pertence ao SB-023.

A gravabilidade dos caminhos foi validada sem inserir linhas artificiais:
- 37/37 paths satisfazem a constraint de `storage_path`;
- 28/28 pastas de SKU resolvem para registros existentes em `public.products`;
- bucket e MIME são válidos;
- `product_media` permaneceu com **0 linhas** ao final.

Uma tentativa de INSERT transitório apenas para evidência foi bloqueada pela camada de segurança da ferramenta e não foi forçada. O aceite deste item se apoia nas constraints/FKs existentes e na validação de todos os paths; a inserção real e a ordem/primary/publicação permanecem no SB-023.

## Infraestrutura temporária e limpeza

Durante a execução foram criados recursos transitórios para permitir a cópia/verificação sem afrouxar as policies permanentes do Storage. O histórico remoto registra:

- `20260923133623_sb_022_enable_http_temp`;
- `20260923133945_sb_022_enable_pg_net_temp`;
- `20260923134426_sb_022_create_verification_temp`;
- `20260923135241_sb_022_cleanup_temp_infrastructure`.

Estado final verificado:
- extensão `http`: removida;
- extensão `pg_net`: removida;
- tabela `public.sb022_verification_temp`: removida;
- Edge Function `sb022-migrate-remix`: versão final **inerte**, `verify_jwt=true`, responde apenas 410/disabled; o conector disponível não expõe delete de Edge Function.

As quatro migrations do histórico remoto estão espelhadas em `supabase/migrations/` para evitar drift documental.

## Segurança pós-execução

O Supabase Security Advisor pós-rodada retornou achados ligados a Auth/admin já fora do escopo deste card; nenhum finding reportado apontou `product-media`, os objetos migrados ou os recursos temporários já removidos.

Nenhuma policy permanente de upload do bucket foi aberta para o storefront. O bucket continua público apenas para leitura, conforme arquitetura pré-existente do SB-016.

## DoD

- [x] Todos os arquivos elegíveis enviados: **37/37**; exceções: **0**.
- [x] Caminho segue `{sku}/...`: **37/37**.
- [x] Integridade confirmada por tamanho + Git blob SHA-1 da origem + SHA-256 origem/destino: **37/37**.
- [x] Arquivos atuais do repositório não foram excluídos; alterações deste card são documentais/migrations de rastreabilidade.
- [x] Falhas não foram mascaradas: primeira tentativa = 0 uploads e erro registrado; conclusão só após nova verificação.
- [x] Paths finais são compatíveis com `product_media.storage_path` e SKUs existentes; inserção das linhas fica para SB-023.

## Limites do aceite

Este card comprova a **cópia e integridade da mídia REMIX para Storage**. Não comprova nem executa:
- criação dos registros definitivos de `product_media` (SB-023);
- cutover do storefront;
- publicação comercial de SKU;
- preço, estoque, capacidade, licença, qualidade física ou conformidade;
- equivalência binária entre toda imagem do Drive e a versão otimizada usada pelo storefront.

## Próximo passo

**SB-023 — Popular `product_media` e ordem de galeria**, consumindo este manifesto e mantendo a mídia atual do repositório até o cutover validado.

## PR / merge

- PR: https://github.com/b-bonfim/vektua-xyz/pull/43
- Merge SHA: `0094cf76d2c288913912a6aa223fd7fd7aba0b08`
- Arquivos alterados no PR: 6, todos restritos a `docs/migration/` e `supabase/migrations/`.
- Assets em `public/images/products/remix/`: não alterados pelo PR.
- GitHub Actions: não utilizado.
