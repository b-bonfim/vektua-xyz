# SB-028 — Preservar carrinho e WhatsApp durante o cutover

**Data:** 2026-09-23  
**Status:** EM ANDAMENTO — implementação preventiva concluída; evidência E2E em fonte Supabase bloqueada por dependências anteriores.  
**Card:** `[SB-028][P0] Preservar carrinho e WhatsApp durante o cutover`  
**Branch:** `sb-028-preserve-cart-whatsapp-cutover`  
**Base da main:** `bd37d0fbae9a9e072b5e4d41ec0965d46de27faf`  
**GitHub Actions:** não utilizado.

## Objetivo

Preservar o fluxo comercial existente — carrinho em sessão + rascunho de pedido por WhatsApp, sem pagamento no site — quando a fonte do catálogo for trocada do fallback estático para Supabase.

## Implementação desta rodada

1. `components/cart-context.tsx`
   - remove a dependência direta de `commercialProducts` na validação e na inclusão de itens;
   - mantém limites de quantidade e tamanho dos campos;
   - filtra payloads de storage malformados sem derrubar a aplicação;
   - preserva `vektua-cart-v2`, migração de `vektua-demo-cart-v1` e `sessionStorage`.

2. `lib/whatsapp-order.ts`
   - mantém o comportamento atual por padrão;
   - torna o snapshot de produtos injetável;
   - permite que SB-027 forneça o catálogo vindo do Supabase sem duplicar lógica de WhatsApp;
   - continua ignorando itens sem produto resolvido e nunca cria pedido/pagamento persistido.

3. `scripts/tests/sb-028-cart-whatsapp-browser.mjs`
   - exige `EXPECTED_CATALOG_SOURCE=supabase` para impedir falso PASS em modo estático;
   - cobre um objeto (`G-ORG-RC-01`) e um chaveiro (`G-CHV-BLO-01`);
   - cobre adicionar, alterar quantidade, remover, persistir sessão, conteúdo do WhatsApp, ausência de coleta de pagamento e storage legado inválido;
   - gera `results.json` e screenshot como evidência.

## Bloqueios verificados

### BLK-SB028-01 — SB-026 ainda não implementado na main

Não existe `CATALOG_SOURCE=static|supabase` na revisão-base. Portanto não há como iniciar o storefront explicitamente em modo Supabase sem antecipar o escopo do card SB-026.

**Owner:** Engineering / SB-026.  
**Condição de desbloqueio:** implementação e evidência do seletor de fonte.

### BLK-SB028-02 — SB-027 ainda não implementado na main

O storefront atual continua importando `commercialProducts` / `commercialLines` diretamente. O próprio cronograma define SB-028 como dependente de SB-027.

**Owner:** Engineering / SB-027.  
**Condição de desbloqueio:** storefront consumir o `CatalogRepository` de forma assíncrona e passar o snapshot resolvido ao fluxo de carrinho/WhatsApp.

### BLK-SB028-03 — catálogo Supabase não está publicado para leitura pública

O projeto Supabase contém 30 produtos, todos deliberadamente em `status='draft'` e `visibility='hidden'`, conforme SB-021. O `SupabaseCatalogRepository` lê somente `published/public`. Alterar status/visibility não pertence ao SB-028 e não deve ser inferido.

**Owner:** fluxo/gate responsável por publicação de catálogo antes do cutover.  
**Condição de desbloqueio:** estado de catálogo compatível com a política aprovada e com o teste em modo Supabase, sem burlar gates.

## DoD — estado nesta rodada

| Critério | Estado | Evidência / limite |
|---|---|---|
| Adicionar item funciona com fonte Supabase | BLOQUEADO | Código do carrinho preparado; SB-026/SB-027 ausentes impedem execução real em fonte Supabase. |
| Alterar quantidade | PREPARADO | Fluxo existente preservado; teste E2E versionado, execução final pendente. |
| Remover item | PREPARADO | Fluxo existente preservado; teste E2E versionado, execução final pendente. |
| Persistência da sessão | PREPARADO | `sessionStorage` e chave `vektua-cart-v2` preservados; teste E2E pendente. |
| WhatsApp contém SKU, opção e quantidade | PREPARADO | Resolver de catálogo tornou-se injetável; teste E2E verifica objeto + chaveiro. |
| Nenhum pagamento é iniciado | PREPARADO | Sem código de pagamento adicionado; teste E2E verifica ausência de coleta. |
| Carrinho antigo inválido não quebra | IMPLEMENTADO / TESTE PENDENTE | Parser continua protegido por `try/catch` e validação estrutural; browser test pendente. |
| Objeto + chaveiro em fonte Supabase | BLOQUEADO | Depende de SB-026/SB-027 e catálogo legível no modo público aprovado. |

## Critério para concluir o card

Executar `scripts/tests/sb-028-cart-whatsapp-browser.mjs` no mesmo commit candidato, com servidor iniciado com `CATALOG_SOURCE=supabase`, obter zero falhas, anexar o `results.json`/screenshot e então atualizar o Trello para Concluído.

Até isso ocorrer, o estado correto é **EM ANDAMENTO**, não Concluído.
