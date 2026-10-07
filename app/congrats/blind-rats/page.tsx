import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, MapPin, Music2 } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import { BrandFooter, BrandHeader } from '@/components/brand-shell-v2';
import styles from '../congrats.module.css';

const campaign = {
  name: 'Blind Rats',
  art: '/images/campaigns/blind-rats/blind-rats-badge.svg',
  socialLinks: [] as Array<{ label: string; href: string }>,
};

export const metadata: Metadata = {
  title: 'Blind Rats — obrigado por apoiar a cena local',
  description: 'Uma mensagem da Blind Rats e da Vektua XYZ para quem escolheu apoiar uma banda local independente.',
  openGraph: {
    title: 'Blind Rats — obrigado por apoiar a cena local',
    description: 'Você levou mais que um chaveiro: levou um pedaço da cena local com você.',
  },
};

export default function BlindRatsCongratsPage() {
  return (
    <>
      <BrandHeader />
      <main id="conteudo" tabIndex={-1} className={styles.page}>
        <section className={`container ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span aria-hidden="true" />
              {campaign.name} × Vektua XYZ
            </p>
            <h1>
              Você não comprou só um chaveiro.
              <strong> Você apoiou uma cena.</strong>
            </h1>
            <p className={styles.lead}>
              Ao adquirir este chaveiro da Blind Rats, você escolheu apoiar uma banda local independente —
              e isso merece um obrigado de verdade.
            </p>
            <p className={styles.note}>
              Obrigado por transformar seu gosto por música em apoio a quem cria, ensaia, toca e mantém a
              cena local viva.
            </p>
          </div>

          <div className={styles.posterWrap} aria-label="Identidade visual da Blind Rats">
            <div className={styles.poster}>
              <span className={styles.posterEyebrow}>LOCAL · INDEPENDENTE · GRUNGE</span>
              <div className={styles.logoFrame}>
                <ResponsiveImage
                  src={campaign.art}
                  alt="Arte da Blind Rats com um rato usando óculos e o nome da banda"
                  width={800}
                  height={800}
                  fetchPriority="high"
                />
              </div>
              <span className={styles.posterFooter}>SANTA RITA DO SAPUCAÍ · MG</span>
            </div>
          </div>
        </section>

        <section className={styles.echoSection}>
          <div className={`container ${styles.echoInner}`}>
            <div className={styles.sectionIntro}>
              <p className={styles.inverseKicker}>ISSO VAI ALÉM DO CHAVEIRO</p>
              <h2>Quando você apoia um artista independente, o gesto ecoa.</h2>
            </div>

            <div className={styles.echoGrid}>
              <article>
                <Music2 aria-hidden="true" />
                <h3>Mais perto da música</h3>
                <p>Seu apoio ajuda o trabalho autoral a continuar circulando e encontrando novas pessoas.</p>
              </article>
              <article>
                <MapPin aria-hidden="true" />
                <h3>Mais força para a cena local</h3>
                <p>A cena cresce quando quem está por perto escolhe participar, compartilhar e valorizar.</p>
              </article>
              <article>
                <Heart aria-hidden="true" />
                <h3>Mais que merch</h3>
                <p>Uma peça pequena pode carregar a lembrança de um som, de um show e de uma história que é sua.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={`container ${styles.thanks}`}>
          <div className={styles.thanksMark} aria-hidden="true">BR</div>
          <div className={styles.thanksCopy}>
            <p className={styles.kicker}>
              <span aria-hidden="true" />
              DE QUEM FAZ, PARA QUEM APOIA
            </p>
            <h2>Valeu por fazer parte.</h2>
            <p>
              Seu apoio chegou até aqui — e agora essa peça segue com você. Que ela seja um lembrete de que
              música independente também se fortalece nas pequenas escolhas.
            </p>

            {campaign.socialLinks.length > 0 && (
              <div className={styles.socialLinks} aria-label="Redes oficiais da Blind Rats">
                {campaign.socialLinks.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <Link className="button" href="/chaveiros">
                Conhecer os chaveiros
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className={styles.textLink} href="/">
                Conhecer a Vektua XYZ
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BrandFooter />
    </>
  );
}
