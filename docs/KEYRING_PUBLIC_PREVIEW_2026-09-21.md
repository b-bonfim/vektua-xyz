# Vektua XYZ — implementação editorial de chaveiros (21/09/2026)

## Decisão / fonte
Founder, mensagem nesta conversa em 21/09/2026: "Os novos chaveiros estão aprovados para atualização no site. Faça a implementação agora." Escopo interpretado: autorização explícita para atualizar código e apresentar prévias editoriais no site, sem dispensar licença de arquivo, direitos de personagem, testes físicos e liberações individuais de venda. Fonte dos 21 nomes/SKUs e riscos: `shortlist-sku`, aba Página1, coluna `Line` 10–30; snapshot interno em `lib/keyring-candidates.ts` proveniente da PR #13.

## Implementado
- `components/keyring-preview.tsx`: seção pública informativa com busca por nome/SKU, 11 cards de candidatos `EVIDENCE_PENDING`, rótulo ostensivo de não venda, descrições resumidas sem atributos técnicos inventados e ausência deliberada de preços, botão de compra, páginas individuais e imagens substitutas.
- `components/chaveiros-v2.tsx`: incorpora a seção à página `/chaveiros`; vitrine anterior e seus ativos REMIX preservados.
- `app/chaveiros/keyring-preview.css`: estilo responsivo da prévia.
- `app/chaveiros/page.tsx`: importa CSS e mantém `robots: { index:false, follow:false }`.

## Escopo retido
10 candidatos `HOLD_SPECIFIC_ACTION` permanecem fora de cards públicos e do array transacional `products`: G-CHV-PAL-01, G-CHV-GAT-01, G-CHV-MAS-01, G-CHV-CAV-01, G-CHV-MON-01, G-CHV-MAS-02, G-CHV-MAO-01, G-CHV-ALI-01, G-CHV-BLO-01 e G-CHV-POL-01. Motivos individuais permanecem em `lib/keyring-candidates.ts`. A permissão editorial não confere licença de direitos autorais ou de franquias.

## Imagens e qualidade da evidência
O Drive contém pastas dos novos SKUs. A pasta `G-CHV-FAN-01` contém um PNG nomeado `G-CHV-FAN-01_REMIX`; a de `G-CHV-MUM-01` contém PNG nomeado genericamente e referência `G-CHV-MUM-01.webp`. A declaração `Image Generated? TRUE` em planilha não demonstra que os bytes de uma imagem REMIX foram incorporados ou validados. Não foi possível transportar bytes privados do Drive para o GitHub com o mecanismo disponível nesta execução. Não foram usadas imagens genéricas, URLs privadas, fotos originais no lugar do REMIX ou imagens inventadas.

## Gates preservados e responsáveis
- Quality (08): verificar licença por modelo, direitos independentes de personagens, destinação e risco de peças pequenas.
- Product (03) e Engineering (04): conferir SKU, categoria real, ficha e amostra/ensaio físico.
- Finance (06) e Operations (05): fundamentar preço e disponibilidade/prazo.
- Commerce (07): importar e conferir apenas arquivos REMIX autorizados, depois de validação e acesso operacional viável.
- Founder: liberação comercial individual documentada após evidências, separada desta aprovação editorial.

## Execução / verificação
Alteração somente pelo conector GitHub (commits e merge rastreáveis na PR correspondente). Nenhum GitHub Actions foi iniciado ou utilizado. Lint, typecheck, build, navegador e deploy de produção não foram executados/confirmados nesta atualização. Nenhum registro Notion foi alterado.
