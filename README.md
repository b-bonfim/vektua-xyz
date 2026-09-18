# Vektua XYZ

Protótipo navegável com dados mockados para a experiência de comércio da Vektua XYZ. Implementado em 18/09/2026 a partir do COM-SITE-2026-001 v1.0 e da direção do Brand Book v1.1.

![Prévia do protótipo](docs/preview-desktop.jpg)

## Executar

Requisitos: Node.js 22.13+ e a versão de pnpm declarada em `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Abra o endereço indicado pelo servidor. Para compilar: `pnpm build`. Para verificar tipos: `pnpm exec tsc --noEmit`.

## Experiência implementada

- Home editorial e navegação pelas três linhas.
- Catálogo de seis fixtures com busca sem acentos, filtros, ordenação e estado vazio.
- Fichas com conceitos visuais, variações, quantidades e detalhes demonstrativos.
- Carrinho local à sessão da aba: adicionar, alterar quantidade, remover e limpar.
- Jornadas de miniaturas de pet e pessoa: escolhas, referência sintética, resumo e conclusão de simulação.
- Coleção de exemplo, Sobre, Como funciona, Ajuda, Atendimento e quatro políticas em rascunho.
- Menu móvel acessível, teclado, foco visível e redução de movimento.
- Fonte Manrope local com SIL OFL em `public/fonts/OFL.txt`.
- Imagens conceituais geradas por IA, com prompts em `public/images/provenance.json`.

## Limites deliberados

Não há pagamentos, checkout ativo, envio de fotos, dados pessoais, pedidos reais, banco de dados, analytics, promessa de estoque ou prazo. Os preços, produtos, variantes e medidas são fictícios e identificados na interface. O carrinho usa apenas `sessionStorage`, com fallback em memória.

A assinatura tipográfica e o favicon são aplicações provisórias do protótipo, não arte-final homologada. As imagens não são fotografias de produtos físicos nem evidência de fabricabilidade. Os rascunhos de política não são condições comerciais aprovadas.

O código foi preparado para revisão; não há autorização de lançamento, publicação comercial, liberação de SKU, DNS, gastos ou contratação. Nenhuma implantação nem atualização do Notion integra esta entrega.

## Estrutura

- `components/storefront.tsx`: páginas e interações.
- `components/cart-context.tsx`: carrinho demonstrativo com validação dos dados locais.
- `lib/catalog.ts`: fixtures explicitamente separadas dos produtos reais.
- `app/globals.css`: identidade e comportamento responsivo.
- `docs/VALIDATION.md`: verificações realizadas e limitações.

Stack: React 19, TypeScript e Vinext/Vite no starter fornecido pelo ambiente, com componentes Radix/shadcn. O starter contém infraestrutura opcional; nenhuma persistência, autenticação comercial ou integração de pagamento foi ativada. Não contém credenciais.

## Próxima etapa comercial

Product define ofertas e dados reais; Engineering valida amostras; Finance e Operations validam preços/prazos; Quality revisa direitos e políticas; Founder decide liberação e publicação. O protótipo não modifica esses gates.
