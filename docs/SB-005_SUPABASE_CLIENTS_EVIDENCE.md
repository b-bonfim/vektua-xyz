# SB-005 — Evidências: clientes Supabase público e servidor

**Data:** 22/09/2026  
**Card:** [SB-005][P0] Criar clientes Supabase público e servidor  
**Status:** IMPLEMENTADO — QA FINAL PENDENTE  
**Branch:** `feat/sb-005-supabase-clients-20260922`  
**Restrição:** GitHub Actions não utilizado.

## Escopo implementado

- `lib/supabase/env.ts`: valida `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, exige HTTPS e formato `sb_publishable_`.
- `lib/supabase/client.ts`: cliente browser singleton usando somente URL + publishable key.
- `lib/supabase/server.ts`: cria cliente novo por chamada, usando publishable key e `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`.
- `scripts/tests/supabase-client-contract.mjs`: contrato estático que impede referências de chaves privilegiadas no código público, verifica variáveis públicas, configuração de sessão do servidor e `.env*` no `.gitignore`.

## Estado Supabase verificado

Projeto `tbffwwjqkusiupahjqux` (Vektua XYZ) está `ACTIVE_HEALTHY` em `sa-east-1`. A URL do projeto e chave publishable estão disponíveis. Nenhum valor de credencial foi gravado neste documento ou no código.

Nenhuma migration, tabela, bucket, Edge Function ou outra alteração de backend foi executada neste card.

## Verificações executadas nesta rodada

- Diff da branch: apenas módulos Supabase, teste de contrato e esta documentação.
- `SB005_SUPABASE_CLIENT_CONTRACT_PASS`.
- `SB005_ISOLATED_TYPESCRIPT_PASS` — verificação isolada dos novos módulos com stub mínimo da API; não substitui o typecheck do projeto completo.
- `SB005_ENV_RUNTIME_VALIDATION_PASS` — erros claros para env ausente, URL não HTTPS e chave fora do formato publishable.
- `.gitignore` da `main` mantém `.env*`.
- Workflows existentes disparam somente em branches específicas antigas ou por `workflow_dispatch`; a branch SB-005 não corresponde aos gatilhos de push.

## DoD

- [x] Criado módulo de cliente browser usando apenas URL + publishable key.
- [x] Criado módulo de uso servidor.
- [x] Nenhuma chave privilegiada é referenciada no código cliente.
- [x] Variáveis obrigatórias são validadas com mensagem de erro clara.
- [x] `.env*` continua ignorado pelo Git.
- [x] Cliente servidor não persiste sessão entre requests e não é singleton.
- [ ] Código passa TypeScript e lint do repositório completo.

## QA final obrigatório — sem GitHub Actions

Em uma cópia local atualizada da branch:

```bash
git fetch origin
git switch feat/sb-005-supabase-clients-20260922
npm ci
node scripts/tests/supabase-client-contract.mjs
npm run lint
npx tsc --noEmit
```

Critério de liberação: todos os comandos devem terminar com exit code 0. Se lint ou TypeScript falharem, corrigir na própria branch e repetir os quatro comandos.

## Resultado gerencial

O código está implementado, mas o card **não deve ser marcado CONCLUÍDO** até existir evidência do lint e do typecheck completos. Após essa evidência, o PR pode ser liberado para merge e o Trello movido para `Concluído`.
