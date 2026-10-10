import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, MapPin, Music2 } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import BlindRatsScrollHero from './blind-rats-scroll-hero';
import BlindRatsVideo from './blind-rats-video';
import styles from '../congrats.module.css';

const campaign = {
  name: 'Blind Rats',
  art: '/images/campaigns/blind-rats/blind-rats-badge.svg',
  instagram: 'https://www.instagram.com/blindratsband?stkn=Y3I2Z3J2M2FtdHBs',
};

export const metadata: Metadata = {
  title: 'Blind Rats | obrigado por apoiar a cena local',
  description: 'Uma mensagem da Blind Rats e da Vektua XYZ para quem escolheu apoiar uma banda local independente.',
  openGraph: {
    title: 'Blind Rats | obrigado por apoiar a cena local',
    description: 'Você levou mais que um chaveiro: levou um pedaço da cena local com você.',
  },
};

function InstagramButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`${styles.instagramButton} ${compact ? styles.instagramButtonCompact : ''}`}
      href={campaign.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Seguir @blindratsband no Instagram; abre em uma nova guia"
    >
      <span>Seguir @blindratsband</span>
      <ArrowUpRight className={styles.externalIcon} size={18} aria-hidden="true" />
    </a>
  );
}

export default function BlindRatsCongratsPage() {
  return (
    <>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className={styles.campaignHeader} aria-label="Página especial Blind Rats">
        <div className={`container ${styles.campaignHeaderInner}`}>
          <Link className={styles.hostLink} href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            <span>Vektua XYZ</span>
          </Link>

          <Link className={styles.campaignBrand} href="#conteudo" aria-label="Blind Rats, início da página">
            <ResponsiveImage src={campaign.art} alt="Blind Rats" width={72} height={66} fetchPriority="high" />
          </Link>

          <a
            className={styles.headerSocial}
            href={campaign.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir @blindratsband no Instagram em uma nova guia"
          >
            <span>@blindratsband</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className={styles.scrollProgress} aria-hidden="true" />

      <main id="conteudo" tabIndex={-1} className={styles.page}>
        <BlindRatsScrollHero instagram={campaign.instagram} />

        <section className={styles.messageSection} aria-labelledby="message-title">
          <div className={`container ${styles.messageGrid}`}>
            <div className={styles.messageCopy}>
              <span className={styles.messageEyebrow}>Recado da banda</span>
              <h2 id="message-title">Agora dá o play.</h2>
              <p>
                O scroll conta a história sem som. Aqui, o recado da Blind Rats continua com áudio quando você pedir.
              </p>
            </div>

            <figure className={styles.messageVideo}>
              <BlindRatsVideo />
              <figcaption>10 segundos · com áudio</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.manifestoSection} aria-labelledby="impact-title">
          <div className={`container ${styles.manifestoLayout}`}>
            <div className={styles.manifestoSticky}>
              <h2 id="impact-title">
                Apoiar artista local faz a cena continuar <span>em movimento.</span>
              </h2>
              <p>
                Escolher quem cria perto de você ajuda essa história a seguir circulando. O chaveiro vira uma lembrança
                física desse gesto.
              </p>
            </div>

            <div className={styles.impactRows}>
              <article>
                <Music2 aria-hidden="true" />
                <h3>A música continua circulando</h3>
                <p>Seu apoio coloca mais energia em quem escolheu criar e compartilhar trabalho autoral.</p>
              </article>

              <article>
                <MapPin aria-hidden="true" />
                <h3>A cena fica mais próxima</h3>
                <p>Valorizar quem está por perto ajuda a manter viva a conexão entre artista e comunidade.</p>
              </article>

              <article>
                <Heart aria-hidden="true" />
                <h3>O gesto ganha significado</h3>
                <p>O chaveiro vira uma lembrança física de um som, de uma escolha e de uma história local.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.followSection} aria-labelledby="follow-title">
          <div className={`container ${styles.followInner}`}>
            <div className={styles.followCopy}>
              <h2 id="follow-title">Agora, cola com a Blind Rats também no feed.</h2>
              <p>
                Siga <strong>@blindratsband</strong> no Instagram e acompanhe de perto o que a banda publicar por lá.
              </p>
            </div>

            <div className={styles.followAction}>
              <InstagramButton compact />
              <span>O perfil abre em uma nova guia.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.campaignFooter}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerIdentity}>
            <ResponsiveImage
              src={campaign.art}
              alt=""
              width={48}
              height={44}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              aria-hidden="true"
            />
            <span>Blind Rats × Vektua XYZ</span>
          </div>

          <Link className={styles.vektuaLink} href="/">
            Conhecer a Vektua XYZ
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </>
  );
}
