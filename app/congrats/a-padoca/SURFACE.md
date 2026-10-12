# A Padoca — surface brief / entrega v1
**Data:** 2026-10-12
**Route:** /congrats/a-padoca
**Responsável pela experiência:** Commerce / Brand Experience (Vektua XYZ)
**Situação:** implementação em branch; aprovação final de comunicação e publicação da campanha dependem do Founder.

## Objetivo
Parabenizar quem recebeu um chaveiro da Padoca, valorizar produção artesanal e comércio local e convidar a acompanhar @apadocasrs. Campanha informativa e comemorativa: sem checkout, formulário ou captação de dados.

## Fontes verificadas
- Artes e capturas de tela fornecidas pelo Founder nesta conversa, incluindo identidade visual da Padoca e conceito de embalagem.
- Google Drive "A Padoca": fotografias de baguette_3.webp, croissant.webp, strawberry-pie.webp, cookie.webp, preservadas sem alterações de aparência.
- Instagram da Padoca: @apadocasrs, conforme captura enviada pelo Founder.
- Guia Site de 10K (ZIP do Drive, não vídeo), analisado como inspiração de coreografia com scroll. É um guia de produção com um pipeline de vídeo IA pago, não um vídeo de campanha já disponível.

## Direção visual da microsuperfície
Cobalto + amarelo + pink + creme; flores, curvas, textura e fotos reais. Efeito cinematográfico de deslocamento, escala e legenda sincronizados com o scroll, sem fazer alterações à marca da Vektua fora desta rota.

## Limite técnico desta primeira entrega
O ZIP sugere um **MP4 exclusivo controlado pela rolagem**. Como não foi fornecido um vídeo da Padoca nem liberada geração por serviço pago, esta versão usa uma **cena fotográfica guiada por scroll**, com imagem estática em telas móveis e para usuários com movimento reduzido. A técnica de scrub de vídeo não é declarada implementada. Nenhum crédito de geração foi gasto.

## UX e acessibilidade
- Fonte, textos e CTA permanentes no DOM mesmo sem JS.
- Link direto para Instagram com destino confiável, sem coletar dados.
- Fotos reais com textos alternativos, lazy loading abaixo da primeira dobra.
- Movimento reduzido recebe conteúdo completo, sem coreografia.
- SEO segue o estado global atual de robots, que desabilita indexação até verificação do release.

## Pendente de validação
1. Founder confirmar texto final e autorização para usar identidade Padoca na microsuperfície.
2. Se desejar o **efeito Site de 10K idêntico**, fornecer/autorizar material de vídeo em proporção 16:9 ou aprovar orçamento exato e storyboard antes de uso de qualquer serviço pago.
3. Inspecionar a rota em produção após novo deploy Hostinger. Merge não garante deploy.
4. Confirmar com Padoca se deseja apresentar um depoimento pessoal ou apenas texto em voz de campanha (esta versão não inventa fala do proprietário).

## Testes recomendados
- HTTP 200 em /congrats/a-padoca, carregamento mobile/desktop e imagem local.
- 200 dos quatro arquivos em /images/campaigns/a-padoca/.
- Foco por teclado, links externos seguros, modo reduced-motion, ausência de scroll horizontal.
- Build Hostinger com npm: **não usar GitHub Actions**.


## Integração cinematográfica — 12/10/2026 (v2)
- Vídeo gerado no Google Flow pelo Founder, 8 segundos, sem cortes identificados.
- Arquivo distribuído pelo próprio repositório como \`public/images/campaigns/a-padoca/a-padoca-scroll-web.mp4\`, H.264 1280×720, aproximadamente 2,76 MB, sem áudio, keyframes a cada 0,5 segundo, faststart.
- Poster WebP 1600×900 em \`public/images/campaigns/a-padoca/a-padoca-scroll-poster.webp\`.
- Desktop paisagem e altura >=600px: cena original evolui para vídeo de aproximação ao prédio, cujo tempo responde ao progresso do scroll em ambas as direções.
- O arquivo é buscado uma vez por aproximação da cena e transformado em Blob para que scrubbing não dependa de HTTP Range do servidor Hostinger. Seek em voo serializado, último destino coalescido e progressão suavizada com RAF.
- Layout móvel, telas baixas, preferência por movimento reduzido ou Save-Data não fazem download do MP4 e mantêm a arte estática original.
- O vídeo é decorativo, mudo e inacessível pelo teclado. Conteúdo textual e link do Instagram permanecem HTML em ambos os modos.
- Em falha de fetch/decode ou sem JS, a página permanece completa e estática.
- O arquivo original Full HD do Google Flow foi preservado fora do deploy. A cópia otimizada tem menor resolução para limitar os bytes no QR móvel.
- **Inspeção estática e diff não substituem build Hostinger, teste visual em navegador nem verificação de publicação.**
- Não executar GitHub Actions.
