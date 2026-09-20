# QA follow-up — 20/09/2026

**Base:** `main@d14671bc68ab7d39c5695c52c082e728d6910605` (merge confirmado da PR #6). **Branch:** `fix/navigation-metadata-perf-20260920`. **Natureza:** implementação parcial isolada, sem merge/deploy.

## Código efetivamente alterado

- `components/brand-shell-v2.tsx`: menu `<details>` fecha ao ativar um link e com Escape, restaura foco ao resumo ao fechar com Escape, remonta no pathname e identifica rota ativa. Mesmo cabeçalho/rodapé para as rotas que já importam este shell.
- `components/home-v2.tsx`: remove implementações privadas de Header/Footer/Logo, passa a reutilizar `BrandHeader`/`BrandFooter`, preservando conteúdo, linhas, filtros, URLs, imagens e bloqueios comerciais existentes. `main` agora oferece o mesmo alvo de skip link focável.
- `scripts/apply-site-qa-fixes.mjs`: codemod **PREPARADO E COMMITADO, MAS NÃO APLICADO**. Quando executado com `--write` em checkout integral, substitui Header/Footer/Logo legados de `components/storefront.tsx` pelo shell comum, elimina `useEffect` que usa `setOpen(false)` durante a navegação (segundo erro de lint), elimina a escrita em `document.title` (mantém metadata do servidor) e corrige link pet/pessoa na ficha genérica. Valida âncoras e é idempotente; execução explícita, não modifica arquivos durante install/lint/build.
- `scripts/tests/site-qa-codemod.test.mjs`: dois testes de unidade do transformador **executados no ambiente local com fixture artificial, 2 PASS / 0 FAIL**. Esses testes não examinam o arquivo real do checkout, não são testes E2E e não validam a home.
- `docs/PERFORMANCE_BASELINE_2026-09-20.md`: inventário estático de bytes de 16 imagens REMIX na árvore Git da base, sem recompressão. Não é uma medição de Core Web Vitals.

## Bloqueios verificados na sessão

O ambiente de execução não tem checkout do repositório; `git ls-remote https://github.com/b-bonfim/vektua-xyz.git HEAD` retornou erro de DNS `Could not resolve host: github.com`. `corepack pnpm install --frozen-lockfile`, `corepack pnpm lint`, `corepack pnpm exec tsc --noEmit` e `corepack pnpm build` foram tentados e interrompidos pelo acesso indisponível a `registry.npmjs.org`, antes de executar o projeto. A instalação não foi resolvida. Não foi iniciado servidor do site, logo **nenhum teste funcional, visual, Lighthouse ou browser QA da revisão foi executado**, apesar de haver Chromium instalado neste ambiente. Não reutilizar resultados de builds anteriores como prova do HEAD desta branch.

## Continuação exigida para fechar esta entrega

Em um checkout integral e ambiente com dependências disponíveis, executar **na branch**:

```bash
node --test scripts/tests/site-qa-codemod.test.mjs
node scripts/apply-site-qa-fixes.mjs --write
node scripts/apply-site-qa-fixes.mjs --check
git diff --check
pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Revisar diff e commitar `components/storefront.tsx` em commit separado. Em seguida servir a revisão e testar desktop/móvel, links e estado do menu (inclusive teclado e Escape), títulos de todas as rotas, catálogo e filtros, coleção, nove fichas, carrinho, os dois personalizadores, políticas, reduced motion, zoom 200% e console; registrar evidência, hash e limitações. Medir bytes efetivamente transferidos, LCP/CLS e perfil de carregamento no navegador antes de decidir por imagens responsivas. QA assinado exige evidência da aplicação real, não apenas a passagem do codemod sobre fixture.

**Status por escopo:** shell compartilhado/home alterados; storefront legado/correção do segundo lint/títulos gerais **pendentes de aplicação do codemod**; imagem estática medida; performance real e retestes não medidos; PR deve ficar draft e sem merge. Nenhuma alteração de produto, SKU Gate, preço comercial, deploy ou lançamento. Owner: Commerce/frontend, Engineering/QA; Quality mantém gates jurídicos e de conformidade.
