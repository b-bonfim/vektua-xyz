# Baseline de performance — 20/09/2026

**Escopo estritamente estático:** árvore Git do commit `d14671bc68ab7d39c5695c52c082e728d6910605`, diretório `public/images/products/remix/`, consultada pela API do GitHub. A propriedade `size` informa tamanho armazenado em bytes por arquivo. **Não é medição de transferência real, desempenho no navegador, Lighthouse ou Core Web Vitals.** Nenhuma imagem foi recomprimida ou substituída neste ciclo.

| Medida verificada na árvore Git | Resultado |
|---|---:|
| Arquivos `.webp` REMIX | 16 |
| Soma dos tamanhos | 2.600.424 bytes (2.539,48 KiB) |
| Mediana do tamanho | 170,58 KiB |
| Menor imagem | `G-ORG-HS-01_REMIX_02.webp` — 60.164 bytes |
| Maior imagem | `G-CHV-JJ-01_REMIX_02.webp` — 253.410 bytes |
| Imagem principal/hero `G-VAS-ESC-01_REMIX.webp` | 141.488 bytes (138,17 KiB) |
| Quatro imagens REMIX distintas referenciadas na home (hero, organizador de controles, Halloween e chaveiro) | 600.466 bytes em arquivos (não representam todos os recursos e nem obrigatoriamente a transferência inicial) |

**Interpretação limitada:** o inventário permite priorizar uma futura medição de transferência, mas tamanho em repositório não fornece LCP, INP, CLS, TTFB, decodificação, cache, solicitação de rede, dimensão CSS efetiva ou uso de largura responsiva. A imagem maior pertence à galeria do chaveiro, não necessariamente ao primeiro carregamento da home. O valor de 2.600.424 bytes é a soma do conjunto armazenado, **não** o peso de uma única página.

## Estado dos testes na revisão posterior

A branch `fix/navigation-metadata-perf-20260920` recebeu alterações do shell e da home. O ambiente de execução desta sessão **não contém checkout local do repositório**, falha ao resolver `github.com` e falha ao baixar `pnpm` de `registry.npmjs.org`; portanto, não existem medições reais de navegador ou resultados de lint/build para o HEAD desta branch. Os registros históricos de build anteriores não validam esta revisão.

## Critérios para autorizar otimização das imagens

1. Obter checkout integral, instalar dependências com lockfile e executar `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`.
2. Servir a mesma revisão e coletar DevTools/Lighthouse em mobile e desktop, com condições, URL, data, commit e capturas da aba Network. Medir especialmente home, catálogo e ficha com galeria; repetir medições e reportar distribuição, não um número isolado.
3. Registrar bytes efetivamente transferidos, dimensões intrínsecas/elemento, LCP element, CLS e falhas de recursos. INP só pode ser interpretado com interação adequada; testes laboratoriais não são dados de campo.
4. Somente depois decidir sobre variantes `srcset`/`sizes`, lazy loading e compressão, preservando as imagens REMIX aprovadas como base visual e sem alterar fidelidade dos produtos. Repetir comparação A/B em configuração equivalente.

**Estado:** inventário de arquivo verificado; performance de navegação **NÃO MEDIDA**; otimização de imagens **NÃO EXECUTADA**. Owner: Commerce/frontend e responsável técnico por QA/performance. Sem deploy, venda, alteração de gates ou aprovação de SKU.
