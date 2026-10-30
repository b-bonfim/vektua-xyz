# Vektua XYZ — NFC Client Links | Piloto Tem de Tudo

**Data:** 2026-10-29  
**Estado:** implementação de links e refinamentos de UI integrados ao repositório; novo asset e ajustes visuais documentados, publicação na Hostinger e teste NFC físico ainda não comprovados.  
**Rota piloto:** `https://vektua.xyz/links/tem-de-tudo`

## Objetivo
Um hub de links mobile-first com identidade da loja, acessível por URL NDEF gravada no NFC integrado ao chaveiro 3D. A rota deve permanecer estável e permitir mudança de links pelo código sem regravar as tags. A proposta é reutilizável para outros estabelecimentos, sem criar um site ou banco separado por cliente.

## Fontes recuperadas
- Histórico da arte do chaveiro (20/10/2026): arquivos `tem_de_tudo_FDM_3_CORES_COMPLETO.svg`, camadas AZUL_BASE/AMARELO/BRANCO e `LEIA_ME.txt` na pasta Google Drive "Tem de Tudo".
- Cores oficiais **da arte FDM recuperada**: azul `#0033AB`, amarelo `#FDE802`, branco `#FFFFFF`; não declarar que a arte FDM é o logotipo-mestre oficial.
- Instagram informado pelo Founder: `https://www.instagram.com/tem_de_tudo_srs/` (URL limpa sem parâmetros de compartilhamento) e WhatsApp/avaliação Google fornecidos em 29/10/2026.
- 3MF e SVG do ícone NFC estão na mesma pasta de origem; sua presença não constitui teste de leitura/conformidade.

## Estrutura
- `app/links/[slug]/page.tsx` — página dinâmica com metadata e fallback 404; sem métricas ou redirecionamento externo arbitrário.
- `app/links/[slug]/links.module.css` — estética do cliente, responsiva e com redução de animação.
- `lib/client-link-pages.ts` — registry versionado por slug. Novos clientes exigem novo registro e validação da identidade/destinos.
- `public/images/clients/tem-de-tudo/keychain-art.svg` — arte FDM anterior, mantida para rastreabilidade; não aparece mais no cabeçalho.
- `public/images/clients/tem-de-tudo/logo-clean.webp` — reconstrução do logo recebida como imagem aprovada visualmente pelo Founder, recortada com transparência (1357×554 px) e otimizada (~96 KB). Não representa fornecimento do arquivo-mestre pelo titular da marca.
- `components/whatsapp-contact.tsx` — não sobrepõe botão flutuante da Vektua nas páginas de clientes.

## Conteúdo verificado e pendente
- **Fornecido/confirmado pelo Founder em 29/10:** nome Tem de Tudo, categoria Variedades & Utilidades, Instagram @tem_de_tudo_srs, WhatsApp +55 35 99891-4282 e URL de avaliação do Google com placeid ChIJW5Ans4Kjy5QRd4MJayPOPz4. A paleta vem da arte FDM. O WhatsApp utiliza uma mensagem de contato pré-preenchida (não envia automaticamente).
- **Pendente com o estabelecimento / Founder:** aprovação do layout e uso público da arte, confirmação de que os links fornecidos pertencem à loja (incluindo o perfil associado ao Place ID do Google), endereço e mapa, horário, Facebook, site e outros destinos caso existam.
- **Sem implementação:** analytics por NFC, painel/admin, QR fallback, banco ou CMS. Não anunciar essas funcionalidades como prontas.
- Nenhum número, endereço, avaliação ou horário deve ser fabricado para preencher o hub.

## Testes de aceite sugeridos
1. `npm run lint` e `npm run build:hostinger` sem erros novos; não realizados nesta branch.
2. Abrir `/links/tem-de-tudo` em viewport 320/375/430/768px e desktop: logo sem corte, legibilidade/contraste, foco de teclado, `prefers-reduced-motion`.
3. Conferir 404 em `/links/slug-inexistente` e link do Instagram em nova aba.
4. Conferir que as páginas de links não exibem o balão global de WhatsApp da Vektua; os CTAs de Vektua ficam em seção subordinada.
5. Validar rotas internas `/contato` e `/` no site publicado. Validar número/abertura do WhatsApp com texto preenchido e Google Review com perfil correto, sem publicar avaliação de teste.
6. Gravar uma etiqueta NFC compatível como registro **NDEF URI HTTPS** com o endereço exato da rota; verificar leitura **antes de inserir** na peça.
7. Testar leitura após integração e resfriamento com vários aparelhos reais (Android/iOS conforme disponibilidade), variando orientação e capas. Se a etiqueta não ler repetidamente, revisar posicionamento/espessura e interferências antes do lote.
8. Conferir experiência de erro, acessibilidade, link social, domínio final e certificado HTTPS após release.
9. Obter aprovação do cliente para uso da marca e do Founder para publicação comercial.

## Princípios de produto
- **Slug permanente** após tag programada. Não renomear `tem-de-tudo`; eventual mudança deve preservar redirect permanente e funcionamento real.
- O link deve ser a página própria da Vektua, não um encurtador de terceiros; o conteúdo de destino pode evoluir sem regravar tags.
- A página atende prioritariamente à **Tem de Tudo**. CTAs da Vektua ficam abaixo dos links do cliente, em área claramente assinada.
- No MVP o registry em código é deliberado; migrar para Supabase/admin somente após necessidade confirmada (volume/edições frequentes), com validação de URLs e permissões.
- Não adicionar rastreamento identificável sem revisão de privacidade; analytics agregado é evolução futura.

## Decisão pendente
Founder autorizou expressamente merge e deploy em 29/10/2026. Seguir com revisão dos links e verificações técnicas; autorização comercial do Founder não equivale a licença da marca do parceiro, validação de links nem evidência de leitura física. A gravação/produção em lote segue dependente de teste NFC.

## Refinamento visual de 29/10/2026
- Substituída a arte FDM utilizada no cabeçalho por uma reconstrução de logo com transparência e proporção adequada para web.
- Removido o retângulo azul escuro atrás do logo; fundo da página harmonizado com azul da versão digital (#0A3FC2) e gradiente discreto.
- Preservados a hierarquia mobile-first, o Instagram, o WhatsApp com texto pré-preenchido e o link de avaliação do Google.
- A substituição de imagem não comprova autorização da loja para uso público da marca nem certifica fidelidade ao vetor-mestre; validar com o cliente.
- Preview de código e verificação de presença do asset não substituem build real, inspeção mobile e deploy na Hostinger.
