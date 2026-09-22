# SB-007 — Modelo canônico `product_lines`

**Data:** 22/09/2026  
**Card:** [SB-007][P0] Modelar `product_lines`  
**Projeto Supabase:** `tbffwwjqkusiupahjqux` — Vektua XYZ  
**Migration remota:** `20260922185539_sb_007_create_product_lines`  
**Status:** IMPLEMENTADO NO SUPABASE; integração GitHub em andamento nesta branch.  
**Restrição:** GitHub Actions não utilizado.

## Objetivo

Representar linhas comerciais por dados persistidos, sem enum rígido de linhas acoplado ao código da aplicação.

O card não migra o catálogo e não cria registros de linhas. O preenchimento de dados pertence à fase de migração/reconciliação posterior.

## Schema

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `slug` | `text` | obrigatório, único, lowercase/kebab-case |
| `name` | `text` | obrigatório e não vazio |
| `description` | `text` | opcional |
| `position` | `integer` | obrigatório, >= 0; ordenação explícita |
| `status` | `text` | obrigatório, default `active`; `active|inactive` |

Índice adicional: `product_lines_position_idx(position, slug)`.

## Decisões de modelagem

- UUID fornece ID estável e desacoplado da ordem.
- `slug` é a chave pública legível e única.
- `position` não possui default: toda linha precisa declarar a ordem explicitamente.
- `status` permite desativar uma linha sem exclusão física ou perda de histórico.
- A lista de linhas comerciais não é um enum no código; futuras linhas podem ser cadastradas como registros.
- O status usa constraint simples `active|inactive` porque o requisito deste card é apenas ativação/desativação.
- RLS é habilitado nesta migration.
- Grants e policies públicas são deliberadamente adiados ao SB-012, que possui testes positivos/negativos próprios.
- Nenhum seed foi aplicado neste card.

## Estratégia de reaplicação

A migration usa `CREATE TABLE` sem `IF NOT EXISTS`. No fluxo normal, a migration history impede reaplicação. Se o SQL for executado fora desse fluxo sobre schema já existente, PostgreSQL falha por objeto existente em vez de aceitar silenciosamente um schema divergente.

## Forward-fix / rollback

Após aplicada em ambiente compartilhado, a migration é imutável. Correções devem usar migration nova. Como a tabela foi criada vazia e ainda não é consumida pelo storefront, eventual reversão operacional antes de dependências futuras deve ser decidida como migration corretiva explícita, não por edição do arquivo histórico.
