# SB-017 — SQL de implantação revisado (fonte pré-aplicação)

Projeto: `tbffwwjqkusiupahjqux` · Card: https://trello.com/c/YeGa58dL · Data: 22/09/2026 (BRT).

O CLI Supabase não está disponível no ambiente de execução. Este documento congela o SQL *antes* da aplicação via MCP; o arquivo canônico `supabase/migrations/<version_retornada>_sb_017_create_private_customer_references.sql` deve ser criado com a versão **efetivamente retornada** pelo Supabase, com SQL idêntico, antes de merge/conclusão. Esta exceção de sequência fica registrada conforme protocolo SB-003; não inventar timestamp. Não existem dados de cliente de teste e a retenção ainda não foi aprovada.

```sql
BEGIN;

-- Falha segura em caso de concorrência, nome divergente ou execução duplicada.
DO $guard$
BEGIN
  IF EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'customer-references' OR name = 'customer-references'
  ) THEN
    RAISE EXCEPTION 'SB-017: bucket customer-references already exists; inspect before applying';
  END IF;
END
$guard$;

INSERT INTO storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('customer-references', 'customer-references', false, 10485760,
   ARRAY['image/jpeg','image/png','image/webp']::text[]);

-- Não criar policies em storage.objects nem conceder acesso a anon/authenticated.
-- Sem atribuição admin real e sem políticas específicas, acesso fica fechado.
-- Retenção/descarte, modelo de pedidos e integração de upload pertencem a cards futuros.
COMMIT;
```

Guardrails: bucket privado; uploads limitados a 10 MiB e MIME JPEG/PNG/WebP como proteção técnica inicial revisável (não equivale a inspeção do conteúdo); nenhuma URL assinada emitida nesta etapa; a expiração futura proposta é 300 segundos, sujeita à implementação com autorização real; caminho futuro baseado em UUIDs opacos de solicitação/trabalho/referência, sem nomes pessoais. Não criar policy `USING (true)` ou acesso a todo `authenticated`; backend não deve expor service role.

Aceite dependente de: leitura da configuração final do bucket, RLS e políticas globais de Storage, teste negativo de leitura/listagem com objeto de teste sintético se acesso técnico permitir, advisors, migration no Git com paridade, PR e relatório. Não declarar conclusão se teste negativo não puder ser comprovado.