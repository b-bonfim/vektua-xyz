# Vektua XYZ — sincronização dos nomes comerciais dos 9 candidatos

**Data:** 20/09/2026  
**Pedido:** Founder solicitou atualizar os nomes do site conforme a planilha `shortlist-sku` e integrar o código à `main`.  
**Fonte consultada:** Google Sheets `shortlist-sku`, ID `1QNSSEhMnCF427aj_oz8BMw5KI4E_MaHPnRu43Pmio2s`, aba `Página1`, intervalo `B4:D13`; chaves na coluna B e nomes na coluna C. Descrições na coluna D.

## Alteração técnica

- `lib/sku-names.ts` registra os nove títulos textualmente iguais aos da coluna `Name`, identificados por SKU.
- `lib/catalog.ts` usa `skuName(id)` para preencher os nove campos `name` dos produtos. Cartões, fichas, breadcrumbs, busca, carrinho e metadata da rota `/produto/` já leem `product.name` e passam a utilizar os nomes sincronizados sem alterar slugs.
- As quatro linhas de produtos, os IDs, slugs, imagens, descrições, preços ilustrativos, status `EVIDENCE_PENDING` e informações de compatibilidade/itens incluídos permanecem inalterados.

## Limites e pendências

Os títulos são **texto proposto de catálogo demonstrativo**, não validação de desempenho comercial, marca de produto, licença, segurança, fabricação, disponibilidade, prazo ou autorização de venda. Mantêm-se checkout desabilitado, `noindex`, avisos de imagem conceitual e gates de SKU/lançamento pendentes. Não houve deploy, anúncio público, gasto ou atualização do Notion nesta operação.

**Validação necessária após integração:** Commerce/frontend deve executar build/lint e conferir cartões, fichas, títulos de página, breadcrumbs e carrinho em desktop/mobile. A leitura e escrita via conectores comprovam atualização do código, não teste de navegador nem publicação.
