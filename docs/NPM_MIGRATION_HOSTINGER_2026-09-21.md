# Vektua XYZ — migração controlada de pnpm para npm (Hostinger)

**Data:** 21/09/2026 (BRT). **Status: EM PREPARAÇÃO / BLOQUEADO PARA MERGE E DEPLOY.** A aprovação do Founder para migrar o gerenciador de pacotes não é comprovação de instalação, compilação, publicação ou QA. Escopo: manter o site e o carrinho/solicitação via WhatsApp, sem pagamentos, sem ativar indexação e sem GitHub Actions.

## Diagnóstico e decisão

A Hostinger confirmou falha ANTES do build em Corepack `pnpm/12.5.1/bin/pnpm.cjs`, embora `package.json` declare `pnpm@11.25.0`; o suporte ofereceu npm como contingência, sujeito a lockfile correspondente. Na `main` de origem `e10e592a5a62551694136c88915ac0b9e352130b` já existe `package-lock.json` em formato v3, porém seu manifesto-raiz guarda `@vitejs/plugin-rsc: 0.5.26` e `vinext: 1.0.0-beta.5`, diferentes do `package.json` vigente (`0.5.34` e `1.0.0-beta.9`). Não renomear o lockfile pnpm, não trocar apenas o seletor do hPanel, não usar `npm install` como substituto silencioso de `npm ci` e não usar `--force` ou `--legacy-peer-deps` para ocultar incompatibilidade.

Esta branch prepara `package.json` (`npm@10.9.2`, `install:ci=npm ci`), o teste do artefato Hostinger e um teste de coerência do lockfile. **O `package-lock.json` ainda precisa ser regenerado em checkout real com rede; portanto esta branch NÃO está pronta para produção.** Os arquivos pnpm antigos ficam temporariamente intactos como trilha de rollback até a instalação e o build npm passarem. Não configurar Hostinger para apontar a esta branch enquanto houver pendências.

## Execução necessária em checkout completo (sem GitHub Actions)

No computador do operador com Git, Node >=22.13 e npm 10.x, rodar na raiz do repositório:

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

O npm precisa acessar seu registry para resolver dependências. Se `npm install --package-lock-only` retornar ERESOLVE/ETARGET/erro de rede, PARAR, preservar log sem segredos e resolver o problema específico; não afirmar migração concluída. `npm run check:npm-lock` compara dependências diretas/engines, **não** valida toda a árvore; somente `npm ci` valida instalação reproduzível e integridade. Build e testes só valem no checkout/commit candidato. Node 22.18.0 do log do provedor satisfaz o mínimo do projeto, mas a versão real do npm do provedor deve ser conferida.

Se todos os comandos acima passarem, remover os artefatos pnpm antigos do controle de versão: `git rm pnpm-lock.yaml pnpm-workspace.yaml`. Revisar referências ativas a `scripts/install-pnpm.sh` e `scripts/pnpm-install.mjs` antes de excluí-los; não remover caminhos utilizados por outros fluxos sem adaptar. Rodar `npm ci`, `npm run check:npm-lock` e `npm run build:hostinger` **novamente após as remoções**. Atualizar o README e o runbook Hostinger para trocar os comandos pnpm pelos npm e documentar o rollback histórico, e então:

```sh
git add package.json package-lock.json scripts/tests/hostinger-artifact.mjs scripts/tests/npm-lock-consistency.mjs docs/NPM_MIGRATION_HOSTINGER_2026-09-21.md README.md docs/HOSTINGER_DEPLOY_2026-09-21.md
git commit -m "fix(hostinger): complete npm lockfile migration and verify Node build"
git push -u origin fix/hostinger-npm-migration-20260921
```

Se não houver alterações adicionais para commitar, verificar `git status` antes do push. **Não fazer merge de PR apenas porque o lockfile foi atualizado**: anexar comando, exit code, Node/npm, commit SHA e evidência do artefato; depois revisar o diff, fazer merge aprovado e somente então configurar o hPanel. Não usar GitHub Actions.

## Configuração Hostinger após merge e gates

Gerenciador de pacotes `npm`; build `npm run build:hostinger`; root `./`; Node `22.x` (>=22.13); saída `dist/standalone`; entry `server.js` se relativo ao diretório de saída. O painel não expõe install command: verificar que instalação automática executa npm e, idealmente, `npm ci`, e não Corepack/pnpm. Confirmar SHA do merge no log. Se o painel continuar selecionando pnpm, encaminhar prova ao suporte.

Após instalação: conferir build, `dist/standalone/server.js`, boot, smoke HTTP/MIME/imagens pelo `scripts/tests/hostinger-http-smoke.mjs`, fluxo de carrinho para URL `wa.me/5535984445677`, SSL e domínio correto. O teste HTTP não comprova recebimento de WhatsApp, pagamento ou aprovação de lançamento. Não alterar DNS, indexação, produtos, preços ou gates comerciais por efeito colateral. Founder decide liberação específica do site depois da evidência.

**Owners:** implementação/lockfile/testes: Engenharia web + operador com checkout/rede; revisão de implantação: VP/Commerce; instalação automática e logs: Hostinger; merge/publicação: Founder após evidência. **Notion não atualizado nesta preparação.** Incidente: https://github.com/b-bonfim/vektua-xyz/issues/21.
