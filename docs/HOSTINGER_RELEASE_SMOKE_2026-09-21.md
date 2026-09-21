# Vektua XYZ — verificação HTTP reproduzível do release Hostinger

**Data:** 21/09/2026 (BRT)  
**Escopo:** verificação técnica adicional para o site com carrinho e rascunho de solicitação pelo WhatsApp, sem pagamento online. Este procedimento não autoriza publicação, indexação, envio de mensagens, vendas ou lançamento integrado da empresa.

## Estado antes desta alteração

O merge da PR #20 (`main@a12b3c9e06b1531325057dc740325bf55c76d5c6`) adicionou build Node standalone dedicado e documentação. O erro relatado da Hostinger menciona tentativa de executar `pnpm@12.5.1` ausente do cache Corepack, embora o projeto fixe `pnpm@11.25.0`. Não foi apresentado log completo nem acesso ao hPanel; alterar o pin à força não corrige um instalador do provedor que falha antes de executar os scripts do repositório. Os testes de build real e deploy ainda exigem execução no ambiente correto.

## 1. Corrigir primeiro o instalador no ambiente do provedor

Infra deve abrir **Hostinger → Websites → Dashboard → Deployments → deployment falho → Build logs** e identificar o *primeiro* comando e stack trace, Node, gerenciador realmente selecionado, branch/SHA e acesso ao registry. Remover segredos do registro. Selecionar `pnpm 11.25.0` e Node `22.x` (mínimo `22.13.0`) se o hPanel oferecer esses campos. Se houver terminal com rede, é possível tentar preparar a versão fixada ANTES do install:

```bash
node --version
corepack enable
corepack install --global pnpm@11.25.0
corepack pnpm@11.25.0 --version
corepack pnpm@11.25.0 install --frozen-lockfile
```

Se o provedor impuser `12.5.1` ou o cache estiver quebrado antes da leitura do projeto, solicitar reparo ao suporte/operador da Hostinger. **Nenhum commit deste repositório consegue, por si, instalar um pacote que o builder do provedor tenta executar antes de iniciar o projeto.** Não executar troca isolada de versão ou reconstrução do lockfile às cegas.

## 2. Testar o mesmo SHA em checkout completo, sem GitHub Actions

Registrar SHA candidato (`git rev-parse HEAD`), Node, pnpm, horário e exit codes. Executar:

```bash
node --version
corepack pnpm@11.25.0 --version
corepack pnpm@11.25.0 install --frozen-lockfile
node scripts/tests/go-live-static.mjs
corepack pnpm@11.25.0 lint
corepack pnpm@11.25.0 exec tsc --noEmit
corepack pnpm@11.25.0 run build:hostinger
test -s dist/standalone/server.js
HOST=127.0.0.1 PORT=3000 node dist/standalone/server.js
```

Com o servidor efetivamente iniciado, em **outro terminal no mesmo checkout**:

```bash
BASE_URL=http://127.0.0.1:3000 \
QA_OUTPUT=qa-artifacts/hostinger-http-local.json \
node scripts/tests/hostinger-http-smoke.mjs
```

O smoke efetua requisições somente de leitura a **13 rotas** e a todas as URLs dos 21 mapeamentos de chaveiros REMIX na revisão documentada. Exige status HTTP 200, HTML/identidade para páginas e MIME/assinatura PNG/WebP para imagens; cada falha produz exit code 1. Não mede experiência visual, LCP, CLS, hidratação, navegação RSC, recebimento do WhatsApp ou conformidade de conteúdo.

Rodar também `PLAYWRIGHT_MODULE` e `BASE_URL` nos scripts `scripts/tests/vinext-prefetch-regression.mjs` (4/4) e `scripts/tests/site-browser-smoke.mjs`, seguidos da matriz visual/manual de `docs/GO_LIVE_SITE_2026-09-21.md`. Não reutilizar PASS de outra base: qualquer alteração posterior exige novos testes sobre o SHA final.

## 3. Depois de GO específico e deploy manual na Hostinger

Configurar build `pnpm run build:hostinger`, inicialização `node dist/standalone/server.js`, `HOST=0.0.0.0`, `PORT` definido pela Hostinger, com o gerenciador correto; seguir o runbook `docs/HOSTINGER_DEPLOY_2026-09-21.md`. Registrar deploy ID, SHA servido, URL, TLS, logs e procedimento de rollback testado. Após a publicação autorizada, repetir o smoke de leitura no domínio real:

```bash
BASE_URL=https://vektua.com.br \
QA_OUTPUT=qa-artifacts/hostinger-http-public.json \
node scripts/tests/hostinger-http-smoke.mjs
```

Em separado, comprovar navegação desktop/mobile, carrinho com dois SKUs e opções, link correto `wa.me/5535984445677` e recebimento de solicitação fictícia **somente se o operador autorizar o envio**. Confirmar políticas, características e riscos específicos dos SKUs com responsáveis. Sem decisão explícita de indexação, preservar `noindex`/robots. Sem evidências G1–G6, não declarar lançamento integrado.

## 4. Evidência desta mudança

O arquivo `scripts/tests/hostinger-http-smoke.mjs` foi submetido a `node --check` e teste isolado contra servidor HTTP simulado: cenário válido retornou exit code 0; imagem com 404 retornou exit code 1. **Isto valida apenas a lógica básica do teste**, não o build, os recursos reais nem a Hostinger. `pnpm install`, lint, TypeScript, build standalone, Playwright, deployment, DNS e rollback continuam sem validação nesta alteração. Notion e Trello não são atualizados por este documento.

**Responsabilidades restantes:** Engenharia web/QA = testar release real; Infra/Hostinger = corrigir instalação e implantar com evidências; Commerce/Founder = testar jornada e atendimento; Quality/Product = riscos concretos; Founder = GO de publicação e decisão independente de indexação.
