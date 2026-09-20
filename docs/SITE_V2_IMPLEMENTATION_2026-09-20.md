# Vektua XYZ · Site v2.0 · registro de implementação

**Data:** 2026-09-20  
**Estado:** código em branch para revisão; NÃO equivale a publicação, lançamento nem aprovação comercial.  
**Fontes normativas:** Opportunity Brief v2.0, Brand Positioning Final v2.0, Brand Book Final v2.0.

## Alterações executadas no código

- Quatro linhas independentes na arquitetura do catálogo, menu, rodapé, hero e filtros: Objetos & Colecionáveis; Datas & Coleções; Feitos para Você; Chaveiros.
- `G-CHV-JJ-01` reclassificado para Chaveiros como linha primária; preservados os nove candidatos do mockup histórico, SEM criar meta de quantidade para lançamento.
- Rota `/chaveiros` dedicada, com busca local, estado vazio, fotografia digital rotulada e explicação de proposta de distribuição em negócios locais. Nenhum ponto/parceiro confirmado.
- Páginas `/sobre` e `/como-funciona` sincronizadas com a arquitetura de quatro linhas.
- Implementação digital provisória do logotipo horizontal SVG, sua versão negativa e favicon correspondente; identidade editorial e tokens originais preservados, refinamento responsivo e de acessibilidade.
- Metadata por rota com descrições específicas, idioma pt-BR, Open Graph e Twitter, `robots.ts`, título e favicon global.
- SITE DEMONSTRATIVO: `noindex`, `nofollow`, `Disallow: /` deliberados até aprovação formal de lançamento e domínio canônico verificado; não gerar sitemap/canonical nem schema de ofertas com informações ainda não comprovadas.

## Escopo e limitações

- Identidade visual implementada **como proposta digital**; logo vetorial final e registro marcário NÃO aprovados/comprovados.
- As imagens dos modelos em 3MF são visualizações digitais dos arquivos, não fotos de peças produzidas. Os exemplos de personalizados também são conceituais.
- Preços meramente ilustrativos; checkout, vendas, estoque e pedidos reais desabilitados.
- A existência de pontos físicos, contratos, exclusividade, margem e giro NÃO é declarada.
- Não foi executado deploy, alteração DNS, gastos, produção, liberação comercial de SKU ou atualização no Notion nesta implementação.

## Revisão técnica / Impeccable

Consultadas as orientações de `impeccable` (skill.md, polish, craft-floor) e o `DESIGN.md` do repositório. O executável próprio de contexto e navegador de inspeção visual não estavam disponíveis neste ambiente; o refinamento foi aplicado documentalmente aos componentes e CSS, sem simular execução de comandos.

**Conferência de fonte:** arquivos e rotas criados/atualizados pelo conector GitHub; sem erros reportados nas escritas.  
**Build/lint/TypeScript:** NÃO EXECUTADOS — nenhum workflow de CI retornado para o HEAD consultado.  
**Capturas desktop/mobile, Lighthouse, contraste aferido e navegação real:** NÃO EXECUTADOS; requerem revisão com servidor/browser.

## Critérios de aceite antes do merge / publicação

1. Rodar `pnpm install`, `pnpm lint`, `pnpm build` no ambiente autorizado; resolver falhas reais.
2. Inspecionar `/`, `/chaveiros`, `/sobre`, `/como-funciona`, catálogo geral, detalhes, carrinho e personalizados em mobile e desktop; testar teclado, menu e busca.
3. Confirmar que navegação, contagens e filtros não duplicam chaveiros em Objetos; validar todas as imagens e suas legendas.
4. Submeter logos provisórios à aprovação visual explícita do Founder; não declarar registro ou arte final homologada por inferência.
5. Obter autorização específica antes de habilitar SEO indexável, domínio canônico, checkout, parceiros e anúncios. Resolver direitos, fotos reais, pricing, prazos e gates individuais de SKU conforme papéis responsáveis.

**Owner técnico de correções de build/UI:** Commerce + implementação de frontend. **Owner de riscos:** Quality. **Aprovação final do logotipo, da publicação e do lançamento:** Founder.
