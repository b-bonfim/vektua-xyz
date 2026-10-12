import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight, Heart, MapPin, Sparkles } from 'lucide-react';
import ResponsiveImage from '@/components/responsive-image';
import PadocaMotion from './padoca-motion';
import styles from './padoca.module.css';

const instagram = 'https://www.instagram.com/apadocasrs/';
const asset = '/images/campaigns/a-padoca/';

export const metadata: Metadata = {
  title: { absolute: 'Um carinho da A Padoca | A Padoca × Vektua XYZ' },
  description:
    'Parabéns pelo seu chaveiro! Uma pequena lembrança da A Padoca e um convite para valorizar o artesanal e os negócios da nossa cidade.',
  openGraph: {
    title: 'Você levou um pedacinho da Padoca com você 💛',
    description: 'Uma surpresa feita com carinho. Obrigado por apoiar quem faz e quem empreende pertinho de você.',
    images: [{ url: asset + 'baguette.webp', width: 1000, height: 750, alt: 'Chaveiro artesanal em formato de baguete' }],
  },
};

function InstagramLink({ small = false }: { small?: boolean }) {
  return (
    <a
      className={small ? styles.instagramSmall : styles.instagramButton}
      href={instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conhecer A Padoca no Instagram @apadocasrs, abre em nova guia"
    >
      <span>{small ? '@apadocasrs' : 'Conhecer a Padoca no Instagram'}</span>
      <ArrowUpRight size={small ? 17 : 21} aria-hidden="true" />
    </a>
  );
}

function Flower({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <ellipse cx="60" cy="29" rx="18" ry="27" />
        <ellipse cx="60" cy="91" rx="18" ry="27" />
        <ellipse cx="29" cy="60" rx="27" ry="18" />
        <ellipse cx="91" cy="60" rx="27" ry="18" />
        <ellipse cx="38" cy="38" rx="17" ry="24" transform="rotate(-45 38 38)" />
        <ellipse cx="82" cy="38" rx="17" ry="24" transform="rotate(45 82 38)" />
        <ellipse cx="38" cy="82" rx="17" ry="24" transform="rotate(45 38 82)" />
        <ellipse cx="82" cy="82" rx="17" ry="24" transform="rotate(-45 82 82)" />
      </g>
      <circle cx="60" cy="60" r="21" fill="#FFD43B" stroke="#184A9D" strokeWidth="4" />
    </svg>
  );
}

export default function PadocaCongratsPage() {
  return (
    <div className={styles.world} id="padoca-world">
      <PadocaMotion />
      <a href="#mensagem" className={styles.skipLink}>Ir para a mensagem</a>

      <header className={styles.header}>
        <Link href="/" className={styles.host} aria-label="Voltar para Vektua XYZ">
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Vektua XYZ</span>
        </Link>
        <a href="#mensagem" className={styles.padocaMark} aria-label="A Padoca, início da campanha">
          A <span>Padoca</span><small>PADARIA</small>
        </a>
        <InstagramLink small />
      </header>

      <main>
        <section className={styles.scrollScene} data-padoca-scene aria-labelledby="padoca-title">
          <div className={styles.sceneSticky}>
            <div className={styles.sceneSky} aria-hidden="true">
              <div className={styles.sun} />
              <div className={styles.sunEcho} />
              <Flower className={styles.flowerLeft} />
              <Flower className={styles.flowerRight} />
              <span className={styles.dashOne} />
              <span className={styles.dashTwo} />
              <span className={styles.dashThree} />
              <span className={styles.dotField} />
            </div>
            <div className={styles.sceneGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.cheers}>Obaaa!</p>
                <h1 id="padoca-title">Esse pedacinho <em>é seu.</em></h1>
                <p className={styles.intro}>
                  Parabéns pelo seu chaveiro! Uma lembrança para guardar no bolso, levar por aí e lembrar
                  que as coisas feitas com carinho têm um sabor todo especial.
                </p>
                <a className={styles.scrollPrompt} href="#mensagem">
                  Descubra a história desse mimo <ArrowDown size={19} aria-hidden="true" />
                </a>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.photoOrbit}>
                  <div className={styles.photoFrame}>
                    <ResponsiveImage
                      src={asset + 'baguette.webp'}
                      alt="Chaveiro em formato de baguete, fotografado sobre mesa de madeira"
                      width={1000} height={750} loading="eager" fetchPriority="high"
                    />
                  </div>
                  <span className={styles.orbitStamp}>UM MIMO DA PAD OCA <b>♥</b></span>
                </div>
                <svg className={styles.flightLine} viewBox="0 0 640 210" fill="none" aria-hidden="true">
                  <path d="M12 170 C92 22 196 212 312 91 C417 -22 516 60 626 28" stroke="currentColor" strokeWidth="4" strokeDasharray="9 15" strokeLinecap="round"/>
                  <path d="M607 16L629 27L614 48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className={styles.storyCaptions} aria-hidden="true">
              <p className={styles.storyCaption} data-padoca-caption="0">Um mimo que nasce do encontro entre criatividade e afeto.</p>
              <p className={styles.storyCaption} data-padoca-caption="1">Feito com tempo, cuidado e um toque de personalidade.</p>
              <p className={styles.storyCaption} data-padoca-caption="2">Escolher o local faz essa história continuar.</p>
            </div>
            <div className={styles.sceneBottom} aria-hidden="true"><span>Role para viver esta história</span><span>A Padoca × Vektua XYZ</span></div>
          </div>
        </section>

        <section className={styles.letterSection} id="mensagem" aria-labelledby="letter-title">
          <div className={styles.letterInner}>
            <div className={styles.letterTitle}>
              <span className={styles.sketchHeart} aria-hidden="true">♡</span>
              <h2 id="letter-title">Tem carinho que cabe <em>na palma da mão.</em></h2>
            </div>
            <div className={styles.letterBody}>
              <p>
                Que alegria ter você aqui! Esse chaveirinho foi pensado para acompanhar os seus dias
                e deixar um sorriso pelo caminho.
              </p>
              <p>
                Na Padoca, acreditamos no valor dos pequenos detalhes. Na escolha de quem faz,
                no encontro entre pessoas e naquela sensação boa de encontrar algo que tem a ver com a gente.
              </p>
              <p className={styles.letterSignature}>Aproveite seu mimo. Ele é todinho seu! <span>♥</span></p>
            </div>
          </div>
        </section>

        <section className={styles.localSection} aria-labelledby="local-title">
          <div className={styles.localInner}>
            <div className={styles.localHeading}>
              <h2 id="local-title">Quando você escolhe um negócio local, <em>a cidade floresce.</em></h2>
              <p>Seu gesto faz diferença para quem cria, trabalha e compartilha seu talento bem pertinho de você.</p>
            </div>
            <div className={styles.reasons}>
              <article>
                <Heart size={30} aria-hidden="true" strokeWidth={1.8} />
                <h3>Você valoriza quem faz</h3>
                <p>Por trás de cada pequeno negócio existem pessoas, escolhas e muito trabalho de verdade.</p>
              </article>
              <article>
                <MapPin size={30} aria-hidden="true" strokeWidth={1.8} />
                <h3>Você fortalece o bairro</h3>
                <p>Comprar de quem está por perto ajuda a manter o comércio e os encontros da nossa comunidade vivos.</p>
              </article>
              <article>
                <Sparkles size={30} aria-hidden="true" strokeWidth={1.8} />
                <h3>Você leva algo com história</h3>
                <p>O artesanal tem o toque de quem pensou, preparou e cuidou de cada etapa.</p>
              </article>
            </div>
            <Flower className={styles.localFlower} />
          </div>
        </section>

        <section className={styles.gallerySection} aria-labelledby="gallery-title">
          <div className={styles.galleryHeading}>
            <h2 id="gallery-title">Pequenos achados. <em>Grandes sorrisos.</em></h2>
            <p>Um pouquinho da coleção de chaveiros que ganhou vida nessa parceria.</p>
          </div>
          <div className={styles.galleryGrid}>
            <figure className={styles.galleryTall}>
              <ResponsiveImage src={asset + 'strawberry-pie.webp'} alt="Chaveiro de tortinha com morangos, sobre uma superfície de madeira" width={1000} height={750} loading="lazy" />
              <figcaption>Um docinho para carregar por aí</figcaption>
            </figure>
            <figure className={styles.gallerySmall}>
              <ResponsiveImage src={asset + 'croissant.webp'} alt="Chaveiro em formato de croissant sobre uma mesa" width={1000} height={750} loading="lazy" />
              <figcaption>Detalhes cheios de charme</figcaption>
            </figure>
            <figure className={styles.gallerySmall}>
              <ResponsiveImage src={asset + 'cookie.webp'} alt="Chaveiro em formato de biscoito" width={1000} height={750} loading="lazy" />
              <figcaption>Um mimo com personalidade</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.finalSection} aria-labelledby="final-title">
          <div className={styles.finalInner}>
            <Flower className={styles.finalFlower} />
            <p className={styles.finalPrelude}>O próximo encontro pode ser ainda mais gostoso.</p>
            <h2 id="final-title">A gente se vê <em>na Padoca!</em></h2>
            <p>Venha conhecer as novidades, acompanhar as fornadas e ficar pertinho das histórias que acontecem por lá.</p>
            <InstagramLink />
            <span className={styles.socialNote}>Perfil oficial da A Padoca no Instagram, abre em nova guia.</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>Uma lembrança da</span>
          <strong>A Padoca</strong>
        </div>
        <div className={styles.footerRight}>
          <span>Em parceria com</span>
          <Link href="/" aria-label="Conhecer a Vektua XYZ">
            <ResponsiveImage src="/brand/vektua-wordmark.svg" alt="Vektua XYZ" width={155} height={45} loading="lazy" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
