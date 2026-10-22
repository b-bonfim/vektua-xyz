import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Headphones, Music2 } from 'lucide-react';
import RockStage from './rock-stage';
import styles from './algodao-pesado.module.css';

const INSTAGRAM = 'https://www.instagram.com/algodaopesado.oficial/';

export const metadata: Metadata = {
  title: { absolute: 'Você entrou pro backstage! | Algodão Pesado × Vektua XYZ' },
  description: 'Seu chaveiro chegou com atitude! Uma mensagem da Algodão Pesado Rockwear para quem carrega o rock no peito e agora no bolso.',
  openGraph: {
    title: 'Você entrou pro backstage do rock! | Algodão Pesado',
    description: 'Valeu por fortalecer o rock! Essa surpresa é sua. Conheça o universo da Algodão Pesado Rockwear.',
    type: 'website',
    url: 'https://vektua.xyz/congrats/algodao-pesado',
  },
  alternates: { canonical: 'https://vektua.xyz/congrats/algodao-pesado' },
};

function Bolt({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 68 128" fill="currentColor" aria-hidden="true"><path d="M44 0 2 69h28l-11 59 47-77H38z" /></svg>;
}

/** Decorative reinterpretation for the video-pending fallback. Replace with approved master art on delivery. */
function CottonStageMascot() {
  return <svg className={styles.mascot} viewBox="0 0 450 530" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="cottonShade" cx="0" cy="0" r="1" gradientTransform="translate(161 126) rotate(57) scale(270 222)" gradientUnits="userSpaceOnUse"><stop stopColor="#FFF7E6" /><stop offset=".63" stopColor="#EEE0C8" /><stop offset="1" stopColor="#B9A88B" /></radialGradient>
      <linearGradient id="boot" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#232428" /><stop offset="1" stopColor="#050505" /></linearGradient>
    </defs>
    <g stroke="#503018" strokeWidth="15" strokeLinecap="round"><path d="M165 363 115 450M287 363 340 450"/><path d="M106 288 47 245 32 211M336 289 396 252 415 206" /></g>
    <g fill="url(#boot)" stroke="#C2B8A6" strokeWidth="7"><path d="M72 425h79l17 54q-6 19-42 19H49q-13-4-11-19l14-34q6-20 20-20Z"/><path d="M313 425h77l24 54q3 19-38 19h-84q-11-3-8-19l11-35q7-19 18-19Z"/></g>
    <g fill="#FFF3D7"><path d="M45 467h121v17H40z"/><path d="M286 467h124v17H282z"/></g>
    <g stroke="#EEE8DA" strokeWidth="5" strokeLinecap="round"><path d="m70 451 58 9m-49-20 51 11m187 0 61 9m-53-18 50 8"/></g>
    <g fill="url(#cottonShade)" stroke="#AFA087" strokeWidth="4">
      <circle cx="222" cy="263" r="130"/><circle cx="116" cy="237" r="85"/><circle cx="132" cy="151" r="82"/><circle cx="227" cy="122" r="86"/><circle cx="314" cy="160" r="77"/><circle cx="343" cy="243" r="79"/><circle cx="294" cy="328" r="75"/><circle cx="188" cy="335" r="77"/>
    </g>
    <g stroke="#111315" strokeWidth="27" strokeLinecap="round"><path d="M111 126Q226-3 343 126"/><path d="M100 134v90M351 134v90"/></g>
    <g fill="#101112" stroke="#434343" strokeWidth="6"><rect x="78" y="133" width="42" height="106" rx="19"/><rect x="332" y="133" width="42" height="106" rx="19"/></g>
    <g fill="#0B0C0E" stroke="#26272A" strokeWidth="8"><path d="M115 208q55-23 109-1l-13 60q-50 38-85-4Z"/><path d="M232 206q55-20 103 3l-17 56q-45 34-84 0Z"/></g>
    <path d="m212 219 22 0" stroke="#111" strokeWidth="13"/>
    <path d="M179 287q43 31 86-1" stroke="#312318" strokeWidth="8" strokeLinecap="round"/>
    <g stroke="#6D3C1E" strokeWidth="12" strokeLinecap="round"><path d="M31 210V159M31 159l-13-13m13 13 17-19M412 207v-50m0 0-14-16m14 16 14-13"/></g>
    <g stroke="#E2BF87" strokeWidth="4" strokeLinecap="round" opacity=".65"><path d="M118 115 142 87m155 16 20 19M89 277l23 26m221-21-18 29"/></g>
  </svg>;
}

function SocialLink({ label = 'COLA COM A GENTE NO INSTAGRAM' }: { label?: string }) {
  return <a className={styles.socialButton} href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram da Algodão Pesado em uma nova guia">
    <span>{label}</span><ArrowUpRight aria-hidden="true" size={20} />
  </a>;
}

export default function AlgodaoPesadoCongratsPage() {
  return <div className={styles.world} id="algodao-pesado">
    <a className={styles.skipLink} href="#recado">Pular para o recado</a>
    <header className={styles.header}>
      <Link href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> <span>VEKTUA XYZ</span></Link>
      <a className={styles.brand} href="#inicio" aria-label="Algodão Pesado Rockwear, início da campanha"><span>ALGODÃO</span><strong>PESADO<Bolt /></strong><small>ROCKWEAR</small></a>
      <a className={styles.headerSocial} href={INSTAGRAM} target="_blank" rel="noopener noreferrer">INSTAGRAM <ArrowUpRight size={16} aria-hidden="true" /></a>
    </header>
    <main id="inicio">
      <RockStage>
        <div className={styles.stageVisual} aria-hidden="true">
          <div className={styles.beamLeft}/><div className={styles.beamRight}/>
          <div className={styles.speakerLeft}><i/><i/><i/></div><div className={styles.speakerRight}><i/><i/><i/></div>
          <div className={styles.stageHalo}/><CottonStageMascot/>
          <div className={styles.stageGround}/><div className={styles.stageNoise}/>
        </div>
        <div className={styles.stageLines} aria-hidden="true">
          <div data-ap-chapter="0" className={styles.chapter}><span>ATENÇÃO, ROCKEIRO!</span><strong>VOCÊ ACABA DE<br/>ENTRAR PRO <em>BACKSTAGE!</em></strong></div>
          <div data-ap-chapter="1" className={styles.chapter}><span>SE LIGA NESSA!</span><strong>ESSE CHAVEIRO<br/>TEM <em>ATITUDE.</em></strong></div>
          <div data-ap-chapter="2" className={styles.chapter}><span>ALGODÃO PESADO ROCKWEAR</span><strong>O ROCK VAI<br/><em>COM VOCÊ.</em></strong></div>
          <div data-ap-chapter="3" className={styles.chapter}><span>VALEU!</span><strong>VOCÊ FAZ PARTE<br/>DA <em>NOSSA TURMA.</em></strong></div>
        </div>
        <div className={styles.heroBorder} aria-hidden="true"/>
        <div className={styles.heroBottom}><span>UMA EXPERIÊNCIA ALGODÃO PESADO × VEKTUA XYZ</span><a href="#recado">CONTINUE A DESCIDA <ArrowDown size={17} aria-hidden="true"/></a></div>
      </RockStage>

      <section className={styles.letter} id="recado" aria-labelledby="recado-title">
        <div className={styles.letterNumber}>01 / O RECADO</div>
        <div className={styles.letterCopy}>
          <p className={styles.tag}>EI, VOCÊ AÍ! <Bolt /></p>
          <h1 id="recado-title">PARABÉNS, <span>ROCKEIRO!</span></h1>
          <p>Aí sim! Se esse chaveiro chegou até você, tem motivo pra comemorar.</p>
          <p>Na <strong>Algodão Pesado</strong>, o rock não fica só na playlist. É atitude, é estilo, é aquela camiseta que vai junto pro show, pro rolê e pra vida.</p>
          <p>Agora você tem mais um pedacinho desse universo pra carregar por aí. <strong>Valeu por fortalecer o rock!</strong> 🤘</p>
          <p className={styles.signature}>NÓS É DO BREJO, MAS NÓS É ROCK'N'ROLL!</p>
        </div>
        <div className={styles.letterArt} aria-hidden="true"><span>100%</span><strong>ROCK<br/>N' ROLL</strong><Bolt/></div>
      </section>

      <section className={styles.manifesto} aria-labelledby="manifesto-title">
        <div className={styles.manifestoTop}><span>02 / O CÓDIGO</span><Music2 size={25} aria-hidden="true"/></div>
        <h2 id="manifesto-title">O SOM É PESADO.<br/><em>A ATITUDE TAMBÉM.</em></h2>
        <div className={styles.rule}/>
        <div className={styles.manifestoGrid}>
          <p>Não importa se você é do metal, do grunge ou do bom e velho rock'n'roll. Se a música fala mais alto, esse backstage também é seu.</p>
          <div><Headphones aria-hidden="true" size={28}/><strong>AUMENTA O VOLUME.</strong><span>Uma turma unida pela paixão pelo rock e pela liberdade de vestir o que curte.</span></div>
        </div>
      </section>

      <section className={styles.final} aria-labelledby="final-title">
        <div className={styles.finalLightning}><Bolt/><Bolt/><Bolt/></div>
        <span>03 / PRÓXIMO SHOW</span>
        <h2 id="final-title">O BACKSTAGE ACABOU.<br/><em>O ROCK CONTINUA.</em></h2>
        <p>Quer acompanhar as novidades, camisetas e o que rola na Algodão Pesado? Cola com a gente no Instagram. O próximo riff começa por lá.</p>
        <SocialLink/>
        <small>@algodaopesado.oficial • O perfil abre em outra guia.</small>
      </section>
    </main>
    <footer className={styles.footer}>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={styles.footerClient}>ALGODÃO PESADO <span>ROCKWEAR</span></a>
      <span>CHAVEIRO COM ATITUDE. FEITO POR <Link href="/">VEKTUA XYZ <ArrowRight aria-hidden="true" size={15}/></Link></span>
    </footer>
  </div>;
}
