# SB-005 — Evidências: clientes Supabase público e servidor

**Data:** 22/09/2026  
**Card:** [SB-005][P0] Criar clientes Supabase público e servidor  
**Status:** CONCLUÍDO — QA FINAL APROVADO  
**Branch validada:** `feat/sb-005-supabase-clients-20260922`  
**SHA validado localmente:** `a8caf60bfe12b8f87693183bb092e42561e2bc41`  
**Restrição:** GitHub Actions não utilizado.

## Escopo implementado

- `lib/supabase/env.ts`: valida `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, exige HTTPS e formato `sb_publishable_`.
- `lib/supabase/client.ts`: cliente browser singleton usando somente URL + publishable key.
- `lib/supabase/server.ts`: cria cliente novo por chamada, usando publishable key e `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`.
- `scripts/tests/supabase-client-contract.mjs`: contrato estático que impede referências de chaves privilegiadas no código público, verifica variáveis públicas, configuração de sessão do servidor e `.env*` no `.gitignore`.

## Estado Supabase verificado

Projeto `tbffwwjqkusiupahjqux` (Vektua XYZ) está `ACTIVE_HEALTHY` em `sa-east-1`.

Verificação em 22/09/2026:
- migrations registradas: 0;
- tabelas no schema `public`: 0;
- nenhuma migration/DDL foi executada por este card.

A documentação oficial atual do Supabase confirma o uso de publishable key no frontend e que secret/service-role keys nunca devem ser expostas no cliente. Este card não introduz chave privilegiada.

## QA final executado pelo Founder — Windows 10

Diretório local:
`C:\Users\brbbo\dev\vektua-xyz-npm`

Revisão confirmada antes dos testes:
```text
git rev-parse HEAD
a8caf60bfe12b8f87693183bb092e42561e2bc41
```

### 1. Instalação reproduzível

```text
npm ci
added 645 packages in 1m
```

Warnings de pacotes deprecated foram emitidos, mas o comando terminou com sucesso e não bloquearam o DoD deste card.

### 2. Contrato de segurança SB-005

```text
node scripts/tests/supabase-client-contract.mjs
SB005_SUPABASE_CLIENT_CONTRACT_PASS
```

**Resultado:** PASS.

### 3. ESLint

```text
npm run lint

> site-creator-vinext-starter@0.1.0 lint
> eslint . --ignore-pattern dist --ignore-pattern .next
```

Nenhum erro foi emitido; o prompt retornou normalmente.

**Resultado:** PASS.

### 4. TypeScript

```text
npx tsc --noEmit
```

Nenhum erro foi emitido; o prompt retornou normalmente.

**Resultado:** PASS.

### 5. Estado do working tree após QA

```text
git status --short
?? SB-004-validation.txt
```

O único item local é `SB-004-validation.txt`, arquivo não rastreado e não relacionado ao SB-005. Nenhum arquivo versionado do SB-005 ficou modificado após os testes.

## Verificações complementares

- `.gitignore` mantém `.env*`.
- Diff do PR contém apenas:
  - `docs/SB-005_SUPABASE_CLIENTS_EVIDENCE.md`
  - `lib/supabase/client.ts`
  - `lib/supabase/env.ts`
  - `lib/supabase/server.ts`
  - `scripts/tests/supabase-client-contract.mjs`
- Nenhum arquivo de UI/frontend visual foi alterado; portanto não houve escopo aplicável para auditoria Impeccable.
- Nenhum workflow GitHub Actions foi executado no SHA validado.

## DoD final

- [x] Criado módulo de cliente browser usando apenas URL + publishable key.
- [x] Criado módulo de uso servidor.
- [x] Nenhuma service-role/secret é referenciada em código cliente.
- [x] Variáveis obrigatórias são validadas com mensagem de erro clara.
- [x] `.env*` continua ignorado pelo Git conforme política.
- [x] Inicialização não persiste sessão de um usuário entre requests.
- [x] Código passa TypeScript e lint.

## Resultado gerencial

**SB-005 atende integralmente ao DoD.**

O PR #28 está liberado para sair de draft e ser mergeado em `main`. Após confirmação do merge, o cartão Trello pode ser movido para `Concluído`.

**Próximo card dependente:** [SB-006][P0] Definir contrato da camada de repositórios.
