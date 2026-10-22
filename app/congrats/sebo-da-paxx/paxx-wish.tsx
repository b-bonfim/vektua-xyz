'use client';

import { useState } from 'react';
import styles from './paxx.module.css';

export default function PaxxWish() {
  const [saved, setSaved] = useState(false);
  return (
    <div className={styles.wishAction}>
      <button className={styles.wishButton} type="button" onClick={() => setSaved((value) => !value)} aria-pressed={saved}>
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
        {saved ? 'Estrelinha guardada' : 'Guardar uma estrelinha'}
      </button>
      <p className={styles.wishReply} role="status" aria-live="polite">
        {saved ? 'Prontinho. Que venham páginas lindas pela frente! ✨' : 'Um desejo pequenino, só seu.'}
      </p>
    </div>
  );
}
