import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import styles from './orion-tattoo.module.css';

const heroDesktop = '/images/campaigns/orion-tattoo/orion-tattoo-hero-desktop.avif';
const heroMobile = '/images/campaigns/orion-tattoo/orion-tattoo-hero-mobile.avif';

export const metadata: Metadata = {
  title: { absolute: 'Oiee! | Orion Tattoo — Arte, Pele e Liberdade' },
  description:
    'Oiee! Eu sou a Laura, da Orion Tattoo. Quero te agradecer por confiar na minha arte e fazer parte da minha história.',
  icons: { icon: [{ url: '/images/campaigns/orion-tattoo/orion-tattoo-icon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    siteName: 'Orion Tattoo',
    title: 'Oiee! Um recadinho da Laura, da Orion Tattoo',
    description:
      'Escrevi esse recadinho para agradecer por abrir espaço para a minha arte na sua história.',
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
                Que bom ter você <em>por aqui!</em>
              </h1>
              <p className={styles.heroLead}>
                Eu sou a Laura, da Orion Tattoo. Quis deixar esse recadinho para
                te agradecer por confiar no meu trabalho e abrir espaço para a arte
                fazer parte da sua história. Esse ímã é um carinho meu pra você.
                <strong> Obrigada de coração!</strong>
              </p>
              <a className={styles.heroExplore} href="#arte-na-pele">
                Deixa eu te contar por quê
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
              <h2 id="art-title">Eu acredito que cada pele <span>conta uma história.</span></h2>
            </div>
            <div className={styles.artStory}>
              <p>
                Tem obra de arte que mora na parede. Eu adoro a ideia de criar
                desenhos que possam acompanhar você por onde for.
              </p>
              <p>
                Às vezes tudo começa com uma lembrança, um símbolo, uma vontade de
                mudar ou simplesmente algo que você acha lindo. Gosto de escutar
                essas ideias e ajudar a transformá-las em traços com personalidade.
                O resultado é uma obra que ganha vida na sua própria pele.
              </p>
              <p className={styles.artAside}>Pra mim, tatuar é criar algo que faz parte de você.</p>
            </div>
          </div>
        </section>

        <section className={styles.inkSection} aria-labelledby="ink-title">
          <div className={`container ${styles.inkInner}`}>
            <h2 id="ink-title">Cada tatuagem tem seu jeito. <span>E eu adoro isso.</span></h2>
            <div className={styles.inkJourney}>
              <article>
                <h3>Eu escuto</h3>
                <p>Quero entender a sua ideia, seja ela cheia de significado ou só uma vontade gostosa de se expressar.</p>
              </article>
              <article>
                <h3>Eu desenho</h3>
                <p>Gosto de dar forma a essas ideias com linhas, detalhes e um olhar artístico para cada composição.</p>
              </article>
              <article>
                <h3>A arte acompanha você</h3>
                <p>Quando o desenho encontra a pele, deixa o estúdio e segue vivendo a sua história junto com você.</p>
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
            </div>
            <div className={styles.lauraText}>
              <p className={styles.lauraHello}>Esse é o meu cantinho</p>
              <h2 id="laura-title">Prazer, eu sou a <strong>Laura.</strong></h2>
              <p>
                Sou a pessoa por trás da Orion Tattoo. Esse espaço carrega meu jeito
                de olhar para a arte: com personalidade, sensibilidade e liberdade
                pra criar algo único junto com cada pessoa.
              </p>
              <p>
                Eu sei que uma tatuagem não é só uma imagem bonita. Ela vai fazer
                parte de você, e é por isso que cada desenho importa tanto pra mim.
                Obrigada por me deixar participar de algo tão pessoal.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.thanksSection} aria-labelledby="thanks-title">
          <div className={`container ${styles.thanksInner}`}>
            <h2 id="thanks-title">Obrigada por abrir espaço pra minha arte na sua vida.</h2>
            <p>
              Guarda esse ímã com carinho! Toda vez que olhar pra ele, espero
              que você lembre do quanto a arte pode ser pessoal e especial.
              Seu apoio e sua confiança significam muito pra mim.
            </p>
            <p className={styles.closingSignature}>Com carinho, <strong>Laura · Orion Tattoo</strong></p>
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
