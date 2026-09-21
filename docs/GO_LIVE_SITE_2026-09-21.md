# Vektua XYZ — runbook de liberação do SITE (21/09/2026)

**Escopo autorizado no produto:** vitrine, quatro linhas, carrinho local e RASCUNHO de solicitação ao WhatsApp `5535984445677`. Sem pagamento, reserva, confirmação de pedido ou envio automático. **Este arquivo não aprova deploy, indexação, SKU, direitos ou lançamento integral da empresa.** A meta do site em 21/09 é distinta do lançamento integrado/G1–G6.

## Alterações deste pacote
- Correção cirúrgica da PR #10: `vinext 1.0.0-beta.9`, `@vitejs/plugin-rsc 0.5.34`, lockfile sincronizado e teste de regressão de prefetch; NÃO importar `.github/workflows/vinext-prefetch-lab.yml`.
- `scripts/tests/go-live-static.mjs` confere correspondência SKU → arquivo `_REMIX`, existência, tamanho e assinatura PNG/WebP no checkout. Não substitui renderização no navegador.
- Preservar catálogo comercial, novos SKUs, carrinho e imagens da `main` de base `9e359ac54327bc8afcb6266e3aa5d9bb67b89476`.

## 1. QA obrigatório — mesmo SHA, executado localmente SEM GitHub Actions

Operador com acesso a checkout completo, Node 22.13+ e pnpm 11.25:

```bash
node --version
corepack enable
corepack pnpm install --frozen-lockfile
node scripts/tests/go-live-static.mjs
corepack pnpm lint
corepack pnpm exec tsc --noEmit
corepack pnpm build
```

Para o teste de prefetch em build de produção, iniciar o servidor local conforme `package.json` e `docs/qa-commercial-remix-20260921/README.md`, instalar Playwright fora da automação GitHub, definir `PLAYWRIGHT_MODULE` para o caminho absoluto do módulo e `BASE_URL=http://127.0.0.1:8788`, então executar `node scripts/tests/vinext-prefetch-regression.mjs` e `node scripts/tests/site-browser-smoke.mjs`. A regressão deve ter **4/4 casos sem console.error/pageerror**, sem ocultar erros. Se os scripts exigirem variáveis adicionais, seguir suas mensagens de erro; não improvisar segredos em logs. Salvar data, ambiente, SHA, comandos, exit code e capturas. Qualquer nova alteração invalida o PASS anterior.

**Estado na preparação deste runbook:** comandos NÃO executados neste SHA; nenhuma evidência de browser ou deploy público adicionada aqui. Os testes anteriores da PR #10 pertencem a outra base e são apenas histórico.

## 2. Matriz manual obrigatória

- [ ] Home, busca, quatro linhas, PDP nova `/produto/g-chv-blo-01`, PDP legada `/produto/g-org-rc-01`, carrinho e quatro políticas: HTTP 200, sem erro RSC/console/404.
- [ ] Todos os 21 novos mapeamentos REMIX: abrir em desktop/celular, decodificar e conferir produto/acessórios, 200 em URLs das imagens e galerias. O teste estático isolado não dá PASS visual.
- [ ] Busca por SKU e acentos, filtros, vazio/limpar, teclado e layout em 320/375/390/768/desktop.
- [ ] Carrinho com dois SKUs e variantes, quantidade, remoção, limpeza, recarregamento na mesma aba e limite de sessão explicável.
- [ ] WhatsApp: texto decodificado, número `5535984445677`, dois SKUs, observação acentuada, abertura com/sem app em celular. Usar item identificado como TESTE; envio real somente sob autorização do operador e confirmação de recebimento humano.
- [ ] Nenhum formulário de cartão, gateway ou pedido confirmado automaticamente. Mensagens de preço, estoque, frete e prazo condicionados consistentes.
- [ ] Política de privacidade e de consumo revisadas por responsável; decidir explicitamente se personalizados captam apenas INTERESSE, sem upload de fotos; não declarar a exigência de upload do PRD cumprida.
- [ ] Verificar riscos específicos de descrições/direitos/uso dos SKUs apontados na auditoria; autorização interna DEC-010 não comprova direitos ou segurança.
- [ ] Medir home, busca e PDP PNG com o mesmo setup no release; registrar bytes, LCP/CLS observados, warnings e limites, sem simular resultado.

## 3. Procedimento de atendimento (nenhuma automação presumida)

1. Atendente verifica mensagem recebida de verdade. Clique no botão NÃO significa pedido recebido.
2. Atribuir ID único manual ao contato e registrar data, SKUs, variantes, quantidades e contato mínimo no registro operacional aprovado. Não contabilizar teste como venda.
3. Conferir ficha, restrições específicas, preço aprovado por SKU/variante, estoque e capacidade/fila, frete e prazo **antes** de oferecer condições finais; sem dados, manter solicitação pendente.
4. Enviar proposta e condições de pagamento fora do site, receber aceite humano e registrar estado real. Não coletar cartão por formulário improvisado ou alegar pagamento confirmado sem prova.
5. Tratar referências pessoais apenas por canal/política aprovada; sem upload público, bucket aberto ou chave privilegiada no frontend.

## 4. Deploy e rollback — responsabilidade de Infra + Founder

- [ ] Identificar provedor real, projeto, conta autorizada, ambiente, comando de build e rota de deployment suportada. `.openai/hosting.json` com `d1/r2: null` NÃO identifica produção.
- [ ] Founder registra GO específico para o **site** e indexação `noindex` vs indexável; nenhum GO integrado é inferido. Enquanto indexação não for expressamente decidida e implementada, `noindex` + robots disallow permanecem intocados.
- [ ] Guardar SHA anterior implantado, configuração/backup sem credenciais em relatório, método de rollback e contato de incidente.
- [ ] Fazer deploy **sem Actions** do SHA exato aprovado e registrar URL, data, release/deploy ID, status e log do provedor.
- [ ] Verificar `https://vektua.com.br` e `www`, DNS, HTTPS/TLS, redirecionamentos, rotas, arquivos de imagem, console e WhatsApp contra DOMÍNIO PÚBLICO. Não inferir publicação apenas do merge na `main`.
- [ ] Se smoke falhar, interromper comunicação e executar rollback pelo mecanismo confirmado do provedor; repetir smoke e registrar o resultado. Testar rollback previamente em ambiente seguro.

**Estado inicial:** PENDENTE DE EVIDÊNCIA para QA do commit final, política comercial/risco, provedor, deploy, domínio, envio e recebimento WhatsApp. Não marcar GO, PASS ou Publicado sem registro e verificação reais.
