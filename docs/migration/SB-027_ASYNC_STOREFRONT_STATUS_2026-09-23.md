# SB-027 — Storefront assíncrono — evidência e status

**Data:** 23/09/2026  
**Card:** [SB-027][P0] Adaptar storefront para dados assíncronos  
**Owner:** Engineering  
**Coordenação:** VP Execution Orchestrator  
**Branch:** `feat/sb-027-async-storefront-20260923`  
**Base:** `main@bd37d0fbae9a9e072b5e4d41ec0965d46de27faf`  
**Status:** **EM ANDAMENTO — implementação de código preparada; DoD operacional ainda não totalmente comprovado**  
**GitHub Actions:** **não utilizado**.

## 1. Objetivo

Remover a dependência estrutural do storefront ativo em `lib/commercial-catalog.ts` onde a fonte de dados precisa ser intercambiável, preservando a experiência comercial e permitindo que a aplicação receba o catálogo de forma assíncrona por uma camada de repositório.

## 2. Alterações implementadas

- `lib/catalog-repository/runtime.ts`
  - introduz selector `CATALOG_SOURCE=static|supabase`;
  - default seguro: `static`;
  - valor inválido falha explicitamente;
  - componentes não conhecem a flag.
- `components/commerce-storefront-loader.tsx`
  - resolve `CatalogRepository` no servidor;
  - carrega linhas + produtos com `Promise.all`;
  - entrega dados serializáveis ao storefront cliente.
- `components/commerce-storefront.tsx`
  - não importa mais `commercial-catalog`;
  - recebe `lines` e `products` por props;
  - home, busca, filtros, páginas de produto, relacionados e carrinho usam o catálogo recebido;
  - mantém página de produto inexistente;
  - adiciona estado explícito para home sem produtos.
- `components/cart-context.tsx`
  - remove validação estrutural por import do catálogo estático;
  - mantém validação de forma/quantidade do item.
- `lib/whatsapp-order.ts`
  - resolve SKU/nome contra o catálogo ativo fornecido pelo storefront;
  - não importa mais o catálogo estático.
- Rotas do storefront passam a usar `CommerceStorefrontLoader`.
- `app/[...path]/page.tsx` resolve metadata de produto de forma assíncrona pelo repositório.
- Testes reproduzíveis adicionados:
  - `scripts/tests/async-storefront-contract.mjs`;
  - `scripts/tests/async-storefront-http-smoke.mjs`.

## 3. Verificação estrutural executada

Foi inspecionada a branch real pelo conector GitHub após as alterações.

Resultado:

```text
SB027_STRUCTURAL_INSPECTION_PASS
filesChecked=14
legacyStorefrontStaticImport=false
storefrontSupabaseKnowledge=false
asyncRoutes=true
```

A comparação Git registrou a branch à frente de `main` e sem commits atrasados no momento da inspeção.

## 4. Estado real do Supabase verificado

Projeto: `tbffwwjqkusiupahjqux` — Vektua XYZ.

Consulta em 23/09/2026:

```text
products:
  draft / hidden = 30
  published / public = 0

product_lines:
  active = 4
  total = 4
```

Isso é coerente com o seed conservador já documentado: a migração não promove estado comercial que não possua evidência própria.

O `SupabaseCatalogRepository` público filtra por `status=published`, `visibility=public` e linha ativa. Portanto, **o modo `supabase` atualmente retorna zero produtos por desenho de segurança**.

## 5. DoD — estado desta rodada

| Critério | Estado | Evidência / limite |
|---|---|---|
| Home continua exibindo produtos previstos | **PENDENTE NO MODO SUPABASE** | Código suporta catálogo assíncrono; banco público tem 0 produtos publicáveis hoje. |
| Busca continua funcionando | **IMPLEMENTADO; SMOKE PENDENTE** | Busca opera sobre `products` recebido; teste HTTP versionado. |
| Filtros por linha continuam funcionando | **IMPLEMENTADO; SMOKE PENDENTE** | Filtro opera sobre as quatro linhas recebidas. |
| Rotas `/produto/[slug]` permanecem estáveis | **IMPLEMENTADO; SMOKE PENDENTE** | Slug é resolvido pelo catálogo carregado; not-found preservado. |
| Carrinho continua resolvendo itens por SKU/ID | **IMPLEMENTADO; SMOKE PENDENTE** | Carrinho/WhatsApp resolvem contra o catálogo ativo, não contra import estático. |
| Quatro linhas continuam acessíveis | **IMPLEMENTADO; SMOKE PENDENTE** | Supabase possui quatro linhas ativas; navegação estrutural permanece. |
| Estado vazio e produto inexistente são tratados | **IMPLEMENTADO** | Home tem estado vazio; produto desconhecido mantém “Página não encontrada.” |
| Nenhuma mudança de copy/preço por efeito técnico | **INSPEÇÃO PASS; SMOKE PENDENTE** | Copy comercial existente foi preservada; nenhum preço/registro de preço foi criado. |
| Smoke em ambos os modos | **PENDENTE** | Ambiente desta sessão não conseguiu clonar GitHub por DNS; e modo Supabase público não possui produtos publicados para provar equivalência. |

## 6. Bloqueios objetivos

### BLK-SB027-01 — Dependência SB-026 não concluída

O card predecessor SB-026 ainda não possuía implementação integrada/DoD encerrado no início desta rodada. O selector mínimo foi implementado nesta branch para permitir a adaptação, mas o requisito de **build nos dois modos** continua sem evidência e deve ser conciliado antes do fechamento.

**Owner:** Engineering.

### BLK-SB027-02 — Smoke local/Hostinger não executado nesta sessão

A tentativa de clone local falhou por resolução DNS de `github.com`. Nenhum build, TypeScript, lint ou servidor local foi alegado como PASS.

**Owner:** Engineering / operador do ambiente local.

### BLK-SB027-03 — Catálogo público Supabase vazio por estado comercial

Os 30 produtos estão `draft/hidden`; alterar para `published/public` apenas para fazer o teste passar violaria a separação entre migração técnica e promoção comercial.

**Owner:** VP/Engineering para resolver a estratégia de ambiente de QA; eventual promoção de estado exige a autorização/gate aplicável.  
**Não executar:** não alterar status de produto de produção ad hoc para fechar o card.

## 7. Segurança, escopo e não-ações

- Nenhum DDL aplicado.
- Nenhum registro comercial alterado no Supabase.
- Nenhuma chave service-role usada.
- Nenhum produto publicado.
- Nenhum cutover executado.
- Nenhum pagamento habilitado.
- Nenhum GitHub Actions acionado.
- Google Drive foi consultado apenas para confirmar a organização disponível das quatro linhas; nenhum arquivo foi alterado.
- Impeccable aplicado apenas como referência de hardening; identidade/copy não foram redesenhadas.

## 8. Próxima validação

1. Executar `node scripts/tests/async-storefront-contract.mjs` no checkout real da branch.
2. Executar lint e TypeScript localmente.
3. Subir o candidato com `CATALOG_SOURCE=static` e executar `async-storefront-http-smoke.mjs`.
4. Não promover produtos de produção para teste.
5. Definir ambiente/dataset de QA que permita testar o adapter Supabase com registros publicáveis equivalentes; então repetir o smoke com `CATALOG_SOURCE=supabase`.
6. Só marcar SB-027 como concluído após ambos os logs PASS no mesmo candidato.

## 9. Founder Gate

**Nenhum Founder Gate é solicitado para a refatoração de código.**  
**O cutover permanece fora deste card** e continua sujeito aos cards de readiness/autorização posteriores.
