# Vektua XYZ — visibilidade editorial dos 10 SKUs restantes | 21/09/2026

## Ordem e escopo

O Founder determinou expressamente nesta conversa: "Incorporar os outros 10 SKUs à vitrine. Estou dando uma ordem expressa para essa ação." A ordem é de apresentação no site e não fornece provas de licenciamento, liberação comercial, protótipos, preço, disponibilidade ou conformidade.

Fontes: shortlist-sku, aba Página1, coluna `Line` 10–30; snapshot versionado em `lib/keyring-candidates.ts` pela PR #13; prévia editorial de 11 SKUs na PR #14; constituição e gates do 3D Business Board. `Line` 10–30 corresponde às linhas físicas 14–34 da planilha consultada em 21/09/2026.

## Resultado proposto nesta alteração

- Na página `/chaveiros`, apresentar os 10 identificadores restantes numa seção editorial separada, junto à prévia de 11 SKUs existente, totalizando 21 entradas da shortlist.
- Exibir SKU e nome genérico já registrado na planilha, motivo resumido da pendência e sinalização inequívoca de indisponibilidade.
- Preservar `HOLD_SPECIFIC_ACTION` para os 10; não incluir em `lib/catalog.ts` / `products`, busca comercial geral, ficha de produto, carrinho ou checkout.
- Não exibir imagens de personagens, arquivos STL/3MF, links externos de modelos, marcas de franquias, preço, reserva ou promessa de fabricação.
- Preservar `noindex` de `/chaveiros` e toda a vitrine existente. Nenhum GitHub Actions deve ser utilizado.

## Relação individual e condição para nova avaliação

| SKU | Pendência vigente / owner de verificação |
|---|---|
| G-CHV-PAL-01 | Direitos de personagem + licença do arquivo / Quality |
| G-CHV-GAT-01 | Licença e comprovação de versão chaveiro / Quality + Product |
| G-CHV-MAS-01 | Direitos de personagem + licença do arquivo / Quality |
| G-CHV-CAV-01 | Licença comercial efetivamente concedida / Quality |
| G-CHV-MON-01 | Direitos de personagem + licença do arquivo / Quality |
| G-CHV-MAS-02 | Direitos de personagem + licença comercial / Quality |
| G-CHV-MAO-01 | Direitos de personagem, remix e licença / Quality |
| G-CHV-ALI-01 | Classificação como chaveiro e eventual PI / Product + Quality |
| G-CHV-BLO-01 | Licença de uso pessoal e direitos de terceiros / Quality |
| G-CHV-POL-01 | Licença comercial e versão chaveiro / Quality + Product |

Todos: protótipo, testes, fotografias válidas e dados de fabricação permanecem pendentes de Engineering; preço fundamentado de Finance, disponibilidade de Operations e liberação de SKU pelo Founder apenas após pacote de evidências. A sinalização editorial não modifica esses gates.

## Validação e rastreabilidade

Alteração de código limitada a `components/keyring-preview.tsx` e `app/chaveiros/keyring-preview.css`. Conferir comparação e merge da PR específica no GitHub. Não alegar lint, typecheck, build, testes de navegador, implantação em produção, licença, autorização de terceiros ou liberação comercial sem provas. Notion e planilha não são modificados por esta alteração.
