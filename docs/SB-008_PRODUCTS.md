# SB-008 — Modelo canônico `products`

**Data:** 22/09/2026  
**Card:** [SB-008][P0] Modelar `products`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux` — Vektua XYZ  
**Migration remota:** `20260922190558_sb_008_create_products`  
**Status:** IMPLEMENTADO NO SUPABASE; integração GitHub nesta branch.  
**Restrição:** GitHub Actions não utilizado.

## Objetivo

Criar a entidade canônica de produto/SKU e seu estado de aplicação, vinculada à linha comercial primária definida em SB-007.

Este card não migra o catálogo atual, não cria preços/variantes/mídias e não publica produtos. Seeds e reconciliação pertencem aos cartões posteriores da L99.

## Schema

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `sku` | `text` | obrigatório, único, não vazio |
| `slug` | `text` | obrigatório, único, lowercase/kebab-case, não vazio |
| `product_line_id` | `uuid` | obrigatório, FK → `product_lines.id`, RESTRICT em update/delete |
| `name` | `text` | obrigatório e não vazio |
| `description` | `text` | opcional; se presente, não vazio |
| `collection` | `text` | opcional; se presente, não vazio |
| `category` | `text` | opcional; se presente, não vazio |
| `personalized` | `boolean` | obrigatório, default `false` |
| `status` | `text` | `draft|publishable|published|suspended`; default `draft` |
| `visibility` | `text` | `hidden|public|unlisted`; default `hidden` |
| `created_at` | `timestamptz` | obrigatório, default `now()` |
| `updated_at` | `timestamptz` | obrigatório, default `now()`; >= `created_at` |

## Índices

- `products_pkey(id)` — criado pela PK.
- `products_sku_key(sku)` — criado pela constraint UNIQUE.
- `products_slug_key(slug)` — criado pela constraint UNIQUE.
- `products_product_line_id_idx(product_line_id)` — FK e consultas por linha.
- `products_status_idx(status)` — filtros de ciclo de vida.

Não foi criado índice isolado de `visibility`: a cardinalidade é baixa e o padrão real de consulta ainda não foi medido. Reavaliar quando o adapter Supabase e dados reais existirem.

## Decisões de modelagem

- `sku` e `slug` são chaves naturais de busca, mas `id` UUID é a identidade técnica estável.
- `product_line_id` é obrigatório e impede apagar uma linha que ainda possui produtos vinculados.
- `status` representa **estado da aplicação**, não aprovação comercial, Founder Gate, parecer de Quality, direitos, preço ou prontidão de lançamento.
- Retirada de produto ocorre por transição para `suspended`/visibilidade adequada; exclusão física não é o mecanismo operacional padrão.
- `visibility` é separada de `status` para não confundir intenção de exibição com ciclo de vida.
- `collection` e `category` permanecem opcionais e desnormalizadas nesta etapa; entidades próprias só serão justificadas por necessidade real.
- RLS já nasce habilitado. Policies e grants públicos ficam no SB-012, que exige testes positivos e negativos.
- A migration revoga privilégios de `anon` e `authenticated` explicitamente para evitar exposição antes do SB-012.
- Nenhum seed foi aplicado.

## Timestamps

`created_at` e `updated_at` existem desde a criação. Este card não cria trigger genérico para `updated_at`; a manutenção automática deve ser introduzida apenas por migration própria quando houver consumidor administrativo que justifique a regra.

## Estratégia de reaplicação

A migration usa `CREATE TABLE` sem `IF NOT EXISTS`. No fluxo normal, a history do Supabase impede reaplicação. Execução manual sobre schema existente falha em vez de mascarar drift.

## Forward-fix / rollback

Após aplicada no ambiente compartilhado, a migration é imutável. Correções usam nova migration. Como `products` foi criada vazia e o storefront ainda consome catálogo estático, eventual ajuste estrutural deve usar forward-fix antes de qualquer seed/cutover.
