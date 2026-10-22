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
