# SB-009 — Variantes opcionais e preços por canal

**Data:** 22/09/2026 · **Card:** `[SB-009][P0] Modelar variantes e preços`  
**Projeto:** `tbffwwjqkusiupahjqux` · **Dependência:** SB-008 (`products`) concluída.  
**Status técnico:** schema aplicado no Supabase; este documento NÃO aprova nenhum preço comercial, SKU ou lançamento.  
**Migrations:** `20260922191916_sb_009_model_variants_prices.sql` e forward-fix `20260922191959_sb_009_index_variant_product_fk.sql`.  
**Restrição:** nenhum GitHub Actions foi utilizado; nenhuma integração do storefront ou portal admin foi alterada.

## Entidades

### `public.product_variants`

- `id` UUID, PK; `product_id` UUID obrigatório e FK restritiva → `products(id)`.
- `variant_sku` obrigatório/único (não vazio); `label` opcional.
- `options` JSONB obrigatório, objeto não vazio: atributos explícitos como `{"cor":"preto","tamanho":"P"}`. Um produto **sem variantes tem zero linhas** nesta tabela: variante não é exigida por FK no produto.
- Unicidade `(product_id, options)` para evitar opções duplicadas; unicidade adicional `(id, product_id)` sustenta a FK composta dos preços.
- `status` default `draft`, valores `draft|active|inactive`; `created_at`, `updated_at` com ordem validada. O status não é evidência de aprovação comercial.

### `public.product_prices`

- `id` UUID PK, `product_id` UUID obrigatório e FK → produto.
- `variant_id` UUID opcional. `NULL` identifica preço do produto-base; quando preenchido, FK **composta** `(variant_id, product_id)` impede associar uma variante ao produto errado.
- `channel_code` obrigatório, aberto a códigos snake_case (`site`, `mercado_livre`, `shopee` etc.), sem criar cópia de `products` por canal.
- `currency_code` obrigatório, três letras maiúsculas; **sem moeda presumida/default**. Validar suporte real à moeda no consumidor futuro.
- `sale_unit` obrigatória (`unidade`, `kit`, etc.), sem inferi-la da descrição.
- `amount numeric(12,2)` anulável e **sem default**: preço ainda desconhecido = `NULL`, nunca `0`. A constraint rejeita valores zero/negativos.
- `status` default `draft` (`draft|active|inactive`); `active` requer `amount NOT NULL`, mas não substitui autorização do Founder ou gates.
- Índice único parcial `(product_id,channel_code)` com `variant_id IS NULL`; índice único parcial `(variant_id,channel_code)` com `variant_id IS NOT NULL`. Assim, há um preço-base e um preço por variante/canal, sem duplicação silenciosa.
- Índices de relacionamento: `product_id` e `(variant_id,product_id)` para a FK composta; o segundo foi incluído em migration complementar após finding INFO do Performance Advisor.

## Regra de leitura para integração futura

Não há fallback automático de preço de variante para produto-base, nem vice-versa. Se houver variante escolhida, o frontend/backend deverá buscar o preço explícito daquela variante e do canal efetivo. Ausência de registro, `amount IS NULL`, preço sem autorização documentada, ou status incompatível => **não mostrar preço como zero nem gerar pedido com preço inferido**. A decisão de qual preço exibir e os gates/permits serão tratados na integração do site/portal admin e nos cartões de RLS e precificação.

Consulta estrutural ilustrativa (somente leitura; não garante aprovação):

```sql
select p.sku, v.variant_sku, pr.channel_code, pr.currency_code,
       pr.sale_unit, pr.amount, pr.status
from public.products p
left join public.product_variants v on v.product_id = p.id
left join public.product_prices pr on pr.product_id = p.id
 and pr.variant_id is not distinct from v.id
 and pr.channel_code = 'site'
where p.sku = 'SKU-FICTICIO-NÃO-CADASTRADO';
```

A consulta é apenas uma ilustração de junção. Não cria SKU ou preço. O contrato comercial deve verificar autorização e demais gates fora desta consulta.

## Casos de aceite sem seed

| Caso | Estrutura esperada |
|---|---|
| Produto simples | Linha em `products`, nenhuma em `product_variants`, preço opcional por `product_prices.variant_id IS NULL`. |
| Produto com cores/tamanhos | Duas ou mais variantes do mesmo `product_id` e `options` distintas; cada uma pode ter preço específico por canal. |
| Dois canais | Dois registros de preço referenciam mesmo produto ou variante, mas `channel_code` difere. |
| Mesmo preço-base/canal duplicado | Rejeição pelo índice único parcial de preço-base. |
| Mesma variante/canal duplicada | Rejeição pelo índice único parcial de variante. |
| Variante de outro produto | Rejeição pela FK composta. |
| Ausência de preço | Nenhuma linha ou `amount NULL`; não vira zero. |
| Zero / negativo | Constraint `product_prices_amount_positive_when_present` rejeita. |
| Draft sem preço | Permitido; `active` com preço ausente é rejeitado pela constraint. |
| Seed fictício | Não existe neste card nem nas migrations. |

A validação por SELECT de metadados, índices, constraints e expressão de teste foi executada no projeto remoto; não foi realizado teste de INSERT/ROLLBACK nem teste ponta a ponta do site. Ver relatório `docs/SB-009_VARIANTS_PRICES_EVIDENCE.md`.

## Segurança e governança

- RLS das duas novas tabelas habilitada na própria migration; privilégios de `anon` e `authenticated` revogados explicitamente. Policies/grants definitivos dependem do **SB-012**; não inventar acesso administrativo por `TO authenticated` indiscriminado.
- Nenhum dado sensível, credencial, cliente, produto, preço real ou aprovação foi inserido.
- Criação de produto/preço, eventual promoção de `draft` a `active`, auditoria de alterações e controle de acesso do admin exigem fluxo autorizado futuro; `status` por si só não prova Founder Gate.
- A modelagem não constitui método financeiro, impostos, custos ou preço aprovado. Finance/Founder são donos da validação econômica/comercial futura.
- As fontes de negócio vigentes são o Master Product Dossier v1.1 e o PRD v1.1, com **quatro linhas e meta 01/10/2026**. Os playbooks do Board v1.0 ainda citam três linhas/meta 16/10; são histórico neste tema, não foram reescritos por este card.

## Forward-fix e limites

Migrations aplicadas são imutáveis. Ajustes futuros devem ser migration incremental, preferencialmente antes de seed/cutover; não remover tabelas para 'rollback' em ambiente compartilhado. Banco está sem registros de catálogo; não houve alteração do storefront. O Performance Advisor inicialmente sinalizou FK composta sem índice; a migration `20260922191959` resolveu o alerta específico. Restam INFO por índices não utilizados em tabelas vazias. Security Advisor aponta RLS sem policies, previsto para SB-012: não expor API até testes de policies.
