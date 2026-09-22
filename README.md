# Vektua XYZ — catálogo e pedidos pelo WhatsApp

## Estado vigente — 21/09/2026

A decisão expressa do Founder de 21/09/2026 aprovou internamente os SKUs cadastrados para produção e comercialização e solicitou carrinho com envio da solicitação pelo WhatsApp, sem pagamento no site. A implementação comercial da PR #16 substitui a navegação demonstrativa descrita no histórico abaixo.

- Catálogo comercial em `lib/commercial-catalog.ts` e interface em `components/commerce-storefront.tsx`.
- Carrinho com SKUs, opções e quantidades, persistido na sessão da aba; mensagem preparada para `+55 35 9 8444-5677`.
- Dez imagens adicionais do pacote `vektua-remix-commercial-2026-09-21-ready.zip` vinculadas por SKU e conferidas por SHA-256. Imagens ausentes continuam identificadas como indisponíveis.
- Lint, TypeScript, build e fluxo de navegador verificados localmente para a revisão comercial citada. Evidências e limites em [docs/qa-commercial-remix-20260921/README.md](docs/qa-commercial-remix-20260921/README.md); resultados históricos não validam a migração npm.
- GitHub Actions não é utilizado. Pagamento, confirmação automática de pedido, publicação em produção e liberação de indexação não são efetuados pela importação das imagens.

**Migração de gerenciador em andamento:** na branch da [PR #23](https://github.com/b-bonfim/vektua-xyz/pull/23), o Founder solicitou npm como contingência para falha anterior ao build da Hostinger. Esta branch **ainda tem `package-lock.json` desatualizado; `npm ci`, build e deploy não foram testados nesta revisão**. Não fazer merge ou apontar a Hostinger para esta branch antes de completar o [runbook de migração](docs/NPM_MIGRATION_HOSTINGER_2026-09-21.md). A `main` permanece com pnpm enquanto a PR não for integrada.

## Histórico — baseline demonstrativo de 20/09/2026

O conteúdo abaixo registra o estado anterior; suas restrições internas de oferta foram substituídas pela decisão e implementação de 21/09/2026. Não representa o estado comercial vigente.

Site demonstrativo da marca Vektua XYZ. O baseline vigente indicado em `PRODUCT.md` e nos registros do repositório de 20/09/2026 é Opportunity Brief v2.0, Brand Positioning v2.0 e Brand Book v2.0. As versões v1 anexadas ao projeto permanecem históricas e demandam reconciliação administrativa sem apagamento.

**Estado comercial:** protótipo, sem autorização de publicação comercial, compra, recebimento de fotografias, confirmação de estoque, preço real ou pedido. Os nove itens selecionados para a demonstração não estabelecem mínimo ou teto para o lançamento. Uma marca e quatro linhas de navegação: **Objetos & Colecionáveis**, **Datas & Coleções**, **Feitos para Você** e **Chaveiros**. A linha Chaveiros é independente; as três linhas anteriores permanecem presentes.

## Executar e validar a branch npm (após regenerar o lockfile)

Requisitos: Node.js 22.13+ e npm 10.x. Durante a preparação, regenerar `package-lock.json` conforme o [runbook](docs/NPM_MIGRATION_HOSTINGER_2026-09-21.md); o `package-lock.json` antigo NÃO está pronto para `npm ci`.

```sh
npm ci
npm run check:npm-lock
npm run dev
npm run lint
npm exec -- tsc --noEmit
npm run build:hostinger
```

`npm run lint`, TypeScript e build **precisam ser executados na branch/commit que se pretende revisar**. Resultados históricos de 18/09 e da importação REMIX de 20/09 não validam automaticamente commits posteriores. Para matriz de reteste e pendências, consulte `docs/IMPECCABLE_REMEDIATION_2026-09-20.md`. O build `npm run build` original visa a infraestrutura Cloudflare; o comando separado `npm run build:hostinger` solicita saída standalone Node. Nenhum dos dois é evidência de deploy público sem teste real.

## Experiência implementada

- Home editorial com quatro linhas de navegação, catálogo e busca sem acentos, filtros, ordenação e estado vazio.
- Nove itens demonstrativos selecionados pelo Founder em 19/09/2026, distribuídos no catálogo; cada SKU exige liberação comercial individual.
- Sete SKUs de catálogo com imagens REMIX por pasta/SKU, explicitamente tratadas como **ambientações editadas**, não prova fotográfica de peça fabricada. Duas propostas de personalização com imagens conceituais.
- Fichas com descrições e nomes vindos da shortlist, informação de caráter demonstrativo e galerias REMIX onde aplicável.
- Carrinho na sessão da aba: adição, quantidade, remoção e limpeza; checkout real desabilitado.
- Simulações de miniatura de pet e pessoa, sem envio de fotos, pagamento ou encomendas.
- Coleção conceitual Halloween, páginas institucionais, perguntas frequentes e quatro minutas de políticas.
- Manrope hospedada localmente, com licença em `public/fonts/OFL.txt`.

## Estrutura e evidências

- `components/home-v2.tsx`, `components/chaveiros-v2.tsx`, `components/brand-shell-v2.tsx`: superfícies editoriais.
- `components/storefront.tsx`: catálogo geral, fichas, personalização e rotas de demonstração.
- `app/datas-colecoes/pequenos-encantos/page.tsx`: vitrine explícita do SKU Halloween na branch de remediação.
- `app/produto/can-pessoa-001/page.tsx`: ficha específica da pessoa com acesso ao simulador de pessoa na branch de remediação.
- `app/contato/page.tsx`: informações sobre a proposta para estabelecimentos, sem prometer canal disponível.
- `components/cart-context.tsx`: carrinho local demonstrativo.
- `lib/catalog.ts`, `lib/sku-names.ts`, `lib/sku-copy.ts`: itens, nomes e descrições de demonstração.
- `app/globals.css`, `app/brand-v2.css`, `app/impeccable-audit-fixes.css`: estilos e remediações acessíveis propostas.
- `docs/VALIDATION.md`: registro HISTÓRICO de 18/09; não descreve a HEAD atual.
- `docs/remix-validation.json`, `docs/remix-import-status.md`: evidências relatadas da importação REMIX de 20/09, antes das correções desta branch.
- `docs/IMPECCABLE_REMEDIATION_2026-09-20.md`: rastreabilidade das correções e das verificações pendentes.

## Limites e governança

Nenhuma imagem REMIX deve ser apresentada como prova de fotografia física. Medidas, cor, materiais, direitos, segurança, preço, prazo, disponibilidade e promessa comercial dependem de evidência por SKU. A presença em negócios locais é apenas proposta, sem parceiros confirmados. A identidade gráfica digital e o favicon não equivalem a registro de marca ou arte-final homologada.

A indexação permanece bloqueada por `noindex` e `robots.txt`; não habilitar rastreamento público, checkout, deploy ou DNS como efeito colateral de correções de código. A liberação de SKU, publicação comercial e lançamento exigem pacote de evidências e decisão expressa do Founder, conforme os gates do 3D Business Board.
