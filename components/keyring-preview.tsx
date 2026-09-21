'use client';

import { useState } from 'react';
import { keyringCandidates } from '@/lib/keyring-candidates';
import { normalize } from '@/lib/catalog';

/**
 * Aprovação editorial do Founder em 21/09/2026: atualizar a vitrine do site.
 * Não equivale à liberação comercial, licença de terceiros, ensaio físico ou foto validada.
 * Itens HOLD_SPECIFIC_ACTION não são anunciados aqui.
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

const editorialPreviews = keyringCandidates.filter(candidate => candidate.gate === 'EVIDENCE_PENDING');

export default function KeyringPreview() {
  const [query, setQuery] = useState('');
  const shown = editorialPreviews.filter(candidate => normalize(`${candidate.sku} ${candidate.name} ${candidate.collection} ${previewDescriptions[candidate.sku] ?? ''}`).includes(normalize(query.trim())));

  return (
    <section className="vx-preview-section" aria-labelledby="vx-preview-heading">
      <div className="section-heading">
        <div>
          <span className="vx-preview-eyebrow">Novidades · 21/09/2026</span>
          <h2 id="vx-preview-heading">Novas ideias para sua coleção.</h2>
          <p>Conheça {editorialPreviews.length} modelos em desenvolvimento. Esta prévia é informativa: nenhuma peça abaixo está disponível para encomenda.</p>
        </div>
      </div>
      <p className="vx-preview-alert">Prévia de catálogo, não oferta comercial. Fotos REMIX, direitos de uso, amostras, medidas, preços e prazos ainda dependem de verificação. Não recebemos pedidos destes modelos.</p>
      <div className="vx-preview-search">
        <label htmlFor="vx-preview-query">Buscar novidades por nome ou SKU</label>
        <input id="vx-preview-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: fantasma, múmia, esqueleto" />
        <span aria-live="polite">{shown.length} {shown.length === 1 ? 'modelo em prévia' : 'modelos em prévia'}</span>
      </div>
      {shown.length ? (
        <div className="vx-preview-grid">
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
      ) : (
        <p className="vx-preview-empty">Nenhuma novidade corresponde à busca. Tente outro nome ou SKU.</p>
      )}
      <p className="vx-preview-footer">Outros {keyringCandidates.length - editorialPreviews.length} candidatos permanecem fora da vitrine por pendências específicas de direitos, licença ou classificação. Inclusão editorial não libera comercialização.</p>
    </section>
  );
}
