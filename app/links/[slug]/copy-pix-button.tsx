'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './links.module.css';

type Props = {
  ownerName: string;
  showOfficialPixIcon?: boolean;
  pixKey: string;
  label: string;
  description: string;
};

export function CopyPixButton({ ownerName, showOfficialPixIcon = false, pixKey, label, description }: Props) {
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
        aria-label={`Copiar chave PIX de ${ownerName}. ${description}`}
      >
        <span className={styles.linkIcon} aria-hidden="true">
          {showOfficialPixIcon ? (
            <svg width="30" height="30" viewBox="0 0 362 362" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
              <g fill="#00BEAF">
                <path d="M187 0 L165 2 L147 11 L74 84 L89 84 L99 86 L119 97 L176 155 L180 157 L185 157 L189 155 L249 95 L261 88 L270 85 L287 85 L271 67 L215 12 L202 4 Z" />
                <path d="M0 184 L1 193 L9 211 L56 260 L89 260 L103 255 L167 192 L180 187 L193 189 L198 192 L257 251 L264 256 L276 260 L304 260 L350 214 L359 196 L361 174 L357 159 L349 146 L304 101 L277 101 L264 105 L256 111 L197 170 L186 174 L175 173 L166 168 L111 112 L100 104 L90 101 L57 101 L11 147 L5 157 L1 168 Z" />
                <path d="M185 204 L178 205 L119 264 L109 271 L96 276 L75 277 L91 295 L146 349 L159 357 L175 361 L196 359 L206 355 L215 349 L287 277 L267 275 L252 268 L188 205 Z" />
              </g>
            </svg>
          ) : (
            <span className={styles.pixGlyph}>PIX</span>
          )}
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
            aria-label={`Chave PIX de ${ownerName} para seleção manual`}
            value={pixKey}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
