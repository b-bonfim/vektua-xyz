import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import styles from './orion-tattoo.module.css';

const heroDesktop = '/images/campaigns/orion-tattoo/orion-tattoo-hero-desktop.avif';
const heroMobile = '/images/campaigns/orion-tattoo/orion-tattoo-hero-mobile.avif';

export const metadata: Metadata = {
  title: 'Oiee! | Orion Tattoo — Arte, Pele e Liberdade',
  description:
    'Um carinho da Orion Tattoo para você. Conheça a mensagem da Laura e celebre a arte que nasce de uma ideia e ganha vida na pele.',
  openGraph: {
    title: 'Oiee! Um carinho da Orion Tattoo',
    description:
      'Arte, pele e liberdade: uma mensagem especial da Orion Tattoo e da Laura para você.',
  },
};

export default function OrionTattooCongratsPage() {
  return (
    <div className={styles.campaign}>
      <a className={styles.skipLink} href="#conteudo">Pular para a mensagem</a>

      <header className={styles.studioHeader}>
        <div className={`container ${styles.headerInner}`}>
          <a className={styles.studioMark} href="#conteudo" aria-label="Orion Tattoo — voltar ao início desta página">
            <span>ORION</span>
            <span>TATTOO</span>
            <Sparkles size={19} strokeWidth={1.7} aria-hidden="true" />
          </a>
          <span className={styles.headerMotto}>Arte <i /> Pele <i /> Liberdade</span>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="orion-hero-title">

          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.hello}>Oiee!</p>
              <h1 id="orion-hero-title">
                A arte fica mais bonita quando <em>encontra você.</em>
              </h1>
              <p className={styles.heroLead}>
                Parabéns por valorizar o trabalho da Laura e fazer parte da história da Orion Tattoo.
                Este pequeno presente é nossa forma de dizer <strong>obrigada!</strong>
              </p>
              <a className={styles.heroExplore} href="#arte-na-pele">
                Descubra o que ele celebra
                <ArrowDown size={19} aria-hidden="true" />
              </a>
            </div>
          </div>
          <picture className={styles.heroArtwork}>
            <source srcSet={heroMobile} media="(max-width: 1040px)" type="image/avif" />
            <ResponsiveImage
              src={heroDesktop}
              alt="Musa ilustrada da Orion Tattoo com cabelos azuis esvoaçantes, estrelas douradas, uma lua e o nome do estúdio."
              width={1440}
              height={811}
              fetchPriority="high"
              loading="eager"
            />
          </picture>
        </section>

        <section id="arte-na-pele" className={styles.artSection} aria-labelledby="art-title">
          <div className={`container ${styles.artGrid}`}>
            <div className={styles.artIntroduction}>
              <Sparkles className={styles.artSparkle} size={45} strokeWidth={1.4} aria-hidden="true" />
              <h2 id="art-title">Uma ideia. Um desenho. <span>Uma parte de você.</span></h2>
            </div>
            <div className={styles.artStory}>
              <p>
                Existem obras de arte que a gente admira na parede. Outras, a gente escolhe levar na pele.
              </p>
              <p>
                Cada tatuagem começa com algo que faz sentido para alguém: uma lembrança,
                um sentimento, uma paixão ou simplesmente a liberdade de ser quem se é.
                Com o desenho, essas ideias encontram forma; na pele, encontram um lugar só delas.
              </p>
              <p className={styles.artAside}>Arte que acompanha você — do seu jeito.</p>
            </div>
          </div>
        </section>

        <section className={styles.inkSection} aria-labelledby="ink-title">
          <div className={`container ${styles.inkInner}`}>
            <h2 id="ink-title">Não é só tinta. <span>É expressão.</span></h2>
            <div className={styles.inkJourney}>
              <article>
                <span className={styles.journeyStar} aria-hidden="true"><Sparkles size={21} strokeWidth={1.7} /></span>
                <h3>A ideia</h3>
                <p>Um detalhe, um símbolo ou uma história que merece ganhar forma.</p>
              </article>
              <article>
                <span className={styles.journeyStar} aria-hidden="true"><Sparkles size={21} strokeWidth={1.7} /></span>
                <h3>O traço</h3>
                <p>O encontro entre imaginação, desenho e o olhar de quem cria.</p>
              </article>
              <article>
                <span className={styles.journeyStar} aria-hidden="true"><Sparkles size={21} strokeWidth={1.7} /></span>
                <h3>A pele</h3>
                <p>Uma tela viva, única, que leva a obra e seu significado por onde você for.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.lauraSection} aria-labelledby="laura-title">
          <div className={`container ${styles.lauraInner}`}>
            <div className={styles.lauraPortrait} aria-hidden="true">
              <span>ARTE</span>
              <span>PELE</span>
              <span>LIBERDADE</span>
              <Sparkles size={58} strokeWidth={1.25} />
            </div>
            <div className={styles.lauraText}>
              <p className={styles.lauraHello}>Por trás de cada traço</p>
              <h2 id="laura-title">Tem o olhar da <strong>Laura.</strong></h2>
              <p>
                A Orion Tattoo tem a personalidade de quem vive a arte de perto.
                Laura dá forma a ideias e faz do desenho um encontro entre estética,
                significado e a liberdade de cada pessoa se expressar.
              </p>
              <p>
                Seu carinho, sua confiança e cada projeto compartilhado fazem parte dessa história.
                É isso que queremos celebrar com você hoje.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.thanksSection} aria-labelledby="thanks-title">
          <div className={`container ${styles.thanksInner}`}>
            <Sparkles className={styles.thanksStar} size={37} strokeWidth={1.3} aria-hidden="true" />
            <h2 id="thanks-title">Obrigada por deixar a arte fazer parte da sua história.</h2>
            <p>
              Que este ímã seja uma lembrança do que a Orion Tattoo mais ama:
              transformar ideias em desenhos, desenhos em arte na pele
              e pequenos momentos em algo especial.
            </p>
            <p className={styles.closingSignature}>Com carinho, <strong>Orion Tattoo</strong></p>
          </div>
        </section>
      </main>

      <footer className={styles.studioFooter}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.footerOrion}>
            <strong>ORION TATTOO</strong>
            <span>Arte <i /> Pele <i /> Liberdade</span>
          </div>
          <div className={styles.footerCredit}>
            <span>Um presente produzido por</span>
            <Link href="/" aria-label="Conhecer a Vektua XYZ">
              Vektua XYZ <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <Link className={styles.backLink} href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar à Vektua
          </Link>
        </div>
      </footer>
    </div>
  );
}
