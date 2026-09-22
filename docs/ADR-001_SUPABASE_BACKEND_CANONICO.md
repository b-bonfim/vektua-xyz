# ADR-001 — Supabase como backend canônico da Vektua XYZ

**Status da decisão:** ACCEPTED / APROVADO PELO FOUNDER  
**Data:** 2026-09-22  
**Card:** `[SB-002][P0] Formalizar ADR — Supabase como backend canônico`  
**Repositório:** `b-bonfim/vektua-xyz`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux` — Vektua XYZ, `sa-east-1`  
**Dependência comprovada:** SB-001 concluído; baseline em `docs/SUPABASE_MIGRATION_BASELINE_2026-09-22.md`  
**Regra de execução:** GitHub Actions não será utilizado nesta migração.

> **Distinção de estado:** esta ADR aprova o **Supabase como backend canônico de destino** da arquitetura. Ela **não declara cutover operacional realizado**. Até os gates de integração/cutover, o storefront continua usando a fonte estática vigente. A confirmação pós-cutover de Supabase como fonte operacional vigente permanece para SB-037.

## 1. Contexto

O baseline SB-001 confirmou que:

- o catálogo/storefront atual é sustentado por arquivos TypeScript/estáticos;
- `db/index.ts` aponta para Cloudflare D1 via Drizzle;
- `db/schema.ts` não contém schema de negócio;
- o fluxo de carrinho permanece no cliente e o pedido é encaminhado por WhatsApp;
- pagamento online no site está fora do escopo atual;
- o projeto Supabase Vektua XYZ está ativo e saudável;
- no snapshot e na reconfirmação de 2026-09-22, o Supabase possui **0 tabelas no schema `public`**, **0 migrations**, **0 buckets** e **0 Edge Functions**.

O projeto precisa migrar o backend do storefront para uma base relacional que também suporte, futuramente, um Portal Admin para gestão de catálogo e mídia, sem quebrar o site atual e sem criar duas fontes de verdade permanentes.

## 2. Decisão

Adotar **PostgreSQL/Supabase como backend canônico de destino** para o storefront e para o futuro Portal Admin, com migração incremental, versionada e reversível.

### 2.1. PostgreSQL/Supabase como fonte canônica

Após o cutover autorizado, dados de aplicação pertencentes ao escopo desta migração terão PostgreSQL/Supabase como fonte canônica.

O catálogo estático atual permanece disponível como **fallback de rollback** durante a janela de migração e estabilização; ele não será promovido em paralelo como segunda fonte canônica.

### 2.2. Supabase Storage

Usar Supabase Storage com separação explícita de finalidade:

- **mídia pública:** ativos publicados do catálogo que podem ser entregues anonimamente pelo storefront;
- **dados privados:** referências de clientes e demais arquivos que não podem ser públicos, sempre em bucket privado e sujeitos a autorização/RLS apropriadas.

O fato de uma mídia ser armazenada no Supabase não altera regras de proveniência, direitos, privacidade ou aprovação comercial.

### 2.3. Auth + RLS como base do Portal Admin

O futuro Portal Admin utilizará **Supabase Auth + Row Level Security (RLS)** como base de autenticação/autorização.

Regras mínimas:

- nenhuma `service_role`/secret key no browser;
- cliente público usa somente URL + chave publicável apropriada;
- tabelas expostas à Data API terão grants mínimos e RLS habilitado;
- políticas devem autorizar o usuário/escopo correto, não apenas testar se o papel é `authenticated`;
- Storage privado será protegido por políticas em `storage.objects`;
- qualquer acesso privilegiado futuro deverá permanecer server-side e ser explicitamente justificado.

### 2.4. Application / Repository Layer

A UI não deve depender diretamente do mecanismo de persistência.

Será criada uma **camada de aplicação/repositórios** entre componentes/rotas e as fontes de dados, permitindo:

- implementação estática atual;
- implementação Supabase;
- seleção controlada da fonte durante a migração;
- testes e rollback sem reescrever os componentes do storefront.

A interface do repositório deve expressar operações de domínio; detalhes do SDK Supabase ficam encapsulados no adapter correspondente.

### 2.5. D1 não será expandido em paralelo

Cloudflare D1/Drizzle é legado do baseline e **não receberá novo schema de negócio nem expansão funcional** durante esta migração.

Arquivos/integrações D1 existentes só podem permanecer temporariamente para compatibilidade até sua retirada segura. Não haverá arquitetura com D1 e Supabase como backends canônicos concorrentes.

### 2.6. Carrinho e WhatsApp ficam desacoplados do cutover inicial

O fluxo protegido permanece:

`catálogo → carrinho no cliente → geração de mensagem → WhatsApp`.

O carrinho e o envio de pedido via WhatsApp **não dependem da conclusão do cutover do backend** e devem continuar funcionais durante toda a migração.

Persistência de pedidos, checkout/pagamento online ou automação do WhatsApp não são criados por esta ADR.

### 2.7. Migração incremental e reversível

A sequência arquitetural é:

1. manter storefront atual funcional;
2. introduzir dependências/clientes Supabase sem alterar a fonte exibida;
3. criar schema, migrations, RLS e Storage;
4. migrar/reconciliar dados;
5. implementar repository adapter Supabase;
6. operar dual-source **controlado por configuração**, nunca como dupla fonte de verdade;
7. executar QA, segurança e rollback;
8. obter Founder Gate de cutover;
9. trocar o storefront para Supabase;
10. estabilizar antes de remover o fallback.

## 3. Rollback

O rollback obrigatório do storefront será **voltar a leitura para o catálogo estático conhecido**.

Requisitos do rollback:

- uma configuração de fonte (`static | supabase`) deverá existir antes do cutover;
- arquivos estáticos de catálogo e mídia necessários ao fallback **não serão apagados** no mesmo card do cutover;
- o rollback deve ser testado antes do Gate S6;
- falha crítica de catálogo/mídia após o cutover aciona retorno para `static`;
- durante fallback, alterações administrativas no Supabase não devem ser tratadas como sincronizadas automaticamente com o catálogo estático;
- remoção definitiva do legado só pode ser avaliada após a janela de estabilização e evidência específica.

Esta ADR define o contrato de rollback; sua implementação e teste pertencem aos cards posteriores da L99.

## 4. Alternativas consideradas

### A. Permanecer em catálogo estático
**Rejeitada como arquitetura final.** É simples para leitura pública, mas não atende adequadamente ao Portal Admin, governança de mídia, persistência relacional e evolução operacional.

### B. Expandir Cloudflare D1/Drizzle
**Rejeitada para esta migração.** O baseline não possui schema de negócio D1 a preservar, e expandir D1 criaria investimento paralelo incompatível com a decisão de consolidar o backend no Supabase.

### C. Manter D1 e Supabase permanentemente como fontes equivalentes
**Rejeitada.** Duplica autoridade, exige sincronização bidirecional e aumenta o risco de divergência. Dual-source só é aceitável como mecanismo transitório e controlado.

### D. Criar backend custom/self-hosted separado
**Rejeitada para o estágio atual.** Aumenta superfície operacional, segurança e manutenção sem necessidade demonstrada para o storefront/admin planejados.

## 5. Consequências

### Positivas

- uma base relacional única para storefront e futuro Portal Admin;
- Storage, Auth e RLS disponíveis no mesmo ecossistema;
- menor acoplamento da UI graças à camada de repositórios;
- migração e rollback controláveis;
- elimina incentivo para expandir D1 em paralelo;
- prepara gestão de catálogo/mídia sem exigir que o Admin seja implementado agora.

### Custos e riscos

- exige disciplina de migrations, grants e RLS;
- exige separar corretamente conteúdo público e privado no Storage;
- exige reconciliação rigorosa antes do cutover;
- exige evitar exposição de chaves privilegiadas;
- exige manter fallback estático temporariamente, gerando custo de transição;
- qualquer Portal Admin futuro precisará de testes positivos e negativos de autorização, não apenas login funcional.

## 6. Restrições de segurança e implementação

A implementação seguirá a documentação vigente do Supabase:

- **Securing your API:** grants e RLS são camadas complementares; tabelas expostas precisam de RLS e privilégios mínimos.
- **Storage Access Control:** uploads/leitura privada dependem de políticas RLS em `storage.objects`; bucket público não autoriza upload por si só.
- chaves privilegiadas nunca serão versionadas nem expostas ao cliente.
- após alterações DDL relevantes, os Advisors de segurança e performance serão consultados conforme o protocolo a ser formalizado em SB-003.

Referências:
- https://supabase.com/docs/guides/api/securing-your-api
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control

## 7. Founder Gate

**Status:** `APROVADO`

**Evidência textual real:** em 2026-09-22, o Founder instruiu expressamente a continuidade da migração do backend para Supabase e solicitou a implementação do card **SB-002 — Formalizar ADR — Supabase como backend canônico**, incluindo atualização documental e conclusão do card após evidência.

**Limite da aprovação:** aprova esta decisão arquitetural e sua execução incremental. **Não equivale** a declarar schema criado, dados migrados, Portal Admin implementado, cutover executado, segurança testada ou lançamento liberado.

## 8. Matriz de aceite do SB-002

| DoD | Evidência nesta ADR | Resultado |
|---|---|---|
| Contexto, decisão, alternativas e consequências | §§ 1, 2, 4 e 5 | PASS |
| PostgreSQL/Supabase como fonte canônica | § 2.1 | PASS |
| Storage para mídia pública e dados privados | § 2.2 | PASS |
| Auth + RLS como base do Portal Admin | § 2.3 | PASS |
| Application/repository layer | § 2.4 | PASS |
| D1 não será expandido paralelamente | § 2.5 | PASS |
| Carrinho/WhatsApp não depende do cutover inicial | § 2.6 | PASS |
| Rollback para catálogo estático | § 3 | PASS |
| Founder Gate com evidência textual real | § 7 | PASS |

## 9. Evidências verificadas antes da decisão

- SB-001 no Trello: concluído em 2026-09-22.
- Baseline GitHub: commit `ea2f1026e59cc6242a295cf4d34403e5d13c00e8`.
- Supabase reconfirmado em 2026-09-22: projeto `ACTIVE_HEALTHY`, PostgreSQL 17; 0 tabelas `public`; 0 migrations; 0 buckets; 0 Edge Functions.
- GitHub Actions: não utilizados nesta execução.

## 10. Próximo passo

Executar **SB-003 — Definir protocolo de migrations, branches e evidências** antes de qualquer DDL de negócio.
