# Algodão Pesado × Vektua XYZ — revisão Rock Editorial UI/UX

**Data:** 2026-10-22  
**Rota:** `/congrats/algodao-pesado`  
**Base:** `main` @ `2d2569a4e188d7d1def824ee0ec84f7852657971`  
**Estado:** implementação proposta em branch/PR; **sem merge, build Hostinger, screenshots validados ou deploy comprovado nesta revisão**.  
**Responsável pelo escopo:** 07 Commerce & Brand Experience, usando critérios Impeccable (tipografia, UX, responsividade, legibilidade e motion).

## Intenção e escopo protegido

Manter o filme mudo da plateia com scroll-scrub no hero, o recado final em vídeo com áudio iniciado por clique, os MP4 e os pôsteres, o logotipo oficial, os textos, o Instagram, a voz da campanha e a distinção entre as marcas. Não modificar a vitrine geral nem o checkout.

## Alterações de interface propostas

1. **Rock Editorial:** Barlow Condensed 900/800 como display e Barlow para leitura, microcopy, botões e legendas. Fonte carregada exclusivamente nesta rota por Google Fonts CSS, com `font-display:swap` definido pelo provedor e fallbacks de sistema. **Validação em produção necessária:** disponibilidade da origem externa, CSP, tempo de fonte e ausência de saltos de layout. Para independência externa futura, self-hosting requer uma mudança separada com arquivos/fontes e licença conferidos.
2. **Escala de leitura:** títulos com clamp e tracking menos extremo; entrelinhas mais estáveis; parágrafos de 17–20px e medida de cerca de 58–62ch, sem substituição dos textos aprovados.
3. **Experiência cinematográfica:** hero desktop ajustado de 550svh para 430svh; controles de seeking, filme, visibilidade, poster, modos estáticos e reduced-motion mantidos. Verificar sensação de ritmo em browser real.
4. **Reverência e manifesto:** proporções da grade e peso do grafismo auxiliar rebalanceados sem trocar seu conteúdo.
5. **Mensagem em vídeo:** seção centralizada, título editorial mais nítido, player com limite de 980px e texto de apoio confortável; fonte do overlay harmonizada; reprodução nativa e estados de erro inalterados.
6. **Navegação:** novo atalho `OUÇA O RECADO` no hero apontando para `#video-agradecimento`, preservando `CONTINUE A DESCIDA`; alvos de toque adequados e estilos de foco visíveis.
7. **Responsivo:** escalas e alinhamentos específicos para 850px e 520px; rodapé e botões mais legíveis; fallback estático do hero preservado para portrait, coarse pointer e redução de movimento.
8. **Regressão:** ampliação do teste HTTP da Hostinger para logotipo oficial, pôster e MP4 do mascote, e validação de âncora; validação de SVG tanto com raiz `<svg>` quanto declaração XML.

## Verificações de fonte já realizadas nesta revisão

- GitHub readback da branch: Barlow Condensed e Barlow declaradas; CSS scoped à página.
- Nenhum seletor CSS ausente entre as 54 classes referenciadas pelos componentes analisados.
- Contratos de vídeo preservados: `audience-tribute-scrub.mp4`, `diego-mascot-thank-you.mp4`, pôster e modo `preload="none"`.
- Hero com alternativa `prefers-reduced-motion`; nenhuma mudança no conteúdo dos arquivos de mídia.
- Novo teste somente leitura: `npm run check:algodao-ui`, preparado; **a execução via Node no checkout completo não foi realizada nesta sessão**.

As conferências acima são estáticas. **Não substituem** compilação, execução do script em checkout, inspeção visual de navegador ou testes funcionais.

## Verificação obrigatória antes de merge/deploy

| Dimensão | Procedimento | Aceite |
|---|---|---|
| Build | `npm ci && npm run check:algodao-ui && npm run build:hostinger` | zero erros de build, CSS e manifest |
| Smoke HTTP | `BASE_URL=<origem> node scripts/tests/hostinger-http-smoke.mjs` | rotas canônica/alias, Instagram, logo, pôster e ambos vídeos retornam status/MIME corretos |
| Desktop largo | 1440×900 e 1280×800 | títulos inteiros, sem invasão da imagem, grades equilibradas |
| Laptop/tablet | 1024×768 e 768×1024 | fluxo legível, sem scroll horizontal, vídeo acessível |
| Mobile | 390×844 e 320×700 | texto sem cortes, links tocáveis, pôster e CTA sem sobreposição |
| Fontes | network throttling + bloqueio de Google Fonts | fonte principal quando disponível; fallback legível sem layout quebrado |
| Motion | rolagem progressiva e reversa; prefer-reduced-motion | sem frame piscando, sem travamento, alternativa estática |
| Vídeo | clique, áudio, pausa, controles, erro de rede | sem autoplay de áudio; play intencional; fallback compreensível |
| A11y | Tab/Enter, zoom 200%, leitor de tela, contraste | foco visível, cabeçalhos claros, destinos dos atalhos válidos |
| Aprovação | Founder e, quando aplicável, parceiro | visual e conteúdo aprovados antes de publicação |

**Pendência preexistente não resolvida por este PR:** conferência da fala real e legendas sincronizadas `.vtt` do vídeo. Não inventar transcrição.

## Gate e execução

O merge/Hostinger deploy devem ser executados somente após verificação e aprovação. Este documento não alega que a branch esteja em produção. Nenhuma atualização de Notion ou ação no parceiro foi realizada.
