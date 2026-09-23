-- SB-021 — seed idempotente de linhas e produtos
-- Fonte canônica: lib/commercial-catalog.ts @ 7e1ea4cbebb8a34060f852ddc7de57573c266ceb
-- Escopo: product_lines + products. Não semeia mídia, preços, variantes ou aprovação comercial.
begin;

select pg_advisory_xact_lock(hashtext('vektua_xyz_sb_021_seed_catalog'));

with source_lines(slug, name, description, position, status) as (
  values
  ('objetos', 'Objetos & Colecionáveis', 'Peças de catálogo para usar, exibir ou presentear — sem chaveiros nesta linha.', 0, 'active'),
  ('datas', 'Datas & Coleções', 'Objetos e coleções para diferentes ocasiões, com composição e condições por produto.', 1, 'active'),
  ('feitos', 'Feitos para Você', 'Miniaturas estilizadas com escopo e exemplos em validação.', 2, 'active'),
  ('chaveiros', 'Chaveiros', 'Chaveiros diversos, articulados e temáticos. Proposta de curadoria para negócios locais, ainda sem pontos parceiros confirmados.', 3, 'active')
)
insert into public.product_lines (slug, name, description, position, status)
select slug, name, description, position, status
from source_lines
on conflict (slug) do update
set name=excluded.name, description=excluded.description, position=excluded.position, status=excluded.status;

with source_products(sku, slug, line_slug, name, description, collection, personalized) as (
  values
  ('G-ORG-RC-01', 'g-org-rc-01', 'objetos', 'Organizador de Controles Remotos | Mesa, Rack e Aparador', 'Menos controles espalhados, mais praticidade no dia a dia. A proposta é reunir os controles da TV e de outros aparelhos em uma única peça para apoiar sobre o rack, a mesa ou o aparador — sem instalação na parede. Confira dimensões e compatibilidade com seus controles antes da compra.', 'Organização', false),
  ('S-HAL-DEC-01', 's-hal-dec-01', 'datas', 'Abóbora Decorativa de Halloween | Clima de Festa na Mesa', 'Entre no clima da data com uma peça temática que também pode compor a apresentação de doces embalados. Uma escolha para decorar mesas, montar um cantinho de Halloween ou complementar a ambientação da festa. Confira as medidas e as opções disponíveis antes de escolher.', 'Halloween', false),
  ('CAN-PET-001', 'can-pet-001', 'feitos', 'Miniatura Estilizada de Pet | Personalização por Fotos', 'Uma forma especial de celebrar a personalidade do seu companheiro. A proposta é transformar fotos do seu pet em uma miniatura estilizada para decorar, presentear ou guardar como lembrança. Não se trata de reprodução fotográfica. Confira os estilos disponíveis, as referências exigidas, o escopo de ajustes e os prazos informados antes de fazer a encomenda.', 'Personalizados', true),
  ('G-VAS-ESC-01', 'g-vas-esc-01', 'objetos', 'Cachepô Escultórico com Personagem | Decoração com Personalidade', 'Dê personalidade à decoração com uma peça que combina a presença de um personagem estilizado com o visual de um cachepô. Uma opção para destacar uma composição com plantas ou criar um ponto de interesse na estante e na mesa. Consulte dimensões, abertura e condições de uso antes de escolher a planta ou o vaso interno.', 'Decoração', false),
  ('G-VAS-MIN-01', 'g-vas-min-01', 'objetos', 'Kit de Mini-Cachepôs Decorativos | Charme para Seu Cantinho', 'Pequenos detalhes que dão vida à decoração. O conjunto de mini-cachepôs é uma opção para criar uma composição em mesas, prateleiras e outros cantinhos, com um visual coordenado e cheio de personalidade. Confira a quantidade de peças, as medidas e se plantas ou vasos internos estão incluídos antes de comprar.', 'Decoração', false),
  ('G-ORG-HS-01', 'g-org-hs-01', 'objetos', 'Suporte Minimalista para Headset | Setup Organizado', 'Seu headset ganha um lugar próprio quando não está em uso. Com visual discreto, o suporte ajuda a organizar a mesa e a deixar o equipamento em destaque no setup de trabalho ou de jogos. Confira as dimensões e a compatibilidade com o seu modelo de headset antes de escolher.', 'Organização', false),
  ('G-CHV-JJ-01', 'g-chv-jj-01', 'chaveiros', 'Chaveiro Faixa de Jiu-Jítsu | Tatame no Dia a Dia', 'Leve sua conexão com o tatame para o dia a dia. Inspirado na faixa de jiu-jítsu, este chaveiro é um detalhe temático para acompanhar suas chaves, compor a bolsa ou presentear quem vive o esporte. Confira o modelo, as cores e as dimensões disponíveis antes de escolher.', 'Chaveiros', false),
  ('S-NAT-PRE-01', 's-nat-pre-01', 'datas', 'Presépio Minimalista de Natal | Tradição em Traços Delicados', 'Celebre o Natal com uma representação da cena do nascimento em linguagem visual simples e delicada. A peça é uma opção para compor a decoração natalina, criar um cantinho especial ou presentear alguém que aprecia a tradição do presépio. Confira dimensões e itens incluídos no conjunto antes da compra.', 'Natal', false),
  ('CAN-PESSOA-001', 'can-pessoa-001', 'feitos', 'Miniatura Caricata de Pessoa | Personalização por Fotos', 'Transforme uma referência pessoal em uma peça cheia de significado. A proposta é criar uma miniatura em estilo caricato a partir de fotos, para presentear, decorar ou guardar uma lembrança. A representação é estilizada, não uma réplica fotográfica. Antes do pedido, confira os estilos disponíveis, as fotos necessárias, os limites de personalização e as condições de aprovação e prazo.', 'Personalizados', true),
  ('G-CHV-MUM-01', 'g-chv-mum-01', 'chaveiros', 'Chaveiro Múmia Articulada | Mini Personagem de Halloween', 'Múmia temática de Halloween, com proposta articulada para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-PAL-01', 'g-chv-pal-01', 'chaveiros', 'Chaveiro Mini Palhaço de Terror | Coleção Halloween', 'Mini palhaço temático de terror para uma coleção de Halloween.', 'Halloween', false),
  ('G-CHV-GAT-01', 'g-chv-gat-01', 'chaveiros', 'Miniatura Gatinho Esqueleto | Decoração Fofa de Halloween', 'Miniatura decorativa de gatinho com estética de esqueleto.', 'Halloween', false),
  ('G-CHV-FAN-01', 'g-chv-fan-01', 'chaveiros', 'Chaveiro Fantasminha Boo | Halloween Divertido', 'Fantasminha temático para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-CRA-01', 'g-chv-cra-01', 'chaveiros', 'Chaveiro Caveira Demoníaca | Acessório de Halloween Sombrio', 'Caveira temática em formato de chaveiro.', 'Halloween', false),
  ('G-CHV-MUM-02', 'g-chv-mum-02', 'chaveiros', 'Chaveiro Mini Múmia | Halloween Divertido para Chaves', 'Mini múmia temática para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-FAN-02', 'g-chv-fan-02', 'chaveiros', 'Chaveiro Fantasminha Fofo | Charme de Halloween', 'Fantasminha temático para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-MAS-01', 'g-chv-mas-01', 'chaveiros', 'Chaveiro Máscara de Terror | Estilo Halloween', 'Mini máscara temática em formato de chaveiro.', 'Halloween', false),
  ('G-CHV-MED-01', 'g-chv-med-01', 'chaveiros', 'Chaveiro Mini Médico da Peste | Estilo Gótico de Halloween', 'Personagem de inspiração histórica em chaveiro temático.', 'Halloween', false),
  ('G-CHV-LOB-01', 'g-chv-lob-01', 'chaveiros', 'Chaveiro Mini Lobisomem | Criaturas do Halloween', 'Lobisomem temático em miniatura para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-CAV-01', 'g-chv-cav-01', 'chaveiros', 'Chaveiro Caveira com Capuz Azul | Estilo Urbano', 'Caveira com capuz azul em formato de chaveiro.', 'Halloween', false),
  ('G-CHV-MON-01', 'g-chv-mon-01', 'chaveiros', 'Chaveiro Monstro Articulado | Mini Criatura de Halloween', 'Mini criatura articulada para uma coleção temática.', 'Halloween', false),
  ('G-CHV-ESQ-01', 'g-chv-esq-01', 'chaveiros', 'Chaveiro Mini Esqueleto | Acessório de Halloween', 'Mini esqueleto temático em chaveiro.', 'Halloween', false),
  ('G-CHV-MAS-02', 'g-chv-mas-02', 'chaveiros', 'Chaveiro Figura Mascarada de Terror | Coleção Halloween', 'Figura mascarada temática; configuração de fixação a confirmar.', 'Halloween', false),
  ('G-CHV-ABO-01', 'g-chv-abo-01', 'chaveiros', 'Chaveiro Mini Abóbora de Halloween | Toque de Outono', 'Mini abóbora de Halloween em formato de chaveiro.', 'Halloween', false),
  ('G-CHV-ESQ-02', 'g-chv-esq-02', 'chaveiros', 'Chaveiro Esqueletinho Fofo | Halloween Divertido', 'Mini figura de esqueleto; configuração de fixação a confirmar.', 'Halloween', false),
  ('G-CHV-FAN-03', 'g-chv-fan-03', 'chaveiros', 'Chaveiro Fantasma Clássico | Um Toque de Halloween', 'Fantasma temático para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-MAO-01', 'g-chv-mao-01', 'chaveiros', 'Chaveiro Mão Misteriosa | Acessório de Halloween', 'Mini mão temática para chaves ou mochila.', 'Halloween', false),
  ('G-CHV-ALI-01', 'g-chv-ali-01', 'chaveiros', 'Miniatura Alienígena | Colecionável de Ficção Científica', 'Miniatura de ficção científica com visual alienígena.', 'Divertidos', false),
  ('G-CHV-BLO-01', 'g-chv-blo-01', 'chaveiros', 'Chaveiro Bloco de Interrogação | Estilo Gamer Retrô', 'Chaveiro em formato de bloco com ponto de interrogação e estética gamer retrô.', 'Games', false),
  ('G-CHV-POL-01', 'g-chv-pol-01', 'chaveiros', 'Mini Polvinho Articulado | Colecionável Divertido', 'Miniatura articulada de polvinho; versão como chaveiro a confirmar no atendimento.', 'Divertidos', false)
),
resolved as (
  select s.sku, s.slug, pl.id as product_line_id, s.name, s.description, s.collection, s.personalized
  from source_products s
  join public.product_lines pl on pl.slug=s.line_slug
)
insert into public.products (
  sku, slug, product_line_id, name, description, collection, category,
  personalized, status, visibility
)
select sku, slug, product_line_id, name, description, collection, null,
       personalized, 'draft', 'hidden'
from resolved
on conflict (sku) do update
set slug=excluded.slug,
    product_line_id=excluded.product_line_id,
    name=excluded.name,
    description=excluded.description,
    collection=excluded.collection,
    personalized=excluded.personalized;

do $$
declare v_lines integer; v_products integer; v_bad_state integer;
begin
  select count(*) into v_lines from public.product_lines where slug in ('objetos','datas','feitos','chaveiros');
  if v_lines <> 4 then raise exception 'SB-021: esperado 4 linhas fonte, encontrado %', v_lines; end if;

  select count(*) into v_products from public.products where sku in ('G-ORG-RC-01','S-HAL-DEC-01','CAN-PET-001','G-VAS-ESC-01','G-VAS-MIN-01','G-ORG-HS-01','G-CHV-JJ-01','S-NAT-PRE-01','CAN-PESSOA-001','G-CHV-MUM-01','G-CHV-PAL-01','G-CHV-GAT-01','G-CHV-FAN-01','G-CHV-CRA-01','G-CHV-MUM-02','G-CHV-FAN-02','G-CHV-MAS-01','G-CHV-MED-01','G-CHV-LOB-01','G-CHV-CAV-01','G-CHV-MON-01','G-CHV-ESQ-01','G-CHV-MAS-02','G-CHV-ABO-01','G-CHV-ESQ-02','G-CHV-FAN-03','G-CHV-MAO-01','G-CHV-ALI-01','G-CHV-BLO-01','G-CHV-POL-01');
  if v_products <> 30 then raise exception 'SB-021: esperado 30 SKUs fonte, encontrado %', v_products; end if;

  select count(*) into v_bad_state from public.products
   where sku in ('G-ORG-RC-01','S-HAL-DEC-01','CAN-PET-001','G-VAS-ESC-01','G-VAS-MIN-01','G-ORG-HS-01','G-CHV-JJ-01','S-NAT-PRE-01','CAN-PESSOA-001','G-CHV-MUM-01','G-CHV-PAL-01','G-CHV-GAT-01','G-CHV-FAN-01','G-CHV-CRA-01','G-CHV-MUM-02','G-CHV-FAN-02','G-CHV-MAS-01','G-CHV-MED-01','G-CHV-LOB-01','G-CHV-CAV-01','G-CHV-MON-01','G-CHV-ESQ-01','G-CHV-MAS-02','G-CHV-ABO-01','G-CHV-ESQ-02','G-CHV-FAN-03','G-CHV-MAO-01','G-CHV-ALI-01','G-CHV-BLO-01','G-CHV-POL-01') and (status <> 'draft' or visibility <> 'hidden');
  if v_bad_state <> 0 then raise exception 'SB-021: % SKU(s) fonte com status/visibilidade inicial indevidos', v_bad_state; end if;
end $$;

commit;
