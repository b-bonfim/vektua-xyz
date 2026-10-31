'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './links.module.css';

type Props = {
  pixKey: string;
  label: string;
  description: string;
};

export function CopyPixButton({ pixKey, label, description }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleCopy() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API indisponível');
      }
      await navigator.clipboard.writeText(pixKey);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }

  return (
    <div className={styles.pixItem}>
      <button
        type="button"
        className={`${styles.clientLink} ${styles.pixButton}`}
        data-kind="pix"
        onClick={handleCopy}
        aria-label="Copiar chave PIX da Vektua XYZ"
      >
        <span className={styles.linkIcon} aria-hidden="true">
          <span className={styles.pixGlyph}>PIX</span>
        </span>
        <span className={styles.linkCopy}>
          <strong>{copyState === 'copied' ? 'Chave PIX copiada!' : label}</strong>
          <small>{description}</small>
        </span>
        {copyState === 'copied' ? (
          <Check className={styles.externalIcon} size={20} aria-hidden="true" />
        ) : (
          <Copy className={styles.externalIcon} size={20} aria-hidden="true" />
        )}
      </button>
      <span role="status" aria-live="polite" className={styles.srOnly}>
        {copyState === 'copied' ? 'Chave PIX copiada para a área de transferência.' :
          copyState === 'error' ? 'Cópia automática indisponível. Selecione a chave PIX abaixo.' : ''}
      </span>
      {copyState === 'error' && (
        <label className={styles.pixFallback}>
          Não foi possível copiar automaticamente. Selecione a chave:
          <input
            readOnly
            aria-label="Chave PIX da Vektua XYZ para seleção manual"
            value={pixKey}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
