/**
 * Fonte: shortlist-sku (Google Sheets), aba Página1, colunas B (SKU) e C (Name),
 * linhas 5–13, consultada em 20/09/2026.
 * Os nomes são títulos propostos para o catálogo demonstrativo, NÃO aprovação comercial.
 * Não alterar slugs, preços, licenças ou estados de gate por causa destes títulos.
 */
export const skuNames: Record<string, string> = {
  'S-HAL-DEC-01': 'Abóbora Decorativa de Halloween | Clima de Festa na Mesa',
  'G-ORG-RC-01': 'Organizador de Controles Remotos | Mesa, Rack e Aparador',
  'G-VAS-ESC-01': 'Cachepô Escultórico com Personagem | Decoração com Personalidade',
  'S-NAT-PRE-01': 'Presépio Minimalista de Natal | Tradição em Traços Delicados',
  'G-VAS-MIN-01': 'Kit de Mini-Cachepôs Decorativos | Charme para Seu Cantinho',
  'G-ORG-HS-01': 'Suporte Minimalista para Headset | Setup Organizado',
  'G-CHV-JJ-01': 'Chaveiro Faixa de Jiu-Jítsu | Tatame no Dia a Dia',
  'CAN-PESSOA-001': 'Miniatura Caricata de Pessoa | Personalização por Fotos',
  'CAN-PET-001': 'Miniatura Estilizada de Pet | Personalização por Fotos',
};

export function skuName(id: string): string {
  const name = skuNames[id];
  if (!name) throw new Error(`Nome comercial ausente para SKU ${id}`);
  return name;
}
