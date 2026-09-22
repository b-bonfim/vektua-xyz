# SB-013 — ADR de papéis administrativos e fronteira de autorização

**Data:** 22/09/2026 · **Status:** modelo implementado no banco; autenticação e edição admin NÃO habilitadas.  
**Card:** https://trello.com/c/MZDjzn2C/70-sb-013p1-preparar-modelo-de-pap%C3%A9is-administrativos  
**Supabase:** `tbffwwjqkusiupahjqux` · **Dependência:** SB-012  
**Migration:** `supabase/migrations/20260922210907_sb_013_admin_role_foundation.sql`.

## Decisão de arquitetura — RBAC mínimo, fail closed

A identidade será autenticada futuramente pelo Supabase Auth, mas uma sessão `authenticated` isolada **não** torna alguém admin. A fonte de verdade de autorização é `app_private.admin_role_assignments`, tabela privada com `user_id` real referenciado em `auth.users`, um único papel por conta, `is_active=false` por padrão e `change_reference` obrigatório. Não se criam usuários nem atribuições por seed, domínio de e-mail, autoinscrição, `user_metadata` ou UI. A atribuição inicial exige decisão explícita do Founder, identificação de um usuário Auth real e operação privilegiada registrada; esses atos NÃO são realizados no SB-013.

O schema `app_private` não deve integrar os schemas expostos da Data API. As tabelas privadas têm RLS habilitado e nenhuma policy de browser. `anon` e `authenticated` não têm USAGE do schema, acesso às tabelas, nem EXECUTE da função de papéis. `app_private.has_admin_role(text[])` consulta `auth.uid()` + atribuição `is_active=true` na tabela, mas **não pode ainda ser invocada pelo navegador**. A implementação das policies de escrita e eventual concessão de EXECUTE/USAGE indispensável à avaliação de RLS demandará migration, revisão e testes próprios; não substituir por autorização somente no frontend, JWT desatualizado ou chave `service_role` exposta.

### Papéis e permissões FUTURAS (proposta; nenhuma ativa neste card)

| Papel | Escopo pretendido | Restrições |
|---|---|---|
| `founder` | Aprovação e administração operacional/atribuição de acesso mediante procedimento auditável | Aprovação empresarial não substitui licença, segurança ou gate técnico; nenhuma atribuição automática. |
| `admin` | Gerir operação autorizada e usuários conforme política futura | Não promove a si próprio nem concede `founder`; acesso a papéis requer fluxo separado e aprovação. |
| `catalog_editor` | Preparar conteúdo, mídias e rascunhos do catálogo | Sem publicação, mudança de preço crítico, alteração de papéis ou aprovação de gates por padrão. |
| `operations` | Operar fila, atendimento e estados logísticos habilitados futuramente | Sem edição de papéis, preços ou liberação comercial automática. |
| `viewer` | Consultar relatórios e dados administrativos explicitamente autorizados | Somente leitura, com minimização de dados pessoais. |

**Autorização efetiva por ação:** a futura rota/handler deve verificar identidade válida no servidor, buscar a função do usuário atual em fonte confiável e aplicar autorização de menor privilégio na operação e RLS. Para operações privilegiadas com `service_role`, servidor dedicado deve verificar papel/permissão ANTES de agir; `service_role` ignora RLS e nunca entra em `NEXT_PUBLIC_*`, cliente, Git, logs ou Trello. A UI poderá ocultar controles, mas não é barreira de segurança. Negar acesso na ausência de sessão, atribuição, status ativo, papel permitido ou estado de aprovação do objeto.

## Estrutura implantada e trilha

- `app_private.admin_role_assignments`: `user_id` FK para `auth.users` (remoção em cascata), `role` com CHECK de cinco valores, `is_active=false`, referência da decisão e timestamps. Nenhuma linha inicial.
- `app_private.admin_role_audit`: eventos INSERT/UPDATE/DELETE com papéis/status antigos e novos, referência, `auth.uid()` quando houver contexto e `session_user`, horário. Trigger `admin_role_change_audit` automatiza eventos e `updated_at`. Nenhuma linha inicial.
- `app_private.has_admin_role(text[])`: função interna `SECURITY DEFINER`, `search_path` vazio, somente verifica a própria identidade e atribuição ativa. Nenhum grant de EXECUTE a roles do browser; não há policies de escrita admin ou Auth Hook.

A trilha é **auditabilidade operacional, não ledger legal imutável**: owner/superusuário do banco pode contornar controles; ações pelo SQL Editor podem registrar `actor_auth_uid=NULL` e `session_user` técnico. Operação real futura deve complementar com registro do aprovador, ticket e logs confiáveis. Revogação deverá desativar `is_active` e revalidar no servidor a cada operação; nunca depender só de claim JWT possivelmente desatualizada. `ON DELETE CASCADE` remove atribuição na exclusão do usuário; a auditoria conserva o UUID técnico para rastreabilidade, sujeito à política de retenção/privacidade a definir.

## Separação de cards, controles e recuperação

SB-013 implementa somente o modelo. **SB-014:** login/logout e proteção dinâmica `/admin` sem cache compartilhado; identidade e recusa de acesso direto a URL. Cards posteriores: policies administrativas granulares com testes positivos/negativos, provisionamento do primeiro operador real, trilha de mudanças de catálogo/critical settings e revisão de privacidade; SB-016–018 tratam Storage, SB-023 integração, SB-030 testes ofensivos HTTP. Os grants públicos somente de leitura do SB-012 permanecem intactos; `authenticated` não tem escrita no catálogo.

Para desvio, conter o acesso administrativo e gerar **nova migration de forward-fix**; nunca editar esta migration após aplicada nem remover RLS. A migration remota foi aplicada antes da criação do arquivo Git devido à ausência de CLI e o nome de arquivo foi reconciliado imediatamente com o version retornado pelo Supabase. Rebuild local/paridade automatizada não foram comprovados; dependem de ambiente local com CLI e conferência controlada antes de cutover. GitHub Actions não foi utilizado.

**Fontes:** `docs/SUPABASE_MIGRATION_PROTOCOL.md`, `docs/SB-012_RLS_POLICY.md`, documentação Supabase de RLS e RBAC: https://supabase.com/docs/guides/database/postgres/row-level-security e https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac .
