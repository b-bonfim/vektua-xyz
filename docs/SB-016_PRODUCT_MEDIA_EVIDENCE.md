# SB-016 — Evidências verificadas e DoD

**Projeto:** `tbffwwjqkusiupahjqux` (Vektua XYZ)  
**Card:** https://trello.com/c/yFi2Gv90  
**Data/hora da criação remota:** 2026-09-23 01:01:53 UTC = 22/09/2026 22:01:53 BRT  
**Owner:** Engineering; registro/coordenação: VP  
**Migração:** `20260923010153_sb_016_create_public_product_media_bucket`  
**Branch:** `sb-016-product-media-bucket` (base `main` `b17dbb1ff6b1a352801b75bb02ac4de99f461700`)  
**PR:** https://github.com/b-bonfim/vektua-xyz/pull/38  
**Migration file:** `supabase/migrations/20260923010153_sb_016_create_public_product_media_bucket.sql`  
**Contract:** `docs/SB-016_PRODUCT_MEDIA_BUCKET.md`

## 1. Ação remota comprovada

`Supabase.apply_migration` retornou `success:true` para `sb_016_create_public_product_media_bucket`. `Supabase.list_migrations` confirmou versão `20260923010153` com o mesmo nome. Consulta posterior:

```json
{"id":"product-media","name":"product-media","public":true,"file_size_limit":10485760,"allowed_mime_types":["image/jpeg","image/png","image/webp"],"created_at":"2026-09-23 01:01:53.833887+00"}
```

SQL adicional: `storage.objects` tem RLS ativado; `storage.objects` possui **0 policies de qualquer comando**, inclusive **0 policies de escrita**. `anon`/`authenticated` possuem privilégio de tabela `INSERT` no schema gerenciado, porém **RLS sem policy nega a operação**; não confundir table GRANT com autorização RLS. Zero objetos no bucket e zero linhas `public.product_media` apontando para ele no momento da inspeção. Nenhum upload ou mutação de objeto foi tentado diretamente por SQL (a documentação da plataforma recomenda API para objetos).

## 2. Matriz DoD

| DoD do cartão | Estado e evidência | Limite |
|---|---|---|
| Bucket criado com nome canônico | **PASS (configuração)**: registro persistido em `storage.buckets` com `id=name='product-media'`. | Nenhum arquivo incluído. |
| Convenção `{sku}/...` | **PASS (contrato documental)**: `docs/SB-016_PRODUCT_MEDIA_BUCKET.md`, ex. `G-CHV-ALI-01/G-CHV-ALI-01_REMIX.png`. | Conformidade de cada upload será conferida na ingestão. |
| MIME aceitos documentados | **PASS (configuração/documentação)**: JPEG/PNG/WebP, máximo 10 MiB. | Não houve tentativa de upload fora do limite. |
| Política de escrita pública inexistente | **PASS (configuração)**: RLS true; zero policies `storage.objects`, inclusive INSERT/UPDATE/DELETE/ALL. | Operadores privilegiados/service role ultrapassam RLS; segredos nunca vão ao frontend. |
| Leitura pública atende storefront | **PASS de configuração**: bucket `public=true`; conforme documentação oficial, URL público é servido sem policy SELECT de objeto. Formato de URL no contrato. | **GET 200 de imagem existente e render no site NÃO TESTADOS**: bucket vazio; depende de ingestão + integração. |
| Upload/alteração exige contexto administrativo autorizado | **PASS do bloqueio para navegador**: inexistência de policies de escrita para `anon`/`authenticated`; somente contexto privilegiado autorizado poderá escrever. | Upload real pelo futuro portal `/admin` NÃO implementado; SB-014 segue HOLD. Não foi feito teste HTTP de POST/PUT/DELETE. |
| Referência estável pelo banco | **PASS estrutural**: `public.product_media(storage_bucket,storage_path)` + `UNIQUE(product_id,storage_bucket,storage_path)`; restrições `product_media_public_bucket_remix_only`, `product_media_public_readiness` e `product_media_path_safe` verificadas na instância. | Zero vínculos de mídia reais; ingestão/ligação e render E2E pendentes. |

**Conclusão circunscrita:** bucket, restrições e contrato de mídia criados/configurados. Não se atesta fluxo de upload/admin, `GET 200`, migração de imagens, publicação de SKU, lançamento ou cutover.

## 3. Advisors pós-migration

- **Security:** 2 INFO (`app_private.admin_role_assignments` e `admin_role_audit`, RLS sem policy, acesso privado deliberado); 2 WARN (`public.can_access_admin()` SECURITY DEFINER acessível a signed-in e proteção de senhas vazadas desativada). Findings preexistentes da frente SB-014/SB-015; sem novo finding atribuível à criação do bucket. Remediação official: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable e https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection. **Permanecem abertos; SB-014/cutover não liberados.**
- **Performance:** 5 INFO `unused_index` (product_lines_position_idx, products_product_line_id_idx, product_variants_product_id_idx, product_prices_variant_product_fk_idx, product_media_source_product_idx). Não são causados pela configuração do bucket. Remediação: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index.

## 4. Governança, diferenças e recuperação

- **Exceção à ordem do SB-003:** a aplicação remota foi realizada antes do commit do SQL. A versão/nome do `Supabase.list_migrations` e o arquivo de migration foram reconciliados no PR #38, sem editar a migration remota; `schema_migrations` registra um statement com MD5 `f66908b87aa3bfb73204cb8cb078750c`. Reprodução local/byte-a-byte e verificação de schema completo permanecem na preparação do cutover; não declarar esse teste executado.
- **TypeScript:** sem alteração em tabelas do schema `public` ou em API pública tipada. Não foi regenerado `lib/supabase/database.types.ts`; Storage bucket é configuração `storage`.
- **Forward-fix:** nova migration para ajustes; não editar migration aplicada. Nunca excluir bucket ou objetos com referências antes de inventário, backup e autorização.
- **Segurança:** somente REMIX comercial; imagens de clientes/referências/arquivos privados pertencem a SB-017 e não podem entrar em bucket público. Autorização de infraestrutura aqui não equivale a liberação comercial ou de privacidade.
- **GitHub Actions:** não utilizado; merge e documentação por conector GitHub, sem deploy do site.

## 5. Próximos passos fora do SB-016

1. Engineering / Commerce — SB-019: inventariar imagens REMIX existentes por SKU e separar materiais não autorizados/órfãos.
2. Engineering — realizar ingestão via Storage API/Dashboard em contexto autorizado, verificar tamanho/MIME/caminho, obter **GET 200 anônimo** com um arquivo comercial permitido, mapear o bucket+path ao `product_media`; validar consumo real no storefront em SB-045.
3. Engineering / Quality — SB-017: criar `customer-references` PRIVADO e provar recusa de leitura pública (não reutilizar `product-media`).
4. Founder / Engineering / Quality — SB-014: resolver testes e WARN próprios antes de liberar portal administrativo/cutover.

**Não requer ação manual do Founder para criação/configuração deste bucket.** Upload/GET real ficam para o fluxo de ingestão com autorização e evidências próprias. Fonte oficial de buckets: https://supabase.com/docs/guides/storage/buckets/creating-buckets ; acesso: https://supabase.com/docs/guides/storage/security/access-control .
