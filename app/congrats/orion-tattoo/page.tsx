import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandFooter, BrandHeader } from '@/components/brand-shell-v2';
import styles from './orion-tattoo.module.css';

export const metadata: Metadata = {
  title: 'Orion Tattoo — obrigado por apoiar arte local',
  description:
    'Uma mensagem da Orion Tattoo, da artista Laura e da Vektua XYZ para quem escolhe apoiar arte local independente.',
  openGraph: {
    title: 'Orion Tattoo — arte na pele, liberdade no traço',
    description:
      'Parabéns por apoiar uma artista local independente e ajudar a manter a arte autoral em movimento.',
  },
};

export default function OrionTattooCongratsPage() {
  return (
    <>
      <BrandHeader />
      <main id="conteudo" tabIndex={-1} className={styles.page}>
        <section className={`container ${styles.hero}`} aria-labelledby="orion-title">
          <div className={styles.heroCopy}>
            <h1 id="orion-title">
              Você ganhou um ímã.
              <span>Mas o que ele celebra é bem maior.</span>
            </h1>
            <p className={styles.lead}>
              Parabéns por apoiar uma artista local independente. Ao escolher a Orion Tattoo, você valoriza
              trabalho autoral, fortalece a cena criativa da sua cidade e ajuda a manter viva a liberdade de
              transformar ideias em arte na pele.
            </p>
            <div className={styles.heroMeta} aria-label="Campanha Orion Tattoo">
              <strong>Orion Tattoo</strong>
              <span>Laura · artista independente</span>
            </div>
          </div>

          <div className={styles.studioPoster} aria-label="Orion Tattoo — arte, pele e liberdade">
            <div className={styles.posterRibbons} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Sparkles className={styles.posterStarOne} size={42} strokeWidth={1.6} aria-hidden="true" />
            <Sparkles className={styles.posterStarTwo} size={28} strokeWidth={1.6} aria-hidden="true" />
            <div className={styles.posterContent}>
              <p>arte na pele</p>
              <div className={styles.posterWordmark} aria-hidden="true">
                <strong>ORION</strong>
                <strong>TATTOO</strong>
              </div>
              <span>ARTE · PELE · LIBERDADE</span>
            </div>
          </div>
        </section>

        <section className={styles.supportSection} aria-labelledby="support-title">
          <div className={`container ${styles.supportInner}`}>
            <div className={styles.supportLead}>
              <h2 id="support-title">Parabéns por escolher arte independente.</h2>
              <p>
                Seu brinde de fim de ano é um pequeno lembrete de uma escolha grande: colocar valor em quem cria,
                estuda, desenha e atende de perto — sem transformar arte em produto genérico.
              </p>
            </div>

            <div className={styles.reasons}>
              <article>
                <h3>Arte que vira parte de alguém</h3>
                <p>
                  Uma tattoo não termina no desenho. Ela encontra uma história, ocupa a pele e passa a caminhar
                  junto com quem escolheu carregá-la.
                </p>
              </article>
              <article>
                <h3>Liberdade para continuar criando</h3>
                <p>
                  Apoiar trabalho independente dá espaço para pesquisa, repertório, técnica e novas ideias
                  continuarem existindo fora do óbvio.
                </p>
              </article>
              <article>
                <h3>Uma cena local mais viva</h3>
                <p>
                  Quando artistas da sua cidade encontram público, o talento permanece por perto, cria conexões
                  e faz a cultura local circular.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={`container ${styles.lauraSection}`} aria-labelledby="laura-title">
          <div className={styles.lauraName} aria-hidden="true">LAURA</div>
          <div className={styles.lauraCopy}>
            <Sparkles size={30} strokeWidth={1.7} aria-hidden="true" />
            <h2 id="laura-title">Por trás da Orion, existe uma artista.</h2>
            <p>
              Laura transforma referência, conversa e intenção em desenho — e desenho em uma marca que passa a
              fazer parte de outra pessoa. Cada trabalho carrega tempo, escolha estética, técnica e presença.
            </p>
            <p>
              Quando você confia esse processo a uma artista independente, não está apenas contratando uma sessão.
              Está dizendo que trabalho autoral importa — e que liberdade criativa também merece espaço.
            </p>
          </div>
        </section>

        <section className={styles.closingSection} aria-labelledby="closing-title">
          <div className={`container ${styles.closingInner}`}>
            <h2 id="closing-title">A arte não termina quando a sessão acaba.</h2>
            <p>
              Ela continua na pele, na memória e no espaço que a gente abre para artistas independentes seguirem
              criando. Que este ímã te lembre disso toda vez que passar por ele.
            </p>
            <div className={styles.closingFooter}>
              <div>
                <strong>Obrigada por fazer parte dessa história.</strong>
                <span>Orion Tattoo × Vektua XYZ</span>
              </div>
              <Link className={styles.vektuaLink} href="/">
                Conhecer a Vektua XYZ
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BrandFooter />
    </>
  );
}
