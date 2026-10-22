import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Headphones, Music2, HandMetal } from 'lucide-react';
import RockStage from './rock-stage';
import ThankYouMessage from './thank-you-message';
import CampaignMotion from './campaign-motion';
import ResponsiveImage from '@/components/responsive-image';
import styles from './algodao-pesado.module.css';

const INSTAGRAM = 'https://www.instagram.com/algodaopesado.oficial/';

export const metadata: Metadata = {
  title: { absolute: 'Essa vai pra você! | Algodão Pesado × Vektua XYZ' },
  description: 'Uma homenagem do Diego e da Algodão Pesado para os amigos e apoiadores que fazem parte dessa história.',
  openGraph: {
    title: 'Essa vai pra você! | Algodão Pesado',
    description: 'Hoje você está no palco, e a Algodão Pesado ergue as mãos em sua homenagem. Valeu por estar junto!',
    type: 'website',
    url: 'https://vektua.xyz/congrats/algodao-pesado',
  },
  alternates: { canonical: 'https://vektua.xyz/congrats/algodao-pesado' },
};

function Bolt({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 68 128" fill="currentColor" aria-hidden="true"><path d="M44 0 2 69h28l-11 59 47-77H38z" /></svg>;
}

function SocialLink({ label = 'COLA COM A GENTE NO INSTAGRAM' }: { label?: string }) {
  return <a data-ap-reveal="action" data-ap-delay="2" className={styles.socialButton} href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram da Algodão Pesado em uma nova guia">
    <span>{label}</span><ArrowUpRight aria-hidden="true" size={20} />
  </a>;
}

export default function AlgodaoPesadoCongratsPage() {
  return <div className={styles.world} id="algodao-pesado">
    <CampaignMotion />
    <a className={styles.skipLink} href="#recado">Pular para o recado</a>
    <header className={styles.header}>
      <Link href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> <span>VEKTUA XYZ</span></Link>
      <a className={styles.brand} href="#inicio" aria-label="Algodão Pesado Rockwear, voltar ao início da campanha"><ResponsiveImage className={styles.officialLogo} src="/images/campaigns/algodao-pesado/algodao-pesado-rockwear-logo.svg" alt="Algodão Pesado Rockwear" width={1774} height={887} loading="eager" /></a>
      <a className={styles.headerSocial} href={INSTAGRAM} target="_blank" rel="noopener noreferrer">INSTAGRAM <ArrowUpRight size={16} aria-hidden="true" /></a>
    </header>
    <main id="inicio">
      <RockStage>
        <div className={styles.stageVisual} aria-hidden="true">
          <div className={styles.beamLeft}/><div className={styles.beamRight}/>
          <div className={styles.speakerLeft}><i/><i/><i/></div><div className={styles.speakerRight}><i/><i/><i/></div>
          <div className={styles.stageHalo}/>
          <div className={styles.crowdSilhouette}>
            <div className={styles.crowdLights} />
            <HandMetal className={styles.hornsLeft} aria-hidden="true" strokeWidth={1.5} />
            <HandMetal className={styles.hornsCenter} aria-hidden="true" strokeWidth={1.5} />
            <HandMetal className={styles.hornsRight} aria-hidden="true" strokeWidth={1.5} />
          </div>
          <div className={styles.stageGround}/><div className={styles.stageNoise}/>
        </div>
        <div className={styles.stageLines} aria-hidden="true">
          <div data-ap-chapter="0" className={styles.chapter}><span>EI, VOCÊ AÍ!</span><strong>HOJE O PALCO<br/>É <em>TODO SEU.</em></strong></div>
          <div data-ap-chapter="1" className={styles.chapter}><span>O ÚLTIMO ACORDE ECOA</span><strong>E A PLATEIA<br/><em>SE LEVANTA.</em></strong></div>
          <div data-ap-chapter="2" className={styles.chapter}><span>ALGODÃO PESADO ROCKWEAR</span><strong>AS MÃOS SE ERGUEM<br/><em>POR VOCÊ.</em></strong></div>
          <div data-ap-chapter="3" className={styles.chapter}><span>DO DIEGO E DA ALGODÃO PESADO</span><strong>ESSA VAI<br/><em>PRA VOCÊ! 🤘</em></strong></div>
        </div>
        <div className={styles.heroBorder} aria-hidden="true"/>
        <div className={styles.heroBottom}><span>UMA EXPERIÊNCIA ALGODÃO PESADO × VEKTUA XYZ</span><nav className={styles.heroNav} aria-label="Atalhos da homenagem"><a href="#recado">CONTINUE A DESCIDA <ArrowDown size={17} aria-hidden="true"/></a><a href="#video-agradecimento">OUÇA O RECADO <ArrowDown size={17} aria-hidden="true"/></a></nav></div>
      </RockStage>

      <section className={styles.letter} id="recado" aria-labelledby="recado-title">
        <div className={styles.letterNumber} data-ap-reveal="label">01 / O RECADO</div>
        <div className={styles.letterCopy}>
          <p className={styles.tag} data-ap-reveal="label" data-ap-delay="1">EI, VOCÊ AÍ! <Bolt /></p>
          <h1 id="recado-title" data-ap-reveal="headline" data-ap-delay="1">ESSA VAI <span>PRA VOCÊ!</span></h1>
          <div className={styles.letterProse} data-ap-reveal="copy" data-ap-delay="2">
            <p>Sabe quando uma banda termina aquela música que arrepia e a plateia inteira levanta as mãos em reverência?</p>
            <p>Hoje quem está no palco é você. E quem ergue as mãos é a <strong>Algodão Pesado</strong>.</p>
            <p>O Diego escolheu esse chaveiro como um jeito de agradecer sua amizade, seu apoio e sua presença nessa história. Pequeno no tamanho, gigante no significado.</p>
            <p><strong>Valeu por fortalecer o rock com a gente!</strong> 🤘</p>
          </div>
          <p className={styles.signature} data-ap-reveal="sign" data-ap-delay="3">NÓS É DO BREJO, MAS NÓS É ROCK'N'ROLL!</p>
        </div>
        <div className={styles.letterArt} data-ap-reveal="stamp" data-ap-delay="2" aria-hidden="true"><span>100%</span><strong>ROCK<br/>N' ROLL</strong><Bolt/></div>
      </section>

      <section className={styles.manifesto} data-ap-spotlight="manifesto" aria-labelledby="manifesto-title">
        <div className={styles.manifestoTop} data-ap-reveal="label"><span>02 / O CÓDIGO</span><Music2 size={25} aria-hidden="true"/></div>
        <h2 id="manifesto-title" data-ap-reveal="headline" data-ap-delay="1">O SOM É PESADO.<br/><em>A ATITUDE TAMBÉM.</em></h2>
        <div className={styles.rule} data-ap-reveal="rule" data-ap-delay="1" aria-hidden="true"/>
        <div className={styles.manifestoGrid}>
          <p data-ap-reveal="copy" data-ap-delay="2">Do metal ao grunge, do clássico ao som pesado: toda história precisa de gente que vibra junto. Hoje, os aplausos são nossos, mas são pra você.</p>
          <div data-ap-reveal="copy" data-ap-delay="3"><Headphones aria-hidden="true" size={28}/><strong>AUMENTA O VOLUME.</strong><span>Amizade e apoio são o que mantêm o som vivo mesmo depois do último acorde.</span></div>
        </div>
      </section>

      <section className={styles.videoMessageSection} data-ap-spotlight="video" id="video-agradecimento" aria-labelledby="video-message-title">
        <div className={styles.videoMessageHeading}>
          <span data-ap-reveal="label">03 / A VOZ DA ALGODÃO PESADO</span>
          <h2 id="video-message-title" data-ap-reveal="headline" data-ap-delay="1">UM RECADO<br/><em>DE CORAÇÃO.</em></h2>
          <p data-ap-reveal="copy" data-ap-delay="2">Para fechar esse show do jeito certo, um agradecimento especial em nome do Diego e da Algodão Pesado.</p>
        </div>
        <div className={styles.motionMediaFrame} data-ap-reveal="media" data-ap-delay="1"><ThankYouMessage /></div>
      </section>

      <section className={styles.final} data-ap-spotlight="final" aria-labelledby="final-title">
        <div className={styles.finalLightning}><Bolt/><Bolt/><Bolt/></div>
        <span data-ap-reveal="label">04 / O ROCK CONTINUA</span>
        <h2 id="final-title" data-ap-reveal="headline" data-ap-delay="1">NOSSA REVERÊNCIA<br/><em>É PRA VOCÊ.</em></h2>
        <p data-ap-reveal="copy" data-ap-delay="2">O show continua, os amigos permanecem. Cola com a Algodão Pesado no Instagram e segue fortalecendo essa história.</p>
        <SocialLink/>
        <small>@algodaopesado.oficial • O perfil abre em outra guia.</small>
      </section>
    </main>
    <footer className={styles.footer}>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={styles.footerClient} data-ap-reveal="logo" aria-label="Algodão Pesado Rockwear, visitar Instagram em nova guia"><ResponsiveImage className={styles.footerLogo} src="/images/campaigns/algodao-pesado/algodao-pesado-rockwear-logo.svg" alt="Algodão Pesado Rockwear" width={1774} height={887} loading="lazy" /></a>
      <span>CHAVEIRO COM ATITUDE. FEITO POR <Link href="/">VEKTUA XYZ <ArrowRight aria-hidden="true" size={15}/></Link></span>
    </footer>
  </div>;
}
