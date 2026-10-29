# Vektua XYZ — NFC Client Links | Piloto Tem de Tudo

**Data:** 2026-10-29  
**Estado:** implementação proposta em branch de revisão; não publicada, não testada fisicamente.  
**Rota piloto:** `https://vektua.xyz/links/tem-de-tudo`

## Objetivo
Um hub de links mobile-first com identidade da loja, acessível por URL NDEF gravada no NFC integrado ao chaveiro 3D. A rota deve permanecer estável e permitir mudança de links pelo código sem regravar as tags. A proposta é reutilizável para outros estabelecimentos, sem criar um site ou banco separado por cliente.

## Fontes recuperadas
- Histórico da arte do chaveiro (20/10/2026): arquivos `tem_de_tudo_FDM_3_CORES_COMPLETO.svg`, camadas AZUL_BASE/AMARELO/BRANCO e `LEIA_ME.txt` na pasta Google Drive "Tem de Tudo".
- Cores oficiais **da arte FDM recuperada**: azul `#0033AB`, amarelo `#FDE802`, branco `#FFFFFF`; não declarar que a arte FDM é o logotipo-mestre oficial.
- Instagram informado pelo Founder: `https://www.instagram.com/tem_de_tudo_srs/`.
- 3MF e SVG do ícone NFC estão na mesma pasta de origem; sua presença não constitui teste de leitura/conformidade.

## Estrutura
- `app/links/[slug]/page.tsx` — página dinâmica com metadata e fallback 404; sem métricas ou redirecionamento externo arbitrário.
- `app/links/[slug]/links.module.css` — estética do cliente, responsiva e com redução de animação.
- `lib/client-link-pages.ts` — registry versionado por slug. Novos clientes exigem novo registro e validação da identidade/destinos.
- `public/images/clients/tem-de-tudo/keychain-art.svg` — arte FDM existente, usada como referência visual do projeto.
- `components/whatsapp-contact.tsx` — não sobrepõe botão flutuante da Vektua nas páginas de clientes.

## Conteúdo verificado e pendente
- **Confirmado pelo contexto do projeto:** nome Tem de Tudo, categoria Variedades & Utilidades, Instagram acima e paleta da arte FDM.
- **Pendente com o estabelecimento / Founder:** aprovação do layout e uso público da arte, WhatsApp comercial, endereço e Google Maps, horário, Facebook, site e outros destinos caso existam.
- **Sem implementação:** analytics por NFC, painel/admin, QR fallback, banco ou CMS. Não anunciar essas funcionalidades como prontas.
- Nenhum número, endereço, avaliação ou horário deve ser fabricado para preencher o hub.

## Testes de aceite sugeridos
1. `npm run lint` e `npm run build:hostinger` sem erros novos; não realizados nesta branch.
2. Abrir `/links/tem-de-tudo` em viewport 320/375/430/768px e desktop: logo sem corte, legibilidade/contraste, foco de teclado, `prefers-reduced-motion`.
3. Conferir 404 em `/links/slug-inexistente` e link do Instagram em nova aba.
4. Conferir que as páginas de links não exibem o balão global de WhatsApp da Vektua; os CTAs de Vektua ficam em seção subordinada.
5. Validar rotas internas `/chaveiros`, `/contato` e `/` no site publicado.
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
Founder e cliente devem revisar layout, links, arte e consentimento. Merge na main, deploy e gravação/produção em lote não estão autorizados nem comprovados por esta branch.
