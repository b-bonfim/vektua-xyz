# SB-001 — Baseline técnico pré-migração para Supabase

**Data:** 2026-09-22  
**Card:** `[SB-001][P0] Registrar baseline técnico do repositório e Supabase`  
**Escopo:** fotografia verificável do estado anterior à migração; nenhuma alteração de schema/dados do Supabase neste card.  
**Regra de execução:** **GitHub Actions proibido**. Este registro foi produzido por leitura direta do repositório/Trello/Supabase e por commit documental, sem acionar workflows.

## 1. Âncora de rollback do repositório

- Repositório: `b-bonfim/vektua-xyz`
- Branch canônica observada: `main`
- Commit de referência **anterior a este documento**: `92eab39e73eed6a9eebd28652ef17aeea8886d51`
- Mensagem: `fix(storefront): padronizar selos de imagem meramente ilustrativa`
- Data do commit: 2026-09-22T00:53:03Z
- A branch `main` não estava protegida no snapshot consultado.
- Esta SHA é a âncora para comparação/rollback de código durante a migração. O commit que adiciona este documento é posterior e não altera o storefront.

## 2. Runtime, framework e package manager

Fonte: `package.json` da `main` no commit de referência.

| Item | Baseline |
|---|---|
| Node.js | `>=22.13.0` em `engines.node`; **não há pin exato adicional no repositório** |
| package manager | `npm@10.9.2` |
| lockfile | `package-lock.json` presente |
| Next.js | `16.3.4` |
| React | `19.2.6` |
| React DOM | `19.2.6` |
| Vinext | `1.0.0-beta.9` |
| Vite | `8.0.13` |
| Drizzle ORM | `0.45.2` |
| Drizzle Kit | `0.31.10` |

## 3. Arquivos que hoje sustentam catálogo, carrinho, WhatsApp e imagens

### Catálogo/storefront
- `app/page.tsx` — entrypoint da home; delega para `CommerceStorefront`.
- `components/commerce-storefront.tsx` — storefront comercial atual, catálogo, PDP, carrinho e CTA de WhatsApp.
- `lib/catalog.ts` — catálogo/base estática legada usada como origem.
- `lib/commercial-catalog.ts` — agrega o catálogo comercial efetivamente consumido pelo storefront, incluindo SKUs adicionais de chaveiros.
- `lib/sku-copy.ts` e `lib/sku-names.ts` — apoio de copy/nome dos SKUs.

### Carrinho e WhatsApp — **fluxo protegido**
- `components/cart-context.tsx` — estado do carrinho no cliente; usa `sessionStorage` com chave `vektua-cart-v2`; não persiste pedido em backend.
- `components/commerce-storefront.tsx` — UI do carrinho e botão “Enviar pedido pelo WhatsApp”.
- `lib/whatsapp-order.ts` — monta a mensagem editável com SKU, opção e quantidade; abrir/enviar a mensagem não cria pedido confirmado.
- `lib/whatsapp.ts` — URL/mensagem do contato geral.
- Estado funcional a preservar durante toda a migração: **carrinho utilizável + geração do pedido para WhatsApp + ausência de pagamento online no site**.

### Imagens
- `public/images/products/remix/` — imagens comerciais REMIX versionadas.
- `public/images/` — demais imagens estáticas/conceituais atuais.
- `lib/responsive-images.json` — manifesto de variantes responsivas.
- `components/responsive-image.tsx` — entrega das variantes estáticas via `srcSet`.
- `public/images/provenance.json` — proveniência de ativos conceituais registrados no repositório.

## 4. Persistência atual no repositório — D1/Drizzle

### `db/index.ts`
O arquivo importa `env` de `cloudflare:workers`, usa `drizzle-orm/d1` e exige o binding `env.DB`. Portanto, o adaptador atual aponta para **Cloudflare D1**.

### `db/schema.ts`
O arquivo contém apenas comentários informando que está intencionalmente vazio e termina com `export {};`. **Não existe schema de negócio definido nesse arquivo no baseline.**

Consequência para a migração: não há schema de negócio D1 versionado a ser preservado como fonte canônica; qualquer schema Supabase deverá nascer em migrations próprias e rastreáveis nos cards seguintes.

## 5. Estado do Supabase — projeto Vektua XYZ

Consulta direta ao projeto `tbffwwjqkusiupahjqux`.

- Projeto: `Vektua XYZ`
- Ref: `tbffwwjqkusiupahjqux`
- Região: `sa-east-1`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: engine 17; versão reportada `17.6.1.166`
- URL do projeto: `https://tbffwwjqkusiupahjqux.supabase.co`

### Objetos da aplicação no momento do snapshot

| Objeto | Estado |
|---|---|
| Tabelas no schema `public` | **0** |
| Migrations registradas | **0** |
| Storage buckets | **0** |
| Edge Functions | **0** |

A consulta de buckets foi feita somente por leitura em `storage.buckets`. Nenhuma tabela, migration, bucket, função ou dado foi criado/alterado neste card.

## 6. GitHub Actions — proibição explícita

A política vigente para a migração é: **não utilizar GitHub Actions**.

O repositório contém, por histórico, os arquivos:
- `.github/workflows/issue-8-perf-lab.yml`
- `.github/workflows/qa-remediation.yml`

Ambos têm `workflow_dispatch` e gatilho de `push` restrito a branches antigas/específicas; **não têm gatilho de push para `main`**. Eles não foram acionados nesta execução e não devem ser usados nos cards da L99.

## 7. Higiene de segredos

Este documento **não contém**:
- senha de banco;
- service role/secret key;
- anon/publishable key;
- tokens GitHub/Trello;
- credenciais de hospedagem;
- secrets de Edge Functions.

Somente identificadores públicos/operacionais necessários ao baseline foram registrados.

## 8. Checklist DoD do SB-001

- [x] Branch/commit de referência da `main` registrados.
- [x] Node, Next.js, React, Vinext, Vite, Drizzle e package manager registrados; onde o repositório não fixa versão exata (Node), a ausência do pin foi explicitada.
- [x] Arquivos atuais de catálogo, carrinho e imagens registrados.
- [x] `db/index.ts` confirmado como adaptador D1.
- [x] `db/schema.ts` confirmado sem schema de negócio.
- [x] Estado do Supabase registrado: tabelas, migrations, buckets e Edge Functions.
- [x] Carrinho/WhatsApp registrado como fluxo protegido a preservar.
- [x] Proibição de GitHub Actions registrada e respeitada.
- [x] Nenhuma credencial secreta copiada.

## 9. Resultado do card

**SB-001: DoD documental atendida.**  
Este card apenas estabelece o baseline. Ele **não** aprova a arquitetura final, não cria schema Supabase, não realiza cutover e não altera o comportamento do storefront. O próximo card do plano é o **SB-002 — Formalizar ADR — Supabase como backend canônico**, sujeito ao seu próprio Founder Gate.
