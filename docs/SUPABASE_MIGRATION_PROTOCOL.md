# SB-003 — Protocolo de migrations, branches e evidências

**Status:** protocolo operacional vigente para a migração do backend da Vektua XYZ  
**Data:** 2026-09-22  
**Card:** `[SB-003][P0] Definir protocolo de migrations, branches e evidências`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux`  
**Repositório:** `b-bonfim/vektua-xyz`  
**Dependência:** ADR-001 / SB-002 aprovado e versionado  
**Regra fixa:** GitHub Actions **não** faz parte deste fluxo.

> Este documento define governança e rastreabilidade. Ele não cria schema de negócio, não executa cutover e não substitui os DoD dos cards de modelagem, RLS, Storage, seed ou integração.

## 1. Diretório canônico de migrations

O diretório canônico é:

```text
supabase/migrations/
```

Toda alteração DDL de negócio destinada ao Supabase deve existir nesse diretório antes de ser considerada pronta para aplicação em ambiente compartilhado.

Regras:
- migrations já aplicadas em ambiente compartilhado são **imutáveis**;
- não editar, renomear ou apagar migration já registrada no histórico remoto;
- qualquer correção posterior gera **nova migration**;
- o histórico remoto deve ser comparável com os arquivos versionados no Git;
- SQL de verificação/leitura pode ser executado fora de migration, desde que não altere schema.

## 2. Convenção de nome

A migration deve ser criada pelo Supabase CLI, nunca por timestamp inventado manualmente:

```bash
supabase migration new <nome_em_snake_case>
```

Padrão do nome lógico:

```text
sb_<numero_do_card>_<descricao_curta>
```

Exemplo:

```text
sb_007_product_lines
```

O CLI gera um arquivo no formato:

```text
YYYYMMDDHHMMSS_sb_007_product_lines.sql
```

Antes de usar a CLI:
- registrar `supabase --version`;
- conferir `supabase --help` e o help do subcomando utilizado;
- não depender de sintaxe memorizada quando a versão instalada puder divergir.

## 3. Branches Git

Cada card que altera schema ou infraestrutura Supabase deve sair da `main` atualizada em uma branch dedicada.

Convenção:

```text
sb-<numero>-<slug>
```

Exemplos:

```text
sb-007-product-lines
sb-014-storage-buckets
sb-021-rls-admin
```

Fluxo:
1. sincronizar com a `main`;
2. criar a branch do card;
3. adicionar migration, tipos e evidências pertinentes;
4. revisar diff;
5. abrir PR para `main`;
6. aplicar migration ao ambiente compartilhado somente no ponto previsto pelo card;
7. registrar Advisors, testes e versão remota;
8. concluir o card apenas com evidência verificável.

Commit recomendado:

```text
db(sb-007): add product_lines migration
```

Mudanças documentais podem usar:

```text
docs(sb-003): define Supabase migration protocol
```

## 4. Branches de banco Supabase

Branches de banco Supabase **não são obrigatórias** para a L99.

Padrão atual:
- desenvolvimento de migration: ambiente local Supabase quando disponível;
- Git branch: obrigatória para alteração versionada;
- Supabase database branch: opcional para casos em que isolamento remoto trouxer benefício comprovado.

Como branches Supabase podem gerar custo, nenhuma branch de banco deve ser criada automaticamente. A criação exige:
1. necessidade técnica registrada;
2. custo consultado;
3. confirmação explícita do Founder;
4. evidência do branch ID/ref e vínculo com o card.

Este SB-003 não cria branch de banco.

## 5. Regra de DDL: migration primeiro

DDL de schema em ambiente compartilhado não pode nascer de SQL ad hoc sem registro.

Permitido:
- executar queries somente de leitura para inspeção;
- usar SQL temporário em banco local descartável durante experimentação;
- aplicar ao remoto o SQL **exato** de uma migration versionada e revisada;
- usar Supabase CLI ou MCP para aplicação controlada, desde que o arquivo versionado seja a fonte do DDL.

Não permitido:
- criar/alterar/drop de tabela, índice, constraint, policy, view, function ou trigger diretamente no remoto e encerrar o card sem migration correspondente;
- usar SQL Editor, `execute_sql` ou ferramenta equivalente como atalho permanente para DDL;
- editar migration já aplicada para “corrigir o histórico”.

Se ocorrer alteração remota excepcional antes do arquivo versionado, o card fica **BLOQUEADO** até:
1. capturar o drift em migration;
2. validar a reprodução a partir do histórico;
3. registrar causa, responsável e evidência da reconciliação.

## 6. Migration ↔ commit ↔ teste ↔ evidência

Toda migration deve ter um registro mínimo com:

| Campo | Obrigatório |
|---|---|
| Card | sim |
| Branch Git | sim |
| Base SHA da `main` | sim |
| Arquivo de migration | sim |
| Migration version remota | quando aplicada |
| Commit SHA | sim |
| PR/merge SHA | quando houver |
| Ambiente testado | sim |
| Comandos/testes executados | sim |
| Resultado | sim |
| Advisors security | após DDL remoto |
| Advisors performance | após DDL remoto |
| Arquivo de tipos atualizado | quando schema público mudar |
| Estratégia de rollback/forward-fix | sim |
| Data/hora | sim |

O card Trello deve apontar para esses artefatos e não apenas declarar “testado”.

### Modelo de evidência

```markdown
## Evidência — SB-XXX
- Branch:
- Base main SHA:
- Migration:
- Commit:
- PR:
- Merge SHA:
- Migration version remota:
- Ambiente:
- Testes:
- Security Advisors:
- Performance Advisors:
- TypeScript types:
- Estratégia de recuperação:
- Resultado:
- Executado em:
```

## 7. Teste mínimo de uma migration

Antes de aplicação remota, quando o ambiente local estiver disponível:
1. iniciar o ambiente local conforme documentação vigente;
2. reconstruir o banco a partir do histórico de migrations;
3. confirmar que a migration aplica em ordem;
4. executar testes específicos do card;
5. verificar constraints, RLS/policies e comportamento negativo quando aplicável;
6. revisar o SQL gerado/manual antes de commit.

Comandos exatos devem ser confirmados na versão instalada da CLI via `--help`. Nunca usar `db reset --linked` em produção.

Se ambiente local não estiver disponível, o card deve registrar a limitação e usar ambiente remoto controlado apenas quando o próprio card autorizar a aplicação.

## 8. Aplicação remota

A aplicação remota pode ocorrer por:
- Supabase CLI, usando o histórico local versionado; ou
- Supabase MCP `apply_migration`, usando o SQL exato do arquivo versionado.

Ao usar MCP:
- `apply_migration` é o caminho para DDL;
- `execute_sql` não deve ser usado para DDL do produto;
- o nome lógico da aplicação deve manter vínculo inequívoco com o card/migration;
- depois da aplicação, consultar o histórico de migrations e registrar a versão retornada.

Nenhuma credencial, access token, password ou service-role key entra no Git/Trello/evidência.

## 9. Rollback e forward-fix

Regra geral: **forward-fix é o padrão após migration aplicada em ambiente compartilhado**.

| Tipo de mudança | Estratégia |
|---|---|
| Adição compatível: tabela/coluna/index | nova migration de correção se necessário; evitar “down” destrutivo |
| Rename/drop/restrição incompatível | expand/contract em etapas; remoção só após consumidores migrarem |
| RLS/policy incorreta | nova migration de policy; corrigir imediatamente antes de liberar o card |
| View/function/trigger | nova migration restaurando versão conhecida ou corrigindo definição |
| Backfill/DML | script/migration com critério de reexecução e verificação; preservar backup quando destrutivo |
| Perda/corrupção de dados | interromper ação, preservar evidência e usar estratégia de restore aprovada; não improvisar DDL |

Regras:
- rollback nunca significa apagar migration já aplicada;
- reversão é uma **nova migration** quando tecnicamente segura;
- mudanças destrutivas exigem backup/restore plan explícito antes da execução;
- migration incompatível deve preferir estratégia expand → migrate → contract.

## 10. Tipos TypeScript

Caminho canônico planejado:

```text
lib/supabase/database.types.ts
```

Após alteração de schema que afete a API:
1. aplicar/reproduzir a migration no ambiente de referência;
2. gerar os tipos TypeScript com a ferramenta oficial;
3. revisar o diff;
4. versionar os tipos no mesmo PR/card da mudança de schema, salvo justificativa documentada;
5. após aplicação remota, regenerar/consultar tipos e confirmar ausência de drift inesperado.

Formas aceitas:
- Supabase CLI `gen types`, com parâmetros confirmados via `--help`; ou
- Supabase MCP `generate_typescript_types`.

A geração é manual/controlada neste projeto. **Não usar GitHub Actions para atualizar tipos.**

## 11. Advisors obrigatórios após DDL

Após cada DDL aplicado ao projeto compartilhado, consultar:

- Supabase Security Advisors;
- Supabase Performance Advisors.

Critério:
- finding de segurança material mantém o card aberto até correção ou decisão formal de risco dentro da governança aplicável;
- finding de performance deve ser corrigido quando pertinente ou registrado com justificativa técnica;
- “0 findings” também deve ser registrado como evidência;
- Advisors complementam testes; não substituem RLS, testes negativos nem revisão do SQL.

## 12. Protocolo sem GitHub Actions

Este fluxo não depende de GitHub Actions.

Ferramentas permitidas:
- Git branch/commit/PR/merge;
- Supabase CLI executada manualmente;
- Supabase MCP;
- testes locais;
- revisão manual de diff;
- Trello para rastreabilidade.

Não criar, ativar ou rerodar workflow de GitHub Actions para migrations, tipos, QA ou deploy desta L99.

## 13. Critério de conclusão de cards com DDL

Um card de DDL só pode ser marcado `CONCLUÍDO` quando, conforme seu escopo:
- migration está versionada;
- commit/PR estão identificados;
- teste exigido pelo card passou;
- aplicação remota, se prevista no card, está confirmada;
- migration remota está registrada;
- tipos estão atualizados quando aplicável;
- Security e Performance Advisors foram consultados após DDL remoto;
- rollback/forward-fix está descrito;
- Trello contém a evidência;
- nenhuma credencial foi exposta;
- GitHub Actions não foi usado.

## 14. Referências oficiais consultadas em 2026-09-22

- Supabase — Local Development & CLI: https://supabase.com/docs/guides/local-development
- Supabase — CLI / migrations: https://supabase.com/docs/reference/cli
- Supabase — Managing database migrations: documentação oficial vigente recuperada via Supabase Docs
- Supabase — Generating TypeScript Types: https://supabase.com/docs/guides/api/rest/generating-types
- Supabase — Advisors / Management API: documentação oficial vigente recuperada via Supabase Docs

A documentação oficial deve ser reconsultada antes de comandos sensíveis porque CLI e plataforma podem mudar.

## 15. Matriz de aceite do SB-003

| DoD | Evidência | Resultado |
|---|---|---|
| Diretório canônico definido | §1 + `supabase/migrations/README.md` | PASS |
| Convenção documentada | §2 | PASS |
| DDL usa migration versionada | §§5 e 8 | PASS |
| migration ↔ commit ↔ teste | §6 | PASS |
| rollback/forward-fix | §9 | PASS |
| tipos TypeScript | §10 | PASS |
| Advisors pós-DDL | §11 | PASS |
| sem GitHub Actions | §12 | PASS |
