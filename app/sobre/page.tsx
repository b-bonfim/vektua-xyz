import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandHeader, BrandFooter } from '@/components/brand-shell-v2';
import ResponsiveImage from '@/components/responsive-image';
import SobreScroll from './sobre-scroll';
import './sobre.css';

export const metadata: Metadata = {
  title: 'Sobre | Por que a Vektua XYZ existe',
  description: 'Objetos com personalidade. Conheça a razão de existir da Vektua XYZ: transformar ideias, ocasiões, gostos e histórias em algo tangível.',
  openGraph: { title: 'Vektua XYZ | Objetos com personalidade', description: 'Do achado à peça só sua. Uma marca onde as ideias ganham forma.' },
};

const lines = [
  {verb:'Escolher', name:'Objetos & Colecionáveis', desc:'Peças que despertam o olhar pelo design e pela presença.', href:'/objetos-colecionaveis'},
  {verb:'Celebrar', name:'Datas & Coleções', desc:'Objetos que se conectam com temas, datas e ocasiões.', href:'/datas-colecoes'},
  {verb:'Personalizar', name:'Feitos para Você', desc:'Suas referências e histórias ganhando uma forma particular.', href:'/feitos-para-voce'},
  {verb:'Descobrir', name:'Chaveiros', desc:'Pequenos achados no contexto certo.', href:'/chaveiros'},
] as const;
const stories = [
  {name:'Blind Rats', description:'Uma identidade que saiu da ideia, passou pela modelagem e encontrou a cena grunge local.', art:'/images/campaigns/blind-rats/blind-rats-hero.webp', link:'/congrats/blind-rats'},
  {name:'A Padoca', description:'A energia de uma micro padaria artesanal traduzida em um objeto para levar consigo.', art:'/images/campaigns/a-padoca/a-padoca-scroll-poster.webp', link:'/congrats/a-padoca'},
  {name:'Algodão Pesado', description:'Um encontro entre cultura rock, comunidade e criação personalizada.', art:'/images/campaigns/algodao-pesado/audience-tribute-poster.jpg', link:'/congrats/algodao-pesado'},
] as const;

export default function SobrePage(){
return <div className="about-page">
  <BrandHeader/>
  <main id="conteudo">
    <SobreScroll/>
    <section className="about-belief" id="manifesto" aria-labelledby="about-belief-heading">
      <div className="about-tag"><span/> O QUE NOS MOVE</div>
      <div className="about-belief-grid">
        <h2 id="about-belief-heading">Não é sobre imprimir qualquer coisa.<br/><em>É sobre dar forma ao que faz sentido.</em></h2>
        <div className="about-belief-copy">
          <p>A Vektua XYZ nasceu de uma convicção: <strong>um objeto pode valer a escolha pelo design, pelo momento, por quem representa ou pelo lugar em que faz sentido.</strong></p>
          <p>Às vezes, é uma peça que chama a atenção. Às vezes, é uma lembrança, um símbolo de pertencimento ou uma ideia que ainda existe só na imaginação. Nosso trabalho é transformar essas possibilidades em algo que se possa ver, tocar e levar para a vida.</p>
          <p>A tecnologia amplia o que podemos criar. Mas são as pessoas, seus gostos, ocasiões e histórias que dão direção ao que fazemos.</p>
        </div>
      </div>
    </section>
    <section className="about-axes" aria-labelledby="about-axes-heading">
      <div className="about-orbit" aria-hidden="true"><div className="about-orbit-ring"><i/><i/><i/></div><b/></div>
      <div className="about-axes-copy">
        <div className="about-tag"><span/> O NOSSO NOME</div>
        <h2 id="about-axes-heading">Do invisível<br/>ao <em>tangível.</em></h2>
        <p>Vektua evoca a transformação de uma ideia em objeto. XYZ são os três eixos do espaço — onde a possibilidade encontra dimensão.</p>
        <p>A impressão 3D é o nosso meio, não a nossa definição. O que criamos começa antes da máquina e continua depois dela.</p>
      </div>
    </section>
    <section className="about-lines" aria-labelledby="about-lines-heading">
      <div className="about-tag"><span/> QUATRO CAMINHOS, UMA MARCA</div>
      <h2 id="about-lines-heading">Existem diferentes razões para uma peça ser <em>sua.</em></h2>
      <div className="about-lines-list">{lines.map((line,i)=><Link href={line.href} className="about-line" key={line.verb}>
        <span className="about-line-number">{String(i+1).padStart(2,'0')}</span>
        <div><strong>{line.verb}</strong><small>{line.name}</small></div><p>{line.desc}</p><ArrowUpRight aria-hidden="true" size={25}/>
      </Link>)}</div>
    </section>
    <section className="about-stories" aria-labelledby="about-stories-heading">
      <div className="about-stories-intro">
        <div><div className="about-tag"><span/> O QUE GANHA FORMA</div><h2 id="about-stories-heading">Histórias que se tornam <em>tangíveis.</em></h2></div>
        <p>Não existe um único jeito de ter personalidade. Cada criação pede escuta, repertório e uma linguagem própria. É nesse encontro que gostamos de trabalhar.</p>
      </div>
      <div className="about-story-grid">{stories.map((story,i)=><Link href={story.link} className="about-story" key={story.name}>
        <div className="about-story-photo"><ResponsiveImage src={story.art} alt={`Arte de campanha do projeto ${story.name}; imagem ilustrativa, não foto de produto`} width={800} height={900} loading="lazy" decoding="async" fetchPriority="low"/><small>ARTE DE CAMPANHA · NÃO É FOTO DE PRODUTO</small></div>
        <div className="about-story-meta"><span>{String(i+1).padStart(2,'0')} / projeto</span><ArrowUpRight size={18} aria-hidden="true"/></div><h3>{story.name}</h3><p>{story.description}</p>
      </Link>)}</div>
    </section>
    <section className="about-closing" aria-labelledby="about-close-heading">
      <span className="about-closing-marker">XYZ</span>
      <h2 id="about-close-heading">Um universo de ideias.<br/><em>Objetos com personalidade.</em></h2>
      <p>Do achado à peça só sua.</p>
      <Link className="about-closing-link" href="/busca">Descubra o universo Vektua <ArrowUpRight aria-hidden="true" size={18}/></Link>
    </section>
  </main>
  <BrandFooter/>
</div>;
}
