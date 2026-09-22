# Supabase migrations

Este é o diretório canônico de migrations do backend Supabase da Vektua XYZ.

## Regra de criação

Crie migrations com a Supabase CLI:

```bash
supabase migration new sb_<card>_<descricao_curta>
```

O CLI gera o timestamp e o arquivo SQL. Não invente manualmente o prefixo temporal.

## Governança

- toda DDL de produto destinada ao Supabase deve ser versionada aqui;
- uma migration aplicada em ambiente compartilhado é imutável;
- correções usam nova migration;
- não aplicar DDL remoto por SQL ad hoc sem migration correspondente;
- após DDL remoto, registrar Security Advisors e Performance Advisors;
- atualizar `lib/supabase/database.types.ts` quando o schema exposto mudar;
- registrar branch, commit, teste e estratégia de forward-fix/rollback no card;
- GitHub Actions não é utilizado neste fluxo.

Runbook completo: [docs/SUPABASE_MIGRATION_PROTOCOL.md](../../docs/SUPABASE_MIGRATION_PROTOCOL.md)
