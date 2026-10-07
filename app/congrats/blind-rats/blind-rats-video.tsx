'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import styles from '../congrats.module.css';

const VIDEO_SRC = '/images/campaigns/blind-rats/blind-rats-message.mp4';
const POSTER_SRC = '/images/campaigns/blind-rats/blind-rats-message-poster.jpg';

export default function BlindRatsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function startVideo() {
    const video = videoRef.current;
    if (!video) return;

    setFailed(false);
    setStarted(true);

    try {
      await video.play();
    } catch {
      setStarted(false);
      setFailed(true);
    }
  }

  return (
    <div className={styles.videoShell}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        poster={POSTER_SRC}
        preload="metadata"
        playsInline
        controls={started}
        onPlay={() => {
          setStarted(true);
          setFailed(false);
        }}
        onError={() => {
          setStarted(false);
          setFailed(true);
        }}
        aria-label="Mensagem em vídeo da Blind Rats"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
        Seu navegador não consegue reproduzir este vídeo.
      </video>

      {!started && (
        <button className={styles.videoPlay} type="button" onClick={startVideo}>
          <span className={styles.videoPrompt}>
            <span className={styles.videoPlayIcon} aria-hidden="true">
              <Play size={21} fill="currentColor" />
            </span>
            <span className={styles.videoPromptText}>
              <strong>Ouvir o recado da Blind Rats</strong>
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
