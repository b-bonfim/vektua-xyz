# Verificação da implementação comercial e REMIX

Data: 21/09/2026. Repositório: `b-bonfim/vektua-xyz`. PR: #16.

## Alteração executada

Aplicado `scripts/apply-commercial-remix.mjs` do pacote recebido sobre a implementação comercial `2f716acd1a16a32f49f3e5166e8d16467ad715d8`.

O commit de implementação `95e3c94` acrescenta exatamente dez WebP e o mapeamento por SKU em `lib/commercial-catalog.ts`. Cada arquivo confere com tamanho e SHA-256 do manifesto recebido; todos foram abertos e verificados como imagens WebP válidas. Total: 1.101.224 bytes.

SKUs: G-CHV-ABO-01, G-CHV-CRA-01, G-CHV-ESQ-01, G-CHV-ESQ-02, G-CHV-FAN-01, G-CHV-FAN-02, G-CHV-FAN-03, G-CHV-LOB-01, G-CHV-MED-01 e G-CHV-MUM-02.

O manifesto do pacote descreve um estado anterior à aprovação interna do Founder. Foi usado como inventário de arquivos e hashes, sem reintroduzir suas antigas restrições comerciais. A aprovação interna não foi convertida em comprovação de direitos, testes, preço, estoque ou segurança.

## Verificações realizadas

| Verificação | Resultado e escopo |
| --- | --- |
| `pnpm lint` | PASS, sem erros ou avisos de lint |
| `pnpm exec tsc --noEmit` | PASS |
| `pnpm build` | PASS, saída de produção gerada; Vinext informa limitações na classificação estática de rotas |
| Integridade das dez imagens | PASS, tamanho, SHA-256 e decodificação WebP |
| Busca por SKU | PASS, filtragem para G-CHV-FAN-01 e G-CHV-ABO-01 |
| Foto no catálogo e na ficha | PASS, FAN-01 e ABO-01 carregadas com dimensões naturais válidas |
| Ficha sem REMIX | PASS, MUM-01 mantém identificação textual e permite adicionar ao carrinho |
| Dois SKUs e opções distintas | PASS, FAN-01/Branco e MUM-01/Cinza |
| Quantidade e recarga | PASS, alteração de 2 para 3 unidades preservada após recarregar a página |
| Mensagem do WhatsApp | PASS, telefone 5535984445677, dois SKUs, quantidades, opções e observações conferidos no link; nenhuma mensagem enviada |
| Remover item e limpar carrinho | PASS, mensagem recalculada e estado vazio apresentado |
| Navegação por links | PASS, início → chaveiros → ficha → ficha relacionada → carrinho; sem falha funcional observada |
| Layout estreito | PASS em iframe de 390 px, área útil de 380 px; ficha e carrinho sem rolagem horizontal |
| Menu estreito | PASS, abre, fecha com Escape e navega para Objetos & Colecionáveis |

As verificações de navegador usaram a prévia local supervisionada da árvore de código do commit de implementação. A inclusão posterior deste registro e das capturas não altera o código executado. O teste estreito verifica responsividade; não equivale a um aparelho móvel físico. As mensagens de erro observadas no console pertenciam à extensão do navegador, não à aplicação.

## Evidências

- [Carrinho desktop](cart-desktop.jpg): dois SKUs, opções, quantidades, observação e botão de envio.
- [Carrinho responsivo](cart-responsive.jpg): imagem REMIX e controles na largura de celular.
- [Inventário verificado](remix-verified.json): hashes e tamanhos dos dez arquivos.

## Limites

- Apenas as dez imagens presentes no ZIP foram importadas. O pacote não contém REMIX de MUM-01 nem dos outros dez SKUs excluídos do inventário de saídas; nenhum original foi usado em substituição.
- Não foi enviado pedido real ou mensagem pelo WhatsApp. Abrir o link permanece uma ação do cliente.
- Não foram ativados pagamento, Supabase, captura automática de pedidos, indexação, DNS ou hospedagem.
- Build de produção compilado; teste de navegador realizado na prévia local, sem afirmar validação da publicação em produção ou resolução da investigação independente da PR #10.
- Nenhuma execução do GitHub Actions foi solicitada. Commits usam `[skip ci]` e as branches de trabalho/main não correspondem aos gatilhos de push dos workflows existentes.
- Este registro não atualiza Notion ou Trello e não declara lançamento público concluído.
