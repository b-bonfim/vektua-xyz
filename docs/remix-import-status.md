# REMIX por SKU — integração implementada (20/09/2026)

**Estado:** os 16 WebPs estão presentes com a integração ao catálogo, galerias, home, linhas, Chaveiros, Sobre e carrinho. Build, TypeScript, integridade e verificações HTTP concluídos. O [PR #5](https://github.com/b-bonfim/vektua-xyz/pull/5) registra os commits e a confirmação do merge. Este relatório não confirma implantação no serviço de hospedagem.

## Fonte e escopo

- Pacote recebido do Founder: `vektua-xyz-imagens-remix-atualizacao(2).zip`.
- Base conferida: `main` em `58bf54522d4cba21e341a17f9c5dae9742e3a8cd`.
- Branch existente: `feat/remix-sku-images-20260920`; mantido o PR #5.
- `docs/remix-manifest.json`: nomes REMIX, SKUs, IDs de origem no Drive, dimensões e SHA-256 de cada WebP; inclui também o hash do pacote recebido. A integridade dos arquivos do pacote foi verificada nesta execução; os originais no Drive não foram baixados novamente.
- Nenhuma imagem nova foi gerada. Somente os arquivos REMIX do pacote foram incorporados.

| SKU | Imagens REMIX |
| --- | ---: |
| G-CHV-JJ-01 | 3 |
| G-ORG-HS-01 | 3 |
| G-ORG-RC-01 | 1 |
| G-VAS-ESC-01 | 1 |
| G-VAS-MIN-01 | 1 |
| S-HAL-DEC-01 | 4 |
| S-NAT-PRE-01 | 3 |
| **Total** | **16** |

## Alterações

- As sete fichas recebem a imagem principal e sua galeria por SKU. As imagens completas cabem na área da ficha; os controles podem quebrar linha em telas estreitas.
- Home, vitrines, coleções, Chaveiros, Sobre e carrinho usam as imagens correspondentes e textos alternativos consistentes com REMIX/ambientação editada.
- Corrigidos JSX inválido e contagens de âncoras do script original. `apply-remix.mjs` reproduz os seis arquivos de aplicação a partir da base e interrompe reaplicação sem escrita parcial. O script já foi aplicado: não executá-lo novamente sobre esta versão.
- `CAN-PET-001` e `CAN-PESSOA-001` preservam suas imagens conceituais e o controle de aproximação. Não há REMIX dessas ofertas no pacote.
- Os nove nomes, textos comerciais da shortlist, preços demonstrativos, composição das quatro linhas e gates foram comparados com a base e preservados. O aviso associado às imagens foi atualizado para refletir o material recebido.

## Validação executada

Evidências estruturadas em `docs/remix-validation.json`.

- 16/16 WebPs com SHA-256, dimensões, tamanho, decodificação e associação ao SKU conferidos; inspeção visual dos 16 arquivos.
- `pnpm install --frozen-lockfile`: concluído, sem alteração de dependências ou lockfile. Ambiente disponível: Node 24.19.0 e pnpm 11.19.0; o projeto declara pnpm 11.25.0.
- `pnpm build`, `pnpm exec tsc --noEmit` e `git diff --check`: concluídos sem erro.
- 18 rotas com HTTP 200, incluindo as nove fichas; imagem inicial, quantidade de controles e avisos de compra desabilitada conferidos no HTML renderizado.
- 20 recursos de imagem servidos sem erro, incluindo os 16 REMIX com MIME `image/webp` e hash idêntico ao manifesto.
- Nenhuma referência aos SVGs antigos de SKU ou às cenas genéricas `objects.webp`/`collection.webp` nas rotas conferidas.
- Script reproduz os seis arquivos finais a partir da base; segunda execução recusada sem alterar nenhum deles.

## Limitações e pendências

- **Lint — owner Engineering:** a base já retornava dois erros `react-hooks/set-state-in-effect`, em `components/cart-context.tsx:13` e `components/storefront.tsx:22`, além de 21 avisos de `<img>`. A integração retorna os mesmos dois erros e 21 avisos, sem novo erro. Não foi alterada a lógica de menu/carrinho para resolver dívida anterior.
- **QA de navegador — owner Commerce/Engineering:** o executável de navegador não estava disponível e sua instalação não concluiu; não há confirmação de cliques, hidratação ou layout desktop/mobile em navegador. A inspeção visual cobriu os arquivos de imagem, e a checagem de páginas cobriu o HTML e recursos HTTP da compilação de produção.
- **Hospedagem:** commit/merge não equivalem a deploy verificado. Nenhuma implantação foi executada nesta tarefa.

## Histórico e autorização

O estado anterior deste registro indicava bloqueio por ausência de arquivos binários; está preservado no histórico Git. Nesta execução, o pacote completo foi recuperado, os assets adicionados e a integração validada no escopo acima. O Founder solicitou expressamente execução, commit e merge para `main`.

REMIX é imagem ambientada/editada, não evidência de fotografia de peça fabricada, licença ou segurança. O checkout continua desabilitado e todos os produtos mantêm `EVIDENCE_PENDING`. Esta integração não libera venda, produção, pagamento ou lançamento e não altera registros no Notion.
