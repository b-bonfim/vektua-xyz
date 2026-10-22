# Algodão Pesado — Coreografia de entrada da campanha

**Data:** 22/10/2026  
**Rota:** `/congrats/algodao-pesado`  
**Skill responsável:** 07 Commerce — Brand Experience, sob critérios Impeccable (animate + craft-floor).  
**Status:** Implementado em branch proposta; sem merge, publicação ou aprovação visual nesta etapa.

## Direção

**"O show avança, o palco responde."** A única narrativa cinematográfica ativa permanece no hero da plateia; as seções seguintes respondem à chegada do visitante com entradas pontuais. A identidade de rock/metal da Algodão Pesado, o texto aprovado, as fontes Barlow Condensed + Barlow, a paleta vermelho/marfim/dourado, o logotipo oficial e o vídeo falado do mascote não foram alterados.

## Tratamentos por seção

| Seção | Movimento |
|---|---|
| 01 — O Recado | selo de seção; headline com recorte vertical e subida; parágrafos em bloco; assinatura com máscara lateral; carimbo tipográfico 100% ROCK com entrada em escala e leve giro |
| 02 — O Código | spotlight vermelho sutil, headline editorial, linha vermelha revelada a partir da esquerda, texto e resposta visual em sequência |
| 03 — A Voz da Algodão Pesado | topo de seção iluminado de vermelho/dourado, headline, texto e pôster/player em moldura de abertura cinematográfica |
| 04 — O Rock Continua | headline e texto em sequência; CTA do Instagram com entrada mais enfática; maior presença dos relâmpagos já existentes; assinatura visual do parceiro no rodapé |

**Interação:** `campaign-motion.tsx` usa dois `IntersectionObserver` de execução única (elementos + atmosfera de seções), sem biblioteca de animação ou listeners de scroll contínuos. Elementos aparecem por padrão no HTML; só ficam em estado `pending` se estão abaixo do primeiro viewport com JS executando e sem preferência de movimento reduzido. Foco por teclado força `seen`; a mudança de preferência durante a navegação expõe todos os elementos. A limpeza em unmount remove estados transitórios. Destaques de seção não ocultam conteúdo.

**Performance:** movimentos restritos a `opacity`, `transform`, `clip-path` e poucas mudanças de iluminação com transições de aproximadamente 740–1100 ms, geralmente uma vez. Sem alterar `rock-stage.tsx`, `thank-you-message.tsx`, MP4s, pôsteres, áudio ou seus controles. A otimização separada do filme scroll está no PR #86 (não incorporado automaticamente a esta branch).

## Evidências verificadas

- Código recuperado e comparado no GitHub: 20 alvos de animação com nove papéis visuais, três seções iluminadas e zero referências de classes CSS sem seletor.
- Teste de contrato existente `scripts/tests/algodao-pesado-ui-contract.mjs` ampliado. Sua lógica foi executada em contexto JavaScript isolado com o conteúdo da branch obtido do GitHub, com resultado positivo. **Isso não equivale a executar o script pelo Node em checkout.**
- Simulação isolada do `useEffect` confirma: elementos iniciais visíveis; elementos fora da tela aguardam; primeiro encontro revela; foco expõe link; mudança para `prefers-reduced-motion` expõe todos; cleanup remove estados.

## Critérios de aceite ainda pendentes

1. `npm ci && npm run check:algodao-ui && npx tsc --noEmit && npm run build:hostinger` em checkout completo.
2. **Visual:** captura e teste em Chrome desktop 1440/1280, tablet 768 e Android 390/320; validar clipping dos títulos, relação entre delay e scroll, ausência de conteúdo invisível e leitura do carimbo.
3. **Acessibilidade:** Tab/Enter e links externos, zoom 200%, `prefers-reduced-motion` e JavaScript desativado.
4. **Desempenho:** registrar LCP/INP/CLS, verificar scroll reverso e vídeo da plateia sem regressão. Não prometer ganho de FPS por inspeção estática.
5. **Mídia:** vídeo de mascote deve tocar somente mediante clique, com áudio e controles nativos; pôster deve permanecer visível durante a animação de entrada.
6. Se aprovado, Founder autoriza merge e operação Hostinger confirma SHA do deploy; não declarar site publicado a partir de PR.

## Estado de publicação

Não foram realizados merge, deploy, edição do Notion ou ações no parceiro. **Founder Gate:** avaliar resultado visual, liberar alterações desta branch e decidir publicação. O PR #86 segue independente até sua validação própria.
