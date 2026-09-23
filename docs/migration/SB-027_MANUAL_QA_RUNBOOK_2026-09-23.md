# SB-027 — Roteiro manual de QA local

**Data:** 23/09/2026  
**Branch:** `feat/sb-027-async-storefront-20260923`  
**Objetivo:** produzir as evidências ainda faltantes do SB-027 sem GitHub Actions e sem alterar o estado comercial do Supabase.

> Este roteiro é somente de leitura/teste. Não publique produtos, não altere RLS, não aplique migrations e não execute cutover.

## Pré-requisitos

- Node.js compatível com o projeto (`>=22.13.0`).
- npm 10.x.
- Git.
- acesso ao repositório `b-bonfim/vektua-xyz`.
- arquivo local de ambiente com:
  - `NEXT_PUBLIC_SUPABASE_URL`;
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- nunca colocar secret/service-role no frontend ou neste roteiro.

## 1. Obter a branch

No terminal:

```bash
git fetch origin
git checkout feat/sb-027-async-storefront-20260923
git pull --ff-only
git rev-parse HEAD
git status --short
```

Registre o SHA. O working tree deve estar limpo antes dos testes.

## 2. Instalação e verificações estáticas

```bash
npm ci
node scripts/tests/async-storefront-contract.mjs
npm run lint
npx tsc --noEmit
```

Resultado esperado do contrato:

```text
SB027_ASYNC_STOREFRONT_CONTRACT_PASS
```

Se qualquer comando falhar, **pare e registre a saída**. Não marque o card concluído.

## 3. Smoke — modo estático

### Windows CMD — terminal 1

```bat
set CATALOG_SOURCE=static
npm run dev
```

### PowerShell — terminal 1

```powershell
$env:CATALOG_SOURCE="static"
npm run dev
```

Mantenha o servidor aberto.

### Terminal 2

Ajuste a porta caso o terminal 1 informe outra.

**CMD:**

```bat
set BASE_URL=http://127.0.0.1:5173/
set CATALOG_SOURCE_EXPECTED=static
set QA_OUTPUT=qa-artifacts\sb027-static.json
node scripts/tests/async-storefront-http-smoke.mjs
```

**PowerShell:**

```powershell
$env:BASE_URL="http://127.0.0.1:5173/"
$env:CATALOG_SOURCE_EXPECTED="static"
$env:QA_OUTPUT="qa-artifacts/sb027-static.json"
node scripts/tests/async-storefront-http-smoke.mjs
```

Resultado esperado:

```text
SB027_HTTP_SMOKE_PASS source=static
```

## 4. Smoke — modo Supabase

Encerre o servidor anterior. Garanta que as variáveis públicas do Supabase estejam disponíveis localmente.

### Terminal 1

**CMD:**

```bat
set CATALOG_SOURCE=supabase
npm run dev
```

**PowerShell:**

```powershell
$env:CATALOG_SOURCE="supabase"
npm run dev
```

### Terminal 2

**CMD:**

```bat
set BASE_URL=http://127.0.0.1:5173/
set CATALOG_SOURCE_EXPECTED=supabase
set QA_OUTPUT=qa-artifacts\sb027-supabase.json
node scripts/tests/async-storefront-http-smoke.mjs
```

**PowerShell:**

```powershell
$env:BASE_URL="http://127.0.0.1:5173/"
$env:CATALOG_SOURCE_EXPECTED="supabase"
$env:QA_OUTPUT="qa-artifacts/sb027-supabase.json"
node scripts/tests/async-storefront-http-smoke.mjs
```

## 5. Resultado esperado hoje no projeto de produção

Em 23/09/2026 o banco foi verificado com:

- 30 produtos `draft/hidden`;
- 0 produtos `published/public`;
- 4 linhas ativas.

Logo, **o smoke Supabase deverá falhar nas asserções que exigem os produtos previstos**, a menos que exista um ambiente/dataset de QA separado e autorizado com registros publicáveis equivalentes.

Essa falha é um bloqueio de evidência esperado, não motivo para alterar os 30 produtos de produção.

## 6. O que NÃO fazer para “forçar PASS”

Não:

- mudar `draft/hidden` para `published/public` apenas para testar;
- usar service-role no browser;
- desabilitar RLS;
- fazer fallback silencioso para catálogo estático quando `CATALOG_SOURCE=supabase`;
- editar copy/preço para contornar teste;
- acionar GitHub Actions;
- fazer cutover no ambiente alvo.

## 7. Como concluir corretamente

Há duas rotas seguras:

1. **Ambiente/dataset de QA autorizado:** usar um projeto/branch de teste com dados equivalentes e status publicável, executar o mesmo smoke nos dois modos e anexar os dois logs.
2. **Após o gate apropriado de publicação/cutover:** quando o estado comercial real puder ser promovido legitimamente, executar o smoke Supabase no candidato autorizado.

Em ambos os casos, registrar:
- SHA testado;
- ambiente;
- `CATALOG_SOURCE`;
- log do contrato;
- lint/TypeScript;
- JSON do smoke;
- qualquer divergência observada.

Somente então mover SB-027 para **Concluído**.
