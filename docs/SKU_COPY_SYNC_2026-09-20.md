# Sincronização de descrições · shortlist-sku → site Vektua XYZ

**Data:** 20/09/2026  
**Fonte:** Google Drive, pasta `SKUs`, planilha nativa `shortlist-sku`, aba `Página1`, colunas B (SKU) e C (Description), linhas 5–13.  
**Owner da execução de conteúdo:** Skill 07 Commerce, com coordenação executiva VP.  
**Escopo autorizado:** atualizar texto do site, versionar código e integrar na `main`; não é autorização de publicação do site, operação comercial ou lançamento.

## Alterações

- Transcrição integral das nove descrições otimizadas em `lib/sku-copy.ts`, indexadas por ID de SKU.
- O nome/título antecedido de ` | ` na planilha foi preservado na transcrição para rastreabilidade e omitido apenas do parágrafo exibido, pois a página já apresenta o nome do produto como título próprio.
- `lib/catalog.ts` passou a carregar os textos pela função `skuDescription`, que adiciona separadamente ressalvas por SKU e o aviso já existente de visualização digital e ausência de liberação comercial.
- Mapeamento 1:1: `S-HAL-DEC-01`, `G-ORG-RC-01`, `G-VAS-ESC-01`, `S-NAT-PRE-01`, `G-VAS-MIN-01`, `G-ORG-HS-01`, `G-CHV-JJ-01`, `CAN-PESSOA-001`, `CAN-PET-001`. A ordem visual e os nomes, slugs, preços demonstrativos, imagens, categorização e estados de gate foram preservados.

## Limites e divergências preservados

- O campo `License` da planilha é registro informativo, **não comprovação jurídica**; não foi utilizado para anunciar direitos comerciais ou liberar nenhum SKU.
- A planilha emprega expressões como “antes da compra” e “antes do pedido”, embora o site permaneça protótipo. Os textos-fonte foram mantidos para fidelidade; ressalvas visíveis no mesmo campo e a interface demonstrativa esclarecem que compra, upload e pedido ainda não estão disponíveis.
- O nome histórico do kit menciona três mini-cachepôs, mas a descrição da fonte pede conferir quantidade: permaneceu ressalva de que composição e função dependem de verificação.
- Para personalizados, permanecem o aviso de não envio de imagens pessoais e as pendências de privacidade, direitos dos outputs e escopo.
- O chaveiro segue exclusivamente na quarta linha; nenhum parceiro físico é anunciado como confirmado.
- Não alterar `noindex`, checkout, disponibilidade, preços, fotos, licenças ou Founder Gates.

## Verificação

- Os nove IDs da planilha correspondem aos nove IDs do catálogo vigente em `main` no início da execução.
- Confirmar via GitHub a leitura de ambos os arquivos alterados e estado do PR/merge. Build, lint e testes reais de navegador precisam ser executados quando houver runner disponível; não marcá-los como aprovados sem logs.

**Próxima etapa operacional (owner Commerce/frontend):** teste visual das nove fichas, legibilidade mobile e validação de build. **Quality:** revisão de direitos e claims antes de qualquer lançamento. **Founder:** mantém exclusivamente os gates de liberação comercial e lançamento.
