# Vektua XYZ — /sobre | Cosmogonia do Objeto

**Data:** 24/10/2026  
**Owner:** 07 Commerce / Brand Experience, com implementação frontend.  
**Direção criativa:** aprovada pelo Founder na conversa; publicação solicitada expressamente em /sobre.  
**Status em 24/10/2026:** interface, cabeçalho institucional, manifesto, scrub, poster e oito segmentos do MP4 **commitados e lidos de volta na main**, com Git blob SHA de cada segmento conferido byte a byte contra o arquivo aprovado. **Build, QA em navegador, disponibilidade HTTPS e publicação na Hostinger permanecem não verificados.**

## Conteúdo e identidade
- Página institucional original (não vitrine simples de produtos), com navegação overlay independente da faixa comercial do catálogo e retorno para a loja.
- Propósito oficial: ajudar pessoas a encontrar objetos que combinem com gostos, ocasiões, histórias e contextos de descoberta.
- Assinaturas: Objetos com personalidade; Do achado à peça só sua.
- Quatro linhas e seus verbos: Objetos & Colecionáveis (Escolher), Datas & Coleções (Celebrar), Feitos para Você (Personalizar), Chaveiros (Descobrir).
- Projetos da experiência: Blind Rats, A Padoca e Algodão Pesado. As imagens referenciadas são **artes de campanha** e estão rotuladas como tal, não fotos de produtos reais.
- XYZ são os três eixos espaciais, não uma contagem de linhas.
- Experiência visual conceitual não é foto de SKU, prova de produção ou oferta comercial.

## Técnica de implementação — Skill Site de 10K (Google Drive)
Fonte: pasta "Skill Site 10k" e arquivo sitede10k-skill.zip, com SKILL.md, pipeline-scrub.md, receitas-ffmpeg.md e publicação.md. A rota usa a técnica, não o framework/deploy estático do playbook original.

- MP4 pausado controlado por video.currentTime a partir do progresso de scroll.
- Avanço e retrocesso; progressão de câmera e sete faixas de texto HTML.
- Interpolação RAF dependente do delta; seeks serializados com último destino pendente.
- Fetch antecipado do MP4, Blob URL para independência de byte-range do host, abort/cleanup.
- Poster/hero alternativo e texto completo quando vídeo não disponível.
- Gate mobile, retrato, tela baixa, reduced-motion e saveData; nesses casos não baixa MP4.
- Marcadores de conteúdo acessíveis, foco de teclado, links internos e externos seguros.
- SEO próprio da rota; robots global permanece conforme configuração do site, sem liberar indexação por inferência.

## Arquivos binários **necessários para ativar a experiência**
Copiar para o repositório, preservando os nomes:
- `public/images/brand/cosmogonia/segment-00.bin` até `segment-07.bin`: oito segmentos BIN do **mesmo master aprovado**, sem recodificação adicional, recuperados no browser e concatenados em um único Blob `video/mp4` para escrutínio bidirecional via `currentTime`. Tamanhos [900000 ×7, 839128], total **7.139.128 bytes**; SHA-256 da concatenação `b8408cb1808df1256cb0daaad72718158072e17ba719b950471caf79777b25de`. MP4 original 20 segundos, 1280×720, H.264, 24fps, sem áudio, GOP 8.
- `public/images/brand/cosmogonia/poster-final.jpg`: 100.197 bytes, poster conceitual aprovado.
- Os oito segmentos foram necessários para respeitar o limite de corpo de requisição na integração de upload; carregamento `Promise.all` e armazenamento em cache são limitados a desktop elegível.
- Se algum dos nove recursos retornar erro, a experiência retorna para uma apresentação estática, sem afirmar que o vídeo funciona. O scrub só está validado após teste de navegador.

## Próximas verificações obrigatórias
1. Verificar os nove ativos binários já commitados na main: HTTP 200, bytes e SHA-256 reconstruído em navegador; não presumir disponibilização só pelo commit.
2. Executar `npm ci`, TypeScript, lint e `npm run build:hostinger` na HEAD resultante; não executar GitHub Actions.
3. Validar localmente /sobre em desktop (rolagem normal e reversa), mobile e reduced-motion, incluindo scroll rápido e carregamento lento.
4. Conferir /sobre, MP4 e poster ao vivo na Hostinger após deploy e verificação de versão.
5. A aprovação final de conteúdo e qualidade de movimento cabe ao Founder.

**Limite:** commit / merge no GitHub não é prova de publicação na Hostinger. 
