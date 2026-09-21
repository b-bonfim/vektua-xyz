# Vektua XYZ — Hostinger Node.js: build, pin de pnpm e release controlado

**Data:** 21/09/2026 (BRT)  
**Escopo:** hospedagem do SITE de vitrine + carrinho + rascunho de solicitação via WhatsApp. Sem pagamentos no site, confirmação automática de pedido ou liberação do lançamento integrado.  
**Status:** configuração de código preparada; **build Node, instalação na Hostinger, deploy público, testes de navegação e recebimento do WhatsApp NÃO verificados**.

## 1. Diagnóstico: não alterar pnpm por dedução

O relato recebido informa que o instalador da Hostinger tenta usar `pnpm@12.5.1`, não encontrado no cache do Corepack, enquanto `package.json` fixa `pnpm@11.25.0`. **O log bruto completo do provedor não foi fornecido**; não é possível confirmar se a falha veio da camada de detecção, de rede/cache, do instalador ou de outro comando. Verificar o primeiro stack trace do deployment.

O repositório possui **três componentes coerentes com pnpm 11.25.0**:

1. `package.json`: `packageManager: pnpm@11.25.0`.
2. `scripts/install-pnpm.sh`: compara a versão instalada com `11.25.0` e valida cache/store v11.
3. `pnpm-lock.yaml`: lockfile gerado para a árvore de dependências vigente.

**Não aceitar a sugestão automática de trocar somente para `pnpm@12.5.1`:** ela não instala uma versão faltante no cache, invalida a coerência com o instalador e exige revalidação integral do lockfile. Este patch não migra o gerenciador de pacotes nem altera dependências.

### Ação do operador no painel

Hostinger → Websites → Dashboard do site → Deployments → selecionar deployment falho → abrir **Build logs** e registrar: versão do Node, comando exato que aciona `pnpm@12.5.1`, URL de registry acessível ou falha de rede, erro Corepack completo e branch/SHA. Remover credenciais/tokens antes de compartilhar logs. Confirmar se as configurações permitem selecionar a versão **11.25.0** do pnpm ou reinstalar/recriar seu cache/ambiente de build. Se a plataforma impuser 12.5.1 sem disponibilizar instalação de 11.25.0, abrir suporte da Hostinger com o log; **isso não é corrigível com segurança somente por um commit no repositório**. Não alterar nem gerar novo lockfile com pnpm 12 às cegas.

Em ambiente de checkout com terminal e rede, para preparar a versão de projeto **antes** de instalar dependências:

```bash
node --version                         # >= 22.13.0
corepack enable
corepack install --global pnpm@11.25.0  # exige que registro/cache sejam acessíveis
corepack pnpm --version                # precisa mostrar 11.25.0
corepack pnpm install --frozen-lockfile
```

A interface de hospedagem compartilhada da Hostinger pode não oferecer terminal ou comando de instalação personalizado. Não presumir que comandos manuais sejam possíveis pelo hPanel. Se o erro surgir antes de `package.json`/scripts serem executados, `preinstall`, `postinstall` e scripts de build não podem remediá-lo.

## 2. Problema adicional corrigido no código: artefato errado para Hostinger

Antes desta mudança, `pnpm build` usa Vinext + plugin Cloudflare e gera saída para Worker; `pnpm start` chama Wrangler em `127.0.0.1`. **Não usar esses dois scripts como build/start do site hospedado em Node pela Hostinger.**

O código oferece uma rota **explícita**, isolada do build Cloudflare original:

- `pnpm run build:hostinger`: define `VEKTUA_DEPLOY_TARGET=hostinger`, usa Vinext sem plugin de Worker e solicita `output: "standalone"` pelo `next.config.ts`.
- `pnpm run start:hostinger`: executa `node dist/standalone/server.js` (não Wrangler).
- `pnpm build` e `pnpm start` existentes são preservados para o ambiente anterior. Nenhum GitHub Actions é utilizado.

O output Node standalone e o comando de execução seguem a documentação de Vinext: https://github.com/cloudflare/vinext (seção `output: standalone`). **A existência e a compatibilidade real do bundle nesta revisão só podem ser confirmadas executando o build e o smoke num checkout integral.**

### Configuração-alvo no Redeploy da Hostinger

| Campo | Valor solicitado / condição |
|---|---|
| Origem | repositório `b-bonfim/vektua-xyz`, branch `main`, SHA exato do release após merge |
| Tipo/framework | aplicação **Node.js / Other** quando necessário para não aplicar preset Next.js/Cloudflare incompatível |
| Node.js | **22.x**, respeitando requisito `>=22.13.0`; verificar versão minor no log |
| Package manager | **pnpm 11.25.0**, respeitando pin e lockfile; resolver primeiro o cache do Corepack no provedor |
| Build command | `pnpm run build:hostinger`, se o campo aceitar comando personalizado |
| Start command | `pnpm run start:hostinger` ou `node dist/standalone/server.js`, conforme formato aceito |
| Output / entry | `dist/standalone` / `dist/standalone/server.js`, somente se a interface exigir esses campos; conferir layout gerado |
| Bind | `HOST=0.0.0.0`; `PORT` fornecido pela Hostinger, normalmente `3000`; não impor `127.0.0.1` |
| Variáveis/segredos | cadastrar apenas variáveis legitimamente requeridas no ambiente do provedor; não commitar `.env`, tokens ou chaves privilegiadas |
| Domínio | `vektua.com.br`; conferir DNS, HTTPS, `www` e redirecionamentos após deploy |

**Nota:** os campos realmente disponíveis dependem do painel/plano, que não foi acessado nesta execução. Se o hPanel não permitir script de start personalizado nem entry compatível, não publicar uma saída Worker sob Node fingindo compatibilidade; usar alvo de hospedagem que execute o bundle ou tratar com o suporte.

## 3. Validação de um único candidato de release — sem Actions

Executar localmente ou em terminal autorizado com checkout completo, pnpm 11.25.0 e Node 22.13+:

```bash
node --version
corepack pnpm --version
corepack pnpm install --frozen-lockfile
node scripts/tests/go-live-static.mjs
corepack pnpm lint
corepack pnpm exec tsc --noEmit
corepack pnpm run build:hostinger
test -f dist/standalone/server.js
HOST=127.0.0.1 PORT=3000 corepack pnpm run start:hostinger
```

Com servidor realmente inicializado, noutra sessão:

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/chaveiros
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/carrinho
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/produto/g-chv-blo-01
```

Repetir testes de browser, integridade de todas as imagens REMIX, console/prefetch, carrinho e URL `wa.me/5535984445677`, incluindo celular. Registrar SHA, horário, comandos, exit codes, URLs, capturas e resultado. O protocolo completo está em [`GO_LIVE_SITE_2026-09-21.md`](GO_LIVE_SITE_2026-09-21.md). Evitar coleta/envio real de dados e mensagem a terceiros sem autorização.

## 4. Deploy e rollback (não executados por esta mudança)

1. Confirmar teste local de Node standalone e instalação no provedor; conferir pin, branch e log de instalação.
2. Registrar autorização do Founder específica para publicação do site; decisão sobre indexação é separada. `noindex` permanece enquanto não houver decisão específica.
3. No hPanel, revisar campos acima e fazer Redeploy pelo canal de integração GitHub da Hostinger, **não GitHub Actions**. Registrar deployment ID e SHA servido.
4. Conferir `/`, `/busca`, `/chaveiros`, `/produto/g-chv-blo-01`, `/carrinho`, `/politicas/privacidade`, imagens, HTTPS, versão mobile e link WhatsApp no domínio real. Não confundir abertura do WhatsApp com recebimento de pedido.
5. Se algo falhar, retornar para release anterior conhecido pelo mecanismo comprovado no hPanel; verificar novamente. Não declarar PASS sem evidência.

**Fontes técnicas:** documentação de Hostinger para [erro de compilação](https://www.hostinger.com/support/fix-failed-to-build-application-error-hostinger-node-js/), [deploy de app Node.js](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) e [redeploy](https://www.hostinger.com/support/how-to-redeploy-a-node-js-application/); [Vinext Node standalone](https://github.com/cloudflare/vinext). URLs são referências técnicas, não evidência de que o deploy desta Vektua tenha funcionado.

**Pendências finais:** cache/Corepack do provedor (Infra/Hostinger), build e QA do SHA final (Engenharia web), autorização de publicação e indexação (Founder), smoke no domínio e rollback (Infra/QA), revisão comercial/risco das ofertas (responsáveis do runbook). **Notion e Trello não foram atualizados por este documento.**
