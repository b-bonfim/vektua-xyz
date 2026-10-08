# SB-029 — Suíte funcional em modo Supabase — status e evidência

**Data:** 23/09/2026  
**Card:** [SB-029][P0] Executar suíte funcional no modo Supabase  
**Owner:** QA / Engineering  
**Coordenação:** VP Execution Orchestrator  
**Branch candidata:** `test/sb-029-functional-supabase-20260923`  
**Base técnica:** PR #49 / `d3586317968cc24ff31d31a4d266efa68b6991c6`  
**Status:** **EM ANDAMENTO — runner versionado; execução funcional bloqueada por dependências e dataset público**  
**GitHub Actions:** **NÃO utilizado**.

## Objetivo

Executar, no mesmo commit candidato ao cutover, a suíte funcional do storefront com `CATALOG_SOURCE=supabase`, cobrindo Home, busca, quatro linhas, páginas de produto, carrinho, políticas, WhatsApp e ausência de 5xx.

## Evidência verificada nesta rodada

### Supabase

Projeto `tbffwwjqkusiupahjqux` está `ACTIVE_HEALTHY`.

Estado de dados verificado em 23/09/2026:

- `product_lines`: 4 linhas;
- `products`: 30 registros;
- `draft/hidden`: 30;
- `published/public`: 0;
- RLS habilitado nas tabelas públicas observadas.

O adapter público do catálogo, já documentado no SB-025/SB-027, lê somente produtos `published/public`. Portanto, o modo Supabase atual não possui produtos públicos suficientes para satisfazer o DoD de páginas de produto/carrinho.

### Dependências

- SB-026: **EM ANDAMENTO** — faltam builds completos nos dois modos.
- SB-027: **EM ANDAMENTO** — falta smoke real nos dois modos.
- SB-028: **EM ANDAMENTO** — E2E de carrinho/WhatsApp em Supabase permanece bloqueado.
- SB-029 depende formalmente de SB-027 e SB-028.

### Ambiente de execução

Tentativa de clone local do repositório falhou por DNS para `github.com`. Portanto, nesta sessão:

- servidor local não foi iniciado;
- smoke HTTP não foi alegado como executado;
- Playwright/WhatsApp não foi alegado como executado;
- lint/TypeScript/build não foram promovidos a PASS por inferência.

## Implementação desta rodada

Foi adicionado o runner:

`scripts/tests/sb-029-functional-supabase-smoke.mjs`

Ele:

- exige `CATALOG_SOURCE_EXPECTED=supabase`;
- registra o SHA real do checkout quando Git está disponível;
- pode exigir `EXPECTED_COMMIT` para impedir teste em commit diferente;
- valida 12 rotas-alvo;
- falha em qualquer status diferente de 200;
- conta explicitamente respostas 5xx;
- valida presença de conteúdo esperado em Home, linhas, produtos, carrinho e políticas;
- grava JSON de evidência em `QA_OUTPUT`;
- não altera Supabase, não envia WhatsApp e não inicia pagamento.

Para o DoD completo, o mesmo commit também deve executar:

`scripts/tests/sb-028-cart-whatsapp-browser.mjs`

para CRUD do carrinho, persistência e conteúdo do draft do WhatsApp.

## DoD — estado em 23/09/2026

| Critério | Estado | Evidência / bloqueio |
|---|---|---|
| Home passa | PENDENTE | runtime não executado; 0 produtos públicos hoje |
| Busca passa | PENDENTE | runtime não executado |
| Quatro linhas passam | PENDENTE | 4 linhas existem no Supabase; smoke HTTP ainda não executado |
| Páginas de produto passam | BLOQUEADO | adapter público retorna 0 produtos publicáveis |
| Carrinho passa | BLOQUEADO | SB-028 E2E Supabase pendente |
| Políticas passam | PENDENTE | runner versionado; runtime não executado |
| WhatsApp passa | BLOQUEADO | SB-028 E2E Supabase pendente |
| Nenhuma rota alvo retorna 5xx | PENDENTE | requer execução HTTP real |
| Mesmo commit candidato ao cutover | PREPARADO | runner registra/verifica SHA; candidato ainda não validado |

## O que NÃO foi feito

- nenhum produto foi promovido de `draft/hidden` para `published/public`;
- nenhum RLS foi relaxado;
- nenhuma chave secret/service-role foi usada;
- nenhum GitHub Actions foi acionado;
- nenhum merge em `main`;
- nenhum cutover;
- nenhum pagamento/deploy.

Não é aceitável alterar o estado comercial do banco apenas para forçar um PASS.

## Roteiro de execução segura

1. Obter a branch candidata e registrar o SHA:
   ```bash
   git fetch origin
   git checkout test/sb-029-functional-supabase-20260923
   git pull --ff-only
   git rev-parse HEAD
   git status --short
   ```

2. Instalar e validar o checkout:
   ```bash
   npm ci
   npm run lint
   npx tsc --noEmit
   ```

3. Configurar apenas variáveis públicas do Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL=https://tbffwwjqkusiupahjqux.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>`
   - `CATALOG_SOURCE=supabase`

4. Iniciar o servidor local:
   ```bash
   npm run dev
   ```

5. Em outro terminal, no mesmo checkout:
   ```bash
   BASE_URL=http://127.0.0.1:5173/ \
   CATALOG_SOURCE_EXPECTED=supabase \
   EXPECTED_COMMIT=$(git rev-parse HEAD) \
   QA_OUTPUT=qa-artifacts/sb029-http.json \
   node scripts/tests/sb-029-functional-supabase-smoke.mjs
   ```

6. No mesmo SHA, executar o E2E de carrinho/WhatsApp do SB-028 com Playwright isolado e `EXPECTED_CATALOG_SOURCE=supabase`.

7. Só aceitar PASS quando todos os critérios acima passarem sem 5xx e os JSON/logs referenciarem o mesmo SHA.

## Bloqueio de dataset

Com o banco de produção atual, o teste deverá falhar nas páginas de produto porque existem 0 produtos `published/public`.

Rotas seguras para resolver:

1. ambiente/dataset de QA separado e autorizado, com registros equivalentes publicáveis; ou
2. executar o smoke após uma promoção comercial legítima autorizada pelo gate aplicável.

**Não criar branch Supabase paga nem alterar estado comercial de produção sem autorização específica.**

## Google Drive / Impeccable

- Google Drive: raiz de SKUs acessível; quatro pastas de linha confirmadas; nenhuma alteração realizada.
- Impeccable: sem mudança visual nesta rodada; skill avaliada e não há escopo de redesign/auditoria visual necessário para este card funcional.

## Próximo passo

Fechar SB-026 → SB-027 → SB-028 com evidência real; depois reexecutar este runner no mesmo commit candidato com dataset Supabase publicável legítimo. Somente então SB-029 pode ir para **Concluído**.
