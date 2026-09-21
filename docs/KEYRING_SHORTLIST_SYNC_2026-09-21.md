# Sincronização de candidatos de chaveiros — 21/09/2026

**Fonte externa consultada:** [shortlist-sku, Página1, linhas de dados 10–30](https://docs.google.com/spreadsheets/d/1QNSSEhMnCF427aj_oz8BMw5KI4E_MaHPnRu43Pmio2s/edit?gid=0#gid=0). Cabeçalho da fonte na linha 4; o campo `Line` numera os produtos de 10 a 30. **Repositório:** `b-bonfim/vektua-xyz`. **Escopo da solicitação:** recuperar novos SKUs e atualizar o site sem GitHub Actions.

## Resultado deste recorte

- 21 candidatos distintos registrados em `lib/keyring-candidates.ts`, preservando SKU, nome, coleção, link MakerWorld, estado declarado da licença, sinalizador de imagem da planilha, linha de origem, risco e gate.
- O link corrigido do SKU `G-CHV-CAV-01` (modelo MakerWorld 1995632, linha 20) foi mantido distinto de `G-CHV-LOB-01` (modelo 1868739, linha 19).
- 11 candidatos classificados `EVIDENCE_PENDING` e 10 `HOLD_SPECIFIC_ACTION` **como triagem gerencial deste commit, não parecer formal de Quality**. Nenhum dos 21 foi registrado como aprovado, liberado, anunciado, precificado ou incluído em `products`.
- O site `/chaveiros` informa o recebimento e o status agregado dos 21 candidatos. A única ficha demonstrativa já existente de chaveiro (`G-CHV-JJ-01`) permanece inalterada. Não houve cadastro de produtos, alteração de preço ou oferta de venda.
- Não foram importadas imagens originais, imagens não-REMIX, fotos genéricas, imagens geradas sem referência ou URLs privadas do Drive como fotos de produtos. `Image Generated?` é uma informação declarada pela planilha, não comprovante de que o arquivo REMIX exista no repositório. Nenhum novo arquivo de imagem foi publicado.

## Bloqueios específicos identificados na planilha

| Tipo | SKUs | Pendência |
|---|---|---|
| Franquia/personagem e licença | G-CHV-PAL-01, G-CHV-MAS-01, G-CHV-MON-01, G-CHV-MAS-02, G-CHV-MAO-01, G-CHV-BLO-01 | Autorizações de terceiros e direitos do arquivo separados; não anunciar. |
| Licença comercial e/ou categoria | G-CHV-GAT-01, G-CHV-CAV-01, G-CHV-ALI-01, G-CHV-POL-01 | Confirmar licença efetiva e, em alguns casos, se é mesmo chaveiro; alienígena também requer verificação de PI. |
| Demais 11 candidatos | MUM-01, FAN-01, CRA-01, MUM-02, FAN-02, MED-01, LOB-01, ESQ-01, ABO-01, ESQ-02, FAN-03 (todos com prefixo G-CHV-) | Licenças atribuídas como Public Domain na origem **não verificadas**; ainda exigem arquivo, protótipo, segurança aplicável, custos, prazo e aprovação. |

A alteração anterior da planilha removendo menções de restrição em certas linhas não substitui licença comercial, direitos de personagem, ensaio físico ou parecer competente. A planilha contém alertas atualizados em suas colunas `License` e `Comments`; mantidos neste registro em vez de apagados.

## Política de publicação e imagens

A inclusão como **candidato interno** não equivale a liberação comercial do SKU. Antes da primeira ficha pública: Product confirma categoria e composição; Quality revisa licenças, direitos e destinação; Engineering registra protótipo, fixação e medições; Finance/Operations fundamentam preço, estoque e prazo; o Founder libera cada SKU; Commerce publica a ficha somente após essas condições. Usar apenas imagem REMIX da pasta do SKU, com origem e natureza editada explicitadas, depois de verificar seu arquivo e adequação; não converter `Image Generated?=TRUE` em confirmação de foto real.

## Execução técnica / limite de verificação

- Alterações limitadas a `lib/keyring-candidates.ts`, `components/chaveiros-v2.tsx` e este registro.
- **GitHub Actions não utilizado, não solicitado e não disparado deliberadamente.** Os workflows existentes têm gatilhos de push em branches específicos diferentes desta branch e da `main`, além de execução manual; não foram modificados.
- Conector GitHub permitiu escrita e leitura posterior dos arquivos alterados. **Lint, build, typecheck, browser tests e deploy não foram executados neste ambiente**; não declarar PASS, desempenho ou publicação em produção por inferência. A liberação do código para `main` é diferente da liberação comercial dos novos SKUs.
- Nenhum registro Notion/Trello/planilha foi alterado. Fonte planilha somente lida.

**Owners para destravar:** Product (categoria/ficha); Quality (licença, PI, destinação), Engineering (peça e testes), Finance/Operations (preço, fila e prazo), Founder (SKU Release Gate), Commerce (ficha comercial depois do gate). **Estado dos 21 SKUs:** sem liberação comercial nesta entrega.
