import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Heart, MapPin, Music2 } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import { BrandFooter, BrandHeader } from '@/components/brand-shell-v2';
import styles from '../congrats.module.css';

const campaign = {
  name: 'Blind Rats',
  art: '/images/campaigns/blind-rats/blind-rats-badge.svg',
  hero: '/images/campaigns/blind-rats/blind-rats-hero.webp',
  instagram: 'https://www.instagram.com/blindratsband?stkn=Y3I2Z3J2M2FtdHBs',
};

export const metadata: Metadata = {
  title: 'Blind Rats — obrigado por apoiar a cena local',
  description: 'Uma mensagem da Blind Rats e da Vektua XYZ para quem escolheu apoiar uma banda local independente.',
  openGraph: {
    title: 'Blind Rats — obrigado por apoiar a cena local',
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
      <BrandHeader />
      <main id="conteudo" tabIndex={-1} className={styles.page}>
        <section
          className={`container ${styles.hero} ${styles.heroWithBackground}`}
          aria-labelledby="blind-rats-title"
        >
          <div className={styles.heroCopy}>
            <h1 id="blind-rats-title">
              Você apoiou uma cena.
              <span>Valeu por fazer parte dela.</span>
            </h1>
            <p className={styles.lead}>
              Este chaveiro da Blind Rats é uma peça pequena com um gesto grande: apoiar uma banda local
              independente. Obrigado por levar esse som com você.
            </p>

            <div className={styles.heroActions}>
              <InstagramButton />
              <Link className={styles.secondaryLink} href="/chaveiros">
                Conhecer os chaveiros Vektua
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <p className={styles.signature}>Blind Rats × Vektua XYZ</p>
          </div>

          <figure className={styles.logoStage}>
            <div className={styles.logoStageInner}>
              <ResponsiveImage
                src={campaign.art}
                alt="Logo oficial da Blind Rats fornecido pela banda para esta campanha"
                width={560}
                height={510}
                fetchPriority="high"
              />
            </div>

            <figcaption>
              <strong>Blind Rats</strong>
              <span>grunge local independente</span>
            </figcaption>
          </figure>
        </section>

        <section className={styles.impactSection} aria-labelledby="impact-title">
          <div className={`container ${styles.impactInner}`}>
            <div className={styles.impactIntro}>
              <h2 id="impact-title">Apoiar artista local faz a cena continuar em movimento.</h2>
              <p>
                Não é só sobre levar uma peça para casa. É sobre escolher quem cria perto de você e ajudar
                essa história a seguir circulando.
              </p>
            </div>

            <div className={styles.impactGrid}>
              <article>
                <Music2 aria-hidden="true" />
                <div>
                  <h3>A música continua circulando</h3>
                  <p>Seu apoio coloca mais energia em quem escolheu criar e compartilhar trabalho autoral.</p>
                </div>
              </article>
              <article>
                <MapPin aria-hidden="true" />
                <div>
                  <h3>A cena fica mais próxima</h3>
                  <p>Valorizar quem está por perto ajuda a manter viva a conexão entre artista e comunidade.</p>
                </div>
              </article>
              <article>
                <Heart aria-hidden="true" />
                <div>
                  <h3>O gesto ganha significado</h3>
                  <p>O chaveiro vira uma lembrança física de um som, de uma escolha e de uma história local.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={`container ${styles.followSection}`} aria-labelledby="follow-title">
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
        </section>
      </main>
      <BrandFooter />
    </>
  );
}
