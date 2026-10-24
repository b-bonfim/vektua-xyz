# Vektua XYZ — /sobre | Cosmogonia do Objeto

**Data:** 24/10/2026  
**Owner:** 07 Commerce / Brand Experience, com implementação frontend.  
**Direção criativa:** aprovada pelo Founder na conversa; publicação solicitada expressamente em /sobre.  
**Status deste commit:** interface e mecanismo de vídeo scrub implementados no código; **upload do MP4/poster, build, QA em navegador e publicação pública requerem verificação separada**.

## Conteúdo e identidade
- Página institucional original (não vitrine simples de produtos).
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
- `public/images/brand/cosmogonia/master-scroll-720.mp4` — arquivo-fonte local: `VEKTUA_COSMOGONIA_MASTER_SCROLL_v2_720p.mp4`, 20s, 1280×720, sem áudio, GOP 8.
- `public/images/brand/cosmogonia/poster-final.jpg` — arquivo-fonte local: `VEKTUA_COSMOGONIA_POSTER_FINAL_v2.jpg`.
O componente verifica MIME e HTTP 200; se não estiverem presentes, preserva uma experiência estática intencional, **mas o scrub não funciona**. A presença desses ativos é um requisito para declarar a experiência cinematográfica publicada.

## Próximas verificações obrigatórias
1. Acrescentar os ativos binários, conferir SHA/bytes/MIME e que estão efetivamente servidos via HTTPS.
2. Executar `npm ci`, TypeScript, lint e `npm run build:hostinger` na HEAD resultante; não executar GitHub Actions.
3. Validar localmente /sobre em desktop (rolagem normal e reversa), mobile e reduced-motion, incluindo scroll rápido e carregamento lento.
4. Conferir /sobre, MP4 e poster ao vivo na Hostinger após deploy e verificação de versão.
5. A aprovação final de conteúdo e qualidade de movimento cabe ao Founder.

**Limite:** commit / merge no GitHub não é prova de publicação na Hostinger. 
