'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import styles from '../congrats.module.css';

const VIDEO_SRC = '/images/campaigns/blind-rats/blind-rats-message.mp4';
const POSTER_SRC = '/images/campaigns/blind-rats/blind-rats-message-poster.jpg';

export default function BlindRatsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function startVideo() {
    const video = videoRef.current;
    if (!video || loading) return;

    setFailed(false);
    setLoading(true);

    if (!video.getAttribute('src')) {
      video.src = VIDEO_SRC;
      video.load();
    }

    try {
      await video.play();
      setStarted(true);
    } catch {
      setStarted(false);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.videoShell}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        poster={POSTER_SRC}
        preload="none"
        playsInline
        controls={started}
        onPlay={() => {
          setStarted(true);
          setLoading(false);
          setFailed(false);
        }}
        onError={() => {
          setStarted(false);
          setLoading(false);
          setFailed(true);
        }}
        aria-label="Mensagem em vídeo da Blind Rats"
      >
        Seu navegador não consegue reproduzir este vídeo.
      </video>

      {!started && (
        <button
          className={styles.videoPlay}
          type="button"
          onClick={startVideo}
          disabled={loading}
          aria-busy={loading}
        >
          <span className={styles.videoPrompt}>
            <span className={styles.videoPlayIcon} aria-hidden="true">
              <Play size={21} fill="currentColor" />
            </span>
            <span className={styles.videoPromptText}>
              <strong>{loading ? 'Carregando o recado…' : 'Ouvir o recado da Blind Rats'}</strong>
              <span role={failed ? 'status' : undefined}>
                {failed ? 'Não foi possível iniciar · tente novamente' : '10 segundos · com áudio'}
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
