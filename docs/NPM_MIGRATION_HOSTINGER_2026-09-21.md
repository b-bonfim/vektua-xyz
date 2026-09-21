# Vektua XYZ — migração controlada para npm na Hostinger

**21/09/2026 (BRT) — PREPARADA EM BRANCH; NÃO MERGEAR/NÃO IMPLANTAR.** Decisão expressa do Founder: migrar para npm para contornar a falha de Corepack no executor Hostinger. Não alterar produtos, pagamentos, DNS, indexação, carrinho→WhatsApp, nem executar GitHub Actions. A alteração do gerenciador não autoriza publicar ou declara QA aprovado.

## Diagnóstico e modificações verificadas

A Hostinger falha ANTES do build em `corepack/v1/pnpm/12.5.1/bin/pnpm.cjs`, apesar de `packageManager: pnpm@11.25.0` na `main`. O `package-lock.json` que já existe é antigo: declara `@vitejs/plugin-rsc: 0.5.26` e `vinext: 1.0.0-beta.5` enquanto o manifesto atual requer `0.5.34` e `1.0.0-beta.9`. O lock precisa ser regenerado via npm em checkout real com rede, não renomeado/copied do pnpm.

Branch `fix/hostinger-npm-migration-20260921` partiu de `main` SHA `e10e592a5a62551694136c88915ac0b9e352130b`; contém `package.json` com `packageManager: npm@10.9.2`, `install:ci: npm ci` e `check:npm-lock`, teste do artefato Hostinger adaptado, `scripts/tests/npm-lock-consistency.mjs` e **remoção de `pnpm-lock.yaml` e `pnpm-workspace.yaml` SOMENTE NA BRANCH**. Scripts históricos `scripts/install-pnpm.sh`/`scripts/pnpm-install.mjs` e documentos antigos requerem revisão, não são evidência de execução do npm. A `main` continua sem mudança por este PR.

## Passo obrigatório no checkout com rede, Node >=22.13 e npm 10.x

No repositório já clonado:

```sh
git fetch origin
git switch fix/hostinger-npm-migration-20260921
git pull --ff-only origin fix/hostinger-npm-migration-20260921
node --version
npm --version
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
npm run check:npm-lock
npm ci --no-audit --no-fund
node scripts/tests/go-live-static.mjs
npm run lint
npm exec -- tsc --noEmit
npm run build:hostinger
node scripts/tests/hostinger-artifact.mjs
```

Se a instalação retornar `ERESOLVE`, `ETARGET`, falha de registry ou qualquer erro, **PARAR**, guardar log sem segredos e corrigir causa específica; não usar `--force` nem `--legacy-peer-deps` sem análise e decisão formal. `npm run check:npm-lock` valida manifesto-raiz; só `npm ci` verifica árvore, lock e instalação. Confirmar existência de `dist/standalone/server.js`. O ambiente atual desta execução NÃO possui checkout completo com registry funcional: nenhum `npm ci`, lint, TypeScript, build, browser ou Hostinger deploy foi validado aqui.

Após obter todos os códigos de saída zero: revisar se há referências ativas aos scripts pnpm históricos e ajustar README e `docs/HOSTINGER_DEPLOY_2026-09-21.md` para npm, preservando o diagnóstico original como histórico. Executar **novamente** `npm ci`, `npm run check:npm-lock` e `npm run build:hostinger` na revisão final; registrar logs, versões, SHA, resultado estático e artefato. Commitar `package-lock.json`, README e runbook e enviar à mesma branch (`git add ...`, `git commit -m "fix(hostinger): finish npm migration"`, `git push`). Revisar PR #23 antes do merge. Nenhum deploy antes do merge e do Founder Gate.

## Configuração de destino, somente depois de validação e merge

No hPanel selecionar `npm`; Node `22.x` com minor >=22.13; raiz `./`; comando `npm run build:hostinger`; saída `dist/standalone`; arquivo de entrada `server.js` quando relativo ao diretório de saída. Verificar no log que o auto-installer usa npm (preferencialmente `npm ci`) e NÃO Corepack/pnpm; confirmar SHA e artefato. Depois testar servidor HTTP, rotas, imagens REMIX, SSL, carrinho e link `wa.me/5535984445677` sem enviar pedidos reais. O teste HTTP automatizado existente é `scripts/tests/hostinger-http-smoke.mjs` e exige `BASE_URL`; não substitui testes reais de browser/WhatsApp. Manter `noindex` e pagamento indisponível; confirmar qual domínio será o definitivo (`vektua.xyz` mostrado no hPanel ou outro documentado).

**Owners:** Engenharia web + operador com checkout/rede: lock, compatibilidade, build, README/runbook; Hostinger: log de instalação npm; Founder: merge/publicação com evidência. **Notion não atualizado.** Incidente https://github.com/b-bonfim/vektua-xyz/issues/21 ; PR https://github.com/b-bonfim/vektua-xyz/pull/23 .
