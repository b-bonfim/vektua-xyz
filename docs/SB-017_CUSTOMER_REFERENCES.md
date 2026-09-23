# SB-017 — Bucket privado `customer-references`

**Data:** 22/09/2026 (BRT) · **Projeto:** `tbffwwjqkusiupahjqux` · **Card:** https://trello.com/c/YeGa58dL · **Dependência:** SB-012 concluída. **Escopo:** somente infraestrutura privada, sem formulário/upload de clientes ou liberação comercial.

## Configuração implantada

- `storage.buckets.id = name = customer-references`; `public=false` (confirmado por SELECT remoto).
- `file_size_limit=10485760` bytes (10 MiB); `allowed_mime_types={image/jpeg,image/png,image/webp}`. Guardrails técnicos revisáveis; MIME declarado não substitui inspeção de conteúdo, EXIF, malware ou processamento.
- Migration: `20260923010326_sb_017_create_private_customer_references` / `supabase/migrations/20260923010326_sb_017_create_private_customer_references.sql`. Ela não altera policies/grants nem cria usuários, fotos, URLs assinadas ou recursos de upload.
- `storage.objects` e `storage.buckets` estão com RLS ativo. Policies existentes de outros cards (por exemplo `evidence`) devem ser avaliadas pelo predicado completo; nenhum acesso deve abranger `customer-references`. **Não** presumir que toda policy futura será segura.

## Autorização e operação

Até decisão sobre retenção e implementação da jornada, **não habilitar INSERT/SELECT/UPDATE/DELETE de `customer-references` para `anon` ou `authenticated` por política genérica**. Conta `authenticated` sozinha não equivale a admin. Futuras operações de backend devem autenticar usuário real, verificar atribuição ativa/função no servidor (modelo SB-013/SB-014), limitar a ação e a referência solicitada e auditar acessos. Chave secret/service-role apenas no servidor seguro: ignora RLS, jamais no browser, Git, Trello ou logs. O Dashboard com acesso privilegiado também exige gestão adequada de usuários/MFA; acesso privilegiado à plataforma não foi auditado neste card.

Sem policy de leitura no bucket, não há leitura/listagem via API de cliente comum; administradores da aplicação tampouco recebem acesso via API automaticamente. Criar policies administrativas granulares somente em card futuro com papel autorizado, predicados por bucket e trabalho, testes positivos e negativos. Não conceder `USING (true)` nem `TO authenticated` sem ownership/role.

## Convenções para a integração futura (não implementadas)

- Caminho **proposto**, com IDs opacos: `requests/{request_uuid}/jobs/{job_uuid}/{reference_uuid}.{ext}`. Não inserir nome, CPF, e-mail, telefone ou outros dados pessoais no path/filename.
- Registrar vínculo referencial pedido/solicitação ↔ trabalho ↔ objeto em entidade privada futura; regex no path não prova sozinho esse vínculo. Upload público **não** habilitado no SB-017; SB-053 e integração deverão fornecer modelo real e checagens.
- URL assinada, somente quando necessária, emitida por handler autenticado/autorizado, escopo de objeto único, prazo máximo **proposto de 300 segundos** (`createSignedUrl(path, 300)`); nunca gerar URL pública estável, enviar em analytics/log ou tratar expiração como revogação perfeita de conteúdo já baixado. Emissão e teste de expiração ainda **não implementados**.
- Fotos para produção exigem finalidade contratual clara; autorização promocional é **separada**. Política de retenção, exclusão, descarte, terceiros e tratamento de metadados **PENDENTE DE APROVAÇÃO**. Sem política, **não receber fotos reais de clientes**. Não escolher prazo de retenção por inferência.
- Testes usam apenas arquivo sintético (canário) e removem-no em seguida; nunca fotos reais sem base autorizada. Bucket vazio na inspeção inicial.

## Provas e limitações

Relatório: `docs/SB-017_CUSTOMER_REFERENCES_EVIDENCE.md`. A configuração SQL e RLS não equivalem a teste de requisição HTTP: teste negativo com canário realmente existente é exigido para concluir integralmente o cartão. Protocolo de aplicação prévia: `docs/SB-017_PRIVATE_BUCKET_SQL_SOURCE.md`; ausência de CLI registrada, nome gerado pelo `apply_migration`, arquivo canônico criado depois com versão real. Rebuild local/paridade byte a byte ainda não comprovados. Nenhum GitHub Actions foi invocado.

Documentação oficial: https://supabase.com/docs/guides/storage/buckets/fundamentals ; https://supabase.com/docs/guides/storage/buckets/creating-buckets ; https://supabase.com/docs/guides/storage/security/access-control .