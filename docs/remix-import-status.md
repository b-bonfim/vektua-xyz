# REMIX por SKU — importação pendente (20/09/2026)

**Estado:** integração preparada em branch; imagens binárias ainda NÃO enviadas ao GitHub; aplicação do script e merge bloqueados para não criar imagens quebradas.

Fonte: pacote `vektua-xyz-imagens-remix-atualizacao(1).zip`, fornecido pelo Founder, contendo `remix-manifest.json` com hashes SHA-256 dos 16 WebPs e IDs das 16 imagens REMIX de origem no Drive. Integridade ZIP, hashes de destino e leitura dos 16 WebPs conferidas no pacote local. O script `apply-remix.mjs` deve ser executado somente DEPOIS que os 16 arquivos forem colocados em `public/images/products/remix/`, preservando os nomes. O script interrompe a aplicação caso faltem imagens ou os arquivos do site tenham divergido.

| SKU | Quantidade de REMIX |
| --- | ---: |
| G-CHV-JJ-01 | 3 |
| G-ORG-HS-01 | 3 |
| G-ORG-RC-01 | 1 |
| G-VAS-ESC-01 | 1 |
| G-VAS-MIN-01 | 1 |
| S-HAL-DEC-01 | 4 |
| S-NAT-PRE-01 | 3 |
| **Total** | **16** |

`CAN-PET-001` e `CAN-PESSOA-001` não têm imagens REMIX no pacote: manter representações e ressalvas anteriores, sem inventar imagens de amostras.

## Critério antes do merge

1. Confirmar 16 arquivos REMIX nas pastas e verificar os hashes do manifesto do ZIP.
2. Executar `node apply-remix.mjs` no checkout da branch já com os WebPs presentes. Conferir `git diff --check`, `pnpm build` e `pnpm lint` e revisar vitrine, páginas e galeria.
3. Commitar **imagens e código juntos**, abrir/revisar PR e só então efetuar merge em `main`.

**Sem alteração de liberação comercial:** site continua protótipo, compras/pagamento indisponíveis. REMIX é imagem ambientada/editada, não evidência de fotografia de produto fabricado, licença ou segurança.
