# Sebo da Paxx | Página de agradecimento

**Data:** 2026-10-22
**Rota:** `/congrats/sebo-da-paxx`
**Escopo:** homenagem a quem adquiriu marcadores de livro estilizados do Sebo da Paxx, produzidos em colaboração com a Vektua XYZ.

## Direção criativa

- Acolhimento de casinha e alegria cromática conforme conversa fornecida pelo Founder.
- Universo artístico da Paxx como referência: árvores pontilhadas, formas geométricas simples, azuis profundos, amarelo de luz, cor e pigmento irregular; narrativa onírica sem infantilização.
- Texto autoral de homenagem escrito para a página. Não apresentar como declaração literal aprovada pela artista.
- Frames do vídeo selecionado são renderizações digitais inspiradas nas obras da artista, não digitalizações de pinturas físicas nem fotos dos marcadores.

## Mídia

- Origem do vídeo: `1000207123.mp4` fornecido pelo Founder na conversa.
- Web encode em `public/images/campaigns/sebo-da-paxx/paxx-scroll-web.mp4`: H.264, 1152x648, 24 fps, GOP 8, sem áudio, faststart, CRF 31, 1.973.258 bytes.
- `paxx-poster.webp`: quadro inicial, resolução 1280x720.
- `paxx-ending.webp`: quadro final, resolução 1280x720.
- O vídeo só é solicitado em desktop paisagem >=900px, altura >=620px, ponteiro fino, `prefers-reduced-motion: no-preference`, sem `saveData`.
- Busca integral em Blob para evitar dependência de HTTP Range na Hostinger. `seeked` coalescido e rAF desacelerado após convergir.
- Para mobile, motion reduzido, economia de dados e falhas de vídeo: poster e página de texto permanecem usáveis sem vídeo.

## Página e ações

- Hero com scroll reversível, carta de agradecimento, seção de homenagem à linguagem visual da artista, interação local de estrelinha sem coleta de dados e um CTA principal para Instagram `@sebodapaxx` conforme material fornecido.
- Sem preços, promessas de estoque, vendas verificadas ou fotografias fictícias de produto.
- SEO da rota sujeito à política global `robots` atualmente presente em `app/layout.tsx`.

## Critérios de aceite técnicos

- [x] Arquivos TSX passam transpile sintático TypeScript.
- [x] Fonte do vídeo, resolução, tamanho e keyframes verificados por ffprobe.
- [x] Cópia acessível mesmo com vídeo ausente por desenho.
- [ ] Build Hostinger (`npm run build:hostinger`) executado no ambiente do repositório.
- [ ] Teste em navegador real desktop e mobile, incluindo reversão do scroll, reduced motion e fallback da rede.
- [ ] Acesso público de produção e entrega da Hostinger verificados com HTTP após deploy.
- [ ] Revisão final da redação/representação pela artista ou Founder.

## Publicação e segurança

A escrita em GitHub pode ser confirmada por commit e leitura posterior do caminho. Merge/commit não comprova deploy automático na Hostinger. Não registrar como publicado ao público sem HTTP 200 e HTML de campanha no domínio final.


## Refinamento de movimento — 22/10/2026

**Escopo autorizado pelo Founder:** animações mais evidentes em seções, textos e imagens, sem alterar o vídeo principal, a mensagem da homenagem, a URL ou as demais páginas.

- Arquivo `paxx-reveals.tsx`: IntersectionObserver para entrada escalonada de carta, parágrafos, títulos, ilustração, brincadeira da estrela e CTA. Usa `requestAnimationFrame` com scroll passivo para parallax limitado da imagem emoldurada; retira listeners e observador no unmount.
- `paxx.module.css`: coreografias de entrada com tradução e escala, contorno artesanal de destaque, aparição da moldura, animação da estrela, sublinhados progressivos nos títulos, partículas lentas e interação em botões. A chegada do vídeo e a ligação reversível ao scroll permanecem intactas.
- **Progressive enhancement:** conteúdo nasce visível no HTML; somente após hidratação, e quando o movimento é permitido, é ativado `data-paxx-motion`. Preferência `prefers-reduced-motion` e `saveData` preservam a leitura estática. Foco por teclado também revela elementos observados.
- Seletores e estilos são exclusivos da rota `/congrats/sebo-da-paxx`; não foram alteradas a home, outras páginas de parceiros ou a configuração de deploy.
- Performance: entrada animada uma vez por elemento, transforms/opacidade, evento de scroll passivo e rAF deduplicado. O vídeo existente não é solicitado adicionalmente pelo novo componente.

**Verificações pendentes fora do conector GitHub:** `npm ci`, `npm run build:hostinger`, testes visuais desktop/mobile, reversibilidade e carga do vídeo, navegação por teclado, reduced motion, Save-Data, resposta HTTP do site na Hostinger. Commit/merge no GitHub não equivale a deploy verificado.
