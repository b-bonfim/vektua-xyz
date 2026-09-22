# SB-012 — Contrato de segurança RLS do catálogo público

**Data:** 2026-09-22 · **Projeto:** `tbffwwjqkusiupahjqux` · **Status:** implementado no banco, restrito ao escopo SB-012.  
**Card:** https://trello.com/c/6uUc4ykr/69-sb-012p0-habilitar-rls-em-todas-as-tabelas-expostas  
**Migrations canônicas:** `20260922205646_sb_012_rls_public_catalog.sql` e `20260922205814_sb_012_rls_transactional_acceptance.sql`.

## Modelo de acesso

As seis tabelas de negócio em `public` usam RLS. `anon` e `authenticated` recebem exclusivamente SELECT por coluna e políticas de leitura de storefront; não têm INSERT/UPDATE/DELETE em nenhuma das seis tabelas. Autenticação comum não equivale a administrador. A escrita futura requer implementação própria em SB-013, autorização comprovada do operador, auditoria e acesso estritamente pelo servidor; nenhuma policy administrativa é criada neste card. Nunca expor `service_role`/secret no navegador.

| Tabela | Regra de leitura para visitante | Colunas com SELECT público |
|---|---|---|
| `product_lines` | Somente `status='active'`. | `id, slug, name, description, position, status` |
| `products` | `status='published'`, `visibility='public'` e linha ativa. Rascunho, `publishable`, suspenso, oculto, `unlisted` e linha inativa não são públicos. | `id, sku, slug, product_line_id, name, description, collection, category, personalized, status, visibility` |
| `product_variants` | `status='active'` e produto público elegível. | `id, product_id, variant_sku, label, options, status` |
| `product_prices` | `status='active'`, `amount>0`, `channel_code='site'`, produto público elegível e variante ativa quando presente. Outros canais não são expostos pelo catálogo do site. | `id, product_id, variant_id, channel_code, currency_code, sale_unit, amount, status` |
| `product_media` | `is_public=true`, `file_state='verified'`, `media_type='remix'`, bucket `product-media` e produto elegível. | `id, product_id, storage_bucket, storage_path, media_type, alt_text, gallery_position, is_primary` |
| `site_settings` | Policy preexistente do SB-011, `is_public=true`. | `key, value, value_type` |

**Privacidade de mídia:** `origin_reference`, `source_media_id`, `file_state` e campos de controle de `product_media` não podem ser selecionados pelo browser, mesmo quando a linha pública for visível. Uma referência `REMIX` publicada não prova objeto disponível: verificações e grants do Storage ficam em SB-016–SB-018, e teste ofensivo HTTP fica em SB-030. Até lá, não fazer cutover ou alegar imagens reais publicadas pelo Storage.

**Importante para implementação do storefront:** os grants são por coluna; `select('*')` pode retornar erro de permissão porque inclui colunas privadas. Em SB-023, selecionar explicitamente as colunas autorizadas e tratar ausência de preço/mídia sem inventar dados. O catálogo atual permanece sem seed e o site não foi alterado por esta migração.

**Invariantes comerciais:** `published/public` é uma condição técnica de leitura, não uma aprovação de SKU, licença, qualidade ou lançamento pelo Founder. Um admin futuro NÃO pode ser implementado concedendo escrita irrestrita a `authenticated` ou por ocultação de botões somente no frontend.

## Verificação, versionamento e recuperação

- O SB-012 foi aplicado por `Supabase.apply_migration` após inventário e revisão de política; a CLI não está disponível neste ambiente. A exceção `remoto primeiro → arquivo Git imediatamente após a versão remota` foi reconciliada com os dois arquivos de migration homônimos no repositório, sem editar migrations aplicadas; PR e merge constam do relatório de evidências.
- A migration transacional contém fixtures sintéticas, alterna para `anon`, exige SELECT positivo e isolamento de dados, confirma erros de escrita e de leitura de coluna privada, força rollback do subbloco e falha integralmente se qualquer assertiva falhar.
- Um novo requisito incompatível, uma policy equivocada ou drift deve ser corrigido com **nova migration de forward-fix**; nunca editar ou apagar uma migration já aplicada em ambiente compartilhado. Como contenção, manter a integração do frontend suspensa e revogar o grant público problemático com nova migration revisada. Não remover RLS para corrigir erro de acesso.
- Não foram usados GitHub Actions, deploy do site, publicação comercial, credenciais no Git nem serviços pagos.

## Fontes técnicas

- Supabase: https://supabase.com/docs/guides/database/postgres/row-level-security
- Protocolo do projeto: `docs/SUPABASE_MIGRATION_PROTOCOL.md`
- Evidências e limites: `docs/SB-012_RLS_EVIDENCE.md`
