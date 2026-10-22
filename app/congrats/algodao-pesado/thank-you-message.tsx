'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import styles from './algodao-pesado.module.css';

// The mascot video is a SEPARATE asset from the silent hero scroll film.
// Media and poster are committed in this campaign update. No autoplay: the visitor requests the dialogue.
const VIDEO_AVAILABLE = true;
const VIDEO_SRC = '/images/campaigns/algodao-pesado/diego-mascot-thank-you.mp4';
const POSTER_SRC = '/images/campaigns/algodao-pesado/diego-mascot-thank-you-poster.webp';

export default function ThankYouMessage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function playMessage() {
    const video = videoRef.current;
    if (!video || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      if (!video.getAttribute('src')) {
        video.src = VIDEO_SRC;
        video.load();
      }
      await video.play();
      setStarted(true);
    } catch {
      setStarted(false);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  if (!VIDEO_AVAILABLE) {
    return (
      <div className={styles.messageStill}>
        <span className={styles.messageStillKicker}>DO DIEGO E DA ALGODÃO PESADO</span>
        <strong>O NOSSO MUITO OBRIGADO VAI PRA VOCÊ! 🤘</strong>
        <p>Por cada incentivo, cada gesto de amizade e cada vez que você fortaleceu nossa história: valeu mesmo!</p>
        <span className={styles.messageStillSignature}>ALGODÃO PESADO ROCKWEAR</span>
      </div>
    );
  }

  return (
    <div className={styles.messageVideo}>
      <video
        ref={videoRef}
        poster={POSTER_SRC}
        preload="none"
        playsInline
        controls={started}
        onPlay={() => { setStarted(true); setFailed(false); setLoading(false); }}
        onError={() => { setStarted(false); setFailed(true); setLoading(false); }}
        aria-label="Mensagem de agradecimento do mascote da Algodão Pesado em nome do Diego"
      >
        Seu navegador não consegue reproduzir este vídeo.
      </video>
      {!started && (
        <button type="button" className={styles.messagePlay} onClick={playMessage} disabled={loading} aria-busy={loading}>
          <span className={styles.messagePlayIcon}><Play size={24} fill="currentColor" aria-hidden="true" /></span>
          <span>{loading ? 'Carregando o recado…' : 'Ouvir o recado da Algodão Pesado'}</span>
          <small role={failed ? 'status' : undefined}>{failed ? 'Não foi possível iniciar. Tente novamente.' : 'Mensagem especial • com áudio'}</small>
        </button>
      )}
    </div>
  );
}
