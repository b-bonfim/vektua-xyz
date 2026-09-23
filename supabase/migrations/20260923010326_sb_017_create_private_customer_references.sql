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