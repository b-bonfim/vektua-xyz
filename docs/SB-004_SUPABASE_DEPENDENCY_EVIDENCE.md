# SB-004 — Evidência de conclusão

**Projeto:** Vektua XYZ  
**Card:** `[SB-004][P0] Adicionar dependências Supabase`  
**Data de conclusão:** 22/09/2026  
**Status:** CONCLUÍDO  
**Regra:** GitHub Actions não utilizado.

## Resultado

O projeto foi preparado para comunicação com Supabase por meio da dependência oficial `@supabase/supabase-js`, sem introduzir mudança funcional de catálogo e sem remover dependências existentes.

## Implementação

- Base original da `main`: `ae558cabe62a8fb7e61c9f415c0789a0880e2d3f`
- Branch: `sb-004-supabase-dependency`
- Commit validado: `c079d22562dd8f9695d93270e941ef68acc88962`
- PR: https://github.com/b-bonfim/vektua-xyz/pull/27
- Merge na `main`: `6d01fbbae83fc89540d50875ba1793f0d0eae9f3`
- Arquivos alterados no PR:
  - `package.json`
  - `package-lock.json`
- Dependência adicionada: `@supabase/supabase-js@2.116.0`
- `@supabase/ssr`: não adicionado neste card, pois o recorte não implementa cliente SSR.

## Validação manual

Validação executada no SHA `c079d22562dd8f9695d93270e941ef68acc88962`:

- Node.js: `v24.13.1`
- npm usado: `11.8.0`
- `npm ci`: PASS
- Pacotes instalados: 645
- Versão instalada de `@supabase/supabase-js`: `2.116.0`
- `npm run check:npm-lock`: PASS
- Saída: `NPM_LOCK_ROOT_PASS; run npm ci to validate the complete dependency graph and integrity.`
- `git status --short`: apenas o arquivo local de evidência, sem drift em arquivos versionados.

Warnings de depreciação exibidos pelo npm não interromperam a instalação e não constituíram falha do DoD.

## Verificação pós-merge

- `package.json` na `main` contém `@supabase/supabase-js: 2.116.0`.
- PR #27 está fechado e marcado como merged.
- Projeto Supabase `tbffwwjqkusiupahjqux` permanece `ACTIVE_HEALTHY`.
- Lista de migrations Supabase: vazia; nenhuma DDL foi aplicada no SB-004.
- GitHub Actions não foi utilizado.

## Matriz DoD

| Critério | Resultado |
|---|---|
| `@supabase/supabase-js` adicionado e lockfile atualizado | PASS |
| Dependência SSR somente se necessária | PASS — não necessária |
| `npm ci` executa com sucesso no mesmo commit | PASS |
| `npm run check:npm-lock` passa | PASS |
| Nenhuma dependência existente/D1 removida | PASS |
| Nenhuma mudança funcional de catálogo | PASS |
| Sem GitHub Actions | PASS |

## Observação de ambiente

O manifesto mantém `packageManager: npm@10.9.2`, enquanto a validação manual foi executada com npm `11.8.0`. Não houve alteração do lockfile decorrente da validação e os critérios explícitos do SB-004 passaram.

## Próximo card

`[SB-005][P0] Criar clientes Supabase público e servidor`.
