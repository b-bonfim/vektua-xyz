import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight, BookOpenText, Heart, Sparkles } from 'lucide-react';
import PaxxMotion from './paxx-motion';
import PaxxReveals from './paxx-reveals';
import PaxxWish from './paxx-wish';
import styles from './paxx.module.css';

const media = '/images/campaigns/sebo-da-paxx/';
const instagram = 'https://www.instagram.com/sebodapaxx/';

export const metadata: Metadata = {
  title: { absolute: 'Um carinho entre páginas | Sebo da Paxx × Vektua XYZ' },
  description: 'Uma homenagem para quem escolheu um marcador de livro do Sebo da Paxx. Entre livros, cores e pequenas histórias, este carinho é para você.',
  alternates: { canonical: 'https://vektua.xyz/congrats/sebo-da-paxx' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vektua.xyz/congrats/sebo-da-paxx',
    title: 'Seu marcador guarda mais que a página. 💛 | Sebo da Paxx',
    description: 'Um pequeno agradecimento, feito com carinho para quem leva um pedacinho do universo da Paxx para casa.',
    images: [{ url: media + 'paxx-poster.webp', width: 1280, height: 720, alt: 'Paisagem ilustrada com casa amarela, céu azul e árvore de copa multicolorida.' }],
  },
};

function InstagramGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SeboDaPaxxCongratsPage() {
  return (
    <div className={styles.world} id="paxx-world" data-paxx-chapter="0">
      <PaxxMotion />
      <PaxxReveals />
      <a className={styles.skip} href="#recado">Ir direto ao agradecimento</a>
      <header className={styles.header}>
        <Link href="/" className={styles.back} aria-label="Voltar para o site Vektua XYZ">
          <ArrowLeft size={16} aria-hidden="true" /><span>VEKTUA XYZ</span>
        </Link>
        <a href="#recado" className={styles.wordmark} aria-label="Sebo da Paxx, ir para a homenagem">sebo da <strong>paxx.</strong></a>
        <a href={instagram} className={styles.headerSocial} target="_blank" rel="noopener noreferrer" aria-label="Visitar o Instagram do Sebo da Paxx, abre em nova guia">
          <InstagramGlyph size={17} /><span>Instagram</span><ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </header>
      <main>
        <section id="inicio" className={styles.scrollScene} data-paxx-scene aria-labelledby="paxx-title">
          <div className={styles.stickyStage}>
            <div className={styles.heroArt} aria-hidden="true">
              <div className={styles.poster} />
              <video className={styles.video} data-paxx-video muted playsInline preload="none" tabIndex={-1} aria-hidden="true" />
              <div className={styles.sceneVeil} />
            </div>
            <div className={styles.heroText}>
              <p className={styles.heroKicker}>UMA SURPRESA DO SEBO DA PAXX</p>
              <h1 id="paxx-title">Um pedacinho de sonho, <em>entre as páginas.</em></h1>
              <p>Esse marcador de livro trouxe você até aqui. Que bom.</p>
              <a href="#recado" className={styles.scrollLink}>Venha descobrir <ArrowDown size={18} aria-hidden="true" /></a>
            </div>
            <div className={styles.chapterText} aria-hidden="true">
              <p className={styles.chapter} data-paxx-caption="1">Cada página é um lugar <em>para se encantar.</em></p>
              <p className={styles.chapter} data-paxx-caption="2">E agora uma dessas histórias <em>segue com você.</em></p>
            </div>
            <div className={styles.heroMeta} aria-hidden="true">
              <span className={styles.heroMetaBrand}>SEBO DA PAXX <b>✳</b> VEKTUA XYZ</span>
              <span className={styles.scrollLabel}>Role devagar para entrar nessa história <ArrowDown size={15}/></span>
            </div>
            <div className={styles.loader} data-paxx-loader aria-hidden="true"><span className={styles.loaderRing} data-paxx-ring /><span className={styles.loaderText}>Carregando nosso pequeno mundo</span></div>
          </div>
        </section>

        <section id="recado" className={styles.letter} aria-labelledby="letter-title">
          <div className={styles.letterWrap}>
            <div className={styles.letterMarker} aria-hidden="true"><BookOpenText size={26} strokeWidth={1.4}/><span>UM RECADO PRA VOCÊ</span></div>
            <div className={styles.letterCard}>
              <span className={styles.letterStar} aria-hidden="true">✳</span>
              <p className={styles.salutation}>Oi, que bom que você chegou!</p>
              <h2 id="letter-title">Obrigada por deixar nossa história <em>encontrar a sua.</em></h2>
              <p>Seu marcador vai guardar o lugar onde você parou. E, quem sabe, lembrar que sempre existe uma nova história esperando por você.</p>
              <p>Escolher uma peça do Sebo da Paxx é também dar espaço para os livros, a arte e as pequenas descobertas que tornam os dias mais bonitos.</p>
              <p>Que ele acompanhe leituras demoradas, páginas favoritas e aquela vontade gostosa de ler só mais um pouquinho.</p>
              <p className={styles.letterClose}>Com carinho, <strong>Sebo da Paxx e Vektua XYZ</strong> <Heart size={19} fill="currentColor" aria-hidden="true" /></p>
            </div>
          </div>
        </section>

        <section className={styles.painting} aria-labelledby="painting-title">
          <div className={styles.paintingGrid}>
            <div className={styles.paintingCopy}>
              <p className={styles.sectionEyebrow}>SOBRE O MUNDO DA PAXX</p>
              <h2 id="painting-title">Tem lugar que parece <em>saído de um sonho.</em></h2>
              <p>Nas pinturas da Paxx, casinhas coloridas convivem com árvores enormes, pequenas luzes e azuis que parecem não ter fim.</p>
              <p>Esse olhar também inspira a atmosfera do Sebo: um cantinho cheio de livros, discos, cores e coisas que a gente só encontra quando resolve explorar.</p>
              <span className={styles.paintingNote}>O cenário desta página é uma animação inspirada no universo visual da artista.</span>
            </div>
            <figure className={styles.artFrame}>
              {/* A still from the chosen cinematic video, not presented as a photograph of a physical product. */}
              <img src={media + 'paxx-ending.webp'} alt="Paisagem ilustrada, inspirada nas obras da Paxx, com casinha amarela próxima e céu azul." width="1280" height="720" loading="lazy" decoding="async" />
              <figcaption>Um pequeno mundo para imaginar, descobrir e guardar.</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.wishSection} aria-labelledby="wish-title">
          <div className={styles.wishInner}>
            <Sparkles className={styles.wishSpark} size={35} strokeWidth={1.1} aria-hidden="true" />
            <p className={styles.sectionEyebrow}>UMA PEQUENA BRINCADEIRA</p>
            <h2 id="wish-title">Que sua próxima leitura <em>tenha um pouquinho de magia.</em></h2>
            <p>Antes de virar a página, guarde uma estrelinha para a história que vem por aí.</p>
            <PaxxWish />
          </div>
        </section>

        <section className={styles.follow} aria-labelledby="follow-title">
          <div className={styles.followInner}>
            <div className={styles.followAccent} aria-hidden="true">✳ ✺ ✳</div>
            <p className={styles.sectionEyebrow}>NOS VEMOS ENTRE UMA HISTÓRIA E OUTRA</p>
            <h2 id="follow-title">A casinha fica por aqui. <em>A porta está aberta.</em></h2>
            <p>Se quiser descobrir os próximos achados, os livros e as cores desse cantinho, a Paxx te espera no Instagram.</p>
            <a href={instagram} className={styles.primaryCta} target="_blank" rel="noopener noreferrer">
              <InstagramGlyph size={20} /> Conhecer o Sebo da Paxx <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <span className={styles.handle}>@sebodapaxx</span>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>Feito com carinho para quem ama histórias. <Heart size={14} fill="currentColor" aria-hidden="true" /></span>
          <Link href="/">Uma homenagem do Sebo da Paxx com a Vektua XYZ</Link>
        </div>
      </footer>
    </div>
  );
}
