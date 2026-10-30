import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  Globe2,
  Camera,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { clientLinkPages, getClientLinkPage } from '@/lib/client-link-pages';
import type { ClientLinkKind } from '@/lib/client-link-pages';
import styles from './links.module.css';

type Props = { params: Promise<{ slug: string }> };

const icons = {
  instagram: Camera,
  whatsapp: MessageCircle,
  website: Globe2,
  location: MapPin,
  review: Star,
  other: ArrowUpRight,
} satisfies Record<ClientLinkKind, typeof Camera>;

export function generateStaticParams() {
  return Object.keys(clientLinkPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientLinkPage(slug);
  if (!client) return { title: 'Página não encontrada', robots: { index: false, follow: false } };
  return {
    title: { absolute: `${client.name} | Links & novidades` },
    description: `Encontre os canais da ${client.name}. Uma experiência digital realizada em parceria com a Vektua XYZ.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${client.name} | Todos os links`,
      description: client.intro,
      type: 'website',
    },
  };
}

export default async function ClientLinksPage({ params }: Props) {
  const { slug } = await params;
  const client = getClientLinkPage(slug);
  if (!client) notFound();

  const palette = {
    '--client-blue': client.palette.blue,
    '--client-yellow': client.palette.yellow,
    '--client-white': client.palette.white,
  } as CSSProperties;

  return (
    <div className={styles.page} style={palette}>
      <a className={styles.skipLink} href="#links">Ir para os links</a>
      <div className={styles.decorOne} aria-hidden="true" />
      <div className={styles.decorTwo} aria-hidden="true" />

      <main className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.topline}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span>ENCONTRE A GENTE · {client.name.toUpperCase()}</span>
            <Sparkles size={15} aria-hidden="true" />
          </div>

          <div className={styles.logoPanel}>
            <Image
              src={client.artwork.src}
              alt={client.artwork.alt}
              width={client.artwork.width}
              height={client.artwork.height}
              className={styles.artwork}
              priority
              unoptimized
            />
          </div>

          <p className={styles.category}>{client.category}</p>
          <h1>{client.headline}</h1>
          <p className={styles.intro}>{client.intro}</p>
        </header>

        <section id="links" className={styles.linksSection} aria-labelledby="links-title">
          <div className={styles.sectionLabel}>
            <span className={styles.spark} aria-hidden="true">✳</span>
            <h2 id="links-title">Vamos nos conectar?</h2>
          </div>
          <nav className={styles.linkList} aria-label={`Links da ${client.name}`}>
            {client.links.map((item) => {
              const Icon = icons[item.kind];
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.clientLink}
                  aria-label={`${item.label} — abre em nova aba`}
                >
                  <span className={styles.linkIcon}><Icon size={25} strokeWidth={2} aria-hidden="true" /></span>
                  <span className={styles.linkCopy}>
                    <strong>{item.label}</strong>
                    {item.description && <small>{item.description}</small>}
                  </span>
                  <ArrowUpRight className={styles.externalIcon} size={22} aria-hidden="true" />
                </a>
              );
            })}
          </nav>
          
        </section>

        <section className={styles.maker} aria-label="Sobre quem criou esta experiência">
          <div className={styles.makerBadge}>
            <ShoppingBag size={20} aria-hidden="true" />
            <span>EXPERIÊNCIAS QUE CONECTAM</span>
          </div>
          <p className={styles.makerTitle}>Um encontro entre o físico e o digital, criado pela <strong>Vektua XYZ.</strong></p>
          <p className={styles.makerBody}>Criamos experiências para aproximar marcas e pessoas, com criatividade e personalidade.</p>
          <div className={styles.makerLinks}>
            <Link href="/">Conheça a Vektua XYZ <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href="/contato">Quero uma experiência para minha marca <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{client.name} <span aria-hidden="true">✳</span> Vektua XYZ</span>
          <Link href="/" aria-label="Visitar site Vektua XYZ">vektua.xyz</Link>
        </footer>
      </main>
    </div>
  );
}
