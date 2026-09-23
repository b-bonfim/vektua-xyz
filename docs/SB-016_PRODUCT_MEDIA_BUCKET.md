# SB-016 — Contrato de Storage público `product-media`

**Projeto:** Vektua XYZ · Supabase `tbffwwjqkusiupahjqux` · **Data:** 22/09/2026 (BRT)  
**Card:** https://trello.com/c/yFi2Gv90  
**Escopo:** bucket para imagens COMERCIAIS REMIX do catálogo. Não é upload de clientes, não é implementação do portal admin, nem cutover.

## Estado e configuração aplicada

Migration remota `20260923010153_sb_016_create_public_product_media_bucket` cria `storage.buckets`:

| Campo | Valor verificado |
|---|---|
| `id`/`name` | `product-media` |
| `public` | `true` |
| `file_size_limit` | `10485760` bytes (10 MiB) |
| `allowed_mime_types` | `image/jpeg`, `image/png`, `image/webp` |
| Quantidade inicial de objetos | `0` |

O bucket é **público apenas para SERVIR objetos**. Um URL público não implica permissão de upload, update ou delete. O acesso público a imagens requer apenas o URL de um objeto efetivamente existente. Não se criou policy `storage.objects` de leitura ou escrita: buckets públicos são servidos publicamente pelo Storage e `storage.objects` tem RLS ativado com **zero policies** nesta data. Não criar policies genéricas `TO public`, `TO anon`, `TO authenticated`, `USING(true)` ou `WITH CHECK(true)` para escrita. Escrita fica restrita a operadores com acesso privilegiado ao projeto ou backend seguro com credencial privilegiada; **nunca** colocar secret/service-role key no cliente, no Git ou no Trello. O portal/admin de usuário final ainda não tem upload habilitado; quando for implementado, exigir fluxo autenticado e autorização server-side/RLS específica em outro card, com testes negativos.

## Convenção canônica de caminho

- Caminho relativo ao bucket: `{sku}/{arquivo}`; SKU é o identificador canônico de `public.products.sku`, sem barra adicional e sem nome de cliente.
- Exemplo **de formato, não objeto existente**: `G-CHV-ALI-01/G-CHV-ALI-01_REMIX.png`.
- O arquivo publicado precisa ser mídia comercial **REMIX**, ter extensão/MIME correspondente e respeitar limite de tamanho; nunca subir referência original, imagem conceitual, foto pessoal, modelo 3D ou dados privados neste bucket.
- Para conteúdo alterado, preferir novo nome versionado/referência versionada (evitar sobrescrever URL cacheada) e trocar a referência no banco após verificar o novo objeto. Não apagar objetos antigos sem plano de referências e reversão.
- `storage_bucket='product-media'` e `storage_path='{sku}/{arquivo}'` são a identidade persistida em `public.product_media`. **Não** salvar no banco um link assinado, URL temporária ou caminho local como chave canônica.
- URL público derivado (somente com objeto existente): `https://tbffwwjqkusiupahjqux.supabase.co/storage/v1/object/public/product-media/{sku}/{arquivo}`. O storefront deve construir/receber esse URL a partir do bucket+path ou do SDK, fazendo encoding seguro de segmentos. Este contrato não altera o frontend.

## Proveniência e integridade no banco

O modelo de `SB-010` contém `storage_bucket`, `storage_path`, `media_type`, `origin_reference`, `file_state`, `is_public`, `alt_text` e ordenação de galeria. Restrições existentes exigem `media_type='remix'` em `product-media`; exigem `file_state='verified'`, `alt_text` e posição para mídia publicada; trigger recusa publicação quando objeto Storage correspondente não existe/é invisível para o escritor. Publicar objeto no bucket **não publica SKU** nem substitui gates de produto. A publicação real e ligação ao storefront seguem cards posteriores.

## Segurança e operação

1. Usar apenas imagens comerciais autorizadas e revisadas. O bucket é publicamente acessível mesmo sem referência no banco: **não** subir objetos confidenciais ou ainda não autorizados sob a expectativa de que `is_public=false` os proteja.
2. Não conceder escrita `anon`/`authenticated` apenas porque o bucket é público. A regra atual é deny-by-default em `storage.objects` para essas roles; operador com console do projeto pode operar Storage sob suas permissões próprias.
3. Não fornecer credenciais de serviço ao navegador, scripts de frontend ou repositório. Política de atualização administrativa fina fica dependente de Auth/Admin (SB-014/SB-040); SB-014 está em HOLD e não deve ser presumido concluído.
4. Antes do primeiro upload efetivo: conferir SKU, foto REMIX, origem/licença, tamanho, MIME e política comercial; carregar com contexto privilegiado autorizado; ler URL público no navegador anônimo; associar caminho ao `product_media`; verificar rota do storefront, cache e ausência de dados pessoais. Esse fluxo E2E pertence aos cards de inventário/ingestão/integracão (SB-019 e subsequentes, especialmente SB-045).
5. Não há objetos em `product-media` nesta execução; por isso não houve GET 200 de mídia real nem teste de upload pelo portal. A propriedade pública e o contrato de leitura estão configurados e verificados no banco, não equivalem a teste E2E de storefront.

## Recuperação e controle de mudança

Migration aplicada em ambiente compartilhado **não pode ser editada/reexecutada**. Em caso de erro, abrir nova migration forward-fix e documentar impacto; nunca apagar bucket com objetos ou referências sem inventário, backup e autorização. A criação foi feita via conector Supabase antes de versionar o arquivo correspondente; exceção à ordem preferencial do protocolo `docs/SUPABASE_MIGRATION_PROTOCOL.md`, reconciliada pelo arquivo com o mesmo timestamp/nome/SQL. Rebuild local e paridade byte a byte histórica permanecem para checagem pré-cutover; nenhuma divergência conhecida da configuração verificada.

## Referências

- [Supabase — Creating Buckets](https://supabase.com/docs/guides/storage/buckets/creating-buckets) (inclui `INSERT INTO storage.buckets`).
- [Supabase — Storage Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals) (publicidade aplica-se a download, não escrita).
- [Supabase — Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control) (RLS e INSERT/UPDATE/DELETE).
- `supabase/migrations/20260922193533_sb_010_model_product_media_provenance.sql`.
- `supabase/migrations/20260923010153_sb_016_create_public_product_media_bucket.sql`.
- Evidências: `docs/SB-016_PRODUCT_MEDIA_EVIDENCE.md`.

**GitHub Actions:** não utilizado. **Founder Gate:** este card autoriza somente a infraestrutura solicitada; não autoriza ingestão massiva, exposição de dados pessoais, publicação de SKU ou lançamento.
