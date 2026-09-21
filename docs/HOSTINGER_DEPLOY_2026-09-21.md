# Vektua XYZ — Hostinger Node.js: implantação controlada com npm

**Data:** 21/09/2026 (BRT). **Estado:** documento atualizado APENAS na branch draft da PR #23; npm lock, `npm ci`, build, smoke e deploy ainda NÃO verificados. Não usar este documento como autorização para publicar. Escopo permanece vitrine + carrinho + rascunho WhatsApp, sem pagamento ou confirmação automática de pedido; sem ativar indexação.

## 1. Histórico do incidente pnpm e motivo da migração

A implementação original da PR #20 adicionou `build:hostinger` e `start:hostinger` porque `build`/`start` padrão usam Cloudflare Worker/Wrangler, não o servidor Node standalone esperado. A Hostinger, porém, falhou antes de executar qualquer build ao tentar carregar `~/.cache/node/corepack/v1/pnpm/12.5.1/bin/pnpm.cjs` com `MODULE_NOT_FOUND` em Node v22.18.0, apesar de o `package.json` original fixar pnpm 11.25.0. Novos redeploys reproduziram o mesmo erro. O suporte informou que não há comando personalizado de instalação anterior ao build no hPanel; propôs npm como contingência com um `package-lock.json` correspondente e investigação interna para manter pnpm. A causa definitiva no Corepack do provedor não foi comprovada por acesso ao executor.

**Decisão do Founder 21/09/2026:** iniciar migração para npm. A branch `fix/hostinger-npm-migration-20260921` prepara `packageManager: npm@10.9.2`, `install:ci: npm ci`, check de lockfile e exclusão do `pnpm-lock.yaml` e `pnpm-workspace.yaml` somente na branch. A `main` continua com pnpm até eventual merge. O antigo `package-lock.json` ainda possui dependências divergentes: `vinext beta.5` e `@vitejs/plugin-rsc 0.5.26` no root, em vez de `beta.9`/`0.5.34`. **Esta PR NÃO pode ser implantada ou integrada até regenerar lock, verificar instalação e testes.** Procedimento autoritativo de migração: [NPM_MIGRATION_HOSTINGER_2026-09-21.md](NPM_MIGRATION_HOSTINGER_2026-09-21.md). Histórico detalhado no incidente [#21](https://github.com/b-bonfim/vektua-xyz/issues/21).

## 2. Build Node correto, independente do gerenciador

`npm run build:hostinger` usa `scripts/run-framework.mjs build-hostinger`, define `VEKTUA_DEPLOY_TARGET=hostinger` e solicita a saída `output: standalone` via `next.config.ts`; o teste `scripts/tests/hostinger-artifact.mjs` exige `dist/standalone/server.js` e verifica o pin npm preparado. `npm run start:hostinger` executa `node dist/standalone/server.js`; o `npm run start` padrão continua sendo comando do ambiente Cloudflare anterior, portanto não o usar na Hostinger. A existência do artefato e compatibilidade de runtime no SHA final NÃO foram demonstradas nesta migração.

### Configuração pretendida no hPanel — somente após testes, merge e Founder Gate

| Campo | Valor |
|---|---|
| Origem | repositório `b-bonfim/vektua-xyz`, branch `main`, conferir SHA efetivamente implantado |
| Preset | Node.js / Other, se necessário para evitar preset incompatível; observar campos reais do hPanel |
| Node | 22.x, minor >= 22.13.0; conferir minor e versão real do npm nos logs |
| Gerenciador de pacotes | **npm**; conferir que a instalação automática não invoca Corepack/pnpm, idealmente `npm ci` |
| Build | `npm run build:hostinger` — NÃO incluir instalação ou Corepack no comando de build |
| Saída | `dist/standalone` |
| Arquivo de entrada | `server.js` quando o campo é relativo ao diretório de saída; conferir layout efetivo |
| Start, se houver campo | `npm run start:hostinger` ou `node dist/standalone/server.js`, conforme formato aceito |
| Endereço/porta | `HOST=0.0.0.0` e `PORT` fornecido pela hospedagem; não impor bind em `127.0.0.1` em produção |
| Segredos | somente no ambiente do provedor; não versionar `.env`, senhas ou chaves privilegiadas |
| Domínio | hPanel mostrado com `vektua.xyz`, mas registros anteriores citam `vektua.com.br`: Founder confirma endereço definitivo antes de DNS/redirect |

O `packageManager: npm@10.9.2` fixa a intenção da migração; não prova que o provedor disponibilize essa versão exata. O log deve registrar npm realmente executado e instalar lock reproduzível. Se o provedor voltar a chamar Corepack/pnpm, documentar e devolver ao suporte com SHA/deploy ID.

## 3. Verificação sem GitHub Actions

Usar checkout completo e rede de registry com Node >=22.13/npm10; primeiro regenerar o `package-lock.json` conforme o runbook de migração. Depois, no MESMO candidato de release:

```sh
npm run check:npm-lock
npm ci --no-audit --no-fund
node scripts/tests/go-live-static.mjs
npm run lint
npm exec -- tsc --noEmit
npm run build:hostinger
node scripts/tests/hostinger-artifact.mjs
```

Inicializar o servidor standalone em ambiente isolado com `HOST=127.0.0.1 PORT=3000 npm run start:hostinger` (em Windows PowerShell, definir variáveis separadamente) e rodar em outra sessão `BASE_URL=http://127.0.0.1:3000 node scripts/tests/hostinger-http-smoke.mjs`. Esse teste percorre rotas/imagens e HTTP/MIME/assinaturas, mas não substitui visual/browser, prefetch, carrinho ou aceitação manual de WhatsApp. Testar carrinho → URL `wa.me/5535984445677` em desktop/mobile sem enviar mensagem real ou coletar dado de cliente. Registrar SHA, Node/npm, exit codes, horários, logs, screenshots e lista de falhas. Não afirmar PASS por existência de script não executado.

## 4. Merge, publicação e rollback

1. Verificar regeneração/commit do lock, remoção dos artefatos pnpm nesta PR, coerência de scripts e evidências no SHA revisado; revisar diff. O antigo instalador pnpm é legado e suas referências ativas precisam de inspeção antes de exclusão.
2. Founder autoriza formalmente a liberação do site depois de QA; mudança do gerenciador não equivale a autorização de lançamento integrado, indexação ou comercialização sem demais gates.
3. Após merge para `main`, configurar npm no hPanel e iniciar deploy pela integração GitHub da Hostinger, **NUNCA GitHub Actions**. Salvar deployment ID, SHA, comando/versão npm efetivos, instalação, build e runtime.
4. Conferir URL/HTTPS, páginas `/`, `/busca`, `/chaveiros`, `/carrinho`, `/produto/g-chv-blo-01`, políticas, imagens REMIX, responsividade, carrinho e WhatsApp. `noindex` permanece enquanto não houver decisão expressa.
5. Falha após deploy: aplicar rollback pelo mecanismo realmente disponível e verificado no hPanel, apontando para release anterior conhecido; a `main` anterior e o incidente #21 preservam a configuração pnpm histórica, mas o Corepack da Hostinger segue quebrado até comprovada correção. Não assumir que rollback do código sozinho fará o pnpm funcionar no provedor.

**Owners:** lock/testes/compatibilidade e revisão do PR: Engenharia web + operador; instalação gerenciada: Hostinger; Founder: merge/publicação; Commerce/Quality: validação dos fluxos no escopo apropriado. Notion e Trello não atualizados por esta preparação.

**Referências:** [Node.js Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), [redeploy](https://www.hostinger.com/support/how-to-redeploy-a-node-js-application/), [erro de build](https://www.hostinger.com/support/fix-failed-to-build-application-error-hostinger-node-js/) e [Vinext](https://github.com/cloudflare/vinext). Referências externas não demonstram que o deploy Vektua passou.
