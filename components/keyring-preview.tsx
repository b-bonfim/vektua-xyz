'use client';

import { useState } from 'react';
import { keyringCandidates } from '@/lib/keyring-candidates';
import { normalize } from '@/lib/catalog';

/**
 * Escopo da ordem editorial do Founder de 21/09/2026: exibir os 21 IDs de SKU
 * na página /chaveiros, sem sugerir que existam direitos, oferta ou venda.
 * Esta é uma listagem informativa; não integra `products`, ficha individual,
 * checkout, estoque, preços, imagens de terceiros ou links para arquivos.
 * HOLD_SPECIFIC_ACTION continua vigente até evidências e revisão de Quality.
 */
const previewDescriptions: Record<string, string> = {
  'G-CHV-MUM-01': 'Uma múmia divertida para acompanhar você no dia a dia. Proposta de chaveiro articulado com tema de Halloween.',
  'G-CHV-FAN-01': 'Um pequeno susto cheio de charme. Proposta de fantasminha para uma coleção temática de Halloween.',
  'G-CHV-CRA-01': 'Uma caveira de estética sombria para quem gosta de acessórios temáticos de Halloween.',
  'G-CHV-MUM-02': 'Uma mini múmia com clima de Halloween, pensada como lembrança temática.',
  'G-CHV-FAN-02': 'Um fantasminha de visual simpático para acompanhar a coleção de Halloween.',
  'G-CHV-MED-01': 'Uma figura inspirada no médico da peste, de visual histórico e atmosfera gótica.',
  'G-CHV-LOB-01': 'Uma pequena criatura das histórias de lobisomens, em proposta de chaveiro temático.',
  'G-CHV-ESQ-01': 'Um mini esqueleto para a seleção de personagens de Halloween.',
  'G-CHV-ABO-01': 'Uma abóbora em miniatura para compor a coleção de outubro.',
  'G-CHV-ESQ-02': 'Um esqueletinho de proposta simpática para uma coleção de Halloween.',
  'G-CHV-FAN-03': 'Um fantasminha clássico em proposta de chaveiro para a temporada de Halloween.',
};

// Explicações documentais, sem copiar personagens/identidade de franquias,
// prometer uso comercial de STL ou apresentar itens não validados como produtos.
const restrictedDescriptions: Record<string, string> = {
  'G-CHV-PAL-01': 'Direitos de personagem e licença do arquivo ainda não comprovados.',
  'G-CHV-GAT-01': 'Licença comercial e classificação como chaveiro ainda não comprovadas.',
  'G-CHV-MAS-01': 'Direitos de personagem e licença do arquivo ainda não comprovados.',
  'G-CHV-CAV-01': 'Autorização comercial do autor ainda não comprovada.',
  'G-CHV-MON-01': 'Direitos de personagem e licença do modelo ainda não comprovados.',
  'G-CHV-MAS-02': 'Direitos de personagem e licença comercial ainda não comprovados.',
  'G-CHV-MAO-01': 'Direitos de personagem, remix e licença comercial ainda não comprovados.',
  'G-CHV-ALI-01': 'Classificação como chaveiro e direitos da referência ainda não comprovados.',
  'G-CHV-BLO-01': 'Licença indicada para uso pessoal e direitos de terceiros pendentes.',
  'G-CHV-POL-01': 'Licença comercial e versão como chaveiro ainda não comprovadas.',
};

const editorialPreviews = keyringCandidates.filter(candidate => candidate.gate === 'EVIDENCE_PENDING');
const restrictedPreviews = keyringCandidates.filter(candidate => candidate.gate === 'HOLD_SPECIFIC_ACTION');

export default function KeyringPreview() {
  const [query, setQuery] = useState('');
  const matches = (candidate: (typeof keyringCandidates)[number]) => normalize(`${candidate.sku} ${candidate.name} ${candidate.collection} ${previewDescriptions[candidate.sku] ?? ''} ${restrictedDescriptions[candidate.sku] ?? ''}`).includes(normalize(query.trim()));
  const shown = editorialPreviews.filter(matches);
  const restrictedShown = restrictedPreviews.filter(matches);
  const totalShown = shown.length + restrictedShown.length;

  return (
    <section className="vx-preview-section" aria-labelledby="vx-preview-heading">
      <div className="section-heading">
        <div>
          <span className="vx-preview-eyebrow">Novidades · 21/09/2026</span>
          <h2 id="vx-preview-heading">Novas ideias para sua coleção.</h2>
          <p>Conheça os {keyringCandidates.length} SKUs da shortlist: {editorialPreviews.length} propostas em desenvolvimento e {restrictedPreviews.length} registros em revisão específica. Nenhum está disponível para encomenda.</p>
        </div>
      </div>
      <p className="vx-preview-alert">Vitrine informativa, não oferta comercial. Direitos de uso, fotografias REMIX, amostras, medidas, preços e prazos dependem de verificação individual. Não recebemos pedidos destes modelos.</p>
      <div className="vx-preview-search">
        <label htmlFor="vx-preview-query">Buscar novidades por nome ou SKU</label>
        <input id="vx-preview-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: fantasma, caveira, G-CHV" />
        <span aria-live="polite">{totalShown} {totalShown === 1 ? 'SKU encontrado' : 'SKUs encontrados'}</span>
      </div>
      {shown.length > 0 && (
        <div className="vx-preview-grid" aria-label="Modelos em desenvolvimento">
          {shown.map(candidate => (
            <article key={candidate.sku} className="vx-preview-card">
              <span className="vx-preview-status">Em desenvolvimento · sem venda</span>
              <span className="vx-preview-sku">{candidate.sku} · {candidate.collection}</span>
              <h3>{candidate.name}</h3>
              <p>{previewDescriptions[candidate.sku]}</p>
              <div className="vx-preview-asset">Imagem REMIX não incorporada ao site · não substituída por foto genérica</div>
            </article>
          ))}
        </div>
      )}
      <div className="vx-preview-restricted" aria-labelledby="vx-preview-restricted-heading">
        <h3 id="vx-preview-restricted-heading">Outros 10 SKUs · revisão específica</h3>
        <p>Incluídos nesta listagem informativa por determinação expressa do Founder. O registro de cada SKU não é anúncio de produto nem licença: imagens, links de modelos, fichas de compra e solicitações de encomenda permanecem indisponíveis.</p>
        {restrictedShown.length > 0 && (
          <div className="vx-preview-grid" aria-label="SKUs com pendências específicas">
            {restrictedShown.map(candidate => (
              <article key={candidate.sku} className="vx-preview-card vx-preview-card--restricted">
                <span className="vx-preview-status vx-preview-status--restricted">Em revisão · não disponível</span>
                <span className="vx-preview-sku">{candidate.sku} · {candidate.collection}</span>
                <h4>{candidate.name}</h4>
                <p>{restrictedDescriptions[candidate.sku]}</p>
                <div className="vx-preview-asset">Sem imagem, anúncio, preço, reserva ou encomenda. Pendência do SKU preservada.</div>
              </article>
            ))}
          </div>
        )}
      </div>
      {totalShown === 0 && <p className="vx-preview-empty">Nenhuma novidade corresponde à busca. Tente outro nome ou SKU.</p>}
      <p className="vx-preview-footer">Todos os {keyringCandidates.length} SKUs estão identificados na vitrine informativa. A inclusão dos {restrictedPreviews.length} registros em revisão não altera seus bloqueios nem configura aprovação comercial, licença, teste de fabricação ou disponibilidade.</p>
    </section>
  );
}
