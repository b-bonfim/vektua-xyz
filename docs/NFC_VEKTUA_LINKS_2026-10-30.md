# Vektua XYZ — Hub de links (Instagram, WhatsApp e PIX)

**Data:** 2026-10-30  
**Estado:** implementação em branch de revisão; publicação no domínio e leitura NFC ainda não verificadas.  
**URL pretendida:** `https://vektua.xyz/links/vektua`  
**Origem:** arquitetura do piloto Tem de Tudo (`/links/[slug]`).

## Escopo implementado
- Novo registro `vektua` em `lib/client-link-pages.ts`, aproveitando a mesma rota dinâmica do piloto; o registro da Tem de Tudo foi preservado.
- Identidade Vektua XYZ: logotipo Rev02 existente em `/brand/vektua-wordmark.svg`, Manrope, grafite `#24302F`, marfim `#F7F5F0`, verde-petróleo `#176D67` e terracota `#C45C3B`.
- Conteúdo curto, consistente com "Objetos com personalidade" e "Do achado à peça só sua".
- Três ações prioritárias: WhatsApp (principal), Instagram e copiar chave PIX.
- Instagram: `https://www.instagram.com/vektua.xyz/` (URL canônica do perfil informado pelo Founder).
- WhatsApp: `https://wa.me/5535984445677`, com mensagem de contato preenchida; o usuário decide enviá-la.
- PIX: botão de cópia da chave aleatória fornecida pelo Founder; usa `navigator.clipboard.writeText` sob gesto do usuário, retorno acessível e fallback de seleção manual se o navegador bloquear a cópia.
- Texto de cautela: verificar o titular no banco antes de transferir; a página não inicia nem confirma pagamento.
- Metadados `noindex,nofollow`, links externos protegidos com `noopener noreferrer`, `prefers-reduced-motion` e layout mobile-first.
- Não há necessidade de novas dependências ou APIs. O único trecho client-side adicionado é o botão de cópia.

## Arquivos
- `lib/client-link-pages.ts`
- `app/links/[slug]/page.tsx`
- `app/links/[slug]/copy-pix-button.tsx`
- `app/links/[slug]/links.module.css`

## Aceite técnico pendente
1. Executar `npm run lint` e `npm run build:hostinger` em ambiente com dependências.
2. Conferir `/links/tem-de-tudo` sem regressões e `/links/vektua` com os três cartões e sem scroll horizontal.
3. Testar 320x568, 360x640, 390x700 e telas maiores; três CTAs na primeira dobra, considerando fontes e zoom.
4. Testar botão PIX em Android Chrome e iOS Safari via HTTPS; conferir valor copiado integralmente e seleção manual quando negado.
5. Testar a mensagem do WhatsApp e o perfil do Instagram nos aparelhos reais.
6. Validar publicação/HTTPS na Hostinger e, se for usar NFC, gravar NDEF URI e testar a leitura física.
7. Confirmar que a chave PIX exibida corresponde ao destinatário correto. O código não comprova titularidade.

## Governança
A solicitação autoriza a preparação da página no repositório; o PR não é prova de publicação, confirmação do PIX nem de pagamento realizado. Revisão e eventual merge/deploy permanecem separados.
