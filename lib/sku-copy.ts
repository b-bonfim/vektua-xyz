/**
 * Source: Google Sheets "shortlist-sku", tab Página1, B5:C13,
 * retrieved 2026-09-20; indexed by SKU rather than sheet order.
 * Source text is not evidence of licenses, manufacturing or commercial release.
 */
export const optimizedSkuCopy: Record<string, string> = {
  'S-HAL-DEC-01': 'Abóbora decorativa de Halloween | Entre no clima da data com uma peça temática que também pode compor a apresentação de doces embalados. Uma escolha para decorar mesas, montar um cantinho de Halloween ou complementar a ambientação da festa. Confira as medidas e as opções disponíveis antes de escolher.',
  'G-ORG-RC-01': 'Organizador de controles remotos | Menos controles espalhados, mais praticidade no dia a dia. A proposta é reunir os controles da TV e de outros aparelhos em uma única peça para apoiar sobre o rack, a mesa ou o aparador — sem instalação na parede. Confira dimensões e compatibilidade com seus controles antes da compra.',
  'G-VAS-ESC-01': 'Cachepô escultórico com personagem | Dê personalidade à decoração com uma peça que combina a presença de um personagem estilizado com o visual de um cachepô. Uma opção para destacar uma composição com plantas ou criar um ponto de interesse na estante e na mesa. Consulte dimensões, abertura e condições de uso antes de escolher a planta ou o vaso interno.',
  'S-NAT-PRE-01': 'Presépio minimalista de Natal | Celebre o Natal com uma representação da cena do nascimento em linguagem visual simples e delicada. A peça é uma opção para compor a decoração natalina, criar um cantinho especial ou presentear alguém que aprecia a tradição do presépio. Confira dimensões e itens incluídos no conjunto antes da compra.',
  'G-VAS-MIN-01': 'Kit de mini-cachepôs decorativos | Pequenos detalhes que dão vida à decoração. O conjunto de mini-cachepôs é uma opção para criar uma composição em mesas, prateleiras e outros cantinhos, com um visual coordenado e cheio de personalidade. Confira a quantidade de peças, as medidas e se plantas ou vasos internos estão incluídos antes de comprar.',
  'G-ORG-HS-01': 'Suporte minimalista para headset | Seu headset ganha um lugar próprio quando não está em uso. Com visual discreto, o suporte ajuda a organizar a mesa e a deixar o equipamento em destaque no setup de trabalho ou de jogos. Confira as dimensões e a compatibilidade com o seu modelo de headset antes de escolher.',
  'G-CHV-JJ-01': 'Chaveiro faixa de jiu-jítsu | Leve sua conexão com o tatame para o dia a dia. Inspirado na faixa de jiu-jítsu, este chaveiro é um detalhe temático para acompanhar suas chaves, compor a bolsa ou presentear quem vive o esporte. Confira o modelo, as cores e as dimensões disponíveis antes de escolher.',
  'CAN-PESSOA-001': 'Miniatura caricata estilizada de pessoa | Transforme uma referência pessoal em uma peça cheia de significado. A proposta é criar uma miniatura em estilo caricato a partir de fotos, para presentear, decorar ou guardar uma lembrança. A representação é estilizada, não uma réplica fotográfica. Antes do pedido, confira os estilos disponíveis, as fotos necessárias, os limites de personalização e as condições de aprovação e prazo.',
  'CAN-PET-001': 'Miniatura estilizada de pet | Uma forma especial de celebrar a personalidade do seu companheiro. A proposta é transformar fotos do seu pet em uma miniatura estilizada para decorar, presentear ou guardar como lembrança. Não se trata de reprodução fotográfica. Confira os estilos disponíveis, as referências exigidas, o escopo de ajustes e os prazos informados antes de fazer a encomenda.',
};

/** Fact-specific safeguards are distinct from the source marketing copy. */
export const skuCaveats: Record<string, string> = {
  'S-HAL-DEC-01': 'Uso com doces, segurança e direitos sobre o modelo original e remix ainda em análise.',
  'G-ORG-RC-01': 'Configuração de apoio, não de parede, conforme escolha do Founder. Medidas e compatibilidade ainda não testadas fisicamente.',
  'G-VAS-ESC-01': 'Modelo de terceiro: não se declara criação original Vektua XYZ. Licença, uso como cachepô e compatibilidade com planta ou vaso interno pendentes de validação.',
  'S-NAT-PRE-01': 'Composição e quantidade de peças do conjunto ainda pendentes de conferência do arquivo e protótipo.',
  'G-VAS-MIN-01': 'A proposta anterior considera três mini-cachepôs, mas quantidade, estabilidade e função de vaso dependem de reconciliação do arquivo e teste físico.',
  'G-ORG-HS-01': 'Proposta de apoio sem adesivo. Estabilidade, direitos do modelo e compatibilidade ainda não testados.',
  'G-CHV-JJ-01': 'Variante, montagem, ferragem e cores ainda não definidas nem testadas; não há pontos de venda locais confirmados.',
  'CAN-PESSOA-001': 'Sem promessa de semelhança exata ou prazo fixo; direitos dos resultados, escopo de ajustes e privacidade pendentes.',
  'CAN-PET-001': 'Estilo, escopo de ajustes, direitos dos resultados, privacidade e viabilidade de impressão ainda em validação.',
};

export function skuDescription(id: string, genericNotice: string): string {
  const copy = optimizedSkuCopy[id];
  if (!copy) throw new Error(`Descrição otimizada ausente para SKU ${id}`);
  // The product page already renders its heading; omit the sheet's redundant title prefix.
  const divider = copy.indexOf(' | ');
  const body = divider >= 0 ? copy.slice(divider + 3) : copy;
  return `${body} ${skuCaveats[id]} ${genericNotice}`;
}
